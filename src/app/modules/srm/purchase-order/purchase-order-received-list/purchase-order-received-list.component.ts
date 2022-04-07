import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ColumnD } from 'src/app/models/common/columnsd';
import { purchaseOrderReceivedFilters } from 'src/app/models/srm/common/purchase-order-received-filters';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { purchaseOrderDetailsReceived } from 'src/app/models/srm/purchase-order-details-received';
import { purchaseOrderReceived } from 'src/app/models/srm/purchase-order-received';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';


@Component({
  selector: 'app-purchase-order-received-list',
  templateUrl: './purchase-order-received-list.component.html',
  styleUrls: ['./purchase-order-received-list.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class PurchaseOrderReceivedListComponent implements OnInit {

  
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders 
  filters: purchaseOrderReceivedFilters = new purchaseOrderReceivedFilters;
  purchaseOrderReceivedList: purchaseOrderReceived[] = []
  @ViewChild('dt',{static:false})dt:any;
  error: boolean
  loading: boolean = false
  permissionsIDs = { ...Permissions };
  timeResult: number = 15;
  interval;
  tooLong: boolean = false;
  done: boolean = false;
  timeout: boolean = false;
  noEndDate: Date = new Date('1/1/00 0:00')
  constructor(public purchaseOrderReceivedService: PurchaseorderService, private decimalPipe: DecimalPipe, 
   private messageService: MessageService, public datepipe: DatePipe, private router: Router, public userPermissions: UserPermissions) { }



    
  expanded: { [productId: string]: boolean } = {}

  colsMacro: ColumnD<purchaseOrderReceived>[] = [
  { field: 'image', header: '' },
  { template: purchase => purchase.productName, field: 'productName', header: 'Producto' },
  { template: purchase => purchase.productCategory, field: 'productCategory', header: 'Categoría' },
  { template: purchase => purchase.totalPackagesRequested, field: 'totalPackagesRequested', header: 'Total unidades solicitadas'},
  { template: purchase => purchase.totalPackagesReceived, field: 'totalPackagesReceived', header: 'Total unidades recibidas' },
  { template: purchase => purchase.totalPackagesMissing, field: 'totalPackagesMissing', header: 'Diferencia de unidades' }
  ]

  colsMicro: ColumnD<purchaseOrderDetailsReceived>[] = [
    { template: purchase => purchase.reception, field: 'reception', header: 'Recepción' },
    { template: purchase => purchase.status, field: 'status', header: 'Estatus' },
    { template: purchase => purchase.packagesRecieved, field: 'packagesRecieved', header: 'Empaques recibidos' },
    { template: purchase => purchase.packageProductBar, field: 'packageBar', header: 'Barra empaque' },
    { template: purchase => purchase.unitsPerPackage, field: 'unitsPerPackage', header: 'Unidades por empaque' },
    { template: purchase => purchase.unitsReceived, field: 'unitsReceived', header: 'Unidades recibidas' },
    { template: purchase => this.datepipe.transform(purchase.startDate, 'short'), field: 'startDate', header: 'Fecha inicio' },
    { template: purchase => { return purchase.endDate == undefined ? "" : this.datepipe.transform(purchase.endDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "No finalizada" : this.datepipe.transform(purchase.endDate, 'short'); },field: 'endDate', header: 'Fecha de creación'},
    { template: purchase => this.decimalPipe.transform(purchase.baseCost), field: 'baseCost', header: 'Costo base' },
    { template: purchase => this.decimalPipe.transform(purchase.conversionCost), field: 'conversionCost', header: 'Costo conversión' },
    { template: purchase => this.decimalPipe.transform(purchase.baseNetCost), field: 'baseNetCost', header: 'Costo neto base' },
    { template: purchase => this.decimalPipe.transform(purchase.converNetCost), field: 'converNetCost', header: 'Costo neto conversión' },
    { template: purchase => this.decimalPipe.transform (purchase.netBaseSellCost), field: 'netBaseSellCost', header: 'Costo neto venta base' },
    { template: purchase => this.decimalPipe.transform (purchase.converNetSellCost), field: 'converNetSellCost', header: 'Costo neto venta conversión' },

    { template: purchase => this.decimalPipe.transform(purchase.netFactor), field: 'netFactor', header: 'Factor neto' },
    { template: purchase => this.decimalPipe.transform(purchase.sellFactor), field: 'sellFactor', header: 'Factor de venta' },
    { template: purchase => this.decimalPipe.transform(purchase.basePVP), field: 'basePVP', header: 'PVP base' },
    { template: purchase => this.decimalPipe.transform(purchase.conversionPVP), field: 'conversionPVP', header: 'PVP conversión' },
    ]
    

    timeResponse() {
      this.interval = setInterval(() =>
      {
        if(this.timeResult > 0){
          this.timeResult--;
        }else{
         this.tooLong = true;
        }
      }, 1000
      )
    }

  loadTable(){
    this.purchaseOrderReceivedList = undefined
    this.resetLoadingStatus()
    this.filters.IdOrdenCompra = this.PucharseOrderHeader.purchase.idOrderPurchase
    this.timeResponse()
    this.purchaseOrderReceivedService.getPurchaseOrderReceived(this.filters)
    .subscribe(respuesta => {
      this.done = true;
      setTimeout(() => {
      this.purchaseOrderReceivedList = respuesta;
      this.isFilled()
      }, 800)
    }, (error: HttpErrorResponse) => {
      this.purchaseOrderReceivedList = undefined
      this.timeout = true;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos." });
    });
    
  }
  resetLoadingStatus(){
    this.timeResult = 15;
    this.done = false;
    this.tooLong = false;
  }

  goToReception(reception: purchaseOrderDetailsReceived){
    /* (<any>this.route).navigate([`/${'reception/:id'}`]) */
    console.log('valor', reception.idReception)
    this.router.navigate(['/srm/reception', reception.idReception])
  }

  isFilled(){
    if(this.purchaseOrderReceivedList.length == 0){
      this.error = true
    }else{
      this.error = false;
    }
  }

    ngOnInit(): void {
      console.log('fecha', this.noEndDate)
    }
  }