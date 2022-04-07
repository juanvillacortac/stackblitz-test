import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Software } from 'src/app/models/security/Software';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { MotivesService } from '../../shared/services/motives.service';

@Component({
  selector: 'app-motive-filters',
  templateUrl: './motive-filters.component.html',
  styleUrls: ['./motive-filters.component.scss']
})
export class MotiveFiltersComponent implements OnInit {
  isDisabled = true;
  modulesTree: TreeNode[] = [];
  modulesTreeSelected: TreeNode;
  systems: SelectItem<Software[]> = {value: null};
  apps: SelectItem<App[]> = {value: null};
  modules: SelectItem<Module[]> = {value: null};
  motivesTypes: SelectItem<MotivesType[]> = {value: null};
  systemSelected = false;
  appSelected = false;
  moduleSelected = false;
  systemId: number;
  appId: number;
  motivesTypeId: number;

    @Input() expanded: boolean = false;
    @Input("filters") filters : MotivesFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<MotivesFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
    constructor(
      private _securityService: SecurityService,
      private _motivesService: MotivesService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {
    }
    ngOnInit(): void {
      this.filters.active = -1;
      this.getSystemsPromise();
    }
 onSystemSelected(system) {
    this.apps = {value: null};
    this.appSelected = false;
    this.appId = null;
    this.modulesTree = null;
    this.modulesTreeSelected = null;
    this.moduleSelected = false;
    this.motivesTypes = {value: null};
    this.motivesTypeId = null;
    this.filters.idModule = -1;
    this.filters.idMotivesType = -1;

    if (system) {
      this.systemSelected = true;
      this.filters.idSystem = system.id;
      this.getAppsPromise(system.id);
    } else {
      this.systemId = null;
      this.filters.idSystem = -1;
      this.systemSelected = false;
      this.isDisabled = true;
    }
 }

 onAppSelected(app) {
  this.modulesTree = null;
  this.modulesTreeSelected = null;
  this.isDisabled = true;
  this.moduleSelected = false;
  this.motivesTypes = {value: null};
  this.motivesTypeId = null;
  this.filters.idModule = -1;
  this.filters.idMotivesType = -1;

  if (app) {
    this.appSelected = true;
    this.filters.idApp = app.id;
    this.getModulesTree(app.id);
  } else {
    this.filters.idApp = -1;
    this.appSelected = false;
    this.appId = null;
  }
 }

 onModuleSelected(moduleSelected) {
  this.motivesTypes = {value: null};
  this.motivesTypeId = null;
  this.filters.idMotivesType = -1;

  if (moduleSelected) {
    this.moduleSelected = true;
    this.getMotivesTypePromise(Number(moduleSelected.key));
    this.filters.idModule = Number(moduleSelected.key);
  } else {
    this.moduleSelected = false;
    this.filters.idModule = -1;
  }
 }

 onMotiveTypeSelected(motiveType) {
  if (motiveType) {
    this.filters.idMotivesType = motiveType.id;
  } else {
    this.filters.idMotivesType = -1;
    this.motivesTypeId = null;
  }
 }

 getSystemsPromise = () => {
    return  this._securityService.getSystemsPromise()
    .then(results => {
      this.systems.value =  results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar sistemas', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getAppsPromise = (idSystem: number) => {
    return  this._securityService.getAppsBySystemPromise(idSystem)
    .then(results => {
      this.apps.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar aplicaciones', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getModulesTree = (idApp: number) => {
    return this._securityService.getModulesTreePromise(idApp)
       .then(result => {
       this.modulesTree = result;
       this.isDisabled = result?.length > 0 ? false : true;
       }, (error) => {
         this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar módulos', detail: error.message});
         console.log(error.message);
       });
   }

  getModulePromise = (idApp: number) => {
    return  this._securityService.getModulesByAppPromise(idApp)
    .then(results => {
      this.modules.value = results;
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar modulos', detail: error.error.message});
      console.log(error.error.message);
    });

  }


  getMotivesTypePromise = (idModule: number) => {
    const filters = new MotivesTypeFilters();
    filters.idModule = idModule;
    return  this._motivesService.getMotivesTypes(filters)
    .then(results => {
      this.motivesTypes.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar tipos de motivos', detail: error.error.message});
      console.log(error.error.message);
    });
  }

    search() {
      this.onSearch.emit(this.filters);
    }

   clearFilters() {
      this.filters.id = -1;
      this.filters.name = '';
      this.filters.idModule = -1;
      this.filters.active = -1;
      this.filters.idMotivesType = -1,
      this.filters.idSystem = -1,
      this.filters.idApp = -1,
      this.motivesTypeId = null;
      this.systemSelected = false;
      this.appSelected = false;
      this.apps = {value: null};
      this.appId = null;
      this.modulesTree = [];
      this.modulesTreeSelected = null;
      this.isDisabled = true;
      this.systemId = null;
      this.moduleSelected = false;
      this.motivesTypes = {value: null};
    }
}
