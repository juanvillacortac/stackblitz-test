import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { months } from 'moment';
import { MessageService, SelectItem } from 'primeng/api';
import { Operationdocument } from 'src/app/models/common/operationdocument';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { Coins } from 'src/app/models/masters/coin';
import { ContactFilter } from 'src/app/models/masters/contact-filter';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { Distributiontypes } from 'src/app/models/srm/common/distributiontypes';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { TypesDelivery } from 'src/app/models/srm/common/types-delivery';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrder } from 'src/app/models/srm/purchase-order';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { ExchangeRateTypeService } from 'src/app/modules/masters/exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesSupplierFilter } from 'src/app/modules/masters/exchange-rates-suppliers/filter/exchange-rates-supplier-filter';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { PaymentconditionService } from 'src/app/modules/masters/payment-conditions/shared/paymentcondition.service';
import { PaymentMethodService } from 'src/app/modules/masters/payment-method/shared/services/payment-method.service';
import { PortFilter } from 'src/app/modules/masters/port/shared/filters/port-filter';
import { PortService } from 'src/app/modules/masters/port/shared/services/port.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import { DistributiontypesFilter } from '../../shared/filters/common/distributiontypes-filter';
import { FormDeliveryFilter } from '../../shared/filters/common/form-delivery-filter';
import { TransportTypeFilter } from '../../shared/filters/common/transport-type-filter';
import { TypeNegotiationFilter } from '../../shared/filters/common/type-negotiation-filter';
import { TypesDeliveryFilter } from '../../shared/filters/common/types-delivery-filter';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { PurchaseOrderFilter } from '../../shared/filters/purchase-order-filter';
import { CommonsrmService } from '../../shared/services/common/commonsrm.service';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { StatusPurchase } from '../../shared/Utils/status-purchase';
import { OperatorModal } from '../../shared/view-models/common/operatormodal';
import { Suppliermodal } from '../../shared/view-models/common/suppliermodal';
import { Location } from '@angular/common';
import { PaymentCondition } from 'src/app/models/masters/payment-condition';
import { PaymentConditionFilter } from 'src/app/modules/masters/shared/filters/payment-condition-filter';
import { filter } from 'rxjs/operators';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { SuppliercatalogService } from '../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierFilter } from '../../shared/filters/supplier-filter';
import { SupplierempViewmodel } from '../../shared/view-models/suppliersemp-viewmodel';
import { PurchaseOrderUpdateStatus } from 'src/app/models/srm/purchase-order-status';
import { DistributedProduct } from 'src/app/models/srm/distributed-product';
import { TypeDistributionOc } from '../../shared/Utils/type-distribution-oc';
@Component({
  selector: 'app-purchase-header',
  templateUrl: './purchase-header.component.html',
  styleUrls: ['./purchase-header.component.scss']
})
export class PurchaseHeaderComponent implements OnInit {

  purchaseOrder: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Input("operator") operator: OperatorModal = new OperatorModal();
  @Input("operatormodal") operatormodal: OperatorModal = new OperatorModal();
  @Input("suppliermodal") suppliermodal: Suppliermodal = new Suppliermodal();
  @Input("contactmodal") contactmodal: ContactNumberSupplier = new ContactNumberSupplier();
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Output("PucharseOrderHeaderChange") PucharseOrderHeaderChange = new EventEmitter<Groupingpurchaseorders>();
  @Input("idPurchase") idPurchase: number;
  @Input("iduserlogin") iduserlogin: number = -1;
  @Output("iduserloginChange") iduserloginChange = new EventEmitter<number>();
  @Input("rateold")  rateold: number = 0;
  @Output("rateoldChange") rateoldChange = new EventEmitter<number>();
  typeDistribution: typeof TypeDistributionOc = TypeDistributionOc;
  isEditHeader: boolean = false;
  supplierRate: ExchangeRatesSupplier = new ExchangeRatesSupplier();
  // PucharseOrderHeader: PurchaseOrder= new PurchaseOrder();
  //#region combos
  baseC: number;
  conversionC: number;
  typeOClist: SelectItem[];
  statusOCList: SelectItem[];
  typeDeliveryList: SelectItem[];
  typeDistributionList: SelectItem[];
  waytopayList: SelectItem[];
  countryList: SelectItem[];
  portList: SelectItem[];
  portListDestin: SelectItem[];
  formDeliveryList: SelectItem[];
  transportTypeList: SelectItem[];
  exchangetypeList: SelectItem[] = [];
  exchangeRateList: SelectItem[] = [];
  currencyList: SelectItem[];
  currencyListmon: SelectItem[]; //vaidate seleccione tipo moneda antes que monedas
  typeNegotiationList: SelectItem[] = [];
  paymentConditionList: SelectItem[];
  coinsTypesList: SelectItem[];
  branchOfficeList: SelectItem[];
  formDeliveryTypeList: SelectItem[];
  exchangeRateSystemList: SelectItem[];
  paymentConditionsList = [] as PaymentCondition[];

