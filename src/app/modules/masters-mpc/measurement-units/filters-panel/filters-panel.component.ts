import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'filters-panel-MU',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentMU implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : MeasurementunitsFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<MeasurementunitsFilter>();
  status: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  aggrupationMU: SelectItem[];
  _validations: Validations = new Validations();
  
  constructor(private _measurementunitsservice: MeasurementunitsService) { }

  ngOnInit(): void {
    this.filters.active  = -1;
    this._measurementunitsservice.getGroupingUnitMeasure()
    .subscribe((data)=>{
      this.aggrupationMU = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.idMeasurementUnit=-1;
    this.filters.name="";
    this.filters.abbreviation="";
    this.filters.idGroupingUnitofMeasure=-1;
    this.filters.active=-1;
    this.filters.active  = -1;
  }
}
