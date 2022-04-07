import { Component, OnInit } from '@angular/core';
//Models
import { GroupingxConcept } from '../../shared/models/concepts/grouping-x-concepts';
//Filters
import { GroupingConceptsFilter } from '../../shared/filters/Concepts/groupingconcepts-filter';
//Services
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
//Theme PrimeNG
import { ColumnD } from '../../../../models/common/columnsd';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupingConcepts } from '../../shared/models/concepts/grouping-concept';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-companies-concepts-grouping',
  templateUrl: './companies-concepts-grouping.component.html',
  styleUrls: ['./companies-concepts-grouping.component.scss']
})
export class CompaniesConceptsGroupingComponent implements OnInit {

  constructor(public _conceptsService: ConceptsService,
    public userPermissions: UserPermissions,
    private messageService: MessageService) { }
  groupingConceptFilter = new GroupingConceptsFilter();
  List = [];

  //Variables Locales
  showFilters: boolean = true;
  loading: boolean = false;
  showDialog : boolean = false;
  conceptId : number;
  groupingGeneral : GroupingxConcept = new GroupingxConcept();
  groupingConceptsFilters: GroupingConceptsFilter = new GroupingConceptsFilter();
  typeOps: any[] = [{label: 'Ninguna', value: 'Ninguna'},{label: '+', value: '+'}, {label: '-', value: '-'}];

  newGrouping: GroupingConcepts;
  permissionsIDs = { ...Permissions };

  displayedColumns: ColumnD<GroupingConcepts>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.abbreviation }, header: 'Nomenclature', field: 'nomenclature', display: 'table-cell' },
      { template: (data) => { return data.pool }, header: 'Descripción', field: 'description', display: 'table-cell' }
    ];

  ngOnInit(): void {
    this.conceptId = Number(sessionStorage.getItem('conceptId')??0);
    this.searchGroupingConcepts();
  }

  //Get Data Methods 
  searchGroupingConcepts(){
    debugger;
    this.groupingConceptFilter.idCluster = -1;
    this.groupingConceptFilter.IdConcept = this.conceptId;
    this._conceptsService.GetGroupingConcepts(this.groupingConceptFilter).subscribe((data: GroupingxConcept) => {
      this.groupingGeneral = data;
      this.groupingGeneral.clusterDetail.forEach((el)=>{
        el.operationType = el.operationType === undefined || el.operationType === null || el.operationType === "" ? "n" : el.operationType
      })
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de conceptos" });
    });
  }

  createNew(){
    this.newGrouping = new GroupingConcepts();
    //this.newGrouping.id = -1;
    this.showDialog = true;
  }

  saveGrouping(){
    debugger;
    this.groupingGeneral.clusterDetail.forEach(element => {
      element.indActive = element.operationType == "+"  || element.operationType == "-";
      //element.operationType = element.operationType;
      //this.groupingGeneral.idConcept = this.conceptId;
    });
    this._conceptsService.insertGroupingConcepts(this.groupingGeneral).subscribe((data: number) => {
      debugger;
      if (data == 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso", life: 5000 });
        this.showDialog = false;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al Insertar el regitro." });
    });
  }

  resetValue(value: boolean){
    if(value){
      this.showDialog = false;
      this.saveGrouping();
    }else{
      this.showDialog = value;
    }
  }
}
