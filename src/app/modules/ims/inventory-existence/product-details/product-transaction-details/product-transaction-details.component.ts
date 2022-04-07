import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProductExistenceTransactionDetails } from 'src/app/models/ims/product-existence-transaction-details';
import { ProductExistenceTransactionFilters } from 'src/app/models/ims/product-existence-transaction-filters';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { InventoryExistenceService } from '../../shared/services/inventory-existence.service';

@Component({
  selector: 'app-product-transaction-details',
  templateUrl: './product-transaction-details.component.html',
  styleUrls: ['./product-transaction-details.component.scss']
})
export class ProductExistenceTransactionDetailsComponent implements OnInit {
  @Input() filters: ProductExistenceTransactionFilters;
  @Input() tittle: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  productTransactionsList: ProductExistenceTransactionDetails [] = [];
  displayedColumns: ColumnD<ProductExistenceTransactionDetails>[] = [];
  loading = true;
  fileName = '';
  sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;
  constructor(
    public _inventoryExistenceService: InventoryExistenceService,
    private dialogService: DialogsService,
    public datepipe: DatePipe,
    private readonly excelExportService: ExcelExportService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.search();
  }
  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    } else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  }
  search() {
    this.loadProductTransactionDetails();
  }
  private loadProductTransactionDetails() {
    this._inventoryExistenceService
    .getProductExistenceTransactionDetails({...this.filters})
    .then(details => this.productTransactionsList = details )
    .then(() => this.loadSortOptions())
    .then(() => this.loading = false)
    .catch(error => this.handleError(error));
  }


  closePanel() {
    this.close.emit(false);
  }
  exportToExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('ims.product_transactions.product_transactions_detail');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }

  loadModelToExport() {
    const list = this.productTransactionsList.map( item => {
      return {
        [this.getTextByKey('ims.product_transactions.checkOutInvoice')]: item.checkOutInvoice,
        [this.getTextByKey('ims.product_transactions.netCost')]: item.netCost,
        [this.getTextByKey('ims.product_transactions.baseCost')]: item.baseCost,
        [this.getTextByKey('ims.product_transactions.basePVP')]: item.basePVP,
        [this.getTextByKey('ims.product_transactions.conversionPVP')]: item.conversionPVP,
        [this.getTextByKey('ims.product_transactions.inflows')]: item.inflows,
        [this.getTextByKey('ims.product_transactions.outflows')]: item.outflows,
        [this.getTextByKey('ims.product_transactions.presentation')]: item.package + ' uds.',
        [this.getTextByKey('ims.product_transactions.operator')]: item.operator,
        [this.getTextByKey('ims.product_transactions.transactionDate')]: this.datepipe.transform(item.transactionDate, 'dd-MM-yyyy'),
        [this.getTextByKey('ims.product_transactions.transactionTime')]: this.datepipe.transform(item.transactionTime, 'h:mm a')
      };
    });
    return list;
  }
  get dataUnavailable() {
    return (!this.productTransactionsList  || this.productTransactionsList.length === 0);
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.dialogService.errorMessage('ims.product_transactions.product_transactions_detail', error?.error?.message ?? 'error_service');
  }

  private loadSortOptions() {
    this.sortOptions = [
      {label: [this.getTextByKey('ims.product_transactions.descending_transactionTime')], value: '!transactionTime'},
      {label: this.getTextByKey('ims.product_transactions.ascending_transactionTime'), value: 'transactionTime'},
      {label: this.getTextByKey('ims.product_transactions.netCost_high_low'), value: '!netCost'},
      {label: this.getTextByKey('ims.product_transactions.netCost_low_high'), value: 'netCost'},
      {label: this.getTextByKey('ims.product_transactions.baseCost_high_low'), value: '!baseCost'},
      {label: this.getTextByKey('ims.product_transactions.baseCost_low_high'), value: 'baseCost'},
      {label: this.getTextByKey('ims.product_transactions.basePVP_high_low'), value: '!basePVP'},
      {label: this.getTextByKey('ims.product_transactions.basePVP_low_high'), value: 'basePVP'},
      {label: this.getTextByKey('ims.product_transactions.conversionPVP_high_low'), value: '!conversionPVP'},
      {label: this.getTextByKey('ims.product_transactions.conversionPVP_low_high'), value: 'conversionPVP'},
      {label: this.getTextByKey('ims.product_transactions.inflows_high_low'), value: '!inflows'},
      {label: this.getTextByKey('ims.product_transactions.inflows_low_high'), value: 'inflows'},
      {label: this.getTextByKey('ims.product_transactions.outflows_high_low'), value: '!outflows'},
      {label: this.getTextByKey('ims.product_transactions.outflows_low_high'), value: 'outflows'},
  ];
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }
}
