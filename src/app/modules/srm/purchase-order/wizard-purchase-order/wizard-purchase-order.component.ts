import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { id } from 'date-fns/locale';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrder } from 'src/app/models/srm/purchase-order';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { StatusPurchase } from '../../shared/Utils/status-purchase';
import { TypeDistributionOc } from '../../shared/Utils/type-distribution-oc';
import { PurchaseHeaderComponent } from '../purchase-header/purchase-header.component'
import { PurchaseOrderProductsComponent } from '../purchase-order-detail/purchase-order-products/purchase-order-products.component';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { MenuTabOrder } from '../../shared/Utils/menu-tab-order';
import { Motives } from 'src/app/models/masters/motives';
import { DistributedPurchaseOrderComponent } from '../distributed-purchase-order/distributed-purchase-order.component';
import { PurchaseOrderReceivedListComponent } from '../purchase-order-received-list/purchase-order-received-list.component';
import { TypeDistributionEnum } from '../../shared/Utils/type-distribution-enum';
import { PurchaseOrderFilter } from '../../shared/filters/purchase-order-filter';


@Component({
  selector: 'app-wizard-purchase-order',
  templateUrl: './wizard-purchase-order.component.html',
  styleUrls: ['./wizard-purchase-order.component.scss'],
  providers: [DatePipe]
})
export class WizardPurchaseOrderComponent implements OnInit {
  items: MenuItem[];
  activeIndex: number = 0;
  indmenu: number = 0;
  indInitTime: boolean = false;
  indInitResu: boolean = false;
  indInitPause: boolean = false;
  @ViewChild(PurchaseHeaderComponent) purchaseHeader: PurchaseHeaderComponent;
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Input("iduserlogin") iduserlogin: number = -1;
  @Input("rateold") rateold: number = 0;
  _purchaseOrderDetail: PurchaseOrderProduct[] = [];
  showproduct: boolean = false;
  _idOrderPurchase: number = -1;
  _indConsignment: number = -1;
  _idSupplier: number = -1;
  idPurchase: number = 0;
  index: number = 0;
  submitted: boolean;
  location;
  _idCompany: number = 1;//seteado 1 debe ser la empresa que se esta logueado
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;
  @ViewChild(PurchaseOrderProductsComponent) purchaseOrderProductsComponent: PurchaseOrderProductsComponent;
  @ViewChild(DistributedPurchaseOrderComponent) distributedPurchaseOrderComponent: DistributedPurchaseOrderComponent;
  @ViewChild(PurchaseOrderReceivedListComponent) purchaseOrderReceivedListComponent: PurchaseOrderReceivedListComponent;
  isReceived: boolean = false;
  menuTabOrder: typeof MenuTabOrder = MenuTabOrder;
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  typeDistribution: typeof TypeDistributionOc = TypeDistributionOc;
  isSave: boolean = true;
  isdisabled: boolean = true;
  showDialog: boolean = false;
  orderfiltersOfValues: FilterPurchaseOrder[] = [];
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  showReason: boolean = false;
  reason: Motives = new Motives();
  showTabProducts: boolean = false;
 
