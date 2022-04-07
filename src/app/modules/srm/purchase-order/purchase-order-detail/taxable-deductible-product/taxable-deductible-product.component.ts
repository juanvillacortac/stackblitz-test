import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Deductible } from 'src/app/models/srm/deductible';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderdeductibleDetail } from 'src/app/models/srm/purchase-order-detail-deductible';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { Taxable } from 'src/app/models/srm/taxable';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PurchaseorderService } from '../../../shared/services/purchaseorder/purchaseorder.service';
import { ApplyCost } from '../../../shared/Utils/apply-cost';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-taxable-deductible-product',
  templateUrl: './taxable-deductible-product.component.html',
  styleUrls: ['./taxable-deductible-product.component.scss']
})
export class TaxableDeductibleProductComponent implements OnInit {

  @Input("_product") _product: PurchaseOrderProduct;
  @Input("_purchaseheader") _purchaseheader: Groupingpurchaseorders;
  @Input('showtaxable') showtaxable: boolean;
  _imponible: PurchaseOrdertaxableDetail = new PurchaseOrdertaxableDetail();
  @Output("_sendNewCost") _sendNewCost = new EventEmitter<{ product: PurchaseOrderProduct, indtabtaxable: boolean, ischange: boolean,applycostsales:boolean }>();
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
  @Output("_sendProductAll") _sendProductAll = new EventEmitter<{TaxableListHeaderSave : Taxabledeductible}>();
  TaxabledeductibleList: Taxabledeductible = new Taxabledeductible();
  TaxableListSave: Taxabledeductible = new Taxabledeductible();
  ischange: boolean = false;
  //ProductPricesSave: PurchaseOrderProduct = new  ;
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  applyCost: typeof ApplyCost = ApplyCost;
  showEdit: boolean = false;
  showmodaldeductible: boolean = false;
  showmodataxable: boolean = false;
  indDeductible: boolean = false;
  showModalTaxDed: boolean = false;
  listtaxable: PurchaseOrdertaxableDetail;
  listdeductible: PurchaseOrderdeductibleDetail;
  isTaxable: boolean = true;
  costNetBasetaxable = 0;
  costNetSalestaxable = 0;
  costnetconvertiontaxable = 0;
  costNetBasedeductible = 0;
  costNetSalesdeductible = 0;
  costnetconvertiondeductible = 0;
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  iduserlogin:number=-1;
  displayedColumns: ColumnD<PurchaseOrdertaxableDetail>[] =
    [
      { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost;', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Impuesto', field: 'taxableDeductibleBase', display: 'table-cell' },
      { template: (data) => { return data.rate; }, header: 'Valor(%)', field: 'rate', display: 'table-cell' },
      { template: (data) => { return data.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }, header: 'Monto', field: 'amount', display: 'table-cell' },


    ];

