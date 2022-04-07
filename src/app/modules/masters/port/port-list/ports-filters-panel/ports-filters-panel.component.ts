import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PortFilter } from '../../shared/filters/port-filter';
import { SelectItem } from 'primeng/api';
import { CountryService } from '../../../country/shared/services/country.service';



@Component({
  selector: 'app-ports-filters-panel',
  templateUrl: './ports-filters-panel.component.html',
  styleUrls: ['./ports-filters-panel.component.scss']
})
export class PortsFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: PortFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;
 
  @Output("onSearch") onSearch = new EventEmitter<PortFilter>();

  countriesFilters: PortFilter   = new PortFilter();

  countriesList : SelectItem[];
  statuslist: SelectItem[] =[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];
  search() {
    this.onSearch.emit(this.filters);
  }
  constructor(private _countriesService :CountryService) { 
  }

  ngOnInit(): void {
    this.filters.Active = -1;
    this.loadFilters()
  }
  loadFilters(){
    this._countriesService.getCountriesList(   {
      idCountry:-1,
      active: -1,
      name:"",
      abbreviation:""
    })
    .subscribe((data)=>{
      this.countriesList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
  }
  clearFilters() {
    this.filters.Abbreviation="";
    this.filters.Active= -1;
   this.filters.Name="";
   this.filters.IdCountry=-1;
  }

}
