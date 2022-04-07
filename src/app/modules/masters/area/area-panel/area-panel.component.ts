import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/masters/area';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { BranchofficeService } from '../../branchoffice/shared/services/branchoffice.service';
import { AreaFilter } from '../shared/filters/area-filter';
import { AreaService } from '../shared/services/area.service';

@Component({
  selector: 'app-area-panel',
  templateUrl: './area-panel.component.html',
  styleUrls: ['./area-panel.component.scss']
})
export class AreaPanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataArea") _dataArea: Area;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: AreaFilter;
  _validations : Validations = new Validations();
  submitted: boolean;
  BranchOfficeList : SelectItem[];
  AreaTypeList : SelectItem[];
  statuslist: SelectItem[] = [ { 
    label: 'Activo', value: true},
  { label: 'Inactivo', value: false}];
  
  constructor(private _areaService : AreaService ,
    private _branchofficeService: BranchofficeService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.submitted = false;
    this._areaService.getareaTypeList()
    .subscribe((data)=>{
      this.AreaTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });  
    this._branchofficeService.getBranchOfficeList(
      {
        active : 1
      })
    .subscribe((data)=>{
      this.BranchOfficeList = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName)).map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    });  
    if(this._dataArea.id<=0)
    this._dataArea.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataArea = new Area();
    this._dataArea.id = -1;
    this._dataArea.active = true;
  }


  
  saveArea() {
    this._dataArea.isdisabled=true;
    this.submitted = true;
    this._dataArea.idAreaType = this.AreaTypeList.filter(x => x.value == this._dataArea.idAreaType).length> 0 ? this._dataArea.idAreaType : -1;
    this._dataArea.idBranchOffice = this.BranchOfficeList.filter(x => x.value == this._dataArea.idBranchOffice).length> 0 ? this._dataArea.idBranchOffice : -1;
    if(this._dataArea.abbreviation!= "")
    {
     this._dataArea.abbreviation = this._dataArea.abbreviation.toLocaleUpperCase();
    }
    if (this._dataArea.name != "" && this._dataArea.name.trim() && this._dataArea.idAreaType  > 0 && this._dataArea.idBranchOffice  > 0 ) {
     if(this._dataArea.name.trim().toLocaleUpperCase() !== this._dataArea.abbreviation.trim().toLocaleUpperCase())
     {
      if(this._dataArea.name = this._dataArea.name.charAt(0).toLocaleUpperCase() + this._dataArea.name.substr(1).toLowerCase()){
      this._areaService.UpdateArea(this._dataArea).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataArea= new Area();
               this._dataArea.active = true;
               this._areaService.getareaList(this.filters).subscribe((data: Area[]) => {
               this._areaService._areaList = data;
              });
              
              this.submitted = false;
              
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El Nombre ya se encuentra registrado." });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo de area seleccionada." });
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
       
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
}
   this._dataArea.isdisabled=false;
  }

}
