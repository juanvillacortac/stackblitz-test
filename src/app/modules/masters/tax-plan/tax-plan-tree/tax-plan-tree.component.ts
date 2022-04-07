import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Table } from 'primeng/table';
import { TaxPlan } from 'src/app/models/masters/tax-plan';

@Component({
  selector: 'app-tax-plan-tree',
  templateUrl: './tax-plan-tree.component.html',
  styleUrls: ['./tax-plan-tree.component.scss'],
})
export class TaxPlanTreeComponent implements OnInit {
  @Input() plans: TaxPlan[] = [];
  @Input() isFiltered: boolean
  cols: ColumnD<TaxPlan>[];
  showFilters: boolean = false;
  @Output() openModal = new EventEmitter();
  @Output() onEdit = new EventEmitter<TaxPlan>();
  @ViewChild(Table, { static: true }) treeRef: Table

  constructor(public breadcrumbService: BreadcrumbService) {
  }

  log = console.log

  ngOnInit(): void {
    this.cols = [
      { template: (p) => p.name, field: 'name', header: 'Plan de impuestos', display: 'table-cell' },
      { template: (p) => p.taxes.length, field: 'taxCount', header: 'Cantidad de impuestos', display: 'table-cell' },
      { template: (p) => p.taxPlanApplicationType, field: 'taxPlanApplicationType', header: 'Tipo de aplicación', display: 'table-cell' },
      { template: () => null, field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (p) => p.createdByUser, field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { template: (p) => p.updatedByUser, field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell' },
    ];
  }

  showModal() {
    this.openModal.emit()
  }

  edit(plan: TaxPlan) {
    this.onEdit.emit(plan)
  }
}
