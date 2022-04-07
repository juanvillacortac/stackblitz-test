import { DecimalPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ColumnD } from "src/app/models/common/columnsd";
import { Category } from "src/app/models/masters-mpc/category";
import { PermissionByUserByModule } from "src/app/models/security/PermissionByUserByModule";
import { FrequencyRequestSetup } from "src/app/models/tms/frequencyrequestsetup";
import { RequestSetup } from "src/app/models/tms/requestsetup";
import { LoadingService } from "src/app/modules/common/components/loading/shared/loading.service";
import { WeekDays } from "src/app/modules/hcm/shared/models/masters/weekdays";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { CategoryFilter } from "src/app/modules/masters-mpc/shared/filters/category-filter";
import { CategoryService } from "src/app/modules/masters-mpc/shared/services/CategoryService/category.service";
import { BranchofficeService } from "src/app/modules/masters/branchoffice/shared/services/branchoffice.service";
import { SecurityService } from "src/app/modules/security/shared/services/security.service";
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { PermissionByUserByModuleFilter } from "src/app/modules/security/shared/view-models/PermissionByUserByModuleFilter";
import { CommontmsService } from "../../shared/service/common.service";
import { RequestSetupFilter } from "../shared/filter/request-setup-filter";
import { RequestSetupService } from "../shared/service/request-setup.service";
import { OperationMastersService } from "src/app/modules/masters/operation-master/shared/operationmasters.service";
import { OperationdocumentFilters } from "src/app/models/masters/operationdocument-filters";

@Component({
  selector: 'app-master-request-setup-panel',
  templateUrl: './master-request-setup-panel.component.html',
  styleUrls: ['./master-request-setup-panel.component.scss'],
  providers: [DecimalPipe]
})
export class MasterRequestSetupPanelComponent implements OnInit {
  submitted: boolean = false;
  _showDialog: boolean = false;  
  @Input("requestSetup") _requestSetup: RequestSetup;
  @Input("showPanel") _showPanel: boolean = false;
  @Input("filters") _filters: RequestSetupFilter;
  @Input("status") _status:boolean;
  @Input("_selectedFrequency") _selectedFrequency: FrequencyRequestSetup[] = [];  
  @Output() showPanelChange = new EventEmitter<boolean>();
  operationdocumentfilters: OperationdocumentFilters = new OperationdocumentFilters();
  checkAllFrequency: boolean = false;
  loadingfrequency:boolean = false;
  typeRequestlist: SelectItem[];  
  prioritylist: SelectItem[];
  branchOfficeDispatcheslist: SelectItem[];
  branchOfficeRequestlist: SelectItem[];
  categoryList: SelectItem[];
  weekDaysList: SelectItem[];
  _frequencyRequestSetup: FrequencyRequestSetup[] = [];
  _permissionBranchOfficeList: PermissionByUserByModule[] = [];
  _permissionsIDs = {...Permissions};
  _frequencyRequestSetupTemp : FrequencyRequestSetup;
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  displayedColumns: ColumnD<FrequencyRequestSetup>[] =
  [   
    { template: (data) => { return data.idFrecuencyRequestSetup; }, header: 'Código', field: 'id', display: 'none' },
    { template: (data) => { return data.active; }, header: 'Activo', field: 'active', display: 'none' },
    { template: (data) => { return data.day; }, header: 'Día', field: 'day', display: 'table-cell' },    
    { template: (data) => {return  this.decimalPipe.transform(data.percentageIncrease) }, header: 'Porcentaje de incremento', field: 'percentageIncrease', display: 'table-cell' }
  ];
  constructor(private _Authservice: AuthService, public _operationMastersService:OperationMastersService, public _securityService:SecurityService, public _commontmsService:CommontmsService, public _branchOfficeService: BranchofficeService, private _categoryService: CategoryService, private _requestSetupService:RequestSetupService, private _messageService:MessageService, private _confirmationService:ConfirmationService, private readonly _loadingService:LoadingService, private decimalPipe:DecimalPipe) { }

