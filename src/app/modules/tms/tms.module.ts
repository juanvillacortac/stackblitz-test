import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeTableModule } from "primeng/treetable";
import { CalendarModule } from 'angular-calendar';
import { CalendarModule as pCalendarModule } from 'primeng/calendar';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { InputSwitchModule } from "primeng/inputswitch";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { SplitButtonModule } from "primeng/splitbutton";
import { KeyFilterModule} from 'primeng/keyfilter';
import { MastersModule } from "../masters/masters.module";
import { CommonDirectiveModule } from "../shared/common-directive/common-directive.module";
import { CommonAppModule } from "../common/common.module";
import { TmsRoutingModule } from "./tms-routing.module";
import { BadgeModule } from 'primeng/badge';
import { MasterDriverListComponent } from "./master-driver/master-driver-list/master-driver-list.component";
import { MasterDriverFilterComponent } from "./master-driver/master-driver-list/master-driver-filter/master-driver-filter.component";
import { MasterDriverPanelComponent } from './master-driver/master-driver-list/master-driver-panel/master-driver-panel.component';
import { MasterVehicleListComponent } from './master-vehicle/master-vehicle-list/master-vehicle-list.component';
import { MasterVehiclePanelComponent } from './master-vehicle/master-vehicle-list/master-vehicle-panel/master-vehicle-panel.component';
import { MerchandiseRequestFilterComponent } from './merchandise-request/merchandise-request-filter/merchandise-request-filter.component';
import { MerchandiseRequestNewComponent } from './merchandise-request/merchandise-request-new/merchandise-request-new.component';
import { MerchandiseRequestProductComponent } from './merchandise-request/merchandise-request-new/merchandise-request-product/merchandise-request-product.component';
import { CdTimerModule } from "angular-cd-timer";

import { MasterRouteListComponent } from './master-route/master-route-list/master-route-list.component';
import { MasterRoutePanelComponent } from './master-route/master-route-list/master-route-panel/master-route-panel.component';
import { MasterRouteFilterComponent } from './master-route/master-route-list/master-route-filter/master-route-filter.component';
import { AdvancedProductSearchComponent } from './merchandise-request/merchandise-request-new/advanced-product-search/advanced-product-search.component';
import { AdvancedProductSearchFilterComponent } from './merchandise-request/merchandise-request-new/advanced-product-search/advanced-product-search-filter/advanced-product-search-filter.component';
import { MasterRequestSetupListComponent } from './master-request-setup/master-request-setup-list/master-request-setup-list.component';
import { MasterRequestSetupPanelComponent } from './master-request-setup/master-request-setup-panel/master-request-setup-panel.component';
import { MasterRequestSetupFilterComponent } from './master-request-setup/master-request-setup-list/master-request-setup-filter/master-request-setup-filter.component';
import { ModalAggregateTrailerComponent } from './master-vehicle/shared/components/modal-aggregate-trailer/modal-aggregate-trailer.component';
import { ModalAggregateVehicleDriverComponent } from './master-vehicle/shared/components/modal-aggregate-vehicle-driver/modal-aggregate-vehicle-driver.component';
import { MasterVehicleFilterComponent } from "./master-vehicle/master-vehicle-list/master-vehicle-filter/master-vehicle-filter.component";
import { MerchandiseTransfersListComponent } from './merchandise-transfers/merchandise-transfers-list/merchandise-transfers-list.component';
import { MerchandiseTransfersFilterComponent } from './merchandise-transfers/merchandise-transfers-filter/merchandise-transfers-filter.component';
import { MerchandiseTransfersNewComponent } from './merchandise-transfers/merchandise-transfers-new/merchandise-transfers-new.component';
import { MerchandiseTransferProductComponent } from './merchandise-transfers/merchandise-transfers-new/merchandise-transfer-product/merchandise-transfer-product.component';
import { MerchandiseRequestSelectionModalComponent } from './merchandise-transfers/merchandise-request-selection-modal/merchandise-request-selection-modal.component';
import { MerchandisePurchasesSelectionModalComponent } from './merchandise-transfers/merchandise-purchases-selection-modal/merchandise-purchases-selection-modal.component';
import { AdditionalDataComponent } from './merchandise-transfers/merchandise-transfers-new/additional-data/additional-data.component';
import { SearchVehiclesComponent } from './merchandise-transfers/merchandise-transfers-new/additional-data/search-vehicles/search-vehicles.component';
import { PalletizingMerchandiseComponent } from './merchandise-transfers/palletizing-merchandise/palletizing-merchandise.component';
import { MerchandiseTransferProductReceiveComponent } from './merchandise-transfers/merchandise-transfers-new/merchandise-transfer-product-receive/merchandise-transfer-product-receive.component';
import { BranchTransfersListModalComponent } from './merchandise-transfers/merchandise-transfers-new/branch-transfers-list-modal/branch-transfers-list-modal.component';
import { PalletizingMerchandiseProductComponent } from './merchandise-transfers/palletizing-merchandise/palletizing-merchandise-product/palletizing-merchandise-product.component';
import { DetailAddLotComponent } from './merchandise-transfers/merchandise-transfers-new/detail-add-lot/detail-add-lot.component';
import { PalletizingMerchandiseReceiveComponent } from './merchandise-transfers/merchandise-transfers-new/palletizing-merchandise-receive/palletizing-merchandise-receive.component';
import { ReasonReturnPalletteComponent } from './merchandise-transfers/merchandise-transfers-new/palletizing-merchandise-receive/reason-return-pallette/reason-return-pallette.component';
import { PrimengModule } from "../primeng/primeng.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './request-transfer-calendar/calendar/calendar.component';
import { MerchandiseRequestCalendarItemComponent } from './request-transfer-calendar/shared/merchandise-request-calendar-item/merchandise-request-calendar-item.component';
import { MerchandiseRequestCalendarResumeComponent } from './request-transfer-calendar/shared/merchandise-request-calendar-resume/merchandise-request-calendar-resume.component';
import { SidebarModule } from "primeng/sidebar";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { PrintedReportComponent } from './printed-report/printed-report/printed-report.component';
import { TelerikReportingModule } from "@progress/telerik-angular-report-viewer";
import { VehicleDriversReportListComponent } from "./vehicle-drivers-report/vehicle-drivers-report-list/vehicle-drivers-report-list.component";
import { VehicleDriversReportFilterComponent } from "./vehicle-drivers-report/vehicle-drivers-report-filter/vehicle-drivers-report-filter.component";
import { MerchandiseRequestReportComponent } from './merchandise-request-report/merchandise-request-report/merchandise-request-report.component';
import { MerchandiseRequestReportFilterComponent } from './merchandise-request-report/merchandise-request-report-filter/merchandise-request-report-filter/merchandise-request-report-filter.component'
import { MerchandiseTransfersReportComponent } from "./merchandise-transfer-report/merchandise-transfers-report/merchandise-transfers-report.component";
import { MerchandiseTransfersReportFilterComponent } from "./merchandise-transfer-report/merchandise-transfer-report-filter/merchandise-transfers-report-filter.component";
import { MerchandiseRequestListComponent } from "./merchandise-request/merchandise-request-list/merchandise-request-list.component";
import { ReportsModule } from "../reports/reports.module";

