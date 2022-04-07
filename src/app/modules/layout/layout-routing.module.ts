import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LayoutComponent } from './layout/layout.component';
import { CompaniesListComponent } from '../masters/companies/companies-list/companies-list.component';
import { AttributeagrupationListComponent } from '../masters-mpc/attribute-agrupation/attributeagrupation-list/attributeagrupation-list.component';
import { TypeofpartsListComponent } from '../masters-mpc/parts-types/typeofparts-list/typeofparts-list.component';
import { ChangePasswordComponent } from '../security/users/change-password/change-password.component';
import { PackagingpresentationListComponent } from '../masters-mpc/packaging-presentation/packagingpresentation-list/packagingpresentation-list.component';
import { ProductorigintypeListComponent } from '../masters-mpc/product-origin-type/productorigintype-list/productorigintype-list.component';
import { ValidationRangeComponent } from '../masters-mpc/validation-range/validation-range/validation-range.component';
import { MultimediaUseComponent } from '../masters-mpc/multimedia-use/multimedia-use/multimedia-use.component';
import { CategoryListComponent } from '../masters-mpc/categories/category-list/category-list.component';
import { ClassificationComponent } from '../masters-mpc/classifications/classification/classification.component';
import { GroupingunitmeasureComponent } from '../masters-mpc/grouping-unit-measure/groupingunitmeasure/groupingunitmeasure.component';
import { GtintypeComponent } from '../masters-mpc/gtin-type/gtintype/gtintype.component';
import { MeasurementunitsListComponent } from '../masters-mpc/measurement-units/measurementunits-list/measurementunits-list.component';
import { BrandsListComponent } from '../masters/brand/brands-list/brands-list.component';
import { CountriesListComponent } from '../masters/country/countries-list/countries-list.component';
import { PortListComponent } from '../masters/port/port-list/port-list.component';
import { CoinsListComponent } from '../masters/coin/coins-list/coins-list.component';
import { DeviceTypeListComponent } from '../masters/device-types/device-type-list/device-type-list.component';
import { BranchofficesListComponent } from '../masters/branchoffice/branchoffices-list/branchoffices-list.component';
import { MotiveListComponent } from '../masters/motives/motive/motive-list/motive-list.component';
import { MotivesTypeListComponent } from '../masters/motives/motives-type/motives-type-list/motives-type-list.component';
import { DeviceListComponent } from '../masters/device/device-list/device-list.component';
import { PriceGroupingListComponent } from '../masters/price-grouping/price-grouping-list/price-grouping-list.component';
import { TaxeTypeApplicationListComponent } from '../masters/taxe-type-application/taxe-type-application-list/taxe-type-application-list.component';
import { AreaListComponent } from '../masters/area/area-list/area-list.component';
import { WastageListComponent} from '../masters-mpc/wastage/wastage-list/wastage-list.component';
import { DescriptionListComponent} from '../masters-mpc/description-type/description-list/description-list.component'
import { TaxListComponent } from '../masters/taxes/tax-list/tax-list.component';
import { BankListComponent } from '../masters/bank/banks-list/banks-list.component';
import { InsertTypeListComponent} from '../masters-mpc/insert-type/insert-type-list/insert-type-list.component';
import { ProductAssociationListComponent } from '../masters-mpc/product-association/product-association-list/product-association-list.component'
import { StateListComponent } from '../masters/state/state-list/states-list.component';
import { TaxRateListComponent } from '../masters/tax-rate/tax-rate-list/tax-rate-list.component';
import { UseofpackagingListComponent } from '../masters-mpc/use-of-packaging/useofpackaging-list/useofpackaging-list.component';
import { PriceTypeListComponent } from '../masters/price-type/price-type-list/price-type-list.component';
import { PaymentMethodListComponent } from '../masters/payment-method/payment-method-list/payment-method-list.component';
import { DocumentTypeListComponent } from '../masters/document-types/document-type-list/document-type-list.component';
import { DistrictListComponent } from '../masters/district/district-list/district-list.component';
import { AttributeListComponent } from '../masters-mpc/attribute/attribute-list/attribute-list.component';
import { AttributeOptionListComponent } from '../masters-mpc//attribute-option/attribute-option-list/attribute-option-list.component';
import { CityListComponent } from '../masters/city/city-list/city-list.component';
import { LedgerAccountCategoryListComponent } from '../financial/LedgerAccountCategory/ledger-account-category-list/ledger-account-category-list.component';
import { NormativesListComponent } from '../masters-mpc/normatives/normatives-list/normatives-list.component';
import { SupplierListComponent } from '../masters/supplier/supplier-list/supplier-list.component';
import { SupplierPanelComponent } from '../masters/supplier/supplier-panel/supplier-panel.component';
import { PaymentConditionsListComponent } from '../masters/payment-conditions/payment-conditions-list/payment-conditions-list.component';
import { SupplierClasificationListComponent } from '../masters/supplierclasification/supplier-clasification-list/supplier-clasification-list.component';
import { MasterVehicleListComponent } from '../tms/master-vehicle/master-vehicle-list/master-vehicle-list.component';
import { MasterDriverListComponent } from '../tms/master-driver/master-driver-list/master-driver-list.component';
import { MasterRouteListComponent } from '../tms/master-route/master-route-list/master-route-list.component';
import { MerchandiseTransfersListComponent } from '../tms/merchandise-transfers/merchandise-transfers-list/merchandise-transfers-list.component';
import {DashboardGeneralComponent} from "./dashboard/dashboard-general/dashboard-general.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children:
    [
      { path: '', component: LandingPageComponent },
      { path: 'company-list', component: CompaniesListComponent },
      { path: 'countries-list', component: CountriesListComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'port-list', component: PortListComponent },
      { path: 'coins-list', component: CoinsListComponent },
      { path: 'company-list', component: CompaniesListComponent },
      { path: 'attributeagrupation-list', component: AttributeagrupationListComponent },
      { path: 'category-list', component: CategoryListComponent },
      { path: 'measurementunits-list', component: MeasurementunitsListComponent },
      { path: 'typeofparts-list', component: TypeofpartsListComponent },
      { path: 'classification-list', component: ClassificationComponent },
      { path: 'groupingunitmeasure', component: GroupingunitmeasureComponent },
      { path: 'countries-list', component: CountriesListComponent },
      { path: 'multimediause', component: MultimediaUseComponent },
      { path: 'packagingpresentation-list', component: PackagingpresentationListComponent },
      { path: 'productorigintype-list', component: ProductorigintypeListComponent },
      { path: 'validationrange', component: ValidationRangeComponent },
      { path: 'productorigintype-list', component: ProductorigintypeListComponent },
      { path: 'gtintype', component: GtintypeComponent },
      { path: 'classification-list', component: ClassificationComponent },
      { path: 'devicetype-list', component: DeviceTypeListComponent },
      { path: 'branchoffices-list', component: BranchofficesListComponent },
      { path: 'motives-list', component: MotiveListComponent },
      { path: 'motives-type-list', component: MotivesTypeListComponent },
      { path: 'pricegrouping-list', component: PriceGroupingListComponent },
      { path: 'device-list', component: DeviceListComponent },
      { path: 'area-list', component: AreaListComponent },
      { path: 'taxetypeapplication-list', component: TaxeTypeApplicationListComponent },
      { path: 'banks-list', component: BankListComponent },
      { path: 'pricegrouping-list', component: PriceGroupingListComponent },
      { path: 'taxes-list', component: TaxListComponent },
      { path: 'wastage-list', component: WastageListComponent },
      { path: 'description-list', component: DescriptionListComponent },
      { path: 'insert-type-list', component: InsertTypeListComponent },
      { path: 'brands-list', component:BrandsListComponent },
      { path: 'states-list', component: StateListComponent },
      { path: 'product-association-list', component: ProductAssociationListComponent },
      { path: 'taxrate-list', component: TaxRateListComponent },
      { path: 'useofpackaging-list', component: UseofpackagingListComponent },
      { path: 'pricetype-list', component: PriceTypeListComponent },
      { path: 'payment-method-list', component: PaymentMethodListComponent },      
      { path: 'document-type-list', component: DocumentTypeListComponent },
      { path: 'district-list', component: DistrictListComponent },
      { path: 'attribute-list', component: AttributeListComponent },
      { path: 'attribute-option-list', component: AttributeOptionListComponent },
      { path: 'city-list', component: CityListComponent },                      
      { path: 'ledgerAccountCategory-list', component: LedgerAccountCategoryListComponent },
      { path: 'normative-list', component: NormativesListComponent },
      { path: 'supplier-list', component: SupplierListComponent },
      { path: 'supplier-panel/:id', component: SupplierPanelComponent },
      { path: 'master-driver-list', component: MasterDriverListComponent },
      { path: 'payment-conditions-list', component: PaymentConditionsListComponent },
      { path: 'suppliers-clasification-list', component: SupplierClasificationListComponent },
      { path: 'master-vehicle-list', component: MasterVehicleListComponent },       
      { path: 'master-route-list', component: MasterRouteListComponent },
      { path: 'merchandise-transfers-list', component: MerchandiseTransfersListComponent },
      { path: 'dashboard', component: DashboardGeneralComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
