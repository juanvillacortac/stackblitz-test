import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PurchaseOrdertaxableDetail, PurchasetaxableDetailfilter } from 'src/app/models/srm/purchase-order-taxable-detail';
import { ReceptionStatus } from 'src/app/models/srm/reception';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { FilterxProdODC } from 'src/app/models/srm/reception/filtertaxprododc';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { TaxableDeductiblePurchase } from 'src/app/modules/srm/shared/view-models/taxabledeductiblepurchase';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-view-tax-ded-purchase',
  templateUrl: './view-tax-ded-purchase.component.html',
  styleUrls: ['./view-tax-ded-purchase.component.scss']
})
export class ViewTaxDedPurchaseComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input() indTabdeductible: boolean = false;
  showDialogEdit:boolean=false;
  @Output("issavechange") issavechange = new EventEmitter<boolean>();
  @Input() PurchaseVal: PurchaseValidation;
  @Input() subtotal: number=0; 
  indactive: boolean = false;
  activeIndex: number = 0;
  taxables: TaxableRep[] = [];
  deductibles: DeductibleRep[]=[];
  imponible: TaxableRep = new TaxableRep();
  statuspurchase:typeof ReceptionStatus=ReceptionStatus
  @Output() showDialogChange = new EventEmitter<boolean>();
     isCost: boolean = true;
    permissions: number[] = [];
    permissionsIDs = {...Permissions};
    iduserlogin:number=-1;

    displayedColumns: ColumnD<TaxableRep>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo imponible', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];

  displayedColumns1: ColumnD<DeductibleRep>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];

  constructor(public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public  _serviceValidation: ValidationProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,
    private _httpClient: HttpClient,
    private readonly dialogService: DialogsService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  
  ngOnInit(): void {
    this.iduserlogin = this._Authservice.storeUser.id;
  }
  onShow() {
    debugger
    this.PurchaseVal=this.PurchaseVal
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
    this.issavechange.emit(true);
    this.showDialogChange.emit(this.showDialog);
    
  }

search() {
   var filter = new FilterxProdODC();
   filter.idProduct = -1;
   filter.idPurchase = this.PurchaseVal.idPurchase;//asignar la de la cabecera/
   filter.idPacking=-1;
   filter.indDeducible=false;
   this._serviceValidation.getTaxablesDeductiblesPurchase(filter).subscribe((data: TaxableDeductiblePurchase) => {
      this._serviceValidation._taxdedpurcharseHeader.taxables=data.taxables
      this._serviceValidation._taxdedpurcharseHeader.deductibles= data.deductibles
   }, (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los imponibles." });
    
   });
 }

 async searchDeductible() {
   var filter = new FilterxProdODC();
   filter.idProduct = -1;
   filter.idPurchase =this.PurchaseVal.idPurchase;//asignar la de la cabecera/
   filter.idPacking=-1;
   filter.indDeducible= true;
   this._serviceValidation.getTaxablesDeductiblesPurchase(filter).subscribe((data: TaxableDeductiblePurchase) => {
      this._serviceValidation._taxdedpurcharseHeader.taxables= data.taxables
      this._serviceValidation._taxdedpurcharseHeader.deductibles= data.deductibles
   }, (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los imponibles." });  
   });
 }

 onEdit(taxable){
    this.imponible.taxableDeductibleBaseId =taxable.taxableDeductibleBaseId;
    this.imponible.idTaxType= taxable.idTaxType;
    this.imponible.idRate= taxable.idRate;
    this.imponible.idProducTax=taxable.idProducTax;
    this.imponible.idPurchase=taxable.idPurchase;
    this.imponible.idTaxableType=taxable.idTaxableType;
    this.imponible.distributionCalculationId=taxable.distributionCalculationId;
    this.imponible.idDiscountRate=taxable.idDiscountRate;
    this.imponible.idApply=taxable.idApply;
    this.imponible.idPurchaseTaxableDeductible= taxable.idPurchaseTaxableDeductible;
    this.imponible.indDeductible=taxable.indDeductible;
    this.imponible.indTaxable=taxable.indTaxable;
    this.imponible.idPurchaseDetail=taxable.idPurchaseDetail;
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
  //this._sendTaxablesListEditHeader.emit(data);
}//


 //#region  eliminacion

 async onRemove(ProducTax) {
   let subdedxtotal=0;
  // this.confirmationService.confirm({
  //  header: 'Confirmación',
  //  icon: 'pi pi-exclamation-triangle',
  //  message: '¿Está seguro que desea eliminar este registro?',
  //  accept: () => {
    this.dialogService.confirmDialog('confirmBack', '¿Está seguro que desea eliminar este registro?', () => {
     let model=new PurchasetaxableDetailfilter()
     if (ProducTax.rate > 0) 
      subdedxtotal = this.subtotal * (ProducTax.rate / 100)
     else 
      subdedxtotal = ProducTax.amount;
    
     model.id=ProducTax.idPurchaseTaxableDeductible;
     model.amount=subdedxtotal
     model.indImponible=ProducTax.indTaxable
     this._serviceValidation.removetaxable(model).subscribe((data: number) => {
       if (data > 0) {
         this.search();
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
         this.taxables = this.taxables.filter(x => x != ProducTax); 
         if (this.taxables.length > 0) {           
          this.deductibles =  this.deductibles;
          this.taxables= this.taxables;
          } 
          else{
            this.deductibles =  this.deductibles;
            this.taxables=[];
          }      
        }
     }, (error: HttpErrorResponse) =>
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
       ));
   });
  }
 onRemoveded(ProducTax) {
  let  subtaxtotal=0
  // this.confirmationService.confirm({
  //  header: 'Confirmación',
  //  icon: 'pi pi-exclamation-triangle',
  //  message: '¿Está seguro que desea eliminar este registro?',
   this.dialogService.confirmDialog('confirmBack', '¿Está seguro que desea eliminar este registro?', () => {
     let model=new PurchasetaxableDetailfilter()
     if (ProducTax.rate > 0) 
      subtaxtotal = this.subtotal * (ProducTax.rate / 100)
     else 
      subtaxtotal = ProducTax.amount;
     model.id=ProducTax.idPurchaseTaxableDeductible;
     model.amount=subtaxtotal
     model.indImponible=ProducTax.indTaxable
     this._serviceValidation.removetaxable(model).subscribe((data: number) => {
       if (data > 0) {
         this.searchDeductible();
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
         this.deductibles = this.deductibles.filter(x => x != ProducTax);                 
         if (this.deductibles.length > 0 ) {            
          this.deductibles = this.deductibles;
          this.taxables= this.taxables ;        
          } 
          else{
            this.deductibles = [];
            this.taxables= this.taxables ;
          } 
        }
     }, (error: HttpErrorResponse) =>
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
       ));
   });
 } 
 savetaxded(data){
  if(data.isave==true)
  {
    let tax:any
    let model=new TaxableDeductiblePurchase()
    model.idPurchase=this.PurchaseVal.idPurchase
    if(data.taxded.indDeductible==false)
    {
      tax=this._serviceValidation._taxdedpurcharseHeader.taxables.find(x=>x.idPurchaseTaxableDeductible==data.taxded.idPurchaseTaxableDeductible)
      if(tax.amount>0) 
        tax.amount= data.taxded.amount  
      else 
        tax.rate= data.taxded.rate   
      model.taxables=this._serviceValidation._taxdedpurcharseHeader.taxables
    }
    else
    {
      tax=this._serviceValidation._taxdedpurcharseHeader.deductibles.find(x=>x.idPurchaseTaxableDeductible==data.taxded.idPurchaseTaxableDeductible)
      if(tax.amount>0) 
        tax.amount= data.taxded.amount  
      else 
         tax.rate= data.taxded.rate   
         model.deductibles=this._serviceValidation._taxdedpurcharseHeader.deductibles
    }

    this.saveTaxable(model);
   this.issavechange.emit(data.isave);}
 }

 saveTaxable(model) {
  this._serviceValidation.addTaxDedPurchase(model).subscribe((data: number) => {
    if (data > 0)
     {
        this.messageService.add({  severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });   
    }
    else { this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }) }
  }, (error: HttpErrorResponse) =>
    this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
    ));
}

}
