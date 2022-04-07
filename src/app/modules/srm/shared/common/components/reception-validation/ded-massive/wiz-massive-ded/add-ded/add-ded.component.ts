import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { ApplicableTaxdedCost } from 'src/app/models/srm/common/applicable-taxded-cost';
import { DistributionTaxDeductible } from 'src/app/models/srm/common/distribution-tax-deductible';
import { Taxabletype } from 'src/app/models/srm/common/taxabletype';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { ApplicableTaxdedCostFilter } from 'src/app/modules/srm/shared/filters/common/applicable-taxded-cost-filter';
import { DistributionTaxDeductibleFilter } from 'src/app/modules/srm/shared/filters/common/distribution-tax-deductible-filter';
import { TaxabletypeFilter } from 'src/app/modules/srm/shared/filters/common/taxabletypefilter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { DistributionCost } from 'src/app/modules/srm/shared/Utils/distribution-cost';
import { Typevalue } from 'src/app/modules/srm/shared/view-models/common/typevalue';

@Component({
  selector: 'app-add-ded',
  templateUrl: './add-ded.component.html',
  styleUrls: ['./add-ded.component.scss']
})
export class AddDedComponent implements OnInit {

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
  @Input("ProductOrder") ProductOrder: Productdetailvalidation; //Cambiar por modelo de validation
  @Input() PurchaseVal: PurchaseValidation; //Cabecera de la recepcion ReceptionOrder

  // @Output("_sendDeductibles") _sendDeductibles = new EventEmitter<{ TaxableListSave: Taxabledeductible }>();
  // //TaxableListSave: Taxabledeductible = new Taxabledeductible();
  // @Output("_sendTaxablesHeaderDetalleP") _sendTaxablesHeaderDetalleP = new EventEmitter<{ _products: PurchaseOrderProduct[] }>();
  // _products: PurchaseOrderProduct[] = [];
  // //Salidas de la cabecera
  // @Output("_sendTaxablesHeader") _sendTaxablesHeader = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible, isCost: boolean }>();
  // @Input("subtotalHeader") subtotalHeader: number = 0;
  // TaxableListHeaderSave: Taxabledeductible = new Taxabledeductible();
  @Input("_selectesProducts") _selectesProducts: ValidationProduct[];
  isCost: boolean = true;
  cont: number = 0;
  indDetailProductoApply: boolean = false;
  DeductibleODC:TaxableRep[] = [];
  @Input("DeductiblesSelected") DeductiblesSelected: DeductibleRep[] = [];
  @Output("DeductiblesSelectedChange") DeductiblesSelectedChange = new EventEmitter<DeductibleRep[]>();
  @Input("DeductiblesTemp") DeductiblesTemp:DeductibleRep[] = [];
  @Output("DeductiblesTempChange")DeductiblesTempChange= new EventEmitter<DeductibleRep[]>();
  @ViewChild('dt', { static: false }) dt: any
 

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
    private  _serviceValidation: ValidationProductService) {

    this.type = [
      { id: 0, name: 'Monto' },
      { id: 1, name: 'Porcentaje' }
    ];
  }

  ngOnInit(): void {
    this.onShowDeductible();
    debugger
    if (this.DeductiblesTemp.length>0){
      this.deductiblesfijo= this.DeductiblesTemp;
      if(this.DeductiblesSelected.length>0){
        this.selectedDeductible=this.DeductiblesSelected;
      }
    }else{
      this.deductiblesfijo=[];
    }
  }

  onShowDeductible() {
    if (this._selectesProducts != undefined) {
      if (this._selectesProducts.length > 0)
        this.GetDistributionCost(DistributionCost.applyAll)
    } 
    this.indDetailProductoApply = false;
    this.GetTypeDiscount();
    this.GetTypeList();
    this.GetApplyCost(-1);
    this.GetTaxableType();
  
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
      if (this.ProductOrder != undefined) {
        if (this.ProductOrder.idProduct != 0) {
          this.ApplyCostList = this.ApplyCostList.filter(x => x.value != ApplyCost.Subtotal);
        }
      } else {//aplica a costos y no subtotal
        if (id == -1) {
          this.ApplyCostList = this.ApplyCostList.filter(x => x.value != ApplyCost.Subtotal);
        }
      }
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

      this.GetApplyCost(3);
    } else {
      this.GetApplyCost(-1);
      //this.ApplyCostList= this.ApplyCostList.filter(x=>x.value!=ApplyCost.Subtotal);

    }
  }

  GetTypeDiscount() {
    var filter = new DiscountRate()
    filter.id = -1;
    //  filter.active=1;
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
    if (this.ProductOrder != undefined) {
      if (this.deductibles.idDiscountRate == 1) { //porcentaje
        if (this.deductibles.taxableDeductibleBase != "" && this.deductibles.idApply > 0 && this.deductibles.rate > 0) {
          this.deductibleTempAdd();
        }
      } else {
        if (this.deductibles.idDiscountRate == 2) // valor
          if (this.deductibles.idApply > 0 && this.deductibles.amount > 0 && this.deductibles.taxableDeductibleBase != "") {
            this.deductibleTempAdd();
          }
      }
      //CABECERA DEDUCIBLES 
    } else {
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
    if (this.ProductOrder != undefined) {
      if (this.ProductOrder.idProduct > 0) {
        this.deductibles.indPurchaseTaxableDetail = true;
         this.deductibles.idPurchaseDetail = this.ProductOrder.id;
        // this.deductibles.idPurchaseOrder = this.ProductOrder.idOrderPurchase;
      }
    } else {
      //evaluando que me falta al momento de los descuentos
      //this.deductibles.ind = false;
      if (this.deductibles.distributionCalculationId == DistributionCost.applyAll) {
        this.deductibles.indPurchaseTaxable = true;
        this.deductibles.indPurchaseTaxableDetail = false;
      } else {
        this.deductibles.indPurchaseTaxable = true;
      }
     // this.deductibles.idPurchaseOrder = this.ReceptionOrder.id
    }
    this.deductibles.idTemp = this.cont
    this.deductibles.active = true;

    if (this.deductibles.idTaxableType == 5) {
      if (this.deductiblesListTemp.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible esta agregado en la lista." });
      } else {
    
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
    debugger
    this.dt.reset()
    this.deductiblesfijo = this.deductiblesListTemp;
    this.DeductiblesTempChange.emit(this.deductiblesfijo);
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
          //this.onhide.emit();
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

  CheckDeductibles(){
    this.DeductiblesSelected = this.selectedDeductible;
    this.DeductiblesSelectedChange.emit(this.DeductiblesSelected);
  }

}
