import { Component, OnInit } from '@angular/core';
import { CountryViewModel } from '../shared/view-models/Country.viewmodel';
import { CountryService } from '../shared/services/country.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Country } from 'src/app/models/masters/country';
import { CountryFilter } from '../shared/filters/country-filter';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})

export class CountriesListComponent implements OnInit {

  CountryshowDialog: boolean = false;
  showFilters: boolean = false
  showDialog: boolean = false;
  loading: boolean = false;
  _countryViewModel: Country;
  countriesFilters: CountryFilter = new CountryFilter();
  countryEdit: CountryFilter;
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  _status:boolean=true;

  displayedColumns: ColumnD<CountryViewModel>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
    { template: (data) => { return data.name; }, header: 'País', display: 'table-cell',field:'name' },
    { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', display: 'table-cell',field:'abbreviation' },
    { template: (data) => { if(data.areaCode.toString().length <4) return "+"+data.areaCode; else return "+"+data.areaCode.toString().substr(0,1)+"-"+data.areaCode.toString().substr(1,3); }, header: 'Código telefónico', display: 'table-cell',field:'areaCode' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field:'createdByUser' },
    { template: (data) => { return data.updateByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updateByUser' }
  ];
    
  constructor(public _countryService: CountryService, private breadcrumbService: BreadcrumbService, private messageService: MessageService,public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Países', routerLink: ['/countries-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
    this._countryViewModel=new Country();
    this._countryViewModel.id = -1;
    this._countryViewModel.areaCode = 1;
    this._countryViewModel.active = true;
    this._countryViewModel.name = "";
    this._countryViewModel.abbreviation = "";
  }

  onEdit(country:Country) {
     this._countryViewModel = new Country();
     this._countryViewModel.id = country.id;
     this._countryViewModel.name=country.name;
     this._countryViewModel.active=country.active;
     this._countryViewModel.areaCode=country.areaCode;
     this._countryViewModel.abbreviation=country.abbreviation;
     this.CountryshowDialog = true;
     this._status=country.active;
  }
      
  search() {
    this.loading = true;
    this._countryService.getCountriesList(this.countriesFilters).subscribe((data: Country[]) => {
      this._countryService._countriesList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los países" });
    });
  }
}
