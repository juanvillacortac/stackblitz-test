import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ApplyCost } from '../../../shared/Utils/apply-cost';
import { DistributionCost } from '../../../shared/Utils/distribution-cost';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { PurchaseOrderdeductibleDetail } from 'src/app/models/srm/purchase-order-detail-deductible';
import { EnumPackingType } from '../../../shared/Utils/enum-packing-type';

@Component({
  selector: 'app-purchase-order-total-product',
  templateUrl: './purchase-order-total-product.component.html',
  styleUrls: ['./purchase-order-total-product.component.scss']
})
export class PurchaseOrderTotalProductComponent implements OnInit {

  @Input("_PurchaseOrderProduct") _PurchaseOrderProduct: PurchaseOrderProduct;
  @Input("netcostTotal") netcostTotal: number = 0;
  @Input("netcostConvertionTotal") netcostConvertionTotal: number = 0;
  @Input("totaldeductiblesproduct") totaldeductiblesproduct: number = 0;
  @Input("totaltaxableproduct") totaltaxableproduct: number = 0;
  @Input("subtotal") subtotal: number = 0;
  @Input("taxableTotalcab") taxableTotalcab: number = 0;
  @Input("deductibleTotalcab") deductibleTotalcab: number = 0;
  @Input("taxableTotal") taxableTotal: number = 0;
  @Input("deductibleTotal") deductibleTotal: number = 0;
  @Input("PurchaseOrderProductSelect") PurchaseOrderProductSelect: PurchaseOrderProduct[] = [];
  @Output("PurchaseOrderProductSelectChange") PurchaseOrderProductSelectChange = new EventEmitter<PurchaseOrderProduct[]>();
  @Output("TotalTaxableDeductibleHeader") TotalTaxableDeductibleHeader = new EventEmitter<{ subtotal: number, indtabtaxable: boolean, SubtotalTaxables: number, SubtotalDeductibles: number }>();
  @Output("_sendProductAll") _sendProductAll = new EventEmitter<{ TaxableListHeaderSave: Taxabledeductible }>();
  @Input("_purchaseOrderDetail") _purchaseOrderDetail: PurchaseOrderProduct[] = [];
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
  @Output("_sendNewCost") _sendNewCost = new EventEmitter<{ product: PurchaseOrderProduct, indtabtaxable: boolean, ischange: boolean, applycostsales: boolean , selecteds: PurchaseOrderProduct [] }>();
  @Input("indSelectItem") indSelectItem : PurchaseOrderProduct

  selecteds:PurchaseOrderProduct []=[];
  @Output("indSelectItemChange") indSelectItemChange = new EventEmitter<PurchaseOrderProduct>();
  @Output("selectedproductDescheck") selectedproductDescheck = new EventEmitter();
  product: PurchaseOrderProduct;
  listtaxable: PurchaseOrdertaxableDetail;
  listdeductible: PurchaseOrderdeductibleDetail;
  conversionsymbolcoin: any;
  basesymbolcoin: any;
  subDeducibleTotal: number = 0;
  subTaxableTotal: number = 0;
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  iduserlogin: number = -1;
  totalconcept: number = 0;
  totals: number = 0;
  EnumPackingType: typeof EnumPackingType = EnumPackingType;
  selectedaux:any[];
  ischange: boolean= false;
  //botones con opcions a los imponibles y deducibles a la cabecera
  items: MenuItem[] = [
    {
      label: 'Imponibles al subtotal',
      icon: 'pi pi-money-bill',
      command: () => {
        this.showmodal(true, false, false)
      }
    },
    {
      label: 'Imponibles masivo',
      icon: 'pi pi-money-bill',
      command: () => {
        this.showmodal(true, false, true)
      }
      //visible:this.PurchaseOrderProductSelect.length >0 ? true : false 
    },
    {
      label: 'Deducibles al subtotal',
      icon: 'pi pi-minus-circle', command: () => {
        this.showmodal(false, true, false)
      }
    },
    {
      label: 'Deducibles masivo',
      icon: 'pi pi-minus-circle', command: () => {
        this.showmodal(false, true, true)
      }
    }
  ];

