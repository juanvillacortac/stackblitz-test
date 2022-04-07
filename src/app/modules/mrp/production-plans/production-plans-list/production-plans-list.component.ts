import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ProductionPlan } from 'src/app/models/mrp/production-plan';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProductionPlansService } from '../shared/production-plans.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-plans-list',
  templateUrl: './production-plans-list.component.html',
  styleUrls: ['./production-plans-list.component.scss']
})
export class ProductionPlansListComponent implements OnInit {
  loading = false;
  showFilters = false;
  cols: any[];
  permissionsIDs = {...Permissions};

  productionPlans: ProductionPlan[] = [];

  constructor(
    private router: Router,
    private service: ProductionPlansService,
    public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: 'Plan de Producción', routerLink: ['/mrp/production-plans'] }
    ]);
  }

  ngOnInit() {
    this.setupColumns();
    this.loadProductionPlans();
  }

  private loadProductionPlans() {
    this.service.loadAllProductionPlans()
      .then((productionPlans) => this.productionPlans = productionPlans)
      .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {

  }

  setupColumns() {
    this.cols = [
      { field: 'id', display: 'table-cell', header: 'ID' },
      { field: 'name', display: 'table-cell', header: 'description' },
      { field: 'deliveryDate', display: 'table-cell', header: 'end_date' },
      { field: 'idType', display: 'table-cell', header: 'type' },
      { field: 'progress', display: 'table-cell', header: 'progress' },
      { field: 'detail', display: 'table-cell', header: 'detail' }
    ];
  }

  newPlan() {
    this.router.navigate(['/mrp/production-plans-new']);
  }

  detail(plan: ProductionPlan) {
    this.service.selectedPlan = plan;
    this.router.navigate(['/mrp/production-plans', plan.id]);
  }
}
