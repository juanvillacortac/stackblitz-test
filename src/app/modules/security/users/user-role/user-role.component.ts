import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { SecurityService } from '../../shared/services/security.service';
import { RoleService } from '../../roles/shared/role.service';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { Software } from 'src/app/models/security/Software';
import { Role } from 'src/app/models/security/Role';
import { CheckOption } from 'src/app/modules/common/components/check-list/check-list.component';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HttpErrorResponse } from "@angular/common/http";
import { DialogsService } from "../../../common/services/dialogs.service";
import { Office } from "../../../../models/security/Office";

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})

export class UserRoleComponent implements OnInit {
  addUserRoleForm: FormGroup;
  systems: Software[] = [];
  allRoles: Role[] = [];
  rolTypes: SelectItem[] = [];
  roles: SelectItem[] = [];
  newUserRole: RoleByUser[] = [];
  officesView: CheckOption[] = [];
  isEdit = false;
  isWizardMode: boolean;
  formTitle: string;
  selectAll: boolean;
  roleTypeSelected = false;
  roleAdded: boolean;
  companyId: number;

  @Output() public onHideEditForm: EventEmitter<boolean> = new EventEmitter();
  @Input() idRole: number;
  @Input() idRoleType: number;
  @Input() userRoles: RoleByUser[];
  @Input() firstIdRoleType: number;

  constructor(
    public securityService: SecurityService,
    public service: RoleService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private actRoute: ActivatedRoute,
    private readonly _dialogService: DialogsService,
    private authService: AuthService
  ) {
    this.addUserRoleForm = this.setNewUserRoleForm();
  }

  ngOnInit(): void {
    this.companyId = this.authService.currentCompany;
    this.isWizardMode = this.route.snapshot.url[0].path === 'roles' ?? false;
    const id = this.actRoute.snapshot.params['id'];
    if (id) {
      this.addUserRoleForm.controls.idUser.setValue(id);
    }

    if (this.idRole > 0) {
      this.formTitle = this.getText('edit_rol');
      this.isEdit = true;
      this.getRolesType()

    } else {
      this.formTitle = this.getText('assign_rol');
      this.isEdit = false;
      this.getRolesType()
      this.getOfficeByCompany(this.companyId)
    }
  }

  getRolesType() {
    this.service.getRoleTypes()
      .then(result => {
        const actualRoleType = result.filter(x => x.id === this.firstIdRoleType);

        if(actualRoleType && actualRoleType.length > 0) {
          result = result.filter(x => x.userTypeId === actualRoleType[0].userTypeId);
        }
        this.rolTypes = this.mapToSelectItem(result)
      })
      .then(_ => {
        if (this.idRoleType && this.idRoleType > 0) {
          this.addUserRoleForm.controls.idType.setValue(this.idRoleType);
          this.getRolesByType(this.idRoleType)
          this.roleTypeSelected = true
        }
      })
      .catch(error => this.handleError(error));
  }

  getRolesByType(idRoleType) {
    this.service.getRoles(idRoleType, this.companyId)
      .then(result => {
        this.roles = this.mapToSelectItem(result);
        this.allRoles = result;
        if (this.idRole && this.idRole > 0) {
          this.addUserRoleForm.controls.idRole.setValue(this.idRole);
          this.getSystemsByRole(this.idRole)
          this.getOfficeByCompany(this.companyId)
        }
      })
      .catch(error => this.handleError(error));
  }

  getSystemsByRole(idRole) {
    this.getSystems(idRole);
  }

  getOfficeByCompany(companyId) {
    this.securityService.getOffices(companyId)
      .then(result => this.officesView = this.mapOfficeToCheckOption(result))
      .then(_ => this.selectOfficesByRole(this.idRole))
      .catch(error => this.handleError(error));
  }

  onRoleTypeSelected(roleType) {
    this.cleanOfficesSelected();
    if (roleType) {
      this.roleTypeSelected = true;
      this.getRolesByType(roleType);
    } else {
      this.roles = [];
      this.allRoles = [];
      this.systems = [];
      this.selectAll = false;
      this.roleTypeSelected = false;
    }

  }