  ngOnInit(): void {

    this._requestSetupService.getDaysList().subscribe((data: WeekDays[]) => {
      this._requestSetupService._weekDaysList = data;              
    }, (error: HttpErrorResponse)=>{});   

    this.operationdocumentfilters.idTypeDocumentOperation = 1;
    this._operationMastersService.getDocumentsOperations(this.operationdocumentfilters)
    .subscribe((data)=>{
      data = data.filter(x => x.id == 1 || x.id == 4);
      this.typeRequestlist = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  

    this._commontmsService.getPriorityList()
    .subscribe((data)=>{
      this.prioritylist = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });       

    this.onLoadBranchOffices();
    this.onloadCategorys();    

    if(this._requestSetup.requestSetupID<=0){
      this._requestSetup.active=true;   
      this._selectedFrequency = [];
      this.onLoadFrequencysList();
      this._requestSetup.frequencyRequestSetupList = this._frequencyRequestSetup;
    }   
  }

  editarRegistro(frequency){

    this._frequencyRequestSetup.forEach(element =>{
      element.percentageIncrease
      if(element.idDay == frequency.idDay && frequency.percentageIncrease == null)
      {
        frequency.percentageIncrease = 0;
        element.percentageIncrease = 0;
      }
    });
  }

  onLoadBranchOffices(){        
    this.branchOfficeRequestlist = [];
    this.branchOfficeDispatcheslist = [];
    var filter = new PermissionByUserByModuleFilter();    
    const { id } = this._Authservice.storeUser;
    filter.idUser = id;
    filter.idBranchOffice = -1;
    filter.idModule = 154;//Modulo de MAestro de Configuracion de solicitudes
    this._securityService.getPermissionByUserByModule(filter).then(softwareList => {
      this._permissionBranchOfficeList  = softwareList;
    });       
    this._permissionBranchOfficeList.forEach(PermissionBranchOffice => {
      if(PermissionBranchOffice.idAccessModule == this._permissionsIDs.UPDATE_REQUEST_SETUP_PERMISSION_ID)
      {
        this.branchOfficeRequestlist.push({
          label : PermissionBranchOffice.branchOffice,
          value: PermissionBranchOffice.idBranchOffice
        });
        this.branchOfficeDispatcheslist.push({
          label : PermissionBranchOffice.branchOffice,
          value: PermissionBranchOffice.idBranchOffice
        });
      }
    });
  }

  onLoadFrequencysList(){       
    if(this._requestSetupService._weekDaysList !== undefined)
    {                 
      if(this._showPanel == true)
      {
        this._frequencyRequestSetup = [];
        this._requestSetupService._weekDaysList.forEach(element => {
          this._frequencyRequestSetupTemp = new FrequencyRequestSetup();
          this._frequencyRequestSetupTemp.idFrecuencyRequestSetup = -1;
          this._frequencyRequestSetupTemp.idRequestSetup = -1;
          this._frequencyRequestSetupTemp.idDay = element.id;
          this._frequencyRequestSetupTemp.day = element.dayName;
          this._frequencyRequestSetupTemp.percentageIncrease = 0;
          this._frequencyRequestSetupTemp.active = false;
          this._frequencyRequestSetupTemp.createdByUserID = -1;
          this._frequencyRequestSetupTemp.updatedByUserID = -1;
          this._frequencyRequestSetupTemp.dateOfCreation = new Date();
          this._frequencyRequestSetupTemp.dateOfModification = new Date();
          this._frequencyRequestSetup.push(this._frequencyRequestSetupTemp);                
        });      
      }            
    }      
  }



  onloadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory=0;
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory=0;
    //var category=new Category();    
    this._categoryService.getCategorys(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));       
        //let filterArray = [{ ...category }, ...data];        
        this.categoryList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));      
    },(error)=>{
      console.log(error);
    });
  }

  hidePanel(): void {
    this._showPanel = false;
    this.showPanelChange.emit(this._showPanel);
    this.submitted = false;
    this._requestSetup = new RequestSetup();
    this._requestSetup.requestSetupID=-1;    
    this._requestSetup.active = true;
  }
  
  requestSetupEdit(prequestSetup: RequestSetup){
    this.ngOnInit();
    this._requestSetup = new RequestSetup();    
    this._requestSetup.requestSetupID = prequestSetup.requestSetupID;    
    this._requestSetup.requestTypeID = prequestSetup.requestTypeID;
    this._requestSetup.branchOfficeRequestID = prequestSetup.branchOfficeRequestID;
    this._requestSetup.branchOfficeDispatchesID = prequestSetup.branchOfficeDispatchesID;
    this._requestSetup.categoryID = prequestSetup.categoryID;
    this._requestSetup.priorityID = prequestSetup.priorityID;
    this._requestSetup.active = prequestSetup.active;
    this._requestSetup.setUpCode = prequestSetup.setUpCode;
    this._requestSetup.frequencyRequestSetupList = prequestSetup.frequencyRequestSetupList;
    this._frequencyRequestSetup = this._requestSetup.frequencyRequestSetupList;     
    this._status = prequestSetup.active;
    this._selectedFrequency = [];
    this._frequencyRequestSetup.forEach(element =>{
      if(element.active){
        this._selectedFrequency.push(element);
      }        
    });
    this._showPanel = true;
  }

  onChangeUpdateFrequency(pfrequencyRequestSetup: FrequencyRequestSetup) {        
    var flag = this._selectedFrequency.find(obj => obj.idDay == pfrequencyRequestSetup.idDay);
    if(flag !== undefined){
      let objIndex = this._frequencyRequestSetup.findIndex((obj => obj.idDay == pfrequencyRequestSetup.idDay));
      this._frequencyRequestSetup[objIndex].active = true;
    }else
    {
      let objIndex = this._frequencyRequestSetup.findIndex((obj => obj.idDay == pfrequencyRequestSetup.idDay));
      this._frequencyRequestSetup[objIndex].active = false;
    }    
  }

  clear(event) {
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  onChangeAllUpdateFrequency(pfrequencyRequestSetup: FrequencyRequestSetup){    
    var flag = this._selectedFrequency.length;    
    this._frequencyRequestSetup.forEach(element => {
      if(flag > 0)
      {
        element.active = true;
      }else{
        element.active = false;
      }        
    });    
  }

  submit()
  {        
    var flag = this._selectedFrequency.length; 
    this.submitted = true;              
    this._requestSetup.requestSetupID == 0 ? -1 : this._requestSetup.requestSetupID;   
    if(this._requestSetup.requestTypeID > 0 && this._requestSetup.branchOfficeRequestID > 0 
      && this._requestSetup.branchOfficeDispatchesID > 0 && this._requestSetup.categoryID > 0
      && this._requestSetup.priorityID > 0 && this._requestSetup.branchOfficeRequestID != this._requestSetup.branchOfficeDispatchesID
      && flag > 0)
    {
      if(this._requestSetup.active || this._requestSetup.active == this._status)
      {
          this.save();
      }
      else{
        this._confirmationService.confirm({
          header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: 'Si inactiva el registro, las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
            accept: () => {
                  this.save();
            },
          });
      }
    }     
  }

  save(){    
    this._loadingService.startLoading();        
    this._requestSetupService.InsertRequestSetup(this._requestSetup).subscribe((data) => {      
     if (data.idResponseCode == 0)
      {
         this._messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
         this._showPanel = false;
         this.showPanelChange.emit(this._showPanel);         
         this._requestSetupService.getRequestSetupList(this._filters).subscribe((data: RequestSetup[]) => {
         this._requestSetupService._requestSetupList = data;
         this.submitted = false;
        });
      }
     else
      {
        if(data.idResponseCode > 1000)
         this._messageService.add({ severity: 'error', summary: 'Error', detail: data.responseCode });
        else if(data.idResponseCode==1000)
           this._messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      }
      }, (error: HttpErrorResponse) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });        
        this._loadingService.stopLoading();
      });      
      this._loadingService.stopLoading();
 } 
}
