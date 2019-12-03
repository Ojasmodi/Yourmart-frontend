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
  providers: [Location]
})
export class ViewProductComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userId: any;
  public userName: any;
  currentProduct = {}
  productId

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
  comment: any;


  constructor(public toastrService: ToastrService, public _route: ActivatedRoute, public location: Location,
    public router: Router, public route: ActivatedRoute, public productService: ProductService,
    private spinner: NgxSpinnerService, public userService: UserService, public cookieService: CookieService) {
  }

  ngOnInit() {
    this.checkStatus();
    this.spinner.show()
    this.userId=this.cookieService.get('userId')
    this.userName = this.cookieService.get('userName');
    this.authToken = this.cookieService.get('authToken');
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
      this.spinner.hide()
      if (apiResponse != null) {
        this.currentProduct = apiResponse;
        this.commentsOfProduct = apiResponse['comments']
        this.originalPdfPath = this.currentProduct['pdfPath']
        this.currentProduct['pdfPath'] = "http://localhost:8080/docs/" + this.currentProduct['pdfPath'].substring(this.currentProduct['pdfPath'].lastIndexOf("\\") + 1)
        this.productImages = this.currentProduct['images'];
        for (let image of this.productImages) {
          image['imagePath'] = "http://localhost:8080/images/" + image['imagePath'].substring(image['imagePath'].lastIndexOf("\\") + 1)
        }
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

  addComment(){
    if(!this.comment || this.comment.trim().length==0)
    this.toastrService.warning("Enter comment value.")
    else{
      let data = {
        commentValue: this.comment,
        commentByUserId: this.userId,
        commentByUserName: this.userName
      }
      this.spinner.show();
      this.productService.addCommentToProduct(data, this.productId).subscribe((response) => {
        this.spinner.hide()
        if (response ) {
          this.toastrService.success("Comment added successfully.")
          this.getCurrentProduct()
        }
        else
          this.toastrService.error("Failed to update status.")
      },
        err => {
          this.spinner.hide()
          this.toastrService.error("Some error occured.")
        })
    }
  }

  public goBackToPreviousPage() {
    this.location.back();
  }

}
