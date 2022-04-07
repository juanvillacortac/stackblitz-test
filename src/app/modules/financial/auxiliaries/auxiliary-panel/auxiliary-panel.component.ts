import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AuxiliaryService } from 'src/app/modules/financial/auxiliaries/shared/services/auxiliary.service'
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AuxiliaryFilter } from 'src/app/models/financial/AuxiliaryFilter';

@Component({
  selector: 'app-auxiliary-panel',
  templateUrl: './auxiliary-panel.component.html',
  styleUrls: ['./auxiliary-panel.component.scss']
})
export class AuxiliaryPanelComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input("showDialog") showDialog: boolean = true;

  @Input("_data") _data: Auxiliary = new Auxiliary();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  @Input("filters") filters: AuxiliaryFilter; 
  model: Auxiliary = new Auxiliary();
  _validations: Validations = new Validations();
  submitted = false
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  nomString = false;
  saving :boolean;

  constructor(private service: AuxiliaryService, private messageService: MessageService) {

  }
  
  onBlurEvent(event: any) {
   debugger
    if (event.target.value=="" || event.target.value==" ") {
      this.nomString = true;
    }
    else {
      this.nomString = false;
    }   
  }
  ngOnInit(): void {
    this.saving = false
    this.submitted = false;

    if (this._data.id <= 0)
      this._data.activo = true
  }

  hideDialog(): void {
  
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this._data.id = -1;
    this._data.auxilliaryName =" ";
    this._data.activo = true
   
  }

  isNan(value: any): boolean {
    if (value != "") {
      if (isNaN(+value))
        return true;
      else
        return false
    }
    else
      return true;
  }



  save(){
    debugger
    
    this.submitted = true;
    if (this._data.auxilliaryName != "" && this._data.auxilliaryName.trim()) {
     this.messageService.clear();
     this.saving = true 
      this.service.postAuxiliary(this._data).subscribe((data) => {
        if (data > 0) {
         
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          this.onUpdate.emit();
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.saving = false;
        }
        else if (data == -3) {
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
}
