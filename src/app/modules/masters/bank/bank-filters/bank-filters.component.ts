import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { BankType } from 'src/app/models/masters/bank-type';
import { Country } from 'src/app/models/masters/country';
import { CountryService } from '../../country/shared/services/country.service';
import { BankService } from '../shared/services/bank.service';

@Component({
  selector: 'app-bank-filters',
  templateUrl: './bank-filters.component.html',
  styleUrls: ['./bank-filters.component.scss']
})
export class BankFiltersComponent implements OnInit {

  countries: SelectItem<Country[]> = {value: null};
  bankTypes: SelectItem<BankType[]> = {value: null};

  selectedCountry: Country;
  selectedBankType: BankType;
  bankActive: number;

  @Input() expanded = false;
  @Input() filters: BankFilters;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<BankFilters>();

  status: SelectItem[] = [
    {label: 'INACTIVO', value: 2},
    {label: 'ACTIVO', value: 1}
  ];

  constructor(private bankService: BankService, private countryService: CountryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.bankActive = null;
    this.selectedCountry = null;
    this.selectedBankType = null;

    this.getCountries();
    this.getBankTypes();
  }

  getCountries = () => {
    return  this.countryService.getCountriesList().subscribe((data: Country[]) => {
      this.countries.value = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los paises' });
    });

  }

  getBankTypes = () => {
    return  this.bankService.getBankTypes().subscribe((data: BankType[]) => {
      this.bankTypes.value = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los tipos de bancos' });
    });
  }

  search() {
    this.filters.bankTypeId = this.selectedBankType ? this.selectedBankType.id : -1;
    this.filters.countryId = this.selectedCountry ? this.selectedCountry.id : -1;
    this.filters.active = this.bankActive ? this.bankActive === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.id = -1;
    this.filters.name = '';
    this.filters.countryId = -1;
    this.filters.active = -1;
    this.filters.bankTypeId = -1;
    this.filters.accountCode = '';
    this.selectedBankType = null;
    this.selectedCountry = null;
    this.bankActive = null;
  }

}
