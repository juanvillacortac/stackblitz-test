import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Console } from 'console';

@Directive({
  selector: '[numbersOnly]'
})
export class OnlyNumberDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^0-9]*/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[lettersOnly]'
})
export class OnlyLettersDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^a-zA-ZäÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ ]/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  selector: '[noneSpecialCharacters]'
})
export class NoneSpecialCharactersDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^a-zA-Z0-9À-ú ]/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[internationalPhoneNumber]'
})
export class InternationalPhoneNumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^+0-9 ]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[firstLetterUpperCase]'
})
export class FirstLetterUpperCaseDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const position = this._el.nativeElement.selectionStart;
    const aceptedValue = this._el.nativeElement.value = this._el.nativeElement.value.length == 1 ? this._el.nativeElement.value.charAt(0).toUpperCase().trim() : this._el.nativeElement.value.charAt(0).toUpperCase().trim() + this._el.nativeElement.value.substr(1);                      
    //const consecutiveUpperCase= aceptedValue.replace(/(?<![A-Z])[A-Z]{2}(?![A-Z])/g, e=> e.charAt(0).toUpperCase()+e.charAt(1).toLowerCase());
    this.control.control.setValue(aceptedValue);
    this._el.nativeElement.selectionEnd = position;    
  }
}

@Directive({
  selector: '[sentenceType]'
})
export class SentenceTypeDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const position = this._el.nativeElement.selectionStart;
    const aceptedValue = this._el.nativeElement.value = this._el.nativeElement.value.length == 1 ? this._el.nativeElement.value.charAt(0).toUpperCase().trim() : this._el.nativeElement.value.charAt(0).toUpperCase().trim() + this._el.nativeElement.value.substr(1).toLowerCase();                      
    this.control.control.setValue(aceptedValue); 
    this._el.nativeElement.selectionEnd = position;    
  }
}

@Directive({
  selector: '[onlyUpperCase]'
})
export class OnlyUpperCaseDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const position = this._el.nativeElement.selectionStart;
    const aceptedValue = this._el.nativeElement.value = this._el.nativeElement.value.toUpperCase();
    this.control.control.setValue(aceptedValue); 
    this._el.nativeElement.selectionEnd = position;    
  }
}

@Directive({
  selector: '[appNoDblClick]'
})
export class NoDblClickDirective {
  
  constructor() { }
  
  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.setAttribute('disabled', true);
    setTimeout(function(){ 
      event.srcElement.removeAttribute('disabled');
    }, 0);
  }

}

const DISABLE_TIME = 1000;

@Directive({
    selector: 'button[n-submit]'
})
export class DisableButtonOnSubmitDirective {
    constructor(private elementRef: ElementRef) { }
    @HostListener('click', ['$event'])
    clickEvent() {
        this.elementRef.nativeElement.setAttribute('disabled', 'true');
        setTimeout(() => this.elementRef.nativeElement.removeAttribute('disabled'), DISABLE_TIME);
    }
}

@Directive({
  selector: "[autoFocus]"
})
export class AutoFocusDirective implements OnInit {
  private inputElement: HTMLElement;

  constructor(private elementRef: ElementRef) {
    this.inputElement = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.inputElement.focus();
  }
}







