import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { HomeComponent } from './user/home/home.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports:[
  BrowserModule,
    HttpClientModule,UserModule, SellerModule,MaterialModule,
    AdminModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: '*', component: HomeComponent },
      { path: '**', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]),
    BrowserAnimationsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
