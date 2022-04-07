import { Component, Injector, OnInit } from "@angular/core";
import { ColumnD } from "src/app/models/common/columnsd";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { Lots } from "src/app/models/financial/lots";
import { LotsFilter } from "src/app/models/financial/lotsFilter";
import {
  SalesTransactionArticleTaxes,
  SalesTransactionPayment,
  SalesTransactionTaxes,
  SalesTypeFilter,
  SaleTransaction,
  SaleTransactionFilter,
  SalesTransactionDetail,
  SalesTransactionArticleDiscount,
} from "src/app/models/financial/sale-transactions";
import { ExchangeRateByCurrency } from "src/app/models/masters/exchangeRateByCurrency";
import { SupplierClasification } from "src/app/models/masters/supplier-clasification";
import { SupplierExtend } from "src/app/models/masters/supplier-extend";
import { TaxPlanFilter } from "src/app/models/masters/tax-plan";
import { LoadingService } from "src/app/modules/common/components/loading/shared/loading.service";
import { BranchOffice } from "src/app/modules/hcm/shared/models/masters/branch-office";
import { BranchOfficeService } from "src/app/modules/hcm/shared/services/branch-office.service";
import { BankAccountsService } from "src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service";
import { CoinxCompanyFilter } from "src/app/modules/masters/coin/shared/filters/coinxcompany-filter";
import { CoinsService } from "src/app/modules/masters/coin/shared/service/coins.service";
import { PaymentconditionService } from "src/app/modules/masters/payment-conditions/shared/paymentcondition.service";
import { PaymentConditionFilter } from "src/app/modules/masters/shared/filters/payment-condition-filter";
import { SupplierService } from "src/app/modules/masters/supplier/shared/services/supplier.service";
import { SupplierclasificationService } from "src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service";
import { AccountingPlanBase } from "../../initial-setup/shared/accounting-plan-base.component";
import { TaxPlanService } from "src/app/modules/masters/tax-plan/shared/services/tax-plan.service";
import { LotsService } from "../../lots/shared/services/lots.service";
import { SaleTransactionService } from "../shared/sale-transaction.service";
import { AccountingAccountService } from "../../AccountingAccounts/shared/services/accounting-account.service";
import { AccountingAccount } from "src/app/models/financial/AccountingAccount";
import { ArticleCRUD } from "./articles-select/taxes-select.component";
import { ArticleClassification } from "src/app/models/financial/ArticleClassification";
import { ArticleClassificationService } from "../../article-classification/shared/services/article-classification.service";
import { TaxWOrigin } from "./taxes-select/taxes-select.component";
import { ArticleService } from "../../article/shared/services/article.service";
import { Article } from "src/app/models/financial/article";
import { ArticleFilter } from "src/app/models/financial/articleFilter";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { Coins } from "src/app/models/masters/coin";
import { BranchOfficeFilter } from "src/app/modules/hcm/shared/filters/branch-office-filter";
import { transactionSalesDiscountDataTable } from "../sale-transactions-discount-tree/sale-transactions-discount-tree.component";
import { SaleTransactionPaymentDataTable } from "../sale-transactions-payment-tree/sale-transactions-payment-tree.component";

enum DistributionType {
  VENTA = "Venta",
  CLIENT = "Cobro",
  COBRO = "Depósito",
  TAX = "Impuesto",
  RETENCION = "Retención",
  DISCOUNT = "Descuento",
}

type Distribution = {
  description: string;
  accountCode?: string;
  accountId?: number;
  type?: DistributionType;
  auxiliary?: string;
  auxiliaryId?: number;
  indAux?: boolean;
  sucursal?: string;
  costCenter?: string;
  debit?: number;
  credit?: number;
};

