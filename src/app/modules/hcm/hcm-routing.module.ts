import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { LayoutComponent } from '../layout/layout/layout.component';
import { CompaniesCatalogListComponent } from './companies-catalog/companies-catalog-list/companies-catalog-list.component';
import { CompaniesGeneralSectionComponent } from './companies-general-section/companies-generalsection/companies-generalsection.component';
import { SocioeconomicInformationTabComponent } from './socioeconomic-information/socioeconomic-information-tab/socioeconomic-information-tab.component';
import { CompaniesEmployeeListComponent } from './companies-payroll/companies-employee-list/companies-employee-list.component';
import { CompaniesPayrollInformationComponent } from './companies-payroll/companies-payroll-information/companies-payroll-information.component';
import { IslrDiscountTabComponent } from './socioeconomic-information/islr-discount-tab/islr-discount-tab.component';
import { CompaniesPayrollPayrolldataComponent } from './companies-payroll/companies-payroll-payrolldata/companies-payroll-payrolldata.component';
import { CompaniesConceptsListComponent} from './companies-concepts/companies-concepts-list/companies-concepts-list.component';
import { CompaniesConceptsGeneralsectionMainComponent } from './companies-concepts/companies-concepts-generalsection-main/companies-concepts-generalsection-main.component';
import {  PayrollCalendarListComponent } from './payroll-calendar/payroll-calendar-list/payroll-calendar-list.component';
import { PayrollVariablesListComponent } from './payroll-variables-list/payroll-variables-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalaryTabComponent } from './salary/salary-tab/salary-tab.component';
import { HolidayTabComponent } from './holiday/holiday-tab/holiday-tab.component';
import { MstgSalarytypesComponent } from './hcm-masters/mstg-salarytypes/mstg-salarytypes.component';
import { IncidentsTabComponent } from './incidents/incidents-tab/incidents-tab.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanDetailComponent } from './loan/loan-detail/loan-detail.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'companiescatalog-list', component: CompaniesCatalogListComponent },
      { path: 'companies-concepts-list', component: CompaniesConceptsListComponent },
      { path: 'companiesemployee-list', component: CompaniesEmployeeListComponent },
      { path: 'companies-payroll-information/:id', component: CompaniesPayrollInformationComponent },
      { path: 'companies-payroll-payrolldata/:id', component: CompaniesPayrollPayrolldataComponent },
      { path: 'companies-generalsection/:id', component: CompaniesGeneralSectionComponent },
      { path: 'companies-concepts-generalsection/:id', component: CompaniesConceptsGeneralsectionMainComponent },
      { path: 'isrl-discount-tab/:rel', component: IslrDiscountTabComponent },
      { path: 'socioeconomic-information-tab/:emp/:rel', component: SocioeconomicInformationTabComponent },
      { path: 'payroll-calendar-list', component:  PayrollCalendarListComponent },
      { path: 'payroll-variables-list', component:  PayrollVariablesListComponent },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'salary', component: SalaryTabComponent},
      { path: 'holiday', component: HolidayTabComponent},
      { path: 'mstg-salarytypes', component: MstgSalarytypesComponent},
      { path: 'incidents', component: IncidentsTabComponent},
      { path: 'loan/loan-list', component: LoanListComponent },
      { path: 'loan-detail-generalsection/:id', component: LoanDetailComponent },


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HcmRoutingModule { }
