import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SuppliercatalogFilter } from '../../../shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';
import { Table } from 'primeng/table';
import { BarFilter } from '../../../shared/filters/bar-filter';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { Coins } from 'src/app/models/masters/coin';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';

@Component({
  selector: 'suppliercatalog',
  templateUrl: './suppliercatalog.component.html',
  styleUrls: ['./suppliercatalog.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class SuppliercatalogComponent implements OnInit {

showFilters : boolean = true;
loading : boolean = false;
submitted: boolean;
suppliercatalogFilters: SuppliercatalogFilter = new SuppliercatalogFilter();
 productSupplierDialog: boolean = false;
 lineDialog: boolean = false;
 reasonDialog: boolean =false;
 wizardDialog: boolean =false;
 ProdxSuppliersEditTemp: Productsxsupplier[] = [];
 productxsupplierModel: SupplierCatalog = new SupplierCatalog();
 suppplierproduct : Productsxsupplier = new Productsxsupplier();
 suppplierproductList : Productsxsupplier []= [];
  permissionsIDs = {...Permissions};
  @ViewChild('dt',{static:false})dt:any
  defectImage: DefeatImage=new DefeatImage();
  
  displayedColumns: ColumnD<SupplierCatalog>[] =
  [
  //  {template: (data) => { return data.idProductSupplier; }, header: 'Id',field: 'idProductSupplier', display: 'none'}, 
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barra; },field: 'barra', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.commercialReason; },field: 'commercialReason', header: 'Razón comercial', display: 'table-cell'},
   {template: (data) => { return data.supplierRef; },field: 'supplierRef', header: 'Ref. proveedor', display: 'table-cell'},
   {template: (data) => { return data.typePacking; },field: 'typePacking', header: 'Tipo de empaque', display: 'table-cell'},
   {template: (data) => { return data.presentationPacking; },field: 'presentationPacking', header: 'Empaque', display: 'table-cell'},
   {template: (data) => { return data.available; },field: 'available', header: 'Disponible', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.baseCost, '.3'); },field: 'baseCost', header: 'Costo base', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.3'); },field: 'conversionCost', header: 'Costo conversión', display: 'table-cell'},
   {template: (data) => { return data.internalRef; },field: 'internalRef', header: 'Ref. interna', display: 'table-cell'},
   {template: (data) => { return data.category; },field: 'category', header: 'Categoría', display: 'table-cell'},
  {field: 'active', header: 'Estatus', display: 'table-cell'},
      { template: (data) => { return this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); }, field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell' },
      { template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); }, field: 'dateUpdate', header: 'Fecha de modificación', display: 'table-cell' },
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
  //  {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha creación', display: 'table-cell'},
  //  {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha actualización', display: 'table-cell'}
  ];
 _selectedColumns: any[];
  // 
  items: MenuItem[] = [];

 
  constructor( public _suppliercatalogservice: SuppliercatalogService,
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private decimalPipe: DecimalPipe,
    private coinsService: CoinsService) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'SCM',routerLink: ['/srm/dashboard-general-srm']  },
        { label: 'Catálogo de productos por proveedor', routerLink: ['srm/suppliercatalog'] }
      ]);
    }

  ngOnInit(): void {
    debugger
    this._selectedColumns = this.displayedColumns
    this.items= [
      {label: 'Individual', visible:this.userPermissions.allowed(this.permissionsIDs.UPDATE_PRODUCT_SUPPLIER_LOT_PERMISSION_ID), command: () => {
        this.addnew();
   }},
      {label: 'Por lotes', visible: this.userPermissions.allowed(this.permissionsIDs.UPDATE_PRODUCT_SUPPLIER_PERMISSION_ID), command: () => {
          this.addlote();
      }}
      
    ];
    this.searchCoinsComp();
  }

  search() {

    this.loading = true;
    if(this.dt !=undefined){
        this.dt.first=0;
        this.dt.sortField="";
    }
         
    this._suppliercatalogservice.getSupplierCatalogfilter(this.suppliercatalogFilters).subscribe((data: SupplierCatalog[]) => {
      this._suppliercatalogservice._SupplierCatalogList = data;
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

addnew(){
  this.productSupplierDialog=true;
}
addlote(){
  this.wizardDialog=true;
}

onEdit(supplier: SupplierCatalog){
  this.productxsupplierModel = new SupplierCatalog();
  // this.productxsupplierModel = supplier;
  this.productxsupplierModel.idProductSupplier = supplier.idProductSupplier;
  this.productxsupplierModel.idCom= supplier.idCom;
  this.productSupplierDialog=true;
}
OnLinetime(supplier: SupplierCatalog){
  this.productxsupplierModel = supplier;
  this.lineDialog=true;
}
onInactive(supplier: SupplierCatalog, active:boolean){
  this.productxsupplierModel = supplier;
  if(active==true){
      this.reasonDialog= true;
      this.productxsupplierModel.active= active;
  }else{
     this.Searchproduct();
     this.productxsupplierModel.active= true;
     this.suppplierproduct.active=true;

  }
}
showmodalLine(){
  this.lineDialog= true;

}

Searchproduct(){
  var filter : BarFilter = new BarFilter(); 
  filter.bar= "";
  filter.id=this.productxsupplierModel.idProductSupplier;
  filter.idComp=this.productxsupplierModel.idCom;
  this._suppliercatalogservice.getSupplierProductfilter(filter).subscribe((data: Productsxsupplier) => {
    if(data!=null){
       this.suppplierproduct = data;
        this.suppplierproduct.active=true;
        this.suppplierproduct.idReasons=0;
       this.SaveEstatus();
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "La barra de empaque no esta asociada." });
    }
   // this.loading = false;
  }, (error: HttpErrorResponse)=>{
   
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
  });
}

SaveEstatus(){
  this.suppplierproductList=[];
      this.suppplierproduct.description="";
      this.suppplierproductList.push(this.suppplierproduct);
    this._suppliercatalogservice.postSupplierProduct(this.suppplierproductList).subscribe((data: number) => {
    if (data > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
     
       this.suppplierproduct = new Productsxsupplier();
      // const filters = new SuppliercatalogFilter();
      this._suppliercatalogservice.getSupplierCatalogfilter(this.suppliercatalogFilters).subscribe((data: SupplierCatalog[]) => {
       this._suppliercatalogservice._SupplierCatalogList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());

    });   
    }else if (data == -1){
      console.log(data);
      this.messageService.add({severity:'error', summary:'Alerta', detail: "El proveedor ya existe para este producto."});
    }else{
      console.log(data);
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al cambiar estatus del proveedor asociado al producto."});
    }
  }, (error: HttpErrorResponse)=>{
    
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al cambiar estatus del proveedor asociado al producto."});
});
 }
 
 searchCoinsComp(){
  
  var filter = new CoinxCompanyFilter();
  filter.idCompany = 1;
  this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
    data.forEach(coin => {
      if (coin.legalCurrency == true) {
        this.displayedColumns.forEach(column => {
          column.header = column.header.includes("base") ? column.header + " " + coin.symbology : column.header;
        });
      }else{
       
        this.displayedColumns.forEach(column => {
          column.header = column.header.includes("conversión") ? column.header + " " + coin.symbology : column.header;
        });
      }
    });
    
   
  }, (error: HttpErrorResponse)=>{
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de monedas"});
  });
}

}
