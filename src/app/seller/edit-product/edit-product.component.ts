import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../user.service';
import { ProductService } from '../../product.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  providers:[Location]
})
export class EditProductComponent implements OnInit {
  

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

  updateOtherdetailsOfProduct(){

    if (!this.currentProduct['prodCode'] || this.currentProduct['prodCode'].trim().length == 0) {
          this.toastrService.warning("Enter product code!")
        }
        else if (!this.currentProduct['prodName'] || this.currentProduct['prodName'].trim().length == 0) {
          this.toastrService.warning("Enter product name!")
        }
        else if (!this.currentProduct['shortDes'] || this.currentProduct['shortDes'].trim().length == 0) {
          this.toastrService.warning("Enter short description!")
        }
        else if (!this.currentProduct['mrp']) {
          this.toastrService.warning("Enter MRP!")
        }
        else if (!this.currentProduct['ssp']) {
          this.toastrService.warning("Enter SSP!")
        }
        else if (!this.currentProduct['ymp']) {
          this.toastrService.warning("Enter YMP!")
        }
        else {
          //this.spinner.show();
          let data={
            "prodCode":this.currentProduct['prodCode'],
            "prodName":this.currentProduct['prodName'],
            "shortDes":this.currentProduct['shortDes'],
            "longDesc":this.currentProduct['longDesc'],
            "prodLength":this.currentProduct['prodLength'],
            "prodBreadth":this.currentProduct['prodBreadth'],
            "prodHeight":this.currentProduct['prodHeight'],
            "prodColor":this.currentProduct['prodColor'],
            "prodWeight":this.currentProduct['prodWeight'],
            "prodBrand":this.currentProduct['prodBrand'],
            "category":this.currentProduct['category'],
            "prodId":this.currentProduct['prodId'],
            "mrp":this.currentProduct['mrp'],
            "ssp":this.currentProduct['ssp'],
            "ymp":this.currentProduct['ymp'],
            "createdOn":this.currentProduct['createdOn'],
            "pdfPath":this.originalPdfPath,
            "prodStatus":"REVIEW"
          }
          this.productService.updateOtherdetailsOfProduct(1,data).subscribe((apiResponse) => {
            //this.spinner.hide();
            console.log(apiResponse)
            if (apiResponse != null) {
              this.toastrService.success("Product updated successfully.");
              this.getCurrentProduct();
              //this.viewAllProducts()
            }
            else {
              this.toastrService.error("Some error occured while adding new product.")
            }
          }, (err) => {
            //this.spinner.hide();
            this.toastrService.error("Network problem.")
          })
        }

  }
  getCurrentProduct() {
    this.productService.getSingleproduct(this.productId).subscribe((apiResponse) => {
      //this.spinner.hide()
      if (apiResponse!=null) {
        //console.log(apiResponse);
        this.currentProduct = apiResponse;
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

  

  onPrimaryImagePicked = (event: Event,prodId) => {
    let file = (event.target as HTMLInputElement).files[0];

    if (file.name.indexOf(".jpeg") < 0 && file.name.indexOf(".png") < 0 && file.name.indexOf(".jpg") < 0) {
      this.toastrService.warning("Please select only jpeg or jpg or png image.")
      //this.validPrimaryImage = false;
    }
    else {
      this.primaryImage = file;
      this.updateFilesOfProduct(this.primaryImage,"primaryImage",prodId);
      //this.validPrimaryImage = true;
    }
  }

  updateFilesOfProduct(file,fieldName,prodId) {
    console.log(prodId);
    let productData=new FormData();
    productData.append(fieldName,file,file.name)
    this.productService.updateFilesOfProduct(productData,prodId).subscribe((response)=>{
      if(response==true){
        this.toastrService.success("Changes updated successfully.")
        this.getCurrentProduct();
      }
      else{
        this.toastrService.error("Failed to update changes.")
      }
    },
    err=>{
      this.toastrService.error("Some error occured.")
    });
  }

  onuserGuidePicked = (event: Event,prodId) => {

    let file = (event.target as HTMLInputElement).files[0];

    if (file.name.indexOf(".pdf") < 0 && file.name.indexOf(".txt") < 0 && file.name.indexOf(".doc") < 0) {
      this.toastrService.warning("Please select only pdf or txt or doc image.")
      this.validUserGuide = false;
    }
    else {
      this.userGuide = file;
      this.updateFilesOfProduct(this.userGuide,"document",prodId);
    }
  }


  onOtherImagesPicked = (event: Event) => {
    //console.log(event)
    for (let file of event.target['files']) {
      //console.log(file['name']);
      if (file.name.indexOf(".jpeg") < 0 && file.name.indexOf(".png") < 0 && file.name.indexOf(".jpg") < 0) {
        this.toastrService.warning("Please select only jpeg or jpg or png image.")
        this.validOtherImages = false;
        this.otherImages = []
        break;
      }
      else {
        this.otherImages.push(file)
        this.validOtherImages = true;
        //this.addNewImagesOfProduct()
      }
    }
  }

  addNewImagesOfProduct(prodId){

    let productData=new FormData()
    for (let file of this.otherImages)
    productData.append(file['name'], file, file['name']);
    this.productService.addNewImagesOfProduct(productData,1,prodId).subscribe((response)=>{
      if(response!=null){
        this.toastrService.success("Images added successfully.")
        this.getCurrentProduct();
      }
      else{
        this.toastrService.success("Failed to add image|es.")
      }
    },
    err=>{
      this.toastrService.error("Some error occured.")
    });
  }

  public goBackToPreviousPage(){
    this.location.back();
  }



  // viewAllProducts() {
  //   this.router.navigate(['product-dashboard'])
  // }

}
