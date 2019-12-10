import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authToken: string;

  constructor(private cookieService:CookieService, private route:Router) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken')
    if (this.authToken == 'admin')
      this.route.navigate(['admin-dashboard'])
    else if (this.authToken == 'seller')
      this.route.navigate(['seller-dashboard'])
  }

}
