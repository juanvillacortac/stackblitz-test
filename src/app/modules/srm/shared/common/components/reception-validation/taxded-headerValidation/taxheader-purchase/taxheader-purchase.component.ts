import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxRateApp } from 'src/app/models/masters/tax-rate-app';
import { TaxRateAppFilter } from 'src/app/models/masters/tax-rate-app-filter';
import { ApplicableTaxdedCost } from 'src/app/models/srm/common/applicable-taxded-cost';
import { DistributionTaxDeductible } from 'src/app/models/srm/common/distribution-tax-deductible';
import { Taxabletype } from 'src/app/models/srm/common/taxabletype';
import { FilterxProdODC } from 'src/app/models/srm/reception/filtertaxprododc';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { TaxDedFilter } from 'src/app/models/srm/reception/taxdedfilter';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { TaxService } from 'src/app/modules/masters/taxes/shared/tax.service';
import { ProducttaxesService } from 'src/app/modules/products/shared/services/producttaxes/producttaxes.service';
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

type NewType = SelectItem;

@Component({
  selector: 'app-taxheader-purchase',
  templateUrl: './taxheader-purchase.component.html',
  styleUrls: ['./taxheader-purchase.component.scss']
})
export class TaxheaderPurchaseComponent implements OnInit {


  @Input() PurchaseVal: PurchaseValidation; //Cabecera de la compra
  @Output("onhide") onhide = new EventEmitter();
  @Output("issave") issave = new EventEmitter<boolean>();
  selectedTaxable: TaxableRep[] = [];
  //TaxableDeductibletypeFilter: TaxabletypeFilter = new TaxabletypeFilter();
  typeTaxableList: SelectItem[] = [];
  TaxableList: SelectItem[] = [];
  TaxList: SelectItem[] = [];
  rateList: NewType[] = [];
  taxables: TaxableRep = new TaxableRep();
  txablesListTemp: TaxableRep[] = [];
  type: Typevalue[];
  typelist: SelectItem[] = [];
  ApplyCostList: SelectItem[] = [];
  DistributionCostList: SelectItem[] = [];
  TaxableODC:TaxableRep[] = [];
  visible: boolean = false;
  submitted: boolean = false;
  TaxabledeductibleList: TaxdedRep = new TaxdedRep()
  applyCost: typeof ApplyCost = ApplyCost;
  distributionCost: typeof DistributionCost = DistributionCost;
  _validations: Validations = new Validations();
  cont: number = 0;
  load: boolean = false;
  indDetailProductoApply: boolean = false;
  @Input("subtotalHeader") subtotalHeader: number = 0;

