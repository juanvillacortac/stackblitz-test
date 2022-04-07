import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DriverFilter } from '../../../master-driver/shared/filter/driver-filter';
import { DriverService } from '../../../master-driver/shared/service/driver.service';
import { VehicleFilter } from '../../shared/filter/vehicle-filter';
import { VehicleService } from '../../shared/service/vehicle.service';

@Component({
  selector: 'app-master-vehicle-filter',
  templateUrl: './master-vehicle-filter.component.html',
  styleUrls: ['./master-vehicle-filter.component.scss']
})
export class MasterVehicleFilterComponent implements OnInit 
{

  @Input("expanded") expanded : boolean = true;
  @Input("filters") filters : VehicleFilter;
  @Input("loading") loading : boolean = false;

  multiples:boolean=false;
  model:boolean=false;
  flag:boolean=false;
  _showdialog: boolean = false;
  _showdialog2:boolean = false;
  statusList: SelectItem[];
  VehicleModelList: SelectItem[];
  VehicleTypeList: SelectItem[];
  driverList: SelectItem[];
  _driverfilter: DriverFilter = new DriverFilter();

  @Output("onSearch") onSearch = new EventEmitter<VehicleFilter>();
  constructor(private Service: VehicleService,public _driverService: DriverService) 
  { 
    this.statusList=[
      { label: 'Todos', value: '-1' },
      { label: 'Activo', value: '1'},
      { label: 'Inactivo', value: '0'}
      ];
  }

  ngOnInit(): void 
  {
    this.loadFilters();
  }

  loadFilters(){      
    this.Service.getVehicleModelList()
    .subscribe((data)=>
    {
      this.VehicleModelList = data.map<SelectItem>((item)=>({
        label: item.vehicleModel,
        value: item.id
      }));
      this.VehicleModelList.sort(function(a, b){
        if(a.label < b.label) { return -1; }
        if(a.label > b.label) { return 1; }
        return 0;
    });
    },
    (error)=>
    {
      console.log(error);
    });

    this.Service.getVehicleTypeList()
    .subscribe((data)=>{
      this.VehicleTypeList = data.map<SelectItem>((item)=>({
        label: item.vehicleType,
        value: item.vehicleTypeID
      }));
    },(error)=>{
      console.log(error);
    });

    this._driverfilter.idTypeDriver = 1;
    this._driverService.getDriversList(this._driverfilter)
    .subscribe((data)=>{
      data.sort((a, b) => a.userDriver.localeCompare(b.userDriver));
      this.driverList = data.map<SelectItem>((item)=>({
        label: item.userDriver,
        value: item.id
      }));
    }); 
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters()
  {
    this.filters.iD = -1;
    this.filters.principalDriverID = -1;
    this.filters.principalDriver = "";
    this.filters.vehicleModelID = -1;
    this.filters.vehicleTypeID = -1;
    this.filters.vehicleRegistrationPlate = "";
    this.filters.active= -1;
    this.filters.vehicleCode="";
    this.filters.vehicleOwnerID=-1;
    this.filters.vehicleOwner="";
  }

  showmodal(multples:boolean,models:boolean,flag:boolean=false)
  {    
    this.flag = flag;
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
  }


  onSubmitOperator(data)
  {
    if(!this.flag){
    this.filters.principalDriverID = data.operator.id;
    this.filters.principalDriver = data.operator.name;
    }
    else{
    this.filters.vehicleOwnerID = data.operator.id;
    this.filters.vehicleOwner = data.operator.name;   
    }
  }
  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

  onSubmitOwner(data)
  {
       
  }

  onHideOwner(visible: boolean){
    this._showdialog= visible;
  }

  

}
