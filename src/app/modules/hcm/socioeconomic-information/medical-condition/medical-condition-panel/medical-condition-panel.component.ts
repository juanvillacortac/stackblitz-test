import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Patology } from '../../../shared/models/masters/patology';
import { PatologyService } from '../../../shared/services/patology.service';
import { PatologyFilter } from '../../../shared/filters/patology-filter';
import { PatologyType } from '../../../shared/models/masters/patology-type';
import { PatologyTypeService } from '../../../shared/services/patology-type.service';
import { PatologyTypeFilter } from '../../../shared/filters/patology-type-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MedicalCondition } from '../../../shared/models/laborRelationship/medical-condition';
import { MedicalConditionViewModel } from '../../../shared/view-models/medical-condition-viewmodel';



@Component({
  selector: 'app-medical-condition-panel',
  templateUrl: './medical-condition-panel.component.html',
  styleUrls: ['./medical-condition-panel.component.scss'],
  providers: [DatePipe]
})
export class MedicalConditionPanelComponent implements OnInit {

  @Input() record: MedicalConditionViewModel; 
  @Input() showSidebar: boolean;
  @Input() medicalConditionList: MedicalConditionViewModel[];
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<MedicalCondition> = new EventEmitter<MedicalCondition>();

  _patologyList: Patology[] = [];
  patologyFilter: PatologyFilter = new PatologyFilter();
  _patologyTypeList: PatologyType[] = [];
  patologyTypeFilter: PatologyTypeFilter = new PatologyTypeFilter();
  _patologyDropdown: SelectItem[] = [];
  _patologyTypeDropdown: SelectItem[] = [];
  submitted: boolean = false;
  idPatologyType: number = -1;
  startDate: Date;
  startDateText: string ="";
  testDate: Date = new Date();
  
  constructor(private _patologyService: PatologyService,
    public datepipe: DatePipe,
    private _patologyTypeService: PatologyTypeService,
    private messageService: MessageService,) { }

  ngOnInit(): void {
    //debugger;
    console.log(this.record);
    console.log(this.medicalConditionList);
    this.onLoadPatologyTypes();
    this.valuesInitialized();
  }

  onLoadPatologies(){
    this._patologyService.getPatology(this.patologyFilter).subscribe((list) => {
      this._patologyList = list;
      this._patologyDropdown = this._patologyList.sort((a, b) => a.patologyName.localeCompare(b.id.toString())).map<SelectItem>((item)=>({
        label: item.patologyName,     
        value: item.id
      }));
    });
  }

  onLoadPatologyTypes(){
    this._patologyTypeService.getPatologyType(this.patologyTypeFilter).subscribe((list) => {
      this._patologyTypeList = list;
      this._patologyTypeDropdown = this._patologyTypeList.sort((a, b) => a.patologyTypeName.localeCompare(b.id.toString())).map<SelectItem>((item)=>({
        label: item.patologyTypeName,     
        value: item.id
      }));
    });
  }

  updatePatology(){ //actualiza los valores del tipo de segmento cuando se cambia el valor del dropdow Tipo
    this.patologyFilter.idPatologyType = this.record.idPatologyType;
    this.onLoadPatologies();
    var searchPatology = this._patologyList.filter(x => x.id == this.record.idPatologyType);
    this._patologyDropdown = searchPatology.sort((a, b) => a.patologyName.localeCompare(b.id.toString())).map<SelectItem>((item)=>({
      label: item.patologyName,     
      value: item.id
    }));
  }

  submit(){
    //debugger;
    document.getElementById("Agregar").setAttribute("disabled","disabled");
    var error = false;
    var repeat = false;
    var dia = this.testDate.getTime();
    if(this.record.idPatology == -1 || this.record.idPatologyType == -1){
      error = true;
    }
    
    if(this.startDate == null){
      this.startDateText = ""
      this.startDateText = "La fecha de diagnóstico es requerida"
      error = true;
    }else{
       if(Date.parse(this.startDate.toString()) > dia){
         this.startDateText = ""
         this.startDateText = "Debe ingresar una fecha menor o igual a la actual"
         error = true;
       }

       this.medicalConditionList.forEach(element =>{
        if(element.idPatologyType == this.record.idPatologyType && element.idPatology == this.record.idPatology && element.startDate == this.datepipe.transform(this.startDate,'yyyy-MM-dd')){
          repeat = true;
          error = true;
        }
      });
    }
    
    if(error){
      if(repeat){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existe un registro con la misma información"});
      }
      this.submitted = true;
      document.getElementById("Agregar").removeAttribute("disabled");
    }else{
      debugger;
      this.record.startDate = this.datepipe.transform(this.startDate,'yyyy-MM-dd');
      this.recordSave.emit(this.record);
    }
  }

  valuesInitialized(){
    if(this.record.idMedicalCondition == -1){
      this.startDate = null;
    }else{
      this.startDate= new Date(this.record.startDate);
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.updatePatology();
      // this.idPatologyType = (this._patologyList.find(x => x.id == this.record.idPatology)).idPatologyType;
      //this.updatePatology();

      // var day = parseInt(this.record.startDate.substr(-2, 2));
      // day++;
    }
    this.record.observation = "valor";
  }


  outForm(){
    this.backUnChanged.emit(false);
  }

  dateSelected(){
    var dia = this.testDate.getTime();
    if(this.startDateText == null){
      this.startDateText = "La fecha de diagnóstico es requerida";
    }else{
      if(Date.parse(this.startDate.toString()) > dia){
        this.startDateText = "";
        this.startDateText = "Debe ingresar una fecha menor o igual a la actual";
        this.submitted = true;
      }else{
        this.startDateText = "";
      }
    }
  }
}
