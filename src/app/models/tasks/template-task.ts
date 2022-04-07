import { BaseModel } from '../common/BaseModel';
import { RequiredField } from './required-field';

export class TemplateTask extends BaseModel {
    order: number;
    requiredField: RequiredField[];
}
