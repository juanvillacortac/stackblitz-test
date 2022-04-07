import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveLabelComponent } from './components/active-label/active-label.component';
import * as Directives from 'src/app/modules/common/directives/form-validations.directive';
import { EditContactNumbersComponent } from './components/add-contact-numbers/edit-contact-numbers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { CheckListComponent } from './components/check-list/check-list.component';
import { DecimalAmountDirective } from '../masters-mpc/shared/Utils/Validations/Validations';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { DropdownTreeComponent } from './components/dropdown-tree/dropdown-tree.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { IndheavyLabelComponent } from './components/indheavy-label/indheavy-label.component';
import { ProgressViewComponent } from './components/progress-view/progress-view.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { UserModalListComponent } from './components/user-modal-list/user-modal-list.component';
import { OperatorModalListComponent } from './components/operator-modal-list/operator-modal-list.component';
import { StatusLabelComponent } from './components/status-label/status-label.component';
import { IndBlockedLabelComponent } from './components/ind-blocked-label/ind-blocked-label.component';
import { IndAdjustmentLabelComponent } from './components/ind-adjustment-label/ind-adjustment-label.component';
import { StatusCountLabelComponent } from './components/status-count-label/status-count-label.component';
import { StatusAdjustmentLabelComponent } from './components/status-adjustment-label/status-adjustment-label.component';
import { ContactNumberSupplierComponent } from './components/contact-number-supplier/contact-number-supplier.component';
import { AddExchangeTaxComponent } from './components/add-exchange-tax/add-exchange-tax.component';
import { ContactNumberSuppliersMasiveComponent } from './components/contact-number-suppliers-masive/contact-number-suppliers-masive.component';
import { AddMasiveExchangeTaxComponent } from './components/add-masive-exchange-tax/add-masive-exchange-tax.component';
import { UserSupplierMasiveComponent } from './components/user-supplier-masive/user-supplier-masive.component';
import { ExcelExportButtonComponent } from './components/excel-export-button/excel-export-button.component';
import { PurchaseOrderModalComponent } from './components/purchase-order-modal/purchase-order-modal.component';
import { SuppliersCatalogModalComponent } from './components/suppliers-catalog-modal/suppliers-catalog-modal.component';
import { FooterFormButtonsComponent } from './components/footer-form-buttons/footer-form-buttons.component';
import { ProductCatalogModalComponent } from './components/product-catalog-modal/product-catalog-modal.component';
import { SupplierCommonModalComponent } from './components/supplier-common-modal/supplier-common-modal.component';
import { CardProductComponent } from './components/card-product/card-product.component';
import { BankAccountSuppliersModalComponent } from './components/bank-account-suppliers-modal/bank-account-suppliers-modal.component';
import { DashboardLayaoutComponent } from "./components/dashboard-layaout/dashboard-layaout.component";
import { AutoCompleteUserSearchComponent } from "./components/auto-complete-user-search/auto-complete-user-search.component";
import { ListTeamComponent } from "./components/dashboard-widgets/list-team/list-team.component";
import { BranchofficeModalComponent } from "./components/branchoffice-modal/branchoffice-modal.component";
import { DataviewListComponent } from "./components/dashboard-widgets/dataview-list/dataview-list.component";
import { TimerViewerComponent } from "./components/timer-viewer/timer-viewer.component";
import { AreaModalComponent } from "./components/area-modal/area-modal.component";
import { UserImageComponent } from "./components/user-image/user-image.component";
import { ListNumberIndicatorComponent } from "./components/dashboard-widgets/list-number-indicator/list-number-indicator.component";
import { KnobIndicatorComponent } from "./components/dashboard-widgets/knob-indicator/knob-indicator.component";
import { RankingTableComponent } from "./components/dashboard-widgets/ranking-table/ranking-table.component";
import { NumberIndicatorComponent } from "./components/dashboard-widgets/number-indicator/number-indicator.component";
import { StatComponent } from "./components/dashboard-widgets/stat/stat.component";
import { PercendIndConditionComponent } from "./components/dashboard-widgets/percend-ind-condition/percend-ind-condition.component";
import { RankingStatComponent } from "./components/dashboard-widgets/ranking-stat/ranking-stat.component";
import { WidgetComponent } from "./components/dashboard-widgets/widget/widget.component";
import { PercentIndComponent } from "./components/dashboard-widgets/percent-ind/percent-ind.component";
import { CardGraphComponent } from "./components/dashboard-widgets/card-graph/card-graph.component";
import { TargetIndComponent } from "./components/dashboard-widgets/target-ind/target-ind.component";
import { GenericTableComponent } from "./components/dashboard-widgets/generic-table/generic-table.component";
import { CircleNumberIndicatorComponent } from "./components/dashboard-widgets/circle-number-indicator/circle-number-indicator.component";
import { SliderListComponent } from "./components/dashboard-widgets/slider-list/slider-list.component";
import { AvatarGroupComponent } from "./components/avatar-group/avatar-group.component";
import { TableResponsiveComponent } from "./components/dashboard-widgets/table-responsive/table-responsive.component";
import { DataviewListProductComponent } from "./components/dashboard-widgets/dataview-list-product/dataview-list-product.component";
import { GridsterModule } from "angular-gridster2";
import { ResponsiveChartComponent } from './components/dashboard-widgets/charts-responsive/p-chart-responsive';
import { ModalCategoryComponent } from "../srm/dashboard/dashboard-modal/modal-category/modal-category.component";
import { PrimengModule } from '../primeng/primeng.module';
import { EmployeeProfileDetailComponent } from './components/employee-profile-detail/employee-profile-detail.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { UpdaterButtonComponent } from './components/updater-button/updater-button.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { TableIndicatorComponent } from './components/dashboard-widgets/table-indicator/table-indicator.component';
import { ReasonDialogComponent } from './components/reason-dialog/reason-dialog.component';
import { ProfileDetailsComponent } from './components/dashboard-widgets/profile-details/profile-details.component';
import { SelectButtonOptionComponent } from './components/select-button-option/select-button-option.component';
import { TableSalesComponent } from './components/dashboard-widgets/table-sales/table-sales.component';
import { CheckboxTableSelectorComponent } from './components/checkbox-table-selector/checkbox-table-selector.component';
import { TelerikReportModalComponent } from './components/telerik-report-modal/telerik-report-modal.component';
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';
import { ReportsModule } from "../reports/reports.module";
import { NgxImageCompressService } from 'ngx-image-compress';