  displayedColumnsde: ColumnD<PurchaseOrderdeductibleDetail>[] =
    [
      { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
      { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
      { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descuento', field: 'taxableDeductibleBase', display: 'table-cell' },
      { template: (data) => { return data.rate; }, header: 'Valor(%)', field: 'rate', display: 'table-cell' },
      { template: (data) => { return data.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }, header: 'Monto', field: 'amount', display: 'table-cell' },

    ];
  constructor(public _service: PurchaseorderService, private messageService: MessageService, 
    private confirmationService: ConfirmationService,  public userPermissions: UserPermissions,private _httpClient: HttpClient) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
  this.iduserlogin = this._Authservice.storeUser.id;

  }
  

  handleChange(e) {
    var index = e.index;
  }


 
  onshow(){
    //if(this.showtaxable==true){
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    filter.purchaseOrderDetail=this._product.id
    filter.purchaseOrderId=-1
    this._product.taxables=[]
    this._product.deductibles=[]
    this._service.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
      if (filter.purchaseOrderDetail != -1) {
        if (data.taxables.length > 0 || data.deductibles.length > 0) {
          if(data.taxables.length > 0 )
          {
           for (let i = 0; i < data.taxables.length; i++) {
            let listtaxable = new PurchaseOrdertaxableDetail();
            listtaxable.id = data.taxables[i].idPurchaseOrderTaxableDeductible;
            listtaxable.idPurchaseOrder = data.taxables[i].idPurchaseOrder;
            listtaxable.idPurchaseOrderDetail = data.taxables[i].idPurchaseOrderDetail;
            listtaxable.taxableDeductibleBaseId = data.taxables[i].taxableDeductibleBaseId;
            listtaxable.idTaxableType = data.taxables[i].idTaxableType;
            listtaxable.taxableType = data.taxables[i].taxableType;
            listtaxable.idApply = data.taxables[i].idApply;
            listtaxable.applyCost = data.taxables[i].applyCost;
            listtaxable.distributionCalculationId = data.taxables[i].distributionCalculationId;
            listtaxable.distributionCalculation = data.taxables[i].distributionCalculation;
            listtaxable.idTaxType = data.taxables[i].idTaxType;
            listtaxable.idTax = data.taxables[i].idTax;
            listtaxable.taxableDeductibleBase = data.taxables[i].taxableDeductibleBase;
            listtaxable.indFixedTax = data.taxables[i].indFixedTax;
            listtaxable.indTaxable = data.taxables[i].indTaxable;
            listtaxable.indDeductible = data.taxables[i].indDeductible;
            listtaxable.indPurchaseTaxableDetail = data.taxables[i].indPurchaseTaxableDetail;
            listtaxable.indPurchaseTaxable = data.taxables[i].indPurchaseTaxable;
            listtaxable.indProductsAll = data.taxables[i].indProductsAll;
            listtaxable.indBaseNetSale = data.taxables[i].indBaseNetSale;
            listtaxable.indBaseNetCost = data.taxables[i].indBaseNetCost;
            listtaxable.rate = data.taxables[i].rate;
            listtaxable.amount = data.taxables[i].amount;
            this._product.taxables.push(listtaxable);
           }
          }
          if(data.deductibles.length > 0 ){
            for (let i = 0; i < data.deductibles.length; i++) {
              let listdeductible = new PurchaseOrderdeductibleDetail();
              listdeductible.id = data.deductibles[i].idPurchaseOrderTaxableDeductible;
              listdeductible.idPurchaseOrder = data.deductibles[i].idPurchaseOrder;
              listdeductible.idPurchaseOrderDetail = data.deductibles[i].idPurchaseOrderDetail;
              listdeductible.taxableDeductibleBaseId = data.deductibles[i].taxableDeductibleBaseId;
              listdeductible.idTaxableType = data.deductibles[i].idTaxableType;
              listdeductible.taxableType = data.deductibles[i].taxableType;
              listdeductible.idApply = data.deductibles[i].idApply;
              listdeductible.applyCost = data.deductibles[i].applyCost;
              listdeductible.distributionCalculationId = data.deductibles[i].distributionCalculationId;
              listdeductible.distributionCalculation = data.deductibles[i].distributionCalculation;
              listdeductible.idTaxType = data.deductibles[i].idTaxType;
              listdeductible.idTax = data.deductibles[i].idTax;
              listdeductible.taxableDeductibleBase = data.deductibles[i].taxableDeductibleBase;
              listdeductible.indFixedTax = data.deductibles[i].indFixedTax;
              listdeductible.indTaxable = data.deductibles[i].indTaxable;
              listdeductible.indDeductible = data.deductibles[i].indDeductible;
              listdeductible.indPurchaseTaxableDetail = data.deductibles[i].indPurchaseTaxableDetail;
              listdeductible.indPurchaseTaxable = data.deductibles[i].indPurchaseTaxable;
              listdeductible.indProductsAll = data.deductibles[i].indProductsAll;
              listdeductible.indBaseNetSale = data.deductibles[i].indBaseNetSale;
              listdeductible.indBaseNetCost = data.deductibles[i].indBaseNetCost;
              listdeductible.rate = data.deductibles[i].rate;
              listdeductible.amount = data.deductibles[i].amount;
              this._product.deductibles.push(listdeductible);
            }
          }
          //emitir evento
        }
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
   //}
 }
  onToggleTaxableDeductible(visible: boolean) {
    this.showmodaldeductible = visible;
  }

  showmodal(indTaxable: boolean, indDeductible: boolean) {
    this._product = this._product;
    this.indDeductible = indDeductible;
    this.showModalTaxDed = true;
  }

  editTaxableDeductible(tax) {
    //this._imponible= tax;
    this._imponible.idPurchaseOrderDetail = tax.idPurchaseOrderDetail;
    this._imponible.idPurchaseOrder = tax.idPurchaseOrder;
    this._imponible.indDeductible = tax.indDeductible;
    this._imponible.indTaxable = tax.indTaxable;
    this._imponible.amount = tax.amount;
    this._imponible.rate = tax.rate;
    this._imponible.taxableDeductibleBase = tax.taxableDeductibleBase;
    this._imponible.taxableType = tax.taxableType;
    this._imponible.id = tax.id;
    this._imponible.taxableDeductibleBaseId = tax.taxableDeductibleBaseId;
    this._imponible.idTaxableType = tax.idTaxableType;
    this._imponible.indPurchaseTaxable = tax.indPurchaseTaxable;
    this._imponible.indPurchaseTaxableDetail = tax.indPurchaseTaxableDetail;
    this._imponible.indFixedTax = tax.indFixedTax;
    this._imponible.idRate = tax.idRate;
    this._imponible.idApply = tax.idApply
    this.showEdit = true;

  }

  //#region eliminar
  removetaxable(order) {
    let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este registro?',
      accept: () => {
        order.indPurchaseTaxable = false;
        order.indPurchaseTaxableDetail = true;
        let applysales=false
        this._service.removetaxable(order).subscribe((data: number) => {
          if (data > 0) {
            this.isSave = false;
            if (order.idApply == ApplyCost.costNetBase) {
              if (order.rate > 0) {
                this.costNetBasetaxable = this.costNetBasetaxable + (costBase * (order.rate / 100))
                this.costnetconvertiontaxable = this.costNetBasetaxable / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                this.costNetBasetaxable = this.costNetBasetaxable + order.amount;
                this.costnetconvertiontaxable = this.costNetBasetaxable / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (order.rate > 0) {
                this.costNetSalestaxable = this.costNetSalestaxable + (costBase * (order.rate / 100))
              } else {
                this.costNetSalestaxable = this.costNetSalestaxable + order.amount
              }
              applysales=true;
            }
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
            this._product.taxables = this._product.taxables.filter(x => x != order);
            this.removed(this._product);     
          }
        }, (error: HttpErrorResponse) =>
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
          ));
      },
    });
  }

  removedeductible(order) {
    let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este registro?',
      accept: () => {
        let model = new PurchaseOrdertaxableDetail()
        model.indPurchaseTaxable = false;
        model.indPurchaseTaxableDetail = true;
        model.taxableDeductibleBaseId = order.taxableDeductibleBaseId;
        model.id = order.id;
        let applysales=false
        this._service.removedeductible(model).subscribe((data: number) => {
          if (data > 0) {
            this.isSave = false;
            if (order.idApply == ApplyCost.costNetBase) {
              if (order.rate > 0) {
                this.costNetBasedeductible = this.costNetBasedeductible + (costBase * (order.rate / 100));
                this.costnetconvertiondeductible = this.costNetBasedeductible / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                this.costNetBasedeductible = this.costNetBasedeductible + order.amount;
                this.costnetconvertiondeductible = this.costNetBasedeductible / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (order.rate > 0) {
                this.costNetSalesdeductible = this.costNetSalesdeductible + (costBase * (order.rate / 100))
              } else {
                this.costNetSalesdeductible = this.costNetSalesdeductible + order.amount
              }
              applysales=true;
            }
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
            this._product.deductibles = this._product.deductibles.filter(x => x != order);
            this.removed(this._product)    
          }
        }, (error: HttpErrorResponse) =>
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
          ));
      },
    });
  }

  ////#endregion
