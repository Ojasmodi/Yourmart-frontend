import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {
 

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(public http: HttpClient) { }

  approveSelectedSellers(selectedSellerId: any) {
    return this.http.put(`${this.baseUrl}/seller/update/status/sellerIds?sellerIds=${selectedSellerId}`, '')
  }

  adminLogin(data) {
    return this.http.post(`${this.baseUrl}/users/admin/login`, data);
  }

  sellerLogin(data) {
    return this.http.post(`${this.baseUrl}/users/seller/login`, data);
  }

  public signupFunction(data): any {
    return this.http.post(`${this.baseUrl}/seller/add`, data);
  }

  public signinFunction(data): any {
    return this.http.post(`${this.baseUrl}/api/v1/users/login`, data);
  }

  updateStatusOfseller(data: { status: any; sellerId: any; }) {
    return this.http.post(`${this.baseUrl}/seller/update/status`,data);
  }

  getAllSellers() {
    return this.http.get(`${this.baseUrl}/seller/all`);
  }

}