@NgModule({
  declarations: [
     ActiveLabelComponent,
     EditContactNumbersComponent,
     EditAddressComponent,
     CheckListComponent,
     ImagePickerComponent,
     DropdownTreeComponent,
     IndheavyLabelComponent,
     Directives.SentenceTypeDirective,
     Directives.OnlyUpperCaseDirective,
     Directives.FirstLetterUpperCaseDirective,
     Directives.NoDblClickDirective,
     IndheavyLabelComponent,
     ProgressViewComponent,
     TableHeaderComponent,
     DecimalAmountDirective,
     Directives.NoneSpecialCharactersDirective,
     Directives.InternationalPhoneNumberDirective,
     Directives.OnlyNumberDirective,
     Directives.OnlyLettersDirective,
     UserModalListComponent,
     OperatorModalListComponent,
     StatusLabelComponent,
     IndBlockedLabelComponent,
     IndAdjustmentLabelComponent,
     StatusAdjustmentLabelComponent,
     StatusCountLabelComponent,
     ContactNumberSupplierComponent,
     AddExchangeTaxComponent,
     ContactNumberSuppliersMasiveComponent,
     AddMasiveExchangeTaxComponent,
     UserSupplierMasiveComponent,
     Directives.DisableButtonOnSubmitDirective,
     Directives.AutoFocusDirective,
     ExcelExportButtonComponent,
     PurchaseOrderModalComponent,
     SuppliersCatalogModalComponent,
     FooterFormButtonsComponent,
     ProductCatalogModalComponent,
     SupplierCommonModalComponent,
     CardProductComponent,
     DashboardLayaoutComponent,
     ResponsiveChartComponent,
     WidgetComponent,
     NumberIndicatorComponent,
     KnobIndicatorComponent,
     StatComponent,
     CircleNumberIndicatorComponent,
     GenericTableComponent,
     SliderListComponent,
     AvatarGroupComponent,
     RankingTableComponent,
     AutoCompleteUserSearchComponent,
     RankingStatComponent,
     ListTeamComponent,
     CardGraphComponent,
     ListNumberIndicatorComponent,
     AvatarGroupComponent,
     CardProductComponent,
     TableResponsiveComponent,
     BankAccountSuppliersModalComponent,
     DataviewListComponent,
     TargetIndComponent,
     PercentIndComponent,
     TableIndicatorComponent,
     CardProductComponent,
     UserImageComponent,
     AreaModalComponent,
     TimerViewerComponent,
     DataviewListProductComponent,
     ReasonDialogComponent,
     PercendIndConditionComponent,
     UpdaterButtonComponent,
     BranchofficeModalComponent,
     ModalCategoryComponent,
     EmployeeProfileDetailComponent,
     ProfileDetailsComponent,
     SelectButtonOptionComponent,
     TableSalesComponent,
     ProfileDetailsComponent,
     CheckboxTableSelectorComponent,
     TelerikReportModalComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    TranslateModule,
    GridsterModule,
    ChartModule,
    PrimengModule,
    KnobModule,
    DynamicDialogModule,
    SplitButtonModule,
    TelerikReportingModule,
    ReportsModule
  ],
  exports: [
    Directives.NoneSpecialCharactersDirective,
    Directives.InternationalPhoneNumberDirective,
    Directives.OnlyNumberDirective,
    Directives.OnlyLettersDirective,
    ActiveLabelComponent,
    DecimalAmountDirective,
    EditContactNumbersComponent,
    EditAddressComponent,
    CheckListComponent,
    ImagePickerComponent,
    DropdownTreeComponent,
    Directives.SentenceTypeDirective,
    Directives.OnlyUpperCaseDirective,
    Directives.FirstLetterUpperCaseDirective,
    Directives.NoDblClickDirective,
    IndheavyLabelComponent,
    ProgressViewComponent,
    TableHeaderComponent,
    Directives.FirstLetterUpperCaseDirective,
    Directives.NoDblClickDirective,
    UserModalListComponent,
    OperatorModalListComponent,
    StatusLabelComponent,
    IndBlockedLabelComponent,
    IndAdjustmentLabelComponent,
    StatusAdjustmentLabelComponent,
    StatusCountLabelComponent,
    ContactNumberSupplierComponent,
    AddExchangeTaxComponent,
    AddMasiveExchangeTaxComponent,
    ContactNumberSuppliersMasiveComponent,
    UserSupplierMasiveComponent,
    Directives.DisableButtonOnSubmitDirective,
    Directives.AutoFocusDirective,
    ExcelExportButtonComponent,
    PurchaseOrderModalComponent,
    SuppliersCatalogModalComponent,
    FooterFormButtonsComponent,
    ProductCatalogModalComponent,
    CardProductComponent,
    BankAccountSuppliersModalComponent,
    DashboardLayaoutComponent,
    AutoCompleteUserSearchComponent,
    ListNumberIndicatorComponent,
    UserImageComponent,
    AreaModalComponent,
    TimerViewerComponent,
    SupplierCommonModalComponent,
    DataviewListComponent,
    ListTeamComponent,
    BranchofficeModalComponent,
    UpdaterButtonComponent,
    PercendIndConditionComponent,
    ResponsiveChartComponent,
    ModalCategoryComponent,
    AvatarGroupComponent,
    ReasonDialogComponent,
    SelectButtonOptionComponent,
    ReasonDialogComponent,
    CheckboxTableSelectorComponent,
    TelerikReportModalComponent
  ],
  providers: [NgxImageCompressService]
})
export class CommonAppModule { }
