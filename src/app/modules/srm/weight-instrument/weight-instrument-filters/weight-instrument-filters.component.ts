import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { WeightInstrumentFilters, WeightInstrumentType } from 'src/app/models/srm/weight-instrument';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { WeightInstrumentService } from '../shared/weight-instrument.service';

@Component({
  selector: 'app-weight-instrument-filters',
  templateUrl: './weight-instrument-filters.component.html',
  styleUrls: ['./weight-instrument-filters.component.scss']
})
export class WeightInstrumentFiltersComponent implements OnInit {

  weightInstrumentTypes = [];
  weightInstrumentServiceTypesSelected = [];
  idCompany:number=1

  @Input() filters: WeightInstrumentFilters;

  @Input() expanded = false;
  @Output() onSearch = new EventEmitter<WeightInstrumentFilters>();

  status: SelectItem[] = [
    {label: 'Todos', value: -1},
    {label: 'Inactivo', value: 2},
    {label: 'Activo', value: 1},
   
  ];

  indTransportOpt: SelectItem[] = [
    {label: 'NO', value: 2},
    {label: 'SI', value: 1}
  ];

  statusSelected: number;
  indTransport: number;

  constructor(private readonly weightInstrumentserive: WeightInstrumentService,
    private _httpClient: HttpClient,
    private readonly dialogService: DialogsService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.getWeightInstrumentTypes();
    this.idCompany = this._Authservice.currentCompany;
  }

  search() {
    this.setProperties();
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.active = -1;
    this.filters.instrumentTypes = '';
    this.filters.isTransport = -1;
    this.filters.name = '';
    this.indTransport = undefined;
    this.statusSelected = undefined;
    this.weightInstrumentServiceTypesSelected = [];
  }

  private setProperties() {
    this.filters.instrumentTypes = this.weightInstrumentServiceTypesSelected.map(x => x.id).join(',');
    this.filters.isTransport = this.indTransport ? this.indTransport === 2 ? 0 : 1 : -1;
    this.filters.active = this.statusSelected ? this.statusSelected === 2 ? 0 : 1 : -1;
    this.filters.companyId=this.idCompany;
  }
  
  private getWeightInstrumentTypes() {
    this.weightInstrumentserive.getWeightInstrumentTypes()
    .then(data => this.getWeightInstrumentTypesSucceded(data))
    .catch(error => this.handleError(error));
  }

  private getWeightInstrumentTypesSucceded(data: WeightInstrumentType[]) {
    this.weightInstrumentTypes = data;
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }
}
