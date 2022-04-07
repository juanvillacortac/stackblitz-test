import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ConfirmedValidator} from 'src/app/helpers/confirmed.validator';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import {MessageService} from 'primeng/api';
import {BreadcrumbService} from 'src/app/design/breadcrumb.service';
import {HttpErrorResponse} from "@angular/common/http";
import {DialogsService} from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  get userByRoute() {
    return this._actRoute.snapshot.params['id'];
  }

  user_id: string;
  changePasswordForm: FormGroup;
  hideOldP: Boolean = false;
  hideNewP: Boolean = false;
  hideConfirmP: Boolean = false;
  isRecovery: Boolean;
  dark: Boolean = false;
  email: string;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _actRoute: ActivatedRoute,
    private readonly _messageService: MessageService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _authService: AuthService,
    private readonly _dialogService: DialogsService,
  ) {
  }

  ngOnInit() {
    this.email = this._authService.userName;
    if (this.userByRoute) {
      this.user_id = this.userByRoute;
      this.isRecovery = true;
      this.setupRecoveryPasswordForm();
    } else {
      this.user_id = this._authService.idUser;
      this.isRecovery = false;
      this.setupChangePassWordForm();
    }
    this.setBreadCrumbItems();
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      if (this.isRecovery) {
        this.executeRecoverypassword();
      } else {
        this.executeChangePassWord();
      }
    }
  }

  navigateBack() {
    this._router.navigate(['/profile/me']);
  }
  
  private executeChangePassWord() {
    const formValues = {...this.changePasswordForm.value};
    this._authService.changePassword(formValues.idUser, this.email, formValues.newPassword, formValues.password, 0)
      .then(_ => {
        this._dialogService.successMessage('Modificar contraseña', 'Se ha actualizado la contraseña exitosamente');
        this._router.navigate(['landing']);
      })
      .catch(error => this.handleError(error));
  }

  private executeRecoverypassword() {
    const formValues = {...this.changePasswordForm.value};
    this._authService.recoveryPassword(Number(formValues.idUser), formValues.newPassword)
      .then(_ => {
        this._dialogService.successMessage('Recuperar contraseña', 'Se ha actualizado la contraseña exitosamente')
        this._router.navigate(['']);
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this._dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
  
  private setupRecoveryPasswordForm() {
    this.changePasswordForm = this._fb.group({
        idUser: this.user_id,
        mainEmail: '',
        password: '',
        newPassword: ['', Validators.required],
        verificationPassword: ['', Validators.required],
        userModified: 0
      },
      {validators: ConfirmedValidator('newPassword', 'verificationPassword')});
  }
  
  private setupChangePassWordForm() {
    this.changePasswordForm = this._fb.group({
      idUser: this.user_id,
      mainEmail: [{value: this.email, disabled: true}, [Validators.required, Validators.email]],
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      verificationPassword: ['', Validators.required],
      userModified: 0
    }, {validators: ConfirmedValidator('newPassword', 'verificationPassword')});
  }

  private setBreadCrumbItems() {
    this._breadcrumbService.setItems([
      {label: 'Perfil', routerLink: ['/profile/me']},
      {label: 'Actualizar contraseña'}
    ]);
  }
}
