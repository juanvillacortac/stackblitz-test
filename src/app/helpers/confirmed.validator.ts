import { FormGroup } from '@angular/forms';
import { RateTypeEnum } from '../models/common/rate-type-enum';

export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
  };
}

export function ValueValidatorRateType(evaluateControlName: string, controlName: string){
    return (formGroup: FormGroup) => {
        const value = formGroup.controls[evaluateControlName];
        const rateTypeSelected = formGroup.controls[controlName];
        if (value.errors && !value.errors.ValueValidatorRateType) {
            return;
        }
        if(rateTypeSelected.value !== RateTypeEnum.formula)
        {
            if (value.value < 0) {
                value.setErrors({ ValueValidatorRateType: true });
            } else {
                value.setErrors(null);
            }
        }
        else
        {
            value.setErrors(null); 
        }       
  };
}

export function ValueMoreThanZeroValidator(evaluateControlName: string){
    return (formGroup: FormGroup) => {
        const value = formGroup.controls[evaluateControlName];
        if (value.errors && !value.errors.ValueValidatorRateType) {
            return;
        }
        if (value.value <= 0) {
            value.setErrors({ ValueMoreThanZeroValidator: true });
        } else {
            value.setErrors(null);
        }
  };
}
