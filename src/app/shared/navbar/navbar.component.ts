import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  appName:string="YourMart"
  userName: string;

  constructor(public cookieService:CookieService,private toastrService:ToastrService,
    public router:Router) { }

  ngOnInit() {
    this.userName=this.cookieService.get("userName")
  }

  logout(){
    this.cookieService.delete('authToken');
    this.cookieService.delete('userName');
    this.cookieService.delete('userId')
    this.toastrService.success("Logged out successfully.")
    this.router.navigate(['/']);
  }

}
