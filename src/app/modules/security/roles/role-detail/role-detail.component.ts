import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem, TreeNode } from 'primeng/api';
import { Access } from 'src/app/models/security/Access';
import { Module } from 'src/app/models/security/Module';
import { Permission } from 'src/app/models/security/Permission';
import { Role } from 'src/app/models/security/Role';
import { UpdatePermission } from 'src/app/models/security/UpdatePermission';
import { SecurityService } from '../../shared/services/security.service';
import { PermissionViewModel } from '../../shared/view-models/Permissions.viewmodel';
import { RoleService } from '../shared/role.service';
import { ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from "@angular/common/http";
import { DialogsService } from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  roleForm: FormGroup;
  systemId: number;
  idApp: number;
  systems: SelectItem[] = [];
  rolTypes: SelectItem[] = [];
  apps: SelectItem[] = [];
  modules: TreeNode[] = [];
  permissions: Permission[] = [];
  permissionsByRole: Access[] = [];
  roleStatus = Boolean();
  containPermissions: boolean = true;
  isEdit = false;
  formTitle: string;
  permissionsEdited: PermissionViewModel[] = [];
  @Output() public onHideEditForm: EventEmitter<boolean> = new EventEmitter();
  @Input() roleSelected: Role;

  selectedSubModule = '';
  permissionsView: PermissionViewModel[] = [];
  permissionShowing: PermissionViewModel[] = [];

  constructor(
    public securityService: SecurityService,
    public roleService: RoleService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private readonly dialogService: DialogsService,
  ) {
    this.roleForm = this.setNewRoleForm();
  }

  ngOnInit(): void {
    if (this.roleSelected) {
      this.formTitle = 'Editar rol';
      this.isEdit = true;
    } else {
      this.formTitle = 'Nuevo rol';
      this.isEdit = false;
      this.roleForm.controls.isActive.setValue(true);
    }

    this.getModulesTree(-1);
    this.getRolesType();
  }

  onEditForm() {
    this.getPermissionsOfRole(this.roleSelected.id);
    this.roleForm.controls.id.setValue(this.roleSelected.id);
    this.roleForm.controls.name.setValue(this.roleSelected.name);
    this.roleForm.controls.idType.setValue(this.roleSelected.idType);
    this.roleForm.controls.isActive.setValue(this.roleSelected.isActive);
    this.roleForm.controls.permissionsSelected.setValue(true);
  }

  onModuleSelected(module) {
    this.getPermissionByModulePromise(module.key).then(_ => {
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

  onSubModuleSelected(selected: Module) {
    this.selectedSubModule = selected.name;
    this.permissionShowing = this.permissionsView.filter(x => x.idModule === selected.id);
    this.selectPermission(selected);
  }

  onPermissionSelected() {
    const isSelected = this.permissionsView.filter(p=> p.selected !== undefined);
    const hasSelectedItems = isSelected.length > 0;
    this.roleForm.get('permissionsSelected').setValue(hasSelectedItems);
  }

  onSave() {
    const permissions = this.permissionVMToUpdatePermissionModel();
    this.roleForm.get('permissions').setValue(permissions);
    const newRole = this.roleForm.getRawValue();
    this.roleService.createRole(newRole)
      .then(result => {
        if (result) {
          this.dialogService.successMessage((this.isEdit ? 'Editar' : 'Crear') + ' rol', 'Rol ' + (this.isEdit ? 'editado' : 'creado') + ' de forma correcta')
          this.onEmitHideForm(true);
        } else {
          this.dialogService.errorMessage((this.isEdit ? 'Editar' : 'Crear') + ' rol', 'Error al ' + (this.isEdit ? 'editar' : 'crear') + ' rol');
          this.onEmitHideForm(false);
        }
      })
      .catch(error => {
        this.handleError(error);
        this.onEmitHideForm(false);
        console.log(error.error.message);
      });
  }

  getRolesType() {
    this.roleService.getRoleTypes()
      .then(result => {
        this.rolTypes = this.mapToSelectItem(result)
        this.rolTypes.sort((a, b) => a.label.localeCompare(b.label));
        if (this.isEdit) {
          this.onEditForm();
        }
      })
      .catch(error => this.handleError(error));
  }

  private mapToSelectItem(roleTypes: any[]) {
    return roleTypes.map(value => this.newSelectItem(value));
  }

  private newSelectItem = (value: any) => ({
    value: value.id,
    label: value.name
  });

  getModulesTree(idApp) {
    this.securityService.getModulesTree(idApp)
      .then(result => this.modules = result)
      .catch(error => this.handleError(error));
  }

  getPermissionsOfModule(idModule) {
    this.securityService.getPermissionByModule(idModule)
      .then(permissions => this.permissionsToViewModel(permissions))
      .catch(error => this.handleError(error));
  }

  getPermissionByModulePromise = (idModule: number) => {
    return this.securityService.getPermissionByModulePromise(idModule)
      .then(permissions => this.permissionsToViewModel(permissions))
      .catch(error => this.handleError(error));
  }

  getPermissionsOfRole = (idRole: number) => {
    this.securityService.getPermissionByRole(idRole, 1)
      .then(permissions => this.permissionsByRole = permissions)
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
    const rolePermissionsFiltered = this.permissionsByRole.filter(x => x.idModule === Number(selected.key));
    rolePermissionsFiltered.forEach(element => {
      if (!this.permissionsEdited.find(p => element.id === p.id)) {
        this.permissionShowing.find(x => x.id === element.id).selected = true;
      }
    });
    this.AddPermissionSelected();
  }

  private permissionVMToUpdatePermissionModel() {
    const permissions: UpdatePermission[] = [];
    const updatedPermissions = this.permissionsView.filter(p=> p.selected !== undefined);
    updatedPermissions.forEach(element => {
      permissions.push({IdPermission: element.id, IsActive: element.selected});
    });
    return permissions;
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideEditForm.emit(reload);
  }

  public resetForm() {
    if (this.roleForm.dirty) {
      this.confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar rol?',
        accept: () => {
          this.roleForm.reset(this.setNewRoleForm());
          this.onHideEditForm.emit(false);
        }
      });
    } else {
      this.onHideEditForm.emit(false);
    }
  }

  private setNewRoleForm() {
    return this.formBuilder.group({
      id: -1,
      name: ['', Validators.required],
      systemId: 0,
      idApp: 0,
      idType: ['', Validators.required],
      idCompany: 1,
      isActive: true,
      permissions: [],
      permissionsSelected: [false, Validators.requiredTrue]
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
