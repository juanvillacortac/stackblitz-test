import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { InventoryRoutingModule } from './inventory-routing.module';
import { GroupingInventoryResasonListComponent } from './grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-resason-list.component';
import { GroupingInventoryReasonsPanelComponent } from './grouping-inventory-reasons/grouping-inventory-reasons-panel/grouping-inventory-reasons-panel.component';
import { GroupingInventoryReasonsFilterComponent } from './grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-reasons-filter/grouping-inventory-reasons-filter.component';
import { InventoryReasonListComponent } from './inventory-reasons/inventory-reason-list/inventory-reason-list.component';
import { InventoryReasonPanelComponent } from './inventory-reasons/inventory-reason-panel/inventory-reason-panel.component';
import { InventoryReasonFiltersPanelComponent } from './inventory-reasons/inventory-reason-list/inventory-reason-filters-panel/inventory-reason-filters-panel.component';
import { InventoryMovementListComponent } from './inventory-movement/inventory-movement-list/inventory-movement-list.component';
import { InventoryMovementFilterComponent } from './inventory-movement/inventory-movement-list/inventory-movement-filter/inventory-movement-filter.component';
import { GeneralDetailMovementPanelComponent } from './inventory-movement/general-detail-movement-panel/general-detail-movement-panel.component';
import { DetailMovementListComponent } from './inventory-movement/general-detail-movement-panel/detail-movement-list/detail-movement-list.component';
import { TransitMovementListComponent } from './inventory-movement/general-detail-movement-panel/transit-movement-list/transit-movement-list.component';
import { ProductInventoryMovementComponent } from './inventory-movement/general-detail-movement-panel/product-inventory-movement/product-inventory-movement.component';
import { InventoryExistenceListComponent } from './inventory-existence/inventory-existence-list/inventory-existence-list.component';
import { InventoryExistenceFiltersPanelComponent } from './inventory-existence/inventory-existence-list/inventory-existence-filters-panel/inventory-existence-filters-panel.component';
import { MastersModule } from '../masters/masters.module';
import { InventoryAdjustmentListComponent } from './inventory-adjustment/inventory-adjustment-list/inventory-adjustment-list.component';
import { InventoryAdjustmentFiltersPanelComponent } from './inventory-adjustment/inventory-adjustment-list/inventory-adjustment-filters-panel/inventory-adjustment-filters-panel.component';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { InventoryCountsListComponent } from './inventory-counts/inventory-counts-list/inventory-counts-list.component';
import { InventoryCountFilterComponent } from './inventory-counts/inventory-counts-list/inventory-count-filter/inventory-count-filter.component';
import { GeneralDetailInventoryCountComponent } from './inventory-counts/general-detail-inventory-count/general-detail-inventory-count.component';
import { InventoryCountPanelComponent } from './inventory-counts/general-detail-inventory-count/inventory-count-panel/inventory-count-panel.component';
import { ProductCountModalComponent } from './inventory-counts/general-detail-inventory-count/product-count-modal/product-count-modal.component';
import { ProductCountModalFilterComponent } from './inventory-counts/general-detail-inventory-count/product-count-modal/product-count-modal-filter/product-count-modal-filter.component';
import { CountForCountModalListComponent } from './inventory-counts/general-detail-inventory-count/count-for-count-modal-list/count-for-count-modal-list.component';
import { AddCountDetailComponent } from './inventory-counts/general-detail-inventory-count/add-count-detail/add-count-detail.component';
import { NewProductoCountModalComponent } from './inventory-counts/general-detail-inventory-count/new-producto-count-modal/new-producto-count-modal.component';
import { InventoryCountModalComponent } from './inventory-counts/general-detail-inventory-count/inventory-count-modal/inventory-count-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductExistenceTransactionDetailsComponent } from './inventory-existence/product-details/product-transaction-details/product-transaction-details.component';
import { InventoryCountsCalendarComponent } from './inventory-counts/inventory-counts-calendar/inventory-counts-calendar.component';
import { InventoryCountsCalendarItemComponent } from './inventory-counts/inventory-counts-calendar/shared/inventory-counts-calendar-item/inventory-counts-calendar-item.component';
import { InventoryCountsCalendarResumeComponent } from './inventory-counts/inventory-counts-calendar/shared/inventory-counts-calendar-resume/inventory-counts-calendar-resume.component';
import { ProductExistenceTransactionListViewComponent } from './inventory-existence/product-details/product-transaction-details/transaction-list-view/transaction-list-view.component';
import { ProductExistenceTransactionGridViewComponent } from './inventory-existence/product-details/product-transaction-details/transaction-grid-view/transaction-grid-view.component';
import { InventoryProductHistoryFiltersComponent } from './inventory-product-history/inventory-product-history-filters/inventory-product-history-filters.component';
import { InventoryProductHistoryListComponent } from './inventory-product-history/inventory-product-history-list/inventory-product-history-list.component';
import { InventoryCountsReportComponent } from './inventory-counts/inventory-counts-report/inventory-counts-report.component';
import { ProductExistenceDetailsListComponent } from './inventory-existence/product-details/product-details-list/product-details-list.component';
import { ProductExistenceDetailsHeadboardComponent } from './inventory-existence/product-details/product-details-headboard/product-details-headboard.component';
import { InventoryCountsReportFiltersComponent } from './inventory-counts/inventory-counts-report/inventory-counts-report-filters/inventory-counts-report-filters.component';
import { InventoryAdjustmentReportComponent } from './inventory-adjustment/inventory-adjustment-report/inventory-adjustment-report.component';
import { InventoryAdjustmentFiltersComponent } from './inventory-adjustment/inventory-adjustment-report/inventory-adjustment-filters/inventory-adjustment-filters.component';
import { MasiveMotiveModalComponent } from './inventory-adjustment/masive-motive-modal/masive-motive-modal.component';
import { AdjustmentPanelComponent } from './inventory-adjustment/adjustment-panel/adjustment-panel.component';
import { DetailAdjustmentListComponent } from './inventory-adjustment/detail-adjustment-list/detail-adjustment-list.component';
import { InventoryLotAndExpirationDateModalComponent } from './inventory-existence/inventory-lot-and-expiration-date-modal/inventory-lot-and-expiration-date-modal.component';
import { PrimengModule } from "../primeng/primeng.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InventoryValuedComponent } from './inventory-valued/inventory-valued.component';
import { InventoryValuedFiltersComponent } from './inventory-valued/inventory-valued-filters/inventory-valued-filters.component';
import { ProductRotationComponent } from './product-rotation/product-rotation.component';
import { ProductRotationFiltersComponent } from './product-rotation/product-rotation-filters/product-rotation-filters.component';
import { InventoryOfficesComparativesFiltersComponent } from './inventory-offices-comparatives/inventory-offices-comparatives-filters/inventory-offices-comparatives-filters.component';
import { InventoryOfficesComparativesListComponent } from './inventory-offices-comparatives/inventory-offices-comparatives-list/inventory-offices-comparatives-list.component';
import { InventoryProductAbcListComponent } from './inventory-product-abc/inventory-product-abc-list/inventory-product-abc-list.component';
import { InventoryProductAbcFiltersComponent } from './inventory-product-abc/inventory-product-abc-filters/inventory-product-abc-filters.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { InventoryPackOperationDetailComponent } from './inventory-pack-operation/inventory-pack-operation-detail/inventory-pack-operation-detail.component';
import { ProductDetailHeaderComponent } from './inventory-pack-operation/shared/product-detail-header/product-detail-header/product-detail-header.component';

