import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { GroupinginventoryreasonService } from '../../grouping-inventory-reasons/shared/service/groupinginventoryreason.service';
import { InventoryReasonFilter } from '../shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../shared/services/inventory-reason.service';

@Component({
  selector: 'app-inventory-reason-panel',
  templateUrl: './inventory-reason-panel.component.html',
  styleUrls: ['./inventory-reason-panel.component.scss']
})
export class InventoryReasonPanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataInventoryReason") _dataInventoryReason: InventoryReasons ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: InventoryReasonFilter;
  _validations : Validations = new Validations();
  submitted: boolean;
  InventoryReasonConfigList : SelectItem[];
  GroupingInventoryReasonList : SelectItem[];
  statuslist: SelectItem[] = [ { 
    label: 'Activo', value: true},
  { label: 'Inactivo', value: false}];
  valid: RegExp = /^[a-zA-ZÀ-ú\sñÑ] *$/

  constructor(public _InventoryReasonService: InventoryReasonService , public _GroupingInventoryReasonService : GroupinginventoryreasonService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.submitted = false;
    this._InventoryReasonService.getinventoryReasonConfigurationList()
    .subscribe((data)=>{
      this.InventoryReasonConfigList = data.map<SelectItem>((item)=>({
        label: item.name + " " + "( "+item.symbol+")",
        value: item.id
      }));
    });  

    this._GroupingInventoryReasonService.getgroupingInventoryReasonsList({
      id : -1, active : 1, name:"" })
    .subscribe((data)=>{
      this.GroupingInventoryReasonList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 
 
    if(this._dataInventoryReason.id<=0)
    this._dataInventoryReason.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataInventoryReason = new InventoryReasons();
    this._dataInventoryReason.id = -1;
    this._dataInventoryReason.active = true;
  }

  saveInventoryReason() {
    this.submitted = true;
    this._dataInventoryReason.idGroupingInventoryReason = this.GroupingInventoryReasonList.filter(x => x.value == this._dataInventoryReason.idGroupingInventoryReason).length> 0 ? this._dataInventoryReason.idGroupingInventoryReason : -1;
    if (this._dataInventoryReason.name != "" && this._dataInventoryReason.name.trim() && this._dataInventoryReason.idConfiguration  > 0 && this._dataInventoryReason.idGroupingInventoryReason  > 0) {
      if(this._dataInventoryReason.name = this._dataInventoryReason.name.charAt(0).toLocaleUpperCase() + this._dataInventoryReason.name.substr(1).toLowerCase()){
      this._InventoryReasonService.UpdateInventoryReason(this._dataInventoryReason).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataInventoryReason= new InventoryReasons();
               this._dataInventoryReason.active = true;
               this._InventoryReasonService.getinventoryReasonList(this.filters).subscribe((data: InventoryReasons[]) => {
               this._InventoryReasonService._inventoryReasonList = data;
              });
              
              this.submitted = false;
              
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Ya existe un registro con este nombre" });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Ya existe un registro con esta abreviatura" });
            }
            else if(data == -3) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Este registro no existe" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
            }
            //window.location.reload();
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
          });
       
        }else {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
  

  }

}
