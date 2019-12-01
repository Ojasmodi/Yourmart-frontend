import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private signUpForm:FormGroup;

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
  
    if(this.signUpForm.get("userType").value==="admin"){

    }
    else{

    }

    
    alert('SUCCESS!! :-)')
}

}
