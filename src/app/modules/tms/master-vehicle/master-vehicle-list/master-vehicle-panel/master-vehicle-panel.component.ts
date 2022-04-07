import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { DriversPerVehicle } from 'src/app/models/tms/driverspervehicle';
import { Typedriver } from 'src/app/models/tms/typedriver';
import { Vehicle } from 'src/app/models/tms/vehicle';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ModalAggregateTrailerComponent } from '../../shared/components/modal-aggregate-trailer/modal-aggregate-trailer.component';
import { ModalAggregateVehicleDriverComponent } from '../../shared/components/modal-aggregate-vehicle-driver/modal-aggregate-vehicle-driver.component';
import { VehicleFilter } from '../../shared/filter/vehicle-filter';
import { VehicleService } from '../../shared/service/vehicle.service';

@Component({
  selector: 'app-master-vehicle-panel',
  templateUrl: './master-vehicle-panel.component.html',
  styleUrls: ['./master-vehicle-panel.component.scss']
})
export class MasterVehiclePanelComponent implements OnInit {

  submitted: boolean;
  loading=false;
  multiples:boolean=false;
  model:boolean=false;
  _showdialog: boolean = false;
  _showInput: boolean = false;
  
  _validations:Validations=new Validations();
  ciDate:Date=new Date();
  ceDate:Date=new Date();
  liDate:Date=new Date();
  leDate:Date=new Date();
  nDate:Date=new Date();
  selectedDriverIndex: number = -1;
  _driverPerVehicleCopy: DriversPerVehicle[];
  @Input("_vehicle") _vehicle: Vehicle;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters : VehicleFilter;
  @Input("_status") _status:boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @ViewChild(ModalAggregateTrailerComponent) modalTrailer: ModalAggregateTrailerComponent; 
  @ViewChild(ModalAggregateVehicleDriverComponent) modalDrivers: ModalAggregateVehicleDriverComponent; 

