//Globales
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

//Models

import { ConceptsFilter } from '../../shared/filters/Concepts/concepts-filter';
import { Concept } from '../../shared/models/masters/concept';
import { ColumnD } from '../../../../models/common/columnsd';
//App Services
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//Theme PrimeNG
import { MessageService } from 'primeng/api';
import { ConceptViewModel } from '../../shared/view-models/concepts/concept-viewmodel';
import { GroupingInfo } from '../../shared/models/masters/groupingInfo';
import { ItemCost } from 'src/app/models/financial/ItemCost';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';

@Component({
  selector: 'app-companies-concepts-list',
  templateUrl: './companies-concepts-list.component.html',
  styleUrls: ['./companies-concepts-list.component.scss']
})
export class CompaniesConceptsListComponent implements OnInit {

  permissionsIDs = {...Permissions};
  //Ctor
  constructor(public breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    public _conceptsService: ConceptsService,
    public userPermissions: UserPermissions,
    private _httpClient: HttpClient,
    private _companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.breadcrumbService.setItems([
      { label: 'HCM' },
      { label: 'Nómina' },
      { label: 'Conceptos', routerLink: ['/hcm/companies-concepts-list'] }
    ]);
  }

  //Variables Locales
  showFilters: boolean = true;
  loading: boolean = false;
  arrayFilters: ConceptsFilter[] = [];
  conceptsFilters: ConceptsFilter = new ConceptsFilter();
  filterSearch: ConceptsFilter = new ConceptsFilter();
  conceptViewList: ConceptViewModel[];
  _Authservice : AuthService = new AuthService(this._httpClient);
  messageSearch: string = "Cargando data, por favor espere."; 


  displayedColumns: ColumnD<Concept>[] =
    [
      { template: (data) => { return data.conceptId; }, header: 'Id', field: 'conceptId', display: 'none' },
      { template: (data) => { return data.conceptCode }, header: 'Código', field: 'conceptCode', display: 'table-cell' },
      { template: (data) => { return data.groupings }, header: 'Agrupación', field: 'groupings', display: 'table-cell' },
      { template: (data) => { return data.concept }, header: 'Descripción', field: 'concept', display: 'table-cell' },
      { template: (data) => { return data.abbreviation }, header: 'Abreviatura', field: 'abbreviation', display: 'table-cell' },
      { template: (data) => { return data.conceptType }, header: 'Tipo', field: 'conceptType', display: 'table-cell' }
    ];

 //Angular LifeCycle Methods
  ngOnInit(): void {
    //debugger;
    const filterStorage = this.activatedRoute.snapshot.queryParamMap.get('conceptsFilters');
    if (filterStorage === null || filterStorage === "null") {
      this.arrayFilters = [];
    } else {
      this.conceptsFilters = JSON.parse(filterStorage);
      this.filterSearch = JSON.parse(filterStorage);
      var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);

    }
    this.searchConcepts();
  }

  async onEdit(ConceptId) {
    this.arrayFilters = [];
    const queryParams: any = {};
    this.conceptsFilters.idConcept = ConceptId;
    this.arrayFilters.push(this.conceptsFilters);
    this.arrayFilters.push(this.filterSearch);
    queryParams.conceptsFilters = JSON.stringify(this.arrayFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    sessionStorage.setItem('conceptId', ConceptId);
    this.router.navigate( ['/hcm/companies-concepts-generalsection', ConceptId],navigationExtras);
  }
  
  initialSearch(){
    this.filterSearch.concept = this.conceptsFilters.concept;
    this.filterSearch.conceptCode = this.conceptsFilters.conceptCode;
    this.filterSearch.abbreviation = this.conceptsFilters.abbreviation;
    this.filterSearch.idGrouping = this.conceptsFilters.idGrouping == null ? -1 : this.conceptsFilters.idGrouping;
    this.filterSearch.idConceptType = this.conceptsFilters.idConceptType == null ? -1 : this.conceptsFilters.idConceptType;
    this.searchConcepts();
  }
  //Data Methods
  searchConcepts(){
    this.messageSearch = "Cargando data, por favor espere.";
    var idCompany = parseInt(this._Authservice.currentCompany);
    this._companyService.getCompany(idCompany).subscribe(data =>{   //uso el servicio de empresa para obtener el grupo de empresa
      this.conceptsFilters.idBussinessGroup = data.idGroup;
      this.filterSearch.idBussinessGroup = data.idGroup;
      this.filterSearch.idGrouping = this.conceptsFilters.idGrouping == null ? -1 : this.conceptsFilters.idGrouping;
      this.filterSearch.idConceptType = this.conceptsFilters.idConceptType == null ? -1 : this.conceptsFilters.idConceptType;
      this.filterSearch.idConcept =  -1;
      this.conceptViewList = [];    //lista de conceptos a mostrar
      this._conceptsService.GetConcepts(this.filterSearch).subscribe((data: Concept[]) => {      
        //debugger;
        if(data.length == 0){
          this.messageSearch = "No existen resultados que coincidan con la búsqueda.";
        }else{
          data.forEach(element =>{
            var object = new ConceptViewModel();
            object.abbreviation = element.abbreviation;
            object.conceptCode = element.conceptCode;
            object.conceptId = element.conceptId;
            object.conceptType = element.conceptType;
            object.conceptTypeId = element.conceptTypeId;
            object.concept = element.concept;
            object.groupings = element.groupings;
            object.groupingString = "";
            for (let index = 0; index < object.groupings.length; index++) {   //necesario para que el buscador filtre por agrupaciones
              object.groupingString += object.groupings[index].grouping;
            }
            this.conceptViewList.push(object);
          });
        }
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las empresas." });
      });
     
    });
  }

//
  openNew() {
    debugger;
    const queryParams: any = {};
    this.conceptsFilters.idConcept = -1;
    this.arrayFilters.push(this.conceptsFilters);
    this.arrayFilters.push(this.filterSearch);
    queryParams.conceptsFilters = JSON.stringify(this.arrayFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    sessionStorage.setItem('conceptId', "-1");
    this.router.navigate(['/hcm/companies-concepts-generalsection', -1], navigationExtras);
  }
}
