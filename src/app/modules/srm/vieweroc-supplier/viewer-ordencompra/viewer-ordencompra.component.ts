import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Coins } from 'src/app/models/masters/coin';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { FilterViewerocSupplier } from '../../shared/filters/filter-vieweroc-supplier';
import { ViewerDocumentsSupplierService } from '../../shared/services/vieweroc-supplier/viewer-documents-supplier.service';
import { PurchaselistViewmodel } from '../../shared/view-models/purchaselist-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-viewer-ordencompra',
  templateUrl: './viewer-ordencompra.component.html',
  styleUrls: ['./viewer-ordencompra.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ViewerOrdencompraComponent implements OnInit {

  idate:Date=new Date();
  showFilters : boolean = true;
  loading : boolean = false;
  submitted: boolean;
  coinBase: string="";
  coinConversion: string="";
  purchaseFilters: FilterViewerocSupplier = new FilterViewerocSupplier();
  permissionsIDs = {...Permissions};
  
  displayedColumns: ColumnD<PurchaselistViewmodel>[] =
  [
  //  {template: (data) => { return data.idProductSupplier; }, header: 'Id',field: 'idProductSupplier', display: 'none'},
   {template: (data) => { return data.numOC; },field: 'numOC', header: 'Número orden', display: 'table-cell'},
   {template: (data) => { return data.branchRequest; },field: 'branchRequest', header: 'Sucursal solicita', display: 'table-cell'},
   {template: (data) => { return data.supReasonCommercial; },field: 'supReasonCommercial', header: 'Proveedor', display: 'table-cell'},
   {template: (data) => { return data.country; },field: 'country', header: 'País', display: 'table-cell'},
   {template: (data) => { return data.status; },field: 'status', header: 'Estatus', display: 'table-cell'},
  //  {template: (data) => { return data.partialDelivery; },field: 'partialDelivery', header: 'Entrega parcial', display: 'table-cell'},
  //  {template: (data) => { return data.typeDistribution; },field: 'typeDistribution', header: 'Tipo de distribución', display: 'table-cell'},
   {template: (data) => { return data.typeDocumentOC; },field: 'typeDocumentOC', header: 'Tipo de OC', display: 'table-cell'},
   {template: (data) => { return data.cantItems; },field: 'cantItems', header: 'Cantidad de ítems', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.totalAmountBase, '.3'); },field: 'totalAmountBase', header: 'Monto total base ', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.totalAmountConversion, '.3'); },field: 'totalAmountConversion', header: 'Monto total conversión ', display: 'table-cell'},
   
  //  {template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.3'); },field: 'conversionCost', header: 'Costo conversión', display: 'table-cell'},
  // {template: (data) => { return data.reviewedby; },field: 'reviewedby', header: 'Revisada por', display: 'table-cell'},
  {template: (data) => { return data.approvedby; },field: 'approvedby', header: 'Autorizado por', display: 'table-cell'},
  {template: (data) => { return data.createdby; },field: 'createdby', header: 'Creado por', display: 'table-cell'},
  //  {template: (data) => { return data.responsible; },field: 'responsible', header: 'Responsable', display: 'table-cell'},
  
   {template: (data) => { return data.responsibleReception; },field: 'responsibleReception', header: 'Responsable de recepción', display: 'table-cell'},
  //  {template: (data) => { return data.elaborateby; },field: 'elaborateby', header: 'Elaborada por', display: 'table-cell'},
   {template: (data) => { return data.updatedUserBy; },field: 'updatedUserBy', header: 'Modificado por', display: 'table-cell'},
  
  
   {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell'},
   {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha de actualización', display: 'table-cell'}
  ];
  _selectedColumns: any[];
    constructor(public datepipe: DatePipe,
      private decimalPipe: DecimalPipe,
      public  _viewerdocumentsupplierService: ViewerDocumentsSupplierService,
      private messageService: MessageService,
      private router: Router,
      private coinsService: CoinsService,
      private activatedRoute: ActivatedRoute,
      public userPermissions: UserPermissions)
      {}
  
    ngOnInit(): void {
      this._selectedColumns = this.displayedColumns;
      this.setPurchaserFilters();
      this.searchCoinsComp();
    }
  
    search() {
      this.loading = true;
      this._viewerdocumentsupplierService.getPurchasefilter(this.purchaseFilters).subscribe((data: PurchaselistViewmodel[]) => {
        this._viewerdocumentsupplierService._PurchaseOrderList=data;             
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
      });
    }
  
    @Input() get selectedColumns(): any[] {
      return this._selectedColumns;
    }
  
    set selectedColumns(val: any[]) {
      //restore original order
      this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
    }
  
    edit(order: PurchaselistViewmodel) {
      const queryParams: any = {};
 
      queryParams.purchasefilters = JSON.stringify(this.purchaseFilters);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      this.router.navigate(['srm/purchase-order-detail', order.idOrderPurchase], { state: navigationExtras });
    }
  
    searchCoinsComp(){
      var filter = new CoinxCompanyFilter();
      filter.idCompany =1;
      this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
        data.forEach(coin => {
          if (coin.legalCurrency == true) {
            this.coinBase = coin.symbology;
            this.displayedColumns.forEach(column => {
              column.header = column.header.includes("base") ? column.header + " " + coin.symbology : column.header;
            });
          }else{
            this.coinConversion = coin.symbology
            this.displayedColumns.forEach(column => {
              column.header = column.header.includes("conversión") ? column.header + " " + coin.symbology : column.header;
            });
          }
        });
        
       
      }, (error: HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de monedas"});
      });
    }

    private setPurchaserFilters() {
      const purchasefilters = this.activatedRoute.snapshot.queryParamMap.get('purchasefilters');
      if(purchasefilters) {
        this.purchaseFilters = JSON.parse(purchasefilters);
      }
    }
}
