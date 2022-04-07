import { HttpErrorResponse } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { CheckOption } from 'src/app/models/common/check-option';
import { InventoryOfficesComparativeFilters } from 'src/app/models/ims/inventory-offices-comparative-filters';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { InventoryExistenceFilter } from '../../inventory-existence/shared/filters/inventory-existence-filter';

@Component({
  selector: 'app-inventory-offices-comparatives-filters',
  templateUrl: './inventory-offices-comparatives-filters.component.html',
  styleUrls: ['./inventory-offices-comparatives-filters.component.scss']
})
export class InventoryOfficesComparativesFiltersComponent implements OnInit {
  @Input() expanded = false;
  @Input() filters:  InventoryOfficesComparativeFilters;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Input() haveCostPermission = false;
  @Output() search = new EventEmitter<InventoryOfficesComparativeFilters>();
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
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  userOffices: CheckOption[] = [];
  officesSelected = '';
  simpleReport = true;
  constructor(
    private _areaService: AreaService,
    public _categoryservice: CategoryService,
    public _commonService: CommonService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _authService: AuthService,
    private _layoutSerice: LayoutService
  ) { }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters() {
    this.loadHeavyList();
    this.loadExistenceList();
    this.loadAreasList();
    this.loadStatusList();
    this.loadCategories();
    this.loadUserOffices();
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
    if (this.validateOfficesSelection) {
      this.completeFilterModel();
      this.search.emit(this.filters);
    }

  }
  completeFilterModel() {
    this.filters.inventoryArea = this.inventoryAreaSelected ?? -1;
    this.filters.idSupplier = this.extractNumber(this.supplierBrandFilters.idsupplier);
    this.filters.idBrand = this.extractNumber(this.supplierBrandFilters.idbrand);
    this.filters.branchOffices = this.officesSelected;
    this.filters.simpleReport = this.simpleReport;
  }
  onExportExcel() {
    this.exportExcel.emit();
  }
  onOfficeSelected() {
    this.officesSelected = '';
     const selectedItems = this.userOffices.filter(x => x.selected);
    selectedItems.map(item => {
      this.officesSelected = this.officesSelected === '' ? String(item.id) : this.officesSelected + ',' + String(item.id);
  });
  }
  clearFilters() {
    this.filters.inventoryArea = -1;
    this.inventoryAreaSelected = null;
    this.filters.productName  = '';
    this.filters.barcode  = '';
    this.filters.idProductEstatus = -1;
    this.filters.reference  = '';
    this.filters.factoryReference  = '';
    this.filters.scaleCode  = '';
    this.filters.idCategory  = '';
    this.filters.idBrand  = -1;
    this.filters.idSupplier  = -1;
    this.filters.indHeavyProduct = -1;
    this.filters.existence = 0;
    this.selectedCategories = [];
    this.supplierstring = '';
    this.brandsString = '';
    this.categoriesString = '';
    this.clearOfficeSelection();
    this.supplierBrandFilters = new InventoryExistenceFilter();
    this.simpleReport = true;
  }
  private clearOfficeSelection() {
    this.userOffices.forEach(opt => {
      opt.selected = false;
    });
  }
  private loadUserOffices() {
    this._layoutSerice.getCompanyBrachOfficesByUser(this._authService.idUser)
      .then(companies => this.selectOfficesFromCurrentCompany(companies))
      .catch(error => this.handleError(error));
  }

  private selectOfficesFromCurrentCompany(companyList) {
    return this.officesToCheckOptionModel(companyList.find( company => company.id === this._authService.currentCompany).offices ?? []);
  }
  private officesToCheckOptionModel(offices) {
      offices.map(item => {
        this.userOffices.push({
          id: item.id,
          name: item.name,
          selected: false
        });
    });
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
                  this.areaList.value.unshift( { name: 'Todos', id:  -1 } as Area); })
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
    this.dialogService.errorMessage('ims.inventory_offices_comparative.offices_comparative_report', error?.error?.message ?? 'error_service');
  }

  private extractNumber(value: string) {
     return String(value).length > 0 ? Number(value) ?? -1 : -1;
  }
  get validateOfficesSelection() {
    return this.userOffices.filter(x => x.selected).length >= 2 ?? false;
  }
}
