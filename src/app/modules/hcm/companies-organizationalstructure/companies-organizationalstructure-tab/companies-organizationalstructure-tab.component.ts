//General
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//models
import { companyjobposition } from '../../shared/models/masters/company-jobposition';
import { companylevel } from '../../shared/models/masters/company-level';
import { HierarchicalLevel } from '../../shared/models/masters/hierarchical-level';
import { JobPosition } from '../../shared/models/masters/job-position';
import { companymtjobposition } from '../../shared/models/masters/company-mtjobposition';

//filters
import { companyjobpositionsfilter } from '../../../hcm/shared/filters/company-jobpositions-filter';
import { companylevelsfilter } from '../../../hcm/shared/filters/company-levels-filter';
import { HierarchicalLevelFilter } from '../../shared/filters/hierarchical-level-filter';
import { HierarchicalLevelDeletedFilter } from '../../shared/filters/hierarchical-level-deleted-filter';
import { JobPositionDeletedFilter } from '../../shared/filters/job-position-deleted-filter';
import { companymtjobpositionsfilter } from '../../shared/filters/company-mtjobpositions-filter';


//services
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from '../../../hcm/shared/services/company.service';
import { HierarchicalLevelService } from '../../shared/services/hierarchical-level.service';
import { JobPositionService } from '../../shared/services/job-position.service';

//Theme components
import { MessageService, ConfirmationService } from 'primeng/api';
import { JobPositionViewModel } from '../../shared/view-models/job-position-viewmodel';


@Component({
  selector: 'app-companies-organizationalstructure-tab', 
  templateUrl: './companies-organizationalstructure-tab.component.html',
  styleUrls: ['./companies-organizationalstructure-tab.component.scss']
})

export class CompaniesOrganizationalstructureTabComponent implements OnInit, AfterViewInit {

  @ViewChild('companiesChart') _companiesChart;
  companyjobpositionsFilters: companyjobpositionsfilter = new companyjobpositionsfilter();
  companylevelsFilters: companylevelsfilter = new companylevelsfilter();


  jobs: companyjobposition[];
  _jobpass: companyjobposition = new companyjobposition();
  companymtjobpositionsFilters: companymtjobpositionsfilter = new companymtjobpositionsfilter();
  levels: companylevel[];
  mTJobs:companymtjobposition[];
  _levelpass: companylevel = new companylevel();
  leveldialog: boolean = false;
  jobPositiondialog: boolean = false;
  conditional: boolean = false;
  colsJobs: any[];
  colsLevels: any[];
  LevelModelPanel;
  JobModelPanel;
  FilterJob;
  FilterLevel;

  
  jobsViewModel: JobPositionViewModel[];
  jobins: JobPositionViewModel[] = [];
  levelsDropdown : companylevel[] = [];

  constructor(private messageService: MessageService, 
              private companyService: CompanyService, 
              private actRoute: ActivatedRoute, 
              private jobPositionService: JobPositionService,
              private hierarchicalLevelService: HierarchicalLevelService,
              public _authService: AuthService,
              private confirmationService: ConfirmationService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.onLoadJobPosition();
    this.changeDetectorRef.detectChanges();
  }


  ngOnInit(): void {

    this.LevelModelPanel = { id: 'description', header: 'Descripción', Title: 'Nivel', type: 'text', class: "submitted && (!Modelin.description || !Modelin.description.trim()) ? 'ng- dirty ng - invalid' : ''" };
    this.JobModelPanel = { id: 'name', header: 'Nombre', Title: 'Cargo', type: 'text', class: "submitted && (!Modelin.name || !Modelin.name.trim()) ? 'ng- dirty ng - invalid' : ''" };
    this.colsJobs = [
      { field: 'name', header: 'Nombre' },
      { field: 'hierarchicalLevel', header: 'Nivel' },
      { field: 'temporaryPositions', header: 'Plazas' }
    ];
    this.FilterJob = "'name','hierarchicalLevel'";
    
    //Levels
    this.onLoadCompanyLevels();
    this.FilterJob = "'description'";
    this.colsLevels = [
      { field: 'description', header: 'Descripción' },
      { field: 'level', header: 'Nivel' }
    ];
    this.onloadCompanyMTJobPosition();
  }

  onLoadJobPosition(){
    this.companyjobpositionsFilters.Company = this.actRoute.snapshot.params['id'];
    this.companyService.getCompanyJobPositions(this.companyjobpositionsFilters).subscribe((data: companyjobposition[]) => {
      if(data != null) {
          this.companyService._companyjobpositionList = data;
          this.jobs = data;
          this.jobsViewModel = [];
          this.jobs.forEach(element => {
            var object = new JobPositionViewModel();
            object.id = element.id;
            object.company = element.company;
            object.hierarchicalLevel = element.hierarchicalLevel;
            object.mainJobPosition = element.mainJobPosition;
            object.mtJobPosition = element.mtJobPosition;
            object.fixedPositions = element.fixedPositions;
            object.temporaryPositions = element.temporaryPositions;
            var size: string[] = element.name.split(";");
            object.name = size[0];
            object.description = element.description;
            object.duties = element.duties;
            object.goals = element.goals;
            object.riskAnalysis = element.riskAnalysis;
            object.supervisoryPosition = element.supervisoryPosition;
            object.idHierarchicalLevel = this.levels.find(x => x.id == element.hierarchicalLevel).level
            this.jobsViewModel.push(object);
          });
      }
    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar Cargos" });
      });
  }

  onloadCompanyMTJobPosition(){
    this.companyService.getCompanyMainPosition(this.companymtjobpositionsFilters).subscribe((data: companymtjobposition[]) => {
      this.mTJobs = data;
    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error obteniendo la data de Cargos Mintra" });
      });
  }

