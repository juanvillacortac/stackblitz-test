import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateCategory } from 'src/app/models/tasks/template-category';
import { TasksService } from '../../shared/tasks.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { TemplateTask } from 'src/app/models/tasks/template-task';
import { TemplateActivity } from 'src/app/models/tasks/template-activity';
import { ControlType } from 'src/app/models/tasks/control-type.enum';
import { ServiceCallType } from 'src/app/models/tasks/service-call-type.enum';
import { RequiredField } from 'src/app/models/tasks/required-field';


@Component({
  selector: 'app-tasks-supervisor-add',
  templateUrl: './tasks-supervisor-add.component.html',
  styleUrls: ['./tasks-supervisor-add.component.scss']
})
export class TasksSupervisorAddComponent implements OnInit {

  requiredfields: RequiredField[];
  requiredFieldsForm: FormGroup;
  @Output() activityCreated = new EventEmitter<boolean>();
  tasks: TemplateTask[] = [];
  modules: TemplateCategory[] = [];
  templates: TemplateActivity[] = [];
  templateForm: FormGroup;
  cols: any[];

  user: string ="user"
  userIdSelected: number = -1;

  submitted = false;
  displayDialog = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: DialogsService,
    private readonly service: TasksService
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
  }

  ngOnInit(): void {
    this.setupForm();
    this.setupColumns();
    this.loadTemplateCategories();
  }
  loadRequiredFields() {
    this.requiredfields = [
      { name: 'motive', label: 'Motivos', type: ControlType.search, required: true, serviceCall: ServiceCallType.motives },
      { name: 'country', label: 'Paises', type: ControlType.search, required: true, serviceCall: ServiceCallType.country },
      { name: 'branches', label: 'Sucursales', type: ControlType.search, required: true, serviceCall: ServiceCallType.branchoffice },
      { name: 'name', label: 'Nombre', type: ControlType.input, required: true} ];
  }

  submitActivity() {
    this.submitted = true;
    if (this.templateForm.valid && this.isRequiredFormFieldsValid()) {
      const requiredFieldData = this.getRequiredFieldsFormData();
      const selectedTemplate = this.templateForm.value['idTemplate'].id;
      const documentTypeId = this.templateForm.value['idTemplate'].documentTypeOperationsId;
      const endDate = this.templateForm.value['endDate'];
      this.service.saveActivityByTemplate(selectedTemplate, documentTypeId, endDate, this.userIdSelected, requiredFieldData)
        .then(_ => this.onActivityCreated())
        .catch(error => this.handleError(error));
    }
  }

  isRequiredFormFieldsValid() {
    return (this.requiredfields.length > 0 && this.requiredFieldsForm.valid) || (this.requiredfields.length === 0 ?? true);
  }

  categorySelected(_event) {
    this.loadTemplates(_event.value.idActivityCategory);
    console.log(this.requiredfields);
  }

  templateSelected(_event) {
    const idTemplate = _event.value.id;
    const selectedTemplate = this.templates.find(t => t.id === idTemplate);
    this.tasks = selectedTemplate.taskList;
    this.requiredfields = selectedTemplate.requiredField;

    console.log(this.requiredfields);
  }

  isFormFieldValid(fieldName: string) {
    const field = this.templateForm.get(fieldName);
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }
  setRequiredFieldSelection(formGrup) {
      this.requiredFieldsForm = formGrup;
  }

  onCancelPressed() {
    this.activityCreated.emit(false);
  }

  onSelectUser(user) {
    this.userIdSelected = user[0].id ?? -1;
  }

  private onActivityCreated() {
    this.dialogService.successMessage('tasks.tasks', 'tasks.save_activity_success');
    this.activityCreated.emit(true);
  }

  private loadTemplateCategories() {
    this.service.getTemplateCategories()
      .then(categories => this.modules = categories)
      .catch(error => this.handleError(error));
  }

  private loadTemplates(idCategory: number) {
    this.service.getActivityTemplates(idCategory)
      .then(templateActivities => this.templates = templateActivities)
      .catch(error => this.handleError(error));
  }

  private setupForm() {
    this.templateForm = this.formBuilder.group({
      id: [-1],
      idModule: [undefined, Validators.required],
      idTemplate: [undefined, Validators.required],
      endDate: [undefined, Validators.required]
    });
  }

  private setupColumns() {
    this.cols = [
      { field: 'order', display: 'table-cell', header: 'tasks.template_order' },
      { field: 'name', display: 'table-cell', header: 'tasks.task' }
    ];
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('tasks.tasks', error?.error?.message ?? 'error_service');
  }

  private getRequiredFieldsFormData() {
    const data = [];
    this.requiredfields.map(item => {
      if (item.type === ControlType.dropDown || item.type === ControlType.search ) {
        data.push({name: item.name, value: this.requiredFieldsForm.value[item.name]?.id ?? null});
      } else {
        data.push({name: item.name, value: this.requiredFieldsForm.value[item.name] ?? null});
      }
    });
    return JSON.stringify(data);
  }
}
