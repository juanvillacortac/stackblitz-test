
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { FiscalYearFilterList, FISCAL_YEAR_FILTER_LIST_DEFAULT } from 'src/app/models/financial/fiscalYear/filters/fiscalYearFilter';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations'
import { isThisQuarter } from 'date-fns';
import { FiscalYearService } from '../shared/services/fiscal-year.service';
import { FiscalPeriodModule } from 'src/app/models/financial/fiscalYear/fiscalPeriodModule';

const formatDate = (str: string | Date) => {
	const d = new Date(str)
	const padLeft = (n: number) => ("00" + n).slice(-2)
	const dformat = [
		d.getFullYear(),
		padLeft(d.getMonth() + 1),
		padLeft(d.getDate()),
	].join('.');
	return dformat
}

enum StatusEnum {
  all = -1,
  true = 1,
  false = 0
}

type StatusKey = keyof typeof StatusEnum

@Component({
  selector: 'app-fiscal-year-filters',
  templateUrl: './fiscal-year-filters.component.html',
  styleUrls: ['./fiscal-year-filters.component.scss']
})
export class FiscalYearFiltersComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  year: string
  active: StatusKey = null
  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: FiscalYearFilterList;
  @Input() modules: SelectItem<number>[];
  @Output() onSearch = new EventEmitter<FiscalYearFilterList>();
  _validations: Validations = new Validations()
  status: SelectItem<StatusKey>[] = [
    {label: 'Todos', value: 'all'},
    {label: 'Activo', value: 'true'},
    {label: 'Inactivo', value: 'false'}
  ];
  dateRange: Date[]
  modulesIds: number[]
  openedModules: number[] = []
  closedModules: number[] = []
  constructor(private service: FiscalYearService, private messageService: MessageService) { }

  filterModules = (exclude: number[]) => this.modules.filter(m => exclude?.indexOf(m.value) < 0)

  log = console.log
  
  getMaxDate() {
    if (!this.dateRange || !this.dateRange[0]) {
      return null
    }
    const newDate = new Date(this.dateRange[0])
    newDate.setMonth(newDate.getMonth() + 5)
    return newDate
  }

  ngOnInit(): void {
  }

  search() {
    if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
      if (this.dateRange[1] > this.getMaxDate()) {
          this.messageService.clear()
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "El rango de fecha seleccionado no puede ser mayor a 6 meses",
            closable: false,
            life: 5000,
          })
          return
      }
    }
    this.loading = true
    this.onSearch.emit({
      ...FISCAL_YEAR_FILTER_LIST_DEFAULT,
      ...(this.openedModules?.length ? { openedModulesId: this.openedModules } : {}),
      ...(this.closedModules?.length ? { closedModulesId: this.closedModules } : {}),
      active: this.active !== null ? StatusEnum[this.active] : -1,
      year: this.year || undefined,
      initDate: this.dateRange?.length ? formatDate(this.dateRange[0]) : '1900.01.01',
      endDate: this.dateRange?.length ? (this.dateRange[1] ? formatDate(this.dateRange[1]) : '2030.01.01') : '1900.01.01'
    })
  }

  cancelLoading() {
    this.loading = false
  }

  clearFilters() {
    this.year = null
    this.active = null
    this.dateRange = null
    this.openedModules = []
    this.closedModules = []
  }
}