  onRoleSelected(role) {
    this.cleanOfficesSelected();
    this.systems = [];
    this.selectAll = false;
    if (role) {
      this.selectOfficesByRole(role);
      this.getSystems(role);
      this.validateUserRole(role);
    }
  }

  validateUserRole(role) {
    const roleAdded = this.userRoles.find(x => x.idRole === role);
    this.roleAdded = roleAdded && !this.isEdit;
  }

  onOfficesSelected(_options: [CheckOption]): void {
    const isSelected = this.officesView.filter(x => x.selected);
    this.enableSaveButton(isSelected.length > 0 || this.isEdit);
    this.selectAll = this.officesView.every(x => x.selected);
  }

  enableSaveButton(enable: Boolean) {
    this.addUserRoleForm.get('officesSelected').setValue(enable);
  }

  onSave() {
    const selectedIds = this.officesView.filter(x => x.selected).map(item => item.id);
    if (selectedIds.length === 0 && !this.isEdit) {
      this._dialogService.warnMessage(this.getText('assign_rol'), this.getText('office_required'));
      return;
    }
    this.addUserRoleForm.get('officesIds').setValue(selectedIds);
    const idUser = Number(this.addUserRoleForm.controls.idUser.value);
    const idRole = this.addUserRoleForm.get('idRole').value;
    const newUserRole: RoleByUser[] = [];
    this.officesView.forEach(element => {
      newUserRole.push({
        id: -1,
        idUser: idUser,
        idRole: idRole,
        idCompany: this.companyId,
        idSubsidiary: element.id,
        isActive: element.selected
      });
    });
    this.service.addUserRole(newUserRole)
      .then(result => {
        if (result) {
          this._dialogService.successMessage(this.getText('assign_rol'), this.getText('added_roles'))
          if (this.isWizardMode) {
            this.router.navigate(['/security/register-wizard/permisos', idUser]);
          } else {
            this.onEmitHideForm(true);
          }
        } else {
          this._dialogService.warnMessage(this.getText('assign_rol'), this.getText('assign_rol_error'));
          if (!this.isWizardMode) {
            this.onEmitHideForm(false);
          }

        }
      })
      .catch(error => {
        this.handleError(error);
        this.onEmitHideForm(false);
        console.log(error.error.message);
      });
  }

  getSystems(role) {
    const softwareByRole: Software[] = [];
    const rolesFiltered = this.allRoles.find(x => x.id === role).softwares;
    rolesFiltered.forEach(element => softwareByRole.push(element));
    this.systems = softwareByRole;
  }

  private mapToSelectItem(roleTypes: any[]) {
    return roleTypes.map(value => this.newSelectItem(value));
  }

  private newSelectItem = (value: any) => ({
    value: value.id,
    label: value.name
  });

  private mapOfficeToCheckOption(offices: Office[]): CheckOption[] {
    return offices.map(office => this.newCheckOption(office));
  }

  private newCheckOption = (value: Office): CheckOption => ({
    id: value.id,
    name: value.name,
    selected: false
  });

  private cleanOfficesSelected() {
    this.officesView.forEach(element => element.selected = false);
    this.enableSaveButton(false);
  }

  private selectOfficesByRole(role) {
    const userRolesFiltered = this.userRoles.filter(x => x.idRole === role);
    userRolesFiltered.forEach(element => {
      this.officesView.find(x => x.id === element.idSubsidiary).selected = true;
    });
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideEditForm.emit(reload);
  }

  private setNewUserRoleForm() {
    return this.formBuilder.group({
      idType: [undefined, Validators.required],
      idRole: [undefined, Validators.required],
      idCompany: [1, Validators.required],
      idSystem: '',
      isActive: true,
      idOffices: '',
      officesIds: [],
      idUser: ['', Validators.required],
      officesSelected: [false, Validators.requiredTrue]
    });
  }

  private handleError(error: HttpErrorResponse) {
    this._dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private getText(key: string) {
    return `security_module.user.${key}`;
  }
}
