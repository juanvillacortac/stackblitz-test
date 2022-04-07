import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { DistrictFilters } from 'src/app/models/masters/district-filters';
import { State } from 'src/app/models/masters/state';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { StateService } from '../../state/shared/services/state.service';
import { DistrictService } from '../shared/services/district.service';

@Component({
  selector: 'app-district-filters',
  templateUrl: './district-filters.component.html',
  styleUrls: ['./district-filters.component.scss']
})
export class DistrictFiltersComponent implements OnInit { @Input() expanded : boolean = false;
  states: SelectItem<State[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  countrySelected = false;
  idStates: number;
  idCountry: number;

    @Input("filters") filters : DistrictFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<DistrictFilters>();
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
  
    onStateSelected(state){
      if(state)
      {
        this.filters.idState = state.id;
      }
      else
      {
        this.filters.idState = -1
      }
  }
    
  onCountrySelected(country){
    this.states = {value: null};
    this.idStates = null;
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
    }

}

    ngOnInit(): void {
      this.filters.status =  StatusEnum.alls;
        this.getCountriesPromise().then(()=>{})
    }
  
    search(){
      this.onSearch.emit(this.filters);
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
          this.messageService.add({key:'price-type',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
          console.log(error.error.message);
        });
      }
      
      
    
    clearFilters(){
      this.filters.IdDistrict=-1;
      this.filters.name="";
      this.filters.status =  StatusEnum.alls;
      this.filters.idState = -1;
      this.idCountry = null;
      this.idStates = null;
      this.countrySelected= false;
    }
}
