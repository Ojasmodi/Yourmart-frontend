import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
  providers:[Location]
})
export class ViewProductComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userId: any;
  public userName: any;
  currentProduct={}
  productId
  

  private category;
  categories = ['Footwear', 'Clothing', 'Electronics', 'Beauty']

  primaryImage = null
  validPrimaryImage: boolean = false;

  otherImages = []
  validOtherImages: boolean = false;

  originalPdfPath
  validUserGuide: boolean = false;
  userGuide: any;
  productImages: any;
  commentsOfProduct: any;


  constructor( public toastrService: ToastrService, public _route: ActivatedRoute,public location:Location,
    public router: Router,public route: ActivatedRoute,public productService:ProductService,
    private spinner: NgxSpinnerService, public userService: UserService, public cookieService: CookieService) {
  }

  ngOnInit() {
    //this.spinner.show()
    this.userName = this.cookieService.get('userName');
    this.authToken = this.cookieService.get('authToken');
    //this.checkStatus();
    this.productId = this._route.snapshot.paramMap.get('id');
    this.getCurrentProduct()
    
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

 
  getCurrentProduct() {
    this.productService.getSingleproduct(this.productId).subscribe((apiResponse) => {
      //this.spinner.hide()
      if (apiResponse!=null) {
        //console.log(apiResponse);
        this.currentProduct = apiResponse;
        this.commentsOfProduct = apiResponse['comments']
        this.originalPdfPath=this.currentProduct['pdfPath']
        this.currentProduct['pdfPath']="http://localhost:8080/docs/"+this.currentProduct['pdfPath'].substring(this.currentProduct['pdfPath'].lastIndexOf("\\")+1)
        console.log(this.currentProduct)
        this.productImages=this.currentProduct['images'];
        for(let image of this.productImages){
          image['imagePath']="http://localhost:8080/images/"+image['imagePath'].substring(image['imagePath'].lastIndexOf("\\")+1)
        }
      }
      else {
        this.toastrService.error("Some error occured.")
      }
    },
      (err) => {
       // this.spinner.hide()
        this.toastrService.error(err.message);
      }
    );
  }


  // function to logout user
  public logout = () => {
    this.spinner.show();
    this.userService.logout().subscribe((apiResponse) => {
      this.spinner.hide();
      if (apiResponse.status === 200) {
        this.cookieService.delete('authToken');
        this.cookieService.delete('userId');
        this.cookieService.delete('userName');
        this.toastrService.success("Logged out successfully.")
        this.router.navigate(['/']);
      }
      else {
        this.toastrService.error(apiResponse.message);
      }
    },
      (err) => {
        this.spinner.hide();
        this.toastrService.error("Some error occured.");
      })
  }

  public goBackToPreviousPage(){
    this.location.back();
  }



  // viewAllProducts() {
  //   this.router.navigate(['product-dashboard'])
  // }

}
