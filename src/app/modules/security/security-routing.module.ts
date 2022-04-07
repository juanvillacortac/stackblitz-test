import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LayoutComponent } from '../layout/layout/layout.component';
import { UserDashboardComponent } from '../users/dashboard-profile/user-dashboard/user-dashboard.component';
import { ProfileDetailsComponent } from '../users/profile-details/profile-details.component';
import { RegisterUsersWizardComponent } from './users/register-user-wizard/register-user-wizard.component';
import { RoleDetailComponent } from './roles/role-detail/role-detail.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserPermissionsComponent } from './users/user-permissions/user-permissions.component';
import { UserRoleComponent } from './users/user-role/user-role.component';
import { UsersListComponent } from './users/users-list/users-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'register-wizard', component: RegisterUsersWizardComponent,
        children: [
          { path: '', redirectTo: 'registro', pathMatch: 'full' },
          { path: 'registro', component: RegisterUserComponent },
          { path: 'roles/:id', component: UserRoleComponent },
          { path: 'permisos/:id', component: UserPermissionsComponent }
        ]
      },
      { path: 'user-detail/:id', component: UserDetailComponent },
      { path: 'user-list', component: UsersListComponent },
      { path: 'user-role', component: UserRoleComponent },
      { path: 'user-permissions', component: UserPermissionsComponent },
      { path: 'user-register', component: RegisterUserComponent },
      { path: 'role-list', component: RolesListComponent },
      { path: 'role-detail', component: RoleDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
