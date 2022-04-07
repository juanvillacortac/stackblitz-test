import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { Reception, ReceptionProperties, ReceptionStatus } from 'src/app/models/srm/reception';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { DocumentTypeFilter } from 'src/app/modules/srm/shared/filters/common/document-type-filter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';
import { DocumentType } from 'src/app/models/srm/common/document-type';
import { SelectItem } from 'primeng/api';
import { TimerViewerComponent } from 'src/app/modules/common/components/timer-viewer/timer-viewer.component';
import { Subscription, timer } from 'rxjs';
import { CdTimerComponent } from 'angular-cd-timer';

@Component({
  selector: 'app-reception-general-data',
  templateUrl: './reception-general-data.component.html',
  styleUrls: ['./reception-general-data.component.scss']
})
export class ReceptionGeneralDataComponent implements OnInit {


  @Input() reception: Reception;
  @Input() submitted: boolean;
  @Input() receptionProperties: ReceptionProperties;
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  iduserlogin:number=0;

  arrivalTime: Date;
  startTime: Date;
  finalizedDate: Date;
  validateStartDate: Date;
  validateFinalizedDate: Date;

  showOperatorDialog = false;
  documentTypes: any[] = [];
  receptionAreas = [];
  associatedDocumentTypes = [];
  currencies = [];
  currenciesBase = [];
  @Input() legalCurrencyId: number = 0;
  conversionCurrencyId: number = 0;
  supplierDialogVisible: boolean = false;
  rateSupplierVisible: boolean = false;
  supplierRate: ExchangeRatesSupplier = new ExchangeRatesSupplier();
  keyOperatorModal: string;
  time = 0;
  timeElapsed = 0;
  subscription: Subscription;
  timeString:any=0;
  timeStringvalidate:any=0;
  timeStringArrival:any=0;
  duration:any=0
  @ViewChild(TimerViewerComponent) timer:TimerViewerComponent
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;

