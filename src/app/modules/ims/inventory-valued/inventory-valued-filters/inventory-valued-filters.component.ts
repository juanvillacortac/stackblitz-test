import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValuedInventoryFilters } from 'src/app/models/ims/valued-inventory';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { Suppliermodal } from 'src/app/modules/srm/shared/view-models/common/suppliermodal';

@Component({
  selector: 'app-inventory-valued-filters',
  templateUrl: './inventory-valued-filters.component.html',
  styleUrls: ['./inventory-valued-filters.component.scss'],
  providers: [DatePipe]
})
export class InventoryValuedFiltersComponent implements OnInit {

  @Input() filters: ValuedInventoryFilters = new ValuedInventoryFilters();
  @Input() expanded = false;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<ValuedInventoryFilters>();
  @Output() exportExcel = new EventEmitter();
  suppliermodal: Suppliermodal = new Suppliermodal();

  validations: Validations = new Validations();

  categoriesString: string;
  suppliers: string;
  supplierDialogVisible: boolean = false;

  startDate: Date = new Date();
  endDate: Date = new Date();

  todayDate: Date = new Date();

  selectedCategories: any[] = [];
  selectedSupliers: string;

  statuses = [];
  selectedStatuses = [];

  dateTypes = [];

  rootTranslatesKey = 'ims.inventory_valued.';

  closedDateKey = 'closed_date';
  purchaseDateKey = "purchase_date";
  transferenceDateKey = "transference_date";

  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;

  constructor(private readonly commonService: CommonService,
    public datepipe: DatePipe,
    private readonly dialogService: DialogsService,
    private readonly categoryService: CategoryService,
    private readonly translate: TranslateService) { }

  ngOnInit(): void {
    this.loadStatusList();
    this.loadCategories();
    this.setDateTypes();
  }

  searchValuedInventories() {
    this.filters.statusId = this.selectedStatuses.map(x => x.id).join(',');
    this.filters.startDate = this.datepipe.transform(this.startDate, 'yyyyMMdd');
    this.filters.endDate = this.datepipe.transform(this.endDate, 'yyyyMMdd');

    this.search.emit(this.filters);
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

  toggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }

  suppliermodalChange(supplier: Suppliermodal) {
    this.filters.supplier = supplier.idSupplier;
    this.suppliers = supplier.socialReason;
  }
  
  showSuppliersModal() {
    this.supplierDialogVisible = true;
  }

  clearFilters() {
    this.filters = new ValuedInventoryFilters();
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedCategories = [];
    this.selectedStatuses = [];
    this.selectedSupliers = '';
    this.suppliers = '';
    this.categoriesString = '';
    this.filters.dateTypeId = 1;
  }

  onExportExcel() {
    this.exportExcel.emit();
  }

  private setDateTypes() 
  {
    this.getTranslationByKey(this.closedDateKey).subscribe(res => this.dateTypes.push({ name: res, id: 1 }));
    this.getTranslationByKey(this.purchaseDateKey).subscribe(res => this.dateTypes.push({ name: res, id: 2 }));
    this.getTranslationByKey(this.transferenceDateKey).subscribe(res => this.dateTypes.push({ name: res, id: 3 }));
  
    this.filters.dateTypeId = 1;
  }

  private getTranslationByKey(key: string){
    return this.translate.get(this.rootTranslatesKey + key);
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

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
