import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';



@NgModule({
  declarations: [SellerDashboardComponent, AddProductComponent, EditProductComponent, ViewProductComponent],
  imports: [
    CommonModule
  ]
})
export class SellerModule { }
