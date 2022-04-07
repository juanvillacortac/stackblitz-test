import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { Category } from 'src/app/models/masters-mpc/category';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { AdjustmentFilter } from '../../shared/filters/adjustment-filter';
import { InventoryAdjustmentService } from '../../shared/services/inventory-adjustment.service';

@Component({
  selector: 'app-inventory-adjustment-filters-panel',
  templateUrl: './inventory-adjustment-filters-panel.component.html',
  styleUrls: ['./inventory-adjustment-filters-panel.component.scss'],
  providers: [DatePipe]
})
export class InventoryAdjustmentFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: AdjustmentFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  @Output("onSearch") onSearch = new EventEmitter<AdjustmentFilter>();
  _showdialog: boolean = false;
  model:boolean=false;
  multiples:boolean=false;
  initDate:Date=new Date();
  endDate:Date=new Date();
  maxDate:Date=new Date();
  minDate:Date=new Date();
  AreaList: SelectItem[];
  statuslist: SelectItem[];
  CategoriesList: SelectItem[];
  AdjustmentTypeList:SelectItem[];
  OperatorList:SelectItem[];
  acceptGuionNoSpace: RegExp = /^[a-zA-Z0-9À-ú\sñÑ_-] *$/
  constructor(private _areaService : AreaService , private _commonService : CommonService,public datepipe:DatePipe,private _adjustmentService: InventoryAdjustmentService,public _categoryservice: CategoryService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService
    ) 
    { 
      this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
    }

  ngOnInit(): void {
    this.loadFilters();
    this.onLoadCategorys();
  }

  loadFilters(){
    this._areaService.getareaList({
      id: -1,
      name: "",
      abbreviation: "",
      active: -1,
      idAreaType: -1,
      idFatherArea: -1,
      idBranchOffice: this._authService.currentOffice
    })
    .subscribe((data)=>{
      this.AreaList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 4;
    this._commonService.getStatus(filter)
    .subscribe((data)=>{
      this.statuslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
    this._adjustmentService.getAdjustmentTypeList()
    .subscribe((data) => {
      this.AdjustmentTypeList = data.map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    });
    
  }

  search() {
    this.filters.idarea= this.filters.idarea != null ? this.filters.idarea : -1;
    this.filters.idadjustmenttype=this.filters.idadjustmenttype != null ? this.filters.idadjustmenttype : -1;
    this.filters.idestatus=this.filters.idestatus != null ? this.filters.idestatus : -1;
    this.filters.startdate = this.datepipe.transform(this.initDate, "yyyyMMdd");
    this.filters.enddate = this.datepipe.transform(this.endDate, "yyyyMMdd");
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.documentnumber= "";
    this.filters.idarea=-1;
    this.filters.idcategory=-2;
    this.filters.idadjustmenttype=-1;
    this.filters.idoperator=-1;
    this.filters.idestatus=-1;
    this.filters.startdate= "";
    this.filters.startdate= "";
    this.filters.operatorstring="";
    this.initDate=new Date();
    this.endDate =new Date();
  }

  
  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }

  onSubmitOperator(data)
  {
    
    this.filters.idoperator=data.operator.id;
    this.filters.operatorstring=data.operator.name;
      
  }

  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

  ValidDate(init,final)
  {

    
    if (final.getTime() < init.getTime())
    {
      this.endDate = this.initDate;
    } 
    
  }

  async onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    let category = new Category();
    category.id = -1;
    category.name = "Todas";
    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name))
        let filterArray = [{ ...category }, ...data];
        this.CategoriesList = filterArray.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });  
  }


}
