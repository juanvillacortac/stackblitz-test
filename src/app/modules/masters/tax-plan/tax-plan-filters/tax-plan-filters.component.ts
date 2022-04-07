
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { TaxPlanFilter, TaxPlanApplicationType } from 'src/app/models/masters/tax-plan';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations'

enum StatusEnum {
  all = -1,
  true = 1,
  false = 0
}

type StatusKey = keyof typeof StatusEnum

@Component({
  selector: 'app-tax-plan-filters',
  templateUrl: './tax-plan-filters.component.html',
  styleUrls: ['./tax-plan-filters.component.scss']
})
export class TaxPlanFiltersComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/

  name: string;
  active: StatusKey = null;
  typeId: number = null;

  @Input() expanded = false;
  @Input() loading = false;
  @Input() modules: SelectItem<number>[];
  @Output() onSearch = new EventEmitter<TaxPlanFilter>();
  _validations: Validations = new Validations()
  status: SelectItem<StatusKey>[] = [
    {label: 'Todos', value: 'all'},
    {label: 'Activo', value: 'true'},
    {label: 'Inactivo', value: 'false'}
  ];

  @Input() isFiltered: boolean
  @Output() isFilteredChange = new EventEmitter<boolean>()

  @Input() types: TaxPlanApplicationType[] 

  typesList: SelectItem<number>[] = []
  dateRange: Date[]
  modulesIds: number[]
  openedModules: number[] = []
  closedModules: number[] = []

  constructor(private messageService: MessageService) { }

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
    this.typesList = [
      { label: 'Todos', value: -1 },
      ...this.types.map(t => ({
        label: t.name,
        value: t.id,
      }))
    ]
  }

  search() {
    this.loading = true
    this.onSearch.emit({
      ...new TaxPlanFilter(),
      name: this.name,
      taxPlanApplicationTypeId: this.typeId ?? -1,
      active: this.active !== null ? StatusEnum[this.active] : -1,
    })
    this.isFilteredChange.emit(true)
  }

  cancelLoading() {
    this.loading = false
  }

  clearFilters() {
    this.name = null
    this.typeId = null
    this.active = null
    this.dateRange = null
    this.openedModules = []
    this.closedModules = []
    this.isFilteredChange.emit(false)
  }
}
