import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { CityFilters } from 'src/app/models/masters/city-filters';
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


@Component({
  selector: 'app-city-filters',
  templateUrl: './city-filters.component.html',
  styleUrls: ['./city-filters.component.scss']
})
export class CityFiltersComponent implements OnInit { @Input() expanded : boolean = false;
  states: SelectItem<State[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  district: SelectItem<District[]> = {value: null};
  countrySelected = false;
  stateSelected = false;
  idStates: number;
  idCountry: number;
  idDistrict: number;

    @Input("filters") filters : CityFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<CityFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _countryService: CountryService,
      private _stateService: StateService,
      private _districtService: DistrictService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
    
    onDistrictSelected(district){
        if(district)
        {
          this.filters.idDistrict = district.id;
        }
        else
        {
          this.filters.idDistrict = -1
        }
    }

onStateSelected(state){
      if(state)
      {
        this.filters.idState = state.id;
        const filters = new DistrictFilters();
        filters.status = StatusEnum.alls;
        filters.idState = state.id;
        this.getDistrictListPromise(filters).then(()=>{
            this.stateSelected= true;
        });    
      }
      else
      {
        this.stateSelected= false;
        this.filters.idState = -1
        this.idStates = null;
      }
      this.filters.idDistrict = -1
      this.idDistrict = null;
      this.district = {value: null};
  }
    
  onCountrySelected(country){
    if(country)
    {
      this.filters.idCountry = country.id;
      const filters = new StateFilters();
      filters.active = StatusEnum.alls;
      filters.idCountry = country.id;
      this.getStatesListPromise(filters).then(()=>{
       this.countrySelected= true;
        });    
    }
    else
    {
      this.filters.idCountry = -1;
      this.countrySelected= false;
    }
    this.filters.idState = -1
    this.idStates = null;
    this.idDistrict = null;
    this.stateSelected= false;
    this.district = {value: null};
}

    ngOnInit(): void {
      this.filters.active =  StatusEnum.alls;
        this.getCountriesPromise().then(()=>{})
    }
  
    search(){
      this.onSearch.emit(this.filters);
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

    getStatesListPromise = (filters: StateFilters) => {
    return this._stateService.getStatesPromise(filters)
        .then(results => {
        this.states.value = results;
    }, (error) => {
        this.messageService.add({severity: 'error', summary: 'Cargar estados', detail: error.error.message});
        console.log(error.error.message);
    });
    }

      
      getCountriesPromise = () => {
        const filters =  new CountryFilter();
        filters.active = StatusEnum.active;
        return  this._countryService.getCountriesPromise(filters)
        .then(results => {
          this.countries.value = results;
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar paises', detail: error.error.message});
          console.log(error.error.message);
        });
      }
      
      
    
    clearFilters(){
      this.filters.idCity=-1;
      this.filters.name="";
      this.filters.active =  StatusEnum.alls;
      this.filters.idCountry = -1;
      this.filters.idState = -1;
      this.filters.idDistrict =-1;
      this.idCountry = null;
      this.idStates = null;
      this.idDistrict = null;
      this.countrySelected= false;
      this.stateSelected= false;
    }
}
