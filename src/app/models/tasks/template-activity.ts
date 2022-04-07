import { BaseModel } from '../common/BaseModel';
import { RequiredField } from './required-field';
import { TemplateTask } from './template-task';

export class TemplateActivity extends BaseModel {
    taskList: TemplateTask[];
    requiredField: RequiredField[];
    documentTypeOperationsId: number;
}
