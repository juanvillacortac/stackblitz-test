import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {BreadcrumbService} from 'src/app/design/breadcrumb.service';
import {Columns} from 'src/app/models/common/columns';
import {Role} from 'src/app/models/security/Role';
import {UserPermissions} from '../../users/shared/user-permissions.service';
import {RoleService} from '../shared/role.service';
import * as Permissions from '../../users/shared/user-const-permissions';
import {HttpErrorResponse} from "@angular/common/http";
import {DialogsService} from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})

export class RolesListComponent implements OnInit {
  displayedColumns: Columns[];
  roleList: Role[] = [];
  shownEditRole = false;
  roleSelected: Role;
  idRole = 0;
  rows = 10;
  permissionsIDs = {...Permissions};

  constructor(
    public service: RoleService,
    public router: Router,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private readonly dialogService: DialogsService
  ) {
    this.setBreadCrumb();
    this.setupColumns();
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.service.getRoles(-1, 1)
      .then(result => this.roleList = result)
      .catch(error => this.handleError(error));
  }

  openNew() {
    this.roleSelected = null;
    this.idRole = -1;
    this.shownEditRole = true;
  }

  onEdit(role) {
    this.roleSelected = role;
    this.idRole = role.id;
    this.shownEditRole = true;
  }

  public childCallBack(reload: boolean): void {
    this.shownEditRole = false;
    if (reload) {
      this.getRoles();
    }
  }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      {label: 'Seguridad'},
      {label: 'Roles', routerLink: ['/role-list']}
    ]);
  }

  private setupColumns() {
    this.displayedColumns = [
      {field: 'id', header: 'Id', display: 'none'},
      {field: 'name', header: this.getHeaderCollumnsName('name'), display: 'table-cell'},
      {field: 'companyName', header: this.getHeaderCollumnsName('company'), display: 'table-cell'},
      {field: 'type', header: this.getHeaderCollumnsName('type'), display: 'table-cell'},
      {field: 'softwares', header: this.getHeaderCollumnsName('systems'), display: 'table-cell'},
      {field: 'isActive', header: this.getHeaderCollumnsName('status'), display: 'table-cell'},
      {field: 'edit', header: '', display: 'table-cell'}
    ];
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private getHeaderCollumnsName(key: string) {
    return `security_module.${key}`;
  }
}
