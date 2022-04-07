import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ProgressBarModule} from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import {TreeTableModule} from 'primeng/treetable';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FieldsetModule} from 'primeng/fieldset';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import { SidebarModule } from 'primeng/sidebar';
import {MultiSelectModule} from 'primeng/multiselect';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'primeng/tooltip';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {KeyFilterModule} from 'primeng/keyfilter';
import {PanelModule} from 'primeng/panel';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { FinancialRoutingModule } from './financial-routing.module';
import { AuxiliaryListComponent } from './auxiliaries/auxiliary-list/auxiliary-list.component';
import { CommonAppModule } from '../../modules/common/common.module';
import { CommonDirectiveModule } from 'src/app/modules/shared/common-directive/common-directive.module';
import { AuxiliaryFiltersComponent } from './auxiliaries/auxiliary-filters/auxiliary-filters.component';
import { InitialSetupListComponent } from './initial-setup/initial-setup-list/initial-setup-list.component';
import { AccountingPlansDetailsComponent } from './initial-setup/accounting-plans-details/accounting-plans-details.component';
import { ItemsDetailsComponent } from './initial-setup/items-details/items-details.component';
import { AuxiliaryPanelComponent } from './auxiliaries/auxiliary-panel/auxiliary-panel.component';
import { LedgerAccountCategoryListComponent } from './LedgerAccountCategory/ledger-account-category-list/ledger-account-category-list.component';
import { LedgerAccountCategoryFiltersComponent } from './LedgerAccountCategory/ledger-account-category-filters/ledger-account-category-filters.component';
import { LedgerAccountCategoryPanelComponent } from './LedgerAccountCategory/ledger-account-category-panel/ledger-account-category-panel.component';
import { AccountingPlanTreeComponent } from './accounting-plan/accounting-plan-tree/accounting-plan-tree.component';
import { AccountingPlanDetailsComponent } from './accounting-plan/accounting-plan-details/accounting-plan-details.component';
import { FiscalYearTreeComponent } from './fiscal-year/fiscal-year-tree/fiscal-year-tree.component';
import { FiscalYearDetailsComponent } from './fiscal-year/fiscal-year-details/fiscal-year-details.component';
import { FiscalYearFiltersComponent } from './fiscal-year/fiscal-year-filters/fiscal-year-filters.component';
import { AccountingAccountListComponent } from './AccountingAccounts/accounting-account-list/accounting-account-list.component';
import { AccountingAccountFiltersComponent } from './AccountingAccounts/accounting-account-filters/accounting-account-filters.component';
import { AccountingAccountPanelComponent } from './AccountingAccounts/accounting-account-panel/accounting-account-panel.component';
import { SelectAccountingAccountModalComponent } from './AccountingAccounts/select-accounting-account-modal/select-accounting-account-modal.component';
import { LotsListComponent } from './lots/lots-list/lots-list.component';
import { LotsFiltersComponent } from './lots/lots-filters/lots-filters.component';
import { LotsPanelComponent } from './lots/lots-panel/lots-panel.component';
import { LotsDetailsComponent } from './lots/lots-details/lots-details.component';
import { FiscalYearMutationModalComponent } from './fiscal-year/fiscal-year-mutation-modal/fiscal-year-mutation-modal.component';
import { ArticleClassificationListComponent } from './article-classification/article-classification-list/article-classification-list.component';
import { ArticleClassificationPanelComponent } from './article-classification/article-classification-panel/article-classification-panel.component';
import { DetailArticleClassificationComponent } from './article-classification/detail-article-classification/detail-article-classification.component';
import { ArticleClassificationFiltersComponent } from './article-classification/article-classification-filters/article-classification-filters.component';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { ArticleFiltersComponent } from './article/article-filters/article-filters.component';
import { DetailArticleComponent } from './article/detail-article/detail-article.component';
import { CostsOfTheArticleModalComponent } from './article/costs-of-the-article-modal/costs-of-the-article-modal.component';
import { BankTransactionsListComponent } from './bank-transactions/bank-transactions-list/bank-transactions-list.component';
import { BankTransactionsTreeComponent } from './bank-transactions/bank-transactions-tree/bank-transactions-tree.component';
import { BankTransactionsDetailsComponent } from './bank-transactions/bank-transactions-details/bank-transactions-details.component';
import { BankTransactionsFiltersComponent } from './bank-transactions/bank-transactions-filters/bank-transactions-filters.component';
import { InternalBankTransferDetailComponent } from './Internal-Bank-Transfer/internal-bank-transfer-detail/internal-bank-transfer-detail.component';
import { SaleTransactionsListComponent } from './sale-transactions/sale-transactions-list/sale-transactions-list.component';
import { SaleTransactionsTreeComponent } from './sale-transactions/sale-transactions-tree/sale-transactions-tree.component';
import { SaleTransactionsFiltersComponent } from './sale-transactions/sale-transactions-filters/sale-transactions-filters.component';
import { SaleTransactionsDiscountModalComponent } from './sale-transactions/sale-transactions-discount-modal/sale-transactions-discount-modal.component';
import { SaleTransactionsDiscountTreeComponent } from './sale-transactions/sale-transactions-discount-tree/sale-transactions-discount-tree.component';
import { SaleTransactionsPaymentModalComponent } from './sale-transactions/sale-transactions-payment-modal/sale-transactions-payment-modal.component';
import { SaleTransactionsDetailsComponent } from './sale-transactions/sale-transactions-details/sale-transactions-details.component';
import { ClientModalComponent } from './client-dev/client-modal/client-modal.component';
import { SaleTransactionsClientModalComponent } from './sale-transactions/sale-transactions-details/client-modal/client-modal.component';
import { InternalBankTransferListComponent } from './Internal-Bank-Transfer/internal-bank-transfer-list/internal-bank-transfer-list.component';
import { InternalBankTransferFiltersComponent } from './Internal-Bank-Transfer/internal-bank-transfer-filters/internal-bank-transfer-filters.component';
import { InternalBankTransferTreeComponent } from './Internal-Bank-Transfer/internal-bank-transfer-tree/internal-bank-transfer-tree.component';
import { SaleTransactionsTaxesSelectComponent } from './sale-transactions/sale-transactions-details/taxes-select/taxes-select.component';
import { SaleTransactionsTaxesSelectModalComponent } from './sale-transactions/sale-transactions-details/taxes-select/tax-modal/tax-modal.component';
import { SaleTransactionsLotModalComponent } from './sale-transactions/sale-transactions-details/lot-modal/lot-modal.component';
import { SaleTransactionsArticlesSelectModalComponent } from './sale-transactions/sale-transactions-details/articles-select/tax-modal/tax-modal.component';
import { SaleTransactionsArticlesSelectComponent } from './sale-transactions/sale-transactions-details/articles-select/taxes-select.component';
import { SaleTransactionsPaymentTreeComponent } from './sale-transactions/sale-transactions-payment-tree/sale-transactions-payment-tree.component';

