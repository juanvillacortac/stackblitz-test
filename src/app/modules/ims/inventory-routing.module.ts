import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth.guard";
import { LayoutComponent } from "../layout/layout/layout.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GroupingInventoryResasonListComponent } from "./grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-resason-list.component";
import { AdjustmentPanelComponent } from "./inventory-adjustment/adjustment-panel/adjustment-panel.component";
import { InventoryAdjustmentListComponent } from "./inventory-adjustment/inventory-adjustment-list/inventory-adjustment-list.component";
import { InventoryAdjustmentReportComponent } from "./inventory-adjustment/inventory-adjustment-report/inventory-adjustment-report.component";
import { GeneralDetailInventoryCountComponent } from "./inventory-counts/general-detail-inventory-count/general-detail-inventory-count.component";
import { InventoryCountsCalendarComponent } from "./inventory-counts/inventory-counts-calendar/inventory-counts-calendar.component";
import { InventoryCountsListComponent } from "./inventory-counts/inventory-counts-list/inventory-counts-list.component";
import { InventoryCountsReportComponent } from "./inventory-counts/inventory-counts-report/inventory-counts-report.component";
import { InventoryExistenceListComponent } from "./inventory-existence/inventory-existence-list/inventory-existence-list.component";
import { ProductExistenceDetailsListComponent } from "./inventory-existence/product-details/product-details-list/product-details-list.component";
import { GeneralDetailMovementPanelComponent } from "./inventory-movement/general-detail-movement-panel/general-detail-movement-panel.component";
import { InventoryMovementListComponent } from "./inventory-movement/inventory-movement-list/inventory-movement-list.component";
import { InventoryProductHistoryListComponent } from "./inventory-product-history/inventory-product-history-list/inventory-product-history-list.component";
import { InventoryReasonListComponent } from "./inventory-reasons/inventory-reason-list/inventory-reason-list.component";
import { InventoryValuedComponent } from "./inventory-valued/inventory-valued.component";
import { ProductRotationComponent } from "./product-rotation/product-rotation.component";
import { InventoryOfficesComparativesListComponent } from './inventory-offices-comparatives/inventory-offices-comparatives-list/inventory-offices-comparatives-list.component';
import { InventoryProductAbcListComponent } from "./inventory-product-abc/inventory-product-abc-list/inventory-product-abc-list.component";

const routes: Routes = [
  { path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children: [
    { path: 'inventory-reason-list', component: InventoryReasonListComponent },
    { path: 'grouping-inventory-reason-list', component: GroupingInventoryResasonListComponent },
    { path: 'inventory-movement-list', component: InventoryMovementListComponent },
    { path: 'detail-inventory-movement/:id/:idbranchoffice/:idpacket/:idarea/:fechaini/:fechafin', component: GeneralDetailMovementPanelComponent },
    { path: 'inventory-existence-list', component: InventoryExistenceListComponent },
    { path: 'inventory-adjustment-list', component: InventoryAdjustmentListComponent },
    { path: 'adjustment-panel/:id', component: AdjustmentPanelComponent },
    { path: 'inventory-adjustment-report', component: InventoryAdjustmentReportComponent },
    { path: 'inventory-count-list', component: InventoryCountsListComponent },
    { path: 'inventory-count-calendar', component: InventoryCountsCalendarComponent },
    { path: 'inventory-count-report', component: InventoryCountsReportComponent },
    { path: 'detail-inventory-count/:id', component: GeneralDetailInventoryCountComponent },
    { path: 'product-existence-detail/:id', component: ProductExistenceDetailsListComponent},
    { path: 'product-history-report', component: InventoryProductHistoryListComponent},
    { path: 'inventory-valued-report', component: InventoryValuedComponent },
    { path: 'product-rotation-report', component: ProductRotationComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'offices-comparative-report', component: InventoryOfficesComparativesListComponent},
    { path: 'product-abc-report', component: InventoryProductAbcListComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventoryRoutingModule {
}
