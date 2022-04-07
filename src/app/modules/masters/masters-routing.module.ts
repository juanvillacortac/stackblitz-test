import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './companies/companies-list/companies-list.component';
import { CountriesListComponent } from './country/countries-list/countries-list.component';
import { PortListComponent } from './port/port-list/port-list.component';
import { BrandsListComponent } from './brand/brands-list/brands-list.component';
import { CoinsListComponent } from './coin/coins-list/coins-list.component';
import { DeviceTypeListComponent } from './device-types/device-type-list/device-type-list.component';
import { BranchofficesListComponent } from './branchoffice/branchoffices-list/branchoffices-list.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { PriceGroupingListComponent } from './price-grouping/price-grouping-list/price-grouping-list.component';
import { AreaListComponent } from './area/area-list/area-list.component';
import { CostCenterListComponent } from './cost-center/cost-center-list/cost-center-list.component';
import { LayoutComponent } from '../layout/layout/layout.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { SupplierPanelComponent } from './supplier/supplier-panel/supplier-panel.component';
import { PaymentConditionsListComponent } from './payment-conditions/payment-conditions-list/payment-conditions-list.component';
import { TaxPlanListComponent } from './tax-plan/tax-plan-list/tax-plan-list.component';
import { BankAccountsListComponent } from './bank-accounts/bank-accounts-list/bank-accounts-list.component';
import {MotiveListComponent} from "./motives/motive/motive-list/motive-list.component";
import {MotivesTypeListComponent} from "./motives/motives-type/motives-type-list/motives-type-list.component";
import {TaxeTypeApplicationListComponent} from "./taxe-type-application/taxe-type-application-list/taxe-type-application-list.component";
import {BankListComponent} from "./bank/banks-list/banks-list.component";
import {TaxListComponent} from "./taxes/tax-list/tax-list.component";
import {InsertTypeListComponent} from "../masters-mpc/insert-type/insert-type-list/insert-type-list.component";
import {StateListComponent} from "./state/state-list/states-list.component";
import {TaxRateListComponent} from "./tax-rate/tax-rate-list/tax-rate-list.component";
import {PriceTypeListComponent} from "./price-type/price-type-list/price-type-list.component";
import {PaymentMethodListComponent} from "./payment-method/payment-method-list/payment-method-list.component";
import {DocumentTypeListComponent} from "./document-types/document-type-list/document-type-list.component";
import {DistrictListComponent} from "./district/district-list/district-list.component";
import {CityListComponent} from "./city/city-list/city-list.component";
import {LedgerAccountCategoryListComponent} from "../financial/LedgerAccountCategory/ledger-account-category-list/ledger-account-category-list.component";
import {SupplierClasificationListComponent} from "./supplierclasification/supplier-clasification-list/supplier-clasification-list.component";
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';

const routes: Routes = [
   { 
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'costcenter-list', component: CostCenterListComponent },
      { path: 'tax-plans', component: TaxPlanListComponent },
      { path: 'bank-accounts-list', component: BankAccountsListComponent },
 
  { path: 'company-list', component: CompaniesListComponent },
  { path: 'countries-list', component: CountriesListComponent },
  { path: 'port-list', component: PortListComponent },
  { path: 'brands-list', component: BrandsListComponent },
  { path: 'branchoffices-list', component: BranchofficesListComponent },
  { path: 'coins-list', component: CoinsListComponent },
  { path: 'device-list', component: DeviceListComponent },
  { path: 'devicetype-list', component: DeviceTypeListComponent },
  { path: 'pricegrouping-list', component: PriceGroupingListComponent },
  { path: 'area-list', component: AreaListComponent },
  { path: 'supplier-list', component: SupplierListComponent },
  { path: 'supplier-panel/:id', component: SupplierPanelComponent },
  { path: 'payment-conditions-list', component: PaymentConditionsListComponent },
  { path: 'motives-list', component: MotiveListComponent },
  { path: 'motives-type-list', component: MotivesTypeListComponent },
  { path: 'taxetypeapplication-list', component: TaxeTypeApplicationListComponent },
  { path: 'banks-list', component: BankListComponent },
  { path: 'taxes-list', component: TaxListComponent },
  { path: 'insert-type-list', component: InsertTypeListComponent},
  { path: 'states-list', component: StateListComponent},
  { path: 'taxrate-list', component: TaxRateListComponent },
  { path: 'pricetype-list', component: PriceTypeListComponent },
  { path: 'payment-method-list', component: PaymentMethodListComponent },
  { path: 'document-type-list', component: DocumentTypeListComponent },
  { path: 'district-list', component: DistrictListComponent },
  { path: 'city-list', component: CityListComponent },
  { path: 'ledgerAccountCategory-list', component: LedgerAccountCategoryListComponent },
  { path: 'suppliers-clasification-list', component: SupplierClasificationListComponent},
  { path: 'exchange-rate', component: ExchangeRateComponent }
]
},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
