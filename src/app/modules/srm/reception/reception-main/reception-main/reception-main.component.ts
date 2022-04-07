import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { Coins } from 'src/app/models/masters/coin';
import { Supplier } from 'src/app/models/masters/supplier';
import { CalculationBasis } from 'src/app/models/srm/common/calculation-basis';
import { PaymentNegotiation } from 'src/app/models/srm/common/payment-negotiation';
import { Transport } from 'src/app/models/srm/common/transport';
import { Reception, ReceptionProperties, ReceptionStatus, ReceptionUpdateStatus } from 'src/app/models/srm/reception';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { Result } from '../../../shared/filters/common/result';
import { MerchandiseReceptionService } from '../../../shared/services/merchandise-reception/merchandise-reception.service';
import { ReceptionTabmenuComponent } from '../../reception-tabmenu/reception-tabmenu/reception-tabmenu.component';

@Component({
  selector: 'app-reception-main',
  templateUrl: './reception-main.component.html',
  styleUrls: ['./reception-main.component.scss']
})
export class ReceptionMainComponent implements OnInit {

  reception = new Reception();
  receptionProperties = new ReceptionProperties();
  submitted: boolean = false;
  location;
  receptionIsLoaded: boolean = false;
  receptionIsChanged: boolean = false;
  idreception :number;
  currenciesBase = [];
  legalCurrencyId: number = 0;
  conversionCurrencyId: number = 0;
  haveproducts:boolean=false;
  @Output('haveChange') haveChange = new EventEmitter<boolean>();
  @ViewChild(ReceptionTabmenuComponent) tabgeneraL :ReceptionTabmenuComponent

  constructor(private readonly merchandiseReceptionService: MerchandiseReceptionService,
    public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService,
    private actRoute: ActivatedRoute,
    private readonly authService: AuthService,
    //location: Location,
    private readonly loadingService: LoadingService,
    private readonly dialogService: DialogsService,
    private messageService: MessageService,
    private readonly currencyService: CoinsService,
    private confirmationService: ConfirmationService) { }
    //

  ngOnInit(): void {
    this.setBreadCrumb();
    this.getReceptionValues();
    this.loadCurrenciesBase();
  }

  save() {
    //if(this.receptionIsChanged) {
      this.saveReception();
    //}

  }

  saveReception() {
    this.loadingService.startLoading('wait_saving');
    if(this.reception.paymentNegotiation.paymentConditionId==null)
        this.reception.paymentNegotiation.paymentConditionId=-1
    if(this.reception.transport.transportTypeId==null)
        this.reception.transport.transportTypeId=-1
    if(this.reception.transport.deliveryOptionId==null)
        this.reception.transport.deliveryOptionId=-1

    this.merchandiseReceptionService.createReception({...this.reception}).
    then(() => this.saveSuccesed())
    .catch(error => this.LoadinghandleError(error));
  }

  void(Data) { 
     this.reception.endTime=new Date();
     this.changestatus(ReceptionStatus.canceled,Data);
  }

  start() {
    this.confirmationService.confirm({
      key:'confirmBack',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea iniciar el documento?.',
      accept: () => {
        this.reception.startTime=new Date();
        this.changestatus(ReceptionStatus.started,undefined);
      },
    });
    
  }
  finalized(){
    this.confirmationService.confirm({
      key:'confirmBack',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea finalizar el documento, una vez finalizado no podrá recibir mas productos?.',
      accept: () => {
        this.reception.endTime=new Date();
        this.changestatus(ReceptionStatus.finalized,undefined);
      },
    });
  }

  reject(Data){ 
    this.reception.endTime=new Date();
     this.changestatus(ReceptionStatus.reject,Data);   
  }

  private saveSuccesed() {
    this.loadingService.stopLoading();
    this.dialogService.successMessage('srm.reception.reception', 'saved');
  }

  private getReceptionValues() {
    const receptionId = Number(this.actRoute.snapshot.params['id']);
 
    if (receptionId > 0) {
      this.loadReception(receptionId);
      this.loadCurrenciesBase();
    } else {
      this.setReceptionProperties();
      this.receptionIsLoaded = true;
    }
  }

  private formatData() {
    this.reception.transport.transportTypeId = this.reception.transport.transportTypeId === 0 ? undefined : this.reception.transport.transportTypeId;
  }


  private setReceptionProperties() {
    this.reception.id = -1;
    this.reception.receptionNumber = "0";
    this.reception.createdDate = new Date();
    this.reception.paymentNegotiation = new PaymentNegotiation();
    this.reception.supplier = new Supplier();
    this.reception.calculationBasis = new CalculationBasis();
    this.reception.transport = new Transport();
    this.reception.receivingOperator = new BaseModel();
    this.reception.validatorOperator = new BaseModel();
  }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'SCM' },
      { label: 'SRM' },
      { label: 'Recepción de mercancía', routerLink: ['/srm/reception-viewer'] }
    ]);
  }

  private loadReception(id: number) {
    this.merchandiseReceptionService.getReceptionData(id)
    .subscribe(data => {this.loadReceptionSuccessed(data)
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los datos." });
    })
  }

  private loadReceptionSuccessed(data: Reception) {
    if (data) {
      this.reception = data;
      this.formatData();

    } else {
      this.setReceptionProperties();
    }
    
    this.GetInputsStatus();
    this.receptionIsLoaded = true;
  }

  private GetInputsStatus() {
    switch (this.reception.estatus) {
      case ReceptionStatus.pending:
        this.setInputsStatusPending();
        break;
      case ReceptionStatus.started:
        this.setInputsStatusStarted();
        break;
      default:
        break;
    }
  }

  private setInputsStatusPending() {
     this.receptionProperties.responsibleOperatorDisabled = false;
     this.receptionProperties.validatorOperatorDisabled = false;
     this.receptionProperties.providerDataDisabled = this.reception.purchaseOrderRelatedId > 0; 
     this.receptionProperties.headReceptionDataDisabled = false;
     this.receptionProperties.associatedDocumentDisabled = false;
  }

  private setInputsStatusStarted() {
    this.receptionProperties.providerDataDisabled = true;
    this.receptionProperties.headReceptionDataDisabled = true;
    this.receptionProperties.associatedDocumentDisabled = true;
    this.receptionProperties.responsibleOperatorDisabled = true;
    this.receptionProperties.validatorOperatorDisabled = true;
  }

  private LoadinghandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  changestatus(status: number, data){
    var statusBack = this.reception.estatus;
    this.submitted = true;
    this.reception.estatus = status;
    const order = this.getStatusProperties();
    if (data != undefined) {
      order.motiveId = this.reception.idReason;
      order.observation = this.reception.description;
    }
    this.merchandiseReceptionService.updateStatus(order).subscribe((data: Result) => {
      if (data!=null) {
      if (data.idResponseCode == 0) {
        this.idreception = data.entityId;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Actualización exitosa" });
        this.submitted = false;
        const link: any[] = ['/srm/reception', data.toString()];
        this.tabgeneraL.updatedate(this.reception);
        this.ngOnInit();
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message});
        this.reception.estatus = statusBack;
      }
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
        this.reception.estatus = statusBack;
      }
    }, (error: HttpErrorResponse) => {
      this.reception.estatus = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });

  }

  private getStatusProperties() {
    const obj = new ReceptionUpdateStatus();
    obj.receptionId = this.reception.id;
    obj.statusId = this.reception.estatus;
    obj.motiveId = -1;
    obj.observation = '';
    return obj;
  }

  private loadCurrenciesBase() {
   
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authService.currentCompany;

    this.currencyService.getCoinxCompanyList({...filter})
    .subscribe((data: Coins[]) => {
      debugger
       this.currenciesBase = data;
       this.legalCurrencyId = data.find(x => x.legalCurrency).id;
       this.conversionCurrencyId = data.find(x => !x.legalCurrency).id;
      });
    //.then(data => this.loadCurrenciesBaseSuccess(data))
    //.catch(error => this.handleError(error));
  }
  haveproduct(data){
    this.haveproducts=data;
    this.haveChange.emit(this.haveproducts);
  }
}