@NgModule({
    declarations:[
      MasterDriverListComponent,
      MasterDriverFilterComponent,
      MasterDriverPanelComponent,
      MasterVehicleListComponent,
      MasterVehiclePanelComponent,
      MasterVehicleFilterComponent,
      MasterRouteListComponent,
      MasterRoutePanelComponent,
      MasterRouteFilterComponent,
      MerchandiseRequestListComponent,
      MerchandiseRequestFilterComponent,
      MerchandiseRequestNewComponent,
      MerchandiseRequestProductComponent,
      AdvancedProductSearchComponent,
      AdvancedProductSearchFilterComponent,
      MasterRequestSetupListComponent,
      MasterRequestSetupPanelComponent,
      MasterRequestSetupFilterComponent,
      ModalAggregateTrailerComponent,
      ModalAggregateVehicleDriverComponent,
      MerchandiseTransfersListComponent,
      MerchandiseTransfersFilterComponent,
      MerchandiseTransfersNewComponent,
      MerchandiseTransferProductComponent,
      MerchandiseRequestSelectionModalComponent,
      MerchandisePurchasesSelectionModalComponent,
      AdditionalDataComponent,
      SearchVehiclesComponent,
      PalletizingMerchandiseComponent,
      MerchandiseTransferProductReceiveComponent,
      BranchTransfersListModalComponent,
      PalletizingMerchandiseProductComponent,
      DetailAddLotComponent,
      PalletizingMerchandiseReceiveComponent,
      ReasonReturnPalletteComponent,
      DashboardComponent,
      CalendarComponent,
      MerchandiseRequestCalendarItemComponent,
      MerchandiseRequestCalendarResumeComponent,
      PrintedReportComponent,
      VehicleDriversReportListComponent,
      VehicleDriversReportFilterComponent,
      MerchandiseRequestReportComponent,
      MerchandiseRequestReportFilterComponent,
      MerchandiseTransfersReportComponent,
      MerchandiseTransfersReportFilterComponent
      ],
imports: [
    TelerikReportingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TmsRoutingModule,
    TreeTableModule,
    SidebarModule,
    MultiSelectModule,
    TooltipModule,
    CalendarModule,
    pCalendarModule,
    InputSwitchModule,
    TabViewModule,
    CardModule,
    OverlayPanelModule,
    SplitButtonModule,
    KeyFilterModule,
    MastersModule,
    CommonDirectiveModule,
    CommonAppModule,
    CdTimerModule,
    PrimengModule,
    BadgeModule,
    ReportsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class TmsModule {
}
