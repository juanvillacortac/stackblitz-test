import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Permission} from 'src/app/models/security/Permission';
import {SecurityService} from '../../shared/services/security.service';
import {UpdatePermission} from 'src/app/models/security/UpdatePermission';
import {UserPermission} from 'src/app/models/security/UserPermission';
import {Access} from 'src/app/models/security/Access';
import {SelectItem} from 'primeng/api';
import {TreeNode} from 'primeng/api';
import {PermissionViewModel} from '../../shared/view-models/Permissions.viewmodel';
import {HttpErrorResponse} from "@angular/common/http";
import {DialogsService} from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html'
})
export class UserPermissionsComponent implements OnInit {
  permissionsForm: FormGroup;
  systems: SelectItem[] = [];
  apps: SelectItem[] = [];
  modules: TreeNode[] = [];
  permissions: Permission[] = [];
  offices: SelectItem[] = [];
  selectedSubModule: string;
  permissionsView: PermissionViewModel[] = [];
  permissionShowing: PermissionViewModel[] = [];
  permissionsEdited: PermissionViewModel[] = [];
  accessByUser: Access[] = [];
  showModules = false;
  containPermissions: boolean = true;
  submitted = false;

  constructor(
    public securityService: SecurityService,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private readonly dialogService: DialogsService
  ) {
    this.permissionsForm = this.setNewPermissionsForm();
  }

  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id'];
    if (id) {
      this.permissionsForm.controls.idUser.setValue(id);
    }
    this.getSystems();
    this.getOfficeByCompany(this.permissionsForm.get('idCompany').value);
  }

  onSystemSelected(system) {
    this.apps = [];
    this.modules = [];
    if (system) {
      this.getApps(system);
      this.permissionsForm.controls.idOffice.setValue(-1);
    } else {
      this.permissionsForm.controls.idApp.setValue(-1);
      this.showModules = false;
    }
  }

  onCleanModules() {
    this.modules = [];
    this.permissionsEdited = [];
    this.permissionShowing = [];
    this.selectedSubModule = '';
    this.permissionsForm.controls.idOffice.setValue(-1);
  }

  onAppSelected(app) {
    this.onCleanModules();
    if (app) {
      this.getModulesTree(app);
    } else {
      this.permissionsForm.controls.idApp.setValue(-1);
      this.showModules = false;
    }
  }

  onModuleSelected(module) {
    this.getPermissionByModulePromise(module.key)
      .then(_ => {
        if (module.parent) {
          this.selectedSubModule = module.label;
          this.permissionShowing = this.permissionsView.filter(x => x.idModule === Number(module.key));
          if (this.permissionShowing.length > 0) {
            this.selectPermission(module);
            this.containPermissions = true;
          } else {
            this.containPermissions = false;
          }
        }
      });
  }

  onPermissionSelected() {
    const selectedItems = this.permissionsView.filter(p=> p.selected !== undefined);
    this.enableCheckList(selectedItems.length > 0);
  }

  enableCheckList(enabled: boolean) {
    this.permissionsForm.get('permissionsSelected').setValue(enabled);
  }

  onOfficeSelected(office) {
    this.cleanPermissionSelected();
    this.permissionsEdited = [];
    this.permissionShowing = [];
    this.selectedSubModule = '';
    if (office) {
      this.showModules = this.modules.length > 0;
      this.getUserPermission(office);
    } else {
      this.showModules = false;
    }
  }

  getSystems() {
    this.securityService.getSystems()
      .then(result => this.systems = this.mapToSelectItem(result))
      .catch(error => this.handleError(error));
  }

  getApps(systemId) {
    this.securityService.getAppsBySystem(systemId)
      .then(result => this.apps = this.mapToSelectItem(result))
      .catch(error => this.handleError(error));
  }

  getOfficeByCompany(companyId) {
    this.securityService.getOffices(companyId)
      .then(result => this.offices = this.mapToSelectItem(result))
      .catch(error => this.handleError(error));
  }

  getPermissionByModulePromise = (idModule: number) => {
    return this.securityService.getPermissionByModulePromise(idModule)
      .then(permissions => this.permissionsToViewModel(permissions))
      .catch(error => this.handleError(error));
  }

  getModulesTree(idApp) {
    this.securityService.getModulesTree(idApp)
      .then(result => this.modules = result)
      .catch(error => this.handleError(error));
  }

  getUserPermission(idOffice) {
    this.securityService.getAccessPromise(
      Number(this.permissionsForm.controls.idUser.value),
      this.permissionsForm.controls.idCompany.value,
      idOffice)
      .then(accesses => this.accessByUser = accesses)
      .catch(error => this.handleError(error));
  }

  onSave() {
    this.submitted = true;
    const permission = this.permissionToSave();
    if (this.invalidValue) {
      return;
    }
    let userPermissionViewModel: UserPermission;
    userPermissionViewModel = {
      IdUser: Number(this.permissionsForm.controls.idUser.value),
      IdUserModifing: Number(this.permissionsForm.controls.idUser.value),
      IdCompany: this.permissionsForm.controls.idCompany.value,
      IdOffice: this.permissionsForm.controls.idOffice.value,
      PermissionsUpdate: permission
    };
    this.securityService.addUserPermission(userPermissionViewModel)
      .then(result => {
        if (result) {
          this.dialogService.successMessage('Asignar permisos', 'security_module.user.added_permissions');
          this.getUserPermission(this.permissionsForm.controls.idOffice.value);
        } else {
          this.dialogService.errorMessage('Asignar permisos', 'security_module.user.assign_permission_error');
        }
      })
      .catch(error => this.handleError(error));
  }

  private permissionsToViewModel(result: Permission[]) {
    result.map(item => {
      if (this.permissionsView.find(p => item.id === p.id) == null) {
        const perms: PermissionViewModel = {
          id: item.id,
          idModule: item.idModule,
          idModuleParent: item.idModuleParent,
          module: item.module,
          name: item.name,
          selected: item.selected
        };
        this.permissionsView.push(perms);
      }
    });
  }

  private cleanPermissionSelected() {
    this.permissionShowing.forEach(element => {
      element.selected = false;
    });
  }

  private AddPermissionSelected() {
    this.permissionShowing.forEach(element => {
      const permissionEdited = this.permissionsEdited.find(p => element.id === p.id);
      if (!permissionEdited) {
        this.permissionsEdited.push(element);
      }
    });
    this.onPermissionSelected();
  }

  private selectPermission(selected) {
    const userPermissionsFiltered = this.accessByUser.filter(x => x.idModule === Number(selected.key));
    userPermissionsFiltered.forEach(element => {
      if (!this.permissionsEdited.find(p => element.id === p.id)) {
        this.permissionShowing.find(x => x.id === element.id).selected = true;
      }
    });
    this.AddPermissionSelected();
  }

  private setNewPermissionsForm() {
    return this.formBuilder.group({
      idUser: 0,
      idUserModifying: 0,
      idOffice: [0, Validators.required],
      idSystem: [0, Validators.required],
      idApp: [0, Validators.required],
      idCompany: 1,
      permissionsUpdate: [],
      permissionsSelected: [false, Validators.requiredTrue]
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private mapToSelectItem(roleTypes: any[]) {
    return roleTypes.map(value => this.newSelectItem(value));
  }

  private newSelectItem = (value: any) => ({
    value: value.id,
    label: value.name
  });
  private permissionToSave() {
    const permissions: UpdatePermission[] = [];
    const updatedPermissions = this.permissionsView.filter(p=> p.selected !== undefined);
    updatedPermissions.forEach(element => {
      permissions.push({IdPermission: element.id, IsActive: element.selected});
    });
    return permissions;
  }

  get invalidValue(){
    return this.permissionsForm.controls.idOffice.value === -1
  }
}