import { PrimengModule } from "../primeng/primeng.module";
import {FinancialDashboardComponent} from "./financial-dashboard/financial-dashboard.component";

import { BalanceSheetComponent } from './financial-dashboard/balance-sheet/balance-sheet.component';
import { SrmModule } from '../srm/srm.module';
import { SaleTransactionAcountModalComponent } from './sale-transactions/sale-transaction-acount-modal/sale-transaction-acount-modal.component';
import { ReceivableAccountsDocumentsApplicationListComponent } from './receivable-accounts-documents/receivable-accounts-documents-application-list/receivable-accounts-documents-application-list.component';
import { ReceivableAccountsDocumentsApplicationComponent } from './receivable-accounts-documents/receivable-accounts-documents-application/receivable-accounts-documents-application.component';
import { CollectionTransactionsListComponent } from './collection-transactions/collection-transactions-list/collection-transactions-list.component';
import { CollectionTransactionsFiltersComponent } from './collection-transactions/collection-transactions-filters/collection-transactions-filters.component';
import { CollectionTransactionsTreeComponent } from './collection-transactions/collection-transactions-tree/collection-transactions-tree.component';
import { CollectionTransactionsDetailsComponent } from './collection-transactions/collection-transactions-details/collection-transactions-details.component';
import { CollectionTransactionsDocumentsToApplyTreeComponent } from './collection-transactions/collection-transactions-details/collection-transactions-documents-to-apply-tree/collection-transactions-documents-to-apply-tree.component';
import { ConllectionTransactionDocumentsToApplyModalComponent } from './collection-transactions/collection-transactions-details/conllection-transaction-documents-to-apply-modal/conllection-transaction-documents-to-apply-modal.component';
import { CollectionTransactionsPaymentTreeComponent } from './collection-transactions/collection-transactions-payment-tree/collection-transactions-payment-tree.component';
import { CollectionTransactionsPaymentModalComponent } from './collection-transactions/collection-transactions-payment-modal/collection-transactions-payment-modal.component';
import { GeneralBalanceComponent } from './general-balance/general-balance.component';
import { GeneralBalanceFiltersComponent } from './general-balance/filters/general-balance-filters.component';
import { GeneralBalanceTableComponent } from './general-balance/account-table/general-balance-table.component';
import { JournalEntryTransactionsListComponent } from './journal-entry-transactions/journal-entry-transactions-list/journal-entry-transactions-list.component';
import { JournalEntryTransactionFiltersComponent } from './journal-entry-transactions/journal-entry-transaction-filters/journal-entry-transaction-filters.component';
import { JournalEntryTransactionsDetailComponent } from './journal-entry-transactions/journal-entry-transactions-detail/journal-entry-transactions-detail.component';
import { PaymentsListComponent } from './payments/payments-list/payments-list.component';
import { PaymentsTreeComponent } from './payments/payments-tree/payments-tree.component';
import { PaymentsFiltersComponent } from './payments/payments-filters/payments-filters.component';
import { PaymentDetailsDirectComponent } from './payments/payment-details-direct/payment-details-direct.component';
import { PaymentsApplicationComponent } from './payments/payments-application/payments-application.component';
import { PaymentsDocumentSelectModalComponent } from './payments/payments-document-select-modal/payments-document-select-modal.component';
import { PaymentsApplicationListComponent } from './payments/payments-application-list/payments-application-list.component';
import { PaymentDetailsAdvanceComponent } from './payments/payment-details-advance/payment-details-advance.component';
import { IncomeStatementComponent } from './income-statement/income-statement.component';
import { IncomeStatementFiltersComponent } from './income-statement/filters/income-statement-filters.component';
import { IncomeStatementTableComponent } from './income-statement/account-table/income-statement-table.component';



