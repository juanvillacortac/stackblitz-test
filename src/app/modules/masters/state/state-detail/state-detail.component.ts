import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BankType } from 'src/app/models/masters/bank-type';
import { Country } from 'src/app/models/masters/country';
import { State } from 'src/app/models/masters/state';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.scss']
})
export class StateDetailComponent implements OnInit {

  formTitle: string;
  stateIsAdded = false;
  isEdit = false;
  submitted = false;
  loading = false;
  active: number;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() state: State;

  countries: SelectItem<Country[]> = {value: null};

  selectedCountry: Country;

  status: SelectItem[] = [
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
  ];

  constructor(private stateService: StateService, private countryService: CountryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getCountries();

    if (this.state && this.state.id > 0) {
      this.formTitle = 'Editar estado';
      this.active = this.state.active ? 1 : 2;
      this.isEdit = true;
    } else {
      this.formTitle = 'Nuevo estado';
      this.isEdit = false;
      this.active = 1;
    }

  }

  getCountries = () => {
    return  this.countryService.getCountriesList({ idCountry: -1, active: 1 } as CountryFilter).subscribe((data: Country[]) => {
      this.countries.value = data;
      if (this.state.country) {
          this.selectedCountry = data.find(x => x.name === this.state.country);
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los paises' });
    });

  }

  onSave() {
    this.submitted = true;

    if (this.stateIsValid()) {
      this.loading = true;
      this.setStatePropertires();
      this.stateService.saveState(this.state).subscribe((result: number) => {
        this.saveSucceeded();
      }, (error: HttpErrorResponse) => {
        this.messageService.add({key: 'state', severity: 'error', summary: 'Error',
        detail: error.error.message});
        this.loading = false;
      });
    }

  }

  setStatePropertires() {
    this.state.idCountry = this.selectedCountry.id;
    this.state.active = this.active === 2 ? false : true;
    this.state.abbreviation = this.state.abbreviation ? this.state.abbreviation : '';
  }

  saveSucceeded() {
    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
    this.onEmitHideForm(true);
    this.submitted = true;
    this.loading = false;
  }

  stateIsValid() {
    return (this.state.name && this.state.name.length > 0) && (this.active >= 1 && this.active <= 2) && this.selectedCountry;
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
}

}
