import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Country } from 'src/app/models/masters/country';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-state-filters',
  templateUrl: './state-filters.component.html',
  styleUrls: ['./state-filters.component.scss']
})
export class StateFilterComponent implements OnInit {

  countries: SelectItem<Country[]> = {value: null};
  status: SelectItem[] = [
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}

  ];

  selectedCountry: Country;
  provinceActive: number;

  @Input() expanded = false;
  @Input() filters: StateFilters;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<StateFilters>();

  constructor(private stateService: StateService, private countryService: CountryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.selectedCountry = null;
    this.provinceActive = null;

    this.getCountries();
  }

  getCountries = () => {
    return  this.countryService.getCountriesList({ active: 1, idCountry: -1 } as CountryFilter).subscribe((data: Country[]) => {
      this.countries.value = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los paises' });
    });

  }

  search() {
    this.filters.idCountry = this.selectedCountry ? this.selectedCountry.id : -1;
    this.filters.active = this.provinceActive ? this.provinceActive === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.idState = -1;
    this.filters.name = '';
    this.filters.idCountry = -1;
    this.filters.active = -1;
    this.selectedCountry = null;
    this.provinceActive = null;
  }

}
