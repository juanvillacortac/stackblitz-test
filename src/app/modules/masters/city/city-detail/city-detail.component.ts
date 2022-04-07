import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { City } from 'src/app/models/masters/city';
import { Country } from 'src/app/models/masters/country';
import { District } from 'src/app/models/masters/district';
import { DistrictFilters } from 'src/app/models/masters/district-filters';
import { State } from 'src/app/models/masters/state';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { DistrictService } from '../../district/shared/services/district.service';
import { StateService } from '../../state/shared/services/state.service';
import { CityService } from '../shared/services/city.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss']
})
export class CityDetailComponent implements OnInit {
  submitted = false;
  states: SelectItem<State[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  district: SelectItem<District[]> = {value: null};
  idCity: number;
  cityForm: FormGroup;
  countrySelected = false;
  stateSelected = false;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  cityAdded: boolean;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() city: City;
  @Input() cityList: City[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _cityService: CityService,
    private _districtService: DistrictService,
    private _stateService: StateService,
    private _countryService: CountryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.cityForm = this.setNewCityForm();
  }
  ngOnInit(): void {
    const filters =  new CountryFilter();
    filters.active = StatusEnum.active;

      this.getCountriesPromise(filters).then(() => {
            if (this.city) {
              this.formTitle = 'Editar ciduad';
              this.isEdit = true;
              this.onEditForm();
            } else {
              this.formTitle = 'Nuevo ciudad';
              this.isEdit = false;
              this.cityForm.controls.statusValue.setValue('1');
            }
    });
}
onStateSelected(state) {
    if (state) {
      const filters = new DistrictFilters();
      filters.status = StatusEnum.active;
      filters.idState = state.id;
      this.getDistrictListPromise(filters).then(() => {
          this.stateSelected = true;
      });
    } else {
      this.stateSelected = false;
      this.district = {value: null};
    }
    this.cityForm.patchValue({
      selectedDistrict: '',
  });
}

onCountrySelected(country) {
  if (country) {
    const filters = new StateFilters();
    filters.active = StatusEnum.active;
    filters.idCountry = country.id;
    this.getStatesListPromise(filters).then(() => {
     this.countrySelected = true;
      });
  } else {
    this.countrySelected = false;
    this.states = {value: null};
  }
  this.stateSelected = false;
  this.district = {value: null};
  this.cityForm.patchValue({
    selectedDistrict: '',
    selectedStates: '',

});
}


  onEditForm() {
    const filters = new StateFilters();
    filters.active = StatusEnum.active;
    this.getStatesListPromise(filters).then(() => {
        this.getDistrictListPromise(new DistrictFilters).then(() => {
            this.countrySelected = true;
            this.stateSelected = true;
            const district = this.district.value.find(p => Number(p.id) === Number(this.city.district.id));
            this.cityForm.patchValue({
                    id: this.city.id,
                    name: this.city.name,
                    abbreviation: this.city.abbreviation,
                    longitude: Number(this.city.longitude),
                    latitude: Number(this.city.latitude),
                    statusValue: this.city.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
                    selectedDistrict: this.district.value.find(p => Number(p.id) === Number(this.city.district.id)),
                    selectedStates:  this.states.value.find(p => Number(p.id) === Number(district.state.id)),
                    selectedCountry: this.countries.value.find(p => Number(p.id) === Number(district.country.id)),
             });
        });
    });
}

getDistrictListPromise = (filters: DistrictFilters) => {
    return this._districtService.getDistrictListPromise(filters)
        .then(results => {
        this.district.value = results;
    }, (error) => {
        this.messageService.add({severity: 'error', summary: 'Cargar municipios', detail: error.error.message});
        console.log(error.error.message);
    });
}

getCountriesPromise = (filters: CountryFilter) => {
    return  this._countryService.getCountriesPromise(filters)
    .then(results => {
      this.countries.value = results;
    }, (error) => {
      this.messageService.add({key: 'city', severity: 'error', summary: 'Cargar paises', detail: error.error.message});
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

  onEntityTypeSelected(entityType) {

}

  toCityModel() {
      const model = new City();

          model.id = this.cityForm.controls.id.value;
          model.name = this.cityForm.controls.name.value;
          model.abbreviation = this.cityForm.controls.abbreviation.value;
          model.active = this.cityForm.controls.statusValue.value === '0' ? false : true;
          model.district = this.cityForm.controls.selectedDistrict.value;
          model.latitude = this.cityForm.controls.latitude.value;
          model.longitude = this.cityForm.controls.longitude.value;
      return model;
  }

  onSave() {
    this.submitted = true;
    if (this.cityForm.invalid) {
      return;
    }
    const newCity = this.toCityModel();
    if (this.isValidateCity(newCity)) {
      this._cityService.addCity(newCity).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
          this.onEmitHideForm(true);
        } else if (data === -1) {
          this.messageService.add({key: 'city', severity: 'error', summary: 'Alerta', detail: 'Esta ciudad ya existe'});
        } else {
          this.messageService.add({key: 'city', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar la ciudad'});
        }
      }, () => {
        this.messageService.add({key: 'city', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar la ciudad'});
      });
    }
}
  isValidateCity(newCity: City) {
      const inValidateName = this.cityList.find(p =>
            p.name.trim().toUpperCase() === newCity.name.trim().toUpperCase()
              && p.district.id === newCity.district.id && p.id !== newCity.id);
      const inValidateAbbreviation = this.cityList.find(p =>
            p.abbreviation.trim().toUpperCase() === newCity.abbreviation.trim().toUpperCase() && p.id !== newCity.id);

      if (inValidateName) {
      this.messageService.add({key: 'city', severity: 'error', summary: 'Alerta', detail: 'Ya existe una ciudad con el nombre ingresado'});
      return false;
      }

      if (inValidateAbbreviation) {
        this.messageService.add({key: 'city', severity: 'error', summary: 'Alerta', detail: 'Ya existe una ciudad con esa abreviatura ingresada'});
        return false;
      }
      return true;
  }

  private setNewCityForm() {
      return this.formBuilder.group({
        id: -1,
        name: ['', Validators.required],
        abbreviation: [''],
        statusValue : ['', Validators.required],
        latitude : [''],
        longitude: [''],
        selectedDistrict: ['', Validators.required],
        selectedStates: [''],
        selectedCountry: ['']
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
}

