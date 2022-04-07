import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { GlobalVariableViewModel } from '../../../shared/view-models/concepts/global-variable-viewmodel';

@Component({
  selector: 'app-global-variables-panel',
  templateUrl: './global-variables-panel.component.html',
  styleUrls: ['./global-variables-panel.component.scss']
})
export class GlobalVariablesPanelComponent implements OnInit {

  @Input() record: GlobalVariableViewModel;
  @Input() showSidebar: boolean;

  @Output() saveData: EventEmitter<GlobalVariableViewModel> = new EventEmitter<GlobalVariableViewModel>();
  @Output() returnUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted: boolean = false;
  _validations:Validations = new Validations();

  varTypeDropdown: SelectItem[] = [];

  listVarType = [
    {id: 1, idVaryingGroup: 1, varyingGroup: "", varyingTypes: "Sistema-Proceso", userCreate: "",userUpdate: ""},
    {id: 2, idVaryingGroup: 1, varyingGroup: "", varyingTypes: "Sistema-Valor fijo", userCreate: "",userUpdate: ""},
    {id: 3, idVaryingGroup: 2, varyingGroup: "", varyingTypes: "Global", userCreate: "",userUpdate: ""}
  ]

  constructor() { }

  ngOnInit(): void {
    this.onLoadDocumentType();
  }

  onLoadDocumentType(){
    //debugger;
    this.varTypeDropdown = this.listVarType.sort((a, b) => a.varyingTypes .localeCompare(b.varyingTypes)).map<SelectItem>((item)=>({
      label: item.varyingTypes,     
       value: item.id
    }));
  }

  submit(){
    document.getElementById("Agregar").setAttribute("disabled","disabled");
    if(this.record.idTypeVarying == -1 || this.record.varying =="" || this.record.description =="" || this.record.value == null){
      this.submitted = true;
      document.getElementById("Agregar").removeAttribute("disabled");
    }else{
      debugger;
      this.saveData.emit(this.record);
    }
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.returnUnChange.emit(false); 
  }

}
