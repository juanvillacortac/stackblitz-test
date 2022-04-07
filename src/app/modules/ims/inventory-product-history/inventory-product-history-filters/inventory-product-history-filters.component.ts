import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { InventoryProductHistoryFilters } from 'src/app/models/ims/inventory-product-history-filters';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { InventoryExistenceFilter } from '../../inventory-existence/shared/filters/inventory-existence-filter';
import { InventoryProductHistoryService } from '../shared/service/inventory-product-history.service';

@Component({
  selector: 'app-inventory-product-history-filters',
  templateUrl: './inventory-product-history-filters.component.html',
  styleUrls: ['./inventory-product-history-filters.component.scss'],
  providers: [DatePipe]
})
export class InventoryProductHistoryFiltersComponent implements OnInit {
  @Input() expanded = false;
  @Input() filters:  InventoryProductHistoryFilters;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<InventoryProductHistoryFilters>();
  @Output() exportExcel = new EventEmitter();
  supplierBrandFilters: InventoryExistenceFilter =  new InventoryExistenceFilter();
  brandsFilter: brandsFilter = new brandsFilter();
  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  statuslist: SelectItem<Status[]> = {value: null};
  areaList: SelectItem<Area[]> = {value: null};
  inventoryAreaSelected = null;
  existenceList: SelectItem[];
  heavylist: SelectItem[];
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
    private _brandService: BrandsService,
    private _areaService: AreaService,
    public _categoryservice: CategoryService ,
    public datepipe: DatePipe ,
    public _commonService: CommonService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService) {
      this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
   }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters() {
    this.loadHeavyList();
    this.loadExistenceList();
    this.loadAreasList();
    this.loadStatusList();
    this.loadCategories();
  }

  ValidateCheckeds(dataSeleceted) {
    this.selectedCategories = dataSeleceted;
    this.categoriesString = '';
    this.filters.idCategory = '';
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString === '' ? this.selectedCategories[i].data.name : cont >= 5 ? cont + ' categorías seleccionadas' : this.categoriesString + ', ' + this.selectedCategories[i].data.name;
        this.filters.idCategory = this.filters.idCategory === '' ? this.selectedCategories[i].data.id : this.filters.idCategory + ','
                                + this.selectedCategories[i].data.id;
      }
    }
  }
  onToggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }

  onToggleBrand(visible: boolean) {
    this.brandDialogVisible = visible;
  }
  onSearch() {
      this.completeFilterModel();
      this.search.emit(this.filters);
  }
  completeFilterModel() {
    this.filters.inventoryArea = this.inventoryAreaSelected ?? -1;
    this.filters.startDate = this.datepipe.transform(this.startDateFilter, 'yyyyMMdd');
    this.filters.finalDate = this.datepipe.transform(this.finalDateFilter, 'yyyyMMdd');
    this.filters.idSupplier = this.supplierBrandFilters.idsupplier;
    this.filters.idBrand = this.supplierBrandFilters.idbrand;
    this.filters.idBranchOffice = this._authService.currentOffice;
  }
  onExportExcel() {
    this.exportExcel.emit();
  }

  clearFilters() {
    this.filters.idBranchOffice = this._authService.currentOffice;
    this.filters.inventoryArea = -1;
    this.inventoryAreaSelected = null;
    this.filters.idSpace = -1;
    this.filters.productName  = '';
    this.filters.barCode  = '';
    this.filters.idProductEstatus = -1;
    this.filters.reference  = '';
    this.filters.factoryReference  = '';
    this.filters.scaleCode  = '';
    this.filters.idCategory  = '';
    this.filters.idBrand  = '';
    this.filters.idSupplier  = '';
    this.filters.startDate  = '';
    this.filters.finalDate  = '';
    this.filters.indHeavyProduct = -1;
    this.filters.existence = 2;
    this.selectedCategories = [];
    this.supplierstring = '';
    this.brandsString = '';
    this.categoriesString = '';
    this.supplierBrandFilters = new InventoryExistenceFilter();
    this.startDateFilter = new Date();
    this.finalDateFilter = new Date();
  }
  private loadExistenceList() {
    this.existenceList = [
      { label: 'Todos', value:  '2' },
      { label: 'En cero', value: '0'},
      { label: 'Negativa', value: '-1'},
      { label: 'Positiva', value: '1'},
      ];
  }
  private loadHeavyList() {
    this.heavylist = [
      {label: 'Todos', value: '-1'},
      {label: 'No pesados', value: '0'},
      {label: 'Pesados', value: '1'},

      ];
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
    filter.IdStatusType = 1 ;
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
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.product_histories.product_history', error?.error?.message ?? 'error_service');
  }
}
