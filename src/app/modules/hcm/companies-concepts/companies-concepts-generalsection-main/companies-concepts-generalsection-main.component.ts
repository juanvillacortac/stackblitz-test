//General
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//Models
import { ConceptsFilter } from '../../shared/filters/Concepts/concepts-filter';
import { Concept } from '../../shared/models/masters/concept';
//App Services
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
//Theme Ng Prime
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-companies-concepts-generalsection-main',
  templateUrl: './companies-concepts-generalsection-main.component.html',
  styleUrls: ['./companies-concepts-generalsection-main.component.scss']
})

export class CompaniesConceptsGeneralsectionMainComponent implements OnInit {
  
   //Var Globals
   conceptEdit: Concept = new Concept();
   SelectedTab: number = 0;
   conceptId: number = 0;
   conceptsFilters: ConceptsFilter = new ConceptsFilter();
   filterExt: ConceptsFilter[] = [];
   activeIndex: number;
  //Ctor
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    public userPermissions: UserPermissions,
    public _conceptsService: ConceptsService,
    public messageService: MessageService
  ) {
    this.conceptId = parseInt(this.activatedRoute.snapshot.params['id']);
    //this.searchConcepts();
  }

 

  //Angular LifeCycle Methods
  ngOnInit(): void {
    //this.conceptEdit = new Concept();
    // this.conceptId = parseInt(sessionStorage.getItem('conceptId'));
    // if (this.conceptId > 0) {
    //   this.searchConcepts();
    // }else{
    //   this.conceptEdit = new Concept();
    // }
    this.activeIndex = 0;
    debugger;
    var filters = this.activatedRoute.snapshot.queryParamMap.get('conceptsFilters');
  // 
    if (this.filterExt.length > 0) {
      this.filterExt = this.filterExt;
    } else {
      if (filters!=undefined) {
        const newFilter = filters;
        if (newFilter === null) {
          this.filterExt = [];
        } else {
          this.filterExt = JSON.parse(newFilter);
          sessionStorage.setItem('searchParameters', newFilter)
        }
      }else{
        this.filterExt = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
    }
    sessionStorage.setItem('groupId', this.filterExt[0].idBussinessGroup.toString()); //Guardado de id grupo en session (eliminar al finalizar)

    //this.conceptsFilters = this.filterExt[0];
    var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl(url);
    
    if(this.conceptId > 0){
      this.searchConcepts();
    }
  }

  //Data Methods
  searchConcepts() {
    this.conceptsFilters.idConcept = this.conceptId;
    this.conceptsFilters.idGrouping = -1;
    this.conceptsFilters.idConceptType = -1;
    this.conceptsFilters.idBussinessGroup = this.filterExt[0].idBussinessGroup;
    this._conceptsService.GetConcepts(this.conceptsFilters).subscribe((data: Concept[]) => {
      //debugger; 
      if (data.length > 0) {
        this.conceptEdit = data[0];
      } else if (data.length == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      } else if (data.length == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      } else if (data.length == -3) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      } 
      // else {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los datos del concepto" });
      // }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos del concepto." });
    });
  }


  //Events Controls
  EventTab(e) {
    this.SelectedTab = e.index;
  }

  regresar() {
    //debugger;
    const queryParams: any = {};
    queryParams.conceptsFilters = JSON.stringify(this.filterExt[0]);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    sessionStorage.removeItem('conceptId');
    this.router.navigate(['hcm/companies-concepts-list'], navigationExtras);
  }


}
