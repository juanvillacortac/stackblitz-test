//Globales
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//Models
import { ConceptsFilter } from '../../shared/filters/Concepts/concepts-filter';
import { ConceptType } from '../../shared/models/masters/concept type';
import { ConceptsTypeFilter } from '../../shared/filters/Concepts/concepts-type-filter';
import { Grouping } from '../../shared/models/laborRelationship/grouping';
import { GroupingFilter } from '../../shared/filters/grouping-filter';
//Services
import { GroupingService } from '../../shared/services/grouping.service';
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
//Theme PrimeNg
import { MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';


@Component({
  selector: 'app-companies-concepts-filter',
  templateUrl: './companies-concepts-filter.component.html',
  styleUrls: ['./companies-concepts-filter.component.scss']
})
export class CompaniesConceptsFilterComponent implements OnInit {

  //Variables Input
  @Input() expanded: boolean = false;
  @Input("filters") filters: ConceptsFilter;
  @Input("loading") loading: boolean = false;

  //Variables Output
  @Output("onSearch") onSearch = new EventEmitter<ConceptsFilter>();

  //Variables Locales
  conceptsTypes: SelectItem[] = [];
  conceptsTypeFilter: ConceptsTypeFilter = new ConceptsTypeFilter();
  groupingConcepts: SelectItem[] = [];
  groupingFilter: GroupingFilter = new GroupingFilter();
  conceptFilter: ConceptsFilter = new ConceptsFilter();
  _Authservice : AuthService = new AuthService(this._httpClient);

  //Ctor
  constructor(public _groupingService: GroupingService,
    public _conceptsService: ConceptsService,
    private _companyService: CompanyService,
    private _httpClient: HttpClient,
    private messageService: MessageService) { }


  //Angular LifeCycle Methods
  ngOnInit(): void {
    debugger;
    //this.filters.idConceptType = -1;
    this.loadFilters();
  }

  //Custom Methods
  search() {
    this.filters.idConceptType = this.filters.idConceptType == null || this.filters.idConceptType == undefined ? -1 : this.filters.idConceptType;
    this.filters.idGrouping = this.filters.idGrouping == null || this.filters.idGrouping == undefined ? -1 : this.filters.idGrouping;
    this.onSearch.emit(this.filters);
  }

  loadFilters() {
    ///this.clearFilters();
    this.loadConceptsTypes();
    this.loadGroupingConcepts();
  }

  clearFilters() {
    this.filters.idConceptType = null;
    this.filters.idGrouping = null;
    this.filters.conceptCode = "";
    this.filters.abbreviation = "";
    this.filters.concept = "";
  }

  //Get Data Methods
  loadConceptsTypes() {
    this._conceptsService.GetConceptsTypes(this.conceptsTypeFilter).subscribe((data: ConceptType[]) => {
      this.conceptsTypes = data.map<SelectItem>((item) => ({
        value: item.idTypeConcept,
        label: item.typeConcept
      }));
      this.conceptsTypes.push({label: "Todos", value: -1})
        this.conceptsTypes.sort((a, b) => {
                              if(a.label < b.label || a.value == -1){
                                return -1
                              }
                              if(a.label > b.label){
                                return 1
                              }
                              return 0
        });
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de conceptos" });
    });

  }

  loadGroupingConcepts() {
    var idCompany = parseInt(this._Authservice.currentCompany);
    this._companyService.getCompany(idCompany).subscribe(data =>{
      this.groupingFilter.idGroupingType = data.idGroup;
      this._groupingService.getGrouping(this.groupingFilter).subscribe((data: Grouping[]) => {
        this.groupingConcepts = data.map<SelectItem>((item) => ({
          value: item.idGrouping,
          label: item.abbreviation
        }));
        this.groupingConcepts.push({label: "Todos", value: -1})
        this.groupingConcepts.sort((a, b) => {
                              if(a.label < b.label || a.value == -1){
                                return -1
                              }
                              if(a.label > b.label){
                                return 1
                              }
                              return 0
        });
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las agrupaciones" });
      });
    });
  }
}
