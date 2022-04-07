import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

import {AuthService} from '../shared/auth.service';
import {CredentialsViewModel} from '../shared/view-models/CredentialsViewModel';
import {EncryptService} from "../../security/shared/services/encrypt.service";
import {DialogsService} from "../../common/services/dialogs.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginInvalid: boolean;
  rememberMe: boolean;
  dark = false;
  private formSubmitAttempt: boolean;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _messageService: MessageService,
    private readonly _authService: AuthService,
    private readonly _dialogService: DialogsService,
    private readonly _encryptService: EncryptService
  ) {
      if (this._authService.isLoggedIn()) {
        this._router.navigate(['home']);
      } else {
        this._authService.getReadyLogin();
      }
    }

  async ngOnInit() {
    this.loginForm = this._formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.rememberMe = false;
    this.onChange();
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.loginForm.valid) {
      try {
        const credentials = new CredentialsViewModel();
        credentials.password = this.loginForm.controls.password.value;
        credentials.user = this.loginForm.controls.user.value;
        credentials.rememberMe = this.rememberMe;
        this.doLogin(credentials);
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  onChange(): void {
    this.loginForm.valueChanges.subscribe( () => {
      if (this.loginInvalid) {
        this.loginInvalid = false;
      }
    });
  }

  private doLogin(credentialsVM: CredentialsViewModel) {
    const passwordEncrypt: string = this._encryptService.encrypt(credentialsVM.password, credentialsVM.user);
    this._authService.login(passwordEncrypt, credentialsVM.user, credentialsVM.rememberMe)
      .then(_ => {
          this._router.navigate(['home']);
          this.loginInvalid = false;
      })
      .catch(error => {
        this.loginInvalid = true;
        this._messageService.add({severity: 'error', summary: 'Autenticación', detail: error?.error?.message});
      });
  }
  
  onChangeRememberMe() {
    this._authService.updateRememberMe(!this.rememberMe);
    this.rememberMe = !this.rememberMe;
  }

  get user() {return this.loginForm.get('user'); }
  get password() {return this.loginForm.get('passwords'); }
}
