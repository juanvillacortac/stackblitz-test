import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { EntityType } from 'src/app/models/masters/entity-type';
import { EntityTypeFilters } from 'src/app/models/masters/entity-type-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { DocumentTypeService } from '../shared/services/document-type.service';

@Component({
  selector: 'app-document-type-detail',
  templateUrl: './document-type-detail.component.html',
  styleUrls: ['./document-type-detail.component.scss']
})
export class DocumentTypeDetailComponent implements OnInit {
  submitted = false;
  entityTypes: SelectItem<EntityType[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  idEntityType: number;
  documentTypeForm: FormGroup;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  documentTypeAdded: boolean;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() documentType: DocumentTypes;
  @Input() documentTypeList: DocumentTypes[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  alphanumeric: SelectItem[] = [
    {label: 'No', value: '0'},
    {label: 'Si', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _documentTypeService: DocumentTypeService,
    private _countryService: CountryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {  
    this.documentTypeForm = this.setNewDocumentTypeForm();
  }
  ngOnInit(): void { 
      this.getCountriesPromise().then(()=>{
      this.getEntityTypeListPromise().then(()=>{
            if(this.documentType)
            { 
              this.formTitle="Editar tipo de documento"
              this.isEdit = true;  
              this.onEditForm();
            }
            else
            {
              this.formTitle="Nuevo tipo de documento"
              this.isEdit = false;
              this.documentTypeForm.controls.statusValue.setValue('1');  
            }
      }); 
    }); 
}
  onEditForm(){      
    this.documentTypeForm.patchValue({
              id: this.documentType.id,
              name: this.documentType.name,
              identifier: this.documentType.identifier, 
              indAlphanumeric: this.documentType.indAlphanumeric ? String(StatusEnum.active) : String(StatusEnum.inactive),
              statusValue: this.documentType.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedEntityType: this.entityTypes.value.find(p => Number(p.id) === Number(this.documentType.entityType.id)),
              selectedCountry: this.countries.value.find(p=> Number(p.id) === Number(this.documentType.country.id))
  });
}
getCountriesPromise = () => {
    const filters =  new CountryFilter();
    filters.active = StatusEnum.active;
    return  this._countryService.getCountriesPromise(filters)
    .then(results => {
      this.countries.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key:'document-type',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  
  getEntityTypeListPromise = () => {
    const filters = new EntityTypeFilters();
    filters.active = StatusEnum.active;;
    return this._documentTypeService.getEntityTypeListPromise(filters)
    .then(results => {
      this.entityTypes.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar tipos de entidades', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  onEntityTypeSelected(entityType){
    if(entityType)
    {

    }   
}

  toDocumentTypeModel(){
      let model = new DocumentTypes();

          model.id = this.documentTypeForm.controls.id.value;
          model.name = this.documentTypeForm.controls.name.value;
          model.identifier = this.documentTypeForm.controls.identifier.value;
          model.indAlphanumeric = this.documentTypeForm.controls.indAlphanumeric.value === '0' ? false : true;
          model.active = this.documentTypeForm.controls.statusValue.value === '0' ? false : true;
          model.entityType = this.documentTypeForm.controls.selectedEntityType.value;
          model.country = this.documentTypeForm.controls.selectedCountry.value;
      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.documentTypeForm.invalid) {
      return;
    }
    const newDocumentType = this.toDocumentTypeModel();
    if(this.isValidateDocumentType(newDocumentType))
    {
      this._documentTypeService.addDocumentType(newDocumentType).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'document-type', severity:'error', summary:'Alerta', detail: "Este tipo de documento ya existe"});
        }else{
          this.messageService.add({key:'document-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de documento"});
        }
      }, ()=>{
        this.messageService.add({key:'document-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de documento"});
      });
    }
}
  isValidateDocumentType(newDocumentType: DocumentTypes)
  {
      let inValidateName = this.documentTypeList.find(p=> p.name.trim().toUpperCase() === newDocumentType.name.trim().toUpperCase() && p.entityType.id === newDocumentType.entityType.id && p.country.id === newDocumentType.country.id && p.id !== newDocumentType.id);   
      let inValidateAbbreviation = this.documentTypeList.find(p=> p.identifier.trim().toUpperCase() === newDocumentType.identifier.trim().toUpperCase() && p.entityType.id === newDocumentType.entityType.id && p.country.id === newDocumentType.country.id && p.id !== newDocumentType.id);
      
      if(inValidateName)
      {
        this.messageService.add({key:'document-type', severity:'error', summary:'Alerta', detail: "Ya existe un tipo de documento con el nombre ingresado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'document-type', severity:'error', summary:'Alerta', detail: "Ya existe un tipo de documento con ese identificador ingresado"});
        return false;
      }
      
      return true;
  }

  private setNewDocumentTypeForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        identifier: ['', Validators.required],
        indAlphanumeric : ['', Validators.required],
        statusValue : ['', Validators.required],
        selectedEntityType:[null, Validators.required],
        selectedCountry:[null, Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
  
}

