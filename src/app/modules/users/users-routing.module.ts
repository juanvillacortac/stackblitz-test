import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from "../security/users/change-password/change-password.component";
import { UserDashboardComponent } from "./dashboard-profile/user-dashboard/user-dashboard.component";
import { ProfileDetailsComponent } from "./profile-details/profile-details.component";
import { LayoutComponent } from "../layout/layout/layout.component";
import { AuthGuard } from "../../guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'me', component: UserDashboardComponent },
      { path: 'edit/:id', component: ProfileDetailsComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
