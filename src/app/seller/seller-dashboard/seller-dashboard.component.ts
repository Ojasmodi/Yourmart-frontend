import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../user.service';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {

  displayedColumns: string[] = ['Primary Image', 'Product Code', 'Name', 'Status', 'Category','CreatedOn', 'MRP', 'SSP', 'YMP', 'view', 'Edit'];
  allProducts: MatTableDataSource<any>;
  userName;
  authToken;
  userId;
  searchKey: string;
  sellerId: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public productService: ProductService, public toastrService: ToastrService,
    public router: Router, private spinner: NgxSpinnerService,
    public userManagementService: UserService, public cookieService: CookieService) { }

  ngOnInit() {
    this.checkStatus()
    this.authToken = this.cookieService.get('authToken')
    this.userName = this.cookieService.get('userName')
    this.userId = this.cookieService.get('userId');
    this.getProductsBySellerId();
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
  getProductsBySellerId = () => {
    this.spinner.show()
    this.productService.getProductsBySellerId(this.userId).subscribe((data) => {
      this.spinner.hide()
      if (data != null) {
        for (let prod of data['products']) {
          for (let image of prod['images']) {
            if (image['isPrimaryImage'])
              prod.imageSrc = "http://localhost:8080/images/" + image['imagePath'].substring(image['imagePath'].lastIndexOf("\\") + 1)
          }
        }
        this.allProducts = new MatTableDataSource(data['products']);

        this.allProducts.sort = this.sort;
        this.allProducts.paginator = this.paginator;
      }
    },
      err => {
        this.spinner.hide()
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

  // function for navigating to edit Product component
  public editProduct = (productId) => {
    this.router.navigate(['edit-product', productId])
  }
}
