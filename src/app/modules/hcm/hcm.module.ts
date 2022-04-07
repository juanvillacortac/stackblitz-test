import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcmRoutingModule } from './hcm-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { CompaniesCatalogListComponent } from './companies-catalog/companies-catalog-list/companies-catalog-list.component';
import { CompaniesCatalogFilterComponent } from './companies-catalog/companies-catalog-filter/companies-catalog-filter.component';
import { CompaniesCatalogEditDialogComponent } from './companies-catalog/companies-catalog-edit-dialog/companies-catalog-edit-dialog.component';
import { CompaniesGeneralSectionComponent } from './companies-general-section/companies-generalsection/companies-generalsection.component';
import { CompanybarComponent } from './companies-general-section/companybar/companybar.component';
import { CompaniesGeneralinfoTabComponent } from './companies-generalinfo-tab/companies-generalinfo-tab.component';
import { CompaniesCommercialRegistrationComponent } from './companies-commercial-registration/companies-commercial-registration.component';
import { CompaniesLegalRepresentativeComponent } from './companies-legal-representative/companies-legal-representative.component';
import { CompaniesAddressesComponent } from './companies-addresses-tab/companies-addresses/companies-addresses.component';
import { CompanyGovernmentalAgencyListComponent } from './company-govAgency-tab/company-govAgency-list/company-govAgency-list/company-govAgency-list.component';
import { CompanyGovernmentalAgencyFilterComponent } from './company-govAgency-tab/company-govAgency-filter/company-govAgency-filter/company-govAgency-filter.component';
import { CompanyGovernmentalAgencyBranchOfficeListComponent } from './company-govAgency-tab/company-govAgency-branchOffice-list/company-govAgency-branch-office-list/company-govAgency-branch-offices.component';
import { CompanyGovernmentalAgencyEditDialogComponent } from './company-govAgency-tab/company-govAgency-branchOffice-list/company-govAgency-branch-office-list/company-govAgency-edit/company-govAgency-edit.component';
import { CompaniesAccountPlanListComponent } from './companies-account-plan/companies-account-plan-list/companies-account-plan-list.component';
import { CompaniesAccountPlanPanelComponent } from './companies-account-plan/companies-account-plan-panel/companies-account-plan-panel.component';
import { CompaniesOrganizationalstructureTabComponent } from './companies-organizationalstructure/companies-organizationalstructure-tab/companies-organizationalstructure-tab.component';
import { CompaniesOrganizationalstructureChartComponent } from './companies-organizationalstructure/companies-organizationalstructure-chart/companies-organizationalstructure-chart.component';
import { CompaniesOrganizationalstructureLevelsComponent } from './companies-organizationalstructure/companies-organizationalstructure-levels/companies-organizationalstructure-levels.component';
import { CompaniesOrganizationalstructureJobPositionsComponent } from './companies-organizationalstructure/companies-organizationalstructure-jobpositions/companies-organizationalstructure-jobpositions.component';
import { CompaniesJobpositionsPanelComponent } from './companies-organizationalstructure/companies-jobpositions-panel/companies-jobpositions-panel.component';
import { CompaniesLevelsPanelComponent } from './companies-organizationalstructure/companies-levels-panel/companies-levels-panel.component';
import { GenericMasterListComponent } from './shared/Components/generic-master-list/generic-master-list.component';
import { GenericMasterPanelComponent } from './shared/Components/generic-master-panel/generic-master-panel.component';
import { MedicalConditionListComponent } from './socioeconomic-information/medical-condition/medical-condition-list/medical-condition-list.component';
import { MedicalConditionPanelComponent } from './socioeconomic-information/medical-condition/medical-condition-panel/medical-condition-panel.component';
import { FamiliBurdenListComponent } from './socioeconomic-information/family-burden/famili-burden-list/famili-burden-list.component';
import { FamiliBurdenPanelComponent } from './socioeconomic-information/family-burden/famili-burden-panel/famili-burden-panel.component';
import { SocioeconomicInformationTabComponent } from './socioeconomic-information/socioeconomic-information-tab/socioeconomic-information-tab.component';
import { CompaniesPayrollInformationComponent } from './companies-payroll/companies-payroll-information/companies-payroll-information.component';
import { CompaniesPayrollPersonaldataComponent } from './companies-payroll/companies-payroll-personaldata/companies-payroll-personaldata.component';
import { CompaniesPayrollPayrolldataComponent } from './companies-payroll/companies-payroll-payrolldata/companies-payroll-payrolldata.component';
import { CompaniesEmployeeListComponent } from './companies-payroll/companies-employee-list/companies-employee-list.component';
import { CompaniesEmployeeFilterComponent } from './companies-payroll/companies-employee-filter/companies-employee-filter/companies-employee-filter.component';
import { MaintenanceClaimListComponent } from './socioeconomic-information/maintenance-claim/maintenance-claim-list/maintenance-claim-list.component';
import { MaintenanceClaimPanelComponent } from './socioeconomic-information/maintenance-claim/maintenance-claim-panel/maintenance-claim-panel.component';
import { IslrDiscountTabComponent } from './socioeconomic-information/islr-discount-tab/islr-discount-tab.component';
import { EmployeeIslrDiscountComponent } from './employee-islr-discount/employee-islr-discount/employee-islr-discount.component';
import { ComplementaryInfoMainComponent } from './companies-payroll/complementary-info-tab/complementary-info-main/complementary-info-main.component';
import { EmployeeSalaryAdjustmentComponent } from './employee-salary-adjustment/employee-salary-adjustment/employee-salary-adjustment.component';
import { EmployeeSalaryHistoryComponent } from './employee-salary-history/employee-salary-history/employee-salary-history.component';
import { LaborRelationshipGroupingTabComponent } from './labor-relationship-grouping/labor-relationship-grouping-tab/labor-relationship-grouping-tab.component';
import { LaborRelationshipGroupingListComponent } from './labor-relationship-grouping/labor-relationship-grouping-list/labor-relationship-grouping-list.component';
import { LaborRelationshipGroupingPanelComponent } from './labor-relationship-grouping/labor-relationship-grouping-panel/labor-relationship-grouping-panel.component';
import { AccountforPayrollDataComponent } from './companies-payroll/accountfor-payroll-data/accountfor-payroll-data/accountfor-payroll-data.component';
import { AccountforPayrollDataPanelComponent } from './companies-payroll/accountfor-payroll-data/accountfor-payroll-data-panel/accountfor-payroll-data-panel/accountfor-payroll-data-panel.component';
import { CompaniesBankAccountsComponent } from './companies-generalinfo-tab/companies-bankAccounts/companies-bank-accounts/companies-bank-accounts.component';
import { CompaniesConceptsListComponent } from './companies-concepts/companies-concepts-list/companies-concepts-list.component';
import { CompaniesConceptsFilterComponent } from './companies-concepts/companies-concepts-filter/companies-concepts-filter.component';
import { AccountingTemplateTabComponent } from './companies-concepts/companies-accounting-template/accounting-template-tab/accounting-template-tab.component';
import { AccountingTemplatePanelComponent } from './companies-concepts/companies-accounting-template/accounting-template-panel/accounting-template-panel.component';
import { GlobalVariablesTabComponent } from './companies-concepts/companies-global-variables/global-variables-tab/global-variables-tab.component';
import { GlobalVariablesFilterComponent } from './companies-concepts/companies-global-variables/global-variables-filter/global-variables-filter.component';
import { GlobalVariablesPanelComponent } from './companies-concepts/companies-global-variables/global-variables-panel/global-variables-panel.component';
import { CompaniesConceptsBarComponent } from './companies-concepts/companies-concepts-bar/companies-concepts-bar.component';
import { CompaniesConceptsGeneralsectionMainComponent } from './companies-concepts/companies-concepts-generalsection-main/companies-concepts-generalsection-main.component';
import { CompaniesConceptsGeneralinfoComponent } from './companies-concepts/companies-concepts-generalinfo/companies-concepts-generalinfo.component';
import { CompaniesConceptsGroupingComponent } from './companies-concepts/companies-concepts-grouping/companies-concepts-grouping.component';
import { CompaniesConceptsPayrollpoliciesPanelComponent } from './companies-concepts/companies-concepts-payroll-policies-panel/companies-concepts-payroll-policies-panel.component';
import { CompaniesConceptsCardInfoComponent } from './companies-concepts/companies-concepts-card-info/companies-concepts-card-info.component';
import { PayrollCalendarListComponent } from './payroll-calendar/payroll-calendar-list/payroll-calendar-list.component';
import { PayrollCalendarFilterComponent } from './payroll-calendar/payroll-calendar-filter/payroll-calendar-filter.component';
import { PayrollCalendarPanelComponent } from './payroll-calendar/payroll-calendar-panel/payroll-calendar-panel.component';
import { CompaniesConceptsPayrollPoliciesCalcComponent } from './companies-concepts/companies-concepts-payroll-policies-calc/companies-concepts-payroll-policies-calc.component';
import { AccountingTemplateListComponent } from './companies-concepts/companies-accounting-template/accounting-template-list/accounting-template-list.component';
import { CompaniesConceptsGroupingPanelComponent } from './companies-concepts/companies-concepts-grouping-panel/companies-concepts-grouping-panel.component';
import { PayrollVariablesListComponent } from './payroll-variables-list/payroll-variables-list.component';
import { AccountingTemplateTableComponent } from './companies-concepts/companies-accounting-template/accounting-template-table/accounting-template-table.component';
import { PayrollCalendarModalComponent } from './payroll-calendar/payroll-calendar-modal/payroll-calendar-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadcountComponent } from './dashboard-modals/employeeCounts/headcount/headcount.component';
import { HeadcountTurnoverComponent } from './dashboard-modals/employeeCounts/headcount-turnover/headcount-turnover/headcount-turnover.component';
import { EmployeeResumeComponent } from './dashboard-modals/employeeProfile/employee-resume/employee-resume.component';
import { CompaniesEmployeeAnalyticsComponent } from './companies-payroll/companies-employee-analytics/companies-employee-analytics.component';
import { EmployeeProfileAnalyticsComponent } from './companies-payroll/employee-profile-analytics/employee-profile-analytics.component';
import { EmployeeCountHiringComponent } from './dashboard-modals/headcount-hiring/employee-count-hiring/employee-count-hiring.component';


