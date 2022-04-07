import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { PriceTypeFilters } from 'src/app/models/masters/price-type-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { PriceGroupingFilter } from '../../price-grouping/shared/filters/pricegrouping-filter';
import { PriceGroupingService } from '../../price-grouping/shared/service/price-grouping.service';
import { PriceTypeService } from '../shared/price-type.service';

@Component({
  selector: 'app-price-type-filters',
  templateUrl: './price-type-filters.component.html',
  styleUrls: ['./price-type-filters.component.scss']
})
export class PriceTypeFiltersComponent implements OnInit { @Input() expanded : boolean = false;
  priceGrouping: SelectItem<priceGrouping[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  idPriceGrouping: number;
  idCountry: number;

    @Input("filters") filters : PriceTypeFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<PriceTypeFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _countryService: CountryService,
      private _priceGroupingService: PriceGroupingService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
  
    onPriceGroupingSelected(priceGrouping){
      if(priceGrouping)
      {
        this.filters.idPricesGrouping = priceGrouping.id;
      }
      else
      {
        this.filters.idPricesGrouping = -1
      }
  }
    
  onCountrySelected(country){
    if(country)
    {
      this.filters.idCountry = country.id;
    }
    else
    {
      this.filters.idCountry = -1
    }
}

    ngOnInit(): void {
      this.filters.active =  StatusEnum.alls;
      this.getPriceGroupingListPromise().then(()=>{

        this.getCountriesPromise().then(()=>{})
      });
    }
  
    search(){
      this.onSearch.emit(this.filters);
    }

    
      getPriceGroupingListPromise = () => {
        const filters = new PriceGroupingFilter();
        filters.active = StatusEnum.active;;
        return this._priceGroupingService.getPriceGroupingListPromise(filters)
        .then(results => {
          this.priceGrouping.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar agrupacion de precios', detail: error.error.message});
          console.log(error.error.message);
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
      
      
    
    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.abbreviation="";
      this.filters.active =  StatusEnum.alls;
      this.filters.idPricesGrouping = -1;
      this.filters.idCountry = -1;
      this.idCountry =null;
      this.idPriceGrouping = null;
    }
}
