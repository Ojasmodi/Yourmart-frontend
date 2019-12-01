import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../../product.service';
import { Location } from '@angular/common';
declare var $: any

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css'],
  providers:[Location]
})

export class AllProductComponent implements OnInit {

  displayedColumns: string[] = ['Primary Image', 'Product Code', 'Name' ,'Category','MRP','SSP','YMP','Created On','Updated On', 'view','Status'];
  allProducts: MatTableDataSource<any>;
  productStatusTypes = ["NEW", "APPROVED", "REJECTED", "REVIEW"]
  userName;
  authToken;
  userId;
  searchKey: string;
  sellerId: string;

  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  selectedStatus: any;
  prodId: any;
  comment: any;
 

  constructor(public productService: ProductService, public toastrService: ToastrService,
    public router: Router, private spinner: NgxSpinnerService, private location:Location,
    public userManagementService: UserService, public cookieService: CookieService) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken')
    this.userName = this.cookieService.get('userName')
    this.sellerId = this.cookieService.get('sellerId')
    this.userId = this.cookieService.get('userId');
    //this.checkStatus();
    this.getAllProducts()
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
  }

  // function to get all Products
  getAllProducts(){
    //this.spinner.show()
    this.productService.getAllProducts().subscribe((data:any) => {
      //this.spinner.hide()
      if (data!=null) {
        //this.allProducts=data['products']
        for(let prod of data){
          for(let image of prod['images']){
            if(image['isPrimaryImage'])
            prod.imageSrc="http://localhost:8080/images/"+image['imagePath'].substring(image['imagePath'].lastIndexOf("\\")+1)
         }
        }        
        this.allProducts = new MatTableDataSource(data);
        
        this.allProducts.sort = this.sort;
        this.allProducts.paginator = this.paginator;
        //console.log(this.allProducts)
      }
    },
      err => {
        //this.spinner.hide()
        this.toastrService.error("Some error occured.")
      });
  }

  // function to clear filter rows result
  onSearchClear = () => {
    this.searchKey = '';
    this.applyFilter();
  }

  // function to filter rows
  applyFilter = () => {
    this.allProducts.filter = this.searchKey.trim().toLowerCase();
  }

  // function for navigating to view Product component
  public viewProduct = (productId) => {
    this.router.navigate(['view-product', productId])
  }

  addComment(){
    if(!this.comment || this.comment.trim().length==0)
    this.toastrService.warning("Enter a comment")
    else{
      let data={
        commentValue:this.comment,
        commentByUserId:1,
        commentByUserName:"ojas"
      }
      this.productService.addCommentToProduct(data,this.prodId).subscribe((response)=>{
        $('#exampleModal').modal('toggle');
        if(response!=null){
          this.updateStatus();
        }
        else
        this.toastrService.error("Failed to update status.")
      },
    err=>{
      this.toastrService.error("Some error occured.")
    })
    }
    
  }

  updateStatusOfProduct(selectedStatus,prodId){
    this.selectedStatus=selectedStatus;
    this.prodId=prodId;
    if(selectedStatus=="REJECTED"){ 
      $('#exampleModal').modal('toggle');
    }
    else{
      this.updateStatus()
    }  
  }

  updateStatus(){
    let data={
      prodStatus:this.selectedStatus,
      prodId:this.prodId
    }
    this.productService.updateStatusOfProduct(data).subscribe(response=>{
      console.log(response)
        if(response==true){
          this.toastrService.success("Status updated successfully.")
        }
        else{
          this.toastrService.error("Unable to update status.")
        }
    },
    err=>{
      this.toastrService.error("Some error occured.")
    });
  }

  public goBackToPreviousPage(){
    this.location.back();
  }

  // function to logout user
  public logout = () => {
    this.spinner.show();
    this.userManagementService.logout().subscribe((apiResponse) => {
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

}