  //botones con opciones a la cabecera de imponibles y deducibles 
  // itemshead: MenuItem[] = [
  //   {
  //     label: 'Imponible al subtotal', icon: 'pi pi-money-bill', command: () => {
  //       this.showmodalheader(true, false)
  //     }
  //   },
  //   {
  //     label: 'Imponibles productos', icon: 'pi pi-money-bill', command: () => {
  //       this.showmodalheader(true, false)
  //     }
  //   },
  //   {
  //     label: 'Deducible al subtotal', icon: 'pi pi-minus-circle', command: () => {
  //       this.showmodalheader(false, true)
  //     }
  //   },
  //   {
  //     label: 'Deducible productos', icon: 'pi pi-minus-circle', command: () => {
  //       this.showmodalheader(false, true)
  //     }
  //   }
  // ];

  //modale de imponible deducible
  //@Input("_product") _product: PurchaseOrderProduct;
  @Input("_purchaseheader") _purchaseheader: Groupingpurchaseorders;
  @Input('showtaxable') showtaxable: boolean;
  indDeductible: boolean = false;
  indDeductibleheader: boolean = false;
  showModalTaxDed: boolean = false;
  showModalHeaderTaxDed: boolean = false;
  applyCost: typeof ApplyCost = ApplyCost;
  distributionCost: typeof DistributionCost = DistributionCost;
  statuspurchase: typeof StatusPurchase = StatusPurchase;