  //iduserlogin:number=0;
  //{ static: true }) 
  EnumTypeDistribution: typeof TypeDistributionEnum = TypeDistributionEnum;
  constructor(private messageService: MessageService,
    public breadcrumbService: BreadcrumbService,
    private actRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public purchaseService: PurchaseorderService,
    private _httpClient: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,) {

    this.breadcrumbService.setItems([
      { label: 'SCM' },
      { label: 'SRM', routerLink: ['/srm/dashboard-general-srm'] },
      { label: 'Orden de compra', routerLink: ['/srm/purchase-list/'] }
    ]);
  }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {

    this.distributedPurchaseOrderComponent
    this.idPurchase = Number(this.actRoute.snapshot.params['id']);
    // if(this.idPurchase!=0){
    //    this.searchOrder();
    // }
    if (this.orderfiltersOfValues.length > 0) {
      this.orderfiltersOfValues = this.orderfiltersOfValues;
    } else {
      if (history.state.queryParams != undefined) {
        const purchasefilters = history.state.queryParams.purchasefilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (purchasefilters === null) {
          this.orderfiltersOfValues = [];
        } else {
          this.orderfiltersOfValues = JSON.parse(purchasefilters);

          sessionStorage.setItem('searchParameters', purchasefilters)
        }
      } else {
        this.orderfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
    }

    if (this.idPurchase != 0) {
      this.iduserlogin = this._Authservice.storeUser.id;
    }
    this._idCompany = this._Authservice.currentCompany


    this.indmenu = 0;
    this.items = [{
      label: 'Datos generales',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    // {
    //   label: 'Distribución',

    // },
    {
      label: 'Productos',
    },
    {
      label: 'Recibo',
    },
    {
      label: 'Resumen',
    }
    ];
    if (this.idPurchase > 0)
      this.isdisabled = false;
      this.purchaseHeader.Save();
    console.log('drgdgrdhrdh', this.distributedPurchaseOrderComponent.isDistributedComplete)
  }

  handleChange(e) {
    if (this.purchaseOrderProductsComponent.isSave == false)
      this.purchaseOrderProductsComponent.save(false);

    this.index = e.index;
    if (this.index == 1) {
      this._idOrderPurchase = this.PucharseOrderHeader.purchase.idOrderPurchase;
      this.showproduct = true;
      this.purchaseOrderProductsComponent.onShow()

    } else if (this.index == 0) {
      this.purchaseOrderProductsComponent.selecteditem = new PurchaseOrderProduct();
      this.purchaseOrderProductsComponent.triggerFalseClick();
    } else if (this.index == 2) {
      this.distributedPurchaseOrderComponent.onShow();
    }
    if (this.index == 3) {
      this.purchaseOrderReceivedListComponent.loadTable();
    }
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
  SavePurchase() {

    if (this.PucharseOrderHeader.distributedItems > 0 &&
      this.purchaseHeader.PucharseOrderHeader.idTypeDistribution == this.EnumTypeDistribution.simple) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea cambiar el tipo de distribución? se eliminaran productos asociados.',
        accept: () => {
          this.purchaseHeader.RemoveDistributedProductFromHeader();
        },
      });
    } else {
      if (this.index == 0) { 
        if(this.rateold!=0 && this.rateold !=this.PucharseOrderHeader.purchase.idexchangeRateSupplier){
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro que desea cambiar la tasa de negociación , se modificaran los precios y costos  de la orden de compra.',
            accept: () => {
              let filters = new PurchaseOrderFilter();
              filters.idOrderPurchase = this.idPurchase//_idOrderPurchase
              filters.idCompany = this._idCompany //_idCompany
              this.purchaseService.getPurchaseOrderProduct(filters).subscribe((data: PurchaseOrderProduct[]) => {
                 this._purchaseOrderDetail = data;
                 this.purchaseOrderProductsComponent.changeRatePurchaseOrder(this.PucharseOrderHeader.purchase.exchangeRateSupplier,this.PucharseOrderHeader.purchase.calculationBase,this._purchaseOrderDetail)              
                 this.purchaseHeader.Save();
              }, (error: HttpErrorResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
              });
              
            },
          });
      } 
      else   
         this.purchaseHeader.Save();
      }else if (this.index == 1)
      {
        if(this.rateold!=0 && this.rateold !=this.PucharseOrderHeader.purchase.idexchangeRateSupplier){
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro que desea cambiar la tasa de negociación , se modificaran los precios y costos  de la orden de compra.',
            accept: () => {
              this.purchaseOrderProductsComponent.save();
              this.purchaseOrderProductsComponent.changeRatePurchaseOrder(this.PucharseOrderHeader.purchase.exchangeRateSupplier,this.PucharseOrderHeader.purchase.calculationBase)              
              this.purchaseHeader.Save();
            },
          });
      } 
      else
          this.purchaseOrderProductsComponent.save();
      }  
        else if(this.index == 2)
         this.distributedPurchaseOrderComponent.save()    
        
    
    }

  }

