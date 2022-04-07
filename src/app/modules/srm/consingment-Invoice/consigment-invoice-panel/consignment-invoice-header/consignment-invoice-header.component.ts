import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ContactFilter } from 'src/app/models/masters/contact-filter';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { PaymentCondition } from 'src/app/models/masters/payment-condition';
import { PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { ConsingmentInvoice, ConsingmentInvoiceFilters, InvoiceUpdateStatus } from 'src/app/models/srm/consingmentinvoice/consingmentinvoices';
import { InvoiceStatus } from 'src/app/models/srm/reception';
import { PaymentMethodService } from 'src/app/modules/masters/payment-method/shared/services/payment-method.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { ExchangeRateTypeService } from 'src/app/modules/masters/exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesSupplierFilter } from 'src/app/modules/masters/exchange-rates-suppliers/filter/exchange-rates-supplier-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { PaymentconditionService } from 'src/app/modules/masters/payment-conditions/shared/paymentcondition.service';
import { PortService } from 'src/app/modules/masters/port/shared/services/port.service';
import { PaymentConditionFilter } from 'src/app/modules/masters/shared/filters/payment-condition-filter';
import { SupplierFilter } from '../../../shared/filters/supplier-filter';
import { CommonsrmService } from '../../../shared/services/common/commonsrm.service';
import { ConsigmentinvoiceService } from '../../../shared/services/consignmnet-invoice/consigmentinvoice.service';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { OperatorModal } from '../../../shared/view-models/common/operatormodal';
import { Suppliermodal } from '../../../shared/view-models/common/suppliermodal';
import { SupplierempViewmodel } from '../../../shared/view-models/suppliersemp-viewmodel';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { TypeNegotiationFilter } from '../../../shared/filters/common/type-negotiation-filter';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { Location } from '@angular/common';
import { ConsingmentInvoiceFilter } from '../../../shared/filters/consigment-invoice/consigmentinvoicefilter';


@Component({
  selector: 'app-consignment-invoice-header',
  templateUrl: './consignment-invoice-header.component.html',
  styleUrls: ['./consignment-invoice-header.component.scss']
})
export class ConsignmentInvoiceHeaderComponent implements OnInit {