  constructor(private coinsService: CoinsService, private messageService: MessageService,
    public userPermissions: UserPermissions, private _httpClient: HttpClient) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.searchCoinsxCompany();
    this.iduserlogin = this._Authservice.storeUser.id;
  }


  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      var baseC: number;
      var conversionC: number;
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
        } else {
          this.conversionsymbolcoin = coin.symbology;
        }
      });
      //this.searchExchangeRates(baseC, conversionC);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando lasa monedas" });
    });
  }

  showmodal(indTaxable: boolean, indDeductible: boolean, selected: boolean) {
    let indprices: boolean = false
    if (selected) {
      if (this.PurchaseOrderProductSelect.length == 0)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe selecccionar al menos un productos." });
      else {
        //this.PurchaseOrderProductSelect = this.PurchaseOrderProductSelect;
        //this.indSelectItem= new PurchaseOrderProduct ();
        for (let i = 0; i < this.PurchaseOrderProductSelect.length; i++) {
          if (this.PurchaseOrderProductSelect[i].individualPrices.indAdded == 1) {
            if (this.PurchaseOrderProductSelect[i].individualPrices.baseCostNew == 0)
              indprices = true;

          } else {
            if (this.PurchaseOrderProductSelect[i].masterPrices.baseCostNew == 0)
              indprices = true;
          }
        }
        if (!indprices) {
          this.indDeductible = indDeductible;
          this.showModalTaxDed = true;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existen productos sin precio, por favor validar." });
        }

      }
    }
    else {
      //this._PurchaseOrderProduct = []//this._PurchaseOrderProduct;
      this.indDeductible = indDeductible;
      this.showModalTaxDed = true;
    }

  }

  showmodalheader(indTaxable: boolean, indDeductibleheader: boolean) {
    this.indDeductibleheader = indDeductibleheader;
    this.showModalHeaderTaxDed = true;
  }

  receiveTaxableDeductiblesHeader(data) {
    if (data != null) {
      let subtaxtotal = 0;
      let subdedxtotal = 0;
      let costNetSales = 0;
      if (data.TaxableListHeaderSave != null) {
        this.subDeducibleTotal = 0;
        this.subTaxableTotal = 0;
        if (data.TaxableListHeaderSave.taxables != undefined) {
          if (data.TaxableListHeaderSave.taxables.length > 0) {
            for (let i = 0; i < data.TaxableListHeaderSave.taxables.length; i++) {
              if (data.TaxableListHeaderSave.taxables[i].distributionCalculationId == DistributionCost.subTotal) {
                if (data.TaxableListHeaderSave.taxables[i].rate > 0) {
                  subtaxtotal = subtaxtotal + (this.subtotal * (data.TaxableListHeaderSave.taxables[i].rate / 100))
                  //this.subtotal= this.subtotal + (this.subtotal * (data.TaxableListHeaderSave.taxables[i].rate / 100))
                } else {
                  subtaxtotal = subtaxtotal + data.TaxableListHeaderSave.taxables[i].amount;
                  //this.subtotal= this.subtotal + data.TaxableListHeaderSave.taxables[i].amount;
                }
              }
            }
            //Asignar nuevos valor en el subtotal
            //this.subtotal= this.subtotal + subtaxtotal;
            this.subTaxableTotal = subtaxtotal;
            //this.taxableTotal=this.taxableTotal+this.subTaxableTotal;
          }
        }
        if (data.TaxableListHeaderSave.deductibles != undefined) {
          if (data.TaxableListHeaderSave.deductibles.length > 0) {
            for (let i = 0; i < data.TaxableListHeaderSave.deductibles.length; i++) {
              if (data.TaxableListHeaderSave.deductibles[i].distributionCalculationId == DistributionCost.subTotal) {
                if (data.TaxableListHeaderSave.deductibles[i].rate > 0) {
                  //this.subtotal = this.subtotal - (this.subtotal * (data.TaxableListHeaderSave.deductibles[i].rate / 100))
                  //sumatoria de deducible aplicados
                  subdedxtotal = subdedxtotal + (this.subtotal * (data.TaxableListHeaderSave.deductibles[i].rate / 100))
                } else {
                  //subdedxtotal = this.subtotal - data.TaxableListHeaderSave.deductibles[i].amount;
                  subdedxtotal = subdedxtotal + data.TaxableListHeaderSave.deductibles[i].amount;
                }
              }
            }
          }
          //Asignar nuevos valor en el subtotal
          this.subDeducibleTotal = subdedxtotal;
        }
        //Evento para ir al padre
        this.TotalTaxableDeductibleHeader.emit({ subtotal: this.subtotal, indtabtaxable: true, SubtotalTaxables: this.subTaxableTotal, SubtotalDeductibles: this.subDeducibleTotal });

      }
    }
  }
  //Imponibles y deducibles que aplican a todos los productos desde header
  receandSend(data) {
    //this._sendProductAll.emit(data);
    if (data.indtabtaxable == undefined) {
      data.indtabtaxable = false;
      this.ischange = true;
    }
    else
      data.indtabtaxable = false;
     
     //let selectedaux=this.PurchaseOrderProductSelect;
     this.selectedaux=[]
    // let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    // let costnet=this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.netCost: this._product.masterPrices.netCost;
    // let costdexNetBase = 0;
    // let costdexNetSales = 0;
    // let costdexnetconvertion = 0;
    // let costNetBase = 0;
    // let costNetSales = 0;
    // let costnetconvertion = 0;
    // let apllysalescost = false
    if (data._products != null) {
      //if (data.TaxableListSave.taxables != undefined) {
      for (let j = 0; j < data._products.length; j++) {
        this.product = this._purchaseOrderDetail.find(x => x.id == data._products[j].id);
        let costBase = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.baseCostNew : this.product.masterPrices.baseCostNew;
        let costnet = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.netCost : this.product.masterPrices.netCost;
        let costdexNetBase = 0;
        let costdexNetSales = 0;
        let costdexnetconvertion = 0;
        let costNetBase = 0;
        let costNetSales = 0;
        let costnetconvertion = 0;
        let apllysalescost = false
        this.isSave = false;
        let  item= this._purchaseOrderDetail.find(x => x.id == data._products[j].id);;
        let detailCopy = new PurchaseOrderProduct();
        if (item.idPackagingType == EnumPackingType.Master) {
        detailCopy.id=item.id;
        detailCopy.idOrderPurchase=item.idOrderPurchase;
        detailCopy.productId=item.productId
        detailCopy.masterPrices.packingNumbers = item.masterPrices.packingNumbers;
        detailCopy.masterPrices.baseCostNew = item.masterPrices.baseCostNew;
        detailCopy.masterPrices.convertionCost = item.masterPrices.convertionCost;
        detailCopy.masterPrices.netCost = item.masterPrices.netCost;
        detailCopy.masterPrices.netCostConversion = item.masterPrices.netCostConversion;
        detailCopy.masterPrices.salesNetCost = item.masterPrices.salesNetCost;
        detailCopy.masterPrices.pvpBaseNew = item.masterPrices.pvpBaseNew;
        detailCopy.masterPrices.pvpConversionNew = item.masterPrices.pvpConversionNew;
        detailCopy.masterPrices.indAdded = item.masterPrices.indAdded;
        detailCopy.masterPrices.taxableBase = item.masterPrices.taxableBase;
        detailCopy.masterPrices.deductibleBase = item.masterPrices.deductibleBase;
        }else {
        detailCopy.id=item.id;
        detailCopy.idOrderPurchase=item.idOrderPurchase;
        detailCopy.productId=item.productId
        detailCopy.individualPrices.packingNumbers = item.individualPrices.packingNumbers;
        detailCopy.individualPrices.baseCostNew = item.individualPrices.baseCostNew;
        detailCopy.individualPrices.convertionCost = item.individualPrices.convertionCost;
        detailCopy.individualPrices.netCost = item.individualPrices.netCost;
        detailCopy.individualPrices.netCostConversion = item.individualPrices.netCostConversion;
        detailCopy.individualPrices.salesNetCost = item.individualPrices.salesNetCost;
        detailCopy.individualPrices.pvpBaseNew = item.individualPrices.pvpBaseNew;
        detailCopy.individualPrices.pvpConversionNew = item.individualPrices.pvpConversionNew;
        detailCopy.individualPrices.indAdded = item.individualPrices.indAdded;
        detailCopy.individualPrices.taxableBase = item.individualPrices.taxableBase;
        detailCopy.individualPrices.deductibleBase = item.individualPrices.deductibleBase;
       }
       this.selectedaux.push(detailCopy);
        if (data._products[j].taxables.length > 0) {
          this.product.taxables = [];

          for (let i = 0; i < data._products[j].taxables.length; i++) {
            this.listtaxable = new PurchaseOrdertaxableDetail();
            this.listtaxable.id = data._products[j].taxables[i].id;
            this.listtaxable.idPurchaseOrder = data._products[j].taxables[i].idPurchaseOrder;
            this.listtaxable.idPurchaseOrderDetail = data._products[j].taxables[i].idPurchaseOrderDetail;
            this.listtaxable.taxableDeductibleBaseId = data._products[j].taxables[i].taxableDeductibleBaseId;
            this.listtaxable.idTaxableType = data._products[j].taxables[i].idTaxableType;
            this.listtaxable.taxableType = data._products[j].taxables[i].taxableType;
            this.listtaxable.idTaxable = data._products[j].taxables[i].idTaxable;
            this.listtaxable.taxableDeductible = data._products[j].taxables[i].taxableDeductible;
            this.listtaxable.idApply = data._products[j].taxables[i].idApply;
            this.listtaxable.applyCost = data._products[j].taxables[i].applyCost;
            this.listtaxable.distributionCalculationId = data._products[j].taxables[i].distributionCalculationId;
            this.listtaxable.distributionCalculation = data._products[j].taxables[i].distributionCalculation;
            this.listtaxable.idTaxType = data._products[j].taxables[i].idTaxType;
            this.listtaxable.idTax = data._products[j].taxables[i].idTax;
            this.listtaxable.taxableDeductibleBase = data._products[j].taxables[i].taxableDeductibleBase;
            this.listtaxable.indFixedTax = data._products[j].taxables[i].indFixedTax;
            this.listtaxable.indTaxable = data._products[j].taxables[i].indTaxable;
            this.listtaxable.indDeductible = data._products[j].taxables[i].indDeductible;
            this.listtaxable.indPurchaseTaxableDetail = data._products[j].taxables[i].indPurchaseTaxableDetail;
            this.listtaxable.indPurchaseTaxable = data._products[j].taxables[i].indPurchaseTaxable;
            this.listtaxable.indProductsAll = data._products[j].taxables[i].indProductsAll;
            this.listtaxable.indBaseNetSale = data._products[j].taxables[i].indBaseNetSale;
            this.listtaxable.indBaseNetCost = data._products[j].taxables[i].indBaseNetCost;
            this.listtaxable.rate = data._products[j].taxables[i].rate;
            this.listtaxable.amount = data._products[j].taxables[i].amount;
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
              apllysalescost = true;
            }

            this.product.taxables.push(this.listtaxable);

          }
          //Asignacion de nuevos costos

          //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });

        }
        // }
        if (data._products[j].deductibles != undefined) //deductible add-update
        {
          if (data._products[j].deductibles.length > 0) {
            this.product.deductibles = [];
            this.isSave = false;
            // this._product.deductibles = [];
            for (let i = 0; i < data._products[j].deductibles.length; i++) {
              this.listdeductible = new PurchaseOrderdeductibleDetail();
              this.listdeductible.id = data._products[j].deductibles[i].id;
              this.listdeductible.idPurchaseOrder = data._products[j].deductibles[i].idPurchaseOrder;
              this.listdeductible.idPurchaseOrderDetail = data._products[j].deductibles[i].idPurchaseOrderDetail;
              this.listdeductible.taxableDeductibleBaseId = data._products[j].deductibles[i].taxableDeductibleBaseId;
              this.listdeductible.idTaxableType = data._products[j].deductibles[i].idTaxableType;
              this.listdeductible.idTaxable = data._products[j].deductibles[i].idTaxable;
              this.listdeductible.taxableType = data._products[j].deductibles[i].taxableType;
              this.listdeductible.taxableDeductible = data._products[j].deductibles[i].taxableDeductible;
              this.listdeductible.idApply = data._products[j].deductibles[i].idApply;
              this.listdeductible.applyCost = data._products[j].deductibles[i].applyCost;
              this.listdeductible.distributionCalculationId = data._products[j].deductibles[i].distributionCalculationId;
              this.listdeductible.distributionCalculation = data._products[j].deductibles[i].distributionCalculation;
              this.listdeductible.idTaxType = data._products[j].deductibles[i].idTaxType;
              this.listdeductible.idTax = data._products[j].deductibles[i].idTax;
              this.listdeductible.taxableDeductibleBase = data._products[j].deductibles[i].taxableDeductibleBase;
              this.listdeductible.indFixedTax = data._products[j].deductibles[i].indFixedTax;
              this.listdeductible.indTaxable = data._products[j].deductibles[i].indTaxable;
              this.listdeductible.indDeductible = data._products[j].deductibles[i].indDeductible;
              this.listdeductible.indPurchaseTaxableDetail = data._products[j].indPurchaseTaxableDetail;
              this.listdeductible.indPurchaseTaxable = data._products[j].deductibles[i].indPurchaseTaxable;
              this.listdeductible.indProductsAll = data._products[j].deductibles[i].indProductsAll;
              this.listdeductible.indBaseNetSale = data._products[j].deductibles[i].indBaseNetSale;
              this.listdeductible.indBaseNetCost = data._products[j].deductibles[i].indBaseNetCost;
              this.listdeductible.rate = data._products[j].deductibles[i].rate;
              this.listdeductible.amount = data._products[j].deductibles[i].amount;

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
                apllysalescost = true;
              }
              this.product.deductibles.push(this.listdeductible);
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

        if (this.product.individualPrices.indAdded == 1) {

          this.product.individualPrices.netCost = (this.product.individualPrices.baseCostNew + costNetBase - costdexNetBase); //prueba sergio
          //this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales)
          this.product.individualPrices.salesNetCost = (this.product.individualPrices.netCost + costNetSales - costdexNetSales)
          this.product.individualPrices.taxableBase = 0;
          this.product.individualPrices.taxableConversion = 0;
          this.product.individualPrices.taxableBase = (this.product.individualPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
          this.product.individualPrices.taxableConversion = (this.product.individualPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
          this.product.individualPrices.deductibleBase = 0;
          this.product.individualPrices.deductibleConvertion = 0;
          this.product.individualPrices.deductibleBase = (this.product.individualPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
          this.product.individualPrices.deductibleConvertion = (this.product.individualPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;
        } else {
          this.product.masterPrices.netCost = (this.product.masterPrices.baseCostNew + costNetBase - costdexNetBase);
          //this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales);
          this.product.masterPrices.salesNetCost = (this.product.masterPrices.netCost + costNetSales - costdexNetSales);
          this.product.masterPrices.taxableBase = 0;
          this.product.masterPrices.taxableConversion = 0;
          this.product.masterPrices.taxableBase = (this.product.masterPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
          this.product.masterPrices.taxableConversion = (this.product.masterPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
          this.product.masterPrices.deductibleBase = 0;
          this.product.masterPrices.deductibleConvertion = 0;
          this.product.masterPrices.deductibleBase = (this.product.masterPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
          this.product.masterPrices.deductibleConvertion = (this.product.masterPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;

        }
        this._sendNewCost.emit({ product: this.product, indtabtaxable: data.indtabtaxable, ischange: this.ischange, applycostsales: apllysalescost, selecteds:  this.selectedaux  });
        //this.onChangeTaxablesDeductibles()
        this.isSaveChange.emit(this.isSave);
      } //fin del for 

    }

  }

  // Agregar imponibles y deducibles masivos a los productos
  CalculateTaxDedAll(data) {
    //ADD and update
    if (data.indtabtaxable == undefined) {
      data.indtabtaxable = false;
      //this.ischange = true;
    }
    else
      data.indtabtaxable = false;

    // let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
    // let costnet=this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.netCost: this._product.masterPrices.netCost;
    // let costdexNetBase = 0;
    // let costdexNetSales = 0;
    // let costdexnetconvertion = 0;
    // let costNetBase = 0;
    // let costNetSales = 0;
    // let costnetconvertion = 0;
    // let apllysalescost = false
    if (data._products != null) {
      this.PurchaseOrderProductSelect=[]; //Seteando la variable de products seleccionados
      //if (data.TaxableListSave.taxables != undefined) {
      for (let j = 0; j < data._products.length; j++) {
        this.product = this._purchaseOrderDetail.find(x => x.id == data._products.id);
        let costBase = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.baseCostNew : this.product.masterPrices.baseCostNew;
        let costnet = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.netCost : this.product.masterPrices.netCost;
        let costdexNetBase = 0;
        let costdexNetSales = 0;
        let costdexnetconvertion = 0;
        let costNetBase = 0;
        let costNetSales = 0;
        let costnetconvertion = 0;
        let apllysalescost = false
        this.isSave = false;
        if (data._products.taxables.length > 0) {
          //this._product.taxables = [];

          for (let i = 0; i < data._products.taxables.length; i++) {
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
            if (data._products.taxables[i] == ApplyCost.costNetBase) {
              if (this.listtaxable.rate > 0) {
                costNetBase = costNetBase + (costBase * (this.listtaxable.rate / 100))
                //costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              } else {
                costNetBase = costNetBase + this.listtaxable.amount;
                //costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
              }

            } else {
              if (this.listtaxable.rate > 0) {
                costNetSales = costNetSales + (costBase * (this.listtaxable.rate / 100))
              } else {
                costNetSales = costNetSales + this.listtaxable.amount
              }
              apllysalescost = true;
            }

            this.product.taxables.push(this.listtaxable);

          }
          //Asignacion de nuevos costos

          //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });

        }
        // }
        if (data.TaxableListSave.deductibles != undefined) //deductible add-update
        {
          if (data.TaxableListSave.deductibles.length > 0) {
            //this._product.deductibles = [];
            this.isSave = false;
            // this._product.deductibles = [];
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
                apllysalescost = true;
              }
              this.product.deductibles.push(this.listdeductible);
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

        if (this.product.individualPrices.indAdded == 1) {

          this.product.individualPrices.netCost = (this.product.individualPrices.baseCostNew + costNetBase - costdexNetBase); //prueba sergio
          //this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales)
          this.product.individualPrices.salesNetCost = (this.product.individualPrices.netCost+ costNetSales - costdexNetSales)
          this.product.individualPrices.taxableBase = 0;
          this.product.individualPrices.taxableConversion = 0;
          this.product.individualPrices.taxableBase = (this.product.individualPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
          this.product.individualPrices.taxableConversion = (this.product.individualPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
          this.product.individualPrices.deductibleBase = 0;
          this.product.individualPrices.deductibleConvertion = 0;
          this.product.individualPrices.deductibleBase = (this.product.individualPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
          this.product.individualPrices.deductibleConvertion = (this.product.individualPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;
        } else {
          this.product.masterPrices.netCost = (this.product.masterPrices.baseCostNew + costNetBase - costdexNetBase);
          //this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales);
          this.product.masterPrices.salesNetCost = (this.product.masterPrices.netCost + costNetSales - costdexNetSales);
          this.product.masterPrices.taxableBase = 0;
          this.product.masterPrices.taxableConversion = 0;
          this.product.masterPrices.taxableBase = (this.product.masterPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
          this.product.masterPrices.taxableConversion = (this.product.masterPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
          this.product.masterPrices.deductibleBase = 0;
          this.product.masterPrices.deductibleConvertion = 0;
          this.product.masterPrices.deductibleBase = (this.product.masterPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
          this.product.masterPrices.deductibleConvertion = (this.product.masterPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;

        }
        this._sendNewCost.emit({ product: this.product, indtabtaxable: data.indtabtaxable, ischange: true, applycostsales: apllysalescost, selecteds: this.selecteds });
        //this.onChangeTaxablesDeductibles()
        this.isSaveChange.emit(this.isSave);
      } //fin del for 

    }
  }

  // triggerFalseClick() {
  //   this.ActiveIndexTab = 0;
  //   this.activeIndex = 0;
  //   this.indmenuTab = this.menuTabOrder.totalresume;
  //   this.tabselected = false;
  //   this.showtaxable = false;
  //   this.showTabPrice = false;
  //   // let el: HTMLElement = this.btnTotalc.nativeElement;
  //   // el.click();
  // }

  updatSelecProducts(){
    //this.selectedproductDescheck.emit();
  }
   
 
}
