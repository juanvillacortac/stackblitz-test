import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { OperationdocumentFilters } from 'src/app/models/masters/operationdocument-filters';
import { BranchOfficeService } from 'src/app/modules/hcm/shared/services/branch-office.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { CommontmsService } from '../../../shared/service/common.service';
import { RequestSetupFilter } from '../../shared/filter/request-setup-filter';
import { RequestSetupService } from '../../shared/service/request-setup.service';

interface Day {
  name: string,
  code: string
}

@Component({
  selector: 'app-master-request-setup-filter',
  templateUrl: './master-request-setup-filter.component.html',
  styleUrls: ['./master-request-setup-filter.component.scss']
})


export class MasterRequestSetupFilterComponent implements OnInit {  
  @Input("expanded") expanded : boolean = true;
  @Input("filters") _filters : RequestSetupFilter;
  _showPanel: boolean = false;
  operationdocumentfilters: OperationdocumentFilters = new OperationdocumentFilters();
  statusList: SelectItem[];
  branchOfficeRequestList: SelectItem[];
  branchOfficeDispatchesList: SelectItem[];
  categoryList: SelectItem[];
  priorityList: SelectItem[];
  typeRequestlist: SelectItem[];  
  daysWeekList: Day[];  
  selectedDaysWeek: any[];
  @Output("onSearch") onSearch = new EventEmitter<RequestSetupFilter>();

  
  
  constructor(private _commontmsService:CommontmsService, public _operationMastersService:OperationMastersService, private _requestSetupService: RequestSetupService, private _branchOfficeService: BranchOfficeService, private _categoryService: CategoryService) {
    this.statusList=[
      { label: 'Todos', value: '-1' },
      { label: 'Activos', value: '1'},
      { label: 'Inactivos', value: '0'}
      ];

    this.daysWeekList=[
      {name: 'Lunes', code: '1'},
      {name: 'Martes', code: '2'},
      {name: 'Miercoles', code: '3'},
      {name: 'Jueves', code: '4'},
      {name: 'Viernes', code: '5'},
      {name: 'Sabado', code: '6'},
      {name: 'Domingo', code: '7'}
    ];

      
  }

  ngOnInit(): void {    
    this.loadFilters();
    this.onloadCategorys();
  }

  onloadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory=0;
    var category=new Category();
    category.id=-2;
    category.name="Todas";
    this._categoryService.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name))
        let filterArray = [{ ...category }, ...data];        
        this.categoryList = filterArray.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));      
    },(error)=>{
      console.log(error);
    });
  }

  loadFilters(){   
    this.operationdocumentfilters.idTypeDocumentOperation = 1;
    this._operationMastersService.getDocumentsOperations(this.operationdocumentfilters)
    .subscribe((data)=>{
      data = data.filter(x => x.id == 1 || x.id == 4);
      this.typeRequestlist = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });    
    
    this._branchOfficeService.GetBranchOffices()
    .subscribe((data)=>{
      this.branchOfficeRequestList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
    this._branchOfficeService.GetBranchOffices()
    .subscribe((data)=>{
      this.branchOfficeDispatchesList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
    this._commontmsService.getPriorityList()
    .subscribe((data)=>{
      this.priorityList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  search(){
    var DaysWeekListTemp = "";
    if(this.selectedDaysWeek != undefined && this.selectedDaysWeek.length > 0)
    {
      this.selectedDaysWeek.forEach(opt => {      
        DaysWeekListTemp = DaysWeekListTemp + opt.code + ",";
      });
      var Cantidad = DaysWeekListTemp.length; 
      DaysWeekListTemp = DaysWeekListTemp.substring(0, Cantidad-1);
      this._filters.daysWeek = DaysWeekListTemp;
    }else{
      this._filters.daysWeek = "";
    }       
    this.onSearch.emit(this._filters);
  }
  clearFilters(){    
    this._filters.active = -1;
    this._filters.branchOfficeDispatchesID = -1;
    this._filters.branchOfficeRequestID = -1;
    this._filters.priorityID = -1;
    this._filters.categoryID = -1;
    this._filters.requestTypeID = -1;
    this._filters.daysWeek = "";
    this.selectedDaysWeek = [];
  }


}
