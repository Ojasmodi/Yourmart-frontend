import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private sellerForm: FormGroup;
  authToken: string;

  constructor(private route: Router, private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService, private cookieService: CookieService) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken')
    if (this.authToken == 'admin')
      this.route.navigate(['admin-dashboard'])
    else if (this.authToken == 'seller')
      this.route.navigate(['seller-dashboard'])
    else {
      this.sellerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        companyName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[a-zA-Z ]+$")]],
        ownerName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[a-zA-Z ]+$")]],
        address: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        GSTnumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern("^[a-zA-Z0-9]+$")]],
        telephone: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
        password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?!.*\\s).{8,}$")]],
        confirmPassword: ['']
      })
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.sellerForm.controls; }


  onSubmit() {

    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.toastr.warning("Password and confirm password doesn't match.")
    }
    else {
      let data = {
        companyName: this.f.companyName.value,
        ownerName: this.f.ownerName.value,
        address: this.f.address.value,
        gstnumber: this.f.GSTnumber.value,
        telephone: this.f.telephone.value,
        password: this.f.password.value,
        email: this.f.email.value
      }
      this.userService.signupFunction(data).subscribe((apiResponse) => {
        if (apiResponse != null) {
          this.toastr.show('Please login to continue.', 'Registration Successful.');
          this.route.navigate(['/login']);
        } else {
          this.toastr.error("Some error occured.")
        }
      }, (err) => {
        this.toastr.error('Some error occured.')
      });
    }

  }

}
