import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Typedate } from 'src/app/models/common/typedate';
import { TypedateFilter } from 'src/app/models/common/typedate-filter';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { Coins } from 'src/app/models/masters/coin';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { PurchaseOrder } from 'src/app/models/srm/purchase-order';
import { PurchaseOrderModal } from 'src/app/models/srm/purchase-order-modal';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import { FilterPurchaseOrder } from 'src/app/modules/srm/shared/filters/filter-purchase-order';
import { FilterPurchaseOrderModal } from 'src/app/modules/srm/shared/filters/filter-purchase-order-modal';
import { PurchaseorderService } from 'src/app/modules/srm/shared/services/purchaseorder/purchaseorder.service';
import { TypeDistribution } from 'src/app/modules/srm/shared/Utils/status-reception';
import { Suppliermodal } from 'src/app/modules/srm/shared/view-models/common/suppliermodal';
import { PurchaselistViewmodel } from 'src/app/modules/srm/shared/view-models/purchaselist-viewmodel';

@Component({
  selector: 'purchase-order-modal',
  templateUrl: './purchase-order-modal.component.html',
  styleUrls: ['./purchase-order-modal.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class PurchaseOrderModalComponent implements OnInit {

  @Input() multiples = true;
  @Input() width : string='75%';
  @Input() model = false;
  @Input() isreception = false;
  @Input() visible = false;
  @Output() onSubmit = new EventEmitter<{PurchaseOrders: PurchaseOrderProduct[], identifier: number}>();
  @Output() StringChange = new EventEmitter<PurchaselistViewmodel[]>();
  @Output() AddSelectedPurchaseOrders = new EventEmitter<{ PurchaseOrders: PurchaseOrderProduct[] }>();
  @Output() submitPurchaseOrderSelected = new EventEmitter<{ PurchaseOrder: PurchaseOrderModal }>();
  @Output() onToggle = new EventEmitter<boolean>();
  @Input() idCompany: number;
  @Input() supplierstring = '';
  @Input() suppliermodal: Suppliermodal = new Suppliermodal();
  @Input() isPurchaseOrderSelectionMode = false;
  @Input() filterByStatus = [];
  @Input() filterpurchaseorder: any;
  loading = false;
  identifierToEdit = -1;
  selectedorder: any[] = [];
  purchaseFilters:  FilterPurchaseOrderModal = new  FilterPurchaseOrderModal;
  branchOffice: number;
  submitted = false;
  @ViewChild('dtsp') dtsp: Table;
  typeOClist: SelectItem[];
  statusOCList: SelectItem[];
  typedates: SelectItem [] = [
    { label: 'Todas', value: '-1' },
    { label: 'Creada', value: '1' },
    { label: 'Estimada entrega', value: '2'},
    { label: 'Despacho', value: '3'}
    ];
  coinsList: SelectItem[];
  branchOfficeList: SelectItem[];
  iDate: Date = new Date();
  fDate: Date = new Date();
  nDate: Date = new Date();
  SupplierDialogVisible = false;
  _showdialog = false;
  idbranchooffice = -1;
  _validations: Validations = new Validations();


  displayedColumns: ColumnD<PurchaseOrderModal>[] =
  [
    {template: (data) => data.numOC, field: 'numOC', header: 'Número orden', display: 'table-cell'},
    {template: (data) => data.createdby, field: 'createdby', header: 'Creado por', display: 'table-cell'},
    {template: (data) => data.supplier, field: 'supplier', header: 'Proveedor', display: 'table-cell'},
    {template: (data) => this.datepipe.transform(data.createdDate, 'dd/MM/yyyy HH:mm'), field: 'createdDate',
              header: 'Fecha creada', display: 'table-cell'},
    {template: (data) => data.status, field: 'status', header: 'Estatus', display: 'table-cell'},
    /* {template: (data) => { return data.nroitem=data.purchaseOrderProduct?data.purchaseOrderProduct.length:0},field:
    'nroitem', header: 'Nro ítems', display: 'table-cell'},*/
  ];

  displayedColumnsDetail: ColumnD<PurchaseOrderProduct>[] =
  [
    {template: (data) => data.id, field: 'id', header: 'id', display: 'none'},
    {template: (data) => data.name, field: 'name', header: 'Producto', display: 'table-cell'},
    {template: (data) => data.gtin, field: 'gtin', header: 'Barra', display: 'table-cell'},
    {template: (data) => data.supplierReference, field: 'supplierReference', header: 'Referencia proveedor', display: 'table-cell'},
    {template: (data) => data.category, field: 'category', header: 'Categoría', display: 'table-cell'},
    {template: (data) => data.brand, field: 'brand', header: 'Marca', display: 'table-cell'},
    /* {template: (data) => { return data.price.baseCost; },field: 'baseCost', header: 'Costo', display: 'table-cell'},
     {template: (data) => { return data.price.convertionCost; },field:
                'convertionCost', header: 'Costo conversión', display: 'table-cell'},*/
    {template: (data) => data.packagingType, field: 'packagingType', header: 'Tipo de empaque', display: 'table-cell'},
    {template: (data) => data.packaging, field: 'packaging', header: 'Empaque', display: 'table-cell'},
    {template: (data) => data.unitPerPackaging, field: 'unitPerPackaging', header: 'Unidades por empaque', display: 'table-cell'},
    {template: (data) => data.baseCost, field: 'baseCost', header: 'Costo total', display: 'table-cell'},
  ];


  constructor( public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public  _Service: PurchaseorderService,
    private _operationMaster: OperationMastersService,
    private _commonmasterservice: CommonMastersService,
    private _commonservicempc: CommonService,
    public _coinService: CoinsService,
    private _httpClient: HttpClient,
    public _branchofficeService: BranchofficeService,
    private messageService: MessageService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.selectedorder = [];
    this.GetTypeDocumentOC();
    this.onLoadStatusList();
    this.searchTypesDate();
    this.searchCoins();
    this.searchBrancoffices();
  }

  onShow() {
    this.purchaseFilters=new FilterPurchaseOrderModal();
    this.submitted = false;
    this.selectedorder = [];
    this.emitVisible();
    this.ngOnInit();
    this._Service._PurchaseOrderDetailList=[];

  }

  onHide() {
    this.submitted = false;
    this.dtsp.reset();
    this.emitVisible();
    this.purchaseFilters = new FilterPurchaseOrderModal();
    this._Service._PurchaseOrderList = [];
    this.identifierToEdit = -1;
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }
  load() {
    this.loading = true;
    this._Service.getPurchaseOrderDetail(this.purchaseFilters).subscribe((data: PurchaseOrderModal[]) => {
      if(data.length>0)
      {
       if(this.filterpurchaseorder)
        this._Service._PurchaseOrderDetailList = data.filter(x=>x.idBranchRequest==this._Authservice.currentOffice);
       else
        this._Service._PurchaseOrderDetailList = this.filterResult(data);
      }
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this._Service._PurchaseOrderDetailList = [];
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  submitOrderProducts() {
    if (this.selectedorder.length > 0) {
      this.onSubmit.emit({
        PurchaseOrders: this.selectedorder,
        identifier: this.identifierToEdit
    });
   }
  }

  search() {
    if (this.suppliermodal.id > 0) {
        this.purchaseFilters.idSuppliers = String(this.suppliermodal.id);
    }
    if (this.purchaseFilters.idTypeDate !== -1) {
      this.purchaseFilters.initialDate = this.datepipe.transform(this.iDate, 'yyyyMMdd');
      this.purchaseFilters.finalDate = this.datepipe.transform(this.fDate, 'yyyyMMdd');
    }
    this.load();
  }

  onLoadStatusList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 5;
    this._commonservicempc.getStatus(filter)
    .subscribe((data) => {
      this.statusOCList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
      console.log(error);
    });
  }

  GetTypeDocumentOC() {
    const filter = new OperationdocumentFilters();
     filter.id = -1;
     filter.idTypeDocumentOperation = 2; // orden compra
     this._operationMaster.getDocumentsOperations(filter).subscribe((data: Operationdocument []) => {
     this.typeOClist = data.map((item) => ({
       label: item.name,
       value: item.id
     }));
   }, (error: HttpErrorResponse) => {
     this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando los tipos de distribución'});
   });
  }

    // Get TypesDate
    searchTypesDate() {
      const filter = new TypedateFilter();
       filter.id = -1;
       filter.idTypeDocumentOperational = 4;
       this._commonmasterservice.getTypesDate(filter).subscribe((data: Typedate[]) => {
       this.typedates = data.map((item) => ({
         label: item.name,
         value: item.id
       }));
     }, (error: HttpErrorResponse) => {
       this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando los tipo de fechas'});
     });
   }

     // Obtener todas las monedas
  searchCoins() {
    const filter = new CoinFilter();
    filter.id = -1;
    filter.active=1;
    this._coinService.getCoinsList(filter).subscribe((data: Coins[]) => {
      this.coinsList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando los tipos de monedas'});
    });
  }

    // Obtener sucursales
    searchBrancoffices() {
      const filter = new BranchofficeFilter();
       filter.idCompany = this.idCompany;
      this._branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
       this.branchOfficeList = data.map((item) => ({
         label: item.branchOfficeName,
         value: item.id
       }));
     }, (error: HttpErrorResponse) => {
       this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando las sucursales'});
     });
   }

  clearFilters() {
    this.purchaseFilters.numberOC = '';
    this.purchaseFilters.idTypeOC = -1;
    this.purchaseFilters.idStatus = -1;
    this.purchaseFilters.idCoin = -1;
    this.suppliermodal.socialReason = '';
    this.supplierstring = '';
    this.purchaseFilters.idSuppliers = '';
    this.purchaseFilters.createdByUserId = -1;
    this.purchaseFilters.createdByUser = '';
    this.iDate = new Date();
    this.fDate = new Date();
    this.purchaseFilters.initialDate = this.datepipe.transform(this.iDate, 'yyyyMMdd');
    this.purchaseFilters.finalDate = this.datepipe.transform(this.fDate, 'yyyyMMdd');
  }

  onToggleSupplier(visible: boolean) {
    this.SupplierDialogVisible = visible;
  }

  showmodal(multples: boolean, models: boolean) {
    this.model = models;
    this.multiples = multples;
    this._showdialog = true;
   }


  onSubmitOperator(data) {
    if (this.multiples === false) {
    this.purchaseFilters.createdByUserId = data.operator.id;
    this.purchaseFilters.createdByUser = data.operator.name;
    }

  }

  onHideOperator(visible: boolean) {
    this._showdialog = visible;
  }

  onSubmitSupplier(data) {
    this.supplierstring = data.socialReason;
    this.purchaseFilters.idSuppliers = data.id;
  }
  submitSelection() {
    this.submitted = true;
    if (this.isPurchaseOrderSelectionMode) {
        this.submitPurchaseOrder();
    } else {
      this.submitOrderProducts();
    }
    this.submitted = false;
    this.visible = false;
    this.onHide();
  }
   submitPurchaseOrder() {
    if (this.selectedorder) {
      const model = this.selectedorder as any;
      this.submitPurchaseOrderSelected.emit(model);
   }
  }

  filterResult(data: PurchaseOrderModal[]) 
  {
    if(this.isResultFilteredByStatus) {
      return data.filter(p => this.filterByStatus?.includes(Number(p.idStatus)) && p.idBranchRequest==this._Authservice.currentOffice && ((p.indPurchase==0 && p.idDeliveryType==TypeDistribution.total) || p.idDeliveryType==TypeDistribution.partial));
    }
    return data.filter(x=>x.idBranchRequest==this._Authservice.currentOffice);

  }

  isResultFilteredByStatus() {
    return this.filterByStatus?.length > 0 ?? false;
  }

}


