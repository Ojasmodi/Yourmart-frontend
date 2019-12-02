import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-seller',
  templateUrl: './view-seller.component.html',
  styleUrls: ['./view-seller.component.css'],
  providers:[Location]
})
export class ViewSellerComponent implements OnInit {

  userName: string;
  authToken: string;
  productId: string;
  currentSeller: Object;

  constructor(public toastrService: ToastrService, public _route: ActivatedRoute,public location:Location,
    public router: Router,public route: ActivatedRoute,public productService:ProductService,
    private spinner: NgxSpinnerService, public userService: UserService, public cookieService: CookieService) { }

  ngOnInit() {
     this.spinner.show()
     this.userName = this.cookieService.get('userName');
     this.authToken = this.cookieService.get('authToken');
     this.checkStatus();
     this.productId = this._route.snapshot.paramMap.get('id');
     this.getCurrentSeller()
  }

    // function to check whether user is logged in or not
    public checkStatus = () => {
      if (this.cookieService.get('authToken') === undefined || this.cookieService.get('authToken') === '' ||
        this.cookieService.get('authToken') === null) {
        this.toastrService.error("Please login first.");
        this.router.navigate(['/']);
        return false;
      } else {
        return true
      }
    } // end checkStatus

  getCurrentSeller() {
    this.productService.getSellerBySellerId(this.productId).subscribe((apiResponse) => {
      this.spinner.hide()
      if (apiResponse!=null) {
        this.currentSeller = apiResponse;
      }
      else {
        this.toastrService.error("Some error occured.")
      }
    },
      (err) => {
       this.spinner.hide()
        this.toastrService.error(err.message);
      }
    );
  }

  public goBackToPreviousPage(){
    this.location.back();
  }

}
