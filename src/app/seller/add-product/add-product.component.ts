import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../../product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [Location]
})
export class AddProductComponent implements OnInit {

  private prodCode;
  private prodName;

  private shortDes;
  private longDesc;

  private prodLength
  private prodBreadth;
  private prodHeight;

  private MRP;
  private SSP;
  private YMP;

  private category;
  categories = ['Footwear', 'Clothing', 'Electronics', 'Beauty']

  primaryImage = null
  validPrimaryImage: boolean = false;

  otherImages = []
  validOtherImages: boolean = false;

  private prodColor;
  private prodWeight;
  private prodBrand;

  validUserGuide: boolean = false;
  userGuide: any;
  userName: string;
  authToken: string;
  userId: string;

  constructor(public productService: ProductService, public location: Location, public toastrService: ToastrService,private spinner:NgxSpinnerService,
    public router: Router, public cookieService: CookieService) { }

  ngOnInit() {
    this.checkStatus();
    this.userName = this.cookieService.get('userName');
    this.authToken = this.cookieService.get('authToken');
    this.userId=this.cookieService.get("userId")
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


  onPrimaryImagePicked = (event: Event) => {
    let file = (event.target as HTMLInputElement).files[0];

    if (file.name.indexOf(".jpeg") < 0 &&  file.name.indexOf(".jfif")<0 && file.name.indexOf(".png") < 0 && file.name.indexOf(".jpg") < 0) {
      this.toastrService.warning("Please select only jpeg or jfif or jpg or png image.")
      this.validPrimaryImage = false;
    }
    else {
      this.primaryImage = file;
      this.validPrimaryImage = true;
    }
  }

  onuserGuidePicked = (event: Event) => {

    let file = (event.target as HTMLInputElement).files[0];

    if (file.name.indexOf(".pdf") < 0  && file.name.indexOf(".txt") < 0 && file.name.indexOf(".doc") < 0) {
      this.toastrService.warning("Please select only pdf or txt or doc image.")
      this.validUserGuide = false;
    }
    else {
      this.userGuide = file;
      this.validUserGuide = true;
    }
  }

  onOtherImagesPicked = (event: Event) => {
    for (let file of event.target['files']) {
      if (file.name.indexOf(".jpeg") < 0 && file.name.indexOf(".jfif")<0 && file.name.indexOf(".png") < 0 && file.name.indexOf(".jpg") < 0) {
        this.toastrService.warning("Please select only jpeg or jpg or png or jfif image.")
        this.validOtherImages = false;
        this.otherImages = []
        break;
      }
      else {
        this.otherImages.push(file)
        this.validOtherImages = true;
      }
    }
  }

  addProduct() {
    if (!this.prodCode || this.prodCode.trim().length == 0) {
      this.toastrService.warning("Enter product code!")
    }
    else if (!this.prodName || this.prodName.trim().length == 0) {
      this.toastrService.warning("Enter product name!")
    }
    else if (!this.shortDes || this.shortDes.trim().length == 0) {
      this.toastrService.warning("Enter short description!")
    }
    else if (!this.category) {
      this.toastrService.warning("Select a category!")
    }
    else if (!this.MRP) {
      this.toastrService.warning("Enter MRP!")
    }
    else if (!this.SSP) {
      this.toastrService.warning("Enter SSP!")
    }
    else if (!this.YMP) {
      this.toastrService.warning("Enter YMP!")
    }

    else if (!this.validPrimaryImage) {
      this.toastrService.warning("Select a valid primary image.")
    }
    else if (!this.validOtherImages) {
      this.toastrService.warning("Select valid other product-images.")
    }
    else if (!this.validUserGuide) {
      this.toastrService.warning("Select a valid user Guide.")
    }
    else {
      this.spinner.show();
      const productData = new FormData();
      productData.append("prodCode", this.prodCode);
      productData.append("prodName", this.prodName);
      productData.append("shortDes", this.shortDes);
      if (this.longDesc)
        productData.append("longDesc", this.longDesc)
      if (this.prodLength)
        productData.append("prodLength", this.prodLength)
      if (this.prodBreadth)
        productData.append("prodBreadth", this.prodBreadth)
      if (this.prodHeight)
        productData.append("prodHeight", this.prodHeight)
      if (this.prodColor)
        productData.append("prodColor", this.prodColor)
      if (this.prodWeight)
        productData.append("prodWeight", this.prodWeight)
      if (this.prodBrand)
        productData.append("prodBrand", this.prodBrand)
      productData.append("category", this.category)
      productData.append("sellerId", this.userId)
      productData.append("mrp", this.MRP)
      productData.append("ssp", this.SSP)
      productData.append("ymp", this.YMP)
      productData.append("primaryImage", this.primaryImage, this.primaryImage['name']);
      for (let file of this.otherImages)
        productData.append(file['name'], file, file['name']);

      productData.append(this.userGuide['name'], this.userGuide, this.userGuide['name']);
      this.productService.addProduct(productData).subscribe((apiResponse) => {
        this.spinner.hide();
        if (apiResponse) {
          this.toastrService.show("Product added successfully.");
          this.viewProduct(apiResponse['prodId'])
        }
        else {
          this.toastrService.error("Some error occured while adding new product.")
        }
      }, (err) => {
        this.spinner.hide();
        this.toastrService.error("Network problem.")
      })
    }
  }

  viewProduct(id) {
    this.router.navigate(['view-product',id])
  }

  public goBackToPreviousPage() {
    this.location.back();
  }

}
