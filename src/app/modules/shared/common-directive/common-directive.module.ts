import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoneSpecialCharactersDirective, OnlyLettersDirective, OnlyNumberDirective, InternationalPhoneNumberDirective } from 'src/app/directives/form-validations.directive';


@NgModule({
  declarations: [NoneSpecialCharactersDirective, OnlyNumberDirective, OnlyLettersDirective, InternationalPhoneNumberDirective],
  imports: [
    CommonModule
  ],
  exports: [
    NoneSpecialCharactersDirective,
    OnlyNumberDirective,
    OnlyLettersDirective,
    InternationalPhoneNumberDirective
  ]
})
export class CommonDirectiveModule { }
