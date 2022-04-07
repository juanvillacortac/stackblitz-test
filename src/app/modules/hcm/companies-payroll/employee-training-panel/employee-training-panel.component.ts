import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { EmployeeTrainingDetail } from '../../shared/models/laborRelationship/employee-training-detail';
import { Training } from '../../shared/models/laborRelationship/training';
import { EmployeeTrainingDetailViewModel } from '../../shared/view-models/employee-training-viewmodel';

@Component({
  selector: 'app-employee-training-panel',
  templateUrl: './employee-training-panel.component.html',
  styleUrls: ['./employee-training-panel.component.scss']
})
export class EmployeeTrainingPanelComponent implements OnInit {

  constructor() { }

  @Input() trainingArray: EmployeeTrainingDetail[]; 
  @Input() record: EmployeeTrainingDetailViewModel;
  @Input() showSidebar: boolean;
  @Input() maxDate: Date;

  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveRecord: EventEmitter<EmployeeTrainingDetailViewModel> = new EventEmitter<EmployeeTrainingDetailViewModel>();

  submitted: boolean = false;
  trainingDropdown: SelectItem[] = [];
  trainingList: EmployeeTrainingDetail[];

  //  = [{label: "Primero", value: 1},{label: "Segundo", value: 2},{label: "Tercero", value: 3},];
  trainingTypeDropdown = [{label:"Curso", value:1},{label:"Evaluación", value:2}];
  trainingString: string = "";
  showInputTraining: boolean = false;
  labelDropdown: number;
  descriptionDropdown: string = "";
  fullData: boolean = false;
  maxDateInit: Date;
  assignedValueMessage: string = "";


  ngOnInit(): void {
    this.loadTrainingSelect();
    this.maxDateInit = this.maxDate;
  }

  loadTrainingSelect(){
    this.trainingList = this.trainingArray.filter(x => !x.active)
  }

  changeTrainingSelect(){
    this.trainingDropdown = this.trainingList.filter(x => x.idTrainingType == this.record.idTrainingType).map((item)=>({
      label: item.description,
      value: item.idTraining
    }));
    this.record.naming = "";
    this.record.objective = null;
    this.submitted = false;
    this.labelDropdown = null;
    this.dataComplete();
  }

  changeMaxDateInit(){
    this.maxDateInit = this.record.endDateCalendar;
  }

  assignedValueChange(value: number){
    if(value == null){
      this.assignedValueMessage = "El valor es requerido";
    }else{
      if(value <= 0){
        this.assignedValueMessage = "El valor debe ser mayor a cero";
      }else{
        this.assignedValueMessage = "";
      }
    }
  }

  submit(){
    debugger;
    this.assignedValueChange(this.record.assignedValue);

    if(this.fullData && this.assignedValueMessage == "" && this.record.startDateCalendar != null && this.record.endDateCalendar != null){
      if(this.labelDropdown){
        this.record.idTraining = this.labelDropdown;
      }else{
        this.record.idTraining = -1;
        this.record.description = this.descriptionDropdown;
      }

      if(this.record.idTrainingType == 1 && this.record.assignedValue > this.record.objective){
        this.assignedValueMessage = "El valor no puede ser superior al objetivo";
        this.submitted = true;
      }else{
        this.assignedValueMessage = "";
        this.submitted = false;
        this.saveRecord.emit(this.record)
      }


    }else{
      this.submitted = true;
    }
  }

  dataComplete(){
    if(this.record.idTrainingType != -1 && this.record.objective > 0 && this.record.naming != "" && 
    (this.labelDropdown || this.descriptionDropdown != "")){
      this.fullData = true;
    }else{
      this.fullData = false;
      this.record.assignedValue = null;
      this.record.endDateCalendar = null;
      this.record.startDateCalendar = null;
      this.maxDateInit = this.maxDate;
    }
  }

  changeDescription(){
    this.showInputTraining = !this.showInputTraining;
    this.descriptionDropdown = "";
    this.labelDropdown = null;
    this.record.naming = "";
    this.record.objective = null;
    this.submitted = false;
    this.dataComplete();
  }

  selectTraining(){
    var trainigOption = this.trainingArray.find(x => x.idTraining == this.labelDropdown);
    this.record.objective = parseFloat(trainigOption.objective.toString());
    this.record.naming = trainigOption.naming;
    this.fullData = true;
    this.record.assignedValue = null;
    this.record.endDateCalendar = null;
    this.record.startDateCalendar = null;
    this.maxDateInit = this.maxDate;
    //this.record.idTraining = this.labelDropdown.value;

  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }

}
