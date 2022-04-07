import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ConfirmationService,
  MessageService
} from 'primeng/api';
import {
  Subscription
} from 'rxjs';
import {
  ColumnD
} from 'src/app/models/common/columnsd';
import {
  Packing
} from 'src/app/models/products/packing';
import {
  ValidateProductActive
} from 'src/app/models/products/validate-product-active';
import {
  DetailProductReception
} from 'src/app/models/srm/detailproductreception';
import {
  DetailReception
} from 'src/app/models/srm/detailreception';
import {
  PurchaseReceptionFilter
} from 'src/app/models/srm/purchaserecpetionfilter';
import {
  ChildReception,
  Reception,
  ReceptionStatus
} from 'src/app/models/srm/reception';
import {
  ReceptionDetailFilter
} from 'src/app/models/srm/reception-detail-filter';
import {
  ReceptionDashboard
} from 'src/app/models/srm/receptiondashboard';
import {
  LoadingService
} from 'src/app/modules/common/components/loading/shared/loading.service';
import {
  DefeatImage
} from 'src/app/modules/common/image/defeatimage';
import {
  AuthService
} from 'src/app/modules/login/shared/auth.service';
import {
  AmbientFilter
} from 'src/app/modules/masters-mpc/shared/filters/common/ambient-filter';
import {
  PackingtypeFilter
} from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import {
  CommonService
} from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import {
  Validations
} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import {
  PackingFilter
} from 'src/app/modules/products/shared/filters/packing-filter';
import {
  ProductcomFilter
} from 'src/app/modules/products/shared/filters/productcom-filter';
import {
  ValidateProductActiveFilter
} from 'src/app/modules/products/shared/filters/validate-product-active-filter';
import {
  PackingService
} from 'src/app/modules/products/shared/services/packingservice/packing.service';
import {
  ProductbranchofficeService
} from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import {
  ProductService
} from 'src/app/modules/products/shared/services/productservice/product.service';
import {
  ListproductscomViewmodel
} from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import {
  UserPermissions
} from 'src/app/modules/security/users/shared/user-permissions.service';
import {
  AppConfig
} from 'src/app/modules/srm/shared/filters/appconfig';
import {
  PurchaseOrderProductFilter
} from 'src/app/modules/srm/shared/filters/purchase-order-product';
import {
  CommonsrmService
} from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import {
  MerchandiseReceptionService
} from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';
import {
  PurchaseorderService
} from 'src/app/modules/srm/shared/services/purchaseorder/purchaseorder.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import {
  InputNumber
} from 'primeng/inputnumber';
import {
  ReceptionDashboardPacking
} from 'src/app/models/srm/receptiondashboardpacking';
import {
  ReceptionDashboardCategory
} from 'src/app/models/srm/receptiondashboardcategory';
import {
  ReceptionDashboardReceived
} from 'src/app/models/srm/receptiondashboardreceived';
import {
  ReceptionDashboardDiferences
} from 'src/app/models/srm/receptiondashboarddiferences';
import {
  Dropdown
} from 'primeng/dropdown';
import {
  ComplementaryFilter
} from 'src/app/modules/products/shared/filters/complementary-filter';
import {
  ComplementaryService
} from 'src/app/modules/products/shared/services/complementaryservice/complementary.service';
import { PackingByBranchOfficeFilter } from 'src/app/modules/products/shared/filters/packingbybranchoffice-filter';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  _selectedColumns: any[];
  _detailproducts: DetailReception[] = [];
  selecteditem: any;
  _viewModel: DetailReception = new DetailReception();
  defectImage: DefeatImage = new DefeatImage();
  statusreception: typeof ReceptionStatus = ReceptionStatus;
  permissions: number[] = [];
  permissionsIDs = {
    ...Permissions
  };
  iduserlogin: number = 0;
  @Input("_product") _product: DetailReception = new DetailReception();
  @Input("reception") reception: Reception;
  @Input() isChieldReception = false;
  @Input("childReception") childReception: ChildReception;
  @Input('index') index: number
  @Output("selection") selection = new EventEmitter < {
    detail: DetailReception
  } > ();
  catalogproduct: ListproductscomViewmodel[];
  filters: ProductcomFilter;
  filterpackaging: PackingFilter;
  idCompany: number = -1;
  idBranchoffice: number = -1;
  submitted: boolean;
  packing: Packing;
  loading = false;
  packaginglist: any[] = [];
  packagingtypelist: any[] = [];
  enviromentlist: any[] = [];
  innerWidth: number;
  innerHeight: number;
  isdisabled: boolean = true;
  weigthVisible = false;
  diferencesVisible = false;
  validateActive: ValidateProductActive;
  _validations: Validations = new Validations();
  visible: boolean = false;
  LotDialogVisible: boolean = false;
  LotsProductVisible: boolean = false;
  detailselected: DetailReception = new DetailReception();
  //#region variables dashborad
  data: any;
  datadiferences: any;
  basicData: any;
  chartOptions: any;
  subscription: Subscription;
  config: AppConfig;
  itemsindividual: number = 0;
  itemsmaster: number = 0;
  itemsheavy: number = 0;
  totaldiferences: number = 0;
  cubingImage: DefeatImage = new DefeatImage()
  packingmaster: ReceptionDashboardPacking = new ReceptionDashboardPacking();
  packingindividual: ReceptionDashboardPacking = new ReceptionDashboardPacking();
  heavy: ReceptionDashboardPacking = new ReceptionDashboardPacking();
  cubing: ReceptionDashboardPacking = new ReceptionDashboardPacking();
  unitreceived: ReceptionDashboardReceived = new ReceptionDashboardReceived();
  diferences: ReceptionDashboardDiferences = new ReceptionDashboardDiferences();
  haveproduct = false;
  @Output('haveChange') haveChange = new EventEmitter < boolean > ();

  @ViewChild("in1") in1: ElementRef;
  @ViewChild("in2") in2: ElementRef;
  @ViewChild("in3") in3: ElementRef;
  @ViewChild("in4") in4: ElementRef;
  @ViewChild("in5") in5: ElementRef;
  @ViewChild("in6") in6: ElementRef;
  @ViewChild('bar') bar: ElementRef;
  @ViewChild("dd3") dd3: Dropdown;
  @ViewChild('weigtneto') weigtneto: ElementRef;
  @ViewChild('received') received: ElementRef;
  @ViewChild("btnsave") btnsave: ElementRef;

  //#endregion

  displayedColumns: ColumnD < DetailReception > [] = [{
      field: 'image',
      header: '',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.product;
      },
      field: 'product',
      header: 'Nombre',
      display: 'table-cell'
    },
    // { template: (data) => { return data.referencesFactory; }, field: 'referencesFactory', header: 'Ref. proveedor', display: 'table-cell' },
    {
      template: (data) => {
        return data.references;
      },
      field: 'references',
      header: 'Ref. interna',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return data.purchaseReception.unitsPurchaseOrder.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return data.purchaseReception.unitsPurchaseOrder.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      },
      field: 'unitsPurchaseOrder',
      header: 'Unidades ordenadas',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return data.purchaseReception.invoicePackaging.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return data.purchaseReception.invoicePackaging.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      },
      field: 'invoicePackaging',
      header: 'Cant. empaques en factura',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.purchaseReception.unitsPerInvoicePackaging.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      },
      field: 'invoicePackaging',
      header: 'Unds x empaques en factura',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return (data.totalUnitsInvoice = data.purchaseReception.invoicePackaging * data.purchaseReception.unitsPerInvoicePackaging).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return (data.totalUnitsInvoice = data.purchaseReception.invoicePackaging * data.purchaseReception.unitsPerInvoicePackaging).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      },
      field: 'totalUnitsInvoice',
      header: 'Total unidades en factura',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return data.totalUnits.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return data.totalUnits.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      },
      field: 'totalUnits',
      header: 'Total unidades recibidas',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return data.purchaseReception.diferencesUnits.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return data.purchaseReception.diferencesUnits.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      },
      field: 'diferencesUnits',
      header: 'Diferencia de unidades',
      display: !this.isChieldReception ? 'table-cell' : 'none'
    },
  ];


  displayedColumnsDetail: ColumnD < DetailProductReception > [] = [{
      template: (data) => {
        return data.typePacking;
      },
      field: 'typePacking',
      header: 'Tipo de empaque',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.gtin;
      },
      field: 'gtin',
      header: 'Barra',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.presetation;
      },
      field: 'presetation',
      header: 'Empaque',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.unitsPerPackaging;
      },
      field: 'unitsPerPackaging',
      header: 'Número de unidades',
      display: 'table-cell'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return data.receivedPackaging.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return data.receivedPackaging.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      },
      header: 'Cantida de empaques',
      display: 'table-cell',
      field: 'receivedPackaging'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return (data.totalUnits = data.receivedPackaging * data.unitsPerPackaging).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
        else return (data.totalUnits = data.receivedPackaging * data.unitsPerPackaging).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      },
      header: 'Total unidades',
      display: 'table-cell',
      field: 'totalUnits'
    },
    {
      template: (data) => {
        if (data.indHeavy == true) return (data.unitMeditionCompany);
        else return ''
      },
      field: 'unitMeditionCompany',
      header: 'Medida predeterminada',
      display: 'table-cell'
    },
  ];
  constructor(public _servicePurchase: PurchaseorderService, public _service: MerchandiseReceptionService, public userPermissions: UserPermissions,
    private _productservice: ProductService, private messageService: MessageService, private _httpClient: HttpClient, private _complementaryservice: ComplementaryService,
    private _commonservice: CommonService, private _packingservice: PackingService, private _branchproduct: ProductbranchofficeService,
    private confirmationService: ConfirmationService, private readonly loadingService: LoadingService, public commonsrmService: CommonsrmService) {}
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.70;
    this.idCompany = this._Authservice.currentCompany;
    this.iduserlogin = this._Authservice.storeUser.id;
    this.idBranchoffice = this._Authservice.currentOffice;
    if (this.index == 0)
      this.onshow();
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }

  onshow() {
    this.loading = true;

    let filters = new ReceptionDetailFilter();
    filters.id = this.childReception == undefined ? this.reception.id : this.childReception.id //_idRECEPTION
    //this.loadingService.startLoading('wait_loading');
    this._service.getReceptionDetaillist(filters).subscribe((data: DetailReception[]) => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i].totalUnits = data[i].packaging.reduce((subtotal, item) => subtotal + item.totalUnits, 0);
        }
        this._detailproducts = data;
      } else
        this._detailproducts = [];
      this.loading = false;
      //this.loadingService.stopLoading(); 
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      //this.loadingService.stopLoading(); 
      this.messageService.add({
        severity: 'error',
        summary: 'Consulta',
        detail: "Ha ocurrido un error al cargar los datos"
      });
    });

    if (!this.isChieldReception)
      this.viewDashboard();
    //// dashborad
    this.config = this.commonsrmService.config;
    this.updateChartOptions();
    this.subscription = this.commonsrmService.configUpdate$.subscribe(config => {
      this.config = config;
      this.updateChartOptions();
    });
    ////////
    //this.drawgraph();

  }


  drawgraph() {
    this.basicData = {
      labels: ['A', 'B', 'C'],
      type: 'bar',
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726"
        ],
        hoverBackgroundColor: [
          "#64B5F6",
          "#81C784",
          "#FFB74D"
        ]
      }]
    };
  }
  SearchProduct(bar: string, references: string, input) {
    if (bar != "" || references != "") {

      this.filters = new ProductcomFilter();
      this.filters.companyId = this.idCompany // se debe pasar la compania logueada
      this.filters.barcode = bar;
      this.filters.internalRef = references;
      this.filters.active = 1;
      this.filters.indHeavy = -1;
      this.filters.idTypePacking = -1;
      this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
        if (data.length > 0) {
          if (data.length == 1) {
            this.catalogproduct = data;
            if (bar == "") {
              if (bar == "") {
                debugger
                this.catalogproduct = data;
                this._product.activeOffice = this.idBranchoffice;
                this._product.productId = this.catalogproduct[0].idProduct;
                this._product.product = this.catalogproduct[0].name;
                this._product.status = this.catalogproduct[0].status;
                this._product.receptionId = this.reception.id == undefined ? this.childReception.id : this.reception.id;
                this._product.purchaseId = this.reception.purchaseId == undefined ? this.childReception.purchaseId : this.reception.purchaseId;
                this._product.indLote = this.catalogproduct[0].indManejoLote;
                this._product.detailReceptionId = -1;
                this._product.areaId = this.reception.receptionAreaId == undefined ? this.childReception.areaId : this.reception.receptionAreaId;
                this._product.references = this.catalogproduct[0].reference;
                this._product.referencesearch = this.catalogproduct[0].reference;
                this._product.image = this.catalogproduct[0].image;
                this._product.detail.gtin = this.catalogproduct[0].bar;
                this._product.detail.gtinsearch = this.catalogproduct[0].bar;
                this._product.detail.presetation = this.catalogproduct[0].presentationPackage;
                this._product.detail.typePacking = this.catalogproduct[0].typackaging;
                this._product.indHeavy = this.catalogproduct[0].heavy;
                this._product.detail.typePackingId = this.catalogproduct[0].idpackagingtype;
                this._product.detail.unitsPerPackaging = this.catalogproduct[0].numberUnist;
                this._product.detail.packingId = this.catalogproduct[0].idPackag;
                this._product.detail.productId = this.catalogproduct[0].idProduct;
                this._product.detail.unitMeditionCompany = this.catalogproduct[0].unitMeditionCompany;
                this._product.detail.abreviationUnitComprany = this.catalogproduct[0].abreviationUnitComprany;
                this._product.detail.enviroment = this.catalogproduct[0].environmentId;
                this._product.detail.indLote = this.catalogproduct[0].indManejoLote;
                this._product.detail.receptionId = this.reception.id == undefined ? this.childReception.id : this.reception.id;
                this._product.detail.indHeavy = this.catalogproduct[0].heavy;
                this._product.detail.areaId = this.reception.receptionAreaId == undefined ? this.childReception.areaId : this.reception.receptionAreaId;

                if (this._product.indHeavy) {
                  this._product.detail.weightNeto = 0;
                  this._product.detail.weightTare = 0;
                  this._product.detail.weightGross = 0;
                }
                this.load(this._product.productId, true);
                let filter = new PurchaseReceptionFilter()
                filter.purchaseId = this.reception.purchaseId == undefined ? this.childReception.purchaseId : this.reception.purchaseId;
                filter.productId = this._product.productId
                this._service.getpurchaserecepction(filter)
                  .subscribe((data) => {
                    let dat = data;
                    if (dat.length > 0) {
                      this._product.purchaseReception.typepackingId = dat[0].typepackingId;
                      this._product.purchaseReception.packingId = dat[0].packingId;
                      this._product.purchaseReception.cost = dat[0].cost;
                      this._product.purchaseReception.invoicePackaging = dat[0].invoicePackaging;
                      this._product.purchaseReception.unitsPerInvoicePackaging = dat[0].unitsPerInvoicePackaging;
                      this._product.purchaseReception.totalunits = dat[0].totalunits;
                      this._product.purchaseReception.diferencesUnits = dat[0].diferencesUnits;
                    }
                  });
                debugger
                let filters = new PurchaseOrderProductFilter()
                filters.idProduct = this._product.productId;
                filters.idOrderPurchase = this.reception.purchaseOrderRelatedId == undefined ? this.childReception.purchaseOrderRelatedId : this.reception.purchaseOrderRelatedId;
                this._servicePurchase.getPurchaseOrderProductExpress(filters)
                  .subscribe((data) => {
                    let dat = data;
                    if (dat.length > 0) {
                      if (this._product.purchaseReception.typepackingId < 0) {
                        this._product.purchaseReception.typepackingId = dat[0].prices[0].idPackingType;
                        this._product.purchaseReception.packingId = dat[0].prices[0].idPacking;
                        this._product.purchaseReception.cost = dat[0].prices[0].baseCostNew;
                        this._product.purchaseReception.invoicePackaging = dat[0].prices[0].packingNumbers;
                        this._product.purchaseReception.unitsPerInvoicePackaging = dat[0].prices[0].unitsNumberPacking;
                        this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * this._product.purchaseReception.invoicePackaging;
                        this._product.purchaseReception.diferencesUnits = 0;
                      }
                      this._product.purchaseReception.unitsPurchaseOrder = dat[0].prices[0].totalUnits;
                    } else {
                      if (this._product.purchaseReception.typepackingId < 0) {
                        this._product.purchaseReception.typepackingId = this._product.detail.typePackingId;
                        this._product.purchaseReception.packingId = this._product.detail.packingId;
                        this._product.purchaseReception.unitsPerInvoicePackaging = this._product.detail.unitsPerPackaging;
                        this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * this._product.purchaseReception.invoicePackaging;
                        this._product.purchaseReception.diferencesUnits = 0;
                      }
                      this._product.purchaseReception.unitsPurchaseOrder = 0;

                      if (this.reception.purchaseOrderRelatedId > 0)
                        this.messageService.add({
                          severity: 'warn',
                          summary: 'Advertencia',
                          detail: "El producto no se encuentra registrado en la factura."
                        });

                    }
                    if(this._product.purchaseReception.cost==0 )
                       this.searchPricesCosts(this._product.productId,this._product.detail.packingId)
                    input.input.nativeElement.focus();

                  });

              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: "El producto no se encuentra registrado."
                });
                this._product = new DetailReception();
              }
            } else {
              debugger
              if (this.catalogproduct[0].bar.length == bar.length && bar != "") {
                this.catalogproduct = data;
                this._product.activeOffice = this.idBranchoffice;
                this._product.productId = this.catalogproduct[0].idProduct;
                this._product.product = this.catalogproduct[0].name;
                this._product.status = this.catalogproduct[0].status;
                this._product.receptionId = this.reception.id == undefined ? this.childReception.id : this.reception.id;
                this._product.purchaseId = this.reception.purchaseId == undefined ? this.childReception.purchaseId : this.reception.purchaseId;
                this._product.indLote = this.catalogproduct[0].indManejoLote;
                this._product.detailReceptionId = -1;
                this._product.areaId = this.reception.receptionAreaId == undefined ? this.childReception.areaId : this.reception.receptionAreaId;
                this._product.references = this.catalogproduct[0].reference;
                this._product.referencesearch = this.catalogproduct[0].reference;
                this._product.image = this.catalogproduct[0].image;
                this._product.detail.gtin = this.catalogproduct[0].bar;
                this._product.detail.gtinsearch = this.catalogproduct[0].bar;
                this._product.detail.presetation = this.catalogproduct[0].presentationPackage;
                this._product.detail.typePacking = this.catalogproduct[0].typackaging;
                this._product.indHeavy = this.catalogproduct[0].heavy;
                this._product.detail.typePackingId = this.catalogproduct[0].idpackagingtype;
                this._product.detail.unitsPerPackaging = this.catalogproduct[0].numberUnist;
                this._product.detail.packingId = this.catalogproduct[0].idPackag;
                this._product.detail.productId = this.catalogproduct[0].idProduct;
                this._product.detail.unitMeditionCompany = this.catalogproduct[0].unitMeditionCompany;
                this._product.detail.abreviationUnitComprany = this.catalogproduct[0].abreviationUnitComprany;
                this._product.detail.enviroment = this.catalogproduct[0].environmentId;
                this._product.detail.indLote = this.catalogproduct[0].indManejoLote;
                this._product.detail.receptionId = this.reception.id == undefined ? this.childReception.id : this.reception.id;
                this._product.detail.indHeavy = this.catalogproduct[0].heavy;
                this._product.detail.areaId = this.reception.receptionAreaId == undefined ? this.childReception.areaId : this.reception.receptionAreaId;

                if (this._product.indHeavy) {
                  this._product.detail.weightNeto = 0;
                  this._product.detail.weightTare = 0;
                  this._product.detail.weightGross = 0;
                }
                this.load(this._product.productId, true);
                let filter = new PurchaseReceptionFilter()
                filter.purchaseId = this.reception.purchaseId == undefined ? this.childReception.purchaseId : this.reception.purchaseId
                filter.productId = this._product.productId
                this._service.getpurchaserecepction(filter)
                  .subscribe((data) => {
                    let dat = data;
                    if (dat.length > 0) {
                      this._product.purchaseReception.typepackingId = dat[0].typepackingId;
                      this._product.purchaseReception.packingId = dat[0].packingId;
                      this._product.purchaseReception.cost = dat[0].cost;
                      this._product.purchaseReception.invoicePackaging = dat[0].invoicePackaging;
                      this._product.purchaseReception.unitsPerInvoicePackaging = dat[0].unitsPerInvoicePackaging;
                      this._product.purchaseReception.totalunits = dat[0].totalunits;
                      this._product.purchaseReception.diferencesUnits = dat[0].diferencesUnits;
                    }
                  });
                let filters = new PurchaseOrderProductFilter()
                filters.idProduct = this._product.productId;
                filters.idOrderPurchase = this.reception.purchaseOrderRelatedId == undefined ? this.childReception.purchaseOrderRelatedId : this.reception.purchaseOrderRelatedId;
                this._servicePurchase.getPurchaseOrderProductExpress(filters)
                  .subscribe((data) => {
                    let dat = data;
                    if (dat.length > 0) {
                      debugger
                      if (this._product.purchaseReception.typepackingId < 0) {
                        this._product.purchaseReception.typepackingId = dat[0].prices[0].idPackingType;
                        this._product.purchaseReception.packingId = dat[0].prices[0].idPacking;
                        this._product.purchaseReception.cost = dat[0].prices[0].baseCostNew;
                        this._product.purchaseReception.invoicePackaging = dat[0].prices[0].packingNumbers;
                        this._product.purchaseReception.unitsPerInvoicePackaging = dat[0].prices[0].unitsNumberPacking;
                        this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * this._product.purchaseReception.invoicePackaging;
                        this._product.purchaseReception.diferencesUnits = 0;
                      }
                      this._product.purchaseReception.unitsPurchaseOrder = dat[0].prices[0].totalUnits;
                    } else {
                      if (this._product.purchaseReception.typepackingId < 0) {
                        this._product.purchaseReception.typepackingId = this._product.detail.typePackingId;
                        this._product.purchaseReception.packingId = this._product.detail.packingId;
                        this._product.purchaseReception.unitsPerInvoicePackaging = this._product.detail.unitsPerPackaging;
                        this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * this._product.purchaseReception.invoicePackaging;
                        this._product.purchaseReception.diferencesUnits = 0;
                      }
                      this._product.purchaseReception.unitsPurchaseOrder = 0;

                      if (this.reception.purchaseOrderRelatedId > 0)
                        this.messageService.add({
                          severity: 'warn',
                          summary: 'Advertencia',
                          detail: "El producto no se encuentra registrado en la factura."
                        });
                    }
                    debugger
                    if(this._product.purchaseReception.cost==0 )
                       this.searchPricesCosts(this._product.productId,this._product.detail.packingId)
                    input.input.nativeElement.focus();
                  });


              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: "El producto no se encuentra registrado."
                });
                this._product = new DetailReception();

              }
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "El producto no se encuentra registrado."
            });
            this._product = new DetailReception();
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "El producto no se encuentra registrado."
          });
          this._product = new DetailReception();
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Ha ocurrido un error cargando el producto"
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Debe indicar la barra y/o referencia para buscar el producto"
      });
    }
  }

  onPasteBar(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (!(/^\d+$/.test(pastedText))) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "La barra que intentó ingresar, no es válida."
      });
      return false;
    }
  }
  load(id: number, isnew = false) {
    let filters: PackingFilter = new PackingFilter();
    filters.active = 1;
    filters.productId = id;
    this._packingservice.getPackingbyfilter(filters)
      .subscribe((data) => {
        data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
        this.packaginglist = data.map((item) => ({
          label: item.packingType.name + '-' + item.packagingPresentation.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
    var filter: ComplementaryFilter = new ComplementaryFilter()
    filter.productId = id;
    this._complementaryservice.getComplementary(filter)
      .subscribe((data) => {
        if (data.durabilitys.length >0) {
          let filterenv: AmbientFilter = new AmbientFilter();
          filterenv.active = 1;
          filterenv.idAmbient = -1;
          this._commonservice.getAmbient(filterenv)
            .subscribe((data) => {
              data = data.sort((a, b) => a.name.localeCompare(b.name));
              this.enviromentlist = data.map((item) => ({
                label: item.name,
                value: item.id
              }));
            }, (error) => {
              console.log(error);
            });
        }
      }, (error) => {
        console.log(error);
      });
  }
  changeEnviromet(id) {
    var filter: ComplementaryFilter = new ComplementaryFilter()
    filter.productId = this._product.productId;
    this._complementaryservice.getComplementary(filter)
      .subscribe((data) => {
        let days: any = data.durabilitys.filter(x => x.idAmbient == id)
        if (days != undefined) {
          if (days.length > 0) {
            this._product.detail.quantitydays = days[0].duration;
            this._product.detail.temperature = days[0].temperature
          } else {
            this._product.detail.quantitydays = 0;
            this._product.detail.temperature = 0
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  Calculatetotal(event) {
    if (event.value != "") {
      var quantity = event.value;
      if (quantity != null) {
        this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * quantity;
        this._product.purchaseReception.diferencesUnits = this._product.purchaseReception.totalunits - this._product.detail.totalUnits;
      } else {
        this._product.purchaseReception.totalunits = 0;
        this._product.purchaseReception.diferencesUnits = 0;
      }
    } else {
      event.value = this._product.indHeavy == true ? "0,000" : "0";
      this._product.purchaseReception.totalunits = 0;
      this._product.purchaseReception.diferencesUnits = 0;
    }
  }
  Calculatetotalreceived(event) {
    if (event.value != "") {
      var quantity = event.value;
      if (quantity != null) {
        if (this._product.indHeavy == true) {
          this._product.detail.weightGross = quantity - this._product.detail.weightTare;
          this._product.detail.totalUnits = this._product.detail.weightGross;
          this._product.detail.receivedPackaging = this._product.detail.weightGross;
        } else
          this._product.detail.totalUnits = this._product.detail.unitsPerPackaging * quantity;

        //if(this._product.purchaseReception.diferencesUnits==0)
        this._product.purchaseReception.diferencesUnits = this._product.purchaseReception.totalunits - this._product.detail.totalUnits;
        //  else
        //    this._product.purchaseReception.diferencesUnits= this._product.detail.totalUnits-this._product.purchaseReception.diferencesUnits;
      } else {
        if (this._product.indHeavy == true) {
          this._product.detail.weightGross = 0;
          this._product.detail.totalUnits = 0;
          this._product.purchaseReception.diferencesUnits = 0;
        } else {
          this._product.detail.totalUnits = 0;
          this._product.purchaseReception.diferencesUnits = 0;
        }
      }
    } else {
      event.value = this._product.indHeavy == true ? "0,000" : "0";
      if (this._product.indHeavy == true) {
        this._product.detail.weightGross = 0;
        this._product.detail.totalUnits = 0;
        this._product.purchaseReception.diferencesUnits = 0;
      } else {
        this._product.detail.totalUnits = 0;
        this._product.purchaseReception.diferencesUnits = 0;
      }
    }
  }
  clear(event) {
    if (event.target.value == "0,000") {
      event.target.value = 0;
    }
    if (event.target.value == "") {
      event.target.value = 0;
    }
  }
  removeselected(order: DetailReception) {}
  changepackage(event) {
    let filters: PackingFilter = new PackingFilter();
    filters.active = 1;
    filters.productId = this._product.productId;
    filters.id = event.value;
    this._packingservice.getPackingbyfilter(filters).subscribe((data) => {
      this.packing = data[0];
      this.filters = new ProductcomFilter();
      this.filters.companyId = this.idCompany // se debe pasar la compa�ia logueada
      this.filters.barcode = this.packing.barcode;
      this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
        if (data.length > 0) {
          this.catalogproduct = data;
          this.load(this._product.productId);
          this._product.purchaseReception.typepackingId = this.catalogproduct[0].idpackagingtype;
          this._product.purchaseReception.packingId = this.catalogproduct[0].idPackag;
          this._product.purchaseReception.unitsPerInvoicePackaging = this.catalogproduct[0].numberUnist;
          this._product.purchaseReception.totalunits = this._product.purchaseReception.unitsPerInvoicePackaging * this._product.purchaseReception.invoicePackaging;
          this._product.purchaseReception.diferencesUnits = this._product.purchaseReception.totalunits - this._product.detail.totalUnits;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "El producto no se encuentra registrado."
          });
          //this._product = new DetailReception();
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Ha ocurrido un error cargando el producto"
        });
      });
    }, (error) => {
      console.log(error);
    });

  }
  changepackagreception(event) {
    let filters: PackingFilter = new PackingFilter();
    filters.active = 1;
    filters.productId = this._product.productId;
    filters.id = event.value;
    this._packingservice.getPackingbyfilter(filters).subscribe((data) => {
      this.packing = data[0];
      this.filters = new ProductcomFilter();
      this.filters.companyId = this.idCompany // se debe pasar la compa�ia logueada
      this.filters.barcode = this.packing.barcode;
      this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
        if (data.length > 0) {
          this.catalogproduct = data;
          this.load(this._product.productId);
          this._product.detail.typePackingId = this.catalogproduct[0].idpackagingtype;
          this._product.detail.packingId = this.catalogproduct[0].idPackag;
          this._product.detail.unitsPerPackaging = this.catalogproduct[0].numberUnist;
          this._product.detail.typePacking = this.catalogproduct[0].typackaging;
          this._product.detail.presetation = this.catalogproduct[0].presentationPackage;
          this._product.detail.gtin = this.catalogproduct[0].bar;
          this._product.activeOffice = this.idBranchoffice;
          this._product.detail.totalUnits = this._product.detail.unitsPerPackaging * this._product.detail.receivedPackaging;
          this._product.purchaseReception.diferencesUnits = this._product.purchaseReception.totalunits - this._product.detail.totalUnits;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "El producto no se encuentra registrado."
          });
          //this._product = new DetailReception();
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Ha ocurrido un error cargando el producto"
        });
      });
    }, (error) => {
      console.log(error);
    });

  }
  clearmodel() {
    this.submitted = false;
    this._product = new DetailReception()
    this.bar.nativeElement.focus();
  }
  addrecept() {
    this.submitted = true;

    if (this._product.indHeavy) {
      if (this._product.indLote == true && this._product.detail.lots.length > 0) {
        if (this._product.detail.weightGross > 0 && this._product.purchaseReception.packingId > 0 && this._product.purchaseReception.invoicePackaging > 0 && this._product.purchaseReception.cost > 0)
          this.validateadd();
      } else if (this._product.indLote == false) {
        if (this._product.detail.weightGross > 0 && this._product.purchaseReception.packingId > 0 && this._product.purchaseReception.invoicePackaging > 0 && this._product.purchaseReception.cost > 0)
          this.validateadd();
      }
    } else {
      if (this._product.indLote == true && this._product.detail.lots.length > 0) {
        if (this._product.detail.receivedPackaging > 0 && this._product.purchaseReception.packingId > 0 && this._product.purchaseReception.invoicePackaging > 0 && this._product.purchaseReception.cost > 0)
          this.validateadd();
      } else if (this._product.indLote == false) {
        if (this._product.detail.receivedPackaging > 0 && this._product.purchaseReception.packingId > 0 && this._product.purchaseReception.invoicePackaging > 0 && this._product.purchaseReception.cost > 0)
          this.validateadd();
      }
    }
  }
  validateadd() {
    var filter: ValidateProductActiveFilter = new ValidateProductActiveFilter();
    filter.idProduct = this._product.productId;
    filter.idPacking = this._product.detail.packingId;
    filter.idBranchOffice = this.idBranchoffice //se estapasado la sucucrsal 1 por defecto

    this._branchproduct.getvalidateProductActive(filter)
      .subscribe((data) => {
        this.validateActive = data[0];
        this._product.status = this.validateActive.active;
        if (this._product.status == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "El producto no se encuentra activo en la sucursal."
          });
        } else {
          this.addproduct(this._product);
        }
      }, (error) => {
        console.log(error);
      });
  }
  onRowSelect(event) {
    let selected = this._detailproducts.find(x => x.productId == this.selecteditem.productId);
    let selected1 = selected.packaging.filter(p => p.packingId == this.selecteditem.packingId)[0];
    selected.detail = selected1;
    selected.detail.gtinsearch = selected.detail.gtin;
    selected.referencesearch = selected.references;
    this._product = selected;
    this._product.purchaseReception.totalunits = this._product.purchaseReception.invoicePackaging * this._product.purchaseReception.unitsPerInvoicePackaging;
    this.load(this._product.productId);
    if (this._product.detail.lots.length > 0) {
      if (this._product.detail.numberlots != null) {
        this._product.detail.numberlots = "";
      }
      for (let i = 0; i < this._product.detail.lots.length; i++) {
        this._product.detail.numberlots = this._product.detail.numberlots == null ? "" : "";
        this._product.detail.numberlots = this._product.detail.numberlots == "" ? this._product.detail.lots[i].numberLot : this._product.detail.numberlots + "," + this._product.detail.lots[i].numberLot;
      }
      this.messageService.add({
        severity: 'info',
        summary: 'Informacion',
        detail: "Si desea editar la cantidad recibida de este registro,debe dirigirse al tab  de lotes."
      });
    }
    this.selection.emit({
      detail: this._product
    });

  }
  onRowUnselect(event) {
    this._product = new DetailReception();
    this.selection.emit({
      detail: this._product
    });
  }
  addproduct(_product: DetailReception) {
    if (_product.status == 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: "El producto se encuentra desincorporado en la sucursal."
      });
      this._product = new DetailReception();
    }
    if (_product.status != 2) //si es diferente de desincorporado
    {
      if (this._detailproducts.findIndex(x => x.productId == _product.productId) == -1) {
        let detail = _product.detail;
        if (_product.indHeavy == false)
          detail.measurementPresentation = 'N/A';
        else {
          detail.receivedPackaging = detail.weightGross;
          detail.measurementPresentation = _product.measurementPresentation;
        }
        this._product.packaging.push(detail);
        this._detailproducts.push(_product);

        this._service.SaveDetail(this._product).subscribe((data: number) => {
          if (data > 0) {

            this.messageService.add({
              severity: 'success',
              summary: 'Guardado',
              detail: "Guardado exitoso."
            });
            this.submitted = false;
            this._product = new DetailReception();
            this.onshow();
            this.haveproduct = true;
            this.haveChange.emit(this.haveproduct);
          } else
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Ha ocurrido un error al guardar los datos."
            });
        }, (error: HttpErrorResponse) => {
          this.submitted = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Ha ocurrido un error al guardar los datos."
          });
        });

      } else {
        let selected = this._detailproducts.find(x => x.productId == _product.productId);
        let selected1 = selected.packaging.filter(p => p.packingId == _product.detail.packingId)[0];
        if (selected.detail == undefined)
          selected.detailReceptionId = -1;
        else
          selected.detailReceptionId = selected.detail.detailReceptionId;
        if (selected1 == undefined) {
          selected.detail = _product.detail;
          if (_product.indHeavy == false)
            selected.detail.measurementPresentation = 'N/A';
          else {
            selected.detail.receivedPackaging = selected.detail.weightGross;
            selected.detail.measurementPresentation = _product.measurementPresentation;
          }

          selected.packaging = [];
          selected.packaging.push(selected.detail);
          this._service.SaveDetail(selected).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: "Guardado exitoso."
              });
              this.submitted = false;
              this.onshow();
              this._product = new DetailReception();
              this.haveproduct = true;
              this.haveChange.emit(this.haveproduct);
            } else
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Ha ocurrido un error al guardar los datos."
              });
          }, (error: HttpErrorResponse) => {
            this.submitted = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Ha ocurrido un error al guardar los datos."
            });
          });
        } else {
          if (_product.indHeavy == true) {
            if (_product.detailReceptionId == -1)
              selected1.receivedPackaging = selected1.weightGross + _product.detail.weightGross;
            else
              selected1.receivedPackaging = _product.detail.weightGross;
          } else {
            if (_product.detailReceptionId == -1)
              selected1.receivedPackaging = selected1.receivedPackaging + _product.detail.receivedPackaging;
            else
              selected1.receivedPackaging = _product.detail.receivedPackaging
          }

          selected1.totalUnits = selected1.receivedPackaging * _product.detail.unitsPerPackaging;
          selected.packaging = selected.packaging.filter(p => p.packingId == _product.detail.packingId);
          this._service.SaveDetail(selected).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: "Guardado exitoso."
              });
              this.submitted = false;
              this.onshow();
              this._product = new DetailReception();
              this.haveproduct = true;
              this.haveChange.emit(this.haveproduct);
            } else
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Ha ocurrido un error al guardar los datos."
              });
          }, (error: HttpErrorResponse) => {
            this.submitted = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Ha ocurrido un error al guardar los datos."
            });
          });
        }
      }
    }
  }
  //#region pesos tara
  onSubmitWegthTara(data) {
    if (data != null) {
      this._product.detail.weightTare = data.total;
      this._product.detail.weightGross = this._product.detail.weightNeto - this._product.detail.weightTare;
      this._product.detail.receivedPackaging = this._product.detail.weightGross;
      this._product.detail.totalUnits = this._product.detail.receivedPackaging * this._product.detail.unitsPerPackaging;
      this._product.purchaseReception.diferencesUnits = this._product.purchaseReception.totalunits - this._product.detail.totalUnits;
    }
  }
  onHidetWeigthTara(visible: boolean) {
    this.weigthVisible = visible;
  }
  showmodal() {
    this.weigthVisible = true;
  }
  //#endregion
  //#region  diferencias
  showmodalDiferences(data: DetailReception) {
    this.diferencesVisible = true;
    this.detailselected = data;
  }
  onHideDiferences(visible: boolean) {
    this.diferencesVisible = visible;
  }
  //#endregion
  //#region lotes
  onToggleLot(visible: boolean) {
    this.LotDialogVisible = visible;
  }
  onToggleLotProduct(visible: boolean) {
    this.LotsProductVisible = visible;
  }


  receivedLotNews(data) {
    if (data != null) {
      for (let i = 0; i < data.selectedLots.length; i++) {
        this._product.detail.numberlots = this._product.detail.numberlots == null ? "" : this._product.detail.numberlots;
        this._product.detail.numberlots = this._product.detail.numberlots == "" ? data.selectedLots[i].numberLot : this._product.detail.numberlots + "," + data.selectedLots[i].numberLot;
        this._product.detail.lots.push(data.selectedLots[i]);
      }
    }
  }
  receivedLotProduct(data) {
    if (data != null) {
      for (let i = 0; i < data.selectedLots.length; i++) {

        if (this._product.packaging.length > 0) {

          for (let j = 0; j < this._product.packaging.length; j++) {
            if (this._product.packaging[j].lots.length > 0) {
              if (this._product.packaging[j].lots.findIndex(x => x.id == data.selectedLots[i].id) == -1) {

                this._product.detail.lots.push(data.selectedLots[i]);
                this._product.detail.numberlots = this._product.detail.numberlots == null ? "" : this._product.detail.numberlots;
                this._product.detail.numberlots = this._product.detail.numberlots == "" ? data.selectedLots[i].numberLot : this._product.detail.numberlots + "," + data.selectedLots[i].numberLot;
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: "El lote ya asociado."
                });

              }
            } else {
              this._product.detail.numberlots = this._product.detail.numberlots == null ? "" : this._product.detail.numberlots;
              this._product.detail.numberlots = this._product.detail.numberlots == "" ? data.selectedLots[i].numberLot : this._product.detail.numberlots + "," + data.selectedLots[i].numberLot;
              this._product.detail.lots.push(data.selectedLots[i]);
            }

          }
        } else {

          this._product.detail.numberlots = this._product.detail.numberlots == null ? "" : this._product.detail.numberlots;
          this._product.detail.numberlots = this._product.detail.numberlots == "" ? data.selectedLots[i].numberLot : this._product.detail.numberlots + "," + data.selectedLots[i].numberLot;
          this._product.detail.lots.push(data.selectedLots[i]);
        }

      }
    }
  }
  //#endregion

  //#region  dashboard
  updateChartOptions() {
    this.chartOptions = this.config && this.config.dark ? this.getDarkTheme() : this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      }
    }
  }

  viewDashboard() {

    this._service.getDashboard(this.reception).subscribe((data: ReceptionDashboard[]) => {
      if (data != null) {
        if (data[0].packing[0] == undefined) {
          this.packingindividual = new ReceptionDashboardPacking;
          this.packingindividual.typePacking = "Individual";
          this.packingmaster = new ReceptionDashboardPacking;
          this.packingmaster.typePacking = "Master";
        } else {
          if (data[0].packing[0].typePacking == "Master") {
            this.packingindividual = new ReceptionDashboardPacking;
            this.packingindividual.typePacking = "Individual";
            this.packingmaster = data[0].packing[0];
            this.packingmaster.typePacking = data[0].packing[0].typePacking;
          } else {
            this.packingindividual = data[0].packing[0];
            this.packingindividual.typePacking = data[0].packing[0].typePacking;
            if (data[0].packing[1] == undefined) {
              this.packingmaster = new ReceptionDashboardPacking;
              this.packingmaster.typePacking = "Master";
            } else {
              this.packingmaster = data[0].packing[1];
              this.packingmaster.typePacking = data[0].packing[1].typePacking;
            }
          }

        }
        this.heavy = data[0].heavy[0] == undefined ? new ReceptionDashboardPacking : data[0].heavy[0];
        this.cubing = data[0].cubing[0] == undefined ? new ReceptionDashboardPacking : data[0].cubing[0];
        this.unitreceived = data[0].received[0] == undefined ? new ReceptionDashboardReceived : data[0].received[0];;
        this.graphiccategory(data[0].category);
        this.graphicdiferences(data[0].diferences);
      } else
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Ha ocurrido un error al guardar los datos."
        });
    }, (error: HttpErrorResponse) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Ha ocurrido un error al guardar los datos."
      });
    });
  }

  graphiccategory(categorys: ReceptionDashboardCategory[]) {
    let labelscategory: string[] = [];
    let valuescategory: number[] = [];
    let colourcategory: string[] = [];
    labelscategory = categorys.map(x => x.category);
    valuescategory = categorys.map(x => x.quantity);
    colourcategory = categorys.map(x => x.colour);
    this.data = {
      labels: labelscategory,
      datasets: [{
        data: valuescategory,
        backgroundColor: colourcategory,
        //hoverBackgroundColor:"#64B5F6", 
      }]
    };


  }
  graphicdiferences(diferences: ReceptionDashboardDiferences[]) {
    let labelsdiferences: string[] = [];
    let valuesdiferences: number[] = [];
    let coloursdiferences: string[] = [];
    labelsdiferences = diferences.map(x => x.motive);
    valuesdiferences = diferences.map(x => x.totalUnitsperMotive);
    coloursdiferences = diferences.map(x => x.colour);
    this.totaldiferences = diferences.reduce((subtotal, item) => subtotal + item.totalUnitsperMotive, 0)
    this.datadiferences = {
      labels: labelsdiferences,
      datasets: [{
        data: valuesdiferences,
        backgroundColor: coloursdiferences,
        //hoverBackgroundColor:"#64B5F6", 
      }]
    };
  }
  //#endregion

  allowAddNew() {
    if (this.childReception != undefined)
      return ((this.reception.estatus <= this.statusreception.started && !this.isChieldReception && this.userPermissions.allowed(this.permissionsIDs.EDIT_RECEPTION_VDR_PERMISSION_ID) && this.iduserlogin == this.reception.receivingOperator.id) ||
        (this.childReception.statusId == this.statusreception.started && this.isChieldReception && this.userPermissions.allowed(this.permissionsIDs.UPDATE_CHILD_RECEPTIONS_ID) && this.iduserlogin == this.childReception.receivingOperatorId));
    else
      return ((this.reception.estatus <= this.statusreception.started && !this.isChieldReception && this.userPermissions.allowed(this.permissionsIDs.EDIT_RECEPTION_VDR_PERMISSION_ID) && this.iduserlogin == this.reception.receivingOperator.id))

  }
  next(input) {
    if (input.input != undefined)
      input.input.nativeElement.focus();
    else
      input.nativeElement.focus();
  }

  searchPricesCosts(idproduct: number,idpacking:number){
    let filter=new PackingByBranchOfficeFilter()
    filter.idBranchOffice = this._Authservice.currentOffice;
    filter.idProduct = idproduct;
    filter.idPacking=idpacking;
    this._branchproduct.getPackingBranchOfficebyfilter(filter).subscribe((data: PackingByBranchOffice[]) => {
      debugger
      if(data.length>0)
   
         this._product.purchaseReception.cost = data[0].baseCost;
      else
         this._product.purchaseReception.cost=0
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los precios y costos"});
    });
  }
}