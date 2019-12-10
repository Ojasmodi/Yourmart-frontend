import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  private signUpForm: FormGroup;
  private siteKey: string = "6LcWwcUUAAAAALt9WDtbjDYsefprOsdphf2IwMCg"
  private secretKey: string = "6LcWwcUUAAAAADfhiowpR5uCZnodwA5GHlVifnrx"
  captchaResponse: any;
  authToken: string;

  constructor(private route: Router, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService, private cookieService: CookieService) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken')
    if (this.authToken == 'admin')
      this.route.navigate(['admin-dashboard'])
    else if (this.authToken == 'seller')
      this.route.navigate(['seller-dashboard'])
    else {
      this.addRecaptchaScript();
      this.signUpForm = this.formBuilder.group({
        userType: ['admin'],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
      })
    }
  }

  renderReCaptch() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': this.siteKey,
      'callback': (response) => {
        this.captchaResponse = response;
      }
    });
  }

  addRecaptchaScript() {

    window['grecaptchaCallback'] = () => {
      this.renderReCaptch();
    }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptch(); return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }


  onSubmit() {
    if (this.captchaResponse) {
      let data = {
        email: this.f.email.value,
        password: this.f.password.value,
      }
      if (this.signUpForm.get("userType").value === "admin") {
        this.spinner.show()
        this.userService.adminLogin(data).subscribe((response) => {
          this.spinner.hide()
          if (response) {
            this.toastr.show("Login successful.")
            this.cookieService.set('authToken', "admin");
            this.cookieService.set('userName', response['username']);
            this.cookieService.set('userId', response['id']);
            this.route.navigate(['/admin-dashboard']);
          }
          else {
            this.toastr.error("Username or password is wrong.")
          }
        },
          err => {
            this.spinner.hide()
            this.toastr.error("Some error occured.")
          })
      }
      else {
        this.spinner.show()
        this.userService.sellerLogin(data).subscribe((response) => {
          this.spinner.hide()
          if (response) {
            if (response['status'] == "NEED_APPROVAL") {
              this.toastr.error("Your status is under approval.")
            }
            else if (response['status'] == "REJECTED") {
              this.toastr.info("Your status has been rejected.")
            }
            else {
              this.toastr.show("Login successful.")
              this.cookieService.set('authToken', "seller");
              this.cookieService.set('userName', response['ownerName']);
              this.cookieService.set('userId', response['sellerId']);
              this.route.navigate(['/seller-dashboard']);
            }

          }
          else {
            this.toastr.error("Email or password is wrong.")
          }
        },

          err => {
            this.spinner.hide()
            this.toastr.error("Some error occured.")
          })
      }
    }
    else {
      this.toastr.warning("Please verify yourself by checking the captcha.")
    }
  }

}
