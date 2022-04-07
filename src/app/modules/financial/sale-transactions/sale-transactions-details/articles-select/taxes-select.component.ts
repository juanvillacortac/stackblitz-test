import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { ColumnD } from "src/app/models/common/columnsd";
import { Article } from "src/app/models/financial/article";
import { ArticleFilter } from "src/app/models/financial/articleFilter";
import { SalesTransactionDiscount } from "src/app/models/financial/sale-transactions";
import { Coins } from "src/app/models/masters/coin";
import { UserPermissions } from "src/app/modules/security/users/shared/user-permissions.service";
import { ArticleService } from "../../../article/shared/services/article.service";
import { AccountingPlanBase } from "../../../initial-setup/shared/accounting-plan-base.component";
import { transactionSalesDiscountDataTable } from "../../sale-transactions-discount-tree/sale-transactions-discount-tree.component";
import { TaxWOrigin } from "../taxes-select/taxes-select.component";

export type ArticleCRUD = Omit<Article, "taxes"> & {
  transactionSalesArticleId?: number;
  unitCost?: number;
  quantity?: number;
  active?: boolean;
  taxPlan?: number;
  taxes?: TaxWOrigin[];
  discounts?: transactionSalesDiscountDataTable[];
};

@Component({
  selector: "app-sale-transactions-articles-select",
  templateUrl: "./taxes-select.component.html",
  styleUrls: ["./taxes-select.component.scss"],
})
export class SaleTransactionsArticlesSelectComponent
  extends AccountingPlanBase
  implements OnInit
{
  submitted = false;

  @Input() currencyMap: Coins[];
  @Input() currency: Coins;
  @Input() currencyRate: number;

  getCurrency = (id: number) => this.currencyMap.find((c) => c.id == id);

  getPrice = (article: ArticleCRUD, mode: "cost" | "total") => {
    const isBase = this.currencyMap.find(
      (c) => c.id == article.monedaIdArt
    )?.legalCurrency;
    const baseCurrency = this.currencyMap.find((c) => c.legalCurrency);
    const conversionCurrency = this.currencyMap.find((c) => !c.legalCurrency);
    const cost =
      mode == "cost" ? this.calcCost(article) : this.calcTotal(article);
    const format = (s: string, n: number) =>
      s +
      " " +
      n.toLocaleString("es", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    console.log(
      {
        conversion: format(
          conversionCurrency.symbology,
          cost / (!isBase ? 1 : this.currencyRate)
        ),
        base: format(
          baseCurrency.symbology,
          cost * (isBase ? 1 : this.currencyRate)
        ),
      },
      isBase,
      this.currencyRate
    );
    const values = {
      conversion: cost / (!isBase ? 1 : this.currencyRate),
      base: cost * (isBase ? 1 : this.currencyRate),
    };
    return {
      conversion: format(conversionCurrency.symbology, values.conversion),
      base: format(baseCurrency.symbology, values.base),
      raw: values[isBase ? "base" : "conversion"],
    };
  };

  @Input() taxPlans: SelectItem[];

  artCols: ColumnD<ArticleCRUD>[] = [
    {
      template: (t) => t.articleId,
      field: "id",
      header: "Código",
      display: "table-cell",
    },
    {
      template: (t) => t.articleName,
      field: "abbreviation",
      header: "Artículo",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "taxPlan",
      header: "Plan de impuestos",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "quantity",
      header: "Cantidad",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "unitCost",
      header: "Costo unitario",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "cost",
      header: "Costo",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "total",
      header: "Costo total",
      display: "table-cell",
    },
  ];

  calcCost(article: ArticleCRUD) {
    const cost = article.quantity * article.unitCost;
    const percent = article.discounts
      .filter((t) => t.indActivo && t.discountTypeId == 1)
      .map((t) => t.discountValue)
      .reduce((a, b) => a + b, 0);
    const fixed = article.discounts
      .filter((t) => t.indActivo && t.discountTypeId != 1)
      .map((t) => t.discountValue)
      .reduce((a, b) => a + b, 0);
    const toSubstract = ((percent / 100) * cost) + fixed;
    return cost - toSubstract;
  }

  calcTotal(article: ArticleCRUD) {
    const cost = this.calcCost(article);
    const percent = article.taxes
      .filter((t) => t.active)
      .map((t) => t.rateValue + (t.baseTaxRateValue || 0))
      .reduce((a, b) => a + b, 0);
    const toAdd = (percent / 100) * cost;
    return cost + toAdd;
  }

  @Output() totalChange = new EventEmitter<number>();

  updateParent() {
    const total = this.articles
      .map((c) => this.calcTotal(c))
      .reduce((a, b) => a + b, 0);
    this.articlesChange.emit(this.articles);
    this.totalChange.emit(total);
  }

  log = console.log;

  constructor(
    public breadcrumbService: BreadcrumbService,
    public userPermissions: UserPermissions,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private articleService: ArticleService,
    injector: Injector
  ) {
    super(injector);
  }

  clientModal = false;

  maxPostingDate: Date;

  expanded: { [key: string]: boolean } = {};

  ngOnInit() {
    this.maxPostingDate = new Date();
    if (!this.artData) {
      this.articleService
        .getArticleList({
          ...new ArticleFilter(),
          registrosPagina: 10000,
          numeroPagina: 1,
        })
        .toPromise()
        .then((arts) => {
          this.artData = arts.articles;
        });
    }
  }

  toDate = (date: string | Date) => new Date(date);

  @Input() articles: ArticleCRUD[] = [];
  @Output() articlesChange = new EventEmitter<ArticleCRUD[]>();

  @Input() artData: Article[];

  articleData: {
    raws?: Article[];
    crud?: ArticleCRUD[];
  } = {
    crud: [],
    raws: [],
  };

  addArticleToTable(article?: Article) {
    if (!article) return;
    const crud: ArticleCRUD[] = [
      ...this.articles?.map((t) => ({ ...t, edit: false })),
    ];
    const idx = this.articles.findIndex(
      (t) => t.articleId == article.articleId
    );
    if (idx >= 0) {
      this.messageService.clear();
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Artículo ya registrado",
      });
      return;
    }
    console.log(article);
    crud.push({
      ...article,
      quantity: 1,
      unitCost: article.costoArt,
      taxes: [],
      discounts: [],
    });
    this.articles = [...crud];
    this.updateParent();
  }

  delArticle(id: number, confirm = true) {
    const del = () => {
      const crud = [...this.articles];
      const idx = crud.findIndex((t) => t.articleId == id);
      // crud[idx].active = false
      // crud[idx].edit = false
      // Now this
      crud.splice(idx, 1);
      this.articles = [...crud];
      this.updateParent();
    };
    if (confirm) {
      this.confirmationService.confirm({
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        message: "¿Está seguro que desea descartar el artículo?",
        accept: del,
      });
    } else {
      del();
    }
  }
}
