import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Motives } from 'src/app/models/masters/motives';
import { ConsingmentInvoice } from 'src/app/models/srm/consingmentinvoice/consingmentinvoices';
import { InvoiceStatus } from 'src/app/models/srm/reception';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ConsingmentInvoiceFilter } from '../../shared/filters/consigment-invoice/consigmentinvoicefilter';
import { ConsigmentinvoiceService } from '../../shared/services/consignmnet-invoice/consigmentinvoice.service';
import { MenuTabOrder } from '../../shared/Utils/menu-tab-order';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ConsignmentInvoiceHeaderComponent } from './consignment-invoice-header/consignment-invoice-header.component';

@Component({
  selector: 'app-consigment-invoice-panel',
  templateUrl: './consigment-invoice-panel.component.html',
  styleUrls: ['./consigment-invoice-panel.component.scss'],
  providers: [DatePipe]
})
export class ConsigmentInvoicePanelComponent implements OnInit {

  items: MenuItem[];
  activeIndex: number = 0;
  indmenu: number = 0;
  indInitTime: boolean = false;
  indInitResu: boolean = false;
  indInitPause: boolean = false;
  @Input("invoice") invoice: ConsingmentInvoice = new ConsingmentInvoice();
  @Input("iduserlogin") iduserlogin: number = -1;
  @Input("rateold") rateold: number = 0;
  showproduct: boolean = false;
  _idOrderPurchase: number = -1;
  _indConsignment: number = -1;
  _idSupplier: number = -1;
  id: number = 0;
  index: number = 0;
  submitted: boolean;
  location;
  _idCompany: number = 1;//seteado 1 debe ser la empresa que se esta logueado
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;
  isReceived: boolean = false;
  menuTabOrder: typeof MenuTabOrder = MenuTabOrder;
  status: typeof InvoiceStatus = InvoiceStatus;
  isSave: boolean = true;
  isdisabled: boolean = true;
  showDialog: boolean = false;
  filtersOfValues: ConsingmentInvoiceFilter[] = [];
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  showReason: boolean = false;
  reason: Motives = new Motives();
  showTabProducts: boolean = false;
  @ViewChild(ConsignmentInvoiceHeaderComponent) invoiceHeader: ConsignmentInvoiceHeaderComponent;
 
  constructor(private messageService: MessageService,
    public breadcrumbService: BreadcrumbService,
    private actRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public service: ConsigmentinvoiceService,
    private _httpClient: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,) {

    this.breadcrumbService.setItems([
      { label: 'SCM' },
      { label: 'SRM', routerLink: ['/srm/dashboard-general-srm'] },
      { label: 'Factura consignación', routerLink: ['/srm/consingment-invoice-list'] }
    ]);
  }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.id = Number(this.actRoute.snapshot.params['id']);
    if (this.filtersOfValues.length > 0) {
      this.filtersOfValues = this.filtersOfValues;
    } else {
      if (history.state.queryParams != undefined) {
        const filters = history.state.queryParams.purchasefilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (filters === null) {
          this.filtersOfValues = [];
        } else {
          this.filtersOfValues = JSON.parse(filters);

          sessionStorage.setItem('searchParameters', filters)
        }
      } else {
        this.filtersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
    }
    debugger
    this.iduserlogin = this._Authservice.idUser;
    this._idCompany = this._Authservice.currentCompany
    this.indmenu = 0;
    this.items = [{
      label: 'Datos generales',
      command: (event: any) => {
        this.activeIndex = 0;    
      }
    },
    {
      label: 'Productos',
    },
    {
      label: 'Resumen',
    }
    ];
    if (this.id> 0)
      this.isdisabled = false;
      // this.purchaseHeader.Save();
  }

  handleChange(e) {
    // if (this.purchaseOrderProductsComponent.isSave == false)
    //   this.purchaseOrderProductsComponent.save(false);

    // this.index = e.index;
    // if (this.index == 1) {
    //   this._idOrderPurchase = this.PucharseOrderHeader.purchase.idOrderPurchase;
    //   this.showproduct = true;
    //   this.purchaseOrderProductsComponent.onShow()

    // } else if (this.index == 0) {
    //   this.purchaseOrderProductsComponent.selecteditem = new PurchaseOrderProduct();
    //   this.purchaseOrderProductsComponent.triggerFalseClick();
    // } else if (this.index == 2) {
    //   this.distributedPurchaseOrderComponent.onShow();
    // }
    // if (this.index == 3) {
    //   this.purchaseOrderReceivedListComponent.loadTable();
    // }
  }

  PlayTask() {
    this.cdTimer.start();
    this.indInitTime = true;
    this.indInitPause = true;
  }

  PauseTask() {
    this.cdTimer.stop();
    this.indInitPause = false;
    this.indInitResu = true;
  }

  ResumeTask() {
    this.cdTimer.resume();
    this.indInitPause = true;
    this.indInitResu = false;
    this.cdTimer.get();

  }
  Save() {
    debugger
    this.invoiceHeader.Save();  
  }

checkAuthorizedBy(): boolean{
   if(this.iduserlogin !== this.invoice.idResponsibleOperator){ 
    if(this.iduserlogin === this.invoice.idValidationOperator){
      return true
    }
  }
   if(this.iduserlogin === this.invoice.idValidationOperator){
    return true
  }
}

start() {
  this.invoiceHeader.changeStatus(this.status.started, undefined);
}
elaborated() {
       this.confirmationService.confirm({
         header: 'Confirmación',
         icon: 'pi pi-exclamation-triangle',
         message: '¿Está seguro que desea finalizar el documento?.',
         accept: () => {
           this.invoiceHeader.changeStatus(this.status.finalized, undefined);
         },
       });
    
}

Authorized() {
       this.confirmationService.confirm({
         header: 'Confirmación',
         icon: 'pi pi-exclamation-triangle',
         message: '¿Está seguro que desea autorizar el documento?.',
         accept: () => {
           this.invoiceHeader.changeStatus(this.status.validated, undefined);
         },
       });
}

canceled() { this.confirmationService.confirm({
     header: 'Confirmación',
     icon: 'pi pi-exclamation-triangle',
     message: '¿Está seguro que desea anular el documento?',
     accept: () => {
       this.invoiceHeader.changeStatus(this.status.reject, undefined);
     },
   });
}

onToggleReason(visible: boolean) {
  this.showReason = visible;
  this.invoice.idReason = this.reason.id;
  this.invoice.description = this.reason.name;
  if (this.invoice.idReason> 0)
    this.invoiceHeader.changeStatus(this.status.reject, this.invoice);
}

back = () => {
  if (this.invoiceHeader.isEditHeader == true) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
      accept: () => {
        const queryParams: any = {};
        queryParams.purchasefilters = JSON.stringify(this.filtersOfValues);
        const navigationExtras: NavigationExtras = {
          queryParams
        };
        this.router.navigate(['srm/consingment-invoice-list'], navigationExtras);
      },
    });
  }
  else {
    const queryParams: any = {};
    queryParams.purchasefilters = JSON.stringify(this.filtersOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['srm/consingment-invoice-list'], navigationExtras);
  }

}

}
