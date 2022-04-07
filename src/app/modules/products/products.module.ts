import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { ProductcatalogComponent } from './product-catalog/productcatalog/productcatalog.component';
import { ProductcatalogFilterPanelComponent } from './product-catalog/productcatalog-filter-panel/productcatalog-filter-panel.component';
import { MenuComponent } from './common-mpc/menu/menu.component';
import { GeneralSectionComponent } from './product-general-section/general-section/general-section.component';
import { BarproductComponent } from './common-mpc/barproduct/barproduct.component';
import { ProductComplementaryComponent } from './product-complementary/product-complementary.component';
import { BarcodePanelComponent } from './product-general-section/barcode-panel/barcode-panel.component';
import { WastagePanelComponent } from './product-general-section/wastage-panel/wastage-panel.component';
import { DurabililyPanelComponent } from './product-complementary/durabilily-panel/durabilily-panel.component';
import { DescriptionsPanelComponent } from './product-complementary/descriptions-panel/descriptions-panel.component';
import { PublicationsListComponent } from './publications-section/publications-list/publications-list.component';
import { PublicationsDialogComponent } from './publications-section/publications-dialog/publications-dialog.component';
import { ProductAssociationDetailComponent } from './product-association/product-association-detail/product-association-detail.component';
import { ProductDerivateAssociationPanelComponent } from './product-association/product-derivate-association-panel/product-derivate-association-panel.component';
import { ProductRelatedAssociationPanelComponent } from './product-association/product-related-association-panel/product-related-association-panel.component';
import { NewAssociationComponentComponent } from './product-association/product-component-association-panel/new-association-component/new-association-component.component';
import { ProductComponentAssociationPanelComponent } from './product-association/product-component-association-panel/product-component-association-panel.component';
import { NewAssociationRelatedComponent } from './product-association/product-related-association-panel/new-association-related/new-association-related.component';
import { ProductBranchOfficeTabpanelComponent } from './product-branch-office/product-branch-office-tabpanel/product-branch-office-tabpanel.component';
import { ProductBranchOfficeValidationFactorComponent } from './product-branch-office/product-branch-office-validation-factor/product-branch-office-validation-factor.component';
import { ProductBrachOfficePointOrderComponent } from './product-branch-office/product-brach-office-point-order/product-brach-office-point-order.component';
import { ProductBrachOfficePricesCostsComponent } from './product-branch-office/product-brach-office-prices-costs/product-brach-office-prices-costs.component';
import { ProductBrachOfficeIndicatorsComponent } from './product-branch-office/product-brach-office-indicators/product-brach-office-indicators.component';
import { ProductBrachOfficeInventoryComponent } from './product-branch-office/product-brach-office-inventory/product-brach-office-inventory.component';
import { NewValidationFactorComponent } from './product-branch-office/product-branch-office-validation-factor/new-validation-factor/new-validation-factor.component';
import { CommonAppModule } from '../common/common.module';
import { SpecificationDialogComponent } from './product-specification/specification-dialog/specification-dialog.component';
import { SpecificationsListComponent } from './product-specification/specifications-list/specifications-list.component';
import { QaListComponent } from './qa-section/qa-list/qa-list.component';
import { QaRegulationComponent } from './qa-section/qa-regulation/qa-regulation.component';
import { NewLotValidationFactorComponent } from './product-branch-office/product-branch-office-validation-factor/new-lot-validation-factor/new-lot-validation-factor.component';
import { LogisticdataMainComponent } from './logistic-data/logisticdata-main/logisticdata-main.component';
import { PackingDialogComponent } from './logistic-data/packing-dialog/packing-dialog.component';
import { NewPointOrderComponent } from './product-branch-office/product-brach-office-point-order/new-point-order/new-point-order.component';
import { NewLotPointOrderComponent } from './product-branch-office/product-brach-office-point-order/new-lot-point-order/new-lot-point-order.component';
import { NewPricesCostsComponent } from './product-branch-office/product-brach-office-prices-costs/new-prices-costs/new-prices-costs.component';
import { NewLotPricesCostsComponent } from './product-branch-office/product-brach-office-prices-costs/new-lot-prices-costs/new-lot-prices-costs.component';
import { NewIndicatorsComponent } from './product-branch-office/product-brach-office-indicators/new-indicators/new-indicators.component';
import { NewLotIndicatorsComponent } from './product-branch-office/product-brach-office-indicators/new-lot-indicators/new-lot-indicators.component';
import { ReasonPanelComponent } from './product-branch-office/product-brach-office-indicators/reason-panel/reason-panel.component';
import { NewExchangeRateComponent } from './product-branch-office/product-brach-office-prices-costs/new-exchange-rate/new-exchange-rate.component';
import { ProducttaxesMainComponent } from './product-taxes/producttaxes-main/producttaxes-main.component';
import { ProducttaxesDialogComponent } from './product-taxes/producttaxes-dialog/producttaxes-dialog.component';
import { MultimediaMainComponent } from './product-multimedia/multimedia-main/multimedia-main.component';
import { MultimediaFilterComponent } from './product-multimedia/multimedia-filter/multimedia-filter.component';
import { MultimediaDetailComponent } from './product-multimedia/multimedia-detail/multimedia-detail.component';
import { MultimediaNewComponent } from './product-multimedia/multimedia-new/multimedia-new.component';
import { MultimediaListComponent } from './product-multimedia/multimedia-list/multimedia-list.component';
import {HttpClientModule} from '@angular/common/http';
import { MultimediaNewUseComponent } from './product-multimedia/multimedia-new-use/multimedia-new-use.component';
import { ProductsBranchFilterComponent } from './viewer-products-branch/products-branch-filter/products-branch-filter.component';
import { ProductsBranchListComponent } from './viewer-products-branch/products-branch-list/products-branch-list.component';
import { TabsDialogComponent } from './viewer-products-branch/expresstab/tabs-dialog/tabs-dialog.component';
import { PackingComponent } from './viewer-products-branch/expresstab/packing/packing.component';
import { IndicatorsComponent } from './viewer-products-branch/expresstab/indicators/indicators.component';
import { LogisticDataComponent } from './viewer-products-branch/expresstab/logistic-data/logistic-data.component';
import { SuppliersComponent } from './viewer-products-branch/expresstab/suppliers/suppliers.component';
import { ValuesComponent } from './viewer-products-branch/expresstab/values/values.component';
import { AuditComponent } from './viewer-products-branch/expresstab/audit/audit.component';
import { DashboardMpcComponent } from './dashboard/dashboard-mpc/dashboard-mpc.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ModalProductsLifeComponent } from './dashboard/dashboard-modal/modal-products-life/modal-products-life.component';
import { ProductCatalogTopComponent } from './product-catalog/product-catalog-top/product-catalog-top.component';
import { PrimengModule } from '../primeng/primeng.module';
import { SuggestedPointComponent } from './product-branch-office/product-brach-office-point-order/suggested-point/suggested-point.component';
import { ProductDashboardComponent } from './product-dashboard/product-dashboard.component';