import { PrimengModule } from "../primeng/primeng.module";

import { CompaniesConceptPayrollInstructionComponent } from './companies-concepts/companies-concepts-payroll-instruction/companies-concept-payroll-instruction.component';
import { CompaniesConceptPayrollConditionalComponent } from './companies-concepts/companies-concept-payroll-conditional/companies-concept-payroll-conditional.component';
import { CompaniesConceptPayrollConditionComponent } from './companies-concepts/companies-concept-payroll-condition/companies-concept-payroll-condition.component';
import { CompaniesConceptPayrollExpressionComponent } from './companies-concepts/companies-concept-payroll-expression/companies-concept-payroll-expression.component';
import { CompaniesConceptPayrollAssignmentComponent } from './companies-concepts/companies-concept-payroll-assignment/companies-concept-payroll-assignment.component';
import { CompaniesPoliciesCalcVariablesPanelComponent } from './companies-concepts/companies-policies-calc-variables-panel/companies-policies-calc-variables-panel.component';
import { EmployeeMovementSubsidiaryComponent } from './dashboard-modals/employee-movement-subsidiary/employee-movement-subsidiary.component';
import { SalaryTabComponent } from './salary/salary-tab/salary-tab.component';
import { SalaryBandsListComponent } from './salary/salary-bands-list/salary-bands-list.component';
import { SalaryBandsFilterComponent } from './salary/salary-bands-filter/salary-bands-filter.component';
import { SalaryBandsPanelComponent } from './salary/salary-bands-panel/salary-bands-panel.component';
import { SalaryAdjustmentSingleComponent } from './salary/salary-adjustment-single/salary-adjustment-single.component';
import { SalaryAdjustmentSinglePanelComponent } from './salary/salary-adjustment-single-panel/salary-adjustment-single-panel.component';
import { SalaryAdjustmentTableComponent } from './salary/salary-adjustment-table/salary-adjustment-table.component';
import { SalaryAdjustmentJobPositionComponent } from './salary/salary-adjustment-job-position/salary-adjustment-job-position.component';
import { SalaryAdjustmentJobPositionPanelComponent } from './salary/salary-adjustment-job-position-panel/salary-adjustment-job-position-panel.component';
import { SalaryAdjustmentImportComponent } from './salary/salary-adjustment-import/salary-adjustment-import.component';
import { EmployeeSituationSubsidiaryComponent } from './dashboard-modals/employee-situation-subsidiary/employee-situation-subsidiary.component';
import { SalaryAdjustmentMassiveComponent } from './salary/salary-adjustment-massive/salary-adjustment-massive.component';
import { SalaryAdjustmentMassivePanelComponent } from './salary/salary-adjustment-massive-panel/salary-adjustment-massive-panel.component';
import { HolidayTabComponent } from './holiday/holiday-tab/holiday-tab.component';
import { HolidayParametersComponent } from './holiday/holiday-parameters/holiday-parameters.component';
import { HolidayIndividualProgrammingComponent } from './holiday/holiday-individual-programming/holiday-individual-programming.component';
import { HolidayIndividualProgrammingFilterComponent } from './holiday/holiday-individual-programming-filter/holiday-individual-programming-filter.component';
import { HolidayIndividualProgrammingPanelComponent } from './holiday/holiday-individual-programming-panel/holiday-individual-programming-panel.component';
import { HolidayMassiveProgrammingComponent } from './holiday/holiday-massive-programming/holiday-massive-programming.component';
import { HolidayMassiveProgrammingFilterComponent } from './holiday/holiday-massive-programming-filter/holiday-massive-programming-filter.component';
import { HolidayMassiveProgrammingPanelComponent } from './holiday/holiday-massive-programming-panel/holiday-massive-programming-panel.component';
import { HolidayProgrammingTableComponent } from './holiday/holiday-programming-table/holiday-programming-table.component';
import { SalaryDashboardTabComponent } from './salary/salary-dashboard-tab/salary-dashboard-tab.component';
import { HolidayAmountsListComponent } from './holiday/holiday-amounts-list/holiday-amounts-list.component';
import { HolidayAmountFilterComponent } from './holiday/holiday-amount-filter/holiday-amount-filter.component';
import { EmployeeTrainingListComponent } from './companies-payroll/employee-training-list/employee-training-list.component';
import { EmployeeTrainingPanelComponent } from './companies-payroll/employee-training-panel/employee-training-panel.component';
import { EmployeeTrainingSkillsComponent } from './companies-payroll/employee-training-skills/employee-training-skills.component';
import { EmployeeTrainingFocusImprovingComponent } from './companies-payroll/employee-training-focus-improving/employee-training-focus-improving.component';
import { MstgSalarytypesComponent } from './hcm-masters/mstg-salarytypes/mstg-salarytypes.component';
import { MstgPayrolltypesComponent } from './hcm-masters/mstg-payrolltypes/mstg-payrolltypes.component';
import { MstgSalarytypesFilterComponent } from './hcm-masters/mstg-salarytypes-filter/mstg-salarytypes-filter.component';
import { IncidentsTabComponent } from './incidents/incidents-tab/incidents-tab.component';
import { IncidentsMainListComponent } from './incidents/incidents-main-list/incidents-main-list.component';
import { IncidentsMainFilterComponent } from './incidents/incidents-main-filter/incidents-main-filter.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanDetailComponent } from './loan/loan-detail/loan-detail.component';
import { LoanFilterComponent } from './loan/loan-filter/loan-filter.component';
import { LoanInstallmentListComponent } from './loan/loan-installment-list/loan-installment-list.component';
import { LoanInstallmentPanelComponent } from './loan/loan-installment-panel/loan-installment-panel.component';
import { RepaymentListComponent } from './loan/repayment-list/repayment-list.component';
import { RepaymentPanelComponent } from './loan/repayment-panel/repayment-panel.component';
import { RepaymentDiscontinueComponent } from './loan/repayment-discontinue/repayment-discontinue.component';
import { IncidentsLoadSingleComponent } from './incidents/incidents-load-single/incidents-load-single.component';
import { IncidentsLoadMassiveComponent } from './incidents/incidents-load-massive/incidents-load-massive.component';
import { IncidentsLoadMassiveFilterEmployeesComponent } from './incidents/incidents-load-massive-filter-employees/incidents-load-massive-filter-employees.component';
import { IncidentsLoadImportationComponent } from './incidents/incidents-load-importation/incidents-load-importation.component';
import { IncidentsLoadIntegrationComponent } from './incidents/incidents-load-integration/incidents-load-integration.component';
import { RestsListComponent } from './rests/rests-list/rests-list.component';
import { RestsFilterComponent } from './rests/rests-filter/rests-filter.component';
import { RestsPanelComponent } from './rests/rests-panel/rests-panel.component';
import { RepaymentExemptionComponent } from './loan/repayment-exemption/repayment-exemption.component';
import { MstgSalarytypesDetailComponent } from './hcm-masters/mstg-salarytypes-detail/mstg-salarytypes-detail.component';
 @NgModule({
  declarations: [
    CompaniesCatalogListComponent,
    CompaniesCatalogFilterComponent,
    CompaniesCatalogEditDialogComponent,
    CompaniesGeneralSectionComponent,
    CompanybarComponent,
    CompaniesGeneralinfoTabComponent,
    CompanybarComponent,
    CompaniesAddressesComponent,
    CompanyGovernmentalAgencyFilterComponent,
    CompanyGovernmentalAgencyBranchOfficeListComponent,
    CompanyGovernmentalAgencyListComponent,
    CompanyGovernmentalAgencyEditDialogComponent,
    CompaniesCommercialRegistrationComponent,
    CompaniesLegalRepresentativeComponent,
    CompaniesAddressesComponent,
    CompaniesAccountPlanListComponent,
    CompaniesAccountPlanPanelComponent,
    CompaniesOrganizationalstructureTabComponent,
    CompaniesOrganizationalstructureChartComponent,
    CompaniesOrganizationalstructureLevelsComponent,
    CompaniesOrganizationalstructureJobPositionsComponent,
    CompaniesJobpositionsPanelComponent,
    CompaniesLevelsPanelComponent,
    GenericMasterListComponent,
    GenericMasterPanelComponent,
    CompaniesPayrollInformationComponent,
    CompaniesPayrollPersonaldataComponent,
    CompaniesPayrollPayrolldataComponent,
    CompaniesEmployeeListComponent,
    MedicalConditionListComponent,
    MedicalConditionPanelComponent,
    FamiliBurdenListComponent,
    FamiliBurdenPanelComponent,
    SocioeconomicInformationTabComponent,
    CompaniesEmployeeFilterComponent,
    SocioeconomicInformationTabComponent,
    MaintenanceClaimListComponent,
    MaintenanceClaimPanelComponent,
    IslrDiscountTabComponent,
    EmployeeIslrDiscountComponent,
    ComplementaryInfoMainComponent,
    EmployeeSalaryAdjustmentComponent,
    EmployeeSalaryHistoryComponent,
    LaborRelationshipGroupingTabComponent,
    LaborRelationshipGroupingListComponent,
    LaborRelationshipGroupingPanelComponent,
    AccountforPayrollDataComponent,
    AccountforPayrollDataPanelComponent,
    CompaniesBankAccountsComponent,
    CompaniesConceptsListComponent,
    CompaniesConceptsFilterComponent,
    AccountingTemplateTabComponent,
    AccountingTemplatePanelComponent,
    GlobalVariablesTabComponent,
    GlobalVariablesFilterComponent,
    GlobalVariablesPanelComponent,
    CompaniesConceptsBarComponent,
    CompaniesConceptsGeneralsectionMainComponent,
    CompaniesConceptsGeneralinfoComponent,
    CompaniesConceptsGroupingComponent,
    CompaniesConceptsPayrollpoliciesPanelComponent,
    CompaniesConceptsCardInfoComponent,
    PayrollCalendarListComponent,
    PayrollCalendarFilterComponent,
    PayrollCalendarPanelComponent,
    CompaniesConceptsPayrollPoliciesCalcComponent,
    AccountingTemplateListComponent,
    CompaniesConceptsGroupingPanelComponent,
    PayrollVariablesListComponent,
    AccountingTemplateTableComponent,
    PayrollCalendarModalComponent,
    CompaniesBankAccountsComponent,
    DashboardComponent,
    HeadcountComponent,
    HeadcountTurnoverComponent,
    EmployeeResumeComponent,
    CompaniesEmployeeAnalyticsComponent,
    EmployeeProfileAnalyticsComponent,
    EmployeeCountHiringComponent,
    CompaniesConceptPayrollInstructionComponent,
    CompaniesConceptPayrollConditionalComponent,
    CompaniesConceptPayrollConditionComponent,
    CompaniesConceptPayrollExpressionComponent,
    CompaniesConceptPayrollAssignmentComponent,
    CompaniesPoliciesCalcVariablesPanelComponent,
    EmployeeMovementSubsidiaryComponent,
    SalaryTabComponent,
    SalaryBandsListComponent,
    SalaryBandsFilterComponent,
    SalaryBandsPanelComponent,
    SalaryAdjustmentSingleComponent,
    SalaryAdjustmentSinglePanelComponent,
    SalaryAdjustmentTableComponent,
    SalaryAdjustmentJobPositionComponent,
    SalaryAdjustmentImportComponent,
    EmployeeSituationSubsidiaryComponent,
    SalaryAdjustmentJobPositionPanelComponent,
    SalaryAdjustmentMassiveComponent,
    SalaryAdjustmentMassivePanelComponent,
    HolidayTabComponent,
    HolidayParametersComponent,
    HolidayIndividualProgrammingComponent,
    HolidayIndividualProgrammingFilterComponent,
    HolidayIndividualProgrammingPanelComponent,  HolidayMassiveProgrammingComponent,
    HolidayMassiveProgrammingFilterComponent,
    HolidayMassiveProgrammingPanelComponent,
    HolidayProgrammingTableComponent,
    SalaryDashboardTabComponent,
    HolidayAmountsListComponent,
    HolidayAmountFilterComponent,
    EmployeeTrainingListComponent,
    EmployeeTrainingPanelComponent,
    EmployeeTrainingSkillsComponent,
    EmployeeTrainingFocusImprovingComponent,
    MstgSalarytypesComponent,
    MstgPayrolltypesComponent,
    MstgSalarytypesFilterComponent,
    IncidentsTabComponent,
    IncidentsMainListComponent,
    IncidentsMainFilterComponent,
    LoanListComponent,
    LoanDetailComponent,
    LoanFilterComponent,
    LoanInstallmentListComponent,
    LoanInstallmentPanelComponent,
    RepaymentListComponent,
    RepaymentPanelComponent,
    RepaymentDiscontinueComponent,
    IncidentsLoadSingleComponent,
    IncidentsLoadImportationComponent,
    IncidentsLoadIntegrationComponent,
    IncidentsLoadMassiveComponent,
    IncidentsLoadMassiveFilterEmployeesComponent,
    RepaymentExemptionComponent,
    MstgSalarytypesDetailComponent,

  ],
  imports: [
    CommonModule,
    HcmRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    PrimengModule
  ]
})
export class HcmModule { }
