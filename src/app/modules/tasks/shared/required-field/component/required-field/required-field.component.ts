import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { ControlType } from 'src/app/models/tasks/control-type.enum';
import { RequiredField } from 'src/app/models/tasks/required-field';
import { ServiceCallType } from 'src/app/models/tasks/service-call-type.enum';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { RequiredFieldFactory } from '../../factory/required-field-factory';

@Component({
  selector: 'app-required-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './required-field.component.html',
  styleUrls: ['./required-field.component.scss']
})
export class RequiredFieldComponent implements  OnChanges  {
  @Input() submitted = false;
  @Input() requiredFields: RequiredField[];
  @Output() setSelection  = new EventEmitter<FormGroup>();
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  selection: any;
  data = [];
  maxDate: Date = new Date();
  type = ControlType;
  requiredFieldsForm: FormGroup = this.formBuilder.group({});
  lastQuerySearch = '';
  lastServiceSearch = -1;
  lastResult = [];
  constructor(
    private requiredFieldFacotry: RequiredFieldFactory,
    private readonly loadingSerivce: LoadingService,
    private readonly dialogService: DialogsService,
    private formBuilder: FormBuilder) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.submitted?.currentValue) {
      return;
    }
      this.requiredFieldsForm = this.formBuilder.group({});
      this.createForm(this.requiredFields);
  }
  autoCompleteSearch(event, serviceType) {
     if (this.isSearchEqual(event.query, serviceType)) {
      this.data = [];
      this.data =  this.data.concat(this.lastResult);
      return;
     }
      this.handleDropdownClick();
      this.loadData(event.query, serviceType);

  }
  loadData(value, serviceType) {
    this.requiredFieldFacotry
      .createRequiredField(serviceType).load(value)
      .then(items => { this.data =  items;})
      .then(() => this.saveLastSearch(value, serviceType))
      .then(() => this.handleDropdownClick())
      .catch(error => this.handleError(error));
  }
  saveLastSearch(value: any, serviceType: any) {
    this.lastQuerySearch = value;
    this.lastServiceSearch = serviceType;
    this.lastResult = this.data;
  }

  onChangeSelection() {
    this.setSelection.emit(this.requiredFieldsForm);
  }
  onSelection(selection) {
   this.onChangeSelection();
  }
  createForm(controls: RequiredField[]) {
    for (const control of controls) {
      const validatorsToAdd = [];
      validatorsToAdd.push(Validators.required);

      this.requiredFieldsForm.addControl(
        control.name,
        this.formBuilder.control(control.value, validatorsToAdd)
      );
    }
  }

  isFormFieldValid(fieldName: string) {
    const field = this.requiredFieldsForm.get(fieldName);
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingSerivce.stopLoading();
    this.dialogService.errorMessage('tasks.tasks', error?.error?.message ?? 'error_service');
  }
  isSearchEqual(query, serviceType) {
    return (query === this.lastQuerySearch && serviceType === this.lastServiceSearch);
  }

  handleDropdownClick() {
    if (this.autoComplete.overlayVisible) {
      this.autoComplete.hide();
      this.autoComplete.overlayVisible = false;
    } else {
      this.autoComplete.show();
      this.autoComplete.overlayVisible = true;
    }

  }
}


