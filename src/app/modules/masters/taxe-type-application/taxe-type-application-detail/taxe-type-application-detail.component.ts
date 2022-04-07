import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { TaxeTypeApplicationService } from '../shared/taxe-type-application.service';

@Component({
  selector: 'app-taxe-type-application-detail',
  templateUrl: './taxe-type-application-detail.component.html',
  styleUrls: ['./taxe-type-application-detail.component.scss']
})
export class TaxeTypeApplicationDetailComponent implements OnInit {
  submitted = false;
  taxeTypeApplicationForm: FormGroup;
  isEdit = false;
  formTitle: string;
  taxeTypeApplicationAdded: boolean;
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() taxeTypeApplication: TaxeTypeApplication;
  @Input() taxeTypeApplicationList: TaxeTypeApplication[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _taxeTypeApplicationService: TaxeTypeApplicationService,
    private _securityService: SecurityService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.taxeTypeApplicationForm = this.setNewTaxeTypeApplicationForm();
  }
  ngOnInit(): void {
    if (this.taxeTypeApplication) {
      this.formTitle = 'Editar tipo aplicación de impuesto';
      this.isEdit = true;
      this.onEditForm();
    } else {
      this.formTitle = 'Nuevo tipo aplicación de impuesto';
      this.isEdit = false;
      this.taxeTypeApplicationForm.controls.statusValue.setValue('1');
    }
  }
  onEditForm() {
    this.taxeTypeApplicationForm.patchValue({
              id: this.taxeTypeApplication.id,
              name: this.taxeTypeApplication.name,
              abbreviation: this.taxeTypeApplication.abbreviation,
              statusValue: this.taxeTypeApplication.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
  });
}

  toTaxeTypeApplicationModel() {
    const model = new TaxeTypeApplication();

          model.id = this.taxeTypeApplicationForm.controls.id.value;
          model.name = this.taxeTypeApplicationForm.controls.name.value;
          model.abbreviation = this.taxeTypeApplicationForm.controls.abbreviation.value;
          model.active = this.taxeTypeApplicationForm.controls.statusValue.value === '0' ? false : true;

      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.taxeTypeApplicationForm.invalid) {
      return;
    }
    const newTaxeTypeApplication = this.toTaxeTypeApplicationModel();
    if (this.isValidateTaxeTypeApplication(newTaxeTypeApplication)) {
      this._taxeTypeApplicationService.addTaxeTypeApplication(newTaxeTypeApplication).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
          this.onEmitHideForm(true);
        } else if (data === -1) {
          this.messageService.add({key: 'taxe-type-application', severity: 'error', summary: 'Error', detail: 'Este tipo de aplicación de impuesto ya existe'});
        } else {
          this.messageService.add({key: 'taxe-type-application', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el tipo de aplicación de impuesto'});
        }
      }, () => {
        this.messageService.add({key: 'taxe-type-application', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar el tipo de aplicación de impuesto'});
      });
    }
}
  isValidateTaxeTypeApplication(newTaxeTypeApplication: TaxeTypeApplication) {
      const inValidateName = this.taxeTypeApplicationList.find(p=> p.name.trim().toUpperCase() === newTaxeTypeApplication.name.trim().toUpperCase() && p.id !== newTaxeTypeApplication.id);
      const inValidateAbbreviation = this.taxeTypeApplicationList.find(p=> p.abbreviation.trim().toUpperCase() === newTaxeTypeApplication.abbreviation.trim().toUpperCase() && p.id !== newTaxeTypeApplication.id);

      if (inValidateName) {
        this.messageService.add({key: 'taxe-type-application', severity: 'error', summary: 'Error', detail: 'El tipo de aplicación de impuesto ya se encuentra registrado.'});
        return false;
      }

      if (inValidateAbbreviation) {
        this.messageService.add({key: 'taxe-type-application', severity: 'error', summary: 'Error', detail: 'Ya existe un tipo de aplicación de impuesto con esa abreviatura ingresada'});
        return false;
      }
      return true;
  }

  public resetForm() {
    if (this.taxeTypeApplicationForm.dirty) {
      this.confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar tipo de aplicación impuesto?',
        accept: () => {
          this.taxeTypeApplicationForm.reset(this.setNewTaxeTypeApplicationForm());
          this.onEmitHideForm(false);
        }
      });
    } else {
      this.onEmitHideForm(false);
    }
  }

  private setNewTaxeTypeApplicationForm() {
      return this.formBuilder.group({
        id: -1,
        name: ['', Validators.required],
        abbreviation: [''],
        statusValue : ['', Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
}

