import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'passwordrecovery', component: PasswordRecoveryComponent },
    { path: 'recover-password/:id', component: RecoverPasswordComponent }
    ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
