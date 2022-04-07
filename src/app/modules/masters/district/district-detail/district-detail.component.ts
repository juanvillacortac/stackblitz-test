import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { District } from 'src/app/models/masters/district';
import { State } from 'src/app/models/masters/state';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { StateService } from '../../state/shared/services/state.service';
import { DistrictService } from '../shared/services/district.service';

@Component({
  selector: 'app-district-detail',
  templateUrl: './district-detail.component.html',
  styleUrls: ['./district-detail.component.scss']
})
export class DistrictDetailComponent implements OnInit {
  submitted = false;
  states: SelectItem<State[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  idDistrict: number;
  districtForm: FormGroup;
  countrySelected = false;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  districtAdded: boolean;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() district: District;
  @Input() districtList: District[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _districtService: DistrictService,
    private _stateService: StateService,
    private _countryService: CountryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {  
    this.districtForm = this.setNewDistrictForm();
  }
  ngOnInit(): void { 
    const filters =  new CountryFilter();
    filters.active = StatusEnum.active;

      this.getCountriesPromise(filters).then(()=>{
            if(this.district)
            { 
              this.formTitle="Editar municipio"
              this.isEdit = true;  
              this.onEditForm();
            }
            else
            {
              this.formTitle="Nuevo municipio"
              this.isEdit = false;
              this.districtForm.controls.statusValue.setValue('1');  
            }
    }); 
}

onCountrySelected(country){
  if(country)
  {
    const filters = new StateFilters();
    filters.active = StatusEnum.active;
    filters.idCountry = country.id;
    this.getStatesListPromise(filters).then(()=>{
     this.countrySelected= true;
      });    
  }
  else
  {
    this.countrySelected= false;
    this.states = {value: null};
    this.districtForm.controls.selectedStates.setValue('');
  }
}


  onEditForm(){  
    const filters = new StateFilters();
    filters.active =StatusEnum.active;
    this.getStatesListPromise(filters).then(()=>{
     this.countrySelected= true;            
    this.districtForm.patchValue({
              id: this.district.id,
              name: this.district.name,
              abbreviation: this.district.abbreviation, 
              statusValue: this.district.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedStates: this.states.value.find(p => Number(p.id) === Number(this.district.state.id)),
              selectedCountry: this.countries.value.find(p=> Number(p.id) === Number(this.district.country.id))
  });
});   
}
getCountriesPromise = (filters: CountryFilter) => {
    return  this._countryService.getCountriesPromise(filters)
    .then(results => {
      this.countries.value = results;
    }, (error) => {
      this.messageService.add({key:'district',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  
  getStatesListPromise = (filters: StateFilters) => {
        return this._stateService.getStatesPromise(filters)
    .then(results => {
      this.states.value = results;
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar estados', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  onEntityTypeSelected(entityType){
    if(entityType)
    {

    }   
}

  toDistrictModel(){
      let model = new District();

          model.id = this.districtForm.controls.id.value;
          model.name = this.districtForm.controls.name.value;
          model.abbreviation = this.districtForm.controls.abbreviation.value;
          model.active = this.districtForm.controls.statusValue.value === '0' ? false : true;
          model.state = this.districtForm.controls.selectedStates.value;
          model.country = this.districtForm.controls.selectedCountry.value;
      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.districtForm.invalid) {
      return;
    }
    const newDistrict = this.toDistrictModel();
    if(this.isValidateDistrict(newDistrict))
    {
      this._districtService.addDistrict(newDistrict).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'district', severity:'warn', summary:'Alerta', detail: "Este municipio ya existe"});
        }else{
          this.messageService.add({key:'district', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el municipio"});
        }
      }, ()=>{
        this.messageService.add({key:'district', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el municipio"});
      });
    }
}
  isValidateDistrict(newDistrict: District)
  {
      let inValidateName = this.districtList.find(p=> p.name.trim().toUpperCase() === newDistrict.name.trim().toUpperCase() && p.id !== newDistrict.id);   
      let inValidateAbbreviation = this.districtList.find(p=> p.abbreviation.trim().toUpperCase() === newDistrict.abbreviation.trim().toUpperCase() && p.id !== newDistrict.id);
      
      if(inValidateName)
      {
        this.messageService.add({key:'district', severity:'error', summary:'Alerta', detail: "Ya existe un municipio con el nombre ingresado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'district', severity:'error', summary:'Alerta', detail: "Ya existe un municipio con esa abreviatura ingresada"});
        return false;
      }
      
      return true;
  }

  private setNewDistrictForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: [''],
        statusValue : ['', Validators.required],
        selectedStates:['', Validators.required],
        selectedCountry:['']
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
  
}

