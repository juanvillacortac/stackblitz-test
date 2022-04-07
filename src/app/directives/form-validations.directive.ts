import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class OnlyNumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[numbersDecimalOnly]'
})
export class OnlyNumberDecimalDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^0-9\.]+/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[lettersOnly]'
})
export class OnlyLettersDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z ]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[noneSpecialCharacters]'
})
export class NoneSpecialCharactersDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z0-9 ]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[noneSpecialCharactersWihtG]'
})
export class NoneSpecialCharactersWhitGDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z0-9\- ]/g, '');
    if (initalValue !== this._el.nativeElement.value) {
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