  NoAplica: SelectItem =
    { label: "No aplica", value: 0 };
  //#endregion
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  OperatorDialogVisible = false;
  SupplierDialogVisible = false;
  AuthorizesDialogVisible = false;
  ContactDialogVisible = false;
  RateSupplierVisible = false;
  ContactsupplierFilters: ContactFilter = new ContactFilter();
  RatesupplierFilters: ExchangeRatesSupplierFilter = new ExchangeRatesSupplierFilter();
  Purchasefilter: PurchaseOrderFilter = new PurchaseOrderFilter();
  submitted: boolean;
  location;
  logueado: number = -1;
  indexratechange: boolean = false;
  dateexpired: Date = new Date;
  typeDiscountList: SelectItem[] = [];
  constructor(public _coinService: CoinsService,
    private messageService: MessageService,
    public _branchofficeService: BranchofficeService,
    private _commonService: CommonsrmService,
    private _paymentMethodService: PaymentMethodService,
    private _operationMaster: OperationMastersService,
    private _commonSRMService: CommonsrmService,
    private _countryservice: CountryService,
    public _portService: PortService,
    private _ExchangeRateTypeService: ExchangeRateTypeService,
    public _PaymentConditions: PaymentconditionService,
    public exchangeRatesService: ExchangeRatesService,
    public purchaseService: PurchaseorderService,
    private _httpClient: HttpClient,
    public paymentConditionService: PaymentconditionService,
    location: Location,
    private _discountType: DiscountRateService,
    public _SupplierService: SuppliercatalogService) { this.location = location; }

 

  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    const { fullName } = this._Authservice.storeUser;
    const { id } = this._Authservice.storeUser;
    const { idOffice } = this._Authservice.currentOffice;
    const { idCompany } = this._Authservice.currentCompany;
    this.logueado = id;
    if (this.idPurchase == 0) {
      this.operatormodal.namesoperators = fullName;
      this.operatormodal.idOpetator = id;
      //this.PucharseOrderHeader.purchase.responsibleId=id;
      this.operator.namesoperators = fullName;
      this.operator.idOpetator = id;
      this.logueado = -1;
    }
    this.GetTypeDocumentOC();
    this.GetTypeDistribution();
    this.onLoadCountry();
    if (this.idPurchase == 0) {
      //Venazuela cuando se tome de la sesion cambiar
      this.PucharseOrderHeader.purchase.idCountryRequest = 2;
      this.InitDates();
      this.PucharseOrderHeader.purchase.idDeliveryType = 2;//total
      //this.onLoadPortOrgin(-1);//pais vzla
      this.onLoadPortDestin(2, false);
    } else {
      this.onLoadPortOrgin(this.PucharseOrderHeader.idCountry, false);
      this.onLoadPortDestin(this.PucharseOrderHeader.purchase.idCountryRequest, false);
    }
    this.getFormDeliverys();
    this.getTransportType();
    this.GetCoinsTypes();
    this.getExchangeRateType();
    this.searchCoinsxCompany();

    this.GettypeNegotiation();
    this.searchBrancoffices();
    this.getConditionPayment();
    this.getFormTypeDeliverys();
    this.GetTypeDelivery(-1);
    //prelado
    if (this.idPurchase != 0) {
      this.GetWayTopay(-1, false);
      this.GetCoins(-1, false);
    }

    if (this.idPurchase == 0)
      this.searchTaxeCompany();

    if (this.idPurchase != 0) {
      this.search(this.idPurchase);

    }

