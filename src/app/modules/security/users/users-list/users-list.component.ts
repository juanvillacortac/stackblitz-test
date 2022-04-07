import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserPermissions} from 'src/app/modules/security/users/shared/user-permissions.service';
import {UserFilter} from 'src/app/models/security/UserFilter';
import {UserListViewModel} from '../../shared/view-models/UserList.viewmodel';
import {UserService} from '../shared/user.service';
import {User} from 'src/app/models/security/User';
import {BreadcrumbService} from 'src/app/design/breadcrumb.service';
import {Columns} from 'src/app/models/common/columns';
import * as Permissions from '../shared/user-const-permissions';
import {HttpErrorResponse} from "@angular/common/http";
import {DialogsService} from "../../../common/services/dialogs.service";
import { Entity } from 'src/app/models/security/Entity';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

export class UsersListComponent implements OnInit {
  displayedColumns: Columns[];
  UserListVM: UserListViewModel[] = [];
  userFilter: UserFilter;
  permissionsIDs = {...Permissions};

  constructor(
    private _userService: UserService, 
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public userPermissions: UserPermissions,
    private readonly dialogService: DialogsService,
    private readonly translateService: TranslateService
  ) {
    this.setBreadCrumb()
  }

  ngOnInit(): void {
    this.setupUserFilter();
    this.setupColumns();
    this.getAllUsers();
  }

  private getAllUsers() {
    this._userService.getAllUsersPromise({...this.userFilter})
      .then(res => this.fromUserListToUserListViewModel(res))
      .catch(error => this.handleError(error));
  }

  private fromUserListToUserListViewModel(userList: User[]) {
    const tempList: UserListViewModel[] = [];
    userList.forEach((user: User) => {
      this.pushIfNotExist(tempList, user);
    });
    this.UserListVM = tempList;
  }

  private pushIfNotExist(tempList: UserListViewModel[], element: User) {
    if (tempList.find(item => Number(item.id) === element.id) == null) {
      tempList.push({
        lastName: element.person.lastName,
        email: element.mainEmail,
        id: element.id,
        name: element.person.name,
        status: Boolean(element.status) ? 'ACTIVO' : 'INACTIVO',
        document: this.getUserDocument(element.person) ?? 
                  this.translateService.instant(this.getHeaderCollumnsName('no_document'))
      });
    }
  }

  async onEdit(id) {
    this.router.navigate(['/security/user-detail', id]);
  }

  openNew = () => {
    this.router.navigate(['/security/register-wizard']);
  }

  private setupUserFilter() {
    this.userFilter = {
      idCompany: 0,
      idRole: 0,
      idSubsidiary: 0,
      idUser: 0,
      mainEmail: '',
      status: -1
    };
  }

  private setupColumns() {
    this.displayedColumns = [
      {field: 'id', header: 'Id', display: 'none'},
      {field: 'name', header: this.getHeaderCollumnsName('name'), display: 'table-cell'},
      {field: 'lastName', header: this.getHeaderCollumnsName('lastName'), display: 'table-cell'},
      {field: 'email', header: this.getHeaderCollumnsName('email'), display: 'table-cell'},
      {field: 'status', header: this.getHeaderCollumnsName('status'), display: 'table-cell'},
      {field: 'document', header: this.getHeaderCollumnsName('document'), display: 'table-cell'},
      
    ];
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      {label: 'Seguridad'},
      {label: 'Usuarios', routerLink: ['/security/user-list']}
    ]);
  }

  private getHeaderCollumnsName(key: string) {
    return `security_module.${key}`;
  }

  private getUserDocument(person: Entity){
    const document = person?.dniNumber.length > 0 ? 
                     person.identifier +'-'+ person.dniNumber : 
                     this.translateService.instant(this.getHeaderCollumnsName('no_document'));
    return document;
  }
}