@NgModule({
  declarations: [ProductcatalogComponent,
    ProductcatalogFilterPanelComponent,
    MenuComponent,
    GeneralSectionComponent,
    BarproductComponent,
    ProductComplementaryComponent,
    BarcodePanelComponent,
    WastagePanelComponent,
    DurabililyPanelComponent,
    DescriptionsPanelComponent,
    PublicationsListComponent,
    PublicationsDialogComponent,
    ProductAssociationDetailComponent,
    ProductComponentAssociationPanelComponent,
    ProductDerivateAssociationPanelComponent,
    ProductRelatedAssociationPanelComponent,
    NewAssociationComponentComponent,
    NewAssociationRelatedComponent,
    ProductBranchOfficeTabpanelComponent,
    ProductBranchOfficeValidationFactorComponent,
    ProductBrachOfficePointOrderComponent,
    ProductBrachOfficePricesCostsComponent,
    ProductBrachOfficeIndicatorsComponent,
    ProductBrachOfficeInventoryComponent,
    NewValidationFactorComponent,
    SpecificationDialogComponent,
    SpecificationsListComponent,
    QaListComponent,
    QaRegulationComponent,
    NewLotValidationFactorComponent,
    LogisticdataMainComponent,
    PackingDialogComponent,
    NewPointOrderComponent,
    NewLotPointOrderComponent,
    NewPricesCostsComponent,
    NewLotPricesCostsComponent,
    NewIndicatorsComponent,
    NewLotIndicatorsComponent,
    ReasonPanelComponent,
    NewExchangeRateComponent,
    ProducttaxesMainComponent,
    ProducttaxesDialogComponent,
    ProductsBranchFilterComponent,
    ProductsBranchListComponent,
    TabsDialogComponent,
    PackingComponent,
    IndicatorsComponent,
    LogisticDataComponent,
    SuppliersComponent,
    ValuesComponent,
    AuditComponent,
    MultimediaMainComponent,
    MultimediaFilterComponent,
    MultimediaDetailComponent,
    MultimediaNewComponent,
    MultimediaListComponent,
    MultimediaNewUseComponent,
    DashboardMpcComponent,
    ModalProductsLifeComponent,
    ProductCatalogTopComponent,
    SuggestedPointComponent,
    ProductDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    FormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    PrimengModule
  ]
})
export class ProductsModule { }
