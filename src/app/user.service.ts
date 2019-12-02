import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  adminLogin(data) {
    return this.http.post(`${this.baseUrl}/users/admin/login`, data);
  }

  sellerLogin(data) {
    return this.http.post(`${this.baseUrl}/users/seller/login`, data);
  }
  
  
  

  private baseUrl = 'http://localhost:8080/api/v1';
  constructor(public http: HttpClient, private cookieService: CookieService) { }

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

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

    return this.http.post(`${this.baseUrl}/api/v1/users/logout`, params);
  } // end logout function

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
}
