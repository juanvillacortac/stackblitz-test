import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Attribute } from 'src/app/models/masters-mpc/attribute'
import { AttributeService } from '../../shared/services/AttributeService/attribute.service';
import { AttributeoptionService } from '../../shared/services/AttributeOptionService/attributeoption.service';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { AttributeFilter } from '../../shared/filters/attribute-filter';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { AttributetypeFilter } from '../../shared/filters/common/attributetype-filter';
import { AttributeoptionFilter } from '../../shared/filters/attributeoption-filter';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { CommonService } from '../../shared/services/Common/common.service';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { Observable } from 'rxjs';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-attribute-panel',
  templateUrl: './attribute-panel.component.html',
  styleUrls: ['./attribute-panel.component.scss']
})
export class AttributePanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_attribute") _attribute : Attribute;
  @Input("filters") filters : AttributeFilter;
    submitted: boolean;
    refreshPOT : AttributeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _attributeoption: SelectItem[];
  _attributeagrupation: SelectItem[];
  _attributetype: SelectItem[];
  _groupingunitmeasure: SelectItem[];
  _measurementunit: SelectItem[];
  _attributeoptionSelected: SelectItem[];
 
  _initStatus: boolean;
  _visibleOption: boolean;
  _idgroupingunitmeasure: number;
  _validations: Validations = new Validations();
  
  constructor(private _attributeService: AttributeService, 
    private messageService: MessageService,
    private _attributeagrupationService: AttributeagrupationService, 
    private _groupingunitmeasureService: GroupingunitmeasureService,
    private _measurementunitsService: MeasurementunitsService,
    private _attributeoptionService: AttributeoptionService,
    private _commonService: CommonService,
    private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    this._attributeoptionSelected = new Array<SelectItem>();
    if(this._attribute.id == -1 || this._attribute.id == undefined){
      this._attribute.active = true;
      this._idgroupingunitmeasure = -1;
      this._attribute.measurementUnit.id = -1;
    }else{
      this._initStatus = this._attribute.active;
      this._idgroupingunitmeasure = this._attribute.measurementUnit.idGroupingUnitofMeasure;
      this.listmeasurementunits();
      if(this._attribute.attributeType.id == 1){
        
        var elemento;
        var selected = new Array<SelectItem>();
        //this._attributeoptionSelected = new Array<SelectItem>();
        for (elemento of this._attribute.attributeOptions) {
          selected.push(elemento.id);
        }
        this._attributeoptionSelected = selected;
      }
    }
    
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



    if(this._attribute.id != -1 && this._attribute.id != undefined){
      this.listatributeoptions();
      
    }
  }


  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._attribute = new Attribute();
    this._attribute.active = true;
    this._measurementunit = [];
  }

  listmeasurementunits(){
    this._attributeoptionSelected = new Array<SelectItem>();
    var filterM = new MeasurementunitsFilter(); 
    filterM.idGroupingUnitofMeasure = this._idgroupingunitmeasure;
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
    filterO.idAttributeAgrupation = this._attribute.attributeAgrupation.id;
    filterO.idMeasurementUnit = this._attribute.measurementUnit.id;
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
    if(this._attribute.attributeType.id == 1){
      this._visibleOption = true;
    }else{
      this._attributeoptionSelected = [];
      this._visibleOption = false;
    }
  }

  saveAttribute(): void{
    this.submitted = true;
    if (this._attribute.attributeAgrupation.id > 0) {
      this._attribute.attributeAgrupation.id = this._attributeagrupation.filter(x => x.value == this._attribute.attributeAgrupation.id).length > 0 ? this._attribute.attributeAgrupation.id : -1;
    }
    if (this._attribute.measurementUnit.id > 0) {
      this._attribute.measurementUnit.id = this._measurementunit.filter(x => x.value == this._attribute.measurementUnit.id).length > 0 ? this._attribute.measurementUnit.id : -1;
    }
    if (this._idgroupingunitmeasure > 0) {
      this._idgroupingunitmeasure = this._groupingunitmeasure.filter(x => x.value == this._idgroupingunitmeasure).length > 0 ? this._idgroupingunitmeasure : -1;
    }
    if(this._attribute.name.trim() && ((this._attributeoptionSelected.length ==0 && this._attribute.attributeType.id != 1) || (this._attributeoptionSelected.length > 0 && this._attribute.attributeType.id == 1)) 
    && this._attribute.attributeType.id != -1 && this._attribute.attributeType.id != undefined 
    && this._attribute.attributeAgrupation.id != -1 && this._attribute.attributeAgrupation.id != undefined
    && this._attribute.measurementUnit.id != -1 && this._attribute.measurementUnit.id != undefined
    && this._idgroupingunitmeasure != -1 && this._idgroupingunitmeasure != undefined){
      if(!this._attribute.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un atributo las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
          accept: () => {
            this.save();
          },
        });
      }else{
        this.save();
      }
    }
  }


  save(){
    
    this._attribute.attributeOptions = new Array<Attributeoption>();
    if(this._attribute.attributeType.id == 1){
      var elemento;
      var aux = new Attributeoption();
      for (elemento of this._attributeoptionSelected) {
        aux = new Attributeoption();
        aux.id = elemento;
        this._attribute.attributeOptions.push(aux);
      }

    }
    this._attribute.id = this._attribute.id == 0 ? -1 : this._attribute.id;
    this._attribute.name = this._attribute.name.trim();
    this._attribute.abbreviation = this._attribute.abbreviation.trim();
    this._attribute.name = this._attribute.name.toLocaleUpperCase();
    //this._attribute.name = this._attribute.name.charAt(0).toLocaleUpperCase() + this._attribute.name.substr(1).toLowerCase();
    this._attributeService.postAttribute(this._attribute).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this._attribute = new Attribute();
        this._attribute.active = true;
        this._attributeService.getAttributebyfilter(this.filters, OrderCodes.CreatedDate).subscribe((data: Attribute[]) => {
          this._attributeService._AttributeList = data;
        });
        this.submitted = false;
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Error', detail: "El nombre ya se encuentra registrado"});
      }else if(data == -2){
        this.messageService.add({severity:'error', summary:'Error', detail: "La abreviatura ya se encuentra registrada"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el atributo"});
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el atributo"});
    });
  }



}
