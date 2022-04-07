import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Driver } from 'src/app/models/tms/driver';
import { DriversPerVehicle } from 'src/app/models/tms/driverspervehicle';
import { DriverFilter } from 'src/app/modules/tms/master-driver/shared/filter/driver-filter';
import { DriverService } from 'src/app/modules/tms/master-driver/shared/service/driver.service';

@Component({
  selector: 'app-modal-aggregate-vehicle-driver',
  templateUrl: './modal-aggregate-vehicle-driver.component.html',
  styleUrls: ['./modal-aggregate-vehicle-driver.component.scss']
})
export class ModalAggregateVehicleDriverComponent implements OnInit {
  multiples:boolean=false;
  model:boolean=false;
  _submitted: boolean = false;
  _showdialog: boolean = false;
  _driversPerVehicle : DriversPerVehicle = new DriversPerVehicle();
  _driverfilter: DriverFilter = new DriverFilter();
  _driver: Driver[];
  identifierToEdit: number = -1;
  //_filter : VehicleFilter = new VehicleFilter();
  typeDriverList: SelectItem[];
  driverList: SelectItem[];
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{_driversPerVehicle: DriversPerVehicle, identifier:number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();

  constructor(public _driverService: DriverService) { }

  ngOnInit(): void {
    this._driverService.getTypeDriversList()
    .subscribe((data)=>{
      this.typeDriverList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 

    this._driverfilter.active = 1;
    this._driverService.getDriversList(this._driverfilter)
    .subscribe((data)=>{
      this.driverList = data.map<SelectItem>((item)=>({
        label: item.userDriver,
        value: item.idUserDriver
      }));
    });    
  }

  onShow(){    
    this.ngOnInit();

  }

  onHide(){    
  }

  changeDriver(idDriver: number){
    this._driverfilter = new DriverFilter();
    this._driverfilter.id = idDriver;
    this._driverfilter.active = 1;    
    this._driverService.getDriversList(this._driverfilter)
    .subscribe((data: Driver[])=>{
      data.sort((a, b) => a.userDriver.localeCompare(b.userDriver));
      this._driver = data;  
      });      
      this._driversPerVehicle.idTypeDriver = this._driver[0].idTypeDriver;
  }

  changeLoadTypeDriver(idTypeDriver: number){
    this._driverfilter = new DriverFilter();
    this._driverfilter.active = 1;
    this._driverfilter.idTypeDriver = idTypeDriver;
    this._driverService.getDriversList(this._driverfilter)
    .subscribe((data)=>{
      data.sort((a, b) => a.userDriver.localeCompare(b.userDriver));
      this.driverList = data.map<SelectItem>((item)=>({
        label: item.userDriver,
        value: item.id
      }));
    });  
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  
  edit(driver: DriversPerVehicle, identifier: number){    
    this._driversPerVehicle = Object.assign({}, driver);
    this.identifierToEdit = identifier;
    this.visible = true;
  }

  submit(){
    this._submitted = true;
    
    if(this._driversPerVehicle.idDriver > 0 
      && this._driversPerVehicle.idTypeDriver > 0 
      && this._driversPerVehicle.driverAssignmentDate.toString() != "19000101")
    {
      this._driversPerVehicle.driver = this.driverList.find(x=>x.value == this._driversPerVehicle.idDriver).label;
      this._driversPerVehicle.typeDriver = this.typeDriverList.find(x=>x.value == this._driversPerVehicle.idTypeDriver).label;
      this.onSubmit.emit({
        _driversPerVehicle: this._driversPerVehicle,
        identifier: this.identifierToEdit
      });
      this._submitted = false;
      this.visible = false;
    }    
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }

   onSubmitOperator(data)
   {
     this._driversPerVehicle.idDriver = data.operator.id;
    this._driversPerVehicle.driver=data.operator.name;
       
   }

   onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

}