checkAuthorizedBy(): boolean{
   if(this.iduserlogin !== this.PucharseOrderHeader.purchase.responsibleId){ 
    if(this.iduserlogin === this.PucharseOrderHeader.purchase.approvedbyId){
      return true
    }
  }
   if(this.iduserlogin === this.PucharseOrderHeader.purchase.responsibleId){
    return true
  }
} 
  


  elaboratedPurchase() {
    if (this.index == 0) {
      if (this.PucharseOrderHeader.purchase.cantItems == 0)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No existen productos agregados a la orden de compra" });
      else {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea elaborar el documento?.',
          accept: () => {
            this.purchaseHeader.changeStatus(this.statuspurchase.Elaborated, undefined);
          },
        });
      }
    }
   else if (this.index == 1) {
      if (this.purchaseOrderProductsComponent._purchaseOrderDetail.length == 0)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No existen productos agregados a la orden de compra" });
      else if (this.purchaseOrderProductsComponent.isSave == false)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen datos de productos sin guardar" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.individualPrices.indAdded == 1 && x.packagingQuantity <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin cantidad de empaques solicitados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.individualPrices.indAdded == 1 && x.individualPrices.baseCostNew <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin precios configurados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.masterPrices.indAdded == 1 && x.packagingQuantity <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin cantidad de empaques solicitados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.masterPrices.indAdded == 1 && x.masterPrices.baseCostNew <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin precios configurados" });
      else {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea elaborar el documento?.',
          accept: () => {
            this.purchaseHeader.changeStatus(this.statuspurchase.Elaborated, undefined);
          },
        });
      }

    }else if(this.index == 2){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea elaborar el documento?.',
        accept: () => {
          this.purchaseHeader.changeStatus(this.statuspurchase.Elaborated, undefined);
        },
      });
    }
  }

  AuthorizedPurchase() {
    if (this.index == 1) {
      if (this.purchaseOrderProductsComponent._purchaseOrderDetail.length == 0)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No existen productos agregados a la orden de compra" });
      else if (this.purchaseOrderProductsComponent.isSave == false)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen datos de productos sin guardar" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.individualPrices.indAdded == 1 && x.packagingQuantity <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin cantidad de empaques solicitados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.individualPrices.indAdded == 1 && x.individualPrices.baseCostNew <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin precios configurados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.masterPrices.indAdded == 1 && x.packagingQuantity <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin cantidad de empaques solicitados" });
      else if (this.purchaseOrderProductsComponent._purchaseOrderDetail.findIndex(x => x.masterPrices.indAdded == 1 && x.masterPrices.baseCostNew <= 0) != -1)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existen productos sin precios configurados" });
      else {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea autorizar el documento?.',
          accept: () => {
            this.purchaseHeader.changeStatus(this.statuspurchase.Authorized, undefined);
          },
        });
      }
    }

    if (this.index == 0) {
      if (this.PucharseOrderHeader.purchase.cantItems == 0)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No existen productos agregados a la orden de compra" });
      else {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea autorizar el documento?.',
          accept: () => {
            this.purchaseHeader.changeStatus(this.statuspurchase.Authorized, undefined);
          },
        });
      }

    }

    
    if (this.index == 2) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea autorizar el documento?.',
          accept: () => {
            this.purchaseHeader.changeStatus(this.statuspurchase.Authorized, undefined);
          },
        });
      
    }

  }

  canceledPurchase() {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea cancelar el documento? se eliminaran documentos asociados.',
      accept: () => {
        this.purchaseHeader.changeStatus(this.statuspurchase.Canceled, undefined);
      },
    });
  }

  onToggleReason(visible: boolean) {
    this.showReason = visible;
    this.purchaseHeader.PucharseOrderHeader.purchase.idReason = this.reason.id;
    this.purchaseHeader.PucharseOrderHeader.purchase.description = this.reason.name;
    if (this.purchaseHeader.PucharseOrderHeader.purchase.idReason > 0)
      this.purchaseHeader.changeStatus(this.statuspurchase.Canceled, this.purchaseHeader);
  }

  back = () => {
    if (this.purchaseOrderProductsComponent.isSave == false || this.purchaseHeader.isEditHeader == true) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
        accept: () => {
          const queryParams: any = {};
          queryParams.purchasefilters = JSON.stringify(this.orderfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['srm/purchase-list'], navigationExtras);
        },
      });
    }
    else {
      const queryParams: any = {};
      queryParams.purchasefilters = JSON.stringify(this.orderfiltersOfValues);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      this.router.navigate(['srm/purchase-list'], navigationExtras);
    }

  }


  //Orden Distribuida



  DistributePurchaseOrder() {

    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea distribuir esta orden de compra?',
      accept: () => {
        this.distributedPurchaseOrderComponent.DistributePurchaseOrder()
      },
    });
  
  }
  search() {
 
  }


}