  onLoadCompanyLevels(){
    this.companylevelsFilters.Company = this.actRoute.snapshot.params['id'];
    this.companyService.getCompanyLevels(this.companylevelsFilters).subscribe((data: companylevel[]) => {
      this.levels = data;
    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar Niveles" });
      });
  }

  editlevel(levelin: companylevel) {
    if (levelin.id) {
      this._levelpass.id = levelin.id;
      this._levelpass.level = levelin.level;
      this._levelpass.payrollCode = levelin.payrollCode;
      this._levelpass.financialCode = levelin.financialCode;
      this._levelpass.description = levelin.description;
    }else{
      this._levelpass.id = -1;
      this._levelpass.level = 0;
      this._levelpass.payrollCode = "";
      this._levelpass.financialCode = "";
      this._levelpass.description = "";
    } 
    this._levelpass.company = this.actRoute.snapshot.params['id'];
    this.leveldialog = true;
  }

  editJobPosition(jobin: JobPositionViewModel) {
    var error = false;
    var aux: boolean;
    if (jobin.id == -1) {
      if(this.levels.find(x => x.level == 1)){  //bloque el botón para no crear cargos sin un nivel 1
        this._jobpass.id = -1;
        this._jobpass.hierarchicalLevel = 0;
        this._jobpass.mainJobPosition = 0;
        this._jobpass.mtJobPosition = 0;
        this._jobpass.fixedPositions = 0;
        this._jobpass.temporaryPositions = 0;
        this._jobpass.name = "";
        this._jobpass.description = "";
        this._jobpass.duties = "";
        this._jobpass.goals = "";
        this._jobpass.riskAnalysis = "";
        this._jobpass.supervisoryPosition = true;
        this.jobins = this.jobsViewModel;
        aux = true;
      }else{
        error = true;
      }
    }else{
      this._jobpass.id = jobin.id;
      this._jobpass.hierarchicalLevel = jobin.hierarchicalLevel;
      this._jobpass.mainJobPosition = jobin.mainJobPosition;
      this._jobpass.mtJobPosition = jobin.mtJobPosition;
      this._jobpass.fixedPositions = jobin.fixedPositions;
      this._jobpass.temporaryPositions = jobin.temporaryPositions;
      this._jobpass.name = jobin.name;
      this._jobpass.description = jobin.description;
      this._jobpass.duties = jobin.duties;
      this._jobpass.goals = jobin.goals;
      this._jobpass.riskAnalysis = jobin.riskAnalysis;
      this._jobpass.supervisoryPosition = jobin.supervisoryPosition;
      this.jobins = this.jobsViewModel.filter(x => x.id != jobin.id && x.idHierarchicalLevel < jobin.idHierarchicalLevel); //se envían todos los posibles cargos padres
      aux = jobin.idHierarchicalLevel == 1 ? false : true;
    } 
    if(error){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe existir un nivel 1 para crear cargos" });
    }else{
      this._jobpass.company = this.actRoute.snapshot.params['id'];
      if(this.jobins && this.jobins.length > 0){
        this.levelsDropdown = this.levels.filter(x => x.level != 1);
      }else{
        this.levelsDropdown = this.levels;
      }
      this.conditional = aux;
      this.jobPositiondialog = true;
    }
  }

  deletelevel(levelout: HierarchicalLevel){
    var filter: HierarchicalLevelDeletedFilter = new HierarchicalLevelDeletedFilter();
    filter.idHierarchicalLevel = parseInt(levelout.id.toString());
    //
    this.hierarchicalLevelService.deletedHierarchicalLevel(filter).subscribe((data) => { 
      if (data> 0) {    //si no ocurre algún error
       this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
       this.onLoadCompanyLevels();
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -4) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nivel no puede eliminarse porque tiene cargos asociados" });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
      //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
  }

  deleteJob(jobout: JobPositionViewModel){
    var filter: JobPositionDeletedFilter = new JobPositionDeletedFilter();
    filter.idJobPosition = parseInt(jobout.id.toString());
    this.jobPositionService.deletedJobPosition(filter).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Borrado exitoso" });
        this._companiesChart.ngAfterViewInit();
        this.onLoadJobPosition();
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -4) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El cargo no puede eliminarse porque se estableció como supervisor de otro(s) cargo(s)" });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
      //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
  }

  saveLevel(levelin: companylevel){
    levelin.company = parseInt(levelin.company.toString());
    this.companyService.postCompanyLevel(levelin).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.onLoadCompanyLevels();
        this.onLoadJobPosition();
        this.leveldialog = false;
      } else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nivel ya se encuentra registrado." });
      }else if(data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -4) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nivel no puede eliminarse porque tiene cargos asociados" });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el Nivel" });
    });
  }

  saveJob(jobin: companyjobposition): void {
    
      if(jobin.id == 0){
        jobin.id = -1;
      }
      //console.log(this.jobin);
      jobin.company = Number(this.actRoute.snapshot.params['id']);
      jobin.id
      this.companyService.postCompanyJobPositions(jobin).subscribe((data: number) => {
  
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.onLoadJobPosition();
          this.jobPositiondialog = false;
          this._companiesChart.ngAfterViewInit();

        } else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El cargo ya se encuentra registrado." });
        }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else if(data == -4) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El cargo no puede eliminarse porque tiene cargos asociados" });
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el cargo" });
      });
    
  }
 
  resetValues(action: boolean){
    this.leveldialog = action;
    this.jobPositiondialog = action;
  }
}
