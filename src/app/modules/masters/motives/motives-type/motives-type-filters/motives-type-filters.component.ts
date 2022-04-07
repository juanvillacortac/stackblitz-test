import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Software } from 'src/app/models/security/Software';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { MotivesService } from '../../shared/services/motives.service';

@Component({
  selector: 'app-motives-type-filters',
  templateUrl: './motives-type-filters.component.html',
  styleUrls: ['./motives-type-filters.component.scss']
})
export class MotivesTypeFiltersComponent implements OnInit {
  isDisabled = true;
  modulesTree: TreeNode[] = [];
  modulesTreeSelected: TreeNode;
  systems: SelectItem<Software[]> = {value: null};
  apps: SelectItem<App[]> = {value: null};
  modules: SelectItem<Module[]> = {value: null};
  systemSelected = false;
  appSelected = false;
  systemId: number;
  appId: number;
  moduleId: number;

  @Input() expanded = false;
    @Input("filters") filters : MotivesTypeFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<MotivesTypeFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();

    constructor(
      private _securityService: SecurityService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
      this.filters.active = -1;
      this.getSystemsPromise();
    }
 onSystemSelected(system) {
  this.appSelected = false;
  this.apps = {value: null};
  this.modulesTree = null;
  this.modulesTreeSelected = null;
  this.appId = null;
  this.filters.idModule = -1;
  this.filters.idApp = -1;

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
  this.filters.idModule = -1;
  if (app) {
    this.appSelected = true;
    this.filters.idApp = app.id;
    this.getModulesTree(app.id);
  } else {
    this.appId = null;
    this.filters.idApp = -1;
    this.appSelected = false;
    this.isDisabled = true;
  }
 }

 onModuleSelected(moduleSelected) {
  if (moduleSelected) {
    this.filters.idModule = Number(moduleSelected.key);
  } else {
    this.filters.idModule = -1;
  }
 }

 getSystemsPromise = () => {
    return  this._securityService.getSystemsPromise()
    .then(results => {
      this.systems.value = results.sort((a, b) => a.name.localeCompare(b.name));
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


    search() {
      this.onSearch.emit(this.filters);
    }

    clearFilters() {
      this.filters.id = -1;
      this.filters.name = '';
      this.filters.abbreviation = '';
      this.filters.idModule = -1;
      this.filters.idSystem = -1;
      this.filters.idApp = -1;
      this.filters.active = -1;
      this.systemSelected = false;
      this.appSelected = false;
      this.apps = {value: null};
      this.modulesTree = null;
      this.modulesTreeSelected = null;
      this.isDisabled = true;
      this.systemId = null;
      this.appId = null;

    }
}
