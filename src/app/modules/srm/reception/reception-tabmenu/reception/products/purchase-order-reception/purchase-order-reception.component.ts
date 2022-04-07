import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { PurchaseOrderReception } from 'src/app/models/srm/purchase-order-reception';
import { Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { ReceptionDetailFilter } from 'src/app/models/srm/reception-detail-filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PurchaseOrderFilter } from 'src/app/modules/srm/shared/filters/purchase-order-filter';
import { PurchaseOrderProductFilter } from 'src/app/modules/srm/shared/filters/purchase-order-product';
import { MerchandiseReceptionService } from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';
import { PurchaseorderService } from 'src/app/modules/srm/shared/services/purchaseorder/purchaseorder.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'app-purchase-order-reception',
  templateUrl: './purchase-order-reception.component.html',
  styleUrls: ['./purchase-order-reception.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseOrderReceptionComponent implements OnInit {

  innerWidth: number;
  innerHeight: number;
  loading:boolean=false;
  _detail:PurchaseOrderProduct[]=[];
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  iduserlogin:number=0;
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  @Input("reception") reception: Reception;
  @Input("numberdocument") numberdocument:String
  @Input("typedocument")  typedocument:String;
  _idCompany: number = -1;
  _detailproducts:DetailReception[]=[];
  defectImage: DefeatImage=new DefeatImage();


  displayedColumns: ColumnD<PurchaseOrderProduct>[] =
    [
      { field: 'image', header: '', display: 'table-cell' },
      // { template: (data) => { if(data.indHeavy==true) return data.packagingReceived.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); else return data.packagingReceived.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }, field: 'packagingReceived', header: 'Empaques recibidos', display: 'table-cell' },
      // { template: (data) => { if(data.indHeavy==true) return data.unitReceived.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); else return data.unitReceived.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }, field: 'unitReceived', header: 'Unidades recibidas', display: 'table-cell' },
      { template: (data) => { if(data.indHeavy==true) return (data.packagingQuantity=data.prices[0].packingNumbers).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); else return (data.packagingQuantity=data.prices[0].packingNumbers).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }, field: 'packagingQuantity', header: 'Empaques solicitados', display: 'table-cell' },
      { template: (data) => { if(data.indHeavy==true) return this.decimalPipe.transform((data.totalUnits = data.prices[0].packingNumbers * data.prices[0].unitsNumberPacking), '.3'); else return this.decimalPipe.transform((data.totalUnits = data.prices[0].packingNumbers * data.prices[0].unitsNumberPacking), '.0') }, header: 'Unidades solicitadas', display: 'table-cell', field: 'totalUnits' },
      { template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.internalReference; }, field: 'internalReference', header: 'Ref. interna', display: 'table-cell' },
      { template: (data) => { return data.gtin=data.prices[0].bar; }, field: 'gtin', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.packaging=data.prices[0].presentation; }, field: 'packaging', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.packagingType=data.prices[0].packingType; }, field: 'packagingType', header: 'Tipo empaque', display: 'table-cell' },
      { template: (data) => { return data.unitPerPackaging=data.prices[0].unitsNumberPacking; }, field: 'unitPerPackaging', header: 'Unds por empaque', display: 'table-cell' },
    ];
  constructor(public _service:MerchandiseReceptionService,public _purchaseservice: PurchaseorderService,private _httpClient: HttpClient,private decimalPipe: DecimalPipe,
    private readonly loadingService: LoadingService,private messageService: MessageService, private confirmationService: ConfirmationService,public userPermissions: UserPermissions) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.70;
    this._idCompany = this._Authservice.currentCompany;
    this.iduserlogin = this._Authservice.storeUser.id;
  }

  onshow(reception:Reception)
  {
    this.reception=reception;
    this.typedocument=reception.documentTypeRelated;
    this.numberdocument=reception.purchaseOrderRelated;
    let filter = new ReceptionDetailFilter();
    filter.id = reception.id//_idRECEPTION
    //this.loadingService.startLoading('wait_loading');
    this._service.getReceptionDetaillist(filter).subscribe((data: DetailReception[]) => {  
      if(data.length>0)
      { 
         this._detailproducts= data;
      }
      else
         this._detailproducts=[];
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

    this.loading = true;
    let filters=new PurchaseOrderProductFilter()
    filters.idProduct=-1;
    filters.idOrderPurchase=reception.purchaseOrderRelatedId;
    //this.loadingService.startLoading('wait_loading');
    this._purchaseservice.getPurchaseOrderProductExpress(filters).subscribe((data: PurchaseOrderProduct[]) => {
      this._detail= data;
      this.loading = false;
      //this.loadingService.stopLoading();
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      //this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
    
  }
  send(e){
     if(this._detailproducts.length>0)
     {
           this.confirmationService.confirm({
           header: 'Confirmación',
           icon: 'pi pi-exclamation-triangle',
           message: 'Existen productos ya recepcionados,Si realiza esta acción los productos recepcionados anteriormente se perderán.¿Esta seguro de recepcionar estos productos ?',
             accept: () => {
              this.received();
             },
          });
     }
     else{
     this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro de recepcionar estos productos?',
        accept: () => {
         this.received();
        },
     });}
  }

  received(){
    this._service.receptionaboutpurchaseOrder(this.reception).subscribe((data: number) => {
      if (data > 0) 
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
       else
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    }, (error: HttpErrorResponse) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }

}
