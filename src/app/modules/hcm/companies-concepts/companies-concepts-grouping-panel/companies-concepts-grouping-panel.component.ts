//General
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
//Models
import { GroupingConcepts } from '../../shared/models/concepts/grouping-concept';
import { GroupingxConcept } from '../../shared/models/concepts/grouping-x-concepts';
import { Grouping } from '../../shared/models/laborRelationship/grouping';
//App Services
import { GroupingService } from '../../shared/services/grouping.service';
// Theme ng Prime
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-companies-concepts-grouping-panel',
  templateUrl: './companies-concepts-grouping-panel.component.html',
  styleUrls: ['./companies-concepts-grouping-panel.component.scss']
})
export class CompaniesConceptsGroupingPanelComponent implements OnInit {

  constructor(
    // public userPermissions: UserPermissions,
    public _groupingService: GroupingService,
    public messageService: MessageService) { }

  @Input() showDialog: boolean = true;
  @Input() groupingEdit: GroupingConcepts = new GroupingConcepts();
  //@Input() idConcept: number; 
  @Input() groupingxConcept: GroupingxConcept;
  @Output() showDialogChange = new EventEmitter<boolean>();
  //groupingxConcept: GroupingxConcept = new GroupingxConcept();
  submitted: boolean = false;
  typeOps: any[] = [{name: '+', key: '+'}, {name: '-', key: '-'}, {name: 'Ninguna', key: 'n'}];
  selectedTypeOp:any = this.typeOps[2];


  newGrouping: Grouping = new Grouping();

  ngOnInit(): void {
    //this.selectedTypeOp = this.typeOps[0];
  }
  hideDialog(): void {
    this.submitted = false;
    this.showDialogChange.emit(false);
  }

  saveGrouping(){
    this.newGrouping.abbreviation = this.groupingEdit.abbreviation;
    this.newGrouping.groups = this.groupingEdit.pool;
    this.newGrouping.idGroupingType = 1;
    this.newGrouping.idGrouping = -1;
    debugger;

    if(this.groupingEdit.abbreviation == "" || this.groupingEdit.pool == ""){
      this.submitted = true;
    }else{
      this._groupingService.insertGrouping(this.newGrouping).subscribe((data: number) => {
        if (data > 0) {
          //this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso", life: 5000 });
          if(this.groupingxConcept.clusterDetail == null){
            this.groupingxConcept.clusterDetail = [];
          }
          this.groupingEdit.operationType = this.selectedTypeOp.key;
          this.groupingEdit.idCluster = data;
          this.groupingxConcept.clusterDetail.push(this.groupingEdit);
          this.showDialogChange.emit(true);
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros modulos)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado. (agrupación)" });
        }else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado. (agrupación)" });
        }else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe (agrupación)" });
        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos (agrupación)" });
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al Insertar el regitro." });
      });
    }
  }

}