@NgModule({
  declarations: [
    AuxiliaryListComponent,
    AuxiliaryFiltersComponent,
    AuxiliaryPanelComponent,
    InitialSetupListComponent,
    AccountingPlansDetailsComponent,
    ItemsDetailsComponent,
    LedgerAccountCategoryListComponent,
    LedgerAccountCategoryFiltersComponent,
    LedgerAccountCategoryPanelComponent,
    AccountingPlanTreeComponent,
    AccountingPlanDetailsComponent,
    FiscalYearDetailsComponent,
    FiscalYearTreeComponent,
    FiscalYearFiltersComponent,
    FiscalYearMutationModalComponent,
    AccountingAccountListComponent,
    AccountingAccountFiltersComponent,
    AccountingAccountPanelComponent,
    LotsListComponent,
    LotsFiltersComponent,
    LotsPanelComponent,
    LotsDetailsComponent,
    ArticleClassificationListComponent,
    ArticleClassificationPanelComponent,
    DetailArticleClassificationComponent,
    ArticleClassificationFiltersComponent,
    ArticleListComponent,
    ArticleFiltersComponent,
    DetailArticleComponent,
    CostsOfTheArticleModalComponent,
    FinancialDashboardComponent,
    SelectAccountingAccountModalComponent,
    BankTransactionsListComponent,
    BankTransactionsTreeComponent,
    BankTransactionsDetailsComponent,
    BankTransactionsFiltersComponent,
    InternalBankTransferDetailComponent,
    SaleTransactionsListComponent,
    SaleTransactionsTreeComponent,
    SaleTransactionsFiltersComponent,
    SaleTransactionsDiscountModalComponent,
    SaleTransactionsDiscountTreeComponent,
    SaleTransactionsPaymentModalComponent,
    SaleTransactionsDetailsComponent,
    SaleTransactionsTaxesSelectComponent,
    SaleTransactionsClientModalComponent,
    SaleTransactionsLotModalComponent,
    SaleTransactionsTaxesSelectModalComponent,
    SaleTransactionsArticlesSelectComponent,
    SaleTransactionsArticlesSelectModalComponent,
    InternalBankTransferListComponent,
    InternalBankTransferFiltersComponent,
    InternalBankTransferTreeComponent,
    SaleTransactionsPaymentTreeComponent,
    ClientModalComponent,
    SaleTransactionAcountModalComponent,
    ReceivableAccountsDocumentsApplicationComponent,
    ReceivableAccountsDocumentsApplicationListComponent,
    BalanceSheetComponent,
    CollectionTransactionsListComponent,
    CollectionTransactionsFiltersComponent,
    CollectionTransactionsTreeComponent,
    CollectionTransactionsDetailsComponent,
    CollectionTransactionsPaymentTreeComponent,
    CollectionTransactionsPaymentModalComponent,
    CollectionTransactionsDocumentsToApplyTreeComponent,
    ConllectionTransactionDocumentsToApplyModalComponent,
    GeneralBalanceComponent,
    GeneralBalanceFiltersComponent,
    GeneralBalanceTableComponent,
    JournalEntryTransactionsListComponent,
    JournalEntryTransactionFiltersComponent,
    JournalEntryTransactionsDetailComponent,
    PaymentsListComponent,
    PaymentsTreeComponent,
    PaymentsFiltersComponent,
    PaymentDetailsDirectComponent,
    PaymentsApplicationComponent,
    PaymentsDocumentSelectModalComponent,
    PaymentsApplicationListComponent,
    PaymentDetailsAdvanceComponent,
    IncomeStatementComponent,
    IncomeStatementFiltersComponent,
    IncomeStatementTableComponent,
    PaymentDetailsAdvanceComponent
  ],
  imports: [
    CommonAppModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    OverlayPanelModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    ContextMenuModule,
    ProgressBarModule,
    ButtonModule,
    ToggleButtonModule,
    ToolbarModule ,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    TreeTableModule,
    ConfirmDialogModule,
    FieldsetModule,
    DialogModule,
    InputTextareaModule,
    CascadeSelectModule,
    SidebarModule ,
    MultiSelectModule,
    TreeModule,
    TooltipModule,
    SplitButtonModule,
    TabMenuModule,
    MenuModule,
    CardModule,
    KeyFilterModule,
    PanelModule,
    InputSwitchModule,
    RadioButtonModule,
    AccordionModule,
    InputNumberModule,
    TabViewModule,
    FinancialRoutingModule,
    CommonDirectiveModule,
    PrimengModule,
    SrmModule
  ],
  exports: [
    CommonDirectiveModule,
    SelectAccountingAccountModalComponent,
    ArticleClassificationPanelComponent
  ]
})
export class FinancialModule {

}
