import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode, MessageService, SelectItem } from 'primeng/api'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { FiscalYearFilterList, FISCAL_YEAR_FILTER_LIST_DEFAULT } from 'src/app/models/financial/fiscalYear/filters/fiscalYearFilter';
import { FiscalPeriod } from 'src/app/models/financial/fiscalYear/FiscalPeriod';
import { FiscalPeriodModule } from 'src/app/models/financial/fiscalYear/fiscalPeriodModule';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { FiscalYearFiltersComponent } from '../fiscal-year-filters/fiscal-year-filters.component';
import { FiscalYearMutationModalComponent } from '../fiscal-year-mutation-modal/fiscal-year-mutation-modal.component';
import { FiscalYearTreeComponent } from '../fiscal-year-tree/fiscal-year-tree.component';
import { FiscalYearService } from '../shared/services/fiscal-year.service';

type FiscalUnion<T = FiscalYear | FiscalPeriod> = T | {
  period?: string
}

@Component({
  selector: 'app-fiscal-year-details',
  templateUrl: './fiscal-year-details.component.html',
  styleUrls: ['./fiscal-year-details.component.scss']
})
export class FiscalYearDetailsComponent implements OnInit {
  noneSpecialCharacters: RegExp = /^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  yearNodes: { [key: number]: FiscalYear } = {};
  years: FiscalUnion<FiscalYear>[];
  loaded = false
  tree: TreeNode<FiscalUnion>[]
  filter: FiscalYearFilterList = FISCAL_YEAR_FILTER_LIST_DEFAULT
  showFilters: boolean = false;
  showDialog = false;
  modules: FiscalPeriodModule[]
  modulesList: SelectItem<number>[];

  @ViewChild(FiscalYearTreeComponent, { static: true }) treeComp: FiscalYearTreeComponent;
  @ViewChild(FiscalYearFiltersComponent) filters: FiscalYearFiltersComponent;
  @ViewChild(FiscalYearMutationModalComponent, { static: true }) modal: FiscalYearMutationModalComponent;

  yearList = (yearNodes: { [key: number]: FiscalYear }) => Object.values(yearNodes).sort((a, b) => b.id - a.id)

  mutationModalYearList: FiscalYear[]

  private toDate = (str: string) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  constructor(
    private service: FiscalYearService,
    private msgService: MessageService,
    public breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Ejercicios fiscales', routerLink: ['/financial/masters/fiscal-year'] }
    ]);
  }

  fetchYears(filter: FiscalYearFilterList = FISCAL_YEAR_FILTER_LIST_DEFAULT, onResolve: (years: FiscalYear[]) => void) {
    this.service.getList(filter)
      .subscribe(onResolve)
  }

  fetchData(filter = FISCAL_YEAR_FILTER_LIST_DEFAULT) {
    // Necesitamos una copia de todos los ejercicios fiscales, sin importar el filtro
    this.fetchYears(FISCAL_YEAR_FILTER_LIST_DEFAULT, (years) => {
      years.forEach((y) => {
        this.yearNodes[y.id] = {
          ...y,
          fiscalPeriods: y.fiscalPeriods.filter(p => p.active)
        }
      });
      this.mutationModalYearList = this.yearList(this.yearNodes)
      // Acá sí se obtendrán filtrados
      this.fetchYears(filter, (years) => {
        this.years = years.sort((a, b) => b.id - a.id).map((y: FiscalYear) => ({
          ...y as FiscalUnion,
          period: `${this.toDate(y.initDate)} - ${this.toDate(y.endDate)}`,
          fiscalPeriods: y.fiscalPeriods.filter(p => p.active),
        }))
        this.tree = Object.values(years).sort((a, b) => b.id - a.id).map((y: FiscalYear) => ({
          data: {
            ...y as FiscalUnion,
            period: `${this.toDate(y.initDate)} - ${this.toDate(y.endDate)}`,
            fiscalPeriods: y.fiscalPeriods.filter(p => p.active),
          },
          children: y.fiscalPeriods.filter(p => p.active).map((p) => ({
            data: {
              ...p as FiscalUnion,
              period: `${this.toDate(p.initDate)} - ${this.toDate(p.endDate)}`,
              fiscalPeriods: y.fiscalPeriods.filter(p => p.active),
            },
          }))
        }))
        this.loaded = true
      })
    })
    this.service.getModuleList().subscribe(modules => {
      this.modules = modules.map(m => ({
        ...m,
        indClosed: !!+m.indClosed
      }))
      this.modulesList = modules.map(m => ({
        value: m.id,
        label: m.name,
      }))
      this.filters?.cancelLoading()
    })
  }

  ngOnInit(): void {
    this.fetchData()
  }

  update() {
  }
}
