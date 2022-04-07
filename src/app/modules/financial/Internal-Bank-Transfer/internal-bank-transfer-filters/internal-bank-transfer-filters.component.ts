import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { InternalBankTransferFilter } from 'src/app/models/financial/Internal-bank-transfer';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations';

const formatDate = (str: string | Date) => {
  if (!str) {
    return undefined;
  }
	const d = new Date(str);
	const padLeft = (n: number) => ("00" + n).slice(-2);
	const dformat = [
		d.getFullYear(),
		padLeft(d.getMonth() + 1),
		padLeft(d.getDate()),
	].join('.');
	return dformat
}

@Component({
  selector: 'app-internal-bank-transfer-filters',
  templateUrl: './internal-bank-transfer-filters.component.html',
  styleUrls: ['./internal-bank-transfer-filters.component.scss']
})
export class InternalBankTransferFiltersComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/;
  filters = new InternalBankTransferFilter();
  @Input() expanded = false;
  @Input() loading = false;
  @Input() modules: SelectItem<number>[];
  @Output() onSearch = new EventEmitter<InternalBankTransferFilter>();
  _validations: Validations = new Validations()
  status: SelectItem<number>[] = [
    { label: 'Todos', value: -1 },
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 }
  ];

  filterState: SelectItem<number>[] = [
    { label: 'Borrador', value: 1 },
    { label: 'Contabilizado', value: 2 },
    { label: 'Cancelado', value: 3 },
    { label: 'Anulado', value: 4 }
  ];


  @Input() filterData

  constructor(private messageService: MessageService) { }

  log = console.log

  bankAccounts: SelectItem<number>[];

  filterBankAccounts() {
    // this.bankAccounts = this.filterData.accounts.filter(a => a.bankId == this.filters.bankId);
    // this.filters.bankAccountId = -1;
  }

  ngOnInit(): void {
  }

  search() {
    this.onSearch.emit({
      ...this.filters,
      // startDate: formatDate(this.filters.startDate) || '',
      // endDate: formatDate(this.filters.endDate) || '',
    });
  }

  clearFilters() {
    this.filters = new InternalBankTransferFilter();
  }
}