  constructor(
    private readonly areaService: AreaService,
    private readonly operationMastersService: OperationMastersService,
    private readonly commonSRMService: CommonsrmService,
    private readonly currencyService: CoinsService,
    private readonly authService: AuthService,
    private readonly dateHelper: DateHelperService,
    private readonly dialogService: DialogsService,
    private _httpClient: HttpClient) { }

    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {

    this.iduserlogin = this._Authservice.storeUser.id;
    this.loadDocumentTypes();
    this.loadReceptionAreas();
    this.loadCurrencies();
    this.setBaseConversionProperties();
    this.loadDocumentRelatedTypes();
    this.setValueDates();
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  save() {
  }

  submitOperator(data)
  { 
    if (this.keyOperatorModal === 'validator') {
      this.setValidatorOperator(data);
    } else {
      this.setResponsibleOperator(data);
    }
    
  }

  hideOperator(e){
    this.showOperatorDialog = e;
  }

  showOperatorModal(key) {
    this.keyOperatorModal = key;
    this.showOperatorDialog = true;
  }

  isvalid(field = '') {
    if (this.submitted) {
      switch (field) {
        case 'document_type_required':
          return this.validateDocumentType();
        case 'area_required':
          return this.validateAreaRequired();
        case 'invoice_number_required':
          return this.validateInvoiceNumberRequired();
        default:
          return true;
      }
    } else {
      return true;
    }
  }

  private setValueDates() {
    const arrivalTime = this.dateHelper.utcToGMT(moment(this.reception.arrivalTime).toDate());
    const startTime = this.dateHelper.utcToGMT(moment(this.reception.startTime).toDate());
    const finalizedDate = this.dateHelper.utcToGMT(moment(this.reception.endTime).toDate());
    const validateStartDate = this.dateHelper.utcToGMT(moment(this.reception.validationStartTime).toDate());
    const validateFinalizedDate = this.dateHelper.utcToGMT(moment(this.reception.validationEndTime).toDate());

    this.arrivalTime = this.isMinimumDateTimeValue(this.reception.arrivalTime) ? undefined : arrivalTime;
    this.startTime = this.isMinimumDateTimeValue(this.reception.startTime) ? undefined : startTime;
    this.finalizedDate = this.isMinimumDateTimeValue(this.reception.endTime) ? undefined : finalizedDate;
    this.validateStartDate = this.isMinimumDateTimeValue(this.reception.validationStartTime) ? undefined : validateStartDate;
    this.validateFinalizedDate = this.isMinimumDateTimeValue(this.reception.validationEndTime) ? undefined : validateFinalizedDate;
    this.getTimeArrival(this.arrivalTime,this.startTime)
    this.getTimeStart(this.startTime,this.finalizedDate)
    this.getTimevalidate(this.validateStartDate,this.validateFinalizedDate)
    this.getDuration(this.arrivalTime,this.validateFinalizedDate)
  }

  updatesetValueDates(reception) {
    const arrivalTime = this.dateHelper.utcToGMT(moment(reception.arrivalTime).toDate());
    const startTime = this.dateHelper.utcToGMT(moment(reception.startTime).toDate());
    const finalizedDate = this.dateHelper.utcToGMT(moment(reception.endTime).toDate());
    const validateStartDate = this.dateHelper.utcToGMT(moment(reception.validationStartTime).toDate());
    const validateFinalizedDate = this.dateHelper.utcToGMT(moment(reception.validationEndTime).toDate());
    const startTimeupdate =moment(reception.startTime).toDate();
    const finalizedDateupdate = moment(reception.endTime).toDate();
    const validateStartDateupdate =  moment(reception.validationStartTime).toDate();
    const validateFinalizedDateupdate = moment(reception.validationEndTime).toDate();
    this.arrivalTime = this.isMinimumDateTimeValue(reception.arrivalTime) ? undefined : arrivalTime;
    this.startTime =  startTimeupdate!= undefined? startTimeupdate:startTime
    this.finalizedDate = finalizedDateupdate!= undefined? finalizedDateupdate:finalizedDate
    this.validateStartDate = validateStartDateupdate!= undefined? validateStartDateupdate: validateStartDate
    this.validateFinalizedDate =  validateFinalizedDateupdate!= undefined? validateFinalizedDateupdate :validateFinalizedDate
    this.getTimeArrival(this.arrivalTime,this.startTime)
    this.getTimeStart(this.startTime,this.finalizedDate)
    this.getTimevalidate(this.validateStartDate,this.validateFinalizedDate)
    this.getDuration(this.arrivalTime,this.validateFinalizedDate)

  }

  private loadDocumentRelatedTypes() {
    const filter = new DocumentTypeFilter();
    filter.id = 3;
    filter.active = 1;
    this.commonSRMService.getDocumentTypes({...filter})
    .then(data => {  
      let def=new DocumentType();
      def.id=3;
      def.name='Recepcion-validacion-compra'
      def.documentTypeRelatedId=0
      def.documentTypeRelated="Sin documento"
      def.active=true;
      this.associatedDocumentTypes = data
      this.associatedDocumentTypes.push(def);
    })
    .catch(error => this.handleError(error));
  }

  private setResponsibleOperator(data) {
    this.reception.receivingOperator.id = data?.operator?.id;
    this.reception.receivingOperator.name = data?.operator?.name;
  }

  private setValidatorOperator(data) {
    this.reception.validatorOperator.id = data?.operator?.id;
    this.reception.validatorOperator.name = data?.operator?.name;
  }

  private validateDocumentType(){ 
    this.reception.documentTypeId >0;
  }

  private validateAreaRequired() {
    if(this.reception.documentTypeRelatedId === 2) {
      return this.reception.receptionAreaId > 0; 
    } else {
      return true;
    }
     
  }

  private validateInvoiceNumberRequired() {
    //this.reception.invoiceNumber?.length > 0;
    this.reception.invoiceNumber !="";
  }

  private setBaseConversionProperties() {
    this.loadCurrenciesBase();
  }

  private loadDocumentTypes() {
    const filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 3; // VDR documents

    // this.operationMastersService.getDocumentsOperations({...filter}).toPromise()
    // .then(data => this.loadDocumentTypesSuccesed(data))
    // .catch(error => this.handleError(error));
    this.operationMastersService.getDocumentsOperations({...filter})
    .subscribe((data)=>{
      this.documentTypes = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
  }

  private isMinimumDateTimeValue(date: Date): Boolean {
    return new Date(date).getDate() === new Date('1/1/0001').getDate() || new Date(date).getDate() === new Date('1/1/1900').getDate();
  }

  private loadDocumentTypesSuccesed(data) {
    this.documentTypes = data;
  }

  private loadReceptionAreas() {
    const filter = new AreaFilter();
    filter.id = -1;
    filter.active = 1;
    filter.idAreaType = 3; // Reception areas
    filter.idBranchOffice = this.authService.currentOffice;

    this.areaService.getareaList(filter).toPromise()
    .then(data => this.receptionAreas = data)
    .catch(error => this.handleError(error));
    
  }

  private loadCurrencies() {
    const filters = new CoinFilter();
    filters.id = -1;
    filters.active = 1;

    this.currencyService.getCoinsList({...filters}).toPromise()
    .then(data => this.loadCurrenciesSuccess(data))
    .catch(error => this.handleError(error));
  }

  private loadCurrenciesSuccess(data: Coins[]) {
    this.currencies = data;
  }

  private loadCurrenciesBase() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authService.currentCompany;

    this.currencyService.getCoinxCompanyList({...filter})
    .subscribe((data: Coins[]) => {
       this.currenciesBase = data;
       this.legalCurrencyId = data.find(x => x.legalCurrency).id;
       this.conversionCurrencyId = data.find(x => !x.legalCurrency).id;
      });
    //.then(data => this.loadCurrenciesBaseSuccess(data))
    //.catch(error => this.handleError(error));
  }

  private loadCurrenciesBaseSuccess(data: Coins[]) {
    this.currenciesBase = data;
    this.legalCurrencyId = data.find(x => x.legalCurrency).id;
    this.conversionCurrencyId = data.find(x => !x.legalCurrency).id;
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  ///#region timer 

getTimeArrival(startDate,finalizedDate) {
  let timeElapsed=0
  let time=0
  if (startDate) {
    if(finalizedDate) {
      const startMoment = moment(startDate);
      const finishTime = moment(finalizedDate);
      time = moment.duration(finishTime.diff(startMoment)).asSeconds();
      const duration = moment.duration(time, 'seconds');
      this.timeStringArrival = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    } else {
      const startMoment = moment(startDate);
       const actualDate = moment(Date());
      timeElapsed = moment.duration(actualDate.diff(startMoment)).asSeconds();
      timeElapsed = timeElapsed < 0 ? 0 : timeElapsed;
      if(startDate) {
 
        const source = timer(startDate, 1000);
           let subscriptions:Subscription
           subscriptions = source.subscribe(val => {
           time = timeElapsed + val;
           const duration = moment.duration(time, 'seconds');
           this.timeStringArrival = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        });
      }
    }
   }
   else{
    const duration = moment.duration(0, 'seconds');
    this.timeStringArrival = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
   }

}

getTimeStart(startDate,finalizedDate) {
  let timeElapsed=0
  if (startDate) {
    if(finalizedDate) {
       const startMoment = moment(startDate);
       const finishTime = moment(finalizedDate);
       this.time = moment.duration(finishTime.diff(startMoment)).asSeconds();
       const duration = moment.duration(this.time, 'seconds');
       this.timeString = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    } else {

      const startMoment = moment(startDate);
      const actualDate = moment(Date());
      timeElapsed = moment.duration(actualDate.diff(startMoment)).asSeconds();
      timeElapsed = timeElapsed < 0 ? 0 : timeElapsed;
      //this.setElapsedSeconds(startDate);
      //this.startTimer(startDate);
      if(startDate) {
        const source = timer(startDate, 1000);
        this.subscription = source.subscribe(val => {
           this.time = timeElapsed + val;
           const duration = moment.duration(this.time, 'seconds');
           this.timeString = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        });
      }
    }
   }
   else{
    const duration = moment.duration(0, 'seconds');
    this.timeString = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
   }
}
getTimevalidate(startDate,finalizedDate) {
  let timeElapsed=0
  let time=0
  debugger
  if (startDate) {
    if(finalizedDate) {
      const startMoment = moment(startDate);
      const finishTime = moment(finalizedDate);
      time = moment.duration(finishTime.diff(startMoment)).asSeconds();
      const duration = moment.duration(time, 'seconds');
      this.timeStringvalidate = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    } else {
      const startMoment = moment(startDate);
       const actualDate = moment(Date());
      timeElapsed = moment.duration(actualDate.diff(startMoment)).asSeconds();
      timeElapsed = timeElapsed < 0 ? 0 : timeElapsed;
      if(startDate) {
        const source = timer(startDate, 1000);
           let subscriptions:Subscription
           subscriptions = source.subscribe(val => {
           time = timeElapsed + val;
           const duration = moment.duration(time, 'seconds');
           this.timeStringvalidate = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        });
      }
    }
   }
   else{
    const duration = moment.duration(0, 'seconds');
    this.timeStringvalidate = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
   }

}
getDuration(startDate,finalizedDate) {
  let timeElapsed=0
  let time=0
  if (startDate) {
    if(finalizedDate) {
      const startMoment = moment(startDate);
      const finishTime = moment(finalizedDate);
      time = moment.duration(finishTime.diff(startMoment)).asSeconds();
      const duration = moment.duration(time, 'seconds');
      this.duration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    } else {
      const startMoment = moment(startDate);
       const actualDate = moment(Date());
      timeElapsed = moment.duration(actualDate.diff(startMoment)).asSeconds();
      timeElapsed = timeElapsed < 0 ? 0 : timeElapsed;
      if(startDate) {
        const source = timer(startDate, 1000);
           let subscriptions:Subscription
           subscriptions = source.subscribe(val => {
           time = timeElapsed + val;
           const duration = moment.duration(time, 'seconds');
           this.duration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        });
      }
    }
   }
   else{
    const duration = moment.duration(0, 'seconds');
    this.duration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
   }

}

  private stopTimer(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  //#endregion


}