@Component({
  selector: "app-sale-transactions-details",
  templateUrl: "./sale-transactions-details.component.html",
  styleUrls: ["./sale-transactions-details.component.scss"],
})
export class SaleTransactionsDetailsComponent
  extends AccountingPlanBase
  implements OnInit
{
  loaded = false;

  required = "*";
  type: SelectItem[];
  documentTypes: SelectItem[];
  paymentConditions: SelectItem[];
  currencys: SelectItem[];
  taxPlan: SelectItem[];
  typeExchangeRate: SelectItem[];
  bankAccountExchangeRate: ExchangeRateByCurrency;
  saving: boolean;
  showDialog: boolean;
  showFilters: boolean;
  submitted: boolean;
  record: boolean;
  idItem = 0;
  indSaleTransactionDirect = false;
  loading: any;
  maxPostingDate: Date;
  transact = new SaleTransaction();
  oldTransact = new SaleTransaction();
  transactFilter = new SaleTransactionFilter();

  taxes: TaxWOrigin[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    public breadcrumbService: BreadcrumbService,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private salesService: SaleTransactionService,
    private supplierClassificationService: SupplierclasificationService,
    private paymentConditionsService: PaymentconditionService,
    private lotsService: LotsService,
    private branchOfficeService: BranchOfficeService,
    private bankAccountsService: BankAccountsService,
    private coinsService: CoinsService,
    private messageService: MessageService,
    private taxPlanService: TaxPlanService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private accountingAccountsService: AccountingAccountService,
    private artClassiService: ArticleClassificationService,
    private articleService: ArticleService,
    injector: Injector
  ) {
    super(injector);
    this.breadcrumbService.setItems([
      { label: "FMS" },
      { label: "Cuentas por cobrar" },
      { label: "Ventas", routerLink: ["/financial/sales/sale-transactions"] },
    ]);
  }

  _distributions: Distribution[] = [];

  bufferArray = [];
  lastKeystrokeTime = Date.now();

  //Our cheat code
  cheatcode = "iddqd";

  setManualMode() {
    this._distributions = this.getDistributions();
    this.isEditing = true;
  }

  branchOffices: BranchOffice[] = [];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];
  isEditing = false;

  client: SupplierExtend;
  clients: SupplierExtend[] = [];
  lot: Lots = new Lots();
  lots: Lots[] = [];
  clientClassifications: SupplierClasification[] = [];

  discounts: transactionSalesDiscountDataTable[] = [];
  clientModal = false;
  lotModal = false;
  accountingAccountModal = false;
  aAccount = new accountingAccounts();

  articlesTotal = 0;

  distributionsCols: ColumnD<Distribution>[] = [
    { template: (d) => d.description, header: "Descripción" },
    {
      template: (d) => (d.accountCode ? this.formatCode(d.accountCode) : null),
      header: "Cuenta contable",
    },
    { template: (d) => d.type, header: "Tipo" },
    { template: (d) => d.sucursal, header: "Sucursal" },
    { template: (d) => d.costCenter || "N/A", header: "Centro de costo" },
    {
      template: (d) => (d.indAux ? d.auxiliary || "Sin auxiliar" : "N/A"),
      header: "Auxiliar",
    },
    {
      field: "debit",
      template: (d) =>
        this.isEditing
          ? null
          : this.currencySymbol() +
            (d.debit || 0).toLocaleString("es", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
      header: "Débito",
      style: "font-weight: bold",
      textAlign: "right",
    },
    {
      field: "credit",
      template: (d) =>
        this.isEditing
          ? null
          : this.currencySymbol() +
            (d.credit || 0).toLocaleString("es", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
      header: "Crédito",
      style: "font-weight: bold",
      textAlign: "right",
    },
  ];

  getClientAccountingAccount() {
    const aa = this.client?.financialSetup?.accountingAccounts.find(
      (aa) => aa.use.toLocaleLowerCase() == "ventas"
    );
    const rawAA = this.accountingAccounts.find(
      (raw) => raw.accountingAccountId == aa.accountingAccountId
    );
    return {
      account: aa,
      raw: rawAA,
    };
  }

  articles: ArticleCRUD[] = [];
  payments = [] as SaleTransactionPaymentDataTable[];

  calcCost(article: ArticleCRUD) {
    const cost = article.quantity * article.unitCost;
    const percent = article.discounts
      .filter((t) => t.indActivo)
      .map((t) => t.discountValue)
      .reduce((a, b) => a + b, 0);
    const toSubstract = (percent / 100) * cost;
    return cost - toSubstract;
  }

  calcTotal(article?: ArticleCRUD) {
    const cost = this.calcCost(article);
    const percent = article.taxes
      .filter((t) => t.active)
      .map((t) => t.rateValue + (t.baseTaxRateValue || 0))
      .reduce((a, b) => a + b, 0);
    const toAdd = (percent / 100) * cost;
    return cost + toAdd;
  }

  showAddAccountingAcountlDialog() {
    this.accountingAccountModal = true;
    console.log(this.accountingAccountModal);
  }
  getDistTotals() {
    const dists = this.isEditing
      ? this._distributions
      : this.getDistributions();
    const debit = dists.map((d) => d.debit).reduce((a, b) => a + b, 0);
    const credit = dists.map((d) => d.credit).reduce((a, b) => a + b, 0);
    const diff = debit - credit;
    console.log("Diff", debit, credit);
    const format = (value: number) =>
      this.currencySymbol() +
      (value || 0).toLocaleString("es", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    return {
      debit: format(debit),
      credit: format(credit),
      diff: format(diff),
      color: diff === 0 ? "green" : "red",
    };
  }

  getArticlePrice = (article: ArticleCRUD, mode: "cost" | "total") => {
    const isBase = this.currencyMap.find(
      (c) => c.id == article.monedaIdArt
    )?.legalCurrency;
    const cost =
      mode == "cost" ? this.calcCost(article) : this.calcTotal(article);
    return {
      conversion: cost / (!isBase ? 1 : this.currencyRate()),
      base: cost * (isBase ? 1 : this.currencyRate()),
    };
  };

  getDistributions() {
    let dists: Distribution[] = [];
    const articlesTotal = this.articles
      .map(
        (a) =>
          this.getArticlePrice(a, "total")[
            this.isBaseCurrency() ? "base" : "conversion"
          ]
      )
      .reduce((a, b) => a + b, 0);
    const clientAA = this.getClientAccountingAccount();
    const getAA = (id: number) =>
      this.accountingAccounts.find((aa) => aa.accountingAccountId == id);
    const payments = this.payments
      .filter((p) => p.indActive)
      .map((p) => ({
        description: getAA(p.accountingAccountId)?.accountingAccountName,
        accountId: p.accountingAccountId || -1,
        accountCode: getAA(p.accountingAccountId)?.accountingAccountCode || "",
        auxiliary: clientAA?.account.auxiliar,
        auxiliaryId: clientAA?.account.auxiliarId,
        indAux: clientAA?.account.indAuxiliar,
        type: DistributionType.COBRO,
        debit: p.amount,
        credit: 0,
      }));
    const discounts = this.discounts
      .filter((d) => d.indActivo)
      .map((t) => ({
        description: clientAA.raw.accountingAccountName,
        accountId: clientAA?.account.accountingAccountId,
        accountCode: clientAA?.account.accountingAccountCode,
        auxiliary: clientAA?.account.auxiliar,
        auxiliaryId: clientAA?.account.auxiliarId,
        indAux: clientAA?.account.indAuxiliar,
        type: DistributionType.DISCOUNT,
        debit:
          t.discountTypeId == 2
            ? t.discountValue
            : (t.discountValue / 100) *
              (this.indSaleTransactionDirect
                ? this.transact.amount
                : articlesTotal),
        credit: 0,
      }));

    let taxes: Distribution[] = [];
    let retention: Distribution[] = [];

    this.taxes
      .filter((t) => t.fromPlan || t.active)
      .forEach((t) => {
        taxes.push({
          description: clientAA.account.accountingAccount,
          accountId: clientAA?.account.accountingAccountId,
          accountCode: clientAA?.account.accountingAccountCode,
          auxiliary: clientAA?.account.auxiliar,
          auxiliaryId: clientAA?.account.auxiliarId,
          indAux: clientAA?.account.indAuxiliar,
          type: DistributionType.TAX,
          credit:
            // ((t.rateValue + (t.baseTaxRateValue || 0)) / 100) *
            (t.rateValue / 100) *
            (this.indSaleTransactionDirect
              ? this.transact.amount
              : articlesTotal),
          debit: 0,
        });
        if (t.baseTaxRateId > 0) {
          retention.push({
            description: clientAA.account.accountingAccount,
            accountId: clientAA?.account.accountingAccountId,
            accountCode: clientAA?.account.accountingAccountCode,
            auxiliary: clientAA?.account.auxiliar,
            auxiliaryId: clientAA?.account.auxiliarId,
            indAux: clientAA?.account.indAuxiliar,
            type: DistributionType.RETENCION,
            debit:
              (t.baseTaxRateValue / 100) *
              (this.indSaleTransactionDirect
                ? this.transact.amount
                : articlesTotal),
            credit: 0,
          });
        }
      });

    if (this.client) {
      const aa = clientAA;
      dists.push({
        description: `CxC - ${aa.raw.accountingAccountName}`,
        accountId: aa.account.accountingAccountId,
        accountCode: aa.account.accountingAccountCode,
        auxiliary: aa.account.auxiliar,
        auxiliaryId: aa.account.auxiliarId,
        indAux: aa.account.indAuxiliar,
        type: DistributionType.CLIENT,
        debit: Math.max(
          0,
          articlesTotal -
            [...payments, ...discounts, ...retention]
              .map((p) => p.debit)
              .reduce((a, b) => a + b, 0)
        ),
        credit: 0,
      });
    }

    dists = [...dists, ...payments];

    const getAAFromCode = (code: string) =>
      this.accountingAccounts.find((aa) => aa.accountingAccountCode == code);
    this.articles.forEach((a) => {
      const classi = this.artClassifications.find(
        (c) => a.claseArticuloId == c.id
      );
      const aa = getAAFromCode(
        classi.associatedAccount[0].accountingAccountCode
      );
      dists.push({
        description: aa.accountingAccountName,
        type: DistributionType.VENTA,
        costCenter: a.centroCosto,
        accountId: aa.accountingAccountId,
        accountCode: classi.associatedAccount[0].accountingAccountCode,
        auxiliary: classi.associatedAccount[0].auxiliar,
        auxiliaryId: classi.associatedAccount[0].auxiliarId,
        indAux: classi.associatedAccount[0].indPermiteAuxiliar,
        credit: this.getArticlePrice(a, "total")[
          this.isBaseCurrency() ? "base" : "conversion"
        ],
        debit: 0,
      });
    });

    dists = [...dists, ...taxes, ...retention, ...discounts];

    let folded: Distribution[] = [];
    dists.forEach((d) => {
      const idx = folded.findIndex(
        (f) =>
          d.accountCode == f.accountCode &&
          d.costCenter == f.costCenter &&
          d.type == f.type
      );
      if (idx >= 0) {
        folded[idx] = {
          ...folded[idx],
          credit: d.credit + folded[idx].credit,
          debit: d.debit + folded[idx].debit,
        };
      } else {
        folded.push(d);
      }
    });

    const sucursal = this.branchOffices.find(
      (b) => b.id == this.transact.branchOfficeId
    );
    folded = folded.map((f) => ({
      ...f,
      sucursal: sucursal?.branchOfficeName || "",
    }));

    return folded;
  }

  accountingAccounts: AccountingAccount[];
  artClassifications: ArticleClassification[];
  artData: Article[];

  symbol: string;
  rate: number;

  onChangeCurrency(id: number) {
    this.typeExchangeRate = this.bankAccountExchangeRateByCurrency
      .filter(
        (value, index) =>
          this.bankAccountExchangeRateByCurrency.findIndex(
            (t) => t.exchangeTypeId === value.exchangeTypeId
          ) === index
      )
      .map((t) => ({
        label: t.exchangeType,
        value: t.exchangeTypeId,
      }));
  }

  fetchDataHeader() {
    return Promise.all([
      (async () => {
        this.artData = (
          await this.articleService
            .getArticleList({
              ...new ArticleFilter(),
              registrosPagina: 10000,
              numeroPagina: 1,
            })
            .toPromise()
        ).articles;
      })(),
      (async () => {
        this.artClassifications = await this.artClassiService
          .getArticleClassificationList()
          .toPromise();
      })(),
      (async () => {
        this.accountingAccounts = await this.accountingAccountsService
          .getAccountingAccountList()
          .toPromise();
      })(),
      (async () => {
        this.lots =
          (
            await this.lotsService
              .getLotsList({ ...new LotsFilter(), allowsEntry: 1 })
              .toPromise()
          )
            .find((l) => l.moduleContent.toLowerCase() === "compras")
            ?.lots.filter((l) => l.indStatusLot == 2)
            .sort((a, b) => a.lotName.localeCompare(b.lotName)) || [];
      })(),
      (async () => {
        const fmsClients = await this.supplierService
          .getFMSSetupList()
          .toPromise();

        this.clients = (
          await this.supplierService.getSupplierExtendList().toPromise()
        )
          // .filter(s => s.indclient)
          .map((c) => ({
            ...c,
            financialSetup: fmsClients.find(
              (fms) => fms.clientSupplierId == c.idclientsupplier
            ),
          }))
          .filter((c) => c.financialSetup?.accountingAccounts?.length)
          .filter((c) =>
            c.financialSetup?.accountingAccounts.find(
              (aa) => aa.use.toLocaleLowerCase() == "ventas"
            )
          )
          .sort((a, b) => a.socialReason.localeCompare(b.socialReason));
      })(),
      (async () => {
        this.clientClassifications = (
          await this.supplierClassificationService
            .getSupplierClasificationList()
            .toPromise()
        ).sort((a, b) =>
          a.supplierclasification.localeCompare(b.supplierclasification)
        );
      })(),
      (async () => {
        this.type = (
          await this.salesService
            .getTypes({
              ...new SalesTypeFilter(),
              indActive: 1,
            })
            .toPromise()
        )
          .sort((a, b) => a.typeSale.localeCompare(b.typeSale))
          .map((pc) => ({
            value: pc.typeSaleId,
            label: pc.typeSale,
          }));
      })(),
      (async () => {
        this.paymentConditions = (
          await this.paymentConditionsService
            .getPaymentconditionbyFilter({
              ...new PaymentConditionFilter(),
              active: 1,
              amounterm: -1,
              idDiscountType: -1,
              name: "",
              idPaymentCondition: -1,
            })
            .toPromise()
        )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((pc) => ({
            value: pc.idPaymentCondition,
            label: pc.name,
          }));
      })(),
      (async () => {
        this.taxPlan = (
          await this.taxPlanService
            .getList({
              ...new TaxPlanFilter(),
              idBusiness: -1,
              active: 1,
            })
            .toPromise()
        )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tp) => ({
            value: tp.id,
            label: `${tp.name}`,
          }));
      })(),
      (async () => {
        this.bankAccountExchangeRateByCurrency = (
          await this.bankAccountsService
            .GetBankAccountExchangeRateByCurrency(-1)
            .toPromise()
        ).sort(
          (a, b) => +new Date(a.effectiveDate) - +new Date(b.effectiveDate)
        );
      })(),
      (async () => {
        await this.onChangeBranchOffice({ value: 1 });
      })(),
      // (async () => {
      // this.typeExchangeRate = this.bankAccountExchangeRateByCurrency
      // .filter((value, index) => this.bankAccountExchangeRateByCurrency.findIndex(t => t.exchangeTypeId === value.exchangeTypeId) === index)
      // .map(t => ({
      // label: t.exchangeType,
      // value: t.exchangeTypeId,
      // }));
      // })(),
      (async () => {
        this.branchOffices = (
          await this.branchOfficeService
            .GetBranchOffices({ ...new BranchOfficeFilter(), idCompany: 1 })
            .toPromise()
        ).sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
      })(),
      (async () => {
        this.documentTypes = (
          await this.salesService.getDocumentTypes().toPromise()
        )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((pc) => ({
            value: pc.id,
            label: pc.name,
          }));
      })(),
    ]);
  }
  async fetchData() {
    try {
      const _ = await this.fetchDataHeader();

      this.idItem = this.actRoute.snapshot.params["id"];

      if (this.idItem !== 0 && this.idItem !== undefined) {
        this.getDetails();

        if (this.transact.transactionStatusTypeId === 2) {
          this.saving = true;
        }

        if (this.transact.transactionStatusTypeId === 1) {
          this.saving = false;
        }
      } else {
        this.transact.indActivo = true;
        this.required = "";
      }
    } catch (err) {
      console.error(err);
    }
  }

  getDiscountAmountSingle(
    value: number,
    object: transactionSalesDiscountDataTable
  ) {
    if (object.discountTypeId == 1) {
      return value * (object.discountValue / 100);
    } else {
      return object.discountValue;
    }
  }

  calcTaxesMount() {
    const percent = this.taxes
      .filter((t) => t.active)
      .map((t) => t.rateValue + (t.baseTaxRateValue || 0))
      .reduce((a, b) => a + b, 0);
    return (percent / 100) * this.articlesTotal;
  }

  getDiscountTotal() {
    return this.discounts.reduce((sum, object) => {
      console.log(this.discounts);
      return sum + this.getDiscountAmountSingle(this.articlesTotal, object);
    }, 0);
  }

  getDetails() {
    if (this.loading) return;
    this.loading = true;
    this.transactFilter.saleTransactionId = this.idItem;
    this.transactFilter.indSaleTransactionDirect = Boolean(
      this.indSaleTransactionDirect
    );
    this.salesService.getTransactionDetail(this.transactFilter).subscribe(
      (data: SaleTransaction) => {
        this.transact = {
          ...data,
          ...(data?.documentDate
            ? { documentDate: new Date(data.documentDate) }
            : {}),
          ...(data?.accountingDate
            ? { accountingDate: new Date(data.accountingDate) }
            : {}),
          ...(data?.transactionDate
            ? { transactionDate: new Date(data.transactionDate) }
            : {}),
        };
        this.lot.id = this.transact.lotId;
        if (this.transact.providerCustomerId > 0) {
          console.log(this.clients);
          const client = this.clients.find(
            (c) => c.idclientsupplier == this.transact.providerCustomerId
          );
          if (client) {
            this.client = client;
          }
        }
        if ((this.transact.accountingDate as Date)?.getFullYear() === 1900) {
          this.transact.accountingDate = null;
        }
        this.discounts = this.transact.discounts.map((d) => ({
          ...d,
          id: d.transactionSalesDiscountId,
          discountTypeApplicationId: d.discountTypeApplicationId,
          discountTypeApplication: "Factura",
        }));
        this.payments = this.transact.charges.map((p) => ({
          ...p,
          id: p.transactionSalesChargeId,
          amount: p.amount,
          bankAccountId: p.accountBankId,
          bankId: p.bankId,
          converTaxeChangeId: p.exchangeRateConvertionId,
          currencyId: p.currencyOutputId,
          currencyPaymentMethodId: p.paymentMethodByCurrencyId,
          indActive: p.indActivo,
          paymentMethodId: p.paymentMethodId,
          reference: p.reference,
          taxeChangeId: p.exchangeRateId,
          bank: p.bank,
          bankAccount: p.accountBank,
          currency: p.currencyOutput,
          paymentMethod: p.paymentMethodByCurrency,
          saleTransactionPaymentId: p.transactionSalesChargeId,
        }));
        console.log("cobrooos", data);

        if (data == null) {
          this.messageService.clear();
          this.messageService.add({
            severity: "error",
            summary: "Consulta",
            detail: "Ha ocurrido un error al cargar la transaccion de venta.",
          });
          this.loading = false;
          return;
        }

        this.onChangeCurrency(this.transact.transactionCurrencyId);
        this.onChangeExchangeRateByCurrency({
          value: this.transact.exchangeRateId,
        });

        this.loading = false;

        this.articles = this.transact.articles.map((art) => {
          const raw = this.artData.find((a) => a.articleId == art.articleId);
          return {
            ...raw,
            ...art,
            taxPlan: art.taxPlanId,
            cost: raw.cost,
            unitCost: art.cost,
            taxes: art.taxesArticles.map((t) => ({
              ...t,
              rateId: t.taxRateId,
              baseTaxRateId: t.taxBaseRateId,
              id: t.taxId,
            })),
            discounts: art.discountsArticles.map((d) => ({
              ...d,
              id: d.transactionSalesArticleDiscountId,
              discountTypeApplicationId: d.discountTypeId,
              discountTypeApplication: "Factura",
            })),
          };
        });

        // this.client = this.clients.find(c => c.idclientsupplier == this.transact.providerCustomerId)

        this.taxes = this.transact.taxes.map((t) => ({
          ...t,
          rateId: t.taxRateId,
          baseTaxRateId: t.taxBaseRateId,
          id: t.taxId,
        }));

        // const queryParams: any = {};
        // queryParams.filters = JSON.stringify(this.transfer);

        // this.onChangeBank({ value: this.transact.bankId })
        // this.onChangebankAccount({ value: this.transact.bankAccountId })
        // this.Total = (this.currencyList.find(c => c.id == this.transact.bankAccountCurrencyId)?.symbology || '') + '' + (this.transact.amount * 2).toLocaleString('es-Ve', { minimumFractionDigits: 4 });

        // this.bankAccountExchangeRate = this.bankAccountExchangeRateByCurrency
        //   .filter(b => b.exchangeTypeId == this.transact.taxeChangeId).map(c => ({
        //     label: c.destinationCurrencySymbol + c.conversionFactor,
        //     value: c.exchangeTypeId
        //   }))

        // this.bankAccountExchangeRateConver = this.bankAccountExchangeRateByCurrency
        //   .filter(b => b.exchangeTypeId == this.transact.converTaxeChangeId).map(c => ({
        //     label: c.destinationCurrencySymbol + c.conversionFactor,
        //     value: c.exchangeTypeId
        //   }))
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "Consulta",
          detail:
            "Ha ocurrido un error al cargar el detalle del ajuste bancario.",
        });
      }
    );
  }

  ngOnInit(): void {
    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      const latestKeystrokeTime = Date.now();

      if (latestKeystrokeTime - this.lastKeystrokeTime > 1500) {
        this.bufferArray = [];
      }

      this.bufferArray.push(key);

      const word = this.bufferArray.join("");
      if (word === this.cheatcode) {
        this.setManualMode();
      }
      this.lastKeystrokeTime = latestKeystrokeTime;
    });

    this.actRoute.queryParams.subscribe((param) => {
      this.idItem = param.id;
      this.indSaleTransactionDirect = param.indDirect == "true";
      console.log(this.indSaleTransactionDirect);
      this.fetchInitialSetup()
        .then(() => this.fetchData())
        // Totalmente cargado sin errores
        .then(() => {
          this.loaded = true;
        })
        // Quitar el indicador de carga aunque existan errores
        .finally(() => {
          this.loadingService.stopLoading();
        });
    });

    this.loadingService.startLoading();
    this.maxPostingDate = new Date();

    console.log(typeof this.indSaleTransactionDirect);
  }

  onChangeExchangeRateByCurrency(event) {
    const coin = this.currencyMap?.find(
      (c) => c.id == this.transact.transactionCurrencyId
    );
    console.log(
      this.bankAccountExchangeRateByCurrency.filter((b) =>
        b.exchangeTypeId === event.value && coin?.legalCurrency
          ? b.destinationCurrencyId == this.transact.transactionCurrencyId
          : b.originCurrencyId == this.transact.transactionCurrencyId
      )
    );
    const c = this.bankAccountExchangeRateByCurrency.find(
      (b) =>
        b.exchangeTypeId === event.value &&
        (coin?.legalCurrency
          ? b.destinationCurrencyId == this.transact.transactionCurrencyId
          : b.originCurrencyId == this.transact.transactionCurrencyId)
    );
    if (c) {
      this.transact.exchangeRateCoversionId = c.exchangeTypeId;
      this.bankAccountExchangeRate = c;
    }
  }

  currencyMap: Coins[];

  isBaseCurrency = () =>
    this.currencyMap?.find((c) => c.id == this.transact.transactionCurrencyId)
      ?.legalCurrency ?? true;
  currencySymbol = () =>
    this.currencyMap?.find((c) => c.id == this.transact.transactionCurrencyId)
      ?.symbology;
  currency = () =>
    this.currencyMap?.find((c) => c.id == this.transact?.transactionCurrencyId);
  currencyRate = () => this.bankAccountExchangeRate?.conversionFactor;

  onChangeBranchOffice(event) {
    return this.coinsService
      .getCoinxCompanyList({
        ...new CoinxCompanyFilter(),
        idCompany: event.value,
      })
      .toPromise()
      .then((data) => {
        this.currencyMap = data;
        this.currencys = data.map((c) => ({
          label: `${c.name} - ${
            c.legalCurrency ? "Moneda base" : "Moneda conversión"
          }`,
          value: c.id,
        }));
      })
      .catch((error: HttpErrorResponse) => {
        this.messageService.add({
          severity: "error",
          summary: "Consulta",
          detail: "Ha ocurrido un error al cargar los tipos tasa de cambio.",
        });
      });
  }

  back() {
    this.confirmationService.confirm({
      message:
        "¿Está seguro que desea regresar? perderá los cambios realizados.",
      key: "main",
      accept: () => {
        this.saving = true;
        this.router.navigate(["/financial/sales/sale-transactions"]);
      },
    });
  }

  Cancel() {
    this.confirmationService.confirm({
      message:
        "¿Está seguro que desea cancelar? luego no se podran editar los datos.",
      key: "main",
      accept: () => {
        this.salesService
          .PostTransactionsDetailCancel(this.oldTransact, this.idItem)
          .subscribe((data: number) => {
            if (data > 0) {
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.router.navigate(["/financial/sales/sale-transactions"]);
              this.messageService.add({
                severity: "success",
                summary: "Guardado",
                detail: "Guardado exitoso",
              });
            } else if (data == -1) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "El nombre ya se encuentra registrado.",
              });
              this.saving = false;
            } else if (data == -3) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Este registro no existe",
              });
            } else {
              this.saving = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Ha ocurrido un error al guardar los datos",
              });
            }
          });
      },
    });
  }

  getPaymentTotal() {
    return this.transformAmount(
      this.payments.reduce(
        (previousValue, actualValue) => previousValue + actualValue.amount,
        0
      )
    );
  }

  transformAmount(value: number): string {
    return (
      " $ " +
      value.toLocaleString("es") +
      " - " +
      "Bs. " +
      (value * 2500000).toLocaleString("es")
    );
  }

  Revoke() {
    this.confirmationService.confirm({
      message:
        "¿Está seguro que desea anular el ajuste? Esta acción no es reversible.",
      key: "main",
      accept: () => {
        this.salesService
          .PostTransactionsDetailRevoke(this.oldTransact, this.idItem)
          .subscribe((data: number) => {
            if (data > 0) {
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.router.navigate(["/financial/sales/sale-transactions"]);
              this.messageService.add({
                severity: "success",
                summary: "Guardado",
                detail: "Guardado exitoso",
              });
            } else if (data == -1) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "El nombre ya se encuentra registrado.",
              });
              this.saving = false;
              //this.article.associatedAccount = asso
            } else if (data == -3) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Este registro no existe",
              });
            } else {
              this.saving = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Ha ocurrido un error al guardar los datos",
              });
            }
          });
      },
    });
  }

  async ToRecord() {
    this.record = true;
    this.submitted = true;
    if (
      this.checkPostValidation() &&
      (!this.isBaseCurrency()
        ? this.transact.exchangeRateId > 0 &&
          this.transact.exchangeRateCoversionId > 0
        : true)
    ) {
      this.messageService.clear();
      this.saving = true;
      // this.transact.accountingAccount = this.accountCode;

      this.confirmationService.confirm({
        message:
          "¿Está seguro que desea contabilizar? luego no se podran editar los datos.",
        key: "main",
        accept: async () => {
          // this.send(1)
          const model = {
            ...this.transact,
            details: this.getDistributions().map(
              (d) =>
                ({
                  ...new SalesTransactionDetail(),
                  ...d,
                  accountingAcccountId: d.accountId,
                  branchOfficeId: +this.transact.branchOfficeId,
                  auxiliarIdDetail: d.auxiliaryId,
                } as SalesTransactionDetail)
            ),
          };
          try {
            const postData = await this.save().toPromise();
            if (postData == -1) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "El nombre ya se encuentra registrado.",
              });
              this.saving = false;
            } else if (postData === -3) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Este registro no existe",
              });
            } else {
              this.saving = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Ha ocurrido un error al guardar los datos",
              });
            }
            const recordData = await this.salesService
              .postTransaction(model)
              .toPromise();
            if (recordData > 0) {
              this.salesService
                .PostTransactionsDetailRecord(model, this.idItem)
                .subscribe((recordData: number) => {
                  if (recordData > 0) {
                    this.showDialog = false;
                    this.submitted = false;
                    this.saving = false;
                    this.router.navigate([
                      "/financial/sales/sale-transactions",
                    ]);
                    this.messageService.add({
                      severity: "success",
                      summary: "Guardado",
                      detail: "Guardado exitoso",
                    });
                  } else {
                    this.saving = false;
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Ha ocurrido un error al guardar los datos",
                    });
                  }
                });
            }
          } catch (err) {
            console.error(err);
          }
        },
      });
    }
  }

  appendToDistribution(dat: accountingAccounts) {
    this._distributions.push({
      description: dat.accountingAccount,
      accountCode: dat.accountingAccount,
      type: DistributionType.VENTA,
      sucursal: dat.branchOffice,
      auxiliary: dat.auxiliar,
      costCenter: dat.chargeCenter,
      indAux: dat.auxiliarId == -1 ? false : true,
      debit: 0,
      credit: 0,
    });
  }

  checkPostValidation = () =>
    this.transact.lotId > 0 &&
    this.transact.paymentConditionId > 0 &&
    this.transact.salesTypeId > 0 &&
    this.transact.transactionCurrencyId > 0;
  // && this.transact.exchangeRateId > 0
  // && this.transact.exchangeRateCoversionId > 0
  // && this.client?.idclientsupplier > 0

  save = () =>
    this.salesService.postTransaction({
      ...this.transact,
      providerCustomerId: this.client.idclientsupplier,
      taxes: this.taxes
        .filter((t) => !t.fromPlan)
        .map(
          (t) =>
            ({
              transactionSalesArticleTaxId:
                +t.transactionSalesArticleTaxId || -1,
              taxId: +t.id,
              taxBaseId: -1,
              source: 0,
              taxRateId: +t.rateId,
              taxBaseRateId: +t.baseTaxRateId || -1,
              indActivo: t.active,
            } as SalesTransactionTaxes)
        ),
      discounts: this.discounts.map((d) => ({
        ...d,
        transactionSalesDiscountId: d.id || -1,
      })),
      charges: this.payments.map<SalesTransactionPayment>((p) => ({
        transactionSalesChargeId: p.id,
        amount: p.amount,
        accountBankId: p.bankAccountId,
        bankId: p.bankId,
        exchangeRateConvertionId: p.converTaxeChangeId,
        currencyId: p.currencyId,
        paymentMethodByCurrencyId: p.currencyPaymentMethodId,
        indActivo: p.indActive,
        paymentMethodId: p.paymentMethodId,
        reference: p.reference,
        exchangeRateId: p.taxeChangeId,
      })),
      articles: this.articles.map((art) => {
        return {
          ...art,
          quantity: art.quantity || 1,
          taxPlanId: art.planImpuestoIdArt,
          indActivo: true,
          transactionSalesArticleId: art.transactionSalesArticleId || -1,
          cost: art.unitCost,
          discountsArticles: art.discounts.map(
            (d) =>
              ({
                ...d,
                transactionSalesArticleDiscountId: d.id || -1,
              } as SalesTransactionArticleDiscount)
          ),
          taxesArticles: art.taxes
            .filter((t) => t.active)
            .map(
              (t) =>
                ({
                  transactionSalesArticleTaxId:
                    +t.transactionSalesArticleTaxId || -1,
                  taxId: t.id,
                  taxBaseId: -1,
                  taxRateId: t.rateId,
                  taxBaseRateId: +t.baseTaxRateId || -1,
                  indActivo: true,
                } as SalesTransactionArticleTaxes)
            ),
        };
      }),
    });

  send(indSave: number = 0) {
    // console.log(this.discounts)
    // return
    this.submitted = true;
    if (this.checkPostValidation()) {
      this.messageService.clear();
      this.saving = true;
      // this.transact.accountingAccount = this.accountCode;
      this.save().subscribe((data) => {
        this.transact.providerCustomerId = this.client.idclientsupplier;
        this.transact.lotId = this.lot.id;

        if (data > 0) {
          this.showDialog = false;
          this.submitted = false;
          this.saving = false;
          if (indSave === 0) {
            this.router.navigate(["/financial/sales/sale-transactions"]);
            this.messageService.add({
              severity: "success",
              summary: "Guardado",
              detail: "Guardado exitoso",
            });
          }
        } else if (data === -1) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "El nombre ya se encuentra registrado.",
          });
          this.saving = false;
        } else if (data === -3) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Este registro no existe",
          });
        } else {
          this.saving = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Ha ocurrido un error al guardar los datos",
          });
        }
      });
    }
  }
}

export class accountingAccounts {
  idAssociate: number = -1;
  idAssociateArt: number = -1;
  idPlanCuentaContableDetalle: number = -1;
  accountingAccount: string = "";
  descripcionAssociate: string = "";
  accountingAccountCode: string = "";
  indPermiteAuxiliar: boolean = false;
  indActivo: boolean = true;
  tipoUsoCuentaId: number = -1;
  tipoUsoCuenta: string = "";
  auxiliarId: number = -1;
  auxiliar: string = "";
  origenArt: string = "";
  chargeCenterId: number = -1;
  chargeCenter: string = "";
  branchOffice: string = "";
  branchOfficeId: number = -1;
  accountName: string = "";
}
