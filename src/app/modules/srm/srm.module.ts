import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { SuppliercatalogComponent } from './manage-supplier-catalog/supplier-catalog/suppliercatalog/suppliercatalog.component';
import { SuppliercatalogFilterPanelComponent } from './manage-supplier-catalog/supplier-catalog/suppliercatalog-filter-panel/suppliercatalog-filter-panel.component';
import { AddacquaintanceDialogComponent } from './manage-supplier-catalog/supplier-catalog/addacquaintance-dialog/addacquaintance-dialog.component';
import { ModalsupplierListComponent } from './modalsupplier/modalsupplier-list/modalsupplier-list.component';
import { TimelineListComponent } from './manage-supplier-catalog/timeline/timeline-list/timeline-list.component';
import { SupplierreasonDialogComponent } from './manage-supplier-catalog/supplier-catalog/supplierreason-dialog/supplierreason-dialog.component';
import { WizardproductcompComponent } from './manage-supplier-catalog/supplier-catalog/wizardproductcomp/wizardproductcomp.component';
import { WizardsupplierComponent } from './manage-supplier-catalog/supplier-catalog/wizardsupplier/wizardsupplier.component';
import { SupplierFilterComponent } from './manage-supplier-catalog/supplier-catalog/supplier-filter/supplier-filter.component';
import { WizardproductsComponent } from './manage-supplier-catalog/supplier-catalog/wizardproducts/wizardproducts.component';
import { ProductFilterComponent } from './manage-supplier-catalog/supplier-catalog/product-filter/product-filter.component';
import { WizardsupplierproductsComponent } from './manage-supplier-catalog/supplier-catalog/wizardsupplierproducts/wizardsupplierproducts.component';
import { FilterPurchaseOrderComponent } from './purchase-order-viewer/filter-purchase-order/filter-purchase-order.component';
import { PurchaseListComponent } from './purchase-order-viewer/purchase-list/purchase-list.component';
import { SuppliermodalComponent } from './purchase-order-viewer/suppliermodal/suppliermodal.component';
import { FilterSuppliermodalComponent } from './purchase-order-viewer/filter-suppliermodal/filter-suppliermodal.component';
import { ViewerocDocumentsTabpanelComponent } from './vieweroc-supplier/vieweroc-documents-tabpanel/vieweroc-documents-tabpanel.component';
import { ViewerOrdencompraComponent } from './vieweroc-supplier/viewer-ordencompra/viewer-ordencompra.component';
import { OcFilterComponent } from './vieweroc-supplier/viewer-ordencompra/oc-filter/oc-filter.component';
import { ModalOperatorComponent } from './shared/common/components/modal-operator/modal-operator.component';
import { WizardPurchaseOrderComponent } from './purchase-order/wizard-purchase-order/wizard-purchase-order.component';
import { CdTimerModule } from 'angular-cd-timer';
import { PurchaseHeaderComponent } from './purchase-order/purchase-header/purchase-header.component';
import { PurchaseOrderProductsComponent } from './purchase-order/purchase-order-detail/purchase-order-products/purchase-order-products.component';
import { ModalSupplierComponent } from './shared/common/components/modal-supplier/modal-supplier.component';
import { ModalContactComponent } from './shared/common/components/modal-contact/modal-contact.component';
import { SupplierRateComponent } from './shared/common/components/supplier-rate/supplier-rate.component';
import { OperatorComponent } from './purchase-order/purchase-header/operator/operator.component';
import { PurchaseOrderProductPanelComponent } from './purchase-order/purchase-order-detail/purchase-order-product-panel/purchase-order-product-panel.component';
import { PurchaseOrderTotalResumeComponent } from './purchase-order/purchase-order-detail/purchase-order-total-resume/purchase-order-total-resume.component';
import { PurchaseOrderPriceComponent } from './purchase-order/purchase-order-detail/purchase-order-price/purchase-order-price.component';
import { PurchaseOrderTotalProductComponent } from './purchase-order/purchase-order-detail/purchase-order-total-product/purchase-order-total-product.component';
import { PurchaseOrderProductEditComponent } from './purchase-order/purchase-order-detail/purchase-order-product-edit/purchase-order-product-edit.component';
import { TaxableDeductibleComponent } from './shared/common/components/taxable-deductible/taxable-deductible.component';
import { TaxableComponent } from './shared/common/components/taxable-deductible/taxable/taxable.component';
import { DeductibleComponent } from './shared/common/components/taxable-deductible/deductible/deductible.component';
//import { TaxableDeductibleProductComponent } from './purchase-order/purchase-order-detail/taxable-deductible-product/taxable-deductible-product.component';
import { ModalMasiveConfigurationComponent } from './shared/common/modal-masive-configuration/modal-masive-configuration.component';
import { TaxableDeductibleProductComponent } from './purchase-order/purchase-order-detail/taxable-deductible-product/taxable-deductible-product.component';
import { SrmRoutingModule } from './srm-routing.module';
import { PurchaseOrderTimelineComponent } from './purchase-order/purchase-order-timeline/purchase-order-timeline.component';
import { TaxableDeductibleEditComponent } from './purchase-order/purchase-order-detail/taxable-deductible-product/taxable-deductible-edit/taxable-deductible-edit.component';
import { TaxDedHeaderComponent } from './shared/common/components/tax-ded-header/tax-ded-header.component';
import { DeductibleHeaderComponent } from './shared/common/components/tax-ded-header/deductible-header/deductible-header.component';
import { TaxableHeaderComponent } from './shared/common/components/tax-ded-header/taxable-header/taxable-header.component';
import { TaxDedHeaderEditComponent } from './shared/common/components/tax-ded-header/tax-ded-header-edit/tax-ded-header-edit.component';
import { ReceptionMainComponent } from './reception/reception-main/reception-main/reception-main.component';
import { ReceptionHeaderComponent } from './reception/reception-header/reception-header/reception-header.component';
import { ReceptionTabmenuComponent } from './reception/reception-tabmenu/reception-tabmenu/reception-tabmenu.component';
import { ReceptionGeneralDataComponent } from './reception/reception-tabmenu/reception-general-data/reception-general-data/reception-general-data.component';
import { ReceptionComponent } from './reception/reception-tabmenu/reception/reception.component';
import { ReceptionValidationComponent } from './reception/reception-tabmenu/reception-validation/reception-validation.component';
import { ReceptionSupplierComponent } from './reception/reception-tabmenu/reception-general-data/reception-general-data/reception-supplier/reception-supplier.component';
import { ReceptionPaymentNegotationComponent } from './reception/reception-tabmenu/reception-general-data/reception-general-data/reception-payment-negotation/reception-payment-negotation.component';
import { ReceptionCalculationBasisComponent } from './reception/reception-tabmenu/reception-general-data/reception-general-data/reception-calculation-basis/reception-calculation-basis.component';
import { ReceptionTransportComponent } from './reception/reception-tabmenu/reception-general-data/reception-general-data/reception-transport/reception-transport.component';
import { ProductListComponent } from './reception/reception-tabmenu/reception/products/product-list/product-list.component';
import { ProductDetailComponent } from './reception/reception-tabmenu/reception/products/product-detail/product-detail.component';
import { ModalReceptionComponent } from './shared/common/components/modal-reception/modal-reception.component';
import { PurchaseOrderDetailComponent } from './purchase-order-viewer/purchase-order-detail/purchase-order-detail.component';
import { LotComponent } from './shared/common/components/reception/lot/lot.component';
import { ModalWeigthTaraComponent } from './shared/common/components/reception/modal-weigth-tara/modal-weigth-tara.component';
import { LotListComponent } from './shared/common/components/reception/lot-list/lot-list.component';
import { ReceptionTotalProductsComponent } from './reception/reception-tabmenu/reception-validation/reception-total-products/reception-total-products.component';
import { TaxDedReceptionComponent } from './shared/common/components/reception/tax-ded-reception/tax-ded-reception.component';
import { TaxComponent } from './shared/common/components/reception/tax-ded-reception/tax/tax.component';
import { DedComponent } from './shared/common/components/reception/tax-ded-reception/ded/ded.component';
import { ModalDiferencesReceptionComponent } from './shared/common/components/reception/modal-diferences-reception/modal-diferences-reception.component';
import { PurchaseOrderReceptionComponent } from './reception/reception-tabmenu/reception/products/purchase-order-reception/purchase-order-reception.component';
import { ProductDetailLoteComponent } from './reception/reception-tabmenu/reception/products/product-detail-lote/product-detail-lote.component';
import { ProductPanelComponent } from './reception/reception-tabmenu/reception-validation/product-panel/product-panel.component';
// import { ReceptionTotalProductComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/reception-total-product/reception-total-product.component';
import { ProductPanelPricesComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/product-panel-prices/product-panel-prices.component';
import { LotEditComponent } from './reception/reception-tabmenu/reception/products/product-detail-lote/lot-edit/lot-edit.component';
import { DashboardGeneralSrmComponent } from './dashboard/dashboard-general-srm/dashboard-general-srm.component';
import { DashboardSupplierComponent } from './vieweroc-supplier/dashboard/dashboard-supplier/dashboard-supplier.component';
import { ModalSalesComponent } from './vieweroc-supplier/dashboard/modal-sales/modal-sales.component';
import { ModalSupplierPerfilComponent } from './dashboard/dashboard-modal/modal-supplier-perfil/modal-supplier-perfil.component';
import { ReasonCancelComponent } from './purchase-order/wizard-purchase-order/reason-cancel/reason-cancel.component';
import { ModalSupplierPerfilInfoComponent } from './dashboard/dashboard-modal/modal-supplier-perfil-info/modal-supplier-perfil-info.component';
import { WeightInstrumentListComponent } from './weight-instrument/weight-instrument-list/weight-instrument-list.component';
import { WeightInstrumentFiltersComponent } from './weight-instrument/weight-instrument-filters/weight-instrument-filters.component';
import { WeightInstrumentAddComponent } from './weight-instrument/weight-instrument-add/weight-instrument-add.component';
import { ReceptionFiltersComponent } from './reception-viewer/reception-filters/reception-filters.component';
import { ReceptionListComponent } from './reception-viewer/reception-list/reception-list.component';
import { PurchaseOrderTopComponent } from './purchase-order-viewer/purchase-order-top/purchase-order-top.component';
import { ModalOrderPointComponent } from './dashboard/dashboard-modal/modal-order-point/modal-order-point.component';
import { PurchaseOrderReceivedListComponent } from './purchase-order/purchase-order-received-list/purchase-order-received-list.component';
import { ReceptionValidationProductsComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/reception-validation-products.component';
import { DistributedPurchaseOrderComponent } from './purchase-order/distributed-purchase-order/distributed-purchase-order.component';
import { DistributedProductPanelComponent } from './purchase-order/distributed-purchase-order/distributed-product-panel/distributed-product-panel.component';
import { ProductReturnFiltersComponent } from './product-return/product-return-viewer/product-return-filters/product-return-filters.component';
import { ProductReturnListComponent } from './product-return/product-return-viewer/product-return-list/product-return-list.component';
import { ProductReturnTopComponent } from './product-return/product-return-viewer/product-return-top/product-return-top.component';
import { ProductReturnViewerComponent } from './product-return/product-return-viewer/product-return-viewer.component';
import { ReceptionTimelineComponent } from './reception/reception-timeline/reception-timeline.component';
import { ReasonCancelReceptionComponent } from './shared/common/components/reception/reason-cancel-reception/reason-cancel-reception.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ModalLowstockSupplierComponent } from './shared/common/components/modal-lowstock-supplier/modal-lowstock-supplier.component';
import { ReceptionChildComponent } from './reception-viewer/reception-child/reception-child.component';
import { ReceptionChildHeaderComponent } from './reception-viewer/reception-child/reception-child-header/reception-child-header.component';
import { ReceptionChildProductsComponent } from './reception-viewer/reception-child/reception-child-products/reception-child-products.component';
import { TotalProductsComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/total-products/total-products.component';
import { TaxableDeductibleValidationComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/taxable-deductible-validation/taxable-deductible-validation.component';
import { TaxDedValComponent } from './shared/common/components/reception-validation/tax-ded-val/tax-ded-val.component';
import { TaxValComponent } from './shared/common/components/reception-validation/tax-ded-val/tax-val/tax-val.component';
import { DexValComponent } from './shared/common/components/reception-validation/tax-ded-val/dex-val/dex-val.component';
import { TaxEditComponent } from './reception/reception-tabmenu/reception-validation/reception-validation-products/taxable-deductible-validation/tax-edit/tax-edit.component';
import { ReportOrderComponent } from './dashboard/report-order/report-order.component';
import { ModalChildReceptionComponent } from './shared/common/components/modal-child-reception/modal-child-reception.component';
import { WizMasivTaxComponent } from './shared/common/components/reception-validation/taxded-headerValidation/wiz-masiv-tax/wiz-masiv-tax.component';
import { SelectedProdComponent } from './shared/common/components/reception-validation/taxded-headerValidation/wiz-masiv-tax/selected-prod/selected-prod.component';
import { AddTaxComponent } from './shared/common/components/reception-validation/taxded-headerValidation/wiz-masiv-tax/add-tax/add-tax.component';
import { ConfirmedSelectionComponent } from './shared/common/components/reception-validation/taxded-headerValidation/wiz-masiv-tax/confirmed-selection/confirmed-selection.component';
import { TaxheaderPurchaseComponent } from './shared/common/components/reception-validation/taxded-headerValidation/taxheader-purchase/taxheader-purchase.component';
import { DedheaderPurchaseComponent } from './shared/common/components/reception-validation/taxded-headerValidation/dedheader-purchase/dedheader-purchase.component';
import { TaxdedheaderPurchaseComponent } from './shared/common/components/reception-validation/taxded-headerValidation/taxdedheader-purchase/taxdedheader-purchase.component';
import { ViewTaxDedPurchaseComponent } from './shared/common/components/reception-validation/taxded-headerValidation/view-tax-ded-purchase/view-tax-ded-purchase.component';
import { WizMassiveDedComponent } from './shared/common/components/reception-validation/ded-massive/wiz-massive-ded/wiz-massive-ded.component';
import { AddDedComponent } from './shared/common/components/reception-validation/ded-massive/wiz-massive-ded/add-ded/add-ded.component';
import { SelectionConfirmedComponent } from './shared/common/components/reception-validation/ded-massive/wiz-massive-ded/selection-confirmed/selection-confirmed.component';
import { ConsingmentInvoiceFilterComponent } from './consingment-Invoice/consingment-invoice-filter/consingment-invoice-filter.component';
import { ConsignmentIvoiceListComponent } from './consingment-Invoice/consignment-ivoice-list/consignment-ivoice-list.component';
import { ModalConsignmentinvoiceComponent } from './shared/common/components/consigmentinvoice/modal-consignmentinvoice/modal-consignmentinvoice.component';
import { ConsigmentInvoicePanelComponent } from './consingment-Invoice/consigment-invoice-panel/consigment-invoice-panel.component';
import { ConsignmentInvoiceHeaderComponent } from './consingment-Invoice/consigment-invoice-panel/consignment-invoice-header/consignment-invoice-header.component';
import { InvoiceTimelineComponent } from './consingment-Invoice/consigment-invoice-panel/invoice-timeline/invoice-timeline.component';
import { ReportsModule } from "../reports/reports.module";

@NgModule({
  declarations: [SuppliercatalogComponent,
     SuppliercatalogFilterPanelComponent,
     AddacquaintanceDialogComponent,
     ModalsupplierListComponent,
     TimelineListComponent,
     SupplierreasonDialogComponent,
     WizardproductcompComponent,
     WizardsupplierComponent,
     SupplierFilterComponent,
     WizardproductsComponent,
     ProductFilterComponent,
     WizardsupplierproductsComponent,
     FilterPurchaseOrderComponent,
     PurchaseListComponent,
     SuppliermodalComponent,
     FilterSuppliermodalComponent,
     ViewerocDocumentsTabpanelComponent,
     ViewerOrdencompraComponent,
     OcFilterComponent,
     ModalOperatorComponent,
     WizardPurchaseOrderComponent,
     PurchaseHeaderComponent,
     ModalSupplierComponent,
     ModalContactComponent,
     SupplierRateComponent,
     PurchaseOrderProductsComponent,
     PurchaseOrderProductPanelComponent,
     PurchaseOrderTotalResumeComponent,
     PurchaseOrderPriceComponent,
     PurchaseOrderTotalProductComponent,
     PurchaseOrderProductEditComponent,
     OperatorComponent,
     TaxableDeductibleComponent,
     TaxableComponent,
     DeductibleComponent,
     TaxableDeductibleProductComponent,
     ModalMasiveConfigurationComponent,
     PurchaseOrderTimelineComponent,
     TaxableDeductibleEditComponent,
     TaxDedHeaderComponent,
     DeductibleHeaderComponent,
     TaxableHeaderComponent,
     TaxDedHeaderEditComponent,
     WeightInstrumentListComponent,
     WeightInstrumentFiltersComponent,
     WeightInstrumentAddComponent,
     DeductibleComponent,
     ReceptionFiltersComponent,
     ReceptionListComponent,
     ReceptionMainComponent,
     ReceptionHeaderComponent,
     ReceptionTabmenuComponent,
     ReceptionGeneralDataComponent,
     ReceptionComponent,
     ReceptionValidationComponent,
     ReceptionSupplierComponent,
     ReceptionPaymentNegotationComponent,
     ReceptionCalculationBasisComponent,
     ReceptionTransportComponent,
     ProductListComponent,
     ProductDetailComponent,
     ModalReceptionComponent,
     LotComponent,
     LotListComponent,
     ModalWeigthTaraComponent,
     PurchaseOrderDetailComponent,
     ModalDiferencesReceptionComponent,
     PurchaseOrderReceptionComponent,
     ReceptionTotalProductsComponent,
     TaxDedReceptionComponent,
     TaxComponent,
     DedComponent,
     ReceptionValidationProductsComponent,
     ProductPanelComponent,
    //  ReceptionTotalProductComponent,
     ProductPanelPricesComponent,
     ProductDetailLoteComponent,
     LotEditComponent,
     PurchaseOrderTimelineComponent,
     TaxableDeductibleEditComponent,
     TaxDedHeaderComponent,
     DeductibleHeaderComponent,
     TaxableHeaderComponent,
     TaxDedHeaderEditComponent,
     DashboardGeneralSrmComponent,
     DashboardSupplierComponent,
     ModalSalesComponent,
     ModalSupplierPerfilComponent,
     ReasonCancelComponent,
     PurchaseOrderTimelineComponent,
     TaxableDeductibleEditComponent,
     TaxDedHeaderComponent,
     DeductibleHeaderComponent,
     TaxableHeaderComponent,
     TaxDedHeaderEditComponent,
     DistributedPurchaseOrderComponent,
     DistributedProductPanelComponent,
     ModalOrderPointComponent ,
     ModalReceptionComponent,
     PurchaseOrderReceivedListComponent,
     PurchaseOrderTopComponent,
     ModalOrderPointComponent,
     ModalSupplierPerfilInfoComponent,
     ReceptionValidationProductsComponent,
     ProductReturnFiltersComponent,
     ProductReturnListComponent,
     ProductReturnTopComponent,
     ProductReturnViewerComponent,
     ReasonCancelReceptionComponent,
     ReceptionChildComponent,
     ReceptionChildHeaderComponent,
     ReceptionChildProductsComponent,
     ReceptionValidationProductsComponent,
     ReceptionTimelineComponent,
     TotalProductsComponent,
     TaxableDeductibleValidationComponent,
     TaxDedValComponent,
     TaxValComponent,
     DexValComponent,
     TaxEditComponent,  
     ModalLowstockSupplierComponent,     
     ModalSalesComponent,
     ReportOrderComponent,
     ModalChildReceptionComponent,
     WizMasivTaxComponent,
     SelectedProdComponent,
     AddTaxComponent,
     ConfirmedSelectionComponent,
     WizMassiveDedComponent,
     AddDedComponent,
     SelectionConfirmedComponent,
     TaxheaderPurchaseComponent,
     DedheaderPurchaseComponent,
     TaxdedheaderPurchaseComponent,
     ViewTaxDedPurchaseComponent,
     ConsingmentInvoiceFilterComponent,
     ConsignmentIvoiceListComponent,
     ModalConsignmentinvoiceComponent,
     ConsigmentInvoicePanelComponent,
     ConsignmentInvoiceHeaderComponent,
     InvoiceTimelineComponent
],
  imports:[
    SrmRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    CdTimerModule,
    PrimengModule,
    ReportsModule
  ],
  exports:
  [
    SuppliermodalComponent,
    ModalSupplierPerfilInfoComponent
  ]
})

export class SrmModule { }
