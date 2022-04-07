import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { LedgerAccountCategoryFilter } from 'src/app/models/financial/LedgerAccountCategoryFilter';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LedgerAccountCategoryService } from '../shared/services/ledger-account-category.service';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations'

@Component({
  selector: 'app-ledger-account-category-filters',
  templateUrl: './ledger-account-category-filters.component.html',
  styleUrls: ['./ledger-account-category-filters.component.scss']
})
export class LedgerAccountCategoryFiltersComponent implements OnInit {

  noneSpecialCharacters:RegExp =/^[a-zA-Z0-9äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  accountingAccountCategoryId = null;
  ledgerAccountCategoriesActive = null;
  accountingAccountCategory = String;
  @Input() expanded = false;
  @Input() filters: LedgerAccountCategoryFilter;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<LedgerAccountCategoryFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
  ];
  constructor(private auxiliaryService: LedgerAccountCategoryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.accountingAccountCategoryId = null;
    this.ledgerAccountCategoriesActive = null;
    this.accountingAccountCategory = null; 
  }

  search() {
    /*this.filters.accountingAccountCategoryId = this.accountingAccountCategoryId === null ? -1 : this.accountingAccountCategoryId;*/
    this.filters.active = this.ledgerAccountCategoriesActive ? this.ledgerAccountCategoriesActive === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.IdAccountCategory = '';
    this.filters.accountingAccountCategory = '';
    this.ledgerAccountCategoriesActive = null;

  }

}
