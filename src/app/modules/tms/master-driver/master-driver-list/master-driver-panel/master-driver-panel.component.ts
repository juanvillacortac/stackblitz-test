import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Driver } from 'src/app/models/tms/driver';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { DriverFilter } from '../../shared/filter/driver-filter';
import { DriverService } from '../../shared/service/driver.service';

@Component({
  selector: 'app-master-driver-panel',
  templateUrl: './master-driver-panel.component.html',
  styleUrls: ['./master-driver-panel.component.scss'],
  providers: [DatePipe]
})
export class MasterDriverPanelComponent implements OnInit {

  submitted: boolean;
  loading=false;
  multiples:boolean=false;
  model:boolean=false;
  _showdialog: boolean = false;  
  _validations:Validations=new Validations();
  ciDate:Date=new Date();
  ceDate:Date=new Date();
  liDate:Date=new Date();
  leDate:Date=new Date();    
  validateDate:Date=new Date(1950,0,1); 
  @Input("_driver") _driver: Driver;
  @Input("showDialog") showDialog: boolean = true;
  @Input("showInput") showInput: boolean = false;
  @Input("filters") filters: DriverFilter;
  @Input("_status") _status:boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() changes = new EventEmitter();

  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  licenseDriverlist: SelectItem[] = [
    {label: 'Si', value: true},
    {label: 'No', value: false},
  ];
  medicalCertificateList: SelectItem[] = [
    {label: 'Si', value: true},
    {label: 'No', value: false},
  ];
  typeDriverList: SelectItem[];
  licenselevelList: SelectItem[];

  constructor(private _driverService: DriverService,private messageService: MessageService,private confirmationService: ConfirmationService, private readonly loadingService: LoadingService, public datepipe:DatePipe) { }

