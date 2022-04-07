import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { PurchaselistViewmodel } from '../../shared/view-models/purchaselist-viewmodel';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { EnumReceptionStatus } from '../../shared/Utils/enum-reception-status.enum';
import { StatusPurchase } from '../../shared/Utils/status-purchase';
import { TypeDistribution } from '../../shared/Utils/status-reception';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';


@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class PurchaseListComponent implements OnInit {
idate:Date=new Date();
showFilters : boolean = false;
loading : boolean = false;
submitted: boolean;
coinBase: string="";
coinConversion: string="";
purchaseFilters: FilterPurchaseOrder = new FilterPurchaseOrder();
purchaseFiltersSearch: FilterPurchaseOrder = new FilterPurchaseOrder();
listpurchaseFiltersFilters: FilterPurchaseOrder[] = [];
permissions: number[] = [];
permissionsIDs = {...Permissions};
userDialogVisible: boolean = false;
idcompany:number;
idsupplier:number;
ProductCatalogDialogVisible=false;
PurchaseOrderDialogVisible=false;
receptionModalShow = false;
orderSelectedForReception = new PurchaselistViewmodel();
receptionStatus = EnumReceptionStatus.pending;
distibutiontype: typeof TypeDistribution =TypeDistribution;

@ViewChild('dt',{static:false})dt:any;
receptionStatusOptions: MenuItem[] = [];
items1: MenuItem[] = [];
  items: MenuItem[] = [
    {label: 'Nueva OC', icon: 'pi pi-tag',visible:this.userPermissions.allowed(this.permissionsIDs.UPDATE_PURCHASE_ORDER_PERMISSION_ID), command: () =>{  
        this.openNew();
    }},
    {label: 'Planificación de OC', icon: 'pi pi-book', command: () => {
      
    }}
  ];
displayedColumns: ColumnD<PurchaselistViewmodel>[] =
[
//  {template: (data) => { return data.idProductSupplier; }, header: 'Id',field: 'idProductSupplier', display: 'none'},
 {template: (data) => { return data.numOC; },field: 'numOC', header: 'Número de orden', display: 'table-cell'},
 {template: (data) => { return data.branchOrigin; },field: 'branchOrigin', header: 'Sucursal origen', display: 'table-cell'},
 {template: (data) => { return data.branchRequest; },field: 'branchRequest', header: 'Sucursal destino', display: 'table-cell'},
 {template: (data) => { return data.supReasonCommercial; },field: 'supReasonCommercial', header: 'Proveedor', display: 'table-cell'},
 {template: (data) => { return data.country; },field: 'country', header: 'País', display: 'table-cell'},
 {template: (data) => { return data.status; },field: 'status', header: 'Estatus', display: 'table-cell'},
 {template: (data) => { return data.partialDelivery; },field: 'partialDelivery', header: 'Tipo de entrega', display: 'table-cell'},
 {template: (data) => { return data.typeDistribution; },field: 'typeDistribution', header: 'Tipo de distribución', display: 'table-cell'},
 {template: (data) => { return data.typeDocumentOC; },field: 'typeDocumentOC', header: 'Tipo de OC', display: 'table-cell'},
 {template: (data) => { return data.cantItems; },field: 'cantItems', header: 'Cantidad de ítems', display: 'table-cell'},
 {template: (data) => { return this.decimalPipe.transform(data.totalAmountBase, '.3'); },field: 'totalAmountBase', header: 'Monto total base ', display: 'table-cell'},
 {template: (data) => { return this.decimalPipe.transform(data.totalAmountConversion, '.3'); },field: 'totalAmountConversion', header: 'Monto total conversión ', display: 'table-cell'},
 
//  {template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.3'); },field: 'conversionCost', header: 'Costo conversión', display: 'table-cell'},
// {template: (data) => { return data.reviewedby; },field: 'reviewedby', header: 'Revisada por', display: 'table-cell'},
{template: (data) => { return data.createdby; },field: 'createdby', header: 'Creado por', display: 'table-cell'},
 {template: (data) => { return data.responsible; },field: 'responsible', header: 'Responsable', display: 'table-cell'},
 {template: (data) => { return data.approvedby; },field: 'approvedby', header: 'Autorizada', display: 'table-cell'},
//  {template: (data) => { return data.responsibleReception; },field: 'responsibleReception', header: 'Responsable recepción', display: 'table-cell'},
//  {template: (data) => { return data.elaborateby; },field: 'elaborateby', header: 'Elaborada por', display: 'table-cell'},
 {template: (data) => { return data.plannedby; },field: 'plannedby', header: 'Planificada por', display: 'table-cell'},
 {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell'},
 {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha de actualización', display: 'table-cell'}
];
_selectedColumns: any[];
  constructor(public breadcrumbService: BreadcrumbService,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private readonly loadingService: LoadingService,
    public  _purchaseorderService: PurchaseorderService,
    private messageService: MessageService,
    private coinsService: CoinsService,
    private router: Router,
    public userPermissions: UserPermissions ,
    private activatedRoute: ActivatedRoute)
    {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'SCM',routerLink: ['/srm/dashboard-general-srm']  },
      { label: 'Órdenes de compra', routerLink: ['/srm/purchase-list'] }
    ]);
  }

  ngOnInit(): void {
    this._selectedColumns = this.displayedColumns;
   
  //   if(this.dt !=undefined){
  //     debugger
  //     this.dt.first=0;
  //     this.dt.sortField="";
  //     this.dt.reset();
  // }
    this.searchCoinsComp();
    const purchasefilters = this.activatedRoute.snapshot.queryParamMap.get('purchasefilters');

    const purchasefiltersState = history.state.queryParams?.purchasefilters;

    if(purchasefiltersState) {
      this.listpurchaseFiltersFilters = purchasefiltersState;
      this.purchaseFilters = this.listpurchaseFiltersFilters[0];
      this.purchaseFiltersSearch = this.listpurchaseFiltersFilters[1];
    } else {
      if (purchasefilters === null) {
        this.listpurchaseFiltersFilters = [];
        this._purchaseorderService._PurchaseOrderList=[];
      } else {
        this.listpurchaseFiltersFilters = JSON.parse(purchasefilters);
        this.purchaseFilters = this.listpurchaseFiltersFilters[0];
        this.purchaseFiltersSearch = this.listpurchaseFiltersFilters[1];
        this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
      }
    }

    
  }

  clickSearchOrder(){
    this.purchaseFiltersSearch = {
      idOrderPurchase: this.purchaseFilters.idOrderPurchase,
      numberOC: this.purchaseFilters.numberOC,
      idTypeOC: this.purchaseFilters.idTypeOC,
      idDestBranch:this.purchaseFilters.idDestBranch,
      idOriginBranch:this.purchaseFilters.idOriginBranch,
      idSuppliers: this.purchaseFilters.idSuppliers,
      idTypeDistribution: this.purchaseFilters.idTypeDistribution,
      idStatus: this.purchaseFilters.idStatus,
      idWayToPay: this.purchaseFilters.idWayToPay,
      indPartialdelivery: this.purchaseFilters.indPartialdelivery,
      idCoin: this.purchaseFilters.idCoin,
      idTypeDate: this.purchaseFilters.idTypeDate,
      initialDate: this.purchaseFilters.initialDate,
      finalDate: this.purchaseFilters.finalDate,
      idAgrupationOrderPurchase:this.purchaseFilters.idAgrupationOrderPurchase
    }
    this.purchaseFilters;
    this.search();
  }

  search() {
    this.loading = true;
    if(this.dt !=undefined){
      this.dt.first=0;
      this.dt.sortField="";
  }
  this.loadingService.startLoading();
    this._purchaseorderService.getPurchasefilter(this.purchaseFilters).subscribe((data: PurchaselistViewmodel[]) => {
      //  if(data.length>0){
            //this.searchCoinsComp(data);
            this._purchaseorderService._PurchaseOrderList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
         // }
      this.loading = false;
      this.loadingService.stopLoading()
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.loadingService.stopLoading()
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


  searchCoinsComp(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = 1;;
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
  
//  sowmodal(){
//    this.idcompany=1;
//    this.idsupplier=-1;
//    this.userDialogVisible=true;
//  }
 

  //Metodos submits de los modales de productos y orden de compra NO BORRAR.
  // ShowProductCatalogModal(event,id : number)
  // {
  //   this.ProductCatalogDialogVisible = true;
  // }

  // onHideProductCatalogModal(visible: boolean) {
  //   this.ProductCatalogDialogVisible = visible;
  // }

  // onSubmitProductCatalogModal(data) {
  //   alert(data);
  
  // }

  // ShowPurchaseOrderModal(event,id : number)
  // {
  //   this.PurchaseOrderDialogVisible = true;
  // }

  // onHidePurchaseOrderModal(visible: boolean) {
  //   this.PurchaseOrderDialogVisible = visible;
  // }

  // onSubmitPurchaseOrderModal(data) {
  //   alert(data);
  
  // }

//  edit(id: number){
//   this.router.navigate(['srm/purchase-order', id]);
// }

async edit(id) {
  const queryParams: any = {};
  this.listpurchaseFiltersFilters = [];
  this.listpurchaseFiltersFilters.push(this.purchaseFilters);
  this.listpurchaseFiltersFilters.push(this.purchaseFiltersSearch);
  queryParams.purchasefilters = JSON.stringify(this.listpurchaseFiltersFilters);
  const navigationExtras: NavigationExtras = {
    queryParams
  };
  this.router.navigate(['srm/purchase-order', id], {state: navigationExtras});
}

openNew = () => {
  const queryParams: any = {};
  this.listpurchaseFiltersFilters = [];
  this.listpurchaseFiltersFilters.push(this.purchaseFilters);
  this.listpurchaseFiltersFilters.push(this.purchaseFiltersSearch);
  queryParams.purchasefilters = JSON.stringify(this.listpurchaseFiltersFilters);
  const navigationExtras: NavigationExtras = {
    queryParams
  };
  this.router.navigate(['srm/purchase-order', 0], {state: navigationExtras});

}
  createReception(order) {
    this.orderSelectedForReception = order;
    this.receptionModalShow = true;
  }
  public childCallBack(result: number): void {
    this.receptionModalShow = false;
    if (result > 0) {
      this.router.navigate(['srm/reception', result], {state: this.getPurchaserFilters()});
    }
}
loadReceptionOptions(order) {
  this.receptionStatusOptions = [];
  this.receptionStatusOptions.push(
    {label: 'Iniciar', icon: 'pi pi-play', command: () => {
        this.receptionStatus = EnumReceptionStatus.started;
        this.createReception(order);
    }},
    {label: 'Planificar', icon: 'pi pi-calendar-plus', command: () => {
      this.receptionStatus = EnumReceptionStatus.pending;
      this.createReception(order);
    }}
  );
}

private getPurchaserFilters() {
  const queryParams: any = {};
  queryParams.dir = '/srm/purchase-list';
  this.listpurchaseFiltersFilters = [];
  this.listpurchaseFiltersFilters.push(this.purchaseFilters);
  this.listpurchaseFiltersFilters.push(this.purchaseFiltersSearch);
  queryParams.purchasefilters = JSON.stringify(this.listpurchaseFiltersFilters);
  const navigationExtras: NavigationExtras = {
    queryParams
  };

  return navigationExtras;
}

toggleMenu(menu, $event, order) {
  this.loadReceptionOptions(order);
  menu.toggle($event);
}
checkOrderStatus(order) {
   let  valor:boolean=false;
   if(order.statusId == StatusPurchase.Authorized){
      if( order.idPartialDelivery==TypeDistribution.total)///tipo de entrega total 
      {
         if(order.indPurchase==0) /// no posee orden de compra asociada
           valor=true;
         else
            valor=false
      }
      else
        valor=true;
   }
   return valor;
  
}
}