  @ViewChild('dt', { static: false }) dt: any
  displayedColumns: ColumnD<TaxableRep>[] =
    [
      { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
      { template: (data) => { return data.taxableType; }, header: 'Tipo de imponible', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
      // { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

      { field: 'idProducTax', header: 'Impuesto procedente', display: 'table-cell' },
      { template: (data) => { return data.applyCost; }, header: 'Aplica a', field: 'applyCost', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

    ];
  constructor(private _commonSRMService: CommonsrmService,
    private messageService: MessageService,
    private _taxeTypeApplicationService: TaxeTypeApplicationService,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public _ProductTaxesService: ProducttaxesService,
    private confirmationService: ConfirmationService,
    private _taxService: TaxService,
    private  _serviceValidation: ValidationProductService,
    private readonly dialogService: DialogsService
    ) {

    this.type = [
      { id: 0, name: 'Monto' },
      { id: 1, name: 'Porcentaje' }
    ]; }

  ngOnInit(): void {
  }
  onShowTaxable() {
    this.indDetailProductoApply = false;
    this.GetTaxableType();
    this.GetApplyCost(applyCost.subTotal);
    this.GetDistributionCost(DistributionCost.subTotal)  
    this.GetTaxable();
    this.GetTypeList();
    this.taxables.idTaxableType = 1; 
    this.LoadTaxODC(); 
  }

  //Imponibles 
  GetTaxableType() {
    var filter = new TaxabletypeFilter();
    filter.id = -1;
    filter.active = 1;
    filter.indDeductible = 0;
    //  filter.active=1;
    this._commonSRMService.getTaxableType(filter).subscribe((data: Taxabletype[]) => {
      this.typeTaxableList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de imponibles" });
    });
  }

  GetTypeList() {
    this.typelist = this.type.map((item) => ({
      label: item.name,
      value: item.id
    }));
  }

  //Obtiene los de impuestos
  GetTaxable() {
    var filter = new TaxFilters();
    filter.active = 1
    filter.idCountry = 2;
    filter.idTaxeTypeApplication = 2;
    filter.id = -1
    this._taxService.getTaxes(filter).then((data: Tax[]) => {
      this.TaxList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      //this.TaxableList= this.TaxableList
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los impuestos." });
    });
  }

  //Obtiene las tasas de los impuestos 
  GetTaxableRate(taxId: number) {
    var filter = new TaxRateAppFilter();
    filter.countryId = 2 //Pasar el idcountry de la orden de compra
    filter.taxeTypeApplicationId = 2;
    filter.active = 1;
    filter.taxId = taxId;
    //  filter.active=1;
    this._taxeTypeApplicationService.GetTaxRatexApplication(filter).subscribe((data: TaxRateApp[]) => {
      this.rateList = data.map((item) => ({
        label: item.value.toString(),
        value: item.idRateTax
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de imponibles" });
    });
  }

  //Obtiene la distribucion de cost
  GetDistributionCost(id:number) {
    var filter = new DistributionTaxDeductibleFilter();
    filter.active = 1;
    filter.id=id
    this._commonSRMService.GetDistributionTaxableDeductible(filter).subscribe((data: DistributionTaxDeductible[]) => {
      this.DistributionCostList = data.map((item) => ({
        label: item.distribution,
        value: item.id
      }));
     
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de imponibles" });
    });
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
      //aplica a costos y no subtotal
        if (id == -1) {
          this.ApplyCostList = this.ApplyCostList.filter(x => x.value != ApplyCost.Subtotal);
        }
      
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de imponibles" });
    });
  }
  //#region asignacion de values
  EvaluarAsignacionesNames() {
    this.asignameTax();
    this.asignameTypeTax();
    this.asignameApply();
  }

  asigvalue() {
    this.taxables.rate = parseFloat(this.rateList.find(x => x.value == this.taxables.idRate).label);
  }

  asignameTax() {
    if (this.taxables.idTaxableType == 1) //Es tipo impuesto
      this.taxables.taxableDeductibleBase = (this.TaxList.find(x => x.value == this.taxables.idTax).label);
    //this.taxables.taxableDeductibleBase = (this.TaxableList.find(x => x.value == this.taxables.idTax).label);
  }

  asignameTypeTax() {
    this.taxables.taxableType = (this.typeTaxableList.find(x => x.value == this.taxables.idTaxableType).label);
  }
  asignameApply() {
    this.taxables.applyCost = (this.ApplyCostList.find(x => x.value == this.taxables.idApply).label);
  }

  chanAply() {
    if (this.taxables.distributionCalculationId == DistributionCost.subTotal) {

      this.GetApplyCost(applyCost.subTotal);
    } 
  }
  //#endregion
  saveTaxable() {
   var filter:  TaxDedFilter = new TaxDedFilter();
    if (this.selectedTaxable.length > 0) {
      this.load = true;
      this.TaxabledeductibleList.taxables = this.selectedTaxable;
      if(this.selectedTaxable.length > 0){

              this.dialogService.confirmDialog('confirmBack', '¿Está seguro que desea agregar los imponibles, una vez aplicados se alterarán lel subtotal de la compra??', () => {
                     let model=new TaxableDeductiblePurchase()
                     model.idPurchase=this.PurchaseVal.idPurchase
                     this.selectedTaxable.map(x=>x.idPurchase=this.PurchaseVal.idPurchase)
                     model.taxables=this.selectedTaxable
                     this.savechanges(model);     
              });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos un impuesto." });
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


  //IMPUESTO cabecera EN ODC
  async LoadTaxODC()
  {
      var filterProductTaxesODC = new FilterxProdODC();
      filterProductTaxesODC.idProduct = -1;
      filterProductTaxesODC.idPurchase =this.PurchaseVal.idPurchase ;//asignar la de la cabecera/
      filterProductTaxesODC.idPacking= -1;
      filterProductTaxesODC.indDeducible= false;
      this._serviceValidation.getProductTaxesbyODC(filterProductTaxesODC).subscribe((data: TaxableRep[]) => {
        
        this.TaxableODC= data;
        //var cont = 0;
        this.TaxableODC.forEach(tax => {
          var a = new TaxableRep();
          a.idTaxableType = tax.idTaxableType;
          a.taxableType = tax.taxableType;
          a.rate = tax.rate;
          a.taxableDeductibleBase = tax.taxableDeductibleBase;
          a.idTax = tax.idTax;
          a.idRate = tax.idRate;
          a.idApply = tax.idApply;
          a.applyCost = tax.applyCost;
          a.indDeductible = false;
          a.indTaxable = true;
          a.indFixedTax = tax.indFixedTax;
          a.indPurchaseTaxableDetail = true;
          a.idPurchaseDetail = -1;//idDetalle
          a.idPurchase = this.PurchaseVal.idPurchase;//IdCOMPRA
          a.idProducTax =-1// this.txablesListTemp.filter(x=>x.idProducTax!=-1).length +1;
          a.amount= tax.amount;
          a.active = true;
          a.indOdc= true;
            if(this.txablesListTemp.filter(x=>x.idTaxableType == a.idTaxableType && a.idTax == x.idTax).length == 0){
                this.txablesListTemp.push(a);
              
          }
        });
        this.dt.reset()
        this.txablesListTemp = this.txablesListTemp;
      }, (error: HttpErrorResponse) => {
    
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los impuestos del producto en ODC." });
      });
    
    }

  AddTxable() {
    this.submitted = true;
  
      if (this.taxables.idTaxableType == 1) {
        if (this.taxables.idTax > 0 && this.taxables.idApply > 0 && this.taxables.distributionCalculationId > 0 && this.taxables.idRate > 0) {
          this.taxableTempAdd();
          this.submitted = false;
        }
      } else {
        if (this.taxables.idTypeValue == 0) {
          if (this.taxables.idTaxableType > 0 && (this.taxables.idApply > 0 && this.taxables.amount > 0 && this.taxables.distributionCalculationId > 0) && this.taxables.taxableDeductibleBase.trim() != "") {
            this.taxableTempAdd();
            this.submitted = false;
          }
        } else {
          if (this.taxables.idTaxableType > 0 && (this.taxables.idTypeValue == 1 && this.taxables.idApply > 0 && this.taxables.rate > 0 && this.taxables.distributionCalculationId > 0 && this.taxables.taxableDeductibleBase.trim() != "")) {
            this.taxableTempAdd();
            this.submitted = false;
          }
        }

      // this.submitted = false;
    }

    //this.clear();
  }

  taxableTempAdd() {
    this.cont = this.cont + 1;
    this.EvaluarAsignacionesNames();

      //Condiciones para aplicar impuesto de cabecera y detalles
      if (this.taxables.distributionCalculationId == DistributionCost.applyAll) {
        this.taxables.indPurchaseTaxable = true;
        this.taxables.indPurchaseTaxableDetail = false;
      } else {
        this.taxables.indPurchaseTaxable = true;
      }
      //this.taxables.idPurchaseOrder = this.ReceptionOrder.id//this.PurchaseOrder.purchase.idOrderPurchase;
    
    this.taxables.active = true;

    this.taxables.idProducTax = this.cont;
    //Imponible 1
    if (this.taxables.idTaxableType == 1) {
      if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.idTax == x.idTax).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
      } else {
          //cabecera
          this.txablesListTemp.push(this.taxables);       
      }
    } else {
      if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
      } else {
          //cabecera
          this.txablesListTemp.push(this.taxables);
        
      }
    }
    this.dt.reset()
    this.txablesListTemp = this.txablesListTemp;
    this.clear();

  }

  clear() {
    this.taxables = new TaxableRep();
    this.taxables.taxableDeductibleBase = "";
    this.taxables.rate = 0;
    this.taxables.amount = 0;
    this.taxables.idApply = -1;
    this.taxables.idTaxType = -1;
    this.taxables.idTax = -1;
    this.taxables.applyCost = "";
    this.taxables.taxableType = "";
  }

  onRemove(idProducTax: number) {
    this.txablesListTemp = this.txablesListTemp.filter(x => x.idProducTax != idProducTax);
  }

  clearinput(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }

  hideDialog() {
    if (this.txablesListTemp.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea cancelar el registro? perderán los cambios realizados.',
        accept: () => {
          this.indDetailProductoApply = false;
          this.onhide.emit();
        },
      });
    }
  }

  reset(event) {
    if (event.target.value == "" || event.target.value == " ") {
      event.target.value = "0,0000";
      if (this.taxables.rate == null) {
        this.taxables.rate = 0;
      } else {
        this.taxables.amount = 0;
      }
    }
  }
  ResetForm() {
    //this.taxables = new Taxable();
    this.taxables.idTax = -1;
    this.taxables.taxableDeductibleBase = "";
    this.taxables.idRate = -1;
    this.taxables.rate = 0;
    this.taxables.amount = 0;
    this.taxables.distributionCalculationId = -1
    this.taxables.idApply = -1;
    this.taxables.idTypeValue = -1;
  }
  resetRate(idTypeValue: number) {
    if (idTypeValue == 1)//porentaje
      this.taxables.amount = 0;
    if (idTypeValue == 0)//monto
      this.taxables.rate = 0;
  }
}