//ADD and update
  receive(data, valor = 0) {
    if (data.indtabtaxable == undefined) {
      data.indtabtaxable = false;
      this.ischange = true;
    }
    else
      data.indtabtaxable = false;

    let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    let costnet=this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.netCost: this._product.masterPrices.netCost;
    let costdexNetBase = 0;
    let costdexNetSales = 0;
    let costdexnetconvertion = 0;
    let costNetBase = 0;
    let costNetSales = 0;
    let costnetconvertion = 0;
    let apllysalescost=false
    if (data.TaxableListSave != null) {
      if (data.TaxableListSave.taxables != undefined) {
        if (data.TaxableListSave.taxables.length > 0) { 
          this._product.taxables = [];
          this.isSave = false;
          for (let i = 0; i < data.TaxableListSave.taxables.length; i++) {
            this.listtaxable = new PurchaseOrdertaxableDetail();
            this.listtaxable.id = data.TaxableListSave.taxables[i].idPurchaseOrderTaxableDeductible;
            this.listtaxable.idPurchaseOrder = data.TaxableListSave.taxables[i].idPurchaseOrder;
            this.listtaxable.idPurchaseOrderDetail = data.TaxableListSave.taxables[i].idPurchaseOrderDetail;
            this.listtaxable.taxableDeductibleBaseId = data.TaxableListSave.taxables[i].taxableDeductibleBaseId;
            this.listtaxable.idTaxableType = data.TaxableListSave.taxables[i].idTaxableType;
            this.listtaxable.taxableType = data.TaxableListSave.taxables[i].taxableType;
            this.listtaxable.idTaxable = data.TaxableListSave.taxables[i].idTaxable;
            this.listtaxable.taxableDeductible = data.TaxableListSave.taxables[i].taxableDeductible;
            this.listtaxable.idApply = data.TaxableListSave.taxables[i].idApply;
            this.listtaxable.applyCost = data.TaxableListSave.taxables[i].applyCost;
            this.listtaxable.distributionCalculationId = data.TaxableListSave.taxables[i].distributionCalculationId;
            this.listtaxable.distributionCalculation = data.TaxableListSave.taxables[i].distributionCalculation;
            this.listtaxable.idTaxType = data.TaxableListSave.taxables[i].idTaxType;
            this.listtaxable.idTax = data.TaxableListSave.taxables[i].idTax;
            this.listtaxable.taxableDeductibleBase = data.TaxableListSave.taxables[i].taxableDeductibleBase;
            this.listtaxable.indFixedTax = data.TaxableListSave.taxables[i].indFixedTax;
            this.listtaxable.indTaxable = data.TaxableListSave.taxables[i].indTaxable;
            this.listtaxable.indDeductible = data.TaxableListSave.taxables[i].indDeductible;
            this.listtaxable.indPurchaseTaxableDetail = data.TaxableListSave.taxables[i].indPurchaseTaxableDetail;
            this.listtaxable.indPurchaseTaxable = data.TaxableListSave.taxables[i].indPurchaseTaxable;
            this.listtaxable.indProductsAll = data.TaxableListSave.taxables[i].indProductsAll;
            this.listtaxable.indBaseNetSale = data.TaxableListSave.taxables[i].indBaseNetSale;
            this.listtaxable.indBaseNetCost = data.TaxableListSave.taxables[i].indBaseNetCost;
            this.listtaxable.rate = data.TaxableListSave.taxables[i].rate;
            this.listtaxable.amount = data.TaxableListSave.taxables[i].amount;
            if (this.listtaxable.idApply == ApplyCost.costNetBase) {
              if (this.listtaxable.rate > 0) {
                costNetBase = costNetBase + (costBase * (this.listtaxable.rate / 100))
                costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                costNetBase = costNetBase + this.listtaxable.amount;
                costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (this.listtaxable.rate > 0) {
                costNetSales = costNetSales + (costBase * (this.listtaxable.rate / 100))
              } else {
                costNetSales = costNetSales + this.listtaxable.amount
              }
              apllysalescost=true;
            }
            this._product.taxables.push(this.listtaxable);

          }
          //Asignacion de nuevos costos
         
          //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });

        }
      }
      if (data.TaxableListSave.deductibles != undefined) //deductible add-update
      {
        if (data.TaxableListSave.deductibles.length > 0) {
          this._product.deductibles = [];
          this.isSave = false;
          this._product.deductibles = [];
          for (let i = 0; i < data.TaxableListSave.deductibles.length; i++) {
            this.listdeductible = new PurchaseOrderdeductibleDetail();
            this.listdeductible.id = data.TaxableListSave.deductibles[i].idPurchaseOrderTaxableDeductible;
            this.listdeductible.idPurchaseOrder = data.TaxableListSave.deductibles[i].idPurchaseOrder;
            this.listdeductible.idPurchaseOrderDetail = data.TaxableListSave.deductibles[i].idPurchaseOrderDetail;
            this.listdeductible.taxableDeductibleBaseId = data.TaxableListSave.deductibles[i].taxableDeductibleBaseId;
            this.listdeductible.idTaxableType = data.TaxableListSave.deductibles[i].idTaxableType;
            this.listdeductible.taxableType = data.TaxableListSave.deductibles[i].taxableType;
            this.listdeductible.idTaxable = data.TaxableListSave.deductibles[i].idTaxable;
            this.listdeductible.taxableDeductible = data.TaxableListSave.deductibles[i].taxableDeductible;
            this.listdeductible.idApply = data.TaxableListSave.deductibles[i].idApply;
            this.listdeductible.applyCost = data.TaxableListSave.deductibles[i].applyCost;
            this.listdeductible.distributionCalculationId = data.TaxableListSave.deductibles[i].distributionCalculationId;
            this.listdeductible.distributionCalculation = data.TaxableListSave.deductibles[i].distributionCalculation;
            this.listdeductible.idTaxType = data.TaxableListSave.deductibles[i].idTaxType;
            this.listdeductible.idTax = data.TaxableListSave.deductibles[i].idTax;
            this.listdeductible.taxableDeductibleBase = data.TaxableListSave.deductibles[i].taxableDeductibleBase;
            this.listdeductible.indFixedTax = data.TaxableListSave.deductibles[i].indFixedTax;
            this.listdeductible.indTaxable = data.TaxableListSave.deductibles[i].indTaxable;
            this.listdeductible.indDeductible = data.TaxableListSave.deductibles[i].indDeductible;
            this.listdeductible.indPurchaseTaxableDetail = data.TaxableListSave.deductibles[i].indPurchaseTaxableDetail;
            this.listdeductible.indPurchaseTaxable = data.TaxableListSave.deductibles[i].indPurchaseTaxable;
            this.listdeductible.indProductsAll = data.TaxableListSave.deductibles[i].indProductsAll;
            this.listdeductible.indBaseNetSale = data.TaxableListSave.deductibles[i].indBaseNetSale;
            this.listdeductible.indBaseNetCost = data.TaxableListSave.deductibles[i].indBaseNetCost;
            this.listdeductible.rate = data.TaxableListSave.deductibles[i].rate;
            this.listdeductible.amount = data.TaxableListSave.deductibles[i].amount;
       
            if (this.listdeductible.idApply == ApplyCost.costNetBase) {
              if (this.listdeductible.rate > 0) {
                costdexNetBase = costdexNetBase + (costBase * (this.listdeductible.rate / 100))
                costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                costdexNetBase = costdexNetBase + this.listdeductible.amount;
                costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (this.listdeductible.rate > 0) {
                 costdexNetSales = costdexNetSales + (costBase * (this.listdeductible.rate / 100))
              } else {
                costdexNetSales = costdexNetSales + this.listdeductible.amount
              }
              apllysalescost=true;
            }
            this._product.deductibles.push(this.listdeductible);
          }
          //Asignacion de nuevos costos
          // if (this._product.individualPrices.indAdded == 1) {
          //   this._product.individualPrices.netCost = (this._product.individualPrices.baseCostNew - costNetBase);
          //   this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew - costNetSales);
          //   this._product.individualPrices.deductibleBase = 0;
          //   this._product.individualPrices.deductibleConvertion = 0;
          //   this._product.individualPrices.deductibleBase = this._product.individualPrices.deductibleBase + costNetBase;
          //   this._product.individualPrices.deductibleConvertion = this._product.individualPrices.deductibleConvertion + costnetconvertion;
          // } else {
          //   this._product.masterPrices.netCost = (this._product.masterPrices.baseCostNew - costNetBase);
          //   this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew - costNetSales);
          //   this._product.masterPrices.deductibleBase = 0;
          //   this._product.masterPrices.deductibleConvertion = 0;
          //   this._product.masterPrices.deductibleBase = this._product.masterPrices.deductibleBase + costNetBase;
          //   this._product.masterPrices.deductibleConvertion = this._product.masterPrices.deductibleConvertion + costnetconvertion;
          // }
          //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });
        }
      }
      if (this._product.individualPrices.indAdded == 1) {

        this._product.individualPrices.netCost = (this._product.individualPrices.baseCostNew + costNetBase-costdexNetBase); //prueba sergio
        //this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales)
        this._product.individualPrices.salesNetCost = (this._product.individualPrices.netCost + costNetSales-costdexNetSales)
        this._product.individualPrices.taxableBase = 0;
        this._product.individualPrices.taxableConversion = 0;
        this._product.individualPrices.taxableBase = (this._product.individualPrices.taxableBase + costNetBase)*this._product.packagingQuantity;
        this._product.individualPrices.taxableConversion = (this._product.individualPrices.taxableConversion + costnetconvertion)*this._product.packagingQuantity;
        this._product.individualPrices.deductibleBase = 0;
        this._product.individualPrices.deductibleConvertion = 0;
        this._product.individualPrices.deductibleBase = (this._product.individualPrices.deductibleBase + costdexNetBase)*this._product.packagingQuantity;
        this._product.individualPrices.deductibleConvertion = (this._product.individualPrices.deductibleConvertion + costdexnetconvertion)*this._product.packagingQuantity;
      } else {
        this._product.masterPrices.netCost = (this._product.masterPrices.baseCostNew + costNetBase-costdexNetBase);
        //this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales);
        this._product.masterPrices.salesNetCost = (this._product.masterPrices.netCost + costNetSales-costdexNetSales);
        this._product.masterPrices.taxableBase = 0;
        this._product.masterPrices.taxableConversion = 0;
        this._product.masterPrices.taxableBase = (this._product.masterPrices.taxableBase + costNetBase)*this._product.packagingQuantity;
        this._product.masterPrices.taxableConversion = (this._product.masterPrices.taxableConversion + costnetconvertion)*this._product.packagingQuantity;
        this._product.masterPrices.deductibleBase = 0;
        this._product.masterPrices.deductibleConvertion = 0;
        this._product.masterPrices.deductibleBase = (this._product.masterPrices.deductibleBase + costdexNetBase)*this._product.packagingQuantity;
        this._product.masterPrices.deductibleConvertion = (this._product.masterPrices.deductibleConvertion + costdexnetconvertion)*this._product.packagingQuantity;

      }
      this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange,applycostsales:apllysalescost });
      this.isSaveChange.emit(this.isSave);
      }
    }

    //Eliminar
    removed(data) {
      if (data.indtabtaxable == undefined) {
        data.indtabtaxable = false;
        this.ischange = true;
      }
      else
        data.indtabtaxable = false;
      let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
      let costnet=this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.netCost: this._product.masterPrices.netCost;
      let costNetBase = 0;
      let costNetSales = 0;
      let costnetconvertion = 0;
      let costdexNetBase = 0;
      let costdexNetSales = 0;
      let costdexnetconvertion = 0;
      let apllysalescost=false;
      //if (data.TaxableListSave != null) {
      if (data.taxables != undefined) {
        if (data.taxables.length > 0) 
        {
          this.isSave = false;
          let listaux=data.taxables;
          this._product.taxables = [];
          for (let i = 0; i < listaux.length; i++) {
            this.listtaxable = new PurchaseOrdertaxableDetail();
            this.listtaxable.id = listaux[i].id;
            this.listtaxable.idPurchaseOrder = listaux[i].idPurchaseOrder;
            this.listtaxable.idPurchaseOrderDetail = listaux[i].idPurchaseOrderDetail;
            this.listtaxable.taxableDeductibleBaseId = listaux[i].taxableDeductibleBaseId;
            this.listtaxable.idTaxableType = listaux[i].idTaxableType;
            this.listtaxable.taxableType = listaux[i].taxableType;
            this.listtaxable.idTaxable = listaux[i].idTaxable;
            this.listtaxable.taxableDeductible = listaux[i].taxableDeductible;
            this.listtaxable.idApply = listaux[i].idApply;
            this.listtaxable.applyCost = listaux[i].applyCost;
            this.listtaxable.distributionCalculationId = listaux[i].distributionCalculationId;
            this.listtaxable.distributionCalculation = listaux[i].distributionCalculation;
            this.listtaxable.idTaxType = listaux[i].idTaxType;
            this.listtaxable.idTax = listaux[i].idTax;
            this.listtaxable.taxableDeductibleBase = listaux[i].taxableDeductibleBase;
            this.listtaxable.indFixedTax = listaux[i].indFixedTax;
            this.listtaxable.indTaxable = listaux[i].indTaxable;
            this.listtaxable.indDeductible = listaux[i].indDeductible;
            this.listtaxable.indPurchaseTaxableDetail = listaux[i].indPurchaseTaxableDetail;
            this.listtaxable.indPurchaseTaxable = listaux[i].indPurchaseTaxable;
            this.listtaxable.indProductsAll = listaux[i].indProductsAll;
            this.listtaxable.indBaseNetSale = listaux[i].indBaseNetSale;
            this.listtaxable.indBaseNetCost = listaux[i].indBaseNetCost;
            this.listtaxable.rate = listaux[i].rate;
            this.listtaxable.amount = listaux[i].amount;
            if (this.listtaxable.idApply == ApplyCost.costNetBase) {
              if (this.listtaxable.rate > 0) {
                costNetBase = costNetBase + (costBase * (this.listtaxable.rate / 100))
                costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                costNetBase = costNetBase + this.listtaxable.amount;
                costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (this.listtaxable.rate > 0) {
                costNetSales = costNetSales + (costBase * (this.listtaxable.rate / 100))
              } else {
                costNetSales = costNetSales + this.listtaxable.amount
              }
              apllysalescost=true;
            }      
            this._product.taxables.push(this.listtaxable);

          }
          //Asignacion de nuevos costos
      
          //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });

        }///deductibles-remove
      }

      if (data.deductibles != undefined) {
        if (data.deductibles.length > 0) {
          this.isSave = false;
          let listauxded=data.deductibles;
          this._product.deductibles = [];
          for (let i = 0; i < listauxded.length; i++) {
            this.listdeductible = new PurchaseOrderdeductibleDetail();
            this.listdeductible.idPurchaseOrder = listauxded[i].id;
            this.listdeductible.idPurchaseOrder = listauxded[i].idPurchaseOrder;
            this.listdeductible.idPurchaseOrderDetail = listauxded[i].idPurchaseOrderDetail;
            this.listdeductible.taxableDeductibleBaseId = listauxded[i].taxableDeductibleBaseId;
            this.listdeductible.idTaxableType = listauxded[i].idTaxableType;
            this.listdeductible.taxableType = listauxded[i].taxableType;
            this.listdeductible.idTaxable = listauxded[i].idTaxable;
            this.listdeductible.taxableDeductible = listauxded[i].taxableDeductible;
            this.listdeductible.idApply = listauxded[i].idApply;
            this.listdeductible.applyCost = listauxded[i].applyCost;
            this.listdeductible.distributionCalculationId = listauxded[i].distributionCalculationId;
            this.listdeductible.distributionCalculation = listauxded[i].distributionCalculation;
            this.listdeductible.idTaxType = listauxded[i].idTaxType;
            this.listdeductible.idTax = listauxded[i].idTax;
            this.listdeductible.taxableDeductibleBase = listauxded[i].taxableDeductibleBase;
            this.listdeductible.indFixedTax = listauxded[i].indFixedTax;
            this.listdeductible.indTaxable = listauxded[i].indTaxable;
            this.listdeductible.indDeductible = listauxded[i].indDeductible;
            this.listdeductible.indPurchaseTaxableDetail = listauxded[i].indPurchaseTaxableDetail;
            this.listdeductible.indPurchaseTaxable = listauxded[i].indPurchaseTaxable;
            this.listdeductible.indProductsAll = listauxded[i].indProductsAll;
            this.listdeductible.indBaseNetSale = listauxded[i].indBaseNetSale;
            this.listdeductible.indBaseNetCost = listauxded[i].indBaseNetCost;
            this.listdeductible.rate = listauxded[i].rate;
            this.listdeductible.amount = listauxded[i].amount;

            if (this.listdeductible.idApply == ApplyCost.costNetBase) {
              if (this.listdeductible.rate > 0) {
                costdexNetBase = costdexNetBase + (costBase * (this.listdeductible.rate / 100))
                costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                costdexNetBase = costdexNetBase + this.listdeductible.amount;
                costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (this.listdeductible.rate > 0) {
                costdexNetSales = costdexNetSales + (costBase * (this.listdeductible.rate / 100))
              } else {
                costdexNetSales = costdexNetSales + this.listdeductible.amount
              }
              apllysalescost=true;
            }
            this._product.deductibles.push(this.listdeductible);
          }
          //Asignacion de nuevos costos
          // if (this._product.individualPrices.indAdded == 1) {
          //   this._product.individualPrices.netCost = (this._product.individualPrices.baseCostNew - costNetBase)
          //   this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew - costNetSales)
          //   this._product.individualPrices.deductibleBase = 0;
          //   this._product.individualPrices.deductibleConvertion = 0;
          //   this._product.individualPrices.deductibleBase = this._product.individualPrices.deductibleBase + costNetBase;
          //   this._product.individualPrices.deductibleConvertion = this._product.individualPrices.deductibleConvertion + costnetconvertion;

          // } else {

          //   this._product.masterPrices.netCost = (this._product.masterPrices.baseCostNew - costNetBase)
          //   this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew - costNetSales)
          //   this._product.masterPrices.deductibleBase = this._product.masterPrices.deductibleBase + costNetBase;
          //   this._product.masterPrices.deductibleConvertion = this._product.masterPrices.deductibleConvertion + costnetconvertion;
          // }
        }
      }
      if (this._product.individualPrices.indAdded == 1) {
        this._product.individualPrices.netCost = this._product.individualPrices.baseCostNew + costNetBase-costdexNetBase;
        //this._product.individualPrices.salesNetCost = this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales
        this._product.individualPrices.salesNetCost = this._product.individualPrices.netCost + costNetSales-costdexNetSales
        this._product.individualPrices.taxableBase = 0;
        this._product.individualPrices.taxableConversion = 0;
        this._product.individualPrices.taxableBase = (this._product.individualPrices.taxableBase + costNetBase)*this._product.packagingQuantity;
        this._product.individualPrices.taxableConversion = (this._product.individualPrices.taxableConversion + costnetconvertion)*this._product.packagingQuantity;
        this._product.individualPrices.deductibleBase = 0;
        this._product.individualPrices.deductibleConvertion = 0;
        this._product.individualPrices.deductibleBase = (this._product.individualPrices.deductibleBase + costdexNetBase)*this._product.packagingQuantity;
        this._product.individualPrices.deductibleConvertion = (this._product.individualPrices.deductibleConvertion + costdexnetconvertion)*this._product.packagingQuantity;
      } else {
        this._product.masterPrices.netCost = this._product.masterPrices.baseCostNew + costNetBase-costdexNetBase;
        //this._product.masterPrices.salesNetCost = this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales;
        this._product.masterPrices.salesNetCost = this._product.masterPrices.netCost + costNetSales-costdexNetSales;
        this._product.masterPrices.taxableBase = 0;
        this._product.masterPrices.taxableConversion = 0;
        this._product.masterPrices.taxableBase = (this._product.masterPrices.taxableBase + costNetBase)*this._product.packagingQuantity;
        this._product.masterPrices.taxableConversion = (this._product.masterPrices.taxableConversion + costnetconvertion)*this._product.packagingQuantity;
        this._product.masterPrices.deductibleBase=0
        this._product.masterPrices.deductibleConvertion=0
        this._product.masterPrices.deductibleBase = (this._product.masterPrices.deductibleBase + costdexNetBase)*this._product.packagingQuantity;
        this._product.masterPrices.deductibleConvertion = (this._product.masterPrices.deductibleConvertion + costdexnetconvertion)*this._product.packagingQuantity;
      }
      this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange,applycostsales:apllysalescost });
    }


    showTaxableDeductible(value: boolean) {
      this.isTaxable = value;
    }

receandSend(data){
  this._sendProductAll.emit(data);
}
  }
