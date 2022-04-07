import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isThisSecond } from 'date-fns';
import { SelectItem } from 'primeng/api';
import { InventoryCountReportFilter } from 'src/app/models/ims/inventory-count-report-filter';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';

@Component({
  selector: 'app-inventory-counts-report-filters',
  templateUrl: './inventory-counts-report-filters.component.html',
  styleUrls: ['./inventory-counts-report-filters.component.scss'],
  providers: [DatePipe]
})
export class InventoryCountsReportFiltersComponent implements OnInit {

  @Input() expanded = false;
  @Input() filters:  InventoryCountReportFilter;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<InventoryCountReportFilter>();
  @Output() exportExcel = new EventEmitter();
  statuslist: Status[] = [];
  areaList: Area[] = [];
  
  selectedCategories: any[] = [];
  categoriesString: string;

  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;

  operatorSelected: string;
  responsibleSelected: string;

  operatorModalKey = 'operator';

  showOperatorDialog = false;
  startDateFilter: Date = new Date();
  endDateFilter: Date = new Date();
  maxDate: Date = new Date();

  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];

  constructor(
    private readonly commonService: CommonService, 
    private readonly loadingService: LoadingService, 
    private readonly dialogService: DialogsService,
    private readonly areaService: AreaService,
    public datepipe: DatePipe,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadStatusList();
    this.loadAreasList();
    this.loadCategories();
  }

  showOperatorModal(key) {
    this.operatorModalKey = key;
    this.showOperatorDialog = true;
  }

  onSubmitOperator(data)
  {
    switch (this.operatorModalKey) {
      case 'operator':
        this.filters.operatorId = data.operator.id;
        this.operatorSelected = data.operator.name;
        break;
      case 'responsible':
        this.filters.responsibleId = data.operator.id;
        this.responsibleSelected = data.operator.name;
        break
    }

  }

  onHideOperator(visible: boolean){
    this.showOperatorDialog = visible;
  }

  onSearch() {
    this.setFilterValues();
    this.search.emit(this.filters);
  }

  onExportExcel() {
    this.exportExcel.emit();
  }

  clearFilters() {
    this.filters = new InventoryCountReportFilter();
    this.filters.startDate = '';
    this.operatorSelected = '';
    this.responsibleSelected = '';
    this.selectedCategories = [];
    this.startDateFilter = new Date();
    this.endDateFilter = new Date();
    this.categoriesString = '';
    this.selectedCategories = [];
    
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


  private setFilterValues() {
    this.filters.branchId = 1;
    this.filters.startDate = this.datepipe.transform(this.startDateFilter, 'yyyyMMdd');
    this.filters.endDate = this.datepipe.transform(this.endDateFilter, 'yyyyMMdd');
  }

  private loadStatusList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 3;
    this.commonService
    .getStatusPromise({...filter})
    .then(data => this.statuslist = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private loadAreasList() {
    this.loadingService.startLoading();
    this.areaService
    .getareaListPromise()
    .then(data => this.areaList = data.sort((a, b) => a.name.localeCompare(b.name)))
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

  private loadCategories() {
    this.loadingService.startLoading();
    const filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this.categoryService
    .gettreeCategoryPromise({...filter})
    .then(data => this.categoryService._categoryList = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

}
