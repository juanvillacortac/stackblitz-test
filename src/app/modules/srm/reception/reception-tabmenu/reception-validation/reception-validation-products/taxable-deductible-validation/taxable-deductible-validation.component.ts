import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { StatusPurchase } from 'src/app/modules/srm/shared/Utils/status-purchase';

@Component({
  selector: 'app-taxable-deductible-validation',
  templateUrl: './taxable-deductible-validation.component.html',
  styleUrls: ['./taxable-deductible-validation.component.scss']
})
export class TaxableDeductibleValidationComponent implements OnInit {
  @Input("_product") _product: Productdetailvalidation;
 @Input("_purchaseheader") _purchaseheader: PurchaseValidation;//CAMBIAR
  @Input('showtaxable') showtaxable: boolean;
 _imponible: TaxdedRep = new TaxdedRep();
  //@Output("_sendNewCost") _sendNewCost = new EventEmitter<{ product: Productdetailvalidation, indtabtaxable: boolean, ischange: boolean,applycostsales:boolean }>();
  @Output("_sendNewCostProd") _sendNewCostProd = new EventEmitter<{ product: Productdetailvalidation }>();
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
 // @Output("_sendProductAll") _sendProductAll = new EventEmitter<{TaxableListHeaderSave : Taxabledeductible}>();
  //TaxabledeductibleList: Taxabledeductible = new Taxabledeductible();
  //TaxableListSave: Taxabledeductible = new Taxabledeductible();
  ischange: boolean = false;
  //ProductPricesSave: PurchaseOrderProduct = new  ;
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  applyCost: typeof ApplyCost = ApplyCost;
  showEdit: boolean = false;
  showmodaldeductible: boolean = false;
  showmodataxable: boolean = false;
  indDeductible: boolean = false;
  showModalTaxDed: boolean = false;
//  listtaxable: PurchaseOrdertaxableDetail;
  //listdeductible: PurchaseOrderdeductibleDetail;
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
  

  displayedColumns: ColumnD<TaxableRep>[] =
  [
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost;', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Impuesto', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.rate; }, header: 'Valor(%)', field: 'rate', display: 'table-cell' },
    { template: (data) => { return data.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }, header: 'Monto', field: 'amount', display: 'table-cell' },


  ];

