import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { MerchandiseRequestReportFilter } from 'src/app/models/tms/merchandise_request_report_filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { RequestTypeFilter } from '../../../shared/filters/requesttype-filter';
import { UseTypeFilter } from '../../../shared/filters/usetype-filter';
import { CommontmsService } from '../../../shared/service/common.service';


@Component({
  providers: [DatePipe],
  selector: 'app-merchandise-request-report-filter',
  templateUrl: './merchandise-request-report-filter.component.html',
  styleUrls: ['./merchandise-request-report-filter.component.scss']
})
export class MerchandiseRequestReportFilterComponent implements OnInit {

  @Input() expanded = false;
  @Input("_ReportFilter") _ReportFilter: MerchandiseRequestReportFilter = new MerchandiseRequestReportFilter();
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output("search") search = new EventEmitter<MerchandiseRequestReportFilter>();
  @Output() exportExcel = new EventEmitter();
  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  statuslist: SelectItem<Status[]> = {value: null};
  areaList: SelectItem<Area[]> = {value: null};
  selectedCategories: any[] = [];
  categoriesString: string;
  brandsString: string;
  supplierstring = '';
  brandDialogVisible = false;
  supplierDialogVisible = false;
  startDateFilter: Date = new Date();
  finalDateFilter: Date = new Date();
  requestTypeList: SelectItem[] = [];
  useTypeList: SelectItem[] = [];
  branchOfficeList: SelectItem[] =[];
  maxDate: Date = new Date();
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  constructor(
    private _httpClient: HttpClient,
    private _areaService: AreaService,
    public _categoryservice: CategoryService ,
    public datepipe: DatePipe ,
    public _commonService: CommonService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private commonTMSservice: CommontmsService,
    private branchOfficeService: BranchofficeService) {
      
   }

   _Authservice: AuthService = new AuthService(this._httpClient);
   
  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters() {
    this.loadAreasList();
    this.loadStatusList();
    this.loadCategories();
    this.onLoadRequestTypeList();
    this.onLoadUseTypeList();
    this.onLoadBranchOfficeList();
  }

  onSearch() {
    debugger
    this._ReportFilter.DateOfStart = this.datepipe.transform(this.startDateFilter, 'yyyy-MM-dd');
    this._ReportFilter.DateOfEnd = this.datepipe.transform(this.finalDateFilter, 'yyyy-MM-dd');
      this.search.emit(this._ReportFilter);
  }
  
  
  onExportExcel() {
    this.exportExcel.emit();
  }

  clearFilters() {
    this._ReportFilter.id = -1;
    this._ReportFilter.requestType = -1;
    this._ReportFilter.demandBranch = -1;
    this._ReportFilter.demandArea = -1;
    this._ReportFilter.status = -1;
    this._ReportFilter.category = -1;
    this._ReportFilter.useType = "";
    this._ReportFilter.requestNumber = "";
    this._ReportFilter.productBarcode = "";
    this._ReportFilter.productNamee = "";
    this.startDateFilter = new Date();
    this.finalDateFilter = new Date();
  }

  private loadAreasList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 1 ;
    this.loadingService.startLoading();
    this._areaService
    .getareaListPromise()
    .then(data => {this.areaList.value = data.sort((a, b) => a.name.localeCompare(b.name));
                   this.areaList.value.unshift( { name: 'Todos', id:  -1 } as Area);})
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private loadStatusList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 13 ;
    this._commonService
    .getStatusPromise({...filter})
    .then(data => this.statuslist.value = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private loadCategories() {
    this.loadingService.startLoading();
    const filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategoryPromise({...filter}).then(data => this._categoryservice._categoryList = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  onLoadRequestTypeList(){
    var filter : RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getRequestTypesList(filter)
    .subscribe((data)=>{
      this.requestTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadUseTypeList(){
    var filter : UseTypeFilter = new UseTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getUseTypesList(filter)
    .subscribe((data)=>{
      this.useTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadBranchOfficeList(){
    var filter : BranchofficeFilter = new BranchofficeFilter();
    filter.active = 1;
    this.branchOfficeService.getBranchOfficeList(filter)
    .subscribe((data)=>{
      this.branchOfficeList = data.map((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.product_histories.product_history', error?.error?.message ?? 'error_service');
  }

}
