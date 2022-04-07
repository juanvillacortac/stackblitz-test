import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ConsingmentInvoiceFilter
} from '../../shared/filters/consigment-invoice/consigmentinvoicefilter';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import {
  ConsingmentInvoiceList
} from '../../shared/filters/consigment-invoice/consigmentinvoicelis';
import {
  UserPermissions
} from 'src/app/modules/security/users/shared/user-permissions.service';
import {
  ActivatedRoute,
  NavigationExtras,
  Router
} from '@angular/router';
import {
  BreadcrumbService
} from 'src/app/design/breadcrumb.service';
import {
  DatePipe,
  DecimalPipe
} from '@angular/common';
import {
  MenuItem,
  MessageService
} from 'primeng/api';
import {CoinsService} from 'src/app/modules/masters/coin/shared/service/coins.service';
import {ColumnD} from 'src/app/models/common/columnsd';
import { ConsigmentinvoiceService } from '../../shared/services/consignmnet-invoice/consigmentinvoice.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { InvoiceStatus } from 'src/app/models/srm/reception';


@Component({
  selector: 'app-consignment-ivoice-list',
  templateUrl: './consignment-ivoice-list.component.html',
  styleUrls: ['./consignment-ivoice-list.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ConsignmentIvoiceListComponent implements OnInit {

  idate: Date = new Date();
  showFilters: boolean = false;
  loading: boolean = false;
  submitted: boolean;
  coinBase: string = "";
  coinConversion: string = "";
  filters: ConsingmentInvoiceFilter = new ConsingmentInvoiceFilter();
  filtersSearch: ConsingmentInvoiceFilter = new ConsingmentInvoiceFilter();
  listfilters: ConsingmentInvoiceFilter[] = [];
  permissions: number[] = [];
  permissionsIDs = {
    ...Permissions
  };
  userDialogVisible: boolean = false;
  idcompany: number;
  idsupplier: number;
  ProductCatalogDialogVisible = false;
  PurchaseOrderDialogVisible = false;
  modalShow = false;
  invoiceStatus = InvoiceStatus.pending;
  fcSelected = new ConsingmentInvoiceList();
  @Input() supplierViewer = false;
  @ViewChild('dt', {
    static: false
  }) dt: any;
  receptionStatusOptions: MenuItem[] = [];
  items1: MenuItem[] = [];
  items: MenuItem[] = [
  {label: 'Iniciar', icon: 'pi pi-play',visible: this.userPermissions.allowed(this.permissionsIDs.CREATE_CONSIGNMENT_INVOICE_PERMISSION_ID), command: () => {
    this.invoiceStatus = InvoiceStatus.started;
    this.modalShow = true;
}},
{label: 'Planificar', icon: 'pi pi-calendar-plus', visible: this.userPermissions.allowed(this.permissionsIDs.CREATE_CONSIGNMENT_INVOICE_PERMISSION_ID) ,command: () => {
  this.invoiceStatus = InvoiceStatus.pending;
  this.modalShow = true;
}} ];
  displayedColumns: ColumnD <ConsingmentInvoiceList> [] = [
    //  {template: (data) => { return data.idProductSupplier; }, header: 'Id',field: 'idProductSupplier', display: 'none'},
    {field: 'edit', header: ' ', display: 'table-cell'},
    {
     
      template: (data) => {
        return data.numberFC;
      },
      field: 'numberFC',
      header: 'Número de factura',
      display: 'table-cell'
    },
    // {
    //   template: (data) => {
    //     return data.area;
    //   },
    //   field: 'area',
    //   header: 'Área de recepción',
    //   display: 'table-cell'
    // },
    {
      template: (data) => {
        return data.numberInvoice;
      },
      field: 'numberInvoice',
      header: 'Factura',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.numberDocument;
      },
      field: 'numberDocument',
      header: 'Número de documento',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.coin;
      },
      field: 'coin',
      header: 'Móneda de pago',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.status;
      },
      field: 'status',
      header: 'Estatus',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.wayToPay;
      },
      field: 'wayToPay',
      header: 'Forma de pago',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.typeFC;
      },
      field: 'typeFC',
      header: 'Tipo de FC',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.exchangeRate;
      },
      field: 'exchangeRate',
      header: 'Tasa de cambio',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.cantItems;
      },
      field: 'cantItems',
      header: 'Cantidad de ítems',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.responsibleOperator;
      },
      field: 'responsibleOperator',
      header: 'Responsable',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.authorizeOperator;
      },
      field: 'approvedby',
      header: 'Autorizada por',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.createdby;
      },
      field: 'createdby',
      header: 'Creado por',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return this.decimalPipe.transform(data.amountInvoice, '.4');
      },
      field: 'amountInvoice',
      header: 'Monto factura base ',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return this.decimalPipe.transform(data.amountBase, '.4');
      },
      field: 'amountBase',
      header: 'Monto total base ',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return this.decimalPipe.transform(data.amountInvoiceConvertion, '.4');
      },
      field: 'amountInvoiceConvertion',
      header: 'Monto factura conversión ',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return this.decimalPipe.transform(data.amountConvertion, '.4');
      },
      field: 'amountConvertion',
      header: 'Monto total conversión ',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy");
      },
      field: 'dateCreate',
      header: 'Fecha de creación',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.startDate == undefined ? "" : this.datepipe.transform(data.startDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.startDate, "dd/MM/yyyy");
      },
      field: 'startDate',
      header: 'Fecha de inicio',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.finalizeDate == undefined ? "" : this.datepipe.transform(data.finalizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.finalizeDate, "dd/MM/yyyy");
      },
      field: 'finalizeDate',
      header: 'Fecha de finalización',
      display: 'table-cell'
    },
    {
      template: (data) => {
        return data.authorizeDate == undefined ? "" : this.datepipe.transform(data.authorizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.authorizeDate, "dd/MM/yyyy");
      },
      field: 'dateUpdate',
      header: 'Fecha de autorización',
      display: 'table-cell'
    }

  ];
  _selectedColumns: any[];
  constructor(public breadcrumbService: BreadcrumbService, private messageService: MessageService,private _httpClient: HttpClient,
    private coinsService: CoinsService, private router: Router,public  _service:ConsigmentinvoiceService ,  private readonly loadingService: LoadingService,
    public datepipe: DatePipe, private decimalPipe: DecimalPipe, public userPermissions: UserPermissions, private activatedRoute: ActivatedRoute) {
    this.breadcrumbService.setItems([{
        label: 'SOM'
      },
      {
        label: 'SCM',
        routerLink: ['/srm/dashboard-general-srm']
      },
      {
        label: 'Factura consignación',
        routerLink: ['/srm/consingment-invoice-list']
      }
    ]);
  }
  _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this._selectedColumns = this.displayedColumns;
    this.searchCoinsComp();
    const filters = this.activatedRoute.snapshot.queryParamMap.get('filters');

    const filtersState = history.state.queryParams?.filters;

    if(filtersState) {
      this.listfilters = filtersState;
      this.filters = this.listfilters[0];
      this.filtersSearch = this.listfilters[1];
    } else {
      if (filters === null) {
        this.listfilters = [];
        this._service._list=[];
      } else {
        this.listfilters = JSON.parse(filters);
        this.filters = this.listfilters[0];
        this.filtersSearch = this.listfilters[1];
        this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
      }
    }
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
  openNew = () => {
    const queryParams: any = {};
    this.listfilters = [];
    this.listfilters.push(this.filters);
    this.listfilters.push(this.filtersSearch);
    queryParams.purchasefilters = JSON.stringify(this.listfilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['srm/consingment-invoice', 0], {state: navigationExtras});
  
  }
  clickSearch(){
    this.filtersSearch = {
      id:this.filters.id,
      numberFC: this.filters.numberFC,
      typeFC: this.filters.typeFC,
      idbranchOffice:this._Authservice.currentOffice,
      numberDocument: this.filters.numberDocument,
      //numberRecepcion:this.filters.numberRecepcion,
      idSuppliers: this.filters.idSuppliers,
      receptionOperator: this.filters.receptionOperator,
      //validationOperator: this.filters.validationOperator,
      idStatus: this.filters.idStatus,
      idWayToPay: this.filters.idWayToPay,
      idCoin: this.filters.idCoin,
      idTypeDate: this.filters.idTypeDate,
      initialDate: this.filters.initialDate,
      finalDate: this.filters.finalDate,
      idRange:this.filters.idRange
    }
    this.filters;
    this.search();
  }

  search() {
    this.loading = true;
    if(this.dt !=undefined){
      this.dt.first=0;
      this.dt.sortField="";
  }   
    this.loadingService.startLoading();
    this._service.getinvoicelist(this.filters).subscribe((data: ConsingmentInvoiceList[]) => {
      this._service._list = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
      this.loading = false;
      this.loadingService.stopLoading()
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.loadingService.stopLoading()
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  public childCallBack(result: number): void {
    this.modalShow = false;
    if(result > 0) {
      this.router.navigate(['/srm/consingment-invoice', result], {state: this.getFilters()});
    }
}
private getFilters() {
  const queryParams: any = {};
  queryParams.receptionFilters = JSON.stringify(this.filters);
  queryParams.dir = this.supplierViewer ? '/srm/viewer-document':'/srm/consingment-invoice-list';
  const navigationExtras: NavigationExtras = {
    queryParams
  };
  return navigationExtras;
}
edit(id) {
  const queryParams: any = {};
  this.listfilters = [];
  this.listfilters.push(this.filters);
  this.listfilters.push(this.filtersSearch);
  queryParams.purchasefilters = JSON.stringify(this.listfilters);
  const navigationExtras: NavigationExtras = {
    queryParams
  };
  this.router.navigate(['/srm/consingment-invoice', id], {state: navigationExtras});
}

}