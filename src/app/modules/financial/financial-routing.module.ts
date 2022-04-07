import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { AuxiliaryListComponent } from './auxiliaries/auxiliary-list/auxiliary-list.component';
import { InitialSetupListComponent } from 'src/app/modules/financial/initial-setup/initial-setup-list/initial-setup-list.component';
import { AccountingPlanDetailsComponent } from 'src/app/modules/financial/accounting-plan/accounting-plan-details/accounting-plan-details.component';
import { LedgerAccountCategoryListComponent } from './LedgerAccountCategory/ledger-account-category-list/ledger-account-category-list.component';
import { AccountingAccountListComponent } from 'src/app/modules/financial/AccountingAccounts/accounting-account-list/accounting-account-list.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { LotsListComponent } from './lots/lots-list/lots-list.component';
import { LotsDetailsComponent } from './lots/lots-details/lots-details.component';

import { FiscalYearDetailsComponent } from './fiscal-year/fiscal-year-details/fiscal-year-details.component';

import { DetailArticleClassificationComponent } from './article-classification/detail-article-classification/detail-article-classification.component';
import { ArticleClassificationListComponent } from './article-classification/article-classification-list/article-classification-list.component';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { DetailArticleComponent } from './article/detail-article/detail-article.component';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { BankTransactionsListComponent } from './bank-transactions/bank-transactions-list/bank-transactions-list.component';
import { BankTransactionsDetailsComponent } from './bank-transactions/bank-transactions-details/bank-transactions-details.component';
import { InternalBankTransferDetailComponent } from './Internal-Bank-Transfer/internal-bank-transfer-detail/internal-bank-transfer-detail.component';
import { SaleTransactionsListComponent } from './sale-transactions/sale-transactions-list/sale-transactions-list.component';
import { SaleTransactionsDetailsComponent } from './sale-transactions/sale-transactions-details/sale-transactions-details.component';
import { ClientModalComponent } from './client-dev/client-modal/client-modal.component';
import { InternalBankTransferListComponent } from './Internal-Bank-Transfer/internal-bank-transfer-list/internal-bank-transfer-list.component';

import { BalanceSheetComponent } from './financial-dashboard/balance-sheet/balance-sheet.component';
import { ReceivableAccountsDocumentsApplicationComponent } from './receivable-accounts-documents/receivable-accounts-documents-application/receivable-accounts-documents-application.component';

import { CollectionTransactionsListComponent } from './collection-transactions/collection-transactions-list/collection-transactions-list.component';
import { CollectionTransactionsDetailsComponent } from './collection-transactions/collection-transactions-details/collection-transactions-details.component';
import { GeneralBalanceComponent } from './general-balance/general-balance.component';
import { JournalEntryTransactionsListComponent } from './journal-entry-transactions/journal-entry-transactions-list/journal-entry-transactions-list.component';
import { JournalEntryTransactionsDetailComponent } from './journal-entry-transactions/journal-entry-transactions-detail/journal-entry-transactions-detail.component';
import { PaymentsListComponent } from './payments/payments-list/payments-list.component';
import { PaymentDetailsDirectComponent } from './payments/payment-details-direct/payment-details-direct.component';
import { PaymentsApplicationComponent } from './payments/payments-application/payments-application.component';
import { PaymentDetailsAdvanceComponent } from './payments/payment-details-advance/payment-details-advance.component';
import { IncomeStatementComponent } from './income-statement/income-statement.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'masters/auxiliary-list', component: AuxiliaryListComponent },
      { path: 'configuration/configuration', component: InitialSetupListComponent },
      { path: 'configuration/accounting-plan', component: AccountingPlanDetailsComponent },
      { path: 'masters/ledgerAccountCategory-list', component: LedgerAccountCategoryListComponent },
      { path: 'configuration/lots-list', component: LotsListComponent },
      { path: 'configuration/lots-details/:id', component: LotsDetailsComponent },
      { path: 'masters/fiscal-year', component: FiscalYearDetailsComponent },
      { path: 'configuration/accounting-account-list', component: AccountingAccountListComponent },
      { path: 'masters/article-classification-list', component: ArticleClassificationListComponent },
      { path: 'masters/detail-article-classification', component: DetailArticleClassificationComponent },
      { path: 'masters/article-list', component: ArticleListComponent },
      { path: 'masters/detail-article/:id', component: DetailArticleComponent },
      { path: 'dashboard', component: FinancialDashboardComponent },
      { path: 'banks/bank-transactions', component: BankTransactionsListComponent },
      { path: 'banks/bank-transactions/new', component: BankTransactionsDetailsComponent, },
      { path: 'banks/bank-transactions/:id', component: BankTransactionsDetailsComponent, },
      { path: 'banks/bank-transfer-internal', component: InternalBankTransferListComponent, },
      { path: 'banks/bank-transfer-internal-detail/new', component: InternalBankTransferDetailComponent, },
      { path: 'banks/bank-transfer-internal-detail/:id', component: InternalBankTransferDetailComponent, },
      { path: 'sales/sale-transactions', component: SaleTransactionsListComponent, },
      { path: 'sales/sale-transactions/direct', component: SaleTransactionsListComponent, },
      { path: 'sales/sale-transactions/new', component: SaleTransactionsDetailsComponent, },
      { path: 'sales/sale-transactions/:id', component: SaleTransactionsDetailsComponent, },
      { path: 'balance-sheet', component: BalanceSheetComponent},
      { path: 'receivable-accounts/document-application', component: ReceivableAccountsDocumentsApplicationComponent},
      { path: 'collection/collection-transactions', component: CollectionTransactionsListComponent, },
      { path: 'collection/collection-transactions/new', component: CollectionTransactionsDetailsComponent, },
      { path: 'collection/collection-transactions/:id', component: CollectionTransactionsDetailsComponent, },
      { path: 'reports/general-balance', component: GeneralBalanceComponent, },
      { path: 'reports/income-statements', component: IncomeStatementComponent, },
      { path: 'entry-transactions/journal-entry-transactions', component: JournalEntryTransactionsListComponent, },
      { path: 'entry-transactions/journal-entry-transactions/new/:id/:ind', component: JournalEntryTransactionsDetailComponent, },
      { path: 'collection/collection-transactions/:id', component: CollectionTransactionsDetailsComponent, },
      { path: 'payments/payments', component: PaymentsListComponent, },
      { path: 'payments/direct/new', component: PaymentDetailsDirectComponent, },
      { path: 'payments/advance/new', component: PaymentDetailsAdvanceComponent, },
      { path: 'payments/application', component: PaymentsApplicationComponent, },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialRoutingModule { }
