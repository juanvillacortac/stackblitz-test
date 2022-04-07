import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LoginRoutingModule } from './login-routing.module';
import { ChangePasswordComponent } from '../security/users/change-password/change-password.component';
import { PrimengModule } from "../primeng/primeng.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent,
    PasswordRecoveryComponent,
    RecoverPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
  ]
})
export class LoginModule { }
