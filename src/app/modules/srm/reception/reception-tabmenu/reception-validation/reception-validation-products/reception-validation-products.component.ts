import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { isThisQuarter } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Reception } from 'src/app/models/srm/reception';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { UpdaterButtonService } from 'src/app/modules/common/components/updater-button/service/updater-button.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { ApplyCost } from 'src/app/modules/srm/shared/Utils/apply-cost';
import { EnumPackingType } from 'src/app/modules/srm/shared/Utils/enum-packing-type';
import { MenuTabOrder } from 'src/app/modules/srm/shared/Utils/menu-tab-order';
import { MenuTabValidation } from 'src/app/modules/srm/shared/Utils/menu-tab-validation';
import { ProductPanelPricesComponent } from './product-panel-prices/product-panel-prices.component';
import { TaxableDeductibleValidationComponent } from './taxable-deductible-validation/taxable-deductible-validation.component';

@Component({
  selector: 'app-reception-validation-products',
  templateUrl: './reception-validation-products.component.html',
  styleUrls: ['./reception-validation-products.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ReceptionValidationProductsComponent implements OnInit {

  @Input() purchaseId = 0;
  @Input() purchaseValidate= new PurchaseValidation();
  @Input() reception: Reception = new Reception();
  displayedColumns: ColumnD<ValidationProduct>[] = [];
  _selectedColumns: any[];
  products: ValidationProduct[] = [];
  productsWithIndAdded: ValidationProduct[] = [];
  activeIndex: number = 0;
  activetab: boolean = true;
  tabselected: boolean = false;
  menuTabValidation: typeof MenuTabValidation = MenuTabValidation;
  indmenuTab: number = 0;
  ActiveIndexTab: number = 0;
  _product: Productdetailvalidation = new Productdetailvalidation();
  _purchaseDetailProducts: Productdetailvalidation[]=[];
  //#region mostrartab
  showtaxable: boolean = false;
  showDetail: boolean = true;
  showTabPrice: boolean = false;
  showPrice: boolean = false;
  showButtonNext: boolean = true;
  bar: string="";
  typePackaging: string="";
  presentationPackaging: string="";
  purchaseValidateHeader: PurchaseValidation = new PurchaseValidation();
  @ViewChild(ProductPanelPricesComponent) tabPrices: ProductPanelPricesComponent;
  @ViewChild(TaxableDeductibleValidationComponent) tabTaxables: TaxableDeductibleValidationComponent;
  @Input("isSave") isSave: boolean = true;
  //endregion
  //#region calculos totales 

  subtotal: number = 0;
  subtotalconv: number = 0;
  totalitems: number = 0;
  taxableTotalcab: number = 0;
  deductibleTotalcab: number = 0;
  taxableTotal: number = 0;
  deductibleTotal: number = 0;
  totaldeductiblesproduct: number = 0;
  totaltaxableproduct: number = 0;
  totalGridBase:number =0;
  totalGridConvertion:number =0;
  //#endregion

  defectImage: DefeatImage = new DefeatImage()
  constructor(private readonly validationProductService: ValidationProductService,
    private readonly dialogService: DialogsService,
    private readonly loadingService: LoadingService,
    private readonly updaterButtonService: UpdaterButtonService,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private messageService: MessageService,
    private  _serviceValidation: ValidationProductService) { }

  ngOnInit(): void {
    this.loadColumns();
    this.getProducts();
    this.getPurchaseValid();
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }

  getProducts() {
    this.validationProductService.getValidationProcucts(this.purchaseId)
      .then(data => this.getProductsSuccess(data))
      .catch(error => this.loadingHandleError(error));
  }

  private getProductsSuccess(data: ValidationProduct[]) {
    debugger
    this.updaterButtonService.setUpdaterIsActive(false);
    this.products = data;
    this.totalGridBase= this.products.reduce((sum, current) => sum + current.totalCostBase, 0);
    this.totalGridConvertion= this.products.reduce((sum, current) => sum + current.totalCost, 0);
    console.log(this._product)
    this.recalculateinitial(this.products);
    // this.productsWithIndAdded =this.products.filter(x=> x.indAdded==1);
  }

  private loadColumns() {
    this.displayedColumns = [
      { template: (data) => { return data.productName; }, field: 'productName', header: this.getHeaderCollumnsName('product_name'), display: 'table-cell' },
      { template: (data) => { return data.packageType; }, field: 'packageType', header: this.getHeaderCollumnsName('package_type'), display: 'table-cell' },
      { template: (data) => { return data.unitByPackage; }, field: 'unitByPackage', header: this.getHeaderCollumnsName('unit_by_package'), display: 'table-cell' },
      { template: (data) => { return data.barcode; }, field: 'barcode', header: this.getHeaderCollumnsName('barcode'), display: 'table-cell' },
      { template: (data) => { return data.internalReference; }, field: 'internalReference', header: this.getHeaderCollumnsName('internal_reference'), display: 'table-cell' },
      { template: (data) => { return data.wasWeighed; }, field: 'wasWeighed', header: this.getHeaderCollumnsName('weight'), display: 'table-cell' },
      { template: (data) => { return data.totalInvoiceUnits; }, field: 'totalInvoiceUnits', header: this.getHeaderCollumnsName('invoice_qty'), display: 'table-cell' },
      { template: (data) => { return data.requestedUnit; }, field: 'requestedUnit', header: this.getHeaderCollumnsName('requested_unit'), display: 'table-cell' },
      { template: (data) => { return data.differenceUnit; }, field: 'differenceUnit', header: this.getHeaderCollumnsName('difference_unit'), display: 'table-cell' },
      //{ template: (data) => { return this.decimalPipe.transform(data.costByPackage, '.2'); }, field: 'costByPackage', header: this.getHeaderCollumnsName('cost_by_package'), display: 'table-cell' },
      //{ template: (data) => { return this.decimalPipe.transform(data.unitCostBase, '.3'); }, field: 'unitCostBase', header: this.getHeaderCollumnsName('unit_cost'), display: 'table-cell' },

      { template: (data) => { return this.decimalPipe.transform(data.costByPackageBase, '.4'); }, field: 'costByPackageBase', header:'Costo base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalCostBase, '.4'); }, field: 'totalCostBase', header:'Costo total base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalCost, '.4'); }, field: 'totalCost', header:'Costo total conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netCostSell, '.4'); }, field: 'netCostSell', header: this.getHeaderCollumnsName('net_cost_sell'), display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netFactorBase, '.2'); }, field: 'netFactorBase', header:'Factor neto', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netFactorSellBase, '.2'); }, field: 'netFactorSellBase', header: this.getHeaderCollumnsName('net_factor_sell'), display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.factorSell, '.2'); }, field: 'factorSell', header: this.getHeaderCollumnsName('factor_sell'), display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalTaxable, '.4'); }, field: 'totalTaxable', header: this.getHeaderCollumnsName('total_taxable'), display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalDeductibles, '.4'); }, field: 'totalDeductibles', header: this.getHeaderCollumnsName('total_deductibles'), display: 'table-cell' },
      // { field: 'factorSell', header:'Factor de venta', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.retailPriceBase, '.4'); }, field: 'retailPriceBase', header: this.getHeaderCollumnsName('retail_price_base'), display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.retailPrice, '.4'); }, field: 'retailPrice', header: this.getHeaderCollumnsName('retail_price'), display: 'table-cell' }
    ];

    this._selectedColumns = this.displayedColumns;
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private getHeaderCollumnsName(name: string) {
    return `srm.reception.validation_products.${name}`;
  }



  handleChange(e) {
    debugger
    this.ActiveIndexTab = e != 0 ? e.index : 0;
    if (this.ActiveIndexTab == 0) {
      this.indmenuTab = this.menuTabValidation.totalresume;
      this.tabselected = false;
      this.showtaxable = false;
      this.showTabPrice = false;
    }
    else if (this.ActiveIndexTab == 1) {
      this.tabselected = true;
      if (this.indmenuTab == 0) {
        this.indmenuTab = this.menuTabValidation.prices;
        this.showTabPrice = true;
        if (this._product.master.idPackingType == EnumPackingType.Master) {
          this.showPrice = false;
          this.tabPrices.refreshViewTabInternto(this.showPrice);
          if (this._product.master.baseCost <= 0)
            this.showButtonNext = false;
        }
        else {
          this.showPrice = true;
          this.tabPrices.refreshViewTabInternto(this.showPrice);
          if (this._product.individual.baseCost <= 0)
            this.showButtonNext = false;
        }
      }
      if (this.indmenuTab == this.menuTabValidation.prices) {
        this.showDetail = true;
        this.showtaxable = false;
        // this.showTabPrice = false;
        this.indmenuTab = this.menuTabValidation.prices;
      }
      else
        this.showDetail = false;
    }
  }

  onChangeDetailPage(idEnum: number) {
    debugger
    if (idEnum == this.menuTabValidation.prices) {
      this.showDetail = false;
      this.showtaxable = false;
      this.showTabPrice = true;
      this.indmenuTab = this.menuTabValidation.prices;
      if (this._product.master.idPackingType == EnumPackingType.Master) {
        this.showPrice = false;
        this.tabPrices.refreshViewTabInternto(this.showPrice);
        //if (this._product.master.baseCost<= 0)
        //       this.showButtonNext = false;
      }
      else {
        this.showPrice = true;
       
        this.tabPrices.refreshViewTabInternto(this.showPrice);
        this.tabPrices.RecalculateInit(this._product);
        // if (this._product.individual.baseCost <= 0)
        //       this.showButtonNext = false;
      }
    } else if (idEnum == this.menuTabValidation.imponible) {
      this.showtaxable = true;
      this.showPrice = false;
      this.showTabPrice = false;
      this.showDetail = false;
      this.indmenuTab = this.menuTabValidation.imponible
      //if(this.baseCostNew!=0 && this.baseCostNew != this.baseCostOld)
      // if (!this.isSave)
      //       this.SaveProductOnNextButton();
          this.tabTaxables.onshow();
     
    }
  }

  //#region getdetail

  viewDetail(id) {
    this.loadingService.startLoading('wait_loading');
    debugger
    this.validationProductService.getDetailValidation(id)
      .then(data => this.loadDetailtSuccessed(data))
      .catch(error => this.loadingHandleError(error))
  }

  getDetailPackage() {
    if(this._product.individual.indAdded)
      return this._product.individual.packingType ?? 'no_info';
    
  }


  loadDetailtSuccessed(data) {
    this._product = data;
    this.loadingService.stopLoading();
    this.bar= this._product.individual.indAdded==1 ? this._product.individual.bar : this._product.master.bar;
    this.typePackaging= this._product.individual.indAdded==1 ? this._product.individual.packingType:this._product.master.packingType
    this.tabselected = true;
    this.activetab = false;
   //this.showPrice = true;
   //event.index = 1;
    this.activeIndex = 1;
  // this.handleChange(event);
   this.onChangeDetailPage(1);
  }


  //#endregion


//#region  IMPONIBLES DETAIL

//Sendnewcost viene desde imponibles y deducibles
onChangeTaxablesDeductibles(data) {
debugger;
  if(data.selecteds!=undefined){

      if(data.selecteds.length>0){
          // this.detailCopy= data.selecteds.find(x=>x.id ==data.product.id)
          // this.AsignPurchaseOrderCopy(this.detailCopy);
      }
      //this.selectedproduct=[];
  }
  if (data != null) {
    this.tabPrices.onChanceTaxaDed(data); //prices --llama el activate
  }
}
//#endregion

//#region Detail
saveDetail(data){
  debugger;
  this._purchaseDetailProducts=[];
     console.log(this._product);
  if (this._product.id > 0 || data!=undefined) {
       
       if( data!=undefined && data.product.length>0){
            data.product.forEach(element => {
              this._purchaseDetailProducts.push(element);
         });
        
       }else{
        this._purchaseDetailProducts.push(this._product);
       }
       console.log(this._purchaseDetailProducts);
    this._serviceValidation.savedetail(this._purchaseDetailProducts).subscribe((respoonse: number) => {
      if (respoonse > 0) {
       // if (message)
          this.messageService.add({  severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
        //this.search();
        //this.dtu.reset();
       // this.isSave = true;
      }
      else { this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }) }
    }, (error: HttpErrorResponse) =>
      this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
      ));

}
}


//#endregion




//#region calculos totales 
recalculateinitial(data)
{
  debugger
  if (data.length > 0) 
  {
    this.totaldeductiblesproduct=0
    this.totaltaxableproduct=0
    this.taxableTotalcab=0
    this.deductibleTotalcab=0
    this.taxableTotal=0
    this.deductibleTotal=0
    this.subtotal =0 
    for (let i = 0; i < data.length; i++) 
    {
        this.totaldeductiblesproduct=this.totaldeductiblesproduct+data[i].totalDeductibles;
        this.totaltaxableproduct=this.totaltaxableproduct+data[i].totalTaxable; 
        this.taxableTotalcab=data[i].taxableTotal;
        this.deductibleTotalcab=data[i].deductibleTotal;
        this.taxableTotal=this.taxableTotalcab+ this.totaltaxableproduct
        this.deductibleTotal=this.deductibleTotalcab+this.totaldeductiblesproduct;
        this.subtotal =this.subtotal+(data[i].costByPackageBase*data[i].invoicePacking) 
    }
  }
}

RecalculateTotals(data, tax) 
{
  if(data !=undefined)
  {
    if(this.products.length>0)
    {
      this.totaldeductiblesproduct=0
      this.totaltaxableproduct=0
      this.taxableTotalcab=0
      this.deductibleTotalcab=0
      this.taxableTotal=0
      this.deductibleTotal=0
      this.subtotal =0
      for (let i = 0; i < this.products.length; i++) 
      {
        if(data.products.individual.indAdded==1)
        {
          if(this.products[i].idPackaging==data.products.individual.idPacking)
          {
            this.products[i].costByPackageBase=data.products.individual.baseCost;
            this.products[i].totalCostBase=this.products[i].costByPackageBase*this.products[i].invoicePacking
            this.products[i].netCostSell=data.products.individual.salesNetCost
            this.products[i].netFactor=data.products.individual.netFactor
            this.products[i].netFactorSell=data.products.individual.netSalesFactor
            this.products[i].factorSell=data.products.individual.salesFactor
            this.products[i].retailPriceBase=data.products.individual.pvpBase           
            this.products[i].retailPrice=data.products.individual.pvpConversion
            this.products[i].totalTaxable=data.products.individual.taxableBase;
            this.products[i].totalDeductibles=data.products.individual.deductibleBase;
          }
        }
        else{
          if(this.products[i].idPackaging==data.products.master.idPacking)
          {
            this.products[i].costByPackageBase=data.products.master.baseCost;
            this.products[i].totalCostBase=this.products[i].costByPackageBase*this.products[i].invoicePacking
            this.products[i].netCostSell=data.products.master.salesNetCost
            this.products[i].netFactor=data.products.master.netFactor
            this.products[i].netFactorSell=data.products.master.netSalesFactor
            this.products[i].factorSell=data.products.master.salesFactor
            this.products[i].retailPriceBase=data.products.master.pvpBase           
            this.products[i].retailPrice=data.products.master.pvpConversion
            this.products[i].totalTaxable=data.products.master.taxableBase;
            this.products[i].totalDeductibles=data.products.master.deductibleBase;
          }

        }  
        this.totaldeductiblesproduct=this.totaldeductiblesproduct+this.products[i].totalDeductibles;
        this.totaltaxableproduct=this.totaltaxableproduct+this.products[i].totalTaxable; 
        this.taxableTotalcab=this.products[i].taxableTotal;
        this.deductibleTotalcab=this.products[i].deductibleTotal;
        this.taxableTotal=this.taxableTotalcab+ this.totaltaxableproduct
        this.deductibleTotal=this.deductibleTotalcab+this.totaldeductiblesproduct;
        this.subtotal =this.subtotal+(this.products[i].costByPackageBase*this.products[i].invoicePacking)

      }
    }
  }


}
//#endregion

//#region Datos del header validation
getPurchaseValid() {
  this._serviceValidation.getPurchaseValidate(this.purchaseId).subscribe((data: PurchaseValidation) => {
    if (data != null) {
      this.purchaseValidateHeader = data;   
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la compra." });
    }

  }, (error: HttpErrorResponse) => {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la compra." });
  });
}
//#endregion

CalculateMasivo(data){
  debugger;
  if(data!= undefined){
    for (let j = 0; j < data.product.length; j++) {
     
      let costBase = data.product[j].individual.indAdded == 1 ? data.product[j].individual.baseCost : data.product[j].master.baseCost;
      let costnet = data.product[j].individual.indAdded == 1 ? data.product[j].individual.netCost : data.product[j].masterPrices.netCost;
      let costdexNetBase = 0;
      let costdexNetSales = 0;
      let costdexnetconvertion = 0;
      let costNetBase = 0;
      let costNetSales = 0;
      let costnetconvertion = 0;
      let apllysalescost = false
    
          if(data.product[j].taxables.length>0){

            data.product[j].taxables.forEach(taxP => {
              if (taxP.idApply == ApplyCost.costNetBase) {
                if (taxP.rate > 0) {
                  costNetBase = costNetBase + (costBase * (taxP.rate / 100))
                  costnetconvertion = costNetBase / parseFloat(data.product[j].supplierExchangeRate.toString()); //cambiar luego this._purchaseheader.exchangeRateSupplier.toString()
                } else {
                  costNetBase = costNetBase + taxP.amount;
                  costnetconvertion = costNetBase / parseFloat(data.product[j].supplierExchangeRate.toString());
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
          
        if(data.product[j].deductibles.length>0){
          data.product[j].deductibles.forEach(dedP => {
            if (dedP.idApply == ApplyCost.costNetBase) {
              if (dedP.rate > 0) {
               costdexNetBase = costdexNetBase + (costBase * (dedP.rate / 100))
               costdexnetconvertion = costdexNetBase / parseFloat(data.product[j].supplierExchangeRate.toString());
              } else {
               costdexNetBase = costdexNetBase + dedP.amount;
               costdexnetconvertion = costdexNetBase / parseFloat(data.product[j].supplierExchangeRate.toString());
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
         
          if (data.product[j].individual.indAdded == 1) {
  
            data.product[j].individual.netCost = (data.product[j].individual.baseCost + costNetBase-costdexNetBase); 
            //this.ProductOrder.individual.salesNetCost = (this.ProductOrder.individual.baseCostNew + costNetSales-costdexNetSales)
            data.product[j].individual.salesNetCost = (data.product[j].individual.netCost + costNetSales-costdexNetSales)
            data.product[j].individual.taxableBase = 0;
            data.product[j].individual.taxableConversion = 0;
            data.product[j].individual.taxableBase = (data.product[j].individual.taxableBase + costNetBase)*data.product[j].individual.packingInvoice;
            data.product[j].individual.taxableConversion = (data.product[j].individual.taxableConversion + costnetconvertion)*data.product[j].individual.packingInvoice;
            data.product[j].individual.deductibleBase = 0;
            data.product[j].individual.deductibleConvertion = 0;
            data.product[j].individual.deductibleBase = (data.product[j].individual.deductibleBase + costdexNetBase)*data.product[j].individual.packingInvoice
            data.product[j].individual.deductibleConvertion = (data.product[j].individual.deductibleConvertion + costdexnetconvertion)*data.product[j].individual.packingInvoice;
          } else {
            data.product[j].master.netCost = (data.product[j].master.baseCost + costNetBase-costdexNetBase);
            //this.ProductOrder.master.salesNetCost = (this.ProductOrder.master.baseCostNew + costNetSales-costdexNetSales);
            data.product[j].master.salesNetCost = (data.product[j].master.netCost + costNetSales-costdexNetSales);
            data.product[j].master.taxableBase = 0;
            data.product[j].master.taxableConversion = 0;
            data.product[j].master.taxableBase = (data.product[j].master.taxableBase + costNetBase)*data.product[j].master.packingInvoice;
            data.product[j].master.taxableConversion = (data.product[j].master.taxableConversion + costnetconvertion)*data.product[j].master.packingInvoice;
            data.product[j].master.deductibleBase = 0;
            data.product[j].master.deductibleConvertion = 0;
            data.product[j].master.deductibleBase = (data.product[j].master.deductibleBase + costdexNetBase)*data.product[j].master.packingInvoice;
            data.product[j].master.deductibleConvertion = (data.product[j].master.deductibleConvertion + costdexnetconvertion)*data.product[j].master.packingInvoice;
    
          }
  
          //Asignacion de nuevos costos
         
          //this._sendNewCost.emit({ product: this.ProductOrder, indtabtaxable: data.indtabtaxable, ischange: this.ischange });
  
        //}
      //}
  
      //Emitir a producto con sus imponibles calculados
       //this._sendTaxablesProductDetail.emit({TaxDetailProd:this._product});
      let product: any;
       this.onChangeTaxablesDeductibles(data.product[j])
  
    //}
   }
   this.saveDetail(data);
  }
}

}
