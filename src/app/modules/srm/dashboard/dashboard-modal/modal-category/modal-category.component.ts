import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Coins } from 'src/app/models/masters/coin';
import { PurchaserOrderStatus } from 'src/app/models/srm/purchase-order-status';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { FilterPurchaseOrder } from '../../../shared/filters/filter-purchase-order';
import { FilterViewerocSupplier } from '../../../shared/filters/filter-vieweroc-supplier';
import { PurchaseorderService } from '../../../shared/services/purchaseorder/purchaseorder.service';
import { PurchaselistViewmodel } from '../../../shared/view-models/purchaselist-viewmodel';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ModalCategoryComponent implements OnInit {

  idate:Date=new Date();
  value1: number = 0;
  value2: number = 0;
  value3: number = 0;
  value4: number = 0;
  loading : boolean = false;
  submitted: boolean;
  searchType:number=0;
  coinBase: string="";
  coinConversion: string="";
  purchaseFilters: FilterPurchaseOrder = new FilterPurchaseOrder();
  
  permissionsIDs = {...Permissions};
  
  displayedColumns: ColumnD<PurchaselistViewmodel>[] =
  [//tiempo en recepcion tiempo en revision por el proveedor, proveedor revisa.
    {template: (data) => { return data.responsible; },field: 'responsible', header: 'Responsable', display: 'table-cell'},
    {template: (data) => { return data.numOC; },field: 'numOC', header: 'Número orden', display: 'table-cell'},
   {template: (data) => { return data.branchRequest; },field: 'branchRequest', header: 'Sucursal solicita', display: 'table-cell'},
   {template: (data) => { return data.status; },field: 'status', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.typeDocumentOC; },field: 'typeDocumentOC', header: 'Tipo de OC', display: 'table-cell'},
   {template: (data) => { return data.cantItems; },field: 'cantItems', header: 'Cantidad de items', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.totalAmountBase, '.3'); },field: 'totalAmountBase', header: 'Monto total base ', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.totalAmountConversion, '.3'); },field: 'totalAmountConversion', header: 'Monto total conversión ', display: 'table-cell'}
  ];
  _selectedColumns: any[];
 
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public  _purchaseorderService: PurchaseorderService,
    private messageService: MessageService,
    private coinsService: CoinsService,private _Authservice: AuthService, private router: Router) { }
   // this.productcatalogFilters.companyId = this._Authservice.currentCompany;
   @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }

  ngOnInit(): void {
    debugger
    this.searchType=this.config.data.id;
    this.searchCoinsComp();
    this._selectedColumns = this.displayedColumns
    this.purchaseFilters.idDestBranch=1;//this._Authservice.currentOffice;
    this.search() ;
   

  }

Open(idOrder:number){
  this.ref.close(0);
  this.router.navigate(['/srm/purchase-order', idOrder]);
}

valuesKnob(){
  debugger
  var listTemp1;
  var listTemp2;
  var listTemp3;
  var count=0;
  var count3=0;
  var count2=0;
  var count1=0;
  
  //autorizadas
   this._purchaseorderService._PurchaseOrderList.forEach(element => {
    if (element.statusId==PurchaserOrderStatus.authorized){

     count=count+1;
    }  
  });
  this.value1=count;
  if(this.searchType==1){//comercializacion
    this._purchaseorderService._PurchaseOrderList.forEach(element => {
     if (element.statusId==PurchaserOrderStatus.received){

      count1=count1+1;
     }
     if (element.statusId==PurchaserOrderStatus.planning){

      count2=count2+1;
     }
     if (element.statusId==PurchaserOrderStatus.elaborated){

      count3=count3+1;
     }
   });
 
   this.value2=count1;
   this.value3=count2;
   this.value4=count3;
  }
 
 if(this.searchType==2){//proveedor
  debugger

  this._purchaseorderService._PurchaseOrderList.forEach(element => {
    if (element.statusId==PurchaserOrderStatus.elaborated){

     count1=count1+1;
    }
    if (element.statusId==PurchaserOrderStatus.inReview){

     count2=count2+1;
    }
    if (element.statusId==PurchaserOrderStatus.reviewFinalized){

     count3=count3+1;
    }
  });

  this.value2=count1;
  this.value3=count2;
  this.value4=count3;
 }
 
}
  searchCoinsComp(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany =this._Authservice.currentCompany;
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
  search() {
    debugger
    this.loading = true;
   

      if (this.searchType==1){//falta el filtro de fecha

        this.purchaseFilters.idStatus=PurchaserOrderStatus.authorized.toString()+','+PurchaserOrderStatus.planning.toString()+','+PurchaserOrderStatus.elaborated.toString()+','+PurchaserOrderStatus.rejectedBySupplier.toString();
      }
      if (this.searchType==2){//falta el filtro de fecha

        this.purchaseFilters.idStatus=PurchaserOrderStatus.authorized.toString()+','+PurchaserOrderStatus.inReview.toString()+','+PurchaserOrderStatus.reviewFinalized.toString()+','+PurchaserOrderStatus.rejectedBySupplier.toString();
      }
  
    this._purchaseorderService.getPurchasefilter(this.purchaseFilters).subscribe((data: PurchaselistViewmodel[]) => {
      //  if(data.length>0){
            //this.searchCoinsComp(data);
            this._purchaseorderService._PurchaseOrderList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
         // }
         this.valuesKnob();
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

 

}
