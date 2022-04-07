import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { ApplicableTaxdedCost } from 'src/app/models/srm/common/applicable-taxded-cost';
import { DistributionTaxDeductible } from 'src/app/models/srm/common/distribution-tax-deductible';
import { Taxabletype } from 'src/app/models/srm/common/taxabletype';
import { Reception } from 'src/app/models/srm/reception';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { FilterxProdODC } from 'src/app/models/srm/reception/filtertaxprododc';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { FiltersPanelComponent } from 'src/app/modules/masters-mpc/attribute-agrupation/filters-panel/filters-panel.component';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { ApplicableTaxdedCostFilter } from 'src/app/modules/srm/shared/filters/common/applicable-taxded-cost-filter';
import { DistributionTaxDeductibleFilter } from 'src/app/modules/srm/shared/filters/common/distribution-tax-deductible-filter';
import { TaxabletypeFilter } from 'src/app/modules/srm/shared/filters/common/taxabletypefilter';
import { applyCost } from 'src/app/modules/srm/shared/filters/enum-type-negotiation';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { DistributionCost } from 'src/app/modules/srm/shared/Utils/distribution-cost';
import { Typevalue } from 'src/app/modules/srm/shared/view-models/common/typevalue';
import { TaxableDeductiblePurchase } from 'src/app/modules/srm/shared/view-models/taxabledeductiblepurchase';

@Component({
  selector: 'app-dedheader-purchase',
  templateUrl: './dedheader-purchase.component.html',
  styleUrls: ['./dedheader-purchase.component.scss']
})
export class DedheaderPurchaseComponent implements OnInit {


  selectedDeductible: any[] = [];
  deductibles: DeductibleRep = new DeductibleRep();
  typeDiscountList: SelectItem[] = [];
  type: Typevalue[];
  typelist: SelectItem[] = [];
  deductiblesListTemp: DeductibleRep[] = [];
  ApplyCostList: SelectItem[] = [];
  DistributionCostList: SelectItem[] = [];
  submitted: boolean;
  typeTaxableList: SelectItem[] = [];
  applyCost: typeof ApplyCost = ApplyCost;
  distributionCost: typeof DistributionCost = DistributionCost;
  _validations: Validations = new Validations();
  deductiblesfijo: DeductibleRep[] = [];
  load: boolean = false;
  TaxabledeductibleList: TaxdedRep = new TaxdedRep();
  @Input() PurchaseVal: PurchaseValidation; //Cabecera de la recepcion ReceptionOrder
  @Output("onhide") onhide = new EventEmitter();
  @Output("issave") issave = new EventEmitter<boolean>();
  @Input("subtotalHeader") subtotalHeader: number = 0;
  @Input() reception: Reception = new Reception();
  isCost: boolean = true;
  cont: number = 0;
  indDetailProductoApply: boolean = false;
  DeductibleODC:TaxableRep[] = [];
  @ViewChild('dt', { static: false }) dt: any;

