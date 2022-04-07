import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Vehicle } from 'src/app/models/tms/vehicle';
import { VehicleFilter } from '../../filter/vehicle-filter';
import { VehicleService } from '../../service/vehicle.service';

@Component({
  selector: 'app-modal-aggregate-trailer',
  templateUrl: './modal-aggregate-trailer.component.html',
  styleUrls: ['./modal-aggregate-trailer.component.scss']
})
export class ModalAggregateTrailerComponent implements OnInit 
{
  _submitted: boolean = false;
  _vehicle : Vehicle = new Vehicle();
  _filter : VehicleFilter = new VehicleFilter();
  trailerList: SelectItem[];
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{_vehicle: Vehicle}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();

  constructor(public _vehicleService: VehicleService) { }

  ngOnInit(): void {   
    this._vehicle.trailerSetupDate = new Date();
    this._filter.vehicleTypeID = 2;
    this._filter.active = 1;
    this._vehicleService.getVehiclesList(this._filter)
    .subscribe((data)=>{
      this.trailerList = data.map<SelectItem>((item)=>({
        label: item.vehicleCode,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    }); 
  }

  onShow(){    
    this.ngOnInit();
  }

  onHide(){    
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  submit(){    
    var _selectTrailer = this.trailerList.find(obj => obj.value == this._vehicle.vehicleTrailerID);
    this._vehicle.vehicleTrailer = _selectTrailer.label;
    this.visible = false;   
    this.onSubmit.emit();
  }

}