  VehicleModelList: SelectItem[];
  VehicleTypeList: SelectItem[];

  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];

  menuItemsDrivers: MenuItem[] = [
    {
      label: 'Editar', 
      icon: 'pi pi-fw pi-pencil',
      command: (t)=>{
        this.modalDrivers.edit(this._vehicle.driversPerVehicleList[this.selectedDriverIndex], this.selectedDriverIndex);
      }
    },
    {
      label: 'Eliminar', 
      icon: 'pi pi-fw pi-trash',
      command: (t)=>{
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea eliminar este conductor?',
          accept: () => {
            this._vehicle.driversPerVehicleList.splice(this.selectedDriverIndex,1);
          },
        });            
      }
    }
];  

  constructor(private _vehicleService: VehicleService,private messageService: MessageService,private confirmationService: ConfirmationService, private readonly loadingService: LoadingService) 
  { 

  }

  ngOnInit(): void {    
    this.submitted = false;
    this._vehicleService.getVehicleModelList()
    .subscribe((data)=>{
      this.VehicleModelList = data.map<SelectItem>((item)=>({
        label: item.vehicleModel,
        value: item.id
      }));
      this.VehicleModelList.sort(function(a, b){
        if(a.label < b.label) { return -1; }
        if(a.label > b.label) { return 1; }
        return 0;
    });
    });  

    this._vehicleService.getVehicleTypeList()
    .subscribe((data)=>{
      this.VehicleTypeList = data.map<SelectItem>((item)=>({
        label: item.vehicleType,
        value: item.vehicleTypeID
      }));
    },(error)=>{
      console.log(error);
    });    
    if(this._vehicle.id<=0){
      this._vehicle.active=true;    
      this._vehicle.driversPerVehicleList = [];
    }      
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._vehicle = new Vehicle();
    this._vehicle.id=-1;
    this._vehicle.observation="";
    this._vehicle.active = true;
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }

   showModalTrailer()
  {
    this.modalTrailer.visible = true;
    if(this._vehicle.vehicleTrailer.trim() == ""){
      this.modalTrailer._vehicle.vehicleTrailerID = -1
      this.modalTrailer._vehicle.vehicleTrailer = "";
      this.modalTrailer._vehicle.trailerSetupDate = new Date(1900,0,1);
      this.modalTrailer._vehicle.trailerObservation = "";
    }
        
   }

   showModalDriver()
  {
    this.modalDrivers.visible = true;    
    this.modalDrivers.identifierToEdit=-1; 
    this.modalDrivers._driversPerVehicle = new DriversPerVehicle();
   }

   showDriversMenu(event: Event, menu: Menu, index: number){    
    this.selectedDriverIndex = index;
    menu.toggle(event);
  }

   onSubmitTrailer()
   {     
     this._vehicle.vehicleTrailerID = this.modalTrailer._vehicle.vehicleTrailerID;
     this._vehicle.vehicleTrailer = this.modalTrailer._vehicle.vehicleTrailer;
     this._vehicle.trailerSetupDate = this.modalTrailer._vehicle.trailerSetupDate;
     this._vehicle.trailerObservation = this.modalTrailer._vehicle.trailerObservation;       
   }

   onSubmitDrivers(data){    
    if(data.identifier == -1)
    data._driversPerVehicle.idDriverVehicle = -1;

    var error = this.validateDrivers(data._driversPerVehicle, data.identifier);

    if(error===null){
      if(data.identifier == -1){
        var Cont = 0;
        this._vehicle.driversPerVehicleList = [];
        this._vehicle.driversPerVehicleList = this._vehicle.driversPerVehicleList.concat(this._driverPerVehicleCopy);
        this._vehicle.driversPerVehicleList.forEach(element => {
          this._vehicle.driversPerVehicleList[Cont].idVehicle = this._vehicle.id;
          Cont = Cont + 1 ;
        });
      }else{
        this._vehicle.driversPerVehicleList.splice(data.identifier, 1, this._driverPerVehicleCopy[0]);
      }
    }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        //this.addressDialog.edit(data.address, this.selectedAddressIndex);
    }
  }

  validateDrivers(pdriverpervehicle: DriversPerVehicle, identifier: number)
  {
    this._driverPerVehicleCopy = [];
    this._vehicle.driversPerVehicleList.forEach(element => {
      this._driverPerVehicleCopy.push(element);
    });
    if(identifier == -1){
      this._driverPerVehicleCopy.push(pdriverpervehicle);
    }else{
      this._driverPerVehicleCopy.splice(identifier, 1, pdriverpervehicle);
    }
    var DriverType = this._driverPerVehicleCopy.filter(x=>x.idTypeDriver == 1);
    // var index = this.pdriverpervehicle.contactNumbers.findIndex(x=>x.idCountry==contactNumber.idCountry && x.number == contactNumber.number);

    if(pdriverpervehicle.idTypeDriver == 1 && DriverType.length > 1)
    {
      return "Ya se encuentra registrado un conductor principal.";
    }
    else
    {
      return null;      
    }
    // }else
    // {
    //   if(index>=0 && index==identifier || index < 0){
    //     return null;
    //   }else{
    //     return "El número de télefono ya se ha agregado previamente a la lista.";
    //   }
    // }
  }

   cleanText(){    
    this._vehicle.vehicleTrailerID = -1;
    this._vehicle.vehicleTrailer = "";
    this._vehicle.trailerSetupDate = new Date(1900,0,1);
    this._vehicle.trailerObservation = "";
   }

   onSubmitOperator(data)
   {
     this._vehicle.vehicleOwnerID=data.operator.id;
     this._vehicle.vehicleOwner=data.operator.name;
       
   }

   onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

  editVehicle(pVehicle: Vehicle){       
    this.ngOnInit();
    this._showInput = true;
    this._status = pVehicle.active;     
    this._vehicle = new Vehicle();
    this._vehicle.id = pVehicle.id;
    this._vehicle.vehicleTypeID = pVehicle.vehicleTypeID;
    this._vehicle.vehicleModelID = pVehicle.vehicleModelID;
    this._vehicle.vehicleOwnerID = pVehicle.vehicleOwnerID;
    this._vehicle.vehicleTrailerID = pVehicle.vehicleTrailerID;
    this._vehicle.createdByUserId = pVehicle.createdByUserId;
    this._vehicle.updatedByUserId = pVehicle.updatedByUserId;
    this._vehicle.active = pVehicle.active;
    this._vehicle.creationDate = pVehicle.creationDate;    
    this._vehicle.kilometers = pVehicle.kilometers;
    this._vehicle.chargeCapacity = pVehicle.chargeCapacity;
    this._vehicle.motorSerialNumber = pVehicle.motorSerialNumber;
    this._vehicle.observation = pVehicle.observation;
    this._vehicle.trailerObservation = pVehicle.trailerObservation;
    this._vehicle.trailerSetupDate = pVehicle.trailerSetupDate;
    this._vehicle.vehicleCode = pVehicle.vehicleCode;
    this._vehicle.vehicleColor = pVehicle.vehicleColor;
    this._vehicle.vehicleDriver = pVehicle.vehicleDriver == null ? "" : pVehicle.vehicleDriver;
    this._vehicle.vehicleTrailer = pVehicle.vehicleTrailer == null ? "" : pVehicle.vehicleTrailer;
    this._vehicle.updateDate = pVehicle.updateDate;
    this._vehicle.creationDate = pVehicle.creationDate;
    this._vehicle.vehicleModel = pVehicle.vehicleModel;
    this._vehicle.vehicleOwner = pVehicle.vehicleOwner;
    this._vehicle.vehiclePicture = pVehicle.vehiclePicture;
    this._vehicle.vehicleRegistrationPlate = pVehicle.vehicleRegistrationPlate;
    this._vehicle.vehicleType = pVehicle.vehicleType;
    this._vehicle.vehicleYear = pVehicle.vehicleYear;
    this._vehicle.driversPerVehicleList = pVehicle.driversPerVehicleList == null ? [] : pVehicle.driversPerVehicleList;
    this.showDialog = true;        
  }

  save(){   
    this.loadingService.startLoading();  
    this._vehicleService.InsertUpdateVehicle(this._vehicle).subscribe((data) => {
     if (data.idResponseCode == 0)
      {
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
         this._vehicle= new Vehicle();
         this._vehicle.active = true;               
         this._vehicleService.getVehiclesList(this.filters).subscribe((data: Vehicle[]) => {
         this._vehicleService._vehicleList = data;
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
        this.loadingService.stopLoading();
      });      
      this.loadingService.stopLoading();
 }

 submit()
  {    
    this.submitted = true;
    if(this._vehicle.vehicleOwnerID > 0 && this._vehicle.vehicleModelID > 0 
      && this._vehicle.vehicleTypeID > 0 && this._vehicle.vehicleRegistrationPlate.trim() != "")
    {
      this._vehicle.id == 0 ? -1 : this._vehicle.id;
      if(this._status==this._vehicle.active ||this._vehicle.active)
      {      
        this.save();
      }
      else{
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
