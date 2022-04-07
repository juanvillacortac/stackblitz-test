import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { MerchandiseTransfersReportFilter } from 'src/app/models/tms/merchandise_transfers_report_filter';
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
import { UseTypeFilter } from '../../shared/filters/usetype-filter';
import { CommontmsService } from '../../shared/service/common.service';

@Component({
  selector: 'app-merchandise-transfers-report-filter',
  templateUrl: './merchandise-transfers-report-filter.component.html',
  styleUrls: ['./merchandise-transfers-report-filter.component.scss'],
  providers: [DatePipe]
})
export class MerchandiseTransfersReportFilterComponent implements OnInit {
  @Input() expanded = false;
  @Input("_ReportFilter") _ReportFilter:  MerchandiseTransfersReportFilter = new MerchandiseTransfersReportFilter();
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<MerchandiseTransfersReportFilter>();
  @Output() exportExcel = new EventEmitter();
  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  statuslist: SelectItem<Status[]> = {value: null};
  areaList: SelectItem<Area[]> = {value: null};
  branchOfficeList: SelectItem[] =[];
  useTypeList: SelectItem[] = [];
  selectedCategories: any[] = [];
  categoriesString: string;
  brandsString: string;
  supplierstring = '';
  brandDialogVisible = false;
  supplierDialogVisible = false;
  startDateFilter: Date = new Date();
  finalDateFilter: Date = new Date();
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
    private commonTMSservice: CommontmsService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private branchOfficeService: BranchofficeService,) {
      
   }

   _Authservice: AuthService = new AuthService(this._httpClient);

   ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters() {
    debugger
    this.loadAreasList();
    this.loadCategories();
    this.loadStatusList();
    this.LoadBranchOfficeList();
    this.LoadUseTypeList();
  }

  onSearch() {
    debugger
      this.completeFilterModel();
      this.search.emit(this._ReportFilter);
  }
  
  completeFilterModel() {
    this._ReportFilter.startDate = this.datepipe.transform(this.startDateFilter, 'yyyyMMdd');
    this._ReportFilter.endDate = this.datepipe.transform(this.finalDateFilter, 'yyyyMMdd');
  }
  onExportExcel() {
    this.exportExcel.emit();
  }

  clearFilters() {
    this._ReportFilter.transferNumber = "",
    this._ReportFilter.transferType = "",
    this._ReportFilter.useType = "",
    this._ReportFilter.originBranch = new Branchoffice(),
    this._ReportFilter.originArea = "",
    this._ReportFilter.destinyBranch = new Branchoffice(),
    this._ReportFilter.destinyArea = "",
    this._ReportFilter.status = -1,
    this._ReportFilter.productCodeBar = "",
    this._ReportFilter.productDescription = "",
    this._ReportFilter.category = new Category(),
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
    filter.IdStatusType = 16 ;
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
    this._categoryservice
    .gettreeCategoryPromise({...filter})
    .then(data => this._categoryservice._categoryList = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  LoadUseTypeList(){
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

  LoadBranchOfficeList(){
    debugger
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
