import { ControlType } from './control-type.enum';
import { RequiredFieldValidators } from './required-field-validators';
import { ServiceCallType } from './service-call-type.enum';

export interface RequiredField {
  name: string;
  label: string;
  value?: string;
  type: ControlType;
  required: boolean;
  validators?: RequiredFieldValidators;
  serviceCall?: ServiceCallType;
  options?: any[];
}
