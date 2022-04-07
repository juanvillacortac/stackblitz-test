import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { AttributeoptionFilter } from '../../shared/filters/attributeoption-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { AttributeoptionService } from '../../shared/services/AttributeOptionService/attributeoption.service';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-attribute-option-filter',
  templateUrl: './attribute-option-filter.component.html',
  styleUrls: ['./attribute-option-filter.component.scss']
})
export class AttributeOptionFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : AttributeoptionFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<AttributeoptionFilter>();
  status: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  
  _attributeagrupation: SelectItem[];
  _groupingunitmeasure: SelectItem[];
  _measurementunit: SelectItem[];
  _statusCambiado: boolean = false;

  _validations: Validations = new Validations();
  
  constructor(private _attributeagrupationService: AttributeagrupationService, 
    private _groupingunitmeasureService: GroupingunitmeasureService,
    private _measurementunitsService: MeasurementunitsService) { }

  ngOnInit(): void {
    this.filters.idGroupingUnitMeasure = -1;
    this.filters.active = -1;
    var filterA = new AttributesagrupationFilter();
    filterA.active = 1;
    this._attributeagrupationService.getAttributesAgrupationbyfilter(filterA, OrderCodes.Name)
      .subscribe((data) => {
        this._attributeagrupation = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
    
    
    var filterG = new GroupingunitmeasureFilter();
    filterG.active = 1;
    this._groupingunitmeasureService.getGroupingUnitMeasurebyfilter(filterG, OrderCodes.Name)
      .subscribe((data) => {
        this._groupingunitmeasure = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  statusCambiado(){
    this._statusCambiado = true;
  }


  listmeasurementunits(){
    var filterM = new MeasurementunitsFilter(); 
    filterM.idGroupingUnitofMeasure = this.filters.idGroupingUnitMeasure;
    filterM.active = 1;

    this._measurementunitsService.getMeasurementUnitsbyfilter(filterM, OrderCodes.Name)
      .subscribe((data) => {
        this._measurementunit = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  search(){
    if(!this._statusCambiado){
      this.filters.active = -1;
    }
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.id=-1;
    this.filters.name="";
    this.filters.IdUser=-1;
    this.filters.idAttributeAgrupation = -1;
    this.filters.idMeasurementUnit = -1;
    this.filters.active = -1;
    this.filters.idGroupingUnitMeasure = -1;
  }

}
