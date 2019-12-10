import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort'
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
  providers: [Location]
})

export class AllProductComponent implements OnInit {

  displayedColumns: string[] = ['Primary Image', 'Product Code', 'Name', 'Category', 'MRP', 'SSP', 'YMP', 'Created On', 'Updated On', 'view', 'Status', 'Approve Selected'];
  allProducts: MatTableDataSource<any>;
  productStatusTypes = ["NEW", "APPROVED", "REJECTED", "REVIEW"]
  userName;
  authToken;
  userId;
  searchKey: string;
  sellerId: string;
  selectedProductsId = []

  selectedStatus: any;
  prodId: any;
  comment: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(public productService: ProductService, public toastrService: ToastrService,
    public router: Router, private spinner: NgxSpinnerService, private location: Location,
    public userManagementService: UserService, public cookieService: CookieService) { }

  ngOnInit() {
    this.checkStatus();
    this.authToken = this.cookieService.get('authToken')
    this.userName = this.cookieService.get('userName')
    this.userId = this.cookieService.get('userId')
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
  getAllProducts() {
    this.spinner.show()
    this.productService.getAllProducts().subscribe((data: any) => {
      this.spinner.hide()
      if (data) {
        for (let prod of data) {
          for (let image of prod['images']) {
            if (image['isPrimaryImage'])
              prod.imageSrc = "http://localhost:8080/images/" + image['imagePath'].substring(image['imagePath'].lastIndexOf("\\") + 1)
          }
        }
        this.allProducts = new MatTableDataSource(data);

        this.allProducts.sort = this.sort;
        this.allProducts.paginator = this.paginator;
      }
    },
      err => {
        this.spinner.hide()
        this.toastrService.error("Some error occured.")
      });
  }

  selectProduct = (prodId) => {
    if (this.selectedProductsId.includes(prodId)) {
      for (var i = 0; i < this.selectedProductsId.length; i++) {
        if (this.selectedProductsId[i] === prodId) {
          this.selectedProductsId.splice(i, 1);
        }
      }
    }
    else {
      this.selectedProductsId.push(prodId)
    }
    console.log(this.selectedProductsId)
  }

  approveSelectedProducts = () => {
    if (this.selectedProductsId.length == 0)
      this.toastrService.warning("No products selected.")
    else {
      this.spinner.show()
      this.productService.approveSelectedProducts(this.selectedProductsId).subscribe((response) => {
        this.spinner.hide()
        if (response) {
          this.toastrService.success("Selected products has been approved succesfully.")
          this.getAllProducts();
        }
        else {
          this, this.toastrService.error("Failed to update status of the products.")
        }
      })
    }

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

  addComment() {
    if (!this.comment || this.comment.trim().length == 0)
      this.toastrService.warning("Enter a comment")
    else {
      let data = {
        commentValue: this.comment,
        commentByUserId: this.userId,
        commentByUserName: this.userName
      }
      this.spinner.show();
      this.productService.addCommentToProduct(data, this.prodId).subscribe((response) => {
        $('#exampleModal').modal('toggle');
        this.spinner.hide()
        if (response != null) {
          this.updateStatus();
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

  updateStatusOfProduct(selectedStatus, prodId) {
    this.selectedStatus = selectedStatus;
    this.prodId = prodId;
    if (selectedStatus == "REJECTED") {
      $('#exampleModal').modal('toggle');
    }
    else {
      this.updateStatus()
    }
  }

  updateStatus() {
    this.spinner.show()
    let data = {
      prodStatus: this.selectedStatus,
      prodId: this.prodId
    }
    this.productService.updateStatusOfProduct(data).subscribe(response => {
      this.spinner.hide()
      if (response == true) {
        this.toastrService.success("Status updated successfully.")
      }
      else {
        this.toastrService.error("Unable to update status.")
      }
    },
      err => {
        this.spinner.hide()
        this.toastrService.error("Some error occured.")
      });
  }

  public goBackToPreviousPage() {
    this.location.back();
  }

}
