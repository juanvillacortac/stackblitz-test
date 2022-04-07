import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Software } from 'src/app/models/security/Software';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { MotivesService } from '../../shared/services/motives.service';

@Component({
  selector: 'app-motive-detail',
  templateUrl: './motive-detail.component.html',
  styleUrls: ['./motive-detail.component.scss']
})
export class MotiveDetailComponent implements OnInit {
  submitted = false;
  isDisabled = true;
  motivesForm: FormGroup;
  isEdit = false;
  formTitle: string;
  systemSelected = false;
  appSelected = false;
  moduleSelected = false;
  motivesAdded: boolean;
  systems: SelectItem<Software[]> = {value: null};
  apps: SelectItem<App[]> = {value: null};
  modules: SelectItem<Module[]> = {value: null};
  motivesType: SelectItem<Module[]> = {value: null};
  modulesTree: TreeNode[] = [];
  modulesTreeSelected: TreeNode;
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() motive: Motives;
  @Input() motiveList: Motives[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _securityService: SecurityService,
    private _motivesService: MotivesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
      this.motivesForm = this.setNewMotivesForm();
  }
  ngOnInit(): void {

    if (this.motive) {
      this.formTitle = 'Editar motivo';
      this.isEdit = true;
      this.onEditForm();
    } else {
      this.formTitle = 'Nuevo motivo';
      this.isEdit = false;
      this.motivesForm.controls.statusValue.setValue('1');
      this.getSystemsPromise();
    }
  }
  onEditForm() {
    this.getSystemsPromise().then(permissions => {
      this.getAppsPromise(-1).then( apps => {
          this.getModules(-1).then(ma => {
          this.getMotivesTypePromise(-1).then( motivesType => {
            const moduleOfMotiveType = this.modules.value.find(p => p.id === this.motive.motiveType.idModule);
            this.motivesForm.patchValue({
              id: this.motive.id,
              name: this.motive.name,
              idSystem: this.systems.value.find(p => Number(p.id) === Number(moduleOfMotiveType?.idSoftware)),
              idApp: this.apps.value.find(p => Number(p.id) === Number(moduleOfMotiveType?.idApp)),
              idModule: this.modules.value.find(p => Number(p.id) === Number(moduleOfMotiveType?.id)),
              motivesType: this.motivesType.value.find(p => Number(p.id) === Number(this.motive.motiveType.id)),
              statusValue: this.motive.active ? String(StatusEnum.active) : String(StatusEnum.inactive)
          });
            this.getModulesTree(moduleOfMotiveType?.idApp).then(tree => {
              const modulesNodeSelected: TreeNode = {
                key: String(moduleOfMotiveType.id),
                label: moduleOfMotiveType?.name
              };
              this.modulesTreeSelected = modulesNodeSelected;
            });
          });
        });
      });
    });
  }

 onSystemSelected(system) {
  this.modulesTree = [];
  this.modulesTreeSelected = null;
  this.moduleSelected = false;
  this.motivesType = {value: null};
  this.appSelected = false;
  this.apps = {value: null};
  this.motivesForm.controls.idApp.setValue(null);
  this.motivesForm.controls.idModule.setValue(null);
  this.motivesForm.controls.motivesType.setValue(null);

  if (system) {
    this.systemSelected = true;
    this.getAppsPromise(system.id);
  } else {
    this.systemSelected = false;
    this.isDisabled = true;
    this.motivesForm.controls.idSystem.setValue(null);
  }

 }

 onAppSelected(app) {
  this.modulesTree = [];
  this.modulesTreeSelected = null;
  this.moduleSelected = false;
  this.motivesType = {value: null};
  this.motivesForm.controls.idModule.setValue(null);
  this.motivesForm.controls.motivesType.setValue(null);

  if (app) {
    this.appSelected = true;
    this.getModulesTree(app.id);
  } else {
    this.motivesForm.controls.idApp.setValue(null);
    this.appSelected = false;
    this.isDisabled = true;
  }

 }

 onModuleSelected(module) {
  this.motivesType = {value: null};
  this.motivesForm.controls.motivesType.setValue(null);
  if (module) {
    this.moduleSelected = true;
    this.getMotivesTypePromise(Number(module.key));
  } else {
    this.motivesForm.controls.idModule.setValue(null);
    this.moduleSelected = false;
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
      this.apps.value =  results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar aplicaciones', detail: error.error.message});
      console.log(error.error.message);
    });

  }

  getModulesTree = (idApp: number) => {
   return this._securityService.getModulesTreePromise(idApp)
      .then(result => {
      this.modulesTree = result;
      this.isDisabled = result?.length > 0 && !this.isEdit ? false : true;
      }, (error) => {
        this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar módulos', detail: error.message});
        console.log(error.message);
      });
  }

  getModules = (idApp: number) => {
    return this._securityService.getModulesByAppPromise(idApp)
       .then(result => {
       this.modules.value = result;
       }, (error) => {
         this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar módulos', detail: error.message});
         console.log(error.message);
       });
   }
  getMotivesTypePromise = (idModule: number) => {
    const filters = new MotivesTypeFilters();
    filters.idModule = idModule;
    filters.active =  idModule === -1 ? StatusEnum.alls : StatusEnum.active;
    return  this._motivesService.getMotivesTypes(filters)
    .then(results => {
      this.motivesType.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Cargar tipos de motivos', detail: error.error.message});
      console.log(error.error.message);
    });

  }
  toMotiveModel() {
      const model = new Motives();
          model.id = this.motivesForm.controls.id.value;
          model.name = this.motivesForm.controls.name.value;
          model.motiveType = this.motivesForm.controls.motivesType.value;
          model.active = this.motivesForm.controls.statusValue.value === '0' ? false : true;
          model.abbreviation = '';

      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.motivesForm.invalid) {
      return;
    }
    const newMotive = this.toMotiveModel();
    if (this.isValidateMotive(newMotive)) {
      this._motivesService.addMotive(newMotive).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
          this.onEmitHideForm(true);
        } else if (data === -1) {
          this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Alerta', detail: 'Este motivo ya existe'});
        } else {
          this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el motivo'});
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({key: 'motives-type', severity: 'error',
        summary: 'Error', detail: 'Ha ocurrido un error al guardar el motivo'});
      });
    }
}

  isValidateMotive(newMotive: Motives) {
    const inValidateName = this.motiveList.find(p =>
                        p.name.trim().toUpperCase() === newMotive.name.trim().toUpperCase()
                        && (p.motiveType.id === newMotive.motiveType.id && p.id !== newMotive.id));
      if (inValidateName) {
        this.messageService.add({key: 'motives-type', severity: 'error', summary: 'Error', detail: 'El motivo ya se encuentra registrado para el tipo de motivo seleccionado'});
        return false;
      }
      return true;
  }
  public resetForm() {
    if (this.motivesForm.dirty) {
      this.confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar motivo?',
        accept: () => {
          this.motivesForm.reset(this.setNewMotivesForm());
          this.onEmitHideForm(false);
        }
      });
    } else {
      this.onEmitHideForm(false);
    }
  }

  private setNewMotivesForm() {
      return this.formBuilder.group({
        id: -1,
        name: ['', Validators.required],
        idSystem: [''],
        idApp: [''],
        idModule: ['', Validators.required],
        motivesType: ['', Validators.required],
        statusValue : ['', Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
}
