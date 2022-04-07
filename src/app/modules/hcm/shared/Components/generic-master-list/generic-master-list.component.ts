import { Component,Input, OnInit,EventEmitter, Output} from '@angular/core';
import { MedicalCondition } from '../../models/laborRelationship/medical-condition';
import { FamilyBurden } from '../../models/laborRelationship/family-burden';
import { MaintenanceClaim } from '../../models/laborRelationship/maintenance-claim';


@Component({
  selector: 'app-generic-master-list',
  templateUrl: './generic-master-list.component.html',
  styleUrls: ['./generic-master-list.component.scss']
})
export class GenericMasterListComponent implements OnInit {

  constructor() { }

  @Input()
  genericModel: any[];
  @Input()
  cols: any[]; 
  @Input() indicator: number;
  showDialog: boolean = false;
  @Input("ModelPanel") ModelPanel: any[];
  Modelin: any[];
  title: string = "";
  checks : boolean = false;
  count: number = 0;
  @Output() returnData1: EventEmitter<MedicalCondition> = new EventEmitter<MedicalCondition>();
  @Output() returnData2: EventEmitter<FamilyBurden> = new EventEmitter<FamilyBurden>();
  @Output() returnData3: EventEmitter<MaintenanceClaim> = new EventEmitter<MaintenanceClaim>();


  ngOnInit(): void {
    this.addTitle(this.indicator);
  }

  ngAfterViewInit(): void {
  }

  defineIndicator(){
    if(this.indicator == 2){
      this.checks = true;
    }
  }

  add(){

  }

  edit(Modelinput, id: number): void{
    switch (id) {
      case 1:
        this.returnData1.emit(Modelinput);
        break;
      case 2:
        this.returnData2.emit(Modelinput);
        break;
      case 3:
        this.returnData3.emit(Modelinput);
        break;
      default:
        break;
    }
    this.showDialog = true;
    this.Modelin = Modelinput;
  }

  addTitle(id: number){
    switch (id) {
      case 1:
        this.title = "Afecciones médicas";
        break;
      case 2:
        this.title = "Cargas familiares";
        break;
      case 3:
        this.title = "Pensiones alimentarias";
        break;
      default:
        break;
    }
  }


}
