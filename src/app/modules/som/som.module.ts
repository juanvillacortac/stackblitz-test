import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SomRoutingModule } from './som-routing.module';
import { DashboardSomComponent } from './dashboard-som/dashboard-som.component';
import { CommonAppModule } from '../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SalesComponent } from './dashboard-modal/sales/sales.component';
import { TicketPromedioComponent } from './dashboard-modal/sales/ticket-promedio/ticket-promedio.component';
import { ReceptionDetailComponent } from './dashboard-modal/sales/reception/reception-detail/reception-detail.component';
import { SalesreportListComponent } from './reports/salesreport/salesreport-list/salesreport-list.component';
import { SalesreportFilterComponent } from './reports/salesreport/salesreport-filter/salesreport-filter.component';
import { ObjectivesByDepartmentComponent } from './dashboard-modal/objectives-by-department/objectives-by-department.component';


@NgModule({
  declarations: [DashboardSomComponent, SalesComponent, TicketPromedioComponent, ReceptionDetailComponent, SalesreportListComponent, SalesreportFilterComponent, ObjectivesByDepartmentComponent],
  imports: [
    CommonAppModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonDirectiveModule,
    PrimengModule,
    SomRoutingModule
  ]
})
export class SomModule { }
