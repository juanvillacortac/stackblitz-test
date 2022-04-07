import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { TaxeTypeApplicationService } from '../../taxe-type-application/shared/taxe-type-application.service';

@Component({
  selector: 'app-tax-filters',
  templateUrl: './tax-filters.component.html',
  styleUrls: ['./tax-filters.component.scss']
})
export class TaxFiltersComponent implements OnInit { @Input() expanded : boolean = false;
    countries: SelectItem<Country[]> = {value: null};
    taxeTypeApplication: SelectItem<TaxeTypeApplication[]> = {value: null};
    idCountry: number;
    idTaxeTypeApplication: number;

    @Input("filters") filters : TaxFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<TaxFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private messageService: MessageService,
      private _countryService: CountryService,
      private _taxeTypeApplicationService: TaxeTypeApplicationService) {  
    }
  
    ngOnInit(): void {
      this.filters.active =  StatusEnum.alls;
      this.getCountriesPromise().then(()=>{
        this.getTaxesTypeApplicationsPromise().then(()=>{});
      });
    }
  
    search(){      
      this.onSearch.emit(this.filters);
    }

    onTaxeTypeApplicatioSelected(taxeTypeApplicationSelected){
        if(taxeTypeApplicationSelected)
        {
          this.filters.idTaxeTypeApplication = taxeTypeApplicationSelected.id;
        }
        else
        {
          this.filters.idTaxeTypeApplication = -1
        }
    }
    onCountrySelected(countrySelected){
        if(countrySelected)
        {
          this.filters.idCountry = countrySelected.id;
        }
        else
        {
          this.filters.idCountry = -1
        }
    }

    getCountriesPromise = () => {
      const filters =  new CountryFilter();
      filters.active = StatusEnum.active;
        return  this._countryService.getCountriesPromise(filters)
        .then(results => {
          this.countries.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar paises', detail: error.error.message});
          console.log(error.error.message);
        });
      }

      getTaxesTypeApplicationsPromise = () => {
        const filters = new TaxeTypeApplicationFilters();
        filters.active = 1;
        return this._taxeTypeApplicationService.getTaxeTypeApplications(filters)
        .then(results => {
          this.taxeTypeApplication.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar tipos aplicación impuestos.', detail: error.error.message});
          console.log(error.error.message);
        });
      }

      

    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.abbreviation="";
      this.filters.idCountry=-1;
      this.filters.idTaxeTypeApplication=-1;
      this.filters.active =  StatusEnum.alls;
      this.idCountry = null;
      this.idTaxeTypeApplication = null;
    }
}
