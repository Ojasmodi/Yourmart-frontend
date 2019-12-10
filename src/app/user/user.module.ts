import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [HomeComponent, LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    HttpClientModule,SharedModule,MaterialModule,
    FormsModule,ReactiveFormsModule,NgxSpinnerModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'signup', component: SignupComponent , pathMatch: 'full'},
    ]),
    BrowserAnimationsModule
  ]
})
export class UserModule { }
