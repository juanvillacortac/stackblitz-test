import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { LaborRelationshipxGroupingViewModel } from '../../shared/view-models/labor-relationship-grouping-viewmodel'

@Component({
  selector: 'app-labor-relationship-grouping-panel',
  templateUrl: './labor-relationship-grouping-panel.component.html',
  styleUrls: ['./labor-relationship-grouping-panel.component.scss']
})
export class LaborRelationshipGroupingPanelComponent implements OnInit {

  @Input() record: LaborRelationshipxGroupingViewModel;
  @Input() showSidebar: boolean;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<LaborRelationshipxGroupingViewModel> = new EventEmitter<LaborRelationshipxGroupingViewModel>();
  submitted: boolean = false;
  assignedValue: number;
  _validations:Validations = new Validations();

  constructor() { }

  ngOnInit(): void {
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }

  submit(){
    document.getElementById("Agregar").setAttribute("disabled","disabled");
    var error = false;
    if(this.record.abbreviation == "" || this.record.groups == ""){
      error = true;
      this.submitted = true;
      document.getElementById("Agregar").removeAttribute("disabled");
    }else{
      if(this.assignedValue == undefined || this.assignedValue == null){
        this.assignedValue = 0;
      }
      this.record.assignedValue = this.assignedValue.toString();
      this.recordSave.emit(this.record);
    }
  }

  validateAssignedValue(event){
    var inp = this.record.assignedValue+(String.fromCharCode(event.keyCode));
    debugger;
    if (/^([0-9]+(\.[0-9]{0,3})?|[A-Za-zäÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\-_0-9]([A-Za-zäÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\-_0-9\s]+)?)$/.test(inp)) { //si cumple el formato  | 
        return true;                 //no hagas nada
    } else {
      event.preventDefault();
      return false;                  //manda el error
    }
  }
}
