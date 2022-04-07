import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Columns } from 'src/app/models/common/columns';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { RoleService } from '../../roles/shared/role.service';
import { UserPermissions } from '../shared/user-permissions.service';
import * as Permissions from '../shared/user-const-permissions';
import { HttpErrorResponse } from "@angular/common/http";
import { DialogsService } from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent implements OnInit {

  displayedColumns: Columns[];
  roleList: RoleByUser[] = [];
  roleListDetail: RoleByUser[] = [];
  shownEditRole = false;
  idRole = 0;
  idRoleType = 0;
  firstIdRoleType= 0;
  permissionsIDs = {...Permissions};

  constructor(
    public service: RoleService,
    private router: Router,
    private actRoute: ActivatedRoute,
    public userPermissions: UserPermissions,
    private readonly dialogService: DialogsService
  ) {
  }

  ngOnInit(): void {
    this.setupColumns();
    const idUser = Number(this.actRoute.snapshot.params['id']);
    this.getUserRoles(idUser);
  }

  getUserRoles(idUser: number) {
    const idCompany = 1;
    this.service.getUserRoles(idCompany, idUser)
      .then(result => this.groupRoles(result))
      .catch((error) => this.handleError(error));
  }

  private groupRoles(result: RoleByUser[]) {
    const roles: RoleByUser[] = [];
    this.roleListDetail = result;
    result.forEach(element => this.pushIfNotExist(roles, element));
    this.roleList = roles;
  }

  private pushIfNotExist(roles: RoleByUser[], element: RoleByUser) {
    if (roles.find(item => Number(item.idRole) === element.idRole) == null) {
      roles.push(element);
    }
  }

  openNew() {
    this.idRole = -1;
    this.idRoleType = -1;
    
    if(this.roleList && this.roleList.length > 0) {
      this.firstIdRoleType = this.roleList[0].idType;
    }
    this.roleListDetail = [];
    this.shownEditRole = true;
  }

  onEdit(id, idRoleType) {
    this.idRole = id;
    this.idRoleType = idRoleType;
    this.firstIdRoleType = idRoleType;
    this.shownEditRole = true;
  }

  public childCallBack(reload: boolean): void {
    this.shownEditRole = false;
    if (reload) {
      const idUser = Number(this.actRoute.snapshot.params['id']);
      this.getUserRoles(idUser);
    }
  }

  private setupColumns() {
    this.displayedColumns =
      [
        {field: 'idRole', header: 'IdRole', display: 'none'},
        {field: 'idType', header: 'IdRoleType', display: 'none'},
        {field: 'name', header: this.getTexts('role'), display: 'table-cell'},
        {field: 'companyName', header: this.getTexts('company'), display: 'table-cell'},
        {field: 'type', header: this.getTexts('type'), display: 'table-cell'},
        {field: 'edit', header: '', display: 'table-cell'}
      ];
  }

  private getTexts(key: string) {
    return `security_module.${key}`;
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
