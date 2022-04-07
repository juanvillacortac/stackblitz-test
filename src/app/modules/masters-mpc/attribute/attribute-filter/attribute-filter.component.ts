import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { AttributeFilter } from '../../shared/filters/attribute-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { AttributeService } from '../../shared/services/AttributeService/attribute.service';
import { AttributeoptionService } from '../../shared/services/AttributeOptionService/attributeoption.service';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { CommonService } from '../../shared/services/Common/common.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { AttributetypeFilter } from '../../shared/filters/common/attributetype-filter';
import { AttributeoptionFilter } from '../../shared/filters/attributeoption-filter';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { OrderCodes } from '../../shared/Utils/order-codes';


@Component({
  selector: 'app-attribute-filter',
  templateUrl: './attribute-filter.component.html',
  styleUrls: ['./attribute-filter.component.scss']
})
export class AttributeFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : AttributeFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<AttributeFilter>();
  status: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  _attributeoption: SelectItem[];
  _attributeoptionSelected: SelectItem[];
  _attributeagrupation: SelectItem[];
  _attributetype: SelectItem[];
  _groupingunitmeasure: SelectItem[];
  _measurementunit: SelectItem[];

  _visibleOption: boolean;
  _validations: Validations = new Validations();
  
  constructor(private _attributeagrupationService: AttributeagrupationService, 
    private _groupingunitmeasureService: GroupingunitmeasureService,
    private _measurementunitsService: MeasurementunitsService,
    private _attributeoptionService: AttributeoptionService,
    private _commonService: CommonService
    ) { }

  ngOnInit(): void {
    this._visibleOption = false;
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

    var filterT = new AttributetypeFilter();
    filterT.active = 1;
    this._commonService.getAttributeType(filterT, OrderCodes.Name)
      .subscribe((data) => {
        this._attributetype = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
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

  listatributeoptions(){
    var filterO = new AttributeoptionFilter(); 
    filterO.idAttributeAgrupation = this.filters.idAttributeAgrupation;
    filterO.idMeasurementUnit = this.filters.idMeasurementUnit;
    filterO.active = 1;

    this._attributeoptionService.getAttributeoptionbyfilter(filterO, OrderCodes.Name)
      .subscribe((data) => {
        this._attributeoption = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  evalVisileOption(){
    if(this.filters.idAttributeType == 1)
      this._visibleOption = true;
    else
      this._visibleOption = false;
  }

  search(){
    this.filters.attributeOptions = new Array<Attributeoption>();
    if(this.filters.idAttributeType == 1){ 
      var elemento;
      var aux = new Attributeoption();
      if(this._attributeoptionSelected != undefined){
        for (elemento of this._attributeoptionSelected) {
          aux = new Attributeoption();
          aux.id = elemento;
          this.filters.attributeOptions.push(aux);
        }
      }
    }
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.id=-1;
    this.filters.name="";
    this.filters.idUser=-1;
    this.filters.idAttributeAgrupation = -1;
    this.filters.idMeasurementUnit = -1;
    this.filters.active = -1;
    this.filters.attributeOptions = undefined;
    this.filters.idAttributeType = -1;
    this.filters.idGroupingUnitMeasure = -1;
  }

}
