import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Article, ArticlePage, ArticleType, ArticleTypeFilter } from 'src/app/models/financial/article';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ARTICLE_CLASSIFICATION_ALL_ACTIVES_FILTER } from 'src/app/models/financial/ArticleClassificationFilter';
import { ArticleFilter } from 'src/app/models/financial/articleFilter';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { TaxPlan, TaxPlanDetail, TaxPlanFilter, TaxPlanRawTax } from 'src/app/models/masters/tax-plan';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { CostCenterFilters } from 'src/app/modules/masters/cost-center/shared/filters/cost-center-filters';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { TaxPlanService } from 'src/app/modules/masters/tax-plan/shared/services/tax-plan.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ArticleClassificationService } from '../../article-classification/shared/services/article-classification.service';
import { ArticleService } from '../shared/services/article.service';

type ArticleTable = Article & {
  dateStr?: string
  costoStr?: string
  taxStr?: string
  taxPlanStr?: string
}

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  currentPage = 1
  elementsPerPage = 10
  totalPaginatorElements: number = null

  showDialog = false;
  showFilters: boolean = false;
  article = new Article();
  articles: ArticleTable[] = [];
  articleFilter = new ArticleFilter();
  displayedColumns: ColumnD<any>[] =
    [

      { template: (data) => { return data.articleId; }, field: 'articleId', header: 'Código', display: 'table-cell' },
      { template: (data) => { return data.articleName; }, field: 'articleName', header: 'Artículo', display: 'table-cell' },
      { template: (data) => { return data.claseArticulo; }, field: 'claseArticulo', header: 'Clasificación', display: 'table-cell' },
      { template: (data) => { return data.tipoArticulo; }, field: 'tipoArticulo', header: 'Tipo', display: 'table-cell' },
      { template: (data) => { return data.centroCosto; }, field: 'centroCosto', header: 'Centro de costo', display: 'table-cell' },
      { template: (data) => data.taxPlanStr, field: 'taxPlanStr', header: 'Plan de impuestos', display: 'table-cell' },
      { template: (data) => null, field: 'taxStr', header: 'Impuesto', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'costoStr', header: 'Costo', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.dateStr; }, field: 'dateStr', header: 'Fecha de creación', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { template: (data) => { return data.updateByUser; }, field: 'updateByUser', header: 'Actualizado por', display: 'table-cell' },

    ];
  loading = false;

  costCenters: CostCenter[];
  classifications: ArticleClassification[];
  types: ArticleType[];
  taxPlans: TaxPlan[];
  rawTaxes: TaxPlanRawTax[];

  constructor(
    public _articleService: ArticleService,
    public costCenterService: CostCenterService,
    public classificationService: ArticleClassificationService,
    public taxPlanService: TaxPlanService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private loadingService: LoadingService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Artículos', routerLink: ['/financial/masters/article-list'] }
    ]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading()
    this.fetchData()
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading()
      })
  }

  log = console.log

  changePage(e) {
    this.elementsPerPage = e.rows
    this.currentPage = e.page + 1
    this.search()
  }

  isolatedAux(aux: any[]) {
    return aux.slice(1, aux.length).map(a => a.abreviatura).join(', ')
  }

  new() {
    this.router.navigate(['/financial/masters/detail-article', 0,]);
  }

  toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  edit(_article: Article) {
    debugger
    this.articleFilter.articleId = _article.articleId;
    this.router.navigate(['/financial/masters/detail-article', this.articleFilter.articleId,]);

  }

  search(reset = false) {
    if (reset) {
      this.currentPage = 1
    }
    return this._articleService.getArticleList({ ...this.articleFilter, numeroPagina: this.currentPage, registrosPagina: this.elementsPerPage }).toPromise().then((data: ArticlePage) => {
      this.totalPaginatorElements = data.registers
      console.log(data)
      this.articles = data.articles.sort((a, b) => 0 - (a.articleId < b.articleId ? -1 : 1)).map<ArticleTable>(aa => ({
        ...aa,
        taxation: aa.taxes.map(a => a.abreviatura).join(' '),
        dateStr: this.toDate(aa.createdDate),
        taxPlanStr: aa.planImpuestoArt || '',
        costoStr: aa.cost.map(c => `${c.costo} ${c.costoLetras}`).join(' '),
        taxStr: aa.taxes.length ? aa.taxes.map(c => c.abreviatura).join(' ') : ''
      }));
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los artículos." });
    });
  }

  quickSearch: string

  fetchData() {
    if (this.loading)
      return;
    this.loading = true
    return this.search()
      .then(() => {
        this.loadingService.stopLoading()
      })
      .then(() => this.taxPlanService.getList({
        ...new TaxPlanFilter(),
        active: 1, 
      }).toPromise())
      .then(plans => this.taxPlans = plans.filter(p => p.taxes.length).sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this.taxPlanService.getRawTaxes().toPromise())
      .then(taxes => this.rawTaxes = taxes)
      .then(() => this._articleService.getTypes({
        ...new ArticleTypeFilter(),
        active: 1,
      }).toPromise())
      .then(types => this.types = types.sort((a, b) => a.typeOfArticleName.localeCompare(b.typeOfArticleName)))
      .then(() => this.classificationService.getArticleClassificationList({
        ...ARTICLE_CLASSIFICATION_ALL_ACTIVES_FILTER,
        active: 1,
      }).toPromise())
      .then(classifications => this.classifications = classifications.sort((a, b) => a.articleClassificationName.localeCompare(b.articleClassificationName)))
      .then(() => this.costCenterService.getCentersCostsList({
        ...new CostCenterFilters(),
        active: 1,
      }).toPromise())
      .then(costCenters => this.costCenters = costCenters.sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => {
        this.loading = false
      })
  }
}
