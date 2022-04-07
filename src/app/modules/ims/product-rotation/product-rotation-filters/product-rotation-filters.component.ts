import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductRotationFilters } from 'src/app/models/ims/product-rotation';
import { Area } from 'src/app/models/masters/area';
import { Brands } from 'src/app/models/masters/brands';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { InventoryExistenceFilter } from '../../inventory-existence/shared/filters/inventory-existence-filter';

@Component({
  selector: 'app-product-rotation-filters',
  templateUrl: './product-rotation-filters.component.html',
  styleUrls: ['./product-rotation-filters.component.scss'],
  providers: [DatePipe]
})
export class ProductRotationFiltersComponent implements OnInit {

  @Input() filters: ProductRotationFilters = new ProductRotationFilters();
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<ProductRotationFilters>();
  @Output() exportExcel = new EventEmitter();

  @Input() expanded: boolean = true;

  validations: Validations = new Validations();
  supplierDialogVisible: boolean = false;

  categoriesString: string;
  selectedCategories: any[] = [];
  supplierstring: string;
  brandsString: string;
  brandDialogVisible: boolean = false;

  existenceList: any[] = [];

  statuses = [];
  areas: Area[] = [];

  weightedInds = [];

  startDate: Date = new Date();
  endDate: Date = new Date();
  todayDate: Date = new Date();

  supplierFilters: InventoryExistenceFilter =  new InventoryExistenceFilter();
  supplierBrandFilters: InventoryExistenceFilter =  new InventoryExistenceFilter();

  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;

  constructor(private readonly categoryService: CategoryService, 
    private readonly brandService: BrandsService,
    private readonly commonService: CommonService,
    private readonly areaService: AreaService,
    public datepipe: DatePipe,
    private readonly dialogService: DialogsService,
    private readonly translateService: TranslateService) { }

  ngOnInit(): void {
    this.loadExistenceList();
    this.loadCategories();
    this.loadMarks();
    this.loadStatusList();
    this.loadAreasList();
    this.loadWeightedInds();
  }

  searchReport() {
    this.setProperties();
    this.search.emit(this.filters);
  }

  getTextTranslateKey(key) {
    return `ims.product_rotation.${key}`
  }

  ValidateCheckeds(dataSeleceted) {
    this.selectedCategories = dataSeleceted;
    this.categoriesString = '';
    this.filters.categories = '';
    let cont = 0;
    for (let i = 0; i < this.selectedCategories?.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString === '' ? this.selectedCategories[i].data.name : cont >= 5 ? cont + ' categorías seleccionadas' : this.categoriesString + ', ' + this.selectedCategories[i].data.name;
        this.filters.categories = this.filters.categories === '' ? this.selectedCategories[i].data.id : this.filters.categories + ','
                                + this.selectedCategories[i].data.id;
      }
    }
  }

  showSuppliersModal() {
    this.supplierDialogVisible = true;
  }

  toggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }

  FiltersChange(result) {
    this.supplierFilters = result;
    this.supplierstring = this.supplierFilters?.supplierstring;
  }

  clearFilters() {
    this.filters = new ProductRotationFilters();
    this.selectedCategories = [];
    this.categoriesString = '';
    this.supplierstring = '';
    this.brandsString = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.supplierFilters = new InventoryExistenceFilter();
    this.supplierBrandFilters = new InventoryExistenceFilter();
  }

  onExportExcel() {
    this.exportExcel.emit();
  }

   onToggleBrand(visible: boolean) {
    this.brandDialogVisible = visible;
  }

  private setProperties() {
    this.filters.indInventory = this.filters.indInventory ?? 0;
    this.filters.areaId = this.filters.areaId ?? -1;
    this.filters.indWeighted = this.filters.indWeighted ?? -1;
    this.filters.statusId = this.filters.statusId ?? -1;
    this.filters.supplierId = this.supplierFilters.idsupplier ? Number(this.supplierFilters.idsupplier) : -1;
    this.filters.supplierId =  this.filters.supplierId === 0 ? -1 : this.filters.supplierId;
    this.filters.markId = this.supplierBrandFilters.idbrand ? Number(this.supplierBrandFilters.idbrand) : -1;
    this.filters.markId =  this.filters.markId === 0 ? -1 : this.filters.markId;
    this.filters.startDate = this.datepipe.transform(this.startDate, 'yyyyMMdd');
    this.filters.endDate = this.datepipe.transform(this.endDate, 'yyyyMMdd');
  }

  private loadWeightedInds() {
    this.weightedInds = [
      { label: this.translateService.instant('ims.no_weighted'), value: '0'},
      { label: this.translateService.instant('ims.weighted'), value: '1'},
      ];
  }

  private loadAreasList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 1;

    this.areaService
    .getareaListPromise()
    .then(data => this.areas = data)
    .catch(error => this.handleError(error));
  }

  private loadStatusList() {
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 1;
    this.commonService
    .getStatusPromise({...filter})
    .then(data => this.statuses = data)
    .catch(error => this.handleError(error));
  }

  private loadCategories() {
    const filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this.categoryService.gettreeCategoryPromise({...filter})
    .then(data => this.categoryService._categoryList = data)
    .catch(error => this.handleError(error));
  }

  private loadMarks() {
    const brandFilter = new brandsFilter;

    brandFilter.id = -1;
    brandFilter.active = 1;
    brandFilter.idClass = -1;

    this.brandService.getBrandsList(brandFilter).toPromise()
    .then((data: Brands[]) => {
      this.brandService._brandsList = data;
    }, (error: HttpErrorResponse)=>{
      this.handleError(error);
    });
  }

  private loadExistenceList() {
    this.existenceList = [
      { label: this.translateService.instant('ims.with_stock'), value: '1' },
      { label: this.translateService.instant('ims.without_stock'), value: '2' },
      { label: this.translateService.instant('ims.negative_stock'), value: '3' },
      ];
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
