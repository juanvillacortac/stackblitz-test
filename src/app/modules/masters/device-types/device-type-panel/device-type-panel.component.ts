import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DeviceType } from 'src/app/models/masters/device-type';
import { DeviceTypeFilter } from '../shared/filters/device-type-filter';
import { DeviceTypeService } from '../shared/services/device-type.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-device-type-panel',
  templateUrl: './device-type-panel.component.html',
  styleUrls: ['./device-type-panel.component.scss']
})
export class DeviceTypePanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataDeviceType") _dataDeviceType: DeviceType ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: DeviceTypeFilter;
  _validations : Validations = new Validations();
  submitted: boolean;
  statuslist: SelectItem[] = [ { 
    label: 'Activo', value: true},
  { label: 'Inactivo', value: false}];
  constructor(private _DeviceTypeService: DeviceTypeService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    if(this._dataDeviceType.id<=0)
    this._dataDeviceType.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataDeviceType = new DeviceType();
    this._dataDeviceType.id = -1;
    this._dataDeviceType.active = true;
  }

  saveDeviceType() 
  {
    this._dataDeviceType.isdisabled=true;
    this.submitted = true;
    if(this._dataDeviceType.abbreviation!= "")
    {
     this._dataDeviceType.abbreviation = this._dataDeviceType.abbreviation.toLocaleUpperCase();
    }
    if (this._dataDeviceType.name != "" && this._dataDeviceType.name.trim()) {
     if(this._dataDeviceType.name.trim().toLocaleUpperCase() !== this._dataDeviceType.abbreviation.trim().toLocaleUpperCase())
      {
         if(this._dataDeviceType.active)
         {
          this.Save()
          }
          else
        {
        this.confirmationService.confirm({
          header: 'Confirmación',
           icon: 'pi pi-exclamation-triangle',
            message: 'Si inactiva un tipo dispositivo las configuraciones asociadas\ a este se dejarán de visualizar, desea proceder con la acción?',
           accept: () => {
               this.Save();
             },
       });
      }
      }
      }
      this._dataDeviceType.isdisabled=false;
  }
  Save()
  {
    this._DeviceTypeService.UpdateDeviceType(this._dataDeviceType).subscribe((data) => {
      if (data> 0) {
             this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
             this._dataDeviceType= new DeviceType();
             this._dataDeviceType.active = true;
             this._DeviceTypeService.getdeviceTypeList(this.filters).subscribe((data: DeviceType[]) => {
             this._DeviceTypeService._deviceTypeList = data;
            });
            
            this.submitted = false;
            
            
          }else if(data == -1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          } 
          else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada." });
          }
          else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          }
          //window.location.reload();
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        });
  }

}