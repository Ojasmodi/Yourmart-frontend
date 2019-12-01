import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { ViewProductComponent } from '../seller/view-product/view-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewSellerComponent } from './view-seller/view-seller.component';
import { AllProductComponent } from './all-product/all-product.component';
import { AllSellerComponent } from './all-seller/all-seller.component';



@NgModule({
  declarations: [AdminDashboardComponent,AllProductComponent,
    AllSellerComponent,ViewSellerComponent
  ],
  imports: [
    CommonModule,HttpClientModule,ToastrModule.forRoot(),FormsModule,MaterialModule,
    RouterModule.forChild([
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'all-products', component: AllProductComponent },
      { path: 'all-sellers', component: AllSellerComponent },
      { path: 'view-product/:id', component: ViewProductComponent },
      { path: 'view-seller/:id',component: ViewSellerComponent },
    ]),
    BrowserAnimationsModule
  ]
})
export class AdminModule { }
