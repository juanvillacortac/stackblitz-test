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
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { Reception } from 'src/app/models/srm/reception';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { TaxService } from 'src/app/modules/masters/taxes/shared/tax.service';
import { ProductTaxesFilter } from 'src/app/modules/products/shared/filters/productaxes-filter';
import { ProducttaxesService } from 'src/app/modules/products/shared/services/producttaxes/producttaxes.service';
import { ApplicableTaxdedCostFilter } from 'src/app/modules/srm/shared/filters/common/applicable-taxded-cost-filter';
import { DistributionTaxDeductibleFilter } from 'src/app/modules/srm/shared/filters/common/distribution-tax-deductible-filter';
import { TaxabletypeFilter } from 'src/app/modules/srm/shared/filters/common/taxabletypefilter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import { MerchandiseReceptionService } from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { DistributionCost } from 'src/app/modules/srm/shared/Utils/distribution-cost';
import { Typevalue } from 'src/app/modules/srm/shared/view-models/common/typevalue';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {

  @Input("ProductOrder") ProductOrder: PurchaseOrderProduct; //Modelo del produc de recepcion
  @Input() ReceptionOrder: Reception; //Cabecera de la recepcion ReceptionOrder
  @Output("onhide") onhide = new EventEmitter();
  selectedTaxable: TaxableRep[] = [];
  TaxableDeductibletypeFilter: TaxabletypeFilter = new TaxabletypeFilter();
  typeTaxableList: SelectItem[] = [];
  TaxableList: SelectItem[] = [];
  TaxList: SelectItem[] = [];
  rateList: SelectItem[] = [];
  taxables: TaxableRep = new TaxableRep();
  txablesListTemp: TaxableRep[] = [];
  type: Typevalue[];
  typelist: SelectItem[] = [];
  ApplyCostList: SelectItem[] = [];
  DistributionCostList: SelectItem[] = [];
  visible: boolean = false;
  submitted: boolean = false;
  TaxabledeductibleList: TaxdedRep = new TaxdedRep()
  applyCost: typeof ApplyCost = ApplyCost;
  distributionCost: typeof DistributionCost = DistributionCost;
  _validations: Validations = new Validations();
  cont: number = 0;
  load: boolean = false;
  indDetailProductoApply: boolean = false;
  @Input("_products") _products: PurchaseOrderProduct[]; // Modelo de productos de reception

  // //Emitir tabla de Imponibles
  // @Output("_sendTaxables") _sendTaxables = new EventEmitter<{ TaxableListSave: Taxabledeductible }>();

  // //Salidas de la cabecera
  // @Output("_sendTaxablesHeader") _sendTaxablesHeader = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible, isCost: boolean }>();

  // @Output("_sendTaxablesHeaderDetalleP") _sendTaxablesHeaderDetalleP = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible }>();
  // isCost: boolean = true;
  // TaxableListHeaderSave: Taxabledeductible = new Taxabledeductible();
  // TaxableListSave: Taxabledeductible = new Taxabledeductible();
  @ViewChild('dt', { static: false }) dt: any
  displayedColumns: ColumnD<TaxableRep>[] =
    [
      { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
      { template: (data) => { return data.taxableType; }, header: 'Tipo de imponible', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
      // { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

      { field: 'idProducTax', header: 'Impuesto en MPC', display: 'table-cell' },
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
    public receptionService: MerchandiseReceptionService,
    private confirmationService: ConfirmationService,
    private _taxService: TaxService) {

    this.type = [
      { id: 0, name: 'Monto' },
      { id: 1, name: 'Porcentaje' }
    ];
  }

  ngOnInit(): void {


  }

  onShowTaxable() {
    this.indDetailProductoApply = false;
    this.GetTaxableType();
    this.GetApplyCost(-1);
    if (this._products.length > 0) {
      this.GetDistributionCost(DistributionCost.applyAll)
    }else{
      this.GetDistributionCost(DistributionCost.subTotal)
    }
    
    this.GetTaxable();
    this.GetTypeList();
    this.taxables.idTaxableType = 1;
    if (this.ProductOrder != undefined) {
      if (this.ProductOrder.productId > 0) {
        //this.loadProductTaxes()
      }
    }
    
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

      this.GetApplyCost(3);
    } else {
      this.GetApplyCost(-1);
      //this.ApplyCostList= this.ApplyCostList.filter(x=>x.value!=ApplyCost.Subtotal);

    }
  }
  //#endregion
  saveTaxable() {
   //var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    if (this.selectedTaxable.length > 0) {
      this.load = true;
      this.TaxabledeductibleList.taxables = this.selectedTaxable;
      if (this.TaxabledeductibleList.taxables.filter(x => x.distributionCalculationId == DistributionCost.applyAll).length > 0)
        this.indDetailProductoApply = true;
      if (this._products != undefined) {
        if (this._products.length > 0)
            this.TaxabledeductibleList.products = this._products;
      }
    //   this.receptionService.SaveTaxables(this.TaxabledeductibleList).subscribe((data: number) => {
    //     if (data > 0) {
    //       this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
    //       this.txablesListTemp = [];
    //       this.selectedTaxable = [];
    //       this.TaxabledeductibleList.taxables = [];
    //       this.cont = 0;
    //       //Obtener listado de imponibles y deducibles

    //       if (this.ProductOrder != undefined) {
    //         filter.purchaseOrderDetail = this.ProductOrder.id;
    //       } else {
    //         filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
    //       }
    //       this.receptionService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
    //         if (filter.purchaseOrderDetail != -1) {
    //           if (data.taxables.length > 0 || data.deductibles.length > 0) {

    //             this.TaxableListSave.taxables = data.taxables;
    //             this.TaxableListSave.deductibles = data.deductibles;
    //             //emitir evento
    //             this._sendTaxables.emit({
    //               TaxableListSave: this.TaxableListSave
    //             });
    //           }
    //         } else {//CABECERA

    //           if (this._products.length > 0) {
    //              //Get taxables prodcutos. 
    //           }
    //           if (data.taxables.length > 0 || data.deductibles.length > 0) {

    //             this.TaxableListHeaderSave.deductibles = data.deductibles;
    //             this.TaxableListHeaderSave.taxables = data.taxables;
    //             //emitir evento
    //             this._sendTaxablesHeader.emit({
    //               TaxableListHeaderSave: this.TaxableListHeaderSave,
    //               isCost: this.isCost
    //             });

    //             //validar si existen imponibles o deducibles hacia el detail from header 
    //             if (this.indDetailProductoApply) {
    //               this.TaxableListHeaderSave.deductibles = []//data.deductibles.filter(x=>x.distributionCalculationId==DistributionCost.applyAll);
    //               this.TaxableListHeaderSave.taxables = data.taxables.filter(x => x.distributionCalculationId == DistributionCost.applyAll);

    //               this._sendTaxablesHeaderDetalleP.emit({
    //                 TaxableListHeaderSave: this.TaxableListHeaderSave,
    //               })
    //             }

    //           }
    //         }
    //         //this._purchaseorderService._PurchaseOrderList = data;
    //         this.load = false;
    //         this.indDetailProductoApply = false;
    //       }, (error: HttpErrorResponse) => {
    //         this.load = false;
    //         this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    //       });
    //       //emitir event al component padre.
    //       this.onhide.emit();
    //     } else if (data == -1) {
    //       this.TaxabledeductibleList.taxables = [];
    //       this.load = false;
    //       this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Existen imponibles duplicados, por favor verifique." });
    //     } else {
    //       this.load = false;
    //       this.TaxabledeductibleList.taxables = [];
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
    //     }
    //   }, (error: HttpErrorResponse) => {
    //     this.load = false;
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
    //   });
    // } else {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos un imponible." });
    //   this.load = false;
    // }
  }
}

  // async loadProductTaxes() {

  //   var filterProductTaxes = new ProductTaxesFilter();
  //   filterProductTaxes.productId = this.ProductOrder.productId;
  //   filterProductTaxes.active = 1;
  //   this._ProductTaxesService.getProductTaxesbyfilter(filterProductTaxes).subscribe((data: ProductTaxes[]) => {
  //     this._ProductTaxesService._productTaxes = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
  //     //var cont = 0;
  //     this._ProductTaxesService._productTaxes.forEach(products => {
  //       var a = new Taxable();
  //       a.idTaxableType = 1;
  //       a.taxableType = "Impuesto";
  //       a.rate = products.taxRate.value;
  //       a.taxableDeductibleBase = products.taxRate.tax.name;
  //       a.idTax = products.taxRate.tax.id;
  //       a.idRate = products.taxRate.id;
  //       a.idApply = ApplyCost.costNetBase;
  //       a.applyCost = "Costo neto base";
  //       a.indDeductible = false;
  //       a.indTaxable = true;
  //       a.indFixedTax = true;
  //       a.indPurchaseTaxableDetail = true;
  //       a.idPurchaseOrderDetail = this.ProductOrder.id;
  //       a.idPurchaseOrder = this.PurchaseOrder.purchase.idOrderPurchase;
  //       a.idProducTax = -1;
  //       a.active = true;
  //       if (this.ProductOrder.taxables.length > 0) {
  //         // if (this.ProductOrder.taxables.filter(x => x.idTaxableType == a.idTaxableType && a.idTax == x.idTax && a.rate == x.rate).length == 0) {
  //         //   this.txablesListTemp.push(a);
  //         // }
  //         if (this.ProductOrder.taxables.filter(x => x.idTaxableType == a.idTaxableType && a.idTax == x.idTax).length == 0) {
  //           this.txablesListTemp.push(a);
  //         }
  //       } else {
  //         this.txablesListTemp.push(a);
  //       }
  //     });
  //     this.dt.reset()
  //     this.txablesListTemp = this.txablesListTemp;
  //   }, (error: HttpErrorResponse) => {

  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los impuestos." });
  //   });
  // }
  AddTxable() {
    this.submitted = true;
    if (this.ProductOrder != undefined) {
      if (this.taxables.idTaxableType == 1) {
        if ((this.taxables.idTax > 0 && this.taxables.idApply > 0 && this.taxables.idRate > 0)) {
          this.taxableTempAdd();
          this.submitted = false;
        }
      } else {
        if (this.taxables.idTypeValue == 0) {
          if (this.taxables.idTaxableType > 0 && (this.taxables.idApply > 0 && this.taxables.amount > 0) && this.taxables.taxableDeductibleBase.trim() != "") {
            this.taxableTempAdd();
            this.submitted = false;
          }
        } else {
          if (this.taxables.idTaxableType > 0 && (this.taxables.idTypeValue == 1 && this.taxables.idApply > 0 && this.taxables.rate > 0) && this.taxables.taxableDeductibleBase.trim() != "") {
            this.taxableTempAdd();
            this.submitted = false;
          }
        }
      }

      //Cabecera 
    } else {
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

      }
      // this.submitted = false;
    }

    //this.clear();
  }

  taxableTempAdd() {
    this.cont = this.cont + 1;
    this.EvaluarAsignacionesNames();
    if (this.ProductOrder != undefined) {
      if (this.ProductOrder.productId > 0) {
        this.taxables.indPurchaseTaxableDetail = true;
        // this.taxables.idPurchaseOrderDetail = this.ProductOrder.id;
        // this.taxables.idPurchaseOrder = this.ProductOrder.idOrderPurchase;
      }
    } else {
      //Condiciones para aplicar impuesto de cabecera y detalles
      if (this.taxables.distributionCalculationId == DistributionCost.applyAll) {
        this.taxables.indPurchaseTaxable = true;
        this.taxables.indPurchaseTaxableDetail = false;
      } else {
        this.taxables.indPurchaseTaxable = true;
      }
      //this.taxables.idPurchaseOrder = this.ReceptionOrder.id//this.PurchaseOrder.purchase.idOrderPurchase;
    }
    this.taxables.active = true;

    this.taxables.idProducTax = this.cont;
    //Imponible 1
    if (this.taxables.idTaxableType == 1) {
      // if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.idTax == x.idTax && this.taxables.idRate == x.idRate).length > 0) {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
      // } else {
      if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.idTax == x.idTax).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
      } else {
        if (this.ProductOrder != undefined) {
          if (this.ProductOrder.taxables.filter(x => x.idTaxableType == this.taxables.idTaxableType && x.idTax == this.taxables.idTax && x.rate == this.taxables.rate).length == 0)
            this.txablesListTemp.push(this.taxables);
          else
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta registrado." });
        } else {
          //cabecera
          this.txablesListTemp.push(this.taxables);
        }
      }
    } else {
      if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
      } else {
        if (this.ProductOrder != undefined) {
          if (this.ProductOrder.taxables.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.taxableDeductibleBase == x.taxableDeductibleBase).length == 0)
            this.txablesListTemp.push(this.taxables);

          else
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta registrado." });
          //this.txablesListTemp.push(this.taxables);
        } else {
          //cabecera
          this.txablesListTemp.push(this.taxables);
        }
      }
    }

    // console.log(this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.taxableDeductibleBase == x.taxableDeductibleBase).length)
    // if (this.txablesListTemp.filter(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.taxableDeductibleBase == x.taxableDeductibleBase).length > 0) {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
    // }
    // if (this.txablesListTemp.findIndex(x => x.idTaxableType == this.taxables.idTaxableType && this.taxables.idTax == x.idTax && this.taxables.idRate == x.idRate)!=-1 || this.txablesListTemp.findIndex(x => x.idTaxableType == this.taxables.idTaxableType && x.taxableDeductibleBase == this.taxables.taxableDeductibleBase)!=-1) {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "El impuesto ya esta agregado en la lista." });
    // }
    // else {
    //   this.txablesListTemp.push(this.taxables);
    //   console.log(this.txablesListTemp);

    // }
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



