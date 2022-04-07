import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { ProductbranchofficeService } from '../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { ValidationFactorFilter } from '../../shared/filters/validationfactorfilter';
import { ValidationFactor } from '../../../../models/products/validationfactor';
import { ProductBranchOfficeViewModel } from '../../shared/view-models/productbranchoffice.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-product-branch-office-validation-factor',
  templateUrl: './product-branch-office-validation-factor.component.html',
  styleUrls: ['./product-branch-office-validation-factor.component.scss']
})
export class ProductBranchOfficeValidationFactorComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  idBranchOffice : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  branchOffices: PermissionByUserByModule[] = [];
  ShowDialog: boolean = false;
  showDialogLot: boolean = false;
  validationFactorFilter: ValidationFactorFilter = new ValidationFactorFilter();
  validationFactorList: ValidationFactor[] = [];
  validationFactorListDB: ValidationFactor[] = [];
  selectedBranchOffices: any[] = [];
  validationFactor: ValidationFactor = new ValidationFactor();
  selectedValidationFactor: ValidationFactor = new ValidationFactor();
  productBranchOfficeList: ProductBranchOfficeViewModel[] = [];
  branchexpanded: number = -1;
  permissionsIDs = {...Permissions};
  saveLot: boolean = false;
  
  displayedColumnsValidationFactor: ColumnD<ValidationFactor>[] =
  [
   {template: (data) => { return data.packingPresentation.name; }, header: 'Empaque',field: 'packingPresentation', display: 'table-cell'},
   {template: (data) => { return data.units; },field: 'units', header: 'Unidades', display: 'table-cell'},
   {template: (data) => { return data.packingType.name ; },field: 'packingType', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.minFactor; },field: 'min', header: 'Mínimo', display: 'table-cell'},
   {template: (data) => { return data.midFactor; },field: 'mid', header: 'Medio', display: 'table-cell'},
   {template: (data) => { return data.maxFactor; },field: 'max', header: 'Máximo', display: 'table-cell'},
  ];

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    this.saveLot = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID).length >= 2;
    this.searchValidationFactor(-1);
    
  }

  showAddPanelValidationFactor(event, idBranchOffice: number){
    event.stopPropagation();
    this.validationFactor = new ValidationFactor();
    this.idBranchOffice = idBranchOffice;
    
    this.ShowDialog = true;
  }

  searchValidationFactor(idBranchOffice: number){
    this.loadingService.startLoading('wait_loading');
    this.validationFactorFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.validationFactorFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(this.validationFactorFilter).subscribe((data: ValidationFactor[]) => {
      this.validationFactorList = data;
      this.validationFactorListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.manageValidationFactor =  this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.validationsFactor = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }

  searchValidationFactorbyBranchOffice(idBranchOffice: number){
    this.idBranchOffice = idBranchOffice;
    this.validationFactorFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.validationFactorFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(this.validationFactorFilter).subscribe((data: ValidationFactor[]) => {
      this.validationFactorList = data;
      //this.validationFactorListDB = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }

  showEditPanelValidationFactor(validationFactor: ValidationFactor, idBranchOffice: number){
    var vf = new ValidationFactor();
    vf.idValidationFactor = validationFactor.idValidationFactor;
    vf.idProduct = validationFactor.idProduct;
    vf.minFactor = validationFactor.minFactor;
    vf.maxFactor = validationFactor.maxFactor;
    vf.midFactor = validationFactor.midFactor;
    vf.idPacking = validationFactor.idPacking;
    vf.idBranchOffice = validationFactor.idBranchOffice;
    this.validationFactor = vf;
    this.idBranchOffice = idBranchOffice;
    this.branchexpanded = idBranchOffice;
    this.ShowDialog = true;
  }
  
  showAddLotValidationFactor(){
    this.showDialogLot = true;
  }

  refreshLotValidationFactor(){
    this.loadingService.startLoading('wait_loading');
    this.validationFactorFilter.idBranchOffice = -1;
    this.validationFactorFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(this.validationFactorFilter).subscribe((data: ValidationFactor[]) => {
      this.validationFactorList = data;
      this.validationFactorListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.manageValidationFactor =  this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.validationsFactor = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.branchexpanded = this.idBranchOffice;
      this.validationFactorList = this.idBranchOffice == 0 ? data : data.filter(x => x.idBranchOffice == this.idBranchOffice);
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }

  onRowSelect(event){
    var vf = new ValidationFactor();
    vf.idProduct = this.selectedValidationFactor.idProduct;
    vf.minFactor = this.selectedValidationFactor.minFactor;
    vf.maxFactor = this.selectedValidationFactor.maxFactor;
    vf.midFactor = this.selectedValidationFactor.midFactor;
    vf.idPacking = this.selectedValidationFactor.idPacking;
    vf.idBranchOffice = this.selectedValidationFactor.idBranchOffice;
    this.validationFactor = vf;
    this.idBranchOffice = this.selectedValidationFactor.idBranchOffice;
    this.branchexpanded = this.selectedValidationFactor.idBranchOffice;
    //this.ShowDialog = true;
  }
}
