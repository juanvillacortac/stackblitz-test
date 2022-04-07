import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Device } from 'src/app/models/masters/device';
import { BrandsService } from '../../brand/shared/services/brands.service';
import { DeviceTypeService } from '../../device-types/shared/services/device-type.service';
import { DeviceFilter } from '../shared/filters/device-filter';
import { DeviceService } from '../shared/services/device.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-device-panel',
  templateUrl: './device-panel.component.html',
  styleUrls: ['./device-panel.component.scss']
})
export class DevicePanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataDevice") _dataDevice: Device ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: DeviceFilter;
  _validations : Validations = new Validations();
  submitted: boolean;
  brandsList : SelectItem[];
  deviceTypeList : SelectItem[];
  statuslist: SelectItem[] = [ { 
    label: 'Activo', value: true},
  { label: 'Inactivo', value: false}];
  constructor(private _DeviceService: DeviceService,
              private messageService: MessageService ,
              private _DeviceTypeService: DeviceTypeService,
              private _BrandService: BrandsService,
              ) { }

  ngOnInit(): void {
    this.submitted = false;
    this._BrandService.getBrandsList(
      {
        id:-1,
        name:"",
        active:1,
        idClass:-1,
        abbreviation:""
      })
    .subscribe((data)=>{
      this.brandsList = data.sort((a, b) => a.name.localeCompare(b.name)).filter(brand => brand.id != 0 ).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });  
    this._DeviceTypeService.getdeviceTypeList(
      {
        Id:-1,
        Active:1,
        Name: "",
        Abbreviation:"" 
      })
    .subscribe((data)=>{
      this.deviceTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
    if(this._dataDevice.id<=0)
    this._dataDevice.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataDevice = new Device();
    this._dataDevice.id = -1;
    this._dataDevice.active = true;
  }

  saveDevice() {
    this._dataDevice.isdisabled=true;
    this._dataDevice.idDeviceType = this.deviceTypeList.filter(x => x.value == this._dataDevice.idDeviceType).length> 0 ? this._dataDevice.idDeviceType : -1;
    this._dataDevice.idBrand = this.brandsList.filter(x => x.value == this._dataDevice.idBrand).length> 0 ? this._dataDevice.idBrand : -1;
    this.submitted = true;
     if(this._dataDevice.abbreviation!= "")
       {
        this._dataDevice.abbreviation = this._dataDevice.abbreviation.toLocaleUpperCase();
       }
    if (this._dataDevice.name != "" && this._dataDevice.name.trim() && this._dataDevice.idBrand  > 0 && this._dataDevice.idDeviceType  > 0) {
     if(this._dataDevice.name.trim().toLocaleUpperCase() !== this._dataDevice.abbreviation.trim().toLocaleUpperCase()){
      if(this._dataDevice.name = this._dataDevice.name.charAt(0).toLocaleUpperCase() + this._dataDevice.name.substr(1).toLowerCase()){
      this._DeviceService.UpdateDevice(this._dataDevice).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataDevice= new Device();
               this._dataDevice.active = true;
               this._DeviceService.getdeviceList(this.filters).subscribe((data: Device[]) => {
               this._DeviceService._deviceList = data;
              });
              
              this.submitted = false;
              
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
            }
            else if(data == -3) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
            }
            //window.location.reload();
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          });
       
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
  }
  this._dataDevice.isdisabled=false;
  }
  
}
