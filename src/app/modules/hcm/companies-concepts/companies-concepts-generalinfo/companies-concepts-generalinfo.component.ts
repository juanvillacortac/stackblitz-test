//General
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//Models
import { ConceptsTypeFilter } from '../../shared/filters/Concepts/concepts-type-filter';
import { MeasureUnitFilter } from '../../shared/filters/measure-unit-filter';
import { MeasureUnit } from '../../shared/models/masters/measure-unit';
//import { ConceptsFilter } from '../../shared/filters/Concepts/concepts-filter';
import { ConceptType } from '../../shared/models/masters/concept type';
import { Concept } from '../../shared/models/masters/concept';
//app Servive
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
import { MeasureUnitService } from '../../shared/services/measure-unit.service';
//Theme PrimeNG
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-companies-concepts-generalinfo',
  templateUrl: './companies-concepts-generalinfo.component.html',
  styleUrls: ['./companies-concepts-generalinfo.component.scss']
})
export class CompaniesConceptsGeneralinfoComponent implements OnInit {


  //Ctor
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    public userPermissions: UserPermissions,
    public messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    public _conceptsService: ConceptsService,
    public _measureUnitService: MeasureUnitService
  ) {
    this.breadcrumbService.setItems([
      { label: 'HCM' },
      { label: 'Nómina' },
      { label: 'Conceptos', routerLink: ['/hcm/companies-concepts-list'] }
    ]);
  }

  //Var Globals
  actionButton: boolean = false;
  SelectedTab: number = 0;

  @Input() conceptEdit: Concept;
  @Output() upload: EventEmitter<number> = new EventEmitter<number>();
  conceptId: string = "0";
  conceptsTypeFilter: ConceptsTypeFilter = new ConceptsTypeFilter();
  conceptsTypes: SelectItem[] = [];
  units: any[] = [];
  selectedUnitId:SelectItem;
  submitted: boolean = false;
  measureUnitFilter: MeasureUnitFilter = new MeasureUnitFilter();
  measureUnitList: SelectItem[] = [];

  permissionsIDs = { ...Permissions };

  ngOnInit(): void {
    debugger;
    // this.units = [{ value: 1,label: "Dias" },
    //               { value: 1,label: "Dias" }, 
    //               { value: 2, label: "Horas"}].map<SelectItem>((item) => ({
    //                 value: item.value,
    //                 label: item.label
    //               }));
    // this.selectedUnitId = this.units.find(x=>x.value ==  this.conceptEdit.unitId);
    this.loadConceptsTypes();
    this.loadMeasureUnit();
  }

  //Data Methods
  saveConcept() {
    //debugger;
    //this.conceptEdit.unitId = Number(this.selectedUnitId);
    if(this.conceptEdit.abbreviation == "" || this.conceptEdit.abbreviation == null || this.conceptEdit.concept == null || this.conceptEdit.concept == ""
      || this.conceptEdit.conceptTypeId == -1 || this.conceptEdit.unitId == -1 || this.conceptEdit.calcPriority == null){
      this.submitted = true;
    }else{
      this.conceptEdit.countryId = 2;
      this.conceptEdit.accumulationLevelId = 1;
      this.conceptEdit.bussinnesGroupID = 1;
      this._conceptsService.insertEditConcepts(this.conceptEdit).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso", life: 5000 });
          sessionStorage.setItem('conceptId', data.toString());
          var url = "hcm/companies-concepts-generalsection/" + data;
          this.router.navigateByUrl(url);
          location.assign(url);
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al insertar el registro." });
      });
    }
  }

  loadConceptsTypes() {
    this._conceptsService.GetConceptsTypes(this.conceptsTypeFilter).subscribe((data: ConceptType[]) => {
      this.conceptsTypes = data.map<SelectItem>((item) => ({
        value: item.idTypeConcept,
        label: item.typeConcept
      }));
      this.conceptsTypes.sort((a, b) => a.label.localeCompare(b.label));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de conceptos" });
    });
  }

  loadMeasureUnit() {
    this.measureUnitFilter.measureUnitTypeId = 2;
    this._measureUnitService.GetMeasureUnits(this.measureUnitFilter).subscribe((data: MeasureUnit[]) => {
      this.measureUnitList = data.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.measureUnitList.sort((a, b) => {
        if(a.label < b.label || a.label == 'No aplica'){
          return -1
        }
        if(a.label > b.label){
          return 1
        }
        return 0
      });
      //this.measureUnitList.sort((a, b) => a.label.localeCompare(b.label));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de conceptos" });
    });
  }
}
