import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private signUpForm:FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signUpForm=this.formBuilder.group({
      userType:['admin'],
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }

  
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.signUpForm.invalid) {
    //     return;
    // }
    console.log(this.signUpForm.get("email"))

    alert('SUCCESS!! :-)')
}

}