displayedColumnsde: ColumnD<DeductibleRep>[] =
  [
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descuento', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.rate; }, header: 'Valor(%)', field: 'rate', display: 'table-cell' },
    { template: (data) => { return data.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }, header: 'Monto', field: 'amount', display: 'table-cell' },

  ];

  constructor(public _service: ValidationProductService, private messageService: MessageService, 
    private confirmationService: ConfirmationService,  public userPermissions: UserPermissions,
    private _httpClient: HttpClient,  private _authservice: AuthService) { }
   // _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.iduserlogin = this._authservice.storeUser.id;

  }

  onshow(){
   ///TO DO OBTENER IMPONJIBLES Y DEDUCIBLES DEL PROCUTOS.

   
    //if(this.showtaxable==true){
    // var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    // filter.purchaseOrderDetail=this._product.id
    // filter.purchaseOrderId=-1
    // this._product.taxables=[]
    // this._product.deductibles=[]
    // this._service.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
    //   if (filter.purchaseOrderDetail != -1) {
    //     if (data.taxables.length > 0 || data.deductibles.length > 0) {
    //       if(data.taxables.length > 0 )
    //       {
    //        for (let i = 0; i < data.taxables.length; i++) {
    //         let listtaxable = new PurchaseOrdertaxableDetail();
    //         listtaxable.id = data.taxables[i].idPurchaseOrderTaxableDeductible;
    //         listtaxable.idPurchaseOrder = data.taxables[i].idPurchaseOrder;
    //         listtaxable.idPurchaseOrderDetail = data.taxables[i].idPurchaseOrderDetail;
    //         listtaxable.taxableDeductibleBaseId = data.taxables[i].taxableDeductibleBaseId;
    //         listtaxable.idTaxableType = data.taxables[i].idTaxableType;
    //         listtaxable.taxableType = data.taxables[i].taxableType;
    //         listtaxable.idApply = data.taxables[i].idApply;
    //         listtaxable.applyCost = data.taxables[i].applyCost;
    //         listtaxable.distributionCalculationId = data.taxables[i].distributionCalculationId;
    //         listtaxable.distributionCalculation = data.taxables[i].distributionCalculation;
    //         listtaxable.idTaxType = data.taxables[i].idTaxType;
    //         listtaxable.idTax = data.taxables[i].idTax;
    //         listtaxable.taxableDeductibleBase = data.taxables[i].taxableDeductibleBase;
    //         listtaxable.indFixedTax = data.taxables[i].indFixedTax;
    //         listtaxable.indTaxable = data.taxables[i].indTaxable;
    //         listtaxable.indDeductible = data.taxables[i].indDeductible;
    //         listtaxable.indPurchaseTaxableDetail = data.taxables[i].indPurchaseTaxableDetail;
    //         listtaxable.indPurchaseTaxable = data.taxables[i].indPurchaseTaxable;
    //         listtaxable.indProductsAll = data.taxables[i].indProductsAll;
    //         listtaxable.indBaseNetSale = data.taxables[i].indBaseNetSale;
    //         listtaxable.indBaseNetCost = data.taxables[i].indBaseNetCost;
    //         listtaxable.rate = data.taxables[i].rate;
    //         listtaxable.amount = data.taxables[i].amount;
    //         this._product.taxables.push(listtaxable);
    //        }
    //       }
    //       if(data.deductibles.length > 0 ){
    //         for (let i = 0; i < data.deductibles.length; i++) {
    //           let listdeductible = new PurchaseOrderdeductibleDetail();
    //           listdeductible.id = data.deductibles[i].idPurchaseOrderTaxableDeductible;
    //           listdeductible.idPurchaseOrder = data.deductibles[i].idPurchaseOrder;
    //           listdeductible.idPurchaseOrderDetail = data.deductibles[i].idPurchaseOrderDetail;
    //           listdeductible.taxableDeductibleBaseId = data.deductibles[i].taxableDeductibleBaseId;
    //           listdeductible.idTaxableType = data.deductibles[i].idTaxableType;
    //           listdeductible.taxableType = data.deductibles[i].taxableType;
    //           listdeductible.idApply = data.deductibles[i].idApply;
    //           listdeductible.applyCost = data.deductibles[i].applyCost;
    //           listdeductible.distributionCalculationId = data.deductibles[i].distributionCalculationId;
    //           listdeductible.distributionCalculation = data.deductibles[i].distributionCalculation;
    //           listdeductible.idTaxType = data.deductibles[i].idTaxType;
    //           listdeductible.idTax = data.deductibles[i].idTax;
    //           listdeductible.taxableDeductibleBase = data.deductibles[i].taxableDeductibleBase;
    //           listdeductible.indFixedTax = data.deductibles[i].indFixedTax;
    //           listdeductible.indTaxable = data.deductibles[i].indTaxable;
    //           listdeductible.indDeductible = data.deductibles[i].indDeductible;
    //           listdeductible.indPurchaseTaxableDetail = data.deductibles[i].indPurchaseTaxableDetail;
    //           listdeductible.indPurchaseTaxable = data.deductibles[i].indPurchaseTaxable;
    //           listdeductible.indProductsAll = data.deductibles[i].indProductsAll;
    //           listdeductible.indBaseNetSale = data.deductibles[i].indBaseNetSale;
    //           listdeductible.indBaseNetCost = data.deductibles[i].indBaseNetCost;
    //           listdeductible.rate = data.deductibles[i].rate;
    //           listdeductible.amount = data.deductibles[i].amount;
    //           this._product.deductibles.push(listdeductible);
    //         }
    //       }
    //       //emitir evento
    //     }
    //   }
    // }, (error: HttpErrorResponse) => {
    //   this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    // });
   //}
 }
  onToggleTaxableDeductible(visible: boolean) {
    this.showmodaldeductible = visible;
  }

  showmodal(indTaxable: boolean, indDeductible: boolean) {
    debugger;
    this._product = this._product;
    this.indDeductible = indDeductible;
    this.showModalTaxDed = true;
  }

  showTaxableDeductible(value: boolean) {
    this.isTaxable = value;
  }
  getDetailProd(data){
    debugger;
   console.log(data.ProductDetail);
   this._sendNewCostProd.emit({product: data.ProductDetail})
  }

  receive(data, valor = 0) {


  }
  editTaxableDeductible(tax) {
    this._imponible= tax;
    this.showEdit = true;
  }

  //#region eliminar
  removetaxable(order) {
    debugger;
    let costBase = this._product.individual.indAdded == 1 ? this._product.individual.baseCost: this._product.master.baseCost;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este registro?',
      accept: () => {
        order.indPurchaseTaxable = false;
        order.indPurchaseTaxableDetail = true;
        let applysales=false
        if(order.idPurchaseTaxableDeductible==-1)
           this._product.taxables = this._product.taxables.filter(x=>x.idProducTax!=order.idProducTax);
       else
       this._product.taxables = this._product.taxables.filter(x=>x.idPurchaseTaxableDeductible!=order.idPurchaseTaxableDeductible);
        
       var data=this._product;
        this.CalculateTaxDed(data);
      },
    });
  }

  //#region Eliminar deductible
  
  removedeductible(order) {
    //let costBase = this._product.individual.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este registro?',
      accept: () => {
        order.indPurchaseTaxable = false;
        order.indPurchaseTaxableDetail = true;
        let applysales=false
           
            if(order.idPurchaseTaxableDeductible==-1)
                this._product.deductibles = this._product.deductibles.filter(x=>x.idTemp!=order.idTemp);
            else
                this._product.taxables = this._product.taxables.filter(x=>x.idPurchaseTaxableDeductible!=order.idPurchaseTaxableDeductible);
  
        var data=this._product;
        this.CalculateTaxDed(data);
      },
    });
  }

  //#endregion