@NgModule({
    declarations: [
      GroupingInventoryResasonListComponent,
       GroupingInventoryReasonsPanelComponent,
        GroupingInventoryReasonsFilterComponent,
        InventoryReasonListComponent,
        InventoryReasonPanelComponent,
        InventoryReasonFiltersPanelComponent,
        InventoryExistenceListComponent,
        InventoryExistenceFiltersPanelComponent,
        InventoryMovementListComponent,
        InventoryMovementFilterComponent,
        GeneralDetailMovementPanelComponent,
        DetailMovementListComponent,
        TransitMovementListComponent,
        ProductInventoryMovementComponent,
        InventoryCountsListComponent,
        InventoryCountFilterComponent,
        GeneralDetailInventoryCountComponent,
        InventoryCountPanelComponent,
        InventoryAdjustmentListComponent,
        InventoryAdjustmentFiltersPanelComponent,
        ProductCountModalComponent,
        ProductCountModalFilterComponent,
        CountForCountModalListComponent,
        AddCountDetailComponent,
        NewProductoCountModalComponent,
        AdjustmentPanelComponent,
        DetailAdjustmentListComponent,
        InventoryCountModalComponent,
        MasiveMotiveModalComponent,
        ProductExistenceDetailsListComponent,
        ProductExistenceDetailsHeadboardComponent,
        ProductExistenceTransactionDetailsComponent,
        InventoryCountsReportComponent,
        InventoryCountsCalendarComponent,
        InventoryCountsCalendarItemComponent,
        InventoryCountsCalendarResumeComponent,
        ProductExistenceTransactionDetailsComponent,
        ProductExistenceTransactionListViewComponent,
        ProductExistenceTransactionGridViewComponent,
        InventoryProductHistoryFiltersComponent,
        InventoryProductHistoryListComponent,
        InventoryCountsReportFiltersComponent,
        InventoryAdjustmentReportComponent,
        InventoryAdjustmentFiltersComponent,
        InventoryLotAndExpirationDateModalComponent,
        DashboardComponent,
        InventoryValuedComponent,
        InventoryValuedFiltersComponent,
        ProductRotationComponent,
        ProductRotationFiltersComponent,
        InventoryOfficesComparativesFiltersComponent,
        InventoryOfficesComparativesListComponent,
        InventoryProductAbcListComponent,
        InventoryProductAbcFiltersComponent,
        InventoryPackOperationDetailComponent,
        ProductDetailHeaderComponent],
imports: [
   CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    FieldsetModule,
    InputTextareaModule,
    InventoryRoutingModule,
    ProgressSpinnerModule,
    CalendarModule,
    MastersModule,
    CommonDirectiveModule,
    CommonAppModule,
    TranslateModule,
    PrimengModule,
    MenuModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es'}
  ]
})
export class InventoryModule {
}
