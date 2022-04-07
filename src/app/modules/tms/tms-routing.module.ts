import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth.guard";
import { LayoutComponent } from "../layout/layout/layout.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MasterDriverListComponent } from "./master-driver/master-driver-list/master-driver-list.component";
import { MasterRequestSetupListComponent } from "./master-request-setup/master-request-setup-list/master-request-setup-list.component";
import { MasterRouteListComponent } from "./master-route/master-route-list/master-route-list.component";
import { MasterVehicleListComponent } from "./master-vehicle/master-vehicle-list/master-vehicle-list.component";
import { MerchandiseRequestReportComponent } from "./merchandise-request-report/merchandise-request-report/merchandise-request-report.component";
import { MerchandiseRequestNewComponent } from "./merchandise-request/merchandise-request-new/merchandise-request-new.component";
import { MerchandiseTransfersReportComponent } from "./merchandise-transfer-report/merchandise-transfers-report/merchandise-transfers-report.component";
import { PrintedReportComponent } from "./printed-report/printed-report/printed-report.component";
import { VehicleDriversReportListComponent } from "./vehicle-drivers-report/vehicle-drivers-report-list/vehicle-drivers-report-list.component";
import { MerchandiseTransfersListComponent } from "./merchandise-transfers/merchandise-transfers-list/merchandise-transfers-list.component";
import { MerchandiseTransfersNewComponent } from "./merchandise-transfers/merchandise-transfers-new/merchandise-transfers-new.component";
import { PalletizingMerchandiseComponent } from "./merchandise-transfers/palletizing-merchandise/palletizing-merchandise.component";
import { CalendarComponent } from "./request-transfer-calendar/calendar/calendar.component";
import { MerchandiseRequestListComponent } from "./merchandise-request/merchandise-request-list/merchandise-request-list.component";

const routes: Routes = [  
  { path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children:[
      { path: 'master-driver-list', component: MasterDriverListComponent },
      { path: 'master-vehicle-list', component: MasterVehicleListComponent },
      { path: 'master-route-list', component: MasterRouteListComponent },
      { path: 'master-request-setup-list', component: MasterRequestSetupListComponent },
      { path: 'merchandise-request/:id/:indModule', component: MerchandiseRequestNewComponent},
      { path: 'printed-report/:idBranchTransfer', component: PrintedReportComponent},
      { path: 'vehicle-driver-report', component: VehicleDriversReportListComponent},
      { path: 'merchandise-request-report', component: MerchandiseRequestReportComponent},
      { path: 'merchandise-transfers-report', component: MerchandiseTransfersReportComponent},
      { path: 'merchandise-request-list', component: MerchandiseRequestListComponent },
      { path: 'merchandise-request/:id', component: MerchandiseRequestNewComponent},
      { path: 'merchandise-transfers-list', component: MerchandiseTransfersListComponent },
      { path: 'merchandise-transfers/:idTransfer/:idBranchTransfer', component: MerchandiseTransfersNewComponent},
      { path: 'palletizing-merchandise-transfer/:idTransfer/:idBranchTransfer', component: PalletizingMerchandiseComponent},
      { path: 'calendar', component: CalendarComponent},
      { path: 'dashboard', component: DashboardComponent}
    ]
  }
];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class TmsRoutingModule {
}
