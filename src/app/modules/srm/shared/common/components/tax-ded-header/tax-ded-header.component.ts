import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Deductible } from 'src/app/models/srm/deductible';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { Taxable } from 'src/app/models/srm/taxable';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PurchaseorderService } from '../../../services/purchaseorder/purchaseorder.service';
import { StatusPurchase } from '../../../Utils/status-purchase';
import { DeductibleHeaderComponent } from './deductible-header/deductible-header.component';
import { TaxableHeaderComponent } from './taxable-header/taxable-header.component';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-tax-ded-header',
  templateUrl: './tax-ded-header.component.html',
  styleUrls: ['./tax-ded-header.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class TaxDedHeaderComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = false;
  @Input() indTabdeductible: boolean = false;
  showDialogEdit:boolean=false;

  @ViewChild(TaxableHeaderComponent) TaxableComponent : TaxableHeaderComponent;
  @ViewChild(DeductibleHeaderComponent) DeductibleComponent: DeductibleHeaderComponent;
  //@Input("ProductOrder") ProductOrder:PurchaseOrderProduct;
  @Input("PurchaseOrder") PurchaseOrder:Groupingpurchaseorders;
  // @Input("_product") _product: 
  indactive: boolean = false;
  activeIndex: number = 0;
  txablesList: Taxable[] = [];
  deductiblesList: Deductible[]=[];
  imponible: Taxable = new Taxable();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("_sendTaxablesListEditHeader") _sendTaxablesListEditHeader = new EventEmitter<{ TaxableListHeaderSave : Taxabledeductible}>();
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  TaxableListHeaderSave:Taxabledeductible = new Taxabledeductible();
    @Output("_sendTaxablesHeaderList") _sendTaxablesHeaderList = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible, isCost: boolean }>();
    isCost: boolean = true;
    permissions: number[] = [];
    permissionsIDs = {...Permissions};
    iduserlogin:number=-1;

  constructor(public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public purchaseService: PurchaseorderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,
    private _httpClient: HttpClient) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  displayedColumns: ColumnD<Taxable>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo imponible', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    // { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

    // { field: 'idProducTax', header: 'Impuesto MPC', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];

  displayedColumns1: ColumnD<Deductible>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

    // { field: 'idProducTax', header: 'Impuesto MPC', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];
  ngOnInit(): void {
    this.iduserlogin = this._Authservice.storeUser.id;
  }
  onShow() {
    if (this.indTabdeductible) {
      this.indactive = true;
      this.activeIndex=1;
     // this.DeductibleComponent.onshowDeductibleHeader();
      this.searchDeductible();
    }
    else {
      this.indactive = false;
      this.activeIndex=0;
      this.search();
      //this.TaxableComponent.onshowTaxableHeader();
    }
  }

  onHide() {
    if(this.indactive){
        // this.DeductibleComponent.deductiblesListTemp=[];
        // this.DeductibleComponent.TaxabledeductibleList.deductibles =[];
        // this.DeductibleComponent.selectedDeductible=[];
    }else{
        // this.TaxableComponent.txablesListTemp=[]; 
        // this.TaxableComponent.TaxabledeductibleList.taxables =[]
        // this.TaxableComponent.selectedTaxable=[];
    }
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

sendList(data){
    this._sendTaxablesListEditHeader.emit(data);
}

search() {
  // this.loading = true;
   //this.loading = false;
   var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
   filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
   this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
      //this.txablesList= data.taxables;     
        this.purchaseService._taxdedpurcharseHeader.deductibles=data.deductibles;
        this.purchaseService._taxdedpurcharseHeader.taxables=data.taxables;
     //this.loading = false;
   }, (error: HttpErrorResponse) => {
     //this.loading = false;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los imponibles." });
    
   });
 }

 async searchDeductible() {
  // this.loading = true;
   //this.loading = false;
   var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
   filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
   this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
      //this.deductiblesList= data.deductibles;
      this.purchaseService._taxdedpurcharseHeader.taxables=data.taxables;
      this.purchaseService._taxdedpurcharseHeader.deductibles= data.deductibles;
     //this.loading = false;
   }, (error: HttpErrorResponse) => {
     //this.loading = false;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los imponibles." });
    
   });
 }

 onEdit(taxable){
    this.imponible.taxableDeductibleBaseId =taxable.taxableDeductibleBaseId;
    this.imponible.idTaxType= taxable.idTaxType;
    this.imponible.idRate= taxable.idRate;
    this.imponible.idProducTax=taxable.idProducTax;
    this.imponible.idPurchaseOrder=taxable.idPurchaseOrder;
    this.imponible.idTaxableType=taxable.idTaxableType;
    this.imponible.distributionCalculationId=taxable.distributionCalculationId;
    this.imponible.idDiscountRate=taxable.idDiscountRate;
    this.imponible.idApply=taxable.idApply;
    this.imponible.idPurchaseOrderTaxableDeductible= taxable.idPurchaseOrderTaxableDeductible;
    this.imponible.indDeductible=taxable.indDeductible;
    this.imponible.indTaxable=taxable.indTaxable;
    this.imponible.idPurchaseOrderDetail=taxable.idPurchaseOrderDetail;
    this.imponible.active= taxable.active;
    this.imponible.rate=taxable.rate;
    this.imponible.amount= taxable.amount;
    this.imponible.indPurchaseTaxableDetail= taxable.indPurchaseTaxableDetail;
    this.imponible.indPurchaseTaxable= taxable.indPurchaseTaxable;
    this.imponible.taxableType= taxable.taxableType;
    this.imponible.taxableDeductibleBase= taxable.taxableDeductibleBase;
    this.showDialogEdit=true;
  // }else{

  // }
   
 }

 sendListTaxableHeaderEdit(data){
  this._sendTaxablesListEditHeader.emit(data);
}


 //#region  eliminacion

 async onRemove(ProducTax) {
  // this.txablesListTemp = this.txablesListTemp.filter(x => x.idProducTax != idProducTax);
  this.confirmationService.confirm({
   header: 'Confirmación',
   icon: 'pi pi-exclamation-triangle',
   message: '¿Está seguro que desea eliminar este registro?',
   accept: () => {
     let model=new PurchaseOrdertaxableDetail()
     model.indPurchaseTaxable = true;
     model.indPurchaseTaxableDetail = false;
     model.taxableDeductibleBaseId=ProducTax.taxableDeductibleBaseId;
     this.purchaseService.removetaxable(model).subscribe((data: number) => {
       if (data > 0) {
         this.searchDeductible();
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
         this.purchaseService._taxdedpurcharseHeader.taxables = this.purchaseService._taxdedpurcharseHeader.taxables.filter(x => x != ProducTax); 
         if (this.purchaseService._taxdedpurcharseHeader.taxables.length > 0) {           
          this.TaxableListHeaderSave.deductibles =  this.purchaseService._taxdedpurcharseHeader.deductibles;
          this.TaxableListHeaderSave.taxables= this.purchaseService._taxdedpurcharseHeader.taxables;
          } 
          else{
            this.TaxableListHeaderSave.deductibles =  this.purchaseService._taxdedpurcharseHeader.deductibles;
            this.TaxableListHeaderSave.taxables=[];
          }  
         
          //emitir evento
             this._sendTaxablesListEditHeader.emit({
              TaxableListHeaderSave: this.TaxableListHeaderSave,
              //isCost: this.isCost
            });  
        }
     }, (error: HttpErrorResponse) =>
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
       ));
   },
 });
 }
 onRemoveded(ProducTax) {
  // this.txablesListTemp = this.txablesListTemp.filter(x => x.idProducTax != idProducTax);
  this.confirmationService.confirm({
   header: 'Confirmación',
   icon: 'pi pi-exclamation-triangle',
   message: '¿Está seguro que desea eliminar este registro?',
   accept: () => {
     let model=new PurchaseOrdertaxableDetail()
     model.indPurchaseTaxable = true;
     model.indPurchaseTaxableDetail = false;
     model.taxableDeductibleBaseId=ProducTax.taxableDeductibleBaseId;
     this.purchaseService.removetaxable(model).subscribe((data: number) => {
       if (data > 0) {
         this.search();
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
         this.purchaseService._taxdedpurcharseHeader.deductibles = this.purchaseService._taxdedpurcharseHeader.deductibles.filter(x => x != ProducTax);                 
         if (this.purchaseService._taxdedpurcharseHeader.deductibles.length > 0 ) {
                 
          this.TaxableListHeaderSave.deductibles = this.purchaseService._taxdedpurcharseHeader.deductibles;
          this.TaxableListHeaderSave.taxables= this.purchaseService._taxdedpurcharseHeader.taxables ;
        
          } 
          else{
            this.TaxableListHeaderSave.deductibles = [];
            this.TaxableListHeaderSave.taxables= this.purchaseService._taxdedpurcharseHeader.taxables ;
          }
            //emitir evento
            this._sendTaxablesListEditHeader.emit({
              TaxableListHeaderSave: this.TaxableListHeaderSave,
              //isCost: this.isCost
            });  
        }
     }, (error: HttpErrorResponse) =>
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
       ));
   },
 });
 }
 //#endregion
}
