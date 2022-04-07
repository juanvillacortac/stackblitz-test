import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { ApplicableTaxdedCost } from 'src/app/models/srm/common/applicable-taxded-cost';
import { DistributionTaxDeductible } from 'src/app/models/srm/common/distribution-tax-deductible';
import { Taxabletype } from 'src/app/models/srm/common/taxabletype';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { Reception } from 'src/app/models/srm/reception';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { ApplicableTaxdedCostFilter } from 'src/app/modules/srm/shared/filters/common/applicable-taxded-cost-filter';
import { DistributionTaxDeductibleFilter } from 'src/app/modules/srm/shared/filters/common/distribution-tax-deductible-filter';
import { TaxabletypeFilter } from 'src/app/modules/srm/shared/filters/common/taxabletypefilter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import { PurchaseorderService } from 'src/app/modules/srm/shared/services/purchaseorder/purchaseorder.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { DistributionCost } from 'src/app/modules/srm/shared/Utils/distribution-cost';
import { Typevalue } from 'src/app/modules/srm/shared/view-models/common/typevalue';

@Component({
  selector: 'app-ded',
  templateUrl: './ded.component.html',
  styleUrls: ['./ded.component.scss']
})
export class DedComponent implements OnInit {

 
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
  @Input("ProductOrder") ProductOrder: PurchaseOrderProduct; //Cambiar por modelo de reception 
  @Input() ReceptionOrder: Reception; //Cabecera de la recepcion ReceptionOrder

  @Output("onhide") onhide = new EventEmitter();
  // @Output("_sendDeductibles") _sendDeductibles = new EventEmitter<{ TaxableListSave: Taxabledeductible }>();
  // //TaxableListSave: Taxabledeductible = new Taxabledeductible();
  // @Output("_sendTaxablesHeaderDetalleP") _sendTaxablesHeaderDetalleP = new EventEmitter<{ _products: PurchaseOrderProduct[] }>();
  // _products: PurchaseOrderProduct[] = [];
  // //Salidas de la cabecera
  // @Output("_sendTaxablesHeader") _sendTaxablesHeader = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible, isCost: boolean }>();
  // @Input("subtotalHeader") subtotalHeader: number = 0;
  // TaxableListHeaderSave: Taxabledeductible = new Taxabledeductible();
   @Input("_productsSelecteds") _productsSelecteds: PurchaseOrderProduct[]; //cambiar por modelo de productos de recepcion
  isCost: boolean = true;
  cont: number = 0;
  indDetailProductoApply: boolean = false;
  @ViewChild('dt', { static: false }) dt: any;

  displayedColumns: ColumnD<DeductibleRep>[] =
    [
      // { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'deductibleId', display: 'none' },
      { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
      { template: (data) => { return data.discountRate; }, header: 'Tipo de valor', field: 'discountRate', display: 'table-cell' },
      { template: (data) => { return data.applyCost; }, header: 'Aplica a', field: 'applyCost', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

    ];
  constructor(private _taxeTypeApplicationService: TaxeTypeApplicationService,
    private _commonSRMService: CommonsrmService,
    private messageService: MessageService,
    private _discountType: DiscountRateService,
    public purchaseService: PurchaseorderService,
    private decimalPipe: DecimalPipe,
    private confirmationService: ConfirmationService) {

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
    this.GetApplyCost(-1);
    this.GetTaxableType();
    if (this.ProductOrder == undefined && this._productsSelecteds == undefined) {
      // if (this.PurchaseOrder.purchase.paymentsConditions.idPaymentCondition > 0) {
      //   this.loadDiscount();
      // }
    }
    if (this._productsSelecteds != undefined) {
      if (this._productsSelecteds.length > 0)
        this.GetDistributionCost(DistributionCost.applyAll)
    } else {
      this.GetDistributionCost(DistributionCost.subTotal)
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
        if (this.ProductOrder.productId != 0) {
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
      if (this.ProductOrder.productId > 0) {
        this.deductibles.indPurchaseTaxableDetail = true;
        // this.deductibles.idPurchaseOrderDetail = this.ProductOrder.id;
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
  
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    var indSave: boolean = true;
    var message: string = "";
    var listdedrate: any[] = [];
    if (this.selectedDeductible.length > 0) {
      this.load = true;
      if (this.ProductOrder != undefined) {
        let costoprod = 0;
        let costded = 0;
        let porcentded = 0;
        costoprod = this.ProductOrder.individualPrices.indAdded == 1 ? this.ProductOrder.individualPrices.baseCostNew : this.ProductOrder.masterPrices.baseCostNew;
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
        if (this.ProductOrder.individualPrices.indAdded == 1) {
          costded = (this.ProductOrder.individualPrices.deductibleBase / this.ProductOrder.packagingQuantity)  //this.ProductOrder.deductibles.reduce((sum, current)=> sum + current.amount, 0 );
          // porcentded= this.ProductOrder.deducibles.reduce((sum, current)=> sum + current.rate, 0 );
        } else {
          //master
          costded = (this.ProductOrder.masterPrices.deductibleBase / this.ProductOrder.packagingQuantity)
        }
        if (costded > 0) {
          if (sumde + costded + porcentded >= costoprod) {
            indSave = false
            message = "La cantidad de deducible supera el costo del producto."
            // this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de deducible supera el costo del producto." });
          }
        }


      } else {
        var sumde = this.selectedDeductible.reduce((sum, current) => sum + current.amount, 0);
        // if (this.subtotalHeader > 0) {
        //   if (sumde >= this.subtotalHeader) {
        //     message = "La cantidad de deducible supera el subtotal."
        //     indSave = false;
        //   }

        // }
      }

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

  loadDiscount() {
    var a = new DeductibleRep();
    // a.idDiscountRate = this.PurchaseOrder.purchase.paymentsConditions.idDiscountType;
    // //  a.discountRate =(this.typeDiscountList.find(x => x.value == a.idDiscountRate).label);
    // a.taxableDeductibleBase = this.PurchaseOrder.purchase.paymentsConditions.name;
    // // a.idTypeValue = 0;
    // if (this.PurchaseOrder.purchase.paymentsConditions.idDiscountType == 1) { //Porcentual
    //   a.typeValue = "Porcentual";
    //   a.rate = this.PurchaseOrder.purchase.paymentsConditions.discount;
    //   a.discountRate = a.typeValue
    // } else {
    //   if (this.PurchaseOrder.purchase.paymentsConditions.idDiscountType == 2) {  //monto
    //     a.typeValue = "Monto";
    //     a.amount = this.PurchaseOrder.purchase.paymentsConditions.discount;
    //     a.discountRate = a.typeValue
    //   }
    // }
    // //a.typeValue = "Monto";
    // a.taxableType = "Condición de pago";
    // a.idTaxableType = 6;
    // a.idApply = ApplyCost.Subtotal;
    // a.distributionCalculationId = DistributionCost.subTotal
    // a.applyCost = "subtotal";
    // a.indDeductible = true;
    // a.idTemp = -1;
    // a.indPurchaseTaxableDetail = false;
    // a.indPurchaseTaxable = true;
    // if (this.ProductOrder != undefined) {
    //   a.idPurchaseOrderDetail = this.ProductOrder.id;
    // } else {
    //   a.idPurchaseOrder = this.PurchaseOrder.purchase.idOrderPurchase;
    // }
    // //a.amount = this.PurchaseOrder.purchase.paymentsConditions.discount;
    // a.active = true;
    // this.deductiblesListTemp.push(a);
    // this.deductiblesfijo = this.deductiblesListTemp;

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
}
