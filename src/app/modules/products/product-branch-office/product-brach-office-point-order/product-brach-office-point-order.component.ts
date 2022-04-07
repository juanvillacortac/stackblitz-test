import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PointOrder } from 'src/app/models/products/pointorder';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { ProductbranchofficeService } from '../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { PointOrderFilter } from '../../shared/filters/pointorderfilter';
import { ProductBranchOfficeViewModel } from '../../shared/view-models/productbranchoffice.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-product-brach-office-point-order',
  templateUrl: './product-brach-office-point-order.component.html',
  styleUrls: ['./product-brach-office-point-order.component.scss']
})
export class ProductBrachOfficePointOrderComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  branchOffices: PermissionByUserByModule[] = [];
  ShowDialog: boolean = false;
  showDialogLot: boolean = false;
  idBranchOffice : number = 0;
  pointOrderList: PointOrder[] = [];
  pointOrderListDB: PointOrder[] = [];
  selectedBranchOffices: any[] = [];
  pointOrderFilter: PointOrderFilter = new PointOrderFilter();
  pointOrder: PointOrder = new PointOrder();
  selectedPointOrder: PointOrder = new PointOrder();
  productBranchOfficeList: ProductBranchOfficeViewModel[] = [];
  branchexpanded: number = -1;
  permissionsIDs = {...Permissions};
  saveLot: boolean = false;

  displayedColumnsPointOrder: ColumnD<PointOrder>[] =
  [
   {template: (data) => { return data.packingPresentation.name; }, header: 'Empaque',field: 'packingPresentation.name', display: 'table-cell'},
   {template: (data) => { return data.units; },field: 'units', header: 'Unidades', display: 'table-cell'},
   {template: (data) => { return data.packingType.name ; },field: 'packingType.name', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.season.name ; },field: 'season.name', header: 'Temporada', display: 'table-cell'},
   {template: (data) => { return data.minFactor; },field: 'min', header: 'Mínimo', display: 'table-cell'},
   {template: (data) => { return data.midFactor; },field: 'mid', header: 'Medio', display: 'table-cell'},
   {template: (data) => { return data.maxFactor; },field: 'max', header: 'Máximo', display: 'table-cell'},
  ];

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    this.saveLot = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID).length >= 2;
    this.searchPointOrder(-1);
  }

  showAddLotPointOrder(){
    this.showDialogLot = true;
  }

  searchPointOrder(idBranchOffice: number){
    this.loadingService.startLoading('wait_loading');
    this.pointOrderFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.pointOrderFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPointOrderbyfilter(this.pointOrderFilter).subscribe((data: PointOrder[]) => {
      this.pointOrderList = data;
      this.pointOrderListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.managePointOrder =  this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pointOrder = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los puntos de pedidos"});
    });
  }

  searchPointOrdersbyBranchOffice(idBranchOffice: number){
    this.idBranchOffice = idBranchOffice;
    this.pointOrderFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.pointOrderFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPointOrderbyfilter(this.pointOrderFilter).subscribe((data: PointOrder[]) => {
      this.pointOrderList = data;
      //this.pointOrderListDB = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los puntos de pedidos"});
    });
  }

  showAddPanelPointOrder(event, idBranchOffice: number){
    event.stopPropagation();
    this.pointOrder = new PointOrder();
    this.pointOrder.active = true;
    this.idBranchOffice = idBranchOffice;
    this.ShowDialog = true;
  }

  showEditPanelPointOrder(pointorder: PointOrder, idBranchOffice: number){
    var po = new PointOrder();
    po.idPointOrder = pointorder.idPointOrder;
    po.idProduct = pointorder.idProduct;
    po.minFactor = pointorder.minFactor;
    po.maxFactor = pointorder.maxFactor;
    po.midFactor = pointorder.midFactor;
    po.idPacking = pointorder.idPacking;
    po.idSeason = pointorder.season.id;
    po.idBranchOffice = pointorder.idBranchOffice;
    po.active = pointorder.active;
    this.pointOrder = po;
    this.idBranchOffice = idBranchOffice;
    this.branchexpanded = idBranchOffice;
    this.ShowDialog = true;
  }

  refreshLotPointOrder(){
    this.loadingService.startLoading('wait_loading');
    this.pointOrderFilter.idBranchOffice = -1;
    this.pointOrderFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPointOrderbyfilter(this.pointOrderFilter).subscribe((data: PointOrder[]) => {
      this.pointOrderList = data;
      this.pointOrderListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.managePointOrder =  this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pointOrder = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.branchexpanded = this.idBranchOffice;
      this.pointOrderList = this.idBranchOffice == 0 ? data : data.filter(x => x.idBranchOffice == this.idBranchOffice);
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los puntos de pedido"});
    });
  }

  onRowSelect(event){
    var po = new PointOrder();
    po.idProduct = this.selectedPointOrder.idProduct;
    po.minFactor = this.selectedPointOrder.minFactor;
    po.maxFactor = this.selectedPointOrder.maxFactor;
    po.midFactor = this.selectedPointOrder.midFactor;
    po.idPacking = this.selectedPointOrder.idPacking;
    po.idSeason = this.selectedPointOrder.season.id;
    po.idBranchOffice = this.selectedPointOrder.idBranchOffice;
    po.active = this.selectedPointOrder.active;
    this.pointOrder = po;
    this.branchexpanded = this.selectedPointOrder.idBranchOffice;
    this.ShowDialog = true;
  }
}
