import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [SellerDashboardComponent, AddProductComponent, EditProductComponent, ViewProductComponent],
  imports: [
    CommonModule,
    HttpClientModule,ToastrModule.forRoot(),FormsModule,MaterialModule,
    RouterModule.forChild([
      { path: 'seller-dashboard', component: SellerDashboardComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'view-product/:id', component: ViewProductComponent },
      { path: 'edit-product/:id',component: EditProductComponent },
    ]),
    BrowserAnimationsModule
  ]
})
export class SellerModule { }
