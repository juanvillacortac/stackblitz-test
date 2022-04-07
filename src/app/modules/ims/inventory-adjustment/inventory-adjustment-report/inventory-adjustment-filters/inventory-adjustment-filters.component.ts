import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdjustmentFilterReport } from 'src/app/models/ims/adjustment-filter-report';
import { AdjustmentType } from 'src/app/models/ims/adjustment-type';
import { groupingInventoryReason } from 'src/app/models/ims/grouping-inventory-reasons';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { GroupinginventoryreasonService } from '../../../grouping-inventory-reasons/shared/service/groupinginventoryreason.service';
import { InventoryReasonFilter } from '../../../inventory-reasons/shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../../../inventory-reasons/shared/services/inventory-reason.service';
import { InventoryAdjustmentService } from '../../shared/services/inventory-adjustment.service';

@Component({
  selector: 'app-inventory-adjustment-filters',
  templateUrl: './inventory-adjustment-filters.component.html',
  styleUrls: ['./inventory-adjustment-filters.component.scss'],
  providers: [DatePipe]
})
export class InventoryAdjustmentFiltersComponent implements OnInit {

  groupMotives: groupingInventoryReason[] = [];
  motives: InventoryReasons[] = [];
  statuslist: Status[] = [];
  areaList: Area[] = [];
  adjustmentTypes: AdjustmentType[] = [];
  responsibleSelected: string;
  showOperatorDialog = false;

  selectedCategories: any[] = [];
  categoriesString: string;

  startDateFilter: Date = new Date();
  endDateFilter: Date = new Date();
  maxDate: Date = new Date();

  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];

  @Input() expanded = false;
  @Input() filters:  AdjustmentFilterReport;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<AdjustmentFilterReport>();
  @Output() exportExcel = new EventEmitter();

  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;

  constructor(public datepipe: DatePipe,
    private readonly groupinginventoryreasonService: GroupinginventoryreasonService, 
    private readonly dialogService: DialogsService,
    private readonly inventoryReasonService: InventoryReasonService,
    private readonly commonService: CommonService,
    private readonly areaService: AreaService,
    private readonly inventoryAdjustmentService: InventoryAdjustmentService,
    private readonly categoryService: CategoryService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.loadGroupMotives();
    this.loadStatusList();
    this.loadAreasList();
    this.loadAdjustmentTypeList();
    this.loadCategories();
  }

  onSearch() {
    this.setFilterProperties();
    this.search.emit(this.filters);
  }

  loadMotives() {
    if(this.filters.adjustmentMotiveGroupId > 0) {
      const filters = new InventoryReasonFilter();
      filters.idgroupingInventoryReason = this.filters.adjustmentMotiveGroupId;
      this.inventoryReasonService.getinventoryReasonList(filters).toPromise()
      .then(data => this.motives = data)
      .catch(error => this.handleError(error));
    }
  }

  ValidateCheckeds(dataSeleceted) {
    this.selectedCategories = dataSeleceted;
    this.categoriesString = '';
    this.filters.categories = '';
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString === '' ? this.selectedCategories[i].data.name : cont >= 5 ? cont + ' categorías seleccionadas' : this.categoriesString + ', ' + this.selectedCategories[i].data.name;
        this.filters.categories = this.filters.categories === '' ? this.selectedCategories[i].data.id : this.filters.categories + ','
                                + this.selectedCategories[i].data.id;
      }
    }
  }

  showOperatorModal() {
    this.showOperatorDialog = true;
  }

  onSubmitOperator(data)
  {
      this.filters.responsibleId = data.operator.id;
      this.responsibleSelected = data.operator.name;
  }

  onHideOperator(visible: boolean){
    this.showOperatorDialog = visible;
  }

  clearFilters() {
    this.filters = new AdjustmentFilterReport();
    this.responsibleSelected = '';
    this.selectedCategories = [];
    this.startDateFilter = new Date();
    this.endDateFilter = new Date();
    this.categoriesString = '';
    this.selectedCategories = [];
  }

  onExportExcel() {
    this.exportExcel.emit();
  }

  private setFilterProperties() {
    this.filters.areaId = this.filters.areaId ? this.filters.areaId : -1;
    this.filters.statusId = this.filters.statusId ? this.filters.statusId : -1;
    this.filters.branchId =this._authService.currentOffice ;
    this.filters.adjustmentId = -1;
    this.filters.responsibleId = this.filters.responsibleId ? this.filters.responsibleId : -1;
    this.filters.adjustmentTypeId = this.filters.adjustmentTypeId ? this.filters.adjustmentTypeId : -1;
    this.filters.adjustmentMotiveId = this.filters.adjustmentMotiveId ? this.filters.adjustmentMotiveId : -1;
    this.filters.adjustmentMotiveGroupId = this.filters.adjustmentMotiveGroupId ? this.filters.adjustmentMotiveGroupId : -1;
    this.filters.startDate = this.datepipe.transform(this.startDateFilter, 'yyyyMMdd');
    this.filters.endDate = this.datepipe.transform(this.endDateFilter, 'yyyyMMdd');
  }

  private loadStatusList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 4;
    this.commonService
    .getStatusPromise({...filter})
    .then(data => this.statuslist = data)
    .catch(error => this.handleError(error));
  }

  private loadGroupMotives() {
    this.groupinginventoryreasonService.getgroupingInventoryReasonsList().toPromise()
    .then(data => this.groupMotives = data)
    .catch(error => this.handleError(error));
  }

  private loadAreasList() {
    this.areaService
    .getareaListPromise()
    .then(data => this.areaList = data.sort((a, b) => a.name.localeCompare(b.name)))
    .catch(error => this.handleError(error));
  }

  private loadAdjustmentTypeList() {
    this.inventoryAdjustmentService
    .getAdjustmentTypeList().toPromise()
    .then(data => this.adjustmentTypes = data)
    .catch(error => this.handleError(error));
  }

  private loadCategories() {
    const filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this.categoryService
    .gettreeCategoryPromise({...filter})
    .then(data => this.categoryService._categoryList = data)
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }
}
