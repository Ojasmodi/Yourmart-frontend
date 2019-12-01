import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { ProductService } from '../../product.service';


@Component({
  selector: 'app-all-seller',
  templateUrl: './all-seller.component.html',
  styleUrls: ['./all-seller.component.css'],
  providers:[Location]
})

export class AllSellerComponent implements OnInit {

  displayedColumns: string[] = ['Seller Id', 'Owner name', 'Company Name' ,'Email','GST Number', 'view','Status'];
  allSellers: MatTableDataSource<any>;
  sellerStatusTypes = ["NEED_APPROVAL", "APPROVED", "REJECTED"]
  userName;
  authToken;
  userId;
  searchKey: string;
  sellerId: string;

  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
 

  constructor( public toastrService: ToastrService,
    public router: Router, private spinner: NgxSpinnerService, private location:Location,
    public userManagementService: UserService, public cookieService: CookieService) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken')
    this.userName = this.cookieService.get('userName')
    this.sellerId = this.cookieService.get('sellerId')
    this.userId = this.cookieService.get('userId');
    //this.checkStatus();
    this.getallSellers()
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

  // function to get all sellers
  getallSellers(){
    //this.spinner.show()
    this.userManagementService.getAllSellers().subscribe((data:any) => {
      //this.spinner.hide()
      if (data!=null) {    
        console.log(data) 
        this.allSellers = new MatTableDataSource(data);
        
        this.allSellers.sort = this.sort;
        this.allSellers.paginator = this.paginator;
        //console.log(this.allSellers)
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
    this.allSellers.filter = this.searchKey.trim().toLowerCase();
  }

  // function for navigating to view seller component
  public viewSeller = (sellerId) => {
    this.router.navigate(['view-seller', sellerId])
  }

  updateStatusOfSeller(selectedStatus,sellerId){

    let data={
      status:selectedStatus,
      sellerId:sellerId
    }
    this.userManagementService.updateStatusOfseller(data).subscribe(response=>{
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
