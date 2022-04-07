import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { PriceType } from 'src/app/models/masters/price-type';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { PriceGroupingFilter } from '../../price-grouping/shared/filters/pricegrouping-filter';
import { PriceGroupingService } from '../../price-grouping/shared/service/price-grouping.service';
import { PriceTypeService } from '../shared/price-type.service';

@Component({
  selector: 'app-price-type-detail',
  templateUrl: './price-type-detail.component.html',
  styleUrls: ['./price-type-detail.component.scss']
})
export class PriceTypeDetailComponent implements OnInit {
  submitted = false;
  pricegrouping: SelectItem<priceGrouping[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  idPriceGrouping: number;
  priceTypeForm: FormGroup;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  priceTypeAdded: boolean;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() priceType: PriceType;
  @Input() priceTypeList: PriceType[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _priceTypeService: PriceTypeService,
    private _priceGroupingService: PriceGroupingService,
    private _countryService: CountryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {  
    this.priceTypeForm = this.setNewPriceTypeForm();
  }
  ngOnInit(): void { 
      this.getCountriesPromise().then(()=>{
      this.getPriceGroupingListPromise().then(()=>{
            if(this.priceType)
            { 
              this.formTitle="Editar tipo de precio"
              this.isEdit = true;  
              this.onEditForm();
            }
            else
            {
              this.formTitle="Nuevo tipo de precio"
              this.isEdit = false;
              this.priceTypeForm.controls.statusValue.setValue('1');  
            }
      }); 
    }); 
}
  onEditForm(){      
    this.priceTypeForm.patchValue({
              id: this.priceType.id,
              name: this.priceType.name,
              abbreviation: this.priceType.abbreviation,    
              statusValue: this.priceType.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedPricegrouping: this.pricegrouping.value.find(p => Number(p.id) === Number(this.priceType.pricesGrouping.id)),
              selectedCountry: this.countries.value.find(p=> Number(p.id) === Number(this.priceType.country.id))
  });
}
getCountriesPromise = () => {
    const filters =  new CountryFilter();
    filters.active = StatusEnum.active;
    return  this._countryService.getCountriesPromise(filters)
    .then(results => {
      this.countries.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({key:'price-type',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  
  getPriceGroupingListPromise = () => {
    const filters = new PriceGroupingFilter();
    filters.active = StatusEnum.active;;
    return this._priceGroupingService.getPriceGroupingListPromise(filters)
    .then(results => {
      this.pricegrouping.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar agrupacion de precios', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  onPriceGroupingSelected(priceGrouping){
    if(priceGrouping)
    {

    }   
}

  toPriceTypeModel(){
      let model = new PriceType();

          model.id = this.priceTypeForm.controls.id.value;
          model.name = this.priceTypeForm.controls.name.value;
          model.abbreviation = this.priceTypeForm.controls.abbreviation.value;
          model.active = this.priceTypeForm.controls.statusValue.value === '0' ? false : true;
          model.pricesGrouping = this.priceTypeForm.controls.selectedPricegrouping.value;
          model.country = this.priceTypeForm.controls.selectedCountry.value;
      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.priceTypeForm.invalid) {
      return;
    }
    const newPricetype = this.toPriceTypeModel();
    if(this.isValidatePricetype(newPricetype))
    {
      this._priceTypeService.addPriceType(newPricetype).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'price-type', severity:'error', summary:'Alerta', detail: "Este tipo de precio ya existe"});
        }else{
          this.messageService.add({key:'price-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de precio"});
        }
      }, ()=>{
        this.messageService.add({key:'price-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de precio"});
      });
    }
}
  isValidatePricetype(newPricetype: PriceType)
  {
      let inValidateName = this.priceTypeList.find(p=> p.name.trim().toUpperCase() === newPricetype.name.trim().toUpperCase() && p.id !== newPricetype.id);   
      let inValidateAbbreviation = this.priceTypeList.find(p=> p.abbreviation.trim().toUpperCase() === newPricetype.abbreviation.trim().toUpperCase() && p.id !== newPricetype.id);
      
      if(inValidateName)
      {
        this.messageService.add({key:'price-type', severity:'error', summary:'Alerta', detail: "Ya existe un tipo de precio con el nombre ingresado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'price-type', severity:'error', summary:'Alerta', detail: "Ya existe un tipo de precio con esa abreviatura ingresada"});
        return false;
      }
      
      return true;
  }

  private setNewPriceTypeForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: [''],
        statusValue : ['', Validators.required],
        selectedPricegrouping:[null, Validators.required],
        selectedCountry:[null, Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
  
}

