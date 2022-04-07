import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { TreeNode } from 'primeng/api'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { FiscalPeriod } from 'src/app/models/financial/fiscalYear/FiscalPeriod';
import { TreeTable } from 'primeng/treetable';

type FiscalUnion<T = FiscalYear | FiscalPeriod> = T | {
  period?: string
}
@Component({
  selector: 'app-fiscal-year-tree',
  templateUrl: './fiscal-year-tree.component.html',
  styleUrls: ['./fiscal-year-tree.component.scss']
})
export class FiscalYearTreeComponent implements OnInit {
  @Input() tree: TreeNode<FiscalUnion>[];
  @Input() nodes: { [key: number]: FiscalYear } = {};
  @Input() years: FiscalUnion[] = [];
  yearCols: ColumnD<FiscalUnion>[];
  periodCols: ColumnD<FiscalUnion>[];
  cols: ColumnD<FiscalUnion>[];
  showFilters: boolean = false;
  @Output() openModal = new EventEmitter();
  @Output() onEdit = new EventEmitter<FiscalYear>();
  @ViewChild(TreeTable, { static: true }) treeRef: TreeTable

  expanded: { [key: string]: boolean } = {}

  constructor(public breadcrumbService: BreadcrumbService) {
  }

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

  toField = (field: string, data: FiscalUnion): any => ({
    'year': (data) => 'year' in data ? data.year : '',
    'periodNumber': (data) => 'periodNumber' in data ? data.periodNumber : '',
    'name': (data) => 'name' in data ? data.name : '',
    // @ts-ignore
    'period': (data) => `${this.toDate(data.initDate)} - ${this.toDate(data.endDate)}`,
    indClosed: (data) => null,
    'createdByUser': (data) => ('year' in data) ? data.createdByUser : '',
    'updatedByUser': (data) => ('year' in data) ? data.updatedByUser : '',
    'active': (data) => null,
    null: () => null,
  }[field || 'null'](data))

  log = console.log

  ngOnInit(): void {
    this.yearCols = [
      { field: 'year', header: 'Ejercicio', display: 'table-cell' },
      { field: 'period', header: 'Período', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell' },
    ];
    this.periodCols = [
      { field: 'periodNumber', header: 'Período N°', display: 'table-cell' },
      { field: 'name', header: 'Nombre', display: 'table-cell' },
      { field: 'period', header: 'Período', display: 'table-cell' },
      { field: 'indClosed', header: 'Cerrado', display: 'table-cell' },
    ];
    this.cols = [
      { field: 'year', header: 'Ejercicio', display: 'table-cell' },
      { field: 'periodNumber', header: 'Período N°', display: 'table-cell' },
      { field: 'name', header: 'Nombre', display: 'table-cell' },
      { field: 'period', header: 'Período', display: 'table-cell' },
      { field: 'indClosed', header: 'Cerrado', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell' },
    ];
    this.toggleExpanded(false)
  }

  showModal() {
    this.openModal.emit()
  }

  edit(year: FiscalYear) {
    this.onEdit.emit(year)
    this.openModal.emit()
  }

  toggleExpanded(status: boolean) {
    this.years.forEach((y: FiscalYear) => {
      this.expanded[y.id] = status
    })
  }

  async toggleExpandedPromise(status: boolean): Promise<TreeNode<any>[]> {
    let nodesCopy = [...this.tree]
    this.tree.forEach(node => {
      this.expandRecursive(node, status);
    });
    return nodesCopy
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
