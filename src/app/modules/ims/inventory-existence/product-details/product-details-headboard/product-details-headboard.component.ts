import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductExistenceFilters } from 'src/app/models/ims/product-existence-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryExistenceViewmodel } from '../../shared/view-models/inventory-existence-viewmodel';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-product-existence-details-headboard',
  templateUrl: './product-details-headboard.component.html',
  styleUrls: ['./product-details-headboard.component.scss'],
  providers: [DatePipe]
})
export class ProductExistenceDetailsHeadboardComponent implements OnInit {

  @Input() productSelected: InventoryExistenceViewmodel;
  @Input() filters: ProductExistenceFilters;
  @Output() search = new EventEmitter<ProductExistenceFilters>();
  startDate = new Date();
  finalDate = new Date();
  maxDate = new Date();
  permissionsIDs = {...Permissions};
  constructor(
    public datepipe: DatePipe,
    private router: Router,
    public userPermissions: UserPermissions ) { }

  ngOnInit(): void {
  }

  onSearch() {
    this.loadFilters();
    this.search.emit(this.filters);
  }
  loadFilters() {
    this.filters.idProduct = this.productSelected.idproduct;
    this.filters.idArea = this.productSelected.idinventoryarea;
    this.filters.idBranchoffice = this.productSelected.idbranchoffice;
    this.filters.idPackage = this.productSelected.idPackage;
    this.filters.idSpace = this.productSelected.idSpace;
    this.filters.startDate = this.datepipe.transform(this.startDate, 'yyyyMMdd');
    this.filters.finalDate = this.datepipe.transform(this.finalDate, 'yyyyMMdd');
    return;
  }
  returnToMain() {
    this.clearFilters();
    this.router.navigate(['/ims/inventory-existence-list']);
  }
  clearFilters() {
    this.filters.idProduct = -1;
    this.filters.idArea = -1;
    this.filters.idBranchoffice = -1;
    this.filters.idPackage = -1;
    this.filters.idSpace = -1;
    this.filters.startDate = '';
    this.filters.finalDate = '';
  }
}