    //this.getTransportType()
  }



  InitDates() {
    this.PucharseOrderHeader.purchase.createdDate = new Date();
    this.PucharseOrderHeader.purchase.expiredDate = new Date();
    this.PucharseOrderHeader.purchase.expiredDate.setMonth(this.PucharseOrderHeader.purchase.expiredDate.getMonth() + 1);
    this.PucharseOrderHeader.purchase.deliveryDate = new Date();
    this.PucharseOrderHeader.purchase.deliveryDate.setDate(this.PucharseOrderHeader.purchase.deliveryDate.getDate() + 5);
    this.PucharseOrderHeader.purchase.dispatchDate = new Date();
    this.PucharseOrderHeader.purchase.dispatchDate.setDate(this.PucharseOrderHeader.purchase.dispatchDate.getDate() + 5);
    //this.PucharseOrderHeader.purchase.deliverydeadline = new Date();
    this.dateexpired = this.PucharseOrderHeader.purchase.expiredDate;

  }
  //#region Carga inicial
  GetTypeDocumentOC() {
    var filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 2;//orden compra
    this._operationMaster.getDocumentsOperations(filter).subscribe((data: Operationdocument[]) => {
      this.typeOClist = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de OC" });
    });
  }

  changEdit() {
    this.isEditHeader = true;
  }
  changEditdate(event) {
    this.isEditHeader = true;
  }
  //Get typedistribution 
  GetTypeDistribution() {
    var filter = new DistributiontypesFilter();
    filter.id = -1;
    this._commonService.getDistributiontypes(filter).subscribe((data: Distributiontypes[]) => {
      this.typeDistributionList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de distribución" });
    });
  }


  GetTypeDelivery(id: number) {
    var filter = new TypesDeliveryFilter();
    filter.id = id;
    this._commonService.getTypesDelivery(filter).subscribe((data: TypesDelivery[]) => {
      this.typeDeliveryList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de distribución" });
    });
  }

  onLoadCountry() {
    var filter: CountryFilter = new CountryFilter();
    filter.idCountry = -1;
    this._countryservice.getCountriesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.countryList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));

      }, (error) => {
      });
  }

  onLoadPortOrgin(idCountry: number, isedit: boolean) {
    this.isEditHeader = isedit;
    var filter: PortFilter = new PortFilter();
    filter.IdCountry = idCountry;
    this._portService.getPortsList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.portList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
      });
  }
  onLoadPortDestin(idCountry: number, isedit: boolean) {
    this.isEditHeader = isedit;
    var filter: PortFilter = new PortFilter();
    filter.IdCountry = idCountry;
    this._portService.getPortsList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.portListDestin = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
      });
  }

  getFormDeliverys() {
    var filter: FormDeliveryFilter = new FormDeliveryFilter();
    filter.id = -1;
    filter.active = 1;
    this._commonService.getFormDelivery(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.formDeliveryList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
      });
  }

  getFormTypeDeliverys() {
    var filter: TypesDeliveryFilter = new TypesDeliveryFilter();
    filter.id = -1;
    filter.active = 1;
    this._commonService.getTypesDelivery(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.formDeliveryTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
      });
  }

  getTransportType() {
    var filter: TransportTypeFilter = new TransportTypeFilter();
    filter.id = -1;
    filter.active = 1;
    this._commonService.getTransportTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.transportTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
      });
  }
  getExchangeRateType() {
    this._ExchangeRateTypeService.getExchangeRateTypebyFilter()
      .subscribe((data) => {
        this.exchangetypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  //Obtener monedas
  GetCoins(idtypecoin: number, isedit: boolean) {
    this.isEditHeader = isedit;
    this._coinService.getCoinsList({
      id: -1,
      name: "",
      idtype: idtypecoin,
      abbreviation: "",
      active: 1,
    })
      .subscribe((data) => {
        this.currencyListmon = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  //Obtener Tipo de moneda 
  GetCoinsTypes() {
    this._coinService.getCoinTypesList({
      id: -1,
      name: ""
    })
      .subscribe((data) => {
        this.coinsTypesList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
  //Condiciones de pago 
  getConditionPayment() {
    this._PaymentConditions.getPaymentconditionbyFilter({
      idPaymentCondition: -1,
      name: "",
      amounterm: -1,
      idDiscountType: -1,
      active: 1,
    })
      .subscribe((data) => {
        this.paymentConditionList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.idPaymentCondition
        }));
        this.paymentConditionList.push(this.NoAplica);
      }, (error) => {
        console.log(error);
      });
  }

  //Get waytopay 
  GetWayTopay(idcoin: number, isedit: boolean) {
    this.isEditHeader = isedit;
    var filter = new PaymentMethodFilters();
    filter.id = -1;
    filter.active = 1;
    filter.currencyId = idcoin;
    this._paymentMethodService.getPaymentMethods(filter).subscribe((data: PaymentMethodResult[]) => {
      this.waytopayList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las formas de pago" });
    });
    //this.getExchangeRateType();
    //Se resetean los valores...
    this.PucharseOrderHeader.purchase.idRateTypeSupplier = -1;
    this.PucharseOrderHeader.purchase.idexchangeRateSupplier = -1;
    this.PucharseOrderHeader.purchase.exchangeRateSupplier = 0;
  }

  GettypeNegotiation() {
    var filter = new TypeNegotiationFilter();
    filter.id = -1;
    //filter.active=1;
    this._commonSRMService.gettypeNegotiation(filter).subscribe((data: TypeNegotiation[]) => {
      this.typeNegotiationList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la negociacion." });
    });
  }

  //Obtener sucursales 
  searchBrancoffices() {
    // const { idCompany } = this._Authservice.currentCompany;
    var filter = new BranchofficeFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this._branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
      this.branchOfficeList = data.map((item) => ({
        label: item.branchOfficeName,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las sucursales" });
    });
  }
  //#endregion cargainicial

  //#region modales
  onToggleOperator(visible: boolean) {
    this.OperatorDialogVisible = visible;
    this.isEditHeader = true;
  }

  onToggleSupplier(visible: boolean) {
    this.SupplierDialogVisible = visible;
    this.isEditHeader = true;
  }

  onToggleContact(visible: boolean) {
    this.ContactsupplierFilters.idSupplier = this.suppliermodal.idSupplierCom;
    this.ContactDialogVisible = visible;
    this.isEditHeader = true;
  }
  onToggleRate(visible: boolean) {

    this.RatesupplierFilters.idCurrency = this.PucharseOrderHeader.purchase.idCurrencySupplier;
    if (this.idPurchase != 0)
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;//this.PucharseOrderHeader.suppliers.idSupplierCom;
    // this.supplierRate.idCurrency= this.PucharseOrderHeader.purchase.idCurrencySupplier;
    else
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;
    this.RateSupplierVisible = visible;
    this.isEditHeader = true;
  }
  onToggleAuthorizes(visible: boolean) {
    this.AuthorizesDialogVisible = visible;
    this.isEditHeader = true;
  }
  Showrate() {
    this.RatesupplierFilters.idCurrency = this.PucharseOrderHeader.purchase.idCurrencySupplier;
    if (this.idPurchase != 0)
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;
    // this.supplierRate.idCurrency= this.PucharseOrderHeader.purchase.idCurrencySupplier;
    else
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;
    this.RateSupplierVisible = true;
    this.isEditHeader = true;
  }


  //#endregion modales

  //#region systemtax
  searchTaxeCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this._coinService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      this.currencyList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
        label: item.name,
        value: item.id
      }));
      var baseC: number;
      var conversionC: number;
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          baseC = coin.id;
        } else {
          conversionC = coin.id;
        }
      });
      this.PucharseOrderHeader.purchase.idRateType = 1;
      this.searchExchangeRatesSystem(baseC, conversionC);
      if (this.idPurchase == 0) {
        this.PucharseOrderHeader.purchase.idCurrency = baseC;
        this.PucharseOrderHeader.purchase.idCurrencyConversion = conversionC;
      }

    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la moneda de empresa" });
    });
  }


  searchExchangeRatesSystem(base: number, conversion: number) {
    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
    filter.idExchangeRateType = 1;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRateSystemList = data.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()).map((item) => ({
        label: item.conversionFactor.toString(),
        value: item.idExchangeRate
      }));
      if (this.idPurchase == 0)
      {
        this.PucharseOrderHeader.purchase.idexchangeRate = data[0].idExchangeRate;
        this.PucharseOrderHeader.purchase.exchangeRate = data[0].conversionFactor;
      } else {

        if (this.PucharseOrderHeader.purchase.exchangeRate != data[0].conversionFactor) {
          this.indexratechange = true;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existe una tasa de cambio actualizada." });
        }
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }

  //#endregion

  //#region  moneda
  ChangeTax() {
    // let tt = this.exchangeRateList.find(x => x.value == this.PucharseOrderHeader.purchase.idexchangeRateSupplier).label;
    this.PucharseOrderHeader.purchase.exchangeRateSupplier = parseFloat(this.exchangeRateList.find(x => x.value == this.PucharseOrderHeader.purchase.idexchangeRateSupplier).label);
    this.isEditHeader = true;
  }

  onAssigRateSupplier() {
    this.PucharseOrderHeader.purchase.exchangeRateSupplier = this.supplierRate.exchangeRate;
  }
  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this._coinService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      this.currencyList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
        label: item.name,
        value: item.id
      }));

      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          // this.basesymbolcoin = coin.symbology;
          // this.baseCoin = coin.name + " " + coin.symbology;
          this.baseC = coin.id;
        } else {
          //this.conversionCoin = coin.name + " " + coin.symbology;
          this.conversionC = coin.id;
        }
      });
      //this.searchExchangeRates(this.baseC, this.conversionC, 1);
      this.PucharseOrderHeader.purchase.idCurrency = this.conversionC;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la moneda de empresa" });
    });
  }

  searchExchangeRates(base: number, conversion: number, idexrate: number, indsetear: boolean, isedit: boolean) {

    this.isEditHeader = isedit;
    if (indsetear) {
      this.PucharseOrderHeader.purchase.idexchangeRateSupplier = -1;
      this.PucharseOrderHeader.purchase.exchangeRateSupplier = 0;
      this.supplierRate.exchangeRate = 0
    }

    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
    filter.idExchangeRateType = idexrate;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      //let value :ExchangeRates[]=[]
      //value.push(data[0])
      //this.exchangeRateList=value.map((item) => ({
      this.exchangeRateList = data.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()).map((item) => ({
        label: item.conversionFactor.toString(),
        value: item.idExchangeRate
      }));

      // this.isEditHeader=true;

    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }
  //#endregion
  ChangeTypeDistribution() {
    let indPartial;
    if (this.PucharseOrderHeader.idTypeDistribution == 1) {
      indPartial = -1
    } else {
      indPartial = 2;
    }
    this.GetTypeDelivery(indPartial);
    this.isEditHeader = true;
  }

  //#region Save
  Save() {
    this.submitted = true;
    //this._Authservice.currentOffice;
    if (this.PucharseOrderHeader.purchase.idDocumentOC > 0 && this.PucharseOrderHeader.idTypeDistribution > 0 &&
      this.suppliermodal.document != "" && this.PucharseOrderHeader.purchase.idDocumentOC > 0 && this.PucharseOrderHeader.idTypeDistribution > 0
      && this.PucharseOrderHeader.purchase.exchangeRateSupplier > 0 && this.PucharseOrderHeader.purchase.idBranchRequest > 0) {
      // if(this.PucharseOrderHeader.purchase.idRateTypeSupplier==1  && this.PucharseOrderHeader.purchase.idexchangeRateSupplier >0)
      if (this.PucharseOrderHeader.purchase.indAproved) {
        this.PucharseOrderHeader.purchase.idStatus = this.statuspurchase.PendingForReview;
      }
      if (this.PucharseOrderHeader.purchase.idStatus == -1) {
        this.PucharseOrderHeader.purchase.idStatus = this.statuspurchase.Eraser;
      }
      if (this.PucharseOrderHeader.purchase.idOrderPurchase == -1 || this.PucharseOrderHeader.purchase.idOrderPurchase > 0) {
        // this.PucharseOrderHeader.purchase.responsibleId = this.operatormodal.idOpetator; // Por ahora se toma el de la seccion.
        this.PucharseOrderHeader.purchase.approvedbyId = this.operator.idOpetator; //usuario autoriza
        this.PucharseOrderHeader.suppliers.id = this.suppliermodal.id;
        this.PucharseOrderHeader.suppliers.idContact = this.contactmodal.idContactNumber;
        this.PucharseOrderHeader.idBranchOrigin = this._Authservice.currentOffice;

      }
      if (this.operator.idOpetator != undefined) {
        this.PucharseOrderHeader.purchase.approvedbyId = this.operator.idOpetator; //usuario autoriza
      }
      // if(this.PucharseOrderHeader.purchase.deliverydeadline==null)
      //     this.PucharseOrderHeader.purchase.deliverydeadline= new Date('0001-01-01');
      this.PucharseOrderHeader.purchase.idTypeDocumentOC = 2;
      this.iduserlogin = this.PucharseOrderHeader.purchase.responsibleId;
      this.purchaseService.postPurchase(this.PucharseOrderHeader).subscribe((data: number) => {
        if (data > 0) {
          this.idPurchase = data;
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.submitted = false;
          const link: any[] = ['srm/purchase-order', data.toString()];
          this.location.go(link[0] + '/' + link[1]);
          this.ngOnInit();
          this.submitted = false;
          this.isEditHeader = false;
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Ha ocurrido un error al guardar la orden de compra.." });
          this.submitted = false;
        } else if (data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Ha ocurrido un error al guardar la orden de compra." });
          this.submitted = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la orden de compra." });
          this.submitted = false;
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la orden de compra." });
        this.submitted = false;
      });
    }
    // this.submitted = false;
  }

  search(id: number) {
    this.Purchasefilter.idOrderPurchase = id;
    this.purchaseService.getPurchase(this.Purchasefilter).subscribe((data: Groupingpurchaseorders) => {
      //this.PucharseOrderHeader = new Groupingpurchaseorders();
      if (data != null) {
        //this.InitDatesUpdate();
        this.PucharseOrderHeader = data;
        this.rateold=this.PucharseOrderHeader.purchase.idexchangeRateSupplier;
        this.InitDatesUpdate();
        this.PucharseOrderHeaderChange.emit(this.PucharseOrderHeader);
        this.suppliermodal.socialReason = this.PucharseOrderHeader.suppliers.socialReason;
        this.suppliermodal.document = this.PucharseOrderHeader.suppliers.document;
        this.suppliermodal.id = this.PucharseOrderHeader.suppliers.id;
        this.suppliermodal.direction = this.PucharseOrderHeader.suppliers.direction;
        this.suppliermodal.idSupplierCom = this.PucharseOrderHeader.suppliers.idSupplierCom;
        this.contactmodal.contact = this.PucharseOrderHeader.suppliers.contact;
        this.contactmodal.number = this.PucharseOrderHeader.suppliers.phone;
        this.operatormodal.namesoperators = this.PucharseOrderHeader.purchase.responsible;
        this.operatormodal.idOpetator = this.PucharseOrderHeader.purchase.responsibleId;
        // this.supplierRate.idSupplierCompany=this.PucharseOrderHeader.suppliers.idSupplierCom;
        // this.supplierRate.idCurrency= this.PucharseOrderHeader.purchase.idCurrencySupplier;
        //Authorize
        this.operator.namesoperators = this.PucharseOrderHeader.purchase.approvedby;
        this.operator.idOpetator = this.PucharseOrderHeader.purchase.approvedbyId;
        this.searchTaxeCompany();
        this.GetTypeDiscount();
        //asignar la tasa provvedor
        if (this.PucharseOrderHeader.purchase.idRateTypeSupplier == 3)//personalizado
          this.supplierRate.exchangeRate = this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.iduserloginChange.emit(this.logueado);
        this.rateoldChange.emit(this.rateold);

        // this.PucharseOrderHeader.purchase.idexchangeRateSupplier=data.purchase.idexchangeRateSupplier;
        // this.PucharseOrderHeader.purchase.exchangeRateSupplier=data.purchase.exchangeRateSupplier;
        this.searchExchangeRates(-1, -1, this.PucharseOrderHeader.purchase.idRateTypeSupplier, false, false)
        // PREGUNTAR  this.searchExchangeRates(this.PucharseOrderHeader.purchase.idCurrency, this.PucharseOrderHeader.purchase.idCurrencySupplier, this.PucharseOrderHeader.purchase.idRateTypeSupplier)
        this.isEditHeader = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la orden." });
      }


    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la orden." });
    });
  }

  changeStatus(status: number, data) {
    var statusBack = this.PucharseOrderHeader.purchase.idStatus;
    this.submitted = true;
    this.PucharseOrderHeader.purchase.idStatus = status;
    const purchaseOrder = this.getPurchaseOrderStatusProperties();
    if (data != undefined) {
      purchaseOrder.motiveId = this.PucharseOrderHeader.purchase.idReason;
      purchaseOrder.observation = this.PucharseOrderHeader.purchase.description;
    }
    this.purchaseService.UpdatePurchase(purchaseOrder).subscribe((data: number) => {
      if (data > 0) {
        this.isEditHeader = false;
        this.idPurchase = data;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Actualización exitosa" });
        this.submitted = false;
        const link: any[] = ['/srm/purchase-order', data.toString()];
        this.location.go(link[0] + '/' + link[1]);
        this.ngOnInit();
      }
    }, (error: HttpErrorResponse) => {
      this.PucharseOrderHeader.purchase.idStatus = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });
  }

  private getPurchaseOrderStatusProperties() {
    const obj = new PurchaseOrderUpdateStatus();
    obj.purchaseOrderId = this.PucharseOrderHeader.purchase.idOrderPurchase;
    obj.statusId = this.PucharseOrderHeader.purchase.idStatus;
    obj.motiveId = -1;
    obj.observation = '';
    return obj;
  }
  //#endregion

  evaluarDate(idDeliveryType: number) {
    if (this.PucharseOrderHeader.purchase.idDeliveryType == 1) {
      this.PucharseOrderHeader.purchase.deliverydeadline = new Date();
      this.PucharseOrderHeader.purchase.deliverydeadline = this.PucharseOrderHeader.purchase.deliveryDate;
    } else {
      this.PucharseOrderHeader.purchase.deliverydeadline = null;
    }
    this.isEditHeader = true;
  }

  //Obtener condiciones de pago 

  searchPaymentCondition(idPayment: number, isedit: boolean) {
    this.isEditHeader = isedit;
    var filters: PaymentConditionFilter = new PaymentConditionFilter();
    filters.active = 1;
    filters.idPaymentCondition = idPayment
    this.paymentConditionService.getPaymentconditionbyFilter(filters).subscribe((data: PaymentCondition[]) => {
      this.paymentConditionsList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
      this.paymentConditionsList = data;
      //this.isEditHeader=true;
      //this.paymentConditionList.push();
      if (data.length > 0) {
        this.PucharseOrderHeader.purchase.paymentsConditions.discount = data[0].discount;
        this.PucharseOrderHeader.purchase.paymentsConditions.amounterm = data[0].amounterm;
        this.PucharseOrderHeader.purchase.paymentsConditions.idDiscountType = data[0].idDiscountType;
        this.GetTypeDiscount();
      } else {
        this.PucharseOrderHeader.purchase.paymentsConditions.discount = 0;
        this.PucharseOrderHeader.purchase.paymentsConditions.amounterm = 0;
        this.PucharseOrderHeader.purchase.paymentsConditions.idPaymentCondition = 0;
        this.PucharseOrderHeader.purchase.paymentsConditions.idDiscountType = -1;
      }
      //this.loading = false;
    }, (error: HttpErrorResponse) => {
      //this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  ChangerateBaseCal() {
    //let tt = this.exchangeRateSystemList.find(x => x.value == this.PucharseOrderHeader.purchase.idexchangeRate).label;
    this.PucharseOrderHeader.purchase.exchangeRate = parseFloat(this.exchangeRateSystemList.find(x => x.value == this.PucharseOrderHeader.purchase.idexchangeRate).label);
    this.isEditHeader = true;

  }

  InitDatesUpdate() {
    this.PucharseOrderHeader.purchase.createdDate = new Date(this.PucharseOrderHeader.purchase.createdDate);
    this.PucharseOrderHeader.purchase.expiredDate = new Date(this.PucharseOrderHeader.purchase.expiredDate);
    this.PucharseOrderHeader.purchase.deliveryDate = new Date(this.PucharseOrderHeader.purchase.deliveryDate);
    this.PucharseOrderHeader.purchase.dispatchDate = new Date(this.PucharseOrderHeader.purchase.dispatchDate);
    var datetemp = "0001-01-01T00:00:00";
    if (this.PucharseOrderHeader.purchase.deliverydeadline.toString() != datetemp.toString()) {
      this.PucharseOrderHeader.purchase.deliverydeadline = new Date(this.PucharseOrderHeader.purchase.deliverydeadline);
    }
    //this.dateexpired= new Date;
    this.dateexpired.setMonth(this.PucharseOrderHeader.purchase.createdDate.getMonth() + 1);
    // this.PucharseOrderHeader.purchase.expiredDate
    // this.PucharseOrderHeader.purchase.expiredDate.setMonth(this.PucharseOrderHeader.purchase.expiredDate.getMonth() + 1); 
    // this.PucharseOrderHeader.purchase.deliveryDate = new Date();
    // //this.PucharseOrderHeader.purchase.deliveryDate.setDate(this.PucharseOrderHeader.purchase.deliveryDate.getDate() + 5);
    // this.PucharseOrderHeader.purchase.dispatchDate = new Date();
    //this.PucharseOrderHeader.purchase.dispatchDate.setDate(this.PucharseOrderHeader.purchase.dispatchDate.getDate() + 5);

  }

  changesupplier() {
    this.isEditHeader = true;
    if (this.suppliermodal.id != this.PucharseOrderHeader.suppliers.id) {
      this.contactmodal.id = -1;
      this.contactmodal.contact = "";
      this.contactmodal.number = "";
    }
    if (this.suppliermodal.idPaymentCondition > 0) {
      this.PucharseOrderHeader.purchase.paymentsConditions.idPaymentCondition = this.suppliermodal.idPaymentCondition
      this.searchPaymentCondition(this.PucharseOrderHeader.purchase.paymentsConditions.idPaymentCondition, true)
    } else {
      this.PucharseOrderHeader.purchase.paymentsConditions.idPaymentCondition = -1
      this.searchPaymentCondition(-1, true)
    }

    // debugger
    // if(!this.suppliermodal.indconsignment){
    //   this.typeNegotiationList=this.typeNegotiationList.filter(x=>x.value!=4);
    // }else{
    //   this.GettypeNegotiation();
    // }

  }

  onChangeTypeNegotiation() {
    this.isEditHeader = true;
    if (this.PucharseOrderHeader.purchase.idTypeNegotiation == 4) { //consginacion
      var supplierFilters = new SupplierFilter();
      supplierFilters.idCom = this._Authservice.currentCompany;
      supplierFilters.active = 1;
      supplierFilters.id = this.suppliermodal.id; //this.PucharseOrderHeader.suppliers.id
      this._SupplierService.getSupplierListclass(supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
        this.suppliermodal.indconsignment = data[0].indconsignment;
        if (!this.suppliermodal.indconsignment) {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "En la ficha proveedor no permite consignación." });
        }
        // this.loading = false;
      }, (error: HttpErrorResponse) => {
        //this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
      });


    }
  }

  GetTypeDiscount() {
    var filter = new DiscountRate()
    filter.id = -1;
    this._discountType.getDiscountRateList(filter).subscribe((data: DiscountRate[]) => {
      this.typeDiscountList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de descuentos." });
    });
  }
  //new observation

  loadSuppliers() {

    // const { idCompany } = this._Authservice.currentCompany;
    var supplierFilters = new SupplierFilter();
    supplierFilters.idCom = this._Authservice.currentCompany;
    supplierFilters.active = 1;
    supplierFilters.id = this.PucharseOrderHeader.suppliers.id
    this._SupplierService.getSupplierListclass(supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
      this.suppliermodal.indconsignment = data[0].indconsignment;
      // this.loading = false;
    }, (error: HttpErrorResponse) => {
      //this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }


  RemoveDistributedProductFromHeader()
  {

    var purchaseList : DistributedProduct[] = [];
    var purchaseOrderIdGroup = new DistributedProduct();
       purchaseOrderIdGroup.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
       purchaseList.push(purchaseOrderIdGroup);
       this.purchaseService.RemoveDistributedProducts(purchaseList,true).subscribe((data: number) => {
        if (data == 0) {
        this.Save();
        this.messageService.add({severity:'success', summary: 'Exito', detail: 'Productos eliminados con éxito', life: 3000});
      }
    }, (error: HttpErrorResponse) => {
      //this.PucharseOrderHeader.purchase.idStatus = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });
  }
}

