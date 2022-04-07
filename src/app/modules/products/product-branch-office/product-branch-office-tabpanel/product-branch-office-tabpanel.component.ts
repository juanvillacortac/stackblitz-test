import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { Software } from 'src/app/models/security/Software';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { PermissionByUserByModuleFilter } from 'src/app/modules/security/shared/view-models/PermissionByUserByModuleFilter';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ProductBrachOfficeIndicatorsComponent } from '../product-brach-office-indicators/product-brach-office-indicators.component';
import { ProductBrachOfficePricesCostsComponent } from '../product-brach-office-prices-costs/product-brach-office-prices-costs.component';

@Component({
  selector: 'app-product-branch-office-tabpanel',
  templateUrl: './product-branch-office-tabpanel.component.html',
  styleUrls: ['./product-branch-office-tabpanel.component.scss']
})
export class ProductBranchOfficeTabpanelComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  BranchOfficePermissionByUserByModule: PermissionByUserByModule[] = [];
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  tabpricescosts: boolean = false;
  tabvalidationfactor:boolean = false;
  tabpointorder: boolean = false;
  tabindicators:boolean = false;
  tabselected: boolean = false;
  permissionsIDs = {...Permissions};
  @ViewChild(ProductBrachOfficePricesCostsComponent) PricesCostsComponent: ProductBrachOfficePricesCostsComponent;
  @ViewChild(ProductBrachOfficeIndicatorsComponent) IndicatorsComponent: ProductBrachOfficeIndicatorsComponent;
  
  constructor(private securityService: SecurityService,
    private _Authservice: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }
    this.getSubsidiariesByUser();
  }

  handleChange(e) {
    var index = e.index;
    if (index == 0) {
      this.PricesCostsComponent.searchPricesCosts(-1);
    }else
    if (index == 3) {
      this.IndicatorsComponent.searchPricesCosts(-1);
    }
    //if(index==1)   
      //this.Show=true;
    //else
     //this.showTransit=true; 
  }

  getSubsidiariesByUser(){
    var filter = new PermissionByUserByModuleFilter();
    
    const { id } = this._Authservice.storeUser;
    filter.idUser = id;
    filter.idBranchOffice = -1;
    filter.idModule = 35;
    this.securityService.getPermissionByUserByModule(filter).then(softwareList => {
      this.availableCompaniesBranchOfficeApp = softwareList;
      debugger
      this.tabpricescosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID).length > 0 ? true : false;
      if (this.tabpricescosts == false) {
        this.tabpricescosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID).length > 0 ? true : false;
        if (this.tabpricescosts == false) {
          this.tabpricescosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID).length > 0 ? true : false;
          if (this.tabpricescosts == false) {
            this.tabpricescosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID).length > 0 ? true : false;
          }
        }
      }
      this.tabvalidationfactor = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID).length > 0 ? true : false;
      this.tabpointorder = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID).length > 0 ? true : false;
      this.tabindicators = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID).length > 0 ? true : false;
      
      this.availableCompaniesBranchOfficeApp.forEach(item => {
        if (this.availableCompaniesBranchOfficeApp.length == 0) {
          this.BranchOfficePermissionByUserByModule.push(item);
        }else if(this.BranchOfficePermissionByUserByModule.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0){
          this.BranchOfficePermissionByUserByModule.push(item);
        }
      });
    });
  }

  back = () => {
    const queryParams: any = {};
    if (this.productcatalogfiltersOfValues.length > 0) {
      queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
    }else{
      this.router.navigate(['mpc/productcatalog-list']);
    }
     
  }
}
