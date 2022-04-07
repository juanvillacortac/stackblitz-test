import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Lots } from 'src/app/models/financial/lots';
import { SaleTransactionFilter } from 'src/app/models/financial/sale-transactions';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';

const formatDate = (str: string | Date) => {
  if (!str) {
    return undefined;
  }
  const d = new Date(str);
  const padLeft = (n: number) => ('00' + n).slice(-2);
  const dformat = [
    d.getFullYear(),
    padLeft(d.getMonth() + 1),
    padLeft(d.getDate()),
  ].join('.');
  return dformat;
};

@Component({
  selector: 'app-sale-transactions-filters',
  templateUrl: './sale-transactions-filters.component.html',
  styleUrls: ['./sale-transactions-filters.component.scss']
})
export class SaleTransactionsFiltersComponent implements OnInit {

  noneSpecialCharacters: RegExp = /^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/;
  filters = new SaleTransactionFilter();
  @Input() filterData;
  @Input() expanded = false;
  @Input() loading = false;
  @Input() modules: SelectItem<number>[];

  @Output() onSearch = new EventEmitter<SaleTransactionFilter>();

  _validations: Validations = new Validations();

  clientClassifications: SupplierClasification[] = [];
  clients: SupplierExtend[] = [];
  client: SupplierExtend;
  lots: Lots[] = [];
  lot: Lots;

  clientModal = false;
  lotModal = false;

  constructor(
    private supplierClassificationService: SupplierclasificationService
  ) { }

  log = console.log;

  ngOnInit(): void {
    this.fetchData();

  }

  async fetchData(){
    await Promise.all([
      this.getClientClassifications()
    ])
  }

  async getClientClassifications(){
    this.clientClassifications = (await this.supplierClassificationService.getSupplierClasificationList().toPromise())
    .sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification))

  }

  search() {
    this.onSearch.emit({
      ...this.filters,
      startDate: formatDate(this.filters.startDate) || '',
      endDate: formatDate(this.filters.endDate) || '',
    });
  }

  clearFilters() { 
    this.lot = new Lots();
    this.client = new SupplierExtend();
    this.filters = new SaleTransactionFilter();
  }

}