  displayedColumns: ColumnD<DeductibleRep>[] =
    [
      // { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'deductibleId', display: 'none' },
      { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
      { field: 'idTemp', header: 'Deducible procedente', display: 'table-cell' },
      { template: (data) => { return data.discountRate; }, header: 'Tipo de valor', field: 'discountRate', display: 'table-cell' },
      { template: (data) => { return data.applyCost; }, header: 'Aplica a', field: 'applyCost', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

    ];
  constructor(private _taxeTypeApplicationService: TaxeTypeApplicationService,
    private _commonSRMService: CommonsrmService,
    private messageService: MessageService,
    private _discountType: DiscountRateService,
    private decimalPipe: DecimalPipe,
    private confirmationService: ConfirmationService,
    private  _serviceValidation: ValidationProductService,
    private readonly dialogService: DialogsService) {

    this.type = [
      { id: 0, name: 'Monto' },
      { id: 1, name: 'Porcentaje' }
    ];
  } 

  ngOnInit(): void {
  }
  onShowDeductible() {
    this.indDetailProductoApply = false;
    this.GetTypeDiscount();
    this.GetTypeList();
    this.GetApplyCost(applyCost.subTotal);
    this.GetTaxableType();
    this.GetDistributionCost(DistributionCost.subTotal)
    this.LoadDedOdc();
    if (this.reception.paymentNegotiation.paymentConditionId > 0)
    {
       this.loadDiscount();
    }

  }

  //Obtiene aplica cost
  GetApplyCost(id: number) {
    var filter = new ApplicableTaxdedCostFilter();
    filter.active = 1;
    filter.id = id;
    this._commonSRMService.GetApplicableTaxableDeductibleCost(filter).subscribe((data: ApplicableTaxdedCost[]) => {
      this.ApplyCostList = data.map((item) => ({
        label: item.applyCost,
        value: item.id
      }));  
      
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de aplica costos" });
    });
  }

  //Obtiene la distribucion de cost
  GetDistributionCost(id: number) {
    var filter = new DistributionTaxDeductibleFilter();
    filter.active = 1;
    filter.id = id
    this._commonSRMService.GetDistributionTaxableDeductible(filter).subscribe((data: DistributionTaxDeductible[]) => {
      this.DistributionCostList = data.map((item) => ({
        label: item.distribution,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de distribución de costos" });
    });
  }

  chanAply() {
    if (this.deductibles.distributionCalculationId == DistributionCost.subTotal) {

      this.GetApplyCost(applyCost.subTotal);
    } 
  }

  GetTypeDiscount() {
    var filter = new DiscountRate()
    filter.id = -1;
    //filter.active=1;
    this._discountType.getDiscountRateList(filter).subscribe((data: DiscountRate[]) => {
      this.typeDiscountList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de descuentos." });
    });
  }

  GetTypeList() {
    this.typelist = this.type.map((item) => ({
      label: item.name,
      value: item.id
    }));
  }

  //Imponibles 
  GetTaxableType() {
    var filter = new TaxabletypeFilter();
    filter.id = -1;
    filter.active = 1;
    filter.indDeductible = 1;
    this._commonSRMService.getTaxableType(filter).subscribe((data: Taxabletype[]) => {
      this.typeTaxableList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      this.typeTaxableList = this.typeTaxableList.filter(x => x.value != 6)//condicion de pago;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de imponibles" });
    });
  }

  AddDeductible() {
    this.submitted = true;
      if (this.deductibles.idDiscountRate == 1) { //porcentaje
        if (this.deductibles.taxableDeductibleBase != "" && this.deductibles.idApply > 0 && this.deductibles.rate > 0 && this.deductibles.distributionCalculationId > 0) {
          this.deductibleTempAdd();
        }
      } else {
        if (this.deductibles.idDiscountRate == 2) // valor
          if (this.deductibles.idApply > 0 && this.deductibles.amount > 0 && this.deductibles.taxableDeductibleBase != "" && this.deductibles.distributionCalculationId > 0) {
            this.deductibleTempAdd();
          }
      
    }
    this.submitted = false;
    //this.clear();
  }

  deductibleTempAdd() {
    // this.EvaluarAsignacionesNames();  asignameApply() {
    //this.deductiblesfijo = [];
    this.cont = this.cont + 1;
    this.deductibles.applyCost = (this.ApplyCostList.find(x => x.value == this.deductibles.idApply).label);
    this.deductibles.discountRate = (this.typeDiscountList.find(x => x.value == this.deductibles.idDiscountRate).label);
    this.deductibles.taxableType = (this.typeTaxableList.find(x => x.value == this.deductibles.idTaxableType).label);
      //evaluando que me falta al momento de los descuentos
      //this.deductibles.ind = false;
      if (this.deductibles.distributionCalculationId == DistributionCost.applyAll) {
        this.deductibles.indPurchaseTaxable = true;
        this.deductibles.indPurchaseTaxableDetail = false;
      } else {
        this.deductibles.indPurchaseTaxable = true;
      }
     // this.deductibles.idPurchaseOrder = this.ReceptionOrder.id
    
    this.deductibles.idTemp = this.cont
    this.deductibles.active = true;

    if (this.deductibles.idTaxableType == 5) {
      if (this.deductiblesListTemp.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible esta agregado en la lista." });
      } else {
          //cabecera
          this.deductiblesListTemp.push(this.deductibles);
        
      }
    } else {
      if (this.deductiblesListTemp.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible esta agregado en la lista." });
      } else {
          //cabecera
          this.deductiblesListTemp.push(this.deductibles);     
      }

    }
    this.dt.reset()
    this.deductiblesfijo = this.deductiblesListTemp;
    // this.deductiblesfijo = {...this.deductiblesListTemp};//push(this.deductibles);
    // console.log(this.txablesListTemp);
    this.clear();
  }
  clear() {
    this.deductibles = new DeductibleRep();
    this.deductibles.taxableDeductibleBase = "";
    this.deductibles.rate = 0;
    this.deductibles.amount = 0;
    this.deductibles.idApply = -1;
    this.deductibles.idDiscountRate = -1;
    this.deductibles.idTax = -1;
    this.deductibles.applyCost = "";
    //this.deductibles.taxableType = "";
  }
  clearinput(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }
  save() {
  
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    var indSave: boolean = true;
    var message: string = "";
    var listdedrate: any[] = [];
    if (this.selectedDeductible.length > 0) {
      this.TaxabledeductibleList.deductibles= this.selectedDeductible;
      this.load = true;
        var sumde = this.selectedDeductible.reduce((sum, current) => sum + current.amount, 0);
        if (this.subtotalHeader > 0)
        {
           if (sumde >= this.subtotalHeader) {
              message = "La cantidad de deducible supera el subtotal."
             indSave = false;
           }
           else
           {  
              this.dialogService.confirmDialog('confirmBack', '¿Está seguro que desea agregar los deducibles, una vez aplicados se alterarán lel subtotal de la compra?', () => {
                    let model=new TaxableDeductiblePurchase()
                    model.idPurchase=this.PurchaseVal.idPurchase
                    this.selectedDeductible.map(x=>x.idPurchase=this.PurchaseVal.idPurchase)
                    model.deductibles=this.selectedDeductible
                    this.savechanges(model);
             });

           }
           this.load=false;
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos un descuento." });
        }
      
  }
}

  savechanges(model:TaxableDeductiblePurchase)
  {
      this._serviceValidation.addTaxDedPurchase(model).subscribe((data: number) => {
      if (data > 0)
       {
          this.load=false;
          this.messageService.add({  severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
          this.onhide.emit();
          this.issave.emit(true)
      }
      else { this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }) }
    }, (error: HttpErrorResponse) =>
      this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
      ));
     
  }

  onRemove(idProducTax: number) {
    this.deductiblesListTemp = this.deductiblesListTemp.filter(x => x.idTemp != idProducTax);
    this.deductiblesfijo = this.deductiblesListTemp;
  }
  hideDialog() {
    if (this.deductiblesListTemp.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea cancelar el registro? perderán los cambios realizados.',
        accept: () => {
          this.onhide.emit();
        },
      });
    }
  }


  reset(event) {

    if (event.target.value == "" || event.target.value == " ") {
      event.target.value = "0,0000";
      if (this.deductibles.rate == null) {
        this.deductibles.rate = 0;
      } else {
        this.deductibles.amount = 0;
      }
    }
  }
  ResetForm() {
    //this.taxables = new Taxable();
    this.deductibles.idTax = -1;
    this.deductibles.taxableDeductibleBase = "";
    //this.deductibles.idRate = -1;
    this.deductibles.rate = 0;
    this.deductibles.amount = 0;
    this.deductibles.distributionCalculationId = -1
    this.deductibles.idApply = -1;
    this.deductibles.idTypeValue = -1;
    this.deductibles.idDiscountRate = -1;
  }
  resetRate(idTypeDiscount: number) {
    if (idTypeDiscount == 1)//porcentaje
      this.deductibles.amount = 0;
    if (idTypeDiscount == 2)//monto
      this.deductibles.rate = 0;
  }//
  async LoadDedOdc()
  {
   var filterProductTaxesODC = new FilterxProdODC();
   filterProductTaxesODC.idProduct =-1;
   filterProductTaxesODC.idPurchase = this.PurchaseVal.idPurchase;//asignar la de la cabecera/
   filterProductTaxesODC.idPacking= -1;
   filterProductTaxesODC.indDeducible=true;
   this._serviceValidation.getProductTaxesbyODC(filterProductTaxesODC).subscribe((data: TaxableRep[]) => {
     
     this.DeductibleODC= data;
     //var cont = 0;
     this.DeductibleODC.forEach(tax => {
       var a = new DeductibleRep();
       a.idTaxableType = tax.idTaxableType;
       a.taxableType = tax.taxableType;
       a.rate = tax.rate;
       a.taxableDeductibleBase = tax.taxableDeductibleBase;
       a.idTax = tax.idTax;
       a.idApply = tax.idApply;
       a.applyCost = tax.applyCost;
       a.indDeductible = true;
       a.indTaxable = false;
       a.indFixedTax = tax.indFixedTax;
       a.indPurchaseTaxableDetail = true;
       a.idPurchaseDetail = -1;//idDetalle
       a.idPurchase = this.PurchaseVal.idPurchase;//IdCOMPRA
       a.idTemp = this.deductiblesListTemp.length +1;
     //  a.idTypeValue= tax.idTypeValue;//Tipo valor Porcentual o monto. 
       a.amount= tax.amount;
       a.idDiscountRate= tax.idDiscountRate;
       a.discountRate= tax.discountRate;
       a.active = true;
       a.indOdc= true;
        if(this.deductiblesListTemp.filter(x=>x.idTaxableType == a.idTaxableType && a.taxableDeductibleBase == x.taxableDeductibleBase).length == 0){
             this.deductiblesListTemp.push(a);
         }          
     });
     this.dt.reset()
     this.deductiblesfijo = this.deductiblesListTemp;
   }, (error: HttpErrorResponse) => {
 
     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los impuestos del producto en ODC." });
   });
 
}


loadDiscount()
{
  var a = new DeductibleRep();
  a.idDiscountRate = this.reception.paymentNegotiation.idDiscountType
  //  a.discountRate =(this.typeDiscountList.find(x => x.value == a.idDiscountRate).label);
  a.taxableDeductibleBase = this.reception.paymentNegotiation.name
  // a.idTypeValue = 0;
  if (this.reception.paymentNegotiation.idDiscountType == 1) { //Porcentual
    a.typeValue = "Porcentual";
    a.rate = this.reception.paymentNegotiation.discount;
    a.discountRate = a.typeValue
  } else {
    if (this.reception.paymentNegotiation.idDiscountType == 2) {  //monto
      a.typeValue = "Monto";
      a.amount = this.reception.paymentNegotiation.discount;
      a.discountRate = a.typeValue
    }
  }
  //a.typeValue = "Monto";
  a.taxableType = "Condición de pago";
  a.idTaxableType = 6;
  a.idApply = ApplyCost.Subtotal;
  a.distributionCalculationId = DistributionCost.subTotal
  a.applyCost = "subtotal";
  a.indDeductible = true;
  a.idTemp = 1;
  a.indOdc=true
  a.indPurchaseTaxableDetail = false;
  a.indPurchaseTaxable = true
  a.idPurchaseDetail = -1;
  a.idPurchase = this.PurchaseVal.idPurchase
  a.active = true;
  this.deductiblesListTemp.push(a);
  this.deductiblesfijo = this.deductiblesListTemp;

}

}
