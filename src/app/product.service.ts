import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  addCommentToProduct(data: { commentValue: any; commentByUserId: any; commentByUserName: any; },prodId) {
    return this.http.post(`${this.baseUrl}/comment/add/${prodId}`, data);
  }
  
  

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(public http: HttpClient, private cookieService: CookieService) { }

  addProduct(productData: FormData):any {
    return this.http.post(`${this.baseUrl}/product/add`, productData);
  }

  getSingleproduct(productId: any) {
    return this.http.get(`${this.baseUrl}/product/get/productId/${productId}`);
  }

  addNewImagesOfProduct(productData: FormData,sellerId,prodId) {
    return this.http.post(`${this.baseUrl}/product/add/otherimages/${sellerId}/${prodId}`, productData);
  }
  updateFilesOfProduct(productData: FormData,prodId) {
    return this.http.put(`${this.baseUrl}/product/update/primaryImageOrUserGuide/${prodId}`, productData);
  }

  updateOtherdetailsOfProduct(id,data: { "prodCode": any; "prodName": any; "shortDes": any; "longDesc": any; "prodLength": any; "prodBreadth": any; "prodHeight": any; "prodColor": any; "prodWeight": any; "prodBrand": any; "category": any; "prodId": any; "mrp": any; "ssp": any; "ymp": any; }) {
    return this.http.put(`${this.baseUrl}/product/update/otherdetails/${id}`, data);
  }
  
  updateproduct(productId: any, productData: any) {
    throw new Error("Method not implemented.");
  }

  deleteProduct(productId: any) {
    return null
  }
  getProductsBySellerId(sellerId: any) {
    return this.http.get(`${this.baseUrl}/seller/get/${sellerId}`);
  }

  getSellerBySellerId(sellerId:any){
    return this.getProductsBySellerId(sellerId)
  }

  updateStatusOfProduct(data: any) {
    return this.http.put(`${this.baseUrl}/product/update/status`, data);
  }
  getAllProducts() {
    return this.http.get(`${this.baseUrl}/product/all`);
  }

}
