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
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
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
  selector: 'app-dex-val',
  templateUrl: './dex-val.component.html',
  styleUrls: ['./dex-val.component.scss']
})
export class DexValComponent implements OnInit {

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

  @Output("onhide") onhide = new EventEmitter();
  // @Output("_sendDeductibles") _sendDeductibles = new EventEmitter<{ TaxableListSave: Taxabledeductible }>();
  // //TaxableListSave: Taxabledeductible = new Taxabledeductible();
  // @Output("_sendTaxablesHeaderDetalleP") _sendTaxablesHeaderDetalleP = new EventEmitter<{ _products: PurchaseOrderProduct[] }>();
  // _products: PurchaseOrderProduct[] = [];
  // //Salidas de la cabecera
  // @Output("_sendTaxablesHeader") _sendTaxablesHeader = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible, isCost: boolean }>();
  // @Input("subtotalHeader") subtotalHeader: number = 0;
  // TaxableListHeaderSave: Taxabledeductible = new Taxabledeductible();
   @Input("_productsMasivo") _productsMasivo: Productdetailvalidation[]; //cambiar por modelo de productos de recepcion 
 // //Emitir tabla de Imponibles del product detail 
  @Output("_sendTaxablesProductDetail") _sendTaxablesProductDetail = new EventEmitter< {TaxDetailProd:Productdetailvalidation}>();

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
    private  _serviceValidation: ValidationProductService) {

    this.type = [
      { id: 0, name: 'Monto' },
      { id: 1, name: 'Porcentaje' }
    ];
  }

  ngOnInit(): void {
  }

  onShowDeductible() {
    // if(this.ProductOrder.deductibles== undefined){
    //   let bars: DeductibleRep[];
    //     bars = [];
    //     this.ProductOrder.deductibles = bars;
    // }
    // if(this.ProductOrder.taxables== undefined){
    //   let bars: TaxableRep[];
    //     bars = [];
    //     this.ProductOrder.taxables = bars;
    // }
    this.indDetailProductoApply = false;
    this.GetTypeDiscount();
    this.GetTypeList();
    this.GetApplyCost(-1);
    this.GetTaxableType();
    if (this.ProductOrder == undefined && this._productsMasivo == undefined) {
      // if (this.PurchaseOrder.purchase.paymentsConditions.idPaymentCondition > 0) {
      //   this.loadDiscount();
      // }
    }
    if (this._productsMasivo != undefined) {
      if (this._productsMasivo.length > 0)
        this.GetDistributionCost(DistributionCost.applyAll)
    } else {
      this.GetDistributionCost(DistributionCost.subTotal)
    }

    if(this.ProductOrder!=undefined){
        this.LoadDedOdc();
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
        this.deductibles.idPurchase = this.PurchaseVal.idPurchase;
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
        if (this.ProductOrder != undefined) {
          if (this.ProductOrder.deductibles.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length == 0)
            this.deductiblesListTemp.push(this.deductibles);
          else
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible  esta registrado." });
        } else {
          //cabecera
          this.deductiblesListTemp.push(this.deductibles);
        }
      }
    } else {
      if (this.deductiblesListTemp.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible esta agregado en la lista." });
      } else {
        if (this.ProductOrder != undefined) {
          if (this.ProductOrder.deductibles.filter(x => x.idTaxableType == this.deductibles.idTaxableType && this.deductibles.taxableDeductibleBase == x.taxableDeductibleBase).length == 0)
            this.deductiblesListTemp.push(this.deductibles);

          else
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El deducible  esta registrado." });
          //this.txablesListTemp.push(this.taxables);
        } else {
          //cabecera
          this.deductiblesListTemp.push(this.deductibles);
        }
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
  debugger
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    var indSave: boolean = true;
    var message: string = "";
    var listdedrate: any[] = [];
    if (this.selectedDeductible.length > 0) {
      this.TaxabledeductibleList.deductibles= this.selectedDeductible;
      this.load = true;
      if (this.ProductOrder != undefined) {
        let costoprod = 0;
        let costded = 0;
        let porcentded = 0;
        costoprod = this.ProductOrder.individual.indAdded == 1 ? this.ProductOrder.individual.baseCost : this.ProductOrder.master.baseCost;
        listdedrate = this.selectedDeductible.filter(x => x.rate > 0);
        if (listdedrate.length > 0) {
          for (let i = 0; i < listdedrate.length; i++) {
            porcentded = porcentded + (costoprod * (listdedrate[i].rate / 100))
          }
        }
        var sumde = this.selectedDeductible.reduce((sum, current) => sum + current.amount, 0);

        if (sumde + porcentded >= costoprod) {
          indSave = false
          message = "La cantidad de deducible supera el costo del producto."
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de deducible supera el costo del producto." });
        }
        // if(porcentded>=costoprod){
        //   indSave = false
        //   message = "La cantidad de deducible supera el costo del producto."
        // }

        // var sumporcentaje = this.selectedDeductible.reduce((sum, current) => sum + current.rate, 0);
        if (this.ProductOrder.individual.indAdded == 1) {
          costded = (this.ProductOrder.individual.deductibleBase / this.ProductOrder.packagingQuantity)  //this.ProductOrder.deductibles.reduce((sum, current)=> sum + current.amount, 0 );
          // porcentded= this.ProductOrder.deducibles.reduce((sum, current)=> sum + current.rate, 0 );
        } else {
          //master
          costded = (this.ProductOrder.master.deductibleBase / this.ProductOrder.packagingQuantity)
        }
        if (costded > 0) {
          if (sumde + costded + porcentded >= costoprod) {
            indSave = false
            message = "La cantidad de deducible supera el costo del producto."
            // this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de deducible supera el costo del producto." });
          }
        }
 
        //Call method Calculat
         this.CalculateDeductibles();
         this.load = false;
         this.onhide.emit();
      } else {
        var sumde = this.selectedDeductible.reduce((sum, current) => sum + current.amount, 0);
        // if (this.subtotalHeader > 0) {
        //   if (sumde >= this.subtotalHeader) {
        //     message = "La cantidad de deducible supera el subtotal."
        //     indSave = false;
        //   }

        // }
      }

      ///this.load=false;

    //   if (!indSave)
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    //   this.TaxabledeductibleList.deductibles = this.selectedDeductible;
    //   if (this.TaxabledeductibleList.deductibles.filter(x => x.distributionCalculationId == DistributionCost.applyAll).length > 0)
    //     this.indDetailProductoApply = true;
    //   if (this._productsSelecteds != undefined) {
    //     if (this._productsSelecteds.length > 0)
    //       this.TaxabledeductibleList.products = this._productsSelecteds;
    //   }
    //   if (indSave) {
    //     if (this._productsSelecteds != undefined) {
    //       if (this._productsSelecteds.length > 0)
    //         this.TaxabledeductibleList.products = this._productsSelecteds;
    //     }
    //     this.purchaseService.SaveTaxables(this.TaxabledeductibleList).subscribe((data: number) => {
    //       if (data > 0) {
    //         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
    //         this.deductiblesListTemp = [];
    //         this.selectedDeductible = [];
    //         this.cont = 0;
    //         this.TaxabledeductibleList.deductibles = [];
    //         //Obtener listado de imponibles y deducibles

    //         if (this.ProductOrder != undefined) {
    //           filter.purchaseOrderDetail = this.ProductOrder.id;
    //         } else {
    //           filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
    //         }
    //         debugger
    //         if (this._productsSelecteds != undefined) {
    //           if (this._productsSelecteds.length > 0) {
    //             //Get taxables prodcutos. 
    //             this.purchaseService.GetTaxDedProd(this._productsSelecteds, this.PurchaseOrder.purchase.idOrderPurchase).subscribe((data: PurchaseOrderProduct[]) => {
    //               this._products = data;
    //               console.log(this._products);
    //               if (data.length > 0) {
    //                 debugger
    //                 this._sendTaxablesHeaderDetalleP.emit({
    //                   _products: this._products
    //                 })
    //               }
    //               this.load = false;
    //               // this.loading = false;
    //               // this.loadingService.stopLoading();
    //             }, (error: HttpErrorResponse) => {
    //               // this.loading = false;
    //               // this.loadingService.stopLoading();
    //               this.load = false;
    //               this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    //             });
    //           }
    //             //emitir event al component padre.
    //             this.onhide.emit();
    //         } else {
    //           this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {

    //             if (data.deductibles.length > 0) {

    //               this.TaxableListSave.deductibles = data.deductibles;
    //               //emitir evento
    //               this._sendDeductibles.emit({
    //                 TaxableListSave: this.TaxableListSave
    //               });
    //             }

    //             if (filter.purchaseOrderDetail != -1) {
    //               if (data.taxables.length > 0 || data.deductibles.length > 0) {

    //                 this.TaxableListSave.taxables = data.taxables;
    //                 this.TaxableListSave.deductibles = data.deductibles;
    //                 //emitir evento
    //                 this._sendDeductibles.emit({
    //                   TaxableListSave: this.TaxableListSave
    //                 });
    //               }
    //             } else {//CABECERA
    //               if (data.deductibles.length > 0 || data.taxables.length > 0) {

    //                 this.TaxableListHeaderSave.deductibles = data.deductibles;
    //                 this.TaxableListHeaderSave.taxables = data.taxables;
    //                 //emitir evento
    //                 this._sendTaxablesHeader.emit({
    //                   TaxableListHeaderSave: this.TaxableListHeaderSave,
    //                   isCost: this.isCost
    //                 });
    //               }

    //               //validar si existen imponibles o deducibles hacia el detail from header 
    //               if (this.indDetailProductoApply) {
    //                 this.TaxableListHeaderSave.deductibles = data.deductibles.filter(x => x.distributionCalculationId == DistributionCost.applyAll);
    //                 this.TaxableListHeaderSave.taxables = []//data.taxables.filter(x=>x.distributionCalculationId==DistributionCost.applyAll);

    //                 this._sendTaxablesHeaderDetalleP.emit({
    //                   TaxableListHeaderSave: this.TaxableListHeaderSave,
    //                 })
    //               }
    //             }


    //             this.load = false;
    //           }, (error: HttpErrorResponse) => {
    //             this.load = false;
    //             this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    //           });
    //           //emitir event al component padre.
    //           this.onhide.emit();
    //         }
    //       } else if (data == -1) {
    //         this.load = false;
    //         this.TaxabledeductibleList.deductibles = [];
    //         this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El deducible ya existe." });

    //       } else {
    //         this.TaxabledeductibleList.deductibles = [];
    //         this.load = false;
    //         console.log(data);
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los deducibles." });
    //       }
    //       this.load = false;
    //     }, (error: HttpErrorResponse) => {
    //       this.TaxabledeductibleList.deductibles = [];
    //       this.load = false;
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los deducibles." });
    //     });
    //   }
    //   this.load = false;
    // } else {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos un descuento." });
    // }


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

  async LoadDedOdc(){
    
         debugger;
        var filterProductTaxesODC = new FilterxProdODC();
        filterProductTaxesODC.idProduct = this.ProductOrder.idProduct;
        filterProductTaxesODC.idPurchase = this.PurchaseVal.idPurchase;//asignar la de la cabecera/
        filterProductTaxesODC.idPacking= this.ProductOrder.idPacking;
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
            a.idPurchaseDetail = this.ProductOrder.id;//idDetalle
            a.idPurchase = this.PurchaseVal.idPurchase;//IdCOMPRA
            a.idTemp = this.deductiblesListTemp.length +1;
          //  a.idTypeValue= tax.idTypeValue;//Tipo valor Porcentual o monto. 
            a.amount= tax.amount;
            a.idDiscountRate= tax.idDiscountRate;
            a.discountRate= tax.discountRate;
            a.active = true;
            a.indOdc= true;
            if (this.ProductOrder.deductibles.length > 0) {
             
              if (this.ProductOrder.deductibles.filter(x => x.idTaxableType == a.idTaxableType && a.taxableDeductibleBase == x.taxableDeductibleBase).length == 0) {
                  if(this.deductiblesListTemp.filter(x=>x.idTaxableType == a.idTaxableType && a.idTax == x.idTax).length == 0){
                    this.deductiblesListTemp.push(a);
                  }    
              }
            } else {
              if(this.deductiblesListTemp.filter(x=>x.idTaxableType == a.idTaxableType && a.taxableDeductibleBase == x.taxableDeductibleBase).length == 0){
                  this.deductiblesListTemp.push(a);
              }    
            }
          });
          this.dt.reset()
          this.deductiblesfijo = this.deductiblesListTemp;
        }, (error: HttpErrorResponse) => {
      
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los impuestos del producto en ODC." });
        });
      
  }

   //#region Calcular deducible detalles 
   CalculateDeductibles(){
    debugger
    
   let costBase = this.ProductOrder.individual.indAdded == 1 ? this.ProductOrder.individual.baseCost : this.ProductOrder.master.baseCost;
   let costnet=this.ProductOrder.individual.indAdded == 1 ? this.ProductOrder.individual.netCost: this.ProductOrder.master.netCost;
   let costdexNetBase = 0;
   let costdexNetSales = 0;
   let costdexnetconvertion = 0;
   let costNetBase = 0;
   let costNetSales = 0;
   let costnetconvertion = 0;
   let apllysalescost=false
   if ( this.TaxabledeductibleList.deductibles.length>0) {
     //if (data.TaxableListSave.taxables != undefined) {
       //if (data.TaxableListSave.taxables.length > 0) { 
         //this.ProductOrder.taxables = [];
         //this.isSave = false;
         //Provisional
        //  if(this.ProductOrder.taxables== undefined){
        //    let bars: TaxableRep[];
        //      bars = [];
        //      this.ProductOrder.taxables = bars;
        //  }
            
         this.TaxabledeductibleList.deductibles.forEach(Ded => {
             this.ProductOrder.deductibles.push(Ded);
         });
        //  // let bars: TaxableRep[];
        //  //   bars = [];
        //  if(this.ProductOrder.taxables.length>0){

        //   this.ProductOrder.taxables.forEach(taxP => {
        //     if (taxP.idApply == ApplyCost.costNetBase) {
        //       if (taxP.rate > 0) {
        //         costNetBase = costNetBase + (costBase * (taxP.rate / 100))
        //         costnetconvertion = costNetBase / parseFloat(this.PurchaseVal.exchangeRateSupplier.toString());
        //       } else {
        //         costNetBase = costNetBase + taxP.amount;
        //         costnetconvertion = costNetBase / parseFloat(this.PurchaseVal.exchangeRateSupplier.toString());
        //       }
  
        //     } else {
        //       if (taxP.rate > 0) {
        //         costNetSales = costNetSales + (costBase * (taxP.rate / 100))
        //       } else {
        //         costNetSales = costNetSales + taxP.amount
        //       }
        //       apllysalescost=true;
        //     }
        //   });
        //  }
        //  if(this.ProductOrder.deductibles.length>0){

        //   this.ProductOrder.deductibles.forEach(dedP => {
        //     if (dedP.idApply == ApplyCost.costNetBase) {
        //       if (dedP.rate > 0) {
        //        costdexNetBase = costdexNetBase + (costBase * (dedP.rate / 100))
        //        costdexnetconvertion = costdexNetBase / parseFloat(this.PurchaseVal.exchangeRateSupplier.toString());
        //       } else {
        //        costdexNetBase = costdexNetBase + dedP.amount;
        //        costdexnetconvertion = costdexNetBase / parseFloat(this.PurchaseVal.exchangeRateSupplier.toString());
        //       }
  
        //     } else {
        //       if (dedP.rate > 0) {
        //        costdexNetSales = costdexNetSales + (costBase * (dedP.rate / 100))
        //       } else {
        //        costdexNetSales = costdexNetSales + dedP.amount
        //       }
        //       apllysalescost=true;
        //     }
        //   });
        //  }
        
        //  if (this.ProductOrder.individual.indAdded == 1) {
 
        //    this.ProductOrder.individual.netCost = (this.ProductOrder.individual.baseCost + costNetBase-costdexNetBase); //prueba kat
        //    //this.ProductOrder.individual.salesNetCost = (this.ProductOrder.individual.baseCostNew + costNetSales-costdexNetSales)
        //    this.ProductOrder.individual.salesNetCost = (this.ProductOrder.individual.netCost + costNetSales-costdexNetSales)
        //    this.ProductOrder.individual.taxableBase = 0;
        //    this.ProductOrder.individual.taxableConversion = 0;
        //    this.ProductOrder.individual.taxableBase = (this.ProductOrder.individual.taxableBase + costNetBase)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.individual.taxableConversion = (this.ProductOrder.individual.taxableConversion + costnetconvertion)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.individual.deductibleBase = 0;
        //    this.ProductOrder.individual.deductibleConvertion = 0;
        //    this.ProductOrder.individual.deductibleBase = (this.ProductOrder.individual.deductibleBase + costdexNetBase)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.individual.deductibleConvertion = (this.ProductOrder.individual.deductibleConvertion + costdexnetconvertion)*this.ProductOrder.packagingQuantity;
        //  } else {
        //    this.ProductOrder.master.netCost = (this.ProductOrder.master.baseCost + costNetBase-costdexNetBase);
        //    //this.ProductOrder.master.salesNetCost = (this.ProductOrder.master.baseCostNew + costNetSales-costdexNetSales);
        //    this.ProductOrder.master.salesNetCost = (this.ProductOrder.master.netCost + costNetSales-costdexNetSales);
        //    this.ProductOrder.master.taxableBase = 0;
        //    this.ProductOrder.master.taxableConversion = 0;
        //    this.ProductOrder.master.taxableBase = (this.ProductOrder.master.taxableBase + costNetBase)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.master.taxableConversion = (this.ProductOrder.master.taxableConversion + costnetconvertion)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.master.deductibleBase = 0;
        //    this.ProductOrder.master.deductibleConvertion = 0;
        //    this.ProductOrder.master.deductibleBase = (this.ProductOrder.master.deductibleBase + costdexNetBase)*this.ProductOrder.packagingQuantity;
        //    this.ProductOrder.master.deductibleConvertion = (this.ProductOrder.master.deductibleConvertion + costdexnetconvertion)*this.ProductOrder.packagingQuantity;
   
        //  }
 
         //Asignacion de nuevos costos
        
         //this._sendNewCost.emit({ product: this.ProductOrder, indtabtaxable: data.indtabtaxable, ischange: this.ischange });
 
       //}
     //}
 
     //Emitir a producto con sus imponibles calculados
      this._sendTaxablesProductDetail.emit({TaxDetailProd:this.ProductOrder});
 
   }
 }
}