  isEditHeader: boolean = false;
  @Input("id") id: number;
  @Input("iduserlogin") iduserlogin: number = -1;
  @Input("invoiceHeader") invoiceHeader: ConsingmentInvoice = new ConsingmentInvoice();
  @Input("rateold")  rateold: number = 0;
  @Input("operator") operator: OperatorModal = new OperatorModal();
  @Input("operatormodal") operatormodal: OperatorModal = new OperatorModal();
  @Input("suppliermodal") suppliermodal: Suppliermodal = new Suppliermodal();
  @Input("contactmodal") contactmodal: ContactNumberSupplier = new ContactNumberSupplier();
  @Output("invoiceHeaderChange") invoiceHeaderChange = new EventEmitter<ConsingmentInvoice>();
  @Output("iduserloginChange") iduserloginChange = new EventEmitter<number>();
  @Output("rateoldChange") rateoldChange = new EventEmitter<number>();
  indexratechange: boolean = false;
  dateexpired: Date = new Date;
  submitted: boolean;
  baseC: number;
  conversionC: number;
  typeFClist: SelectItem[];
  paymentConditionList: SelectItem[];
  typeDiscountList: SelectItem[] = [];
  currencyList: SelectItem[];
  currencyListmon: SelectItem[]; //vaidate seleccione tipo moneda antes que monedas
  typeNegotiationList: SelectItem[] = [];
  coinsTypesList: SelectItem[];
  branchOfficeList: SelectItem[];
  formDeliveryTypeList: SelectItem[];
  exchangeRateSystemList: SelectItem[];
  exchangetypeList: SelectItem[] = [];
  waytopayList: SelectItem[];
  exchangeRateList: SelectItem[] = [];
  ContactsupplierFilters: ContactFilter = new ContactFilter();
  RatesupplierFilters: ExchangeRatesSupplierFilter = new ExchangeRatesSupplierFilter();
  status: typeof InvoiceStatus = InvoiceStatus;
  supplierRate: ExchangeRatesSupplier = new ExchangeRatesSupplier();
  paymentConditionsList = [] as PaymentCondition[];
  OperatorDialogVisible = false;
  SupplierDialogVisible = false;
  AuthorizesDialogVisible = false;
  ContactDialogVisible = false;
  RateSupplierVisible = false;
  location;
  logueado: number = -1;
  basecalculate:boolean=true
  NoAplica: SelectItem =
  { label: "No aplica", value: 0 };
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
    public service:ConsigmentinvoiceService ,
    private _httpClient: HttpClient,
    location: Location,
    private _discountType: DiscountRateService,
    public _SupplierService: SuppliercatalogService) { this.location = location;}
    _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    const { fullName } = this._Authservice.storeUser;
    const { idloguer } = this._Authservice.idUser;
    this.logueado = idloguer;
    this.GetTypeDocumentFC();
    this.GetCoinsTypes();
    this.getExchangeRateType();
    this.searchCoinsxCompany();
    this.GettypeNegotiation();
    this.getConditionPayment();
    //prelado
    if (this.id != 0) {
      this.GetWayTopay(-1, false);
      this.GetCoins(-1, false);
    }

    if (this.id != 0) {
      this.search(this.id);

    }
  }
  Save() {
    this.submitted = true;
    //this._Authservice.currentOffice;
    if (this.invoiceHeader.paymentNegotiation.currencyTypeId > 0 && this.invoiceHeader.paymentNegotiation.paymentCurrencyId > 0 &&
      this.suppliermodal.document != "" && this.invoiceHeader.paymentNegotiation.paymentMethod > 0 && this.invoiceHeader.paymentNegotiation.paymentRateTypeId > 0
      && this.invoiceHeader.paymentNegotiation.exchangeRateId > 0) {
      if (this.invoiceHeader.idStatus == -1) {
        this.invoiceHeader.idStatus = this.status.pending;
      }
      if (this.invoiceHeader.id== -1 || this.invoiceHeader.id > 0) {
        this.invoiceHeader.idValidationOperator= this.operator.idOpetator; //usuario autoriza
        this.invoiceHeader.supplier.id = this.suppliermodal.id;
        this.invoiceHeader.supplier.idContact = this.contactmodal.idContactNumber;
        this.invoiceHeader.branchOfficeId = this._Authservice.currentOffice;
      }
      if (this.operator.idOpetator != undefined) {
        this.invoiceHeader.idValidationOperator = this.operator.idOpetator; //usuario autoriza
      }
      if (this.invoiceHeader.indAproved) {
        this.invoiceHeader.idStatus = this.status.PendingForReview;
      }
      debugger
      this.iduserlogin = this.invoiceHeader.idResponsibleOperator;
      if(this.invoiceHeader.idStatus==this.status.pending){
        this.invoiceHeader.startDate = new Date('1900-01-01T00:00:00')
         this.invoiceHeader.finalizeDate= new Date('1900-01-01T00:00:00');
         this.invoiceHeader.authorizeDate= new Date('1900-01-01T00:00:00');}
       else{this.invoiceHeader.startDate = new Date(this.invoiceHeader.startDate);
         this.invoiceHeader.finalizeDate= new Date(this.invoiceHeader.finalizeDate);
         this.invoiceHeader.authorizeDate= new Date(this.invoiceHeader.authorizeDate);} 
      this.service.createInvoice(this.invoiceHeader).subscribe((data: number) => {
        if (data > 0) {
          this.id = data;
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          if(this.invoiceHeader.indAproved){
             this.changeStatus(this.status.PendingForReview,undefined)
          }
          this.submitted = false;
          const link: any[] = ['/srm/consingment-invoice', data.toString()];
          this.location.go(link[0] + '/' + link[1]);
          this.ngOnInit();
          this.submitted = false;
          this.isEditHeader = false;
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la factura." });
          this.submitted = false;
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la factura." });
        this.submitted = false;
      });
    }

  }
  changEdit() {
    this.isEditHeader = true;
  }

  changEditcalculation(e){
    this.basecalculate=e.value
    this.invoiceHeader.calculationBasis.currencyBaseCalculate=this.basecalculate
    this.isEditHeader = true;
  }
  changEditdate(event) {
    this.isEditHeader = true;
  }
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

    this.RatesupplierFilters.idCurrency = this.invoiceHeader.paymentNegotiation.exchangeRateId;
    if (this.id != 0)
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
    this.RatesupplierFilters.idCurrency = this.invoiceHeader.paymentNegotiation.exchangeRateId;
    if (this.id!= 0)
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;
    // this.supplierRate.idCurrency= this.PucharseOrderHeader.purchase.idCurrencySupplier;
    else
      this.RatesupplierFilters.idClientSupplierCom = this.suppliermodal.idSupplierCom;
    this.RateSupplierVisible = true;
    this.isEditHeader = true;
  }

  onAssigRateSupplier() {
    this.invoiceHeader.paymentNegotiation.exchangeRateValue = this.supplierRate.exchangeRate;
  }
  changesupplier() {
    this.isEditHeader = true;
    if (this.suppliermodal.id != this.invoiceHeader.supplier.id) {
      this.contactmodal.id = -1;
      this.contactmodal.contact = "";
      this.contactmodal.number = "";
    }
    if (this.suppliermodal.idPaymentCondition > 0) {
      this.invoiceHeader.paymentNegotiation.paymentConditionId = this.suppliermodal.idPaymentCondition
      this.searchPaymentCondition(this.invoiceHeader.paymentNegotiation.paymentConditionId, true)
    } else {
      this.invoiceHeader.paymentNegotiation.paymentConditionId = -1
      this.searchPaymentCondition(-1, true)
    }
  }
  //#endregion modales

    //Obtener condiciones de pago 

    searchPaymentCondition(idPayment: number, isedit: boolean) {
      this.isEditHeader = isedit;
      var filters: PaymentConditionFilter = new PaymentConditionFilter();
      filters.active = 1;
      filters.idPaymentCondition = idPayment
      this._PaymentConditions.getPaymentconditionbyFilter(filters).subscribe((data: PaymentCondition[]) => {
        this.paymentConditionsList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        this.paymentConditionsList = data;
        if (data.length > 0) {
          this.invoiceHeader.paymentNegotiation.discount = data[0].discount;
          this.invoiceHeader.paymentNegotiation.paymentDeadlinesDays = data[0].amounterm;
          this.invoiceHeader.paymentNegotiation.idDiscountType = data[0].idDiscountType;
          this.GetTypeDiscount();
        } else {
          this.invoiceHeader.paymentNegotiation.discount = 0;
          this.invoiceHeader.paymentNegotiation.paymentDeadlinesDays = 0;
          this.invoiceHeader.paymentNegotiation.paymentConditionId = 0;
          this.invoiceHeader.paymentNegotiation.idDiscountType = -1;
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
      });
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
    onChangeTypeNegotiation() {
      this.isEditHeader = true;
      if (this.invoiceHeader.paymentNegotiation.negotiationTypeId == 4) { //consginacion
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
    this.invoiceHeader.paymentNegotiation.paymentRateTypeId = -1;
    this.invoiceHeader.paymentNegotiation.exchangeRateId = -1;
    this.invoiceHeader.paymentNegotiation.exchangeRateValue= 0;
  }

  searchExchangeRates(base: number, conversion: number, idexrate: number, indsetear: boolean, isedit: boolean) {

    this.isEditHeader = isedit;
    if (indsetear) {
      this.invoiceHeader.paymentNegotiation.exchangeRateId= -1;
      this.invoiceHeader.paymentNegotiation.exchangeRateValue = 0;
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
  InitDatesUpdate() {
    this.invoiceHeader.dateCreate = new Date(this.invoiceHeader.dateCreate);
    if(this.invoiceHeader.idStatus==this.status.pending){
     this.invoiceHeader.startDate = null
      this.invoiceHeader.finalizeDate= null;
      this.invoiceHeader.authorizeDate= null;}
    else{this.invoiceHeader.startDate = new Date(this.invoiceHeader.startDate);
      this.invoiceHeader.finalizeDate= new Date(this.invoiceHeader.finalizeDate);
      this.invoiceHeader.authorizeDate= new Date(this.invoiceHeader.authorizeDate);}  
    
    var datetemp = "0001-01-01T00:00:00";
    this.dateexpired.setMonth(this.invoiceHeader.dateCreate.getMonth() + 1);
  }

  search(id:number){
    let filter =new ConsingmentInvoiceFilters()
    filter.id = id;
    this.service.getinvoice(filter).subscribe((data: ConsingmentInvoice) => {
      if (data != null) {
        //this.InitDatesUpdate();
        this.invoiceHeader = data;
        this.basecalculate=this.invoiceHeader.calculationBasis.currencyBaseCalculate
        this.rateold=this.invoiceHeader.paymentNegotiation.exchangeRateId;
        this.InitDatesUpdate();
        this.invoiceHeaderChange.emit(this.invoiceHeader);
        this.suppliermodal.socialReason = this.invoiceHeader.supplier.socialReason;
        this.suppliermodal.document = this.invoiceHeader.supplier.document;
        this.suppliermodal.id = this.invoiceHeader.supplier.id;
        this.suppliermodal.direction = this.invoiceHeader.supplier.direction;
        this.suppliermodal.idSupplierCom = this.invoiceHeader.supplier.idSupplierCom;
        this.contactmodal.contact = this.invoiceHeader.supplier.contact;
        this.contactmodal.number = this.invoiceHeader.supplier.phone;
        this.operatormodal.namesoperators = this.invoiceHeader.responsibleOperator;
        this.operatormodal.idOpetator = this.invoiceHeader.idResponsibleOperator;
        //Authorize
        this.operator.namesoperators = this.invoiceHeader.validationOperator;
        this.operator.idOpetator = this.invoiceHeader.idValidationOperator;
        this.searchTaxeCompany();
        this.GetTypeDiscount();
        //asignar la tasa provvedor
        if (this.invoiceHeader.paymentNegotiation.paymentRateTypeId == 3)//personalizado
          this.supplierRate.exchangeRate = this.invoiceHeader.paymentNegotiation.exchangeRateValue;
        ///this.iduserloginChange.emit(this.logueado);
        //this.rateoldChange.emit(this.rateold);
        this.searchExchangeRates(-1, -1, this.invoiceHeader.paymentNegotiation.paymentRateTypeId, false, false) 
        this.isEditHeader = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la orden." });
      }


    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la orden." });
    });

  }

  GetTypeDocumentFC() {
    var filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 21;//orden compra
    this._operationMaster.getDocumentsOperations(filter).subscribe((data: Operationdocument[]) => {
      this.typeFClist = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de OC" });
    });
  }
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
      }, (error) => {
        console.log(error);
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
          this.baseC = coin.id;
        } else {

          this.conversionC = coin.id;
        }
      });
      //this.PucharseOrderHeader.purchase.idCurrency = this.conversionC;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la moneda de empresa" });
    });
  }
  GettypeNegotiation() {
    var filter = new TypeNegotiationFilter();
    filter.id = -1;
    this._commonSRMService.gettypeNegotiation(filter).subscribe((data: TypeNegotiation[]) => {
      this.typeNegotiationList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la negociacion." });
    });
  }
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
      this.invoiceHeader.paymentNegotiation.paymentRateTypeId = 1;
      this.searchExchangeRatesSystem(baseC, conversionC);
      this.invoiceHeader.calculationBasis.exchangeCunrrencyId = baseC;
      this.invoiceHeader.calculationBasis.exchangeConvCunrrencyId = conversionC;   
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
        // if (this.invoiceHeader.paymentNegotiation.exchangeRateValue != data[0].conversionFactor) {
        //   this.indexratechange = true;
        //   this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Existe una tasa de cambio actualizada." });
        // }
      
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }
  private getinvoiceStatusProperties() {
    const obj = new InvoiceUpdateStatus();
    obj.id = this.invoiceHeader.id;
    obj.statusId = this.invoiceHeader.idStatus;
    obj.motiveId = -1;
    obj.observation = '';
    return obj;
  }
  changeStatus(status: number, data) {
    var statusBack = this.invoiceHeader.idStatus;
    this.submitted = true;
    this.invoiceHeader.idStatus = status;
    const purchaseOrder = this.getinvoiceStatusProperties();
    if (data != undefined) {
      purchaseOrder.motiveId = this.invoiceHeader.idReason;
      purchaseOrder.observation = this.invoiceHeader.description;
    }
    this.service.changeStatus(purchaseOrder).subscribe((data: number) => {
      if (data > 0) {
        this.isEditHeader = false;
        this.id = data;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Actualización exitosa" });
        this.submitted = false;
        const link: any[] = ['/srm/consingment-invoice', data.toString()];
        this.location.go(link[0] + '/' + link[1]);
        this.ngOnInit();
      }
    }, (error: HttpErrorResponse) => {
      this.invoiceHeader.idStatus = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });
  }
  ChangeTax() {
    // let tt = this.exchangeRateList.find(x => x.value == this.PucharseOrderHeader.purchase.idexchangeRateSupplier).label;
    this.invoiceHeader.paymentNegotiation.exchangeRateValue = parseFloat(this.exchangeRateList.find(x => x.value == this.invoiceHeader.paymentNegotiation.exchangeRateId).label);
    this.isEditHeader = true;
  } 
}
