import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule  } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { RoleDetailComponent } from './roles/role-detail/role-detail.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { UserRoleComponent } from './users/user-role/user-role.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserPermissionsComponent } from './users/user-permissions/user-permissions.component';
import { UserRoleListComponent } from './users/user-role-list/user-role-list.component';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { SecurityRoutingModule } from './security-routing.module';
import { RegisterUsersWizardComponent } from './users/register-user-wizard/register-user-wizard.component';
import { PrimengModule } from "../primeng/primeng.module";

@NgModule({
  declarations: [
    RoleDetailComponent,
    RolesListComponent,
    UserRoleComponent,
    UsersListComponent,
    UserPermissionsComponent,
    RegisterUserComponent,
    UserDetailComponent,
    UserRoleListComponent,
    RegisterUsersWizardComponent
  ],
  imports: [
    SecurityRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    PrimengModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
   ]
})
export class SecurityModule { }
