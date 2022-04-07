import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { WeightInstrument, WeightInstrumentType } from 'src/app/models/srm/weight-instrument';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MeasurementunitsFilter } from 'src/app/modules/masters-mpc/shared/filters/measurementunits-filter';
import { MeasurementunitsService } from 'src/app/modules/masters-mpc/shared/services/measurementunits.service';
import { WeightInstrumentService } from '../shared/weight-instrument.service';

@Component({
  selector: 'app-weight-instrument-add',
  templateUrl: './weight-instrument-add.component.html',
  styleUrls: ['./weight-instrument-add.component.scss']
})
export class WeightInstrumentAddComponent implements OnInit {

  
  @Input() showPanel = false;
  @Input() weightInstrument = new WeightInstrument();

  @Output() hideDialogEvent = new EventEmitter<boolean>();

  weightInstrumentTypes = [];
  weightInstrumentTypesSelected = [];

  meassureUnit: string;

  unitMeasurements = [];

  isEdit = false;
  submitted = false;
  cubic = 0;
  isTransport = false;
  idCompany:number=1

  status: SelectItem[] = [
    {label: 'Inactivo', value: 0},
    {label: 'Activo', value: 1}
  ];

  constructor(private readonly weightInstrumentService: WeightInstrumentService, 
    private readonly dialogService: DialogsService,
    private readonly loadingService: LoadingService,
    private _httpClient: HttpClient,
    private messageService: MessageService,
    private readonly measurementUnitsService: MeasurementunitsService) { }

    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.setIsEdit();
    this.getWeightInstrumentTypes();
    this.setIntProperties();
    this.getunitOfMeasurementPromise();
    this.getCubic();
    this.idCompany = this._Authservice.currentCompany;
  }

  save() {
    this.submitted = true;
    this.setWeightInstrumentProperties();
    const isValidForm = this.isValidForm();
    if (isValidForm) {
     this.loadingService.startLoading('wait_saving');
     this.weightInstrument.companyId=this.idCompany;
     this.weightInstrumentService.saveWeightInstrument(this.weightInstrument)
     .subscribe((data) => {
      if (data >0)
      {
         this.saveSucceded();
      }  
       else if(data==-1){
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
         this.loadingService.stopLoading();}
       else if(data==-2){
        this.loadingService.stopLoading();
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El registro no se encuentra." });}
       else{
        this.loadingService.stopLoading();
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });}
   }, (error: HttpErrorResponse) => {
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }); 
       
  });

  }
 }

  hideDialog() {
    this.showPanel = false;
    this.submitted = false;
    this.clearData();
    this.hideDialogEvent.emit(false);
  }

  validateForm(field = '') {
    if (this.submitted) {
      switch (field) {
        case 'name':
          return this.getResultErrorValues(this.validateName(), 'srm.weight_instrument.fields.name_required');
        case 'instrumentType':
          return this.getResultErrorValues(this.validateInstrumentType(), 'srm.weight_instrument.fields.instrument_type_required');
        case 'weight':
          return this.getResultErrorValues(this.validateWeight(), 'srm.weight_instrument.fields.weight_required');
        case 'measurementUnitId':
          return this.getResultErrorValues(this.validateMessureUnit(), 'srm.weight_instrument.fields.measurement_unit_required');
        
          default:
          return { isValid: true, error: '' };
      }
    }

    return { isValid: true, error: '' };
  }

  getCubic() {
    this.cubic = (this.weightInstrument.height ? this.weightInstrument.height : 0) 
    * (this.weightInstrument.width ? this.weightInstrument.width : 0) * 
    (this.weightInstrument.depth ? this.weightInstrument.depth : 0);
  }

  handleTransportChange(e) {
    this.weightInstrument.isTransport = e.checked;
  }

  getunitOfMeasurementPromise = () => {
    const filters: MeasurementunitsFilter = new MeasurementunitsFilter();
    return  this.measurementUnitsService.getMeasurementUnitsbyfilterPromise({...filters})
    .then(results => {
      this.unitMeasurements = results.sort((a, b) => a.name.localeCompare(b.name));
      this.getUnitMeassure();
    }).catch(error =>  this.handleError(error));
  }

  getUnitMeassure() {
    this.weightInstrumentService.getWeightMeassureUnitId()
    .then(meassureUnitId => { 
      this.meassureUnit = this.unitMeasurements?.find(x => x.id === Number(meassureUnitId)).name; 
      this.weightInstrument.measurementUnitId = Number(meassureUnitId);
    }).catch(error => this.handleError(error));
  }

  private clearData() {
    this.weightInstrumentTypes = [];
    this.weightInstrumentTypesSelected = [];
  
    this.unitMeasurements = [];
  
    this.isEdit = false;
    this.submitted = false;
    this.cubic = 0;
    this.isTransport = false;
  }
  
  private setIntProperties() {
    this.isTransport = this.weightInstrument?.isTransport === 1 ? true : false;
  }

  private saveSucceded() {
    this.messageService.add({ key:'weight_instrument', severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
    this.showPanel = false;
    this.weightInstrumentTypesSelected = [];
    this.submitted = false;
    this.hideDialogEvent.emit(true);
  }

  private setWeightInstrumentProperties() {
    this.weightInstrument.instrumentTypeId = this.weightInstrumentTypesSelected.map(x => x.id).join(',');
    this.weightInstrument.isTransport = this.isTransport ? 1 : 0;

  }

  private isValidForm() {
    return  this.submitted && this.validateName()
    && this.validateInstrumentType() && this.validateWeight() && this.validateMessureUnit();
  }

  private getResultErrorValues(result, message) {
    return { isValid: result, error: message };
  }

  private validateName() {
    return this.weightInstrument?.name?.length > 0; 
  }

  private validateMessureUnit() {
    return this.weightInstrument?.measurementUnitId > 0; 
  }
  
  private validateInstrumentType() {
    return this.weightInstrument?.instrumentTypeId?.length > 0;
  }

  private validateWeight() {
    return this.weightInstrument?.weight > 0;
  }

  private setIsEdit() {
    this.isEdit = this.weightInstrument ? this.weightInstrument.id > 0 ? true : false : false;
  }

  private getWeightInstrumentTypes() {
    this.weightInstrumentService.getWeightInstrumentTypes()
    .then(data => this.getWeightInstrumentTypesSucceded(data))
    .catch(error => this.handleError(error));
  }

  private getWeightInstrumentTypesSucceded(data: WeightInstrumentType[]) {
    this.weightInstrumentTypes = data;
    if (this.weightInstrument?.instrumentTypeId) {
      this.weightInstrument?.instrumentTypeId?.split(',').forEach(x => this.setInstrumentType(data, Number(x)));
    }
  }

  setInstrumentType(data: WeightInstrumentType[], idTypeInstrument: number) {
    const item = data.find(x => x.id === idTypeInstrument);

    if(item) {
      this.weightInstrumentTypesSelected.push(item);
    }
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
