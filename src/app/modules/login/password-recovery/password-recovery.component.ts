import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { BaseError } from 'src/app/models/common/errors/BaseError';
import { OtpCode } from 'src/app/models/security/OtpCode';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  generateOTPForm: FormGroup;
  validateOtpForm: FormGroup;
  receiveByEmail: boolean;
  otpSended: boolean = false;
  dark: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private messageService: MessageService
      ) {}

  ngOnInit(): void {
    this.generateOTPForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      receiveByEmail: [false, Validators.required]
    });
    this.validateOtpForm = this.fb.group({
      otpCode: ['', [Validators.minLength(5), Validators.maxLength(5), Validators.required]],
      idUser: ''
    });
  }
  async onGenerateOTPCode() {
    let otpCode: OtpCode;
    otpCode = {
      user: this.generateOTPForm.controls.username.value,
      receiveByEmail: this.ConvertToBoolean(this.receiveByEmail)
    };
    this.generateOtpCode(otpCode)
  }
  async onValidateOTPCode() {
    let otpCode: OtpCode;
    otpCode = {
      idUser: this.validateOtpForm.controls.idUser.value,
      otp: this.validateOtpForm.controls.otpCode.value
    };
    console.log(otpCode);
    this.validateOptCode(otpCode)
  }

  private generateOtpCode(otpCode) {
    this._authService.generateOtpCode(otpCode).subscribe((res) => {
      this.otpSended = true
      if (!environment.production) {
        this.messageService.add({severity:'success',life:10000, summary:'Generar código OTP', detail: 'El código de validacion es: ' + res.otp});
        console.log(res);
      }
      this.messageService.add({severity:'success',life:5000, summary:'Código de recuperación', detail:this.succesOtpCodeGenerated(otpCode.receiveByEmail)});
      this.validateOtpForm.controls.idUser.setValue(res.idUser);
  },
  (error: BaseError) => {
    console.log(error);
    if(error.Code === 404 ) {
      this.messageService.add({severity:'error', summary:'Generar código de recuperación', detail: error.ErrorMsg});
    } else {
      this.messageService.add({severity:'warn', summary:'Generar código de recuperación', detail: error.ErrorMsg});
    }
  });
  }

  private validateOptCode(otpCode) {
    return this._authService.validateOtp(otpCode).subscribe((res) => {
      if (res) {
        this.messageService.add({severity:'success',life:5000, summary:'Validar código de recuperación', detail: 'Validación Exitosa'});
        this.router.navigate(['recover-password', otpCode.idUser]);
      } else {
      this.messageService.add({severity:'warn',life:5000, summary:'Validar código de recuperación', detail: 'Código invalido'});
      }
    }, (error: BaseError) => {
    this.messageService.add({severity:'error',life:5000, summary:'Validar código de recuperación', detail: error.ErrorMsg});
    });
  }

  private ConvertToBoolean(value)
  {
    return Boolean(value === 'true');
  }

  private succesOtpCodeGenerated(sendByEmail: boolean){
     const messageType= sendByEmail ? "correo electronico" : "número de telefono"
    return "El código de recuperación ha sido enviado a su " + messageType;
  }

  onBack() {
    this.router.navigateByUrl('/')
  }
}
