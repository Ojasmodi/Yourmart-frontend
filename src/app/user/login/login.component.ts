import { Component, OnInit } from '@angular/core';
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

  private signUpForm: FormGroup;

  constructor(private route: Router,private spinner:NgxSpinnerService, private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService, private cookieService: CookieService) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      userType: ['admin'],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }


  onSubmit() {

    let data = {
      email: this.f.email.value,
      password: this.f.password.value,
    }
    this.spinner.show()
    if (this.signUpForm.get("userType").value === "admin") {
      this.userService.adminLogin(data).subscribe((response) => {
        this.spinner.hide()
        if (response) {
          this.toastr.info("Login successful.")
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
        if (response) {
          this.spinner.hide()
          this.toastr.info("Login successful.")
          this.cookieService.set('authToken', "seller");
          this.cookieService.set('userName', response['ownerName']);
          this.cookieService.set('userId', response['sellerId']);
          this.route.navigate(['/seller-dashboard']);
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
  }

}