//Add, Update and Remove for calculate Imponibles y deducibles.
CalculateTaxDed(data){
debugger;
if(data.ProductDetail!=undefined){

   this._product.taxables=data.ProductDetail.taxables;
   this._product.deductibles= data.ProductDetail.deductibles;
}
    let costBase = this._product.individual.indAdded == 1 ? this._product.individual.baseCost : this._product.master.baseCost;
    //let costnet=this._product.individual.indAdded == 1 ? this._product.individual.netCost: this._product.master.netCost;
    let costdexNetBase = 0;
    let costdexNetSales = 0;
    let costdexnetconvertion = 0;
    let costNetBase = 0;
    let costNetSales = 0;
    let costnetconvertion = 0;
    let apllysalescost=false
  if(data!= undefined){
          if(this._product.taxables.length>0){

            this._product.taxables.forEach(taxP => {
              if (taxP.idApply == ApplyCost.costNetBase) {
                if (taxP.rate > 0) {
                  costNetBase = costNetBase + (costBase * (taxP.rate / 100))
                  costnetconvertion = costNetBase / parseFloat(this._product.supplierExchangeRate.toString()); //cambiar luego this._purchaseheader.exchangeRateSupplier.toString()
                } else {
                  costNetBase = costNetBase + taxP.amount;
                  costnetconvertion = costNetBase / parseFloat(this._product.supplierExchangeRate.toString());
                }
    
              } else {
                if (taxP.rate > 0) {
                  costNetSales = costNetSales + (costBase * (taxP.rate / 100))
                } else {
                  costNetSales = costNetSales + taxP.amount
                }
                apllysalescost=true;
              }
            });
          }
          
        if(this._product.deductibles.length>0){
           this._product.deductibles.forEach(dedP => {
            if (dedP.idApply == ApplyCost.costNetBase) {
              if (dedP.rate > 0) {
               costdexNetBase = costdexNetBase + (costBase * (dedP.rate / 100))
               costdexnetconvertion = costdexNetBase / parseFloat(this._product.supplierExchangeRate.toString());
              } else {
               costdexNetBase = costdexNetBase + dedP.amount;
               costdexnetconvertion = costdexNetBase / parseFloat(this._product.supplierExchangeRate.toString());
              }
  
            } else {
              if (dedP.rate > 0) {
               costdexNetSales = costdexNetSales + (costBase * (dedP.rate / 100))
              } else {
               costdexNetSales = costdexNetSales + dedP.amount
              }
              apllysalescost=true;
            }
          });
        }
         
          if (this._product.individual.indAdded == 1) {
  
            this._product.individual.netCost = (this._product.individual.baseCost + costNetBase-costdexNetBase); 
            //this.ProductOrder.individual.salesNetCost = (this.ProductOrder.individual.baseCostNew + costNetSales-costdexNetSales)
            this._product.individual.salesNetCost = (this._product.individual.netCost + costNetSales-costdexNetSales)
            this._product.individual.taxableBase = 0;
            this._product.individual.taxableConversion = 0;
            this._product.individual.taxableBase = (this._product.individual.taxableBase + costNetBase)*this._product.individual.packingInvoice;
            this._product.individual.taxableConversion = (this._product.individual.taxableConversion + costnetconvertion)*this._product.individual.packingInvoice;
            this._product.individual.deductibleBase = 0;
            this._product.individual.deductibleConvertion = 0;
            this._product.individual.deductibleBase = (this._product.individual.deductibleBase + costdexNetBase)*this._product.individual.packingInvoice;
            this._product.individual.deductibleConvertion = (this._product.individual.deductibleConvertion + costdexnetconvertion)*this._product.individual.packingInvoice;

            // //Repeat hasta que devuelva el indadd
            // this._product.individual.taxableBase = (this._product.individual.taxableBase + costNetBase)*this._product.packagingQuantity;
            // this._product.individual.taxableConversion = (this._product.individual.taxableConversion + costnetconvertion)*this._product.packagingQuantity;
            // this._product.individual.deductibleBase = 0;
            // this._product.individual.deductibleConvertion = 0;
            // this._product.individual.deductibleBase = (this._product.individual.deductibleBase + costdexNetBase)*this._product.packagingQuantity;
            // this._product.individual.deductibleConvertion = (this._product.individual.deductibleConvertion + costdexnetconvertion)*this._product.packagingQuantity;
          } else {
            this._product.master.netCost = (this._product.master.baseCost + costNetBase-costdexNetBase);
            //this.ProductOrder.master.salesNetCost = (this.ProductOrder.master.baseCostNew + costNetSales-costdexNetSales);
            this._product.master.salesNetCost = (this._product.master.netCost + costNetSales-costdexNetSales);
            this._product.master.taxableBase = 0;
            this._product.master.taxableConversion = 0;
            this._product.master.taxableBase = (this._product.master.taxableBase + costNetBase)*this._product.master.packingInvoice;
            this._product.master.taxableConversion = (this._product.master.taxableConversion + costnetconvertion)*this._product.master.packingInvoice;
            this._product.master.deductibleBase = 0;
            this._product.master.deductibleConvertion = 0;
            this._product.master.deductibleBase = (this._product.master.deductibleBase + costdexNetBase)*this._product.master.packingInvoice;
            this._product.master.deductibleConvertion = (this._product.master.deductibleConvertion + costdexnetconvertion)*this._product.master.packingInvoice;
    
          }
  
          //Asignacion de nuevos costos
         
          //this._sendNewCost.emit({ product: this.ProductOrder, indtabtaxable: data.indtabtaxable, ischange: this.ischange });
  
        //}
      //}
  
      //Emitir a producto con sus imponibles calculados
       //this._sendTaxablesProductDetail.emit({TaxDetailProd:this._product});
       this._sendNewCostProd.emit({product: this._product})
  
    //}
   }
}

}