  ngOnInit(): void {
    this.submitted = false;
    this.showInput = false;
    this._driverService.getTypeDriversList()
    .subscribe((data)=>{
      this.typeDriverList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  

    this._driverService.getLevelLicenseList()
    .subscribe((data)=>{
      this.licenselevelList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 
 
    if(this._driver.id<=0){
      this._driver.active=true;
      this._driver.id = -1;
    }
      
  }
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._driver = new Driver();
    this._driver.id=-1;
    this._driver.observations="";
    this._driver.active = true;
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }

   onSubmitOperator(data)
  {    
    this._driver.idUserDriver=data.operator.id;
    this._driver.userDriver=data.operator.name;      
    this._driver.documentNumber = data.operator.documentnumber;
    this._driver.identifier = data.operator.identifier;
    if(this._driver.userDriver.trim() !== ""){
      this.showInput = true;
    }
  }

  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

  driverEdit(pdriver: Driver){  
    this.ngOnInit();   
    this._driver = new Driver();
    this._driver.id = pdriver.id;
    this._driver.identifier = pdriver.identifier;
    this._driver.documentNumber = pdriver.documentNumber;
    this._driver.observations = pdriver.observations;
    this._driver.userDriver = pdriver.userDriver;
    this._driver.idUserDriver = pdriver.idUserDriver;
    this._driver.idTypeDriver = pdriver.idTypeDriver;
    this._driver.idLicenseLevel = pdriver.idLicenseLevel == 0 ? -1 : pdriver.idLicenseLevel;
    this._driver.typeDriver = pdriver.typeDriver;
    this._driver.licenseLevel = pdriver.licenseLevel;    
    this._driver.certificateIssueDate = pdriver.certificateIssueDate;
    this._driver.certificateExpirationDate = pdriver.certificateExpirationDate;
    this._driver.licenseIssueDate = pdriver.licenseIssueDate;
    this._driver.licenseExpirationDate = pdriver.licenseExpirationDate;
    this._driver.indDriverLicense = pdriver.indDriverLicense;
    this._driver.indMedicalCertificate = pdriver.indMedicalCertificate;
    this._driver.active = pdriver.active;
    this._status=pdriver.active;
    this._driver.dateCreate = pdriver.dateCreate;
    this._driver.dateUpdate = pdriver.dateUpdate;    
    this._driver.ciDate = new Date(this._driver.certificateIssueDate);
    this._driver.ceDate = new Date(this._driver.certificateExpirationDate);
    this._driver.liDate = new Date(this._driver.licenseIssueDate);
    this._driver.leDate = new Date(this._driver.licenseExpirationDate);    
    this.showDialog = true;    
    this.showInput = true;
  }
  

  onBlurMethodCCI(event: any)
  {
    let dates = new Date(event);
    if(dates > this._driver.ceDate)
    {
      this._driver.ceDate=dates;
       this.changes.emit(this._driver.ceDate);
    }     
  }  

  onBlurMethodCLI(event: any)
  {
    let dates = new Date(event);
    if(dates > this._driver.leDate)
    {
      this._driver.leDate=dates;
       this.changes.emit(this._driver.leDate);
    }     
  } 

  save(){
    //this.loading=true;
    this.loadingService.startLoading();    
    this._driver.certificateIssueDate = this.datepipe.transform(this._driver.ciDate, "yyyyMMdd");
    this._driver.certificateExpirationDate = this.datepipe.transform(this._driver.ceDate, "yyyyMMdd");
    this._driver.licenseIssueDate = this.datepipe.transform(this._driver.liDate, "yyyyMMdd");
    this._driver.licenseExpirationDate = this.datepipe.transform(this._driver.leDate, "yyyyMMdd");
    this._driver.idLicenseLevel = this._driver.idLicenseLevel == -1 ? 0 : this._driver.idLicenseLevel;      
    this._driverService.InsertUpdateDrivers(this._driver).subscribe((data) => {      
     if (data.idResponseCode == 0)
      {
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
         this._driver= new Driver();
         this._driver.active = true;               
         this._driverService.getDriversList(this.filters).subscribe((data: Driver[]) => {
         this._driverService._driverList = data;
         this.submitted = false;
        });
      }
     else
      {
        if(data.idResponseCode > 1000)
         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.responseCode });
        else if(data.idResponseCode==1000)
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
        //this.loading=false;
        this.loadingService.stopLoading();
      });
      //this.loading=false;
      this.loadingService.stopLoading();
 }
 
  submit()
  {    
    this.submitted = true;      
    if(this._driver.userDriver.trim() && this._driver.idTypeDriver > 0)
    {
      if((this._driver.indMedicalCertificate == false) || 
         (this._driver.indMedicalCertificate == true 
       && this._driver.ciDate.toString() !== "Mon Jan 01 1900 00:00:00 GMT-0427 (hora de Venezuela)" 
       && this._driver.ceDate.toString() !== "Mon Jan 01 1900 00:00:00 GMT-0427 (hora de Venezuela)"))
       {
        if((this._driver.indDriverLicense == false) || 
          (this._driver.indDriverLicense == true 
        && this._driver.idLicenseLevel > 0 
        && this._driver.liDate.toString() !== "Mon Jan 01 1900 00:00:00 GMT-0427 (hora de Venezuela)" 
        && this._driver.leDate.toString() !== "Mon Jan 01 1900 00:00:00 GMT-0427 (hora de Venezuela)"))
        {
          if(((this._driver.indMedicalCertificate == false) || (this._driver.ciDate >= this.validateDate)) && ((this._driver.indDriverLicense == false) || (this._driver.liDate >= this.validateDate)))
          {
            this._driver.indDriverLicense == false ? 0 : this._driver.indDriverLicense;    
            this._driver.id == 0 ? -1 : this._driver.id;
            if(this._driver.active || this._driver.active == this._status)
            {
                this.save();
            }
            else
            {
              this.confirmationService.confirm({
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
      }          
    }    
  }                        
}
