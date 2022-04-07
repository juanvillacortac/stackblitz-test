import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Article, ArticleType } from 'src/app/models/financial/article';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ArticleFilter } from 'src/app/models/financial/articleFilter';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { TaxPlan, TaxPlanRawTax } from 'src/app/models/masters/tax-plan';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-article-filters',
  templateUrl: './article-filters.component.html',
  styleUrls: ['./article-filters.component.scss']
})
export class ArticleFiltersComponent implements OnInit {


  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: ArticleFilter;
  @Output() onSearch = new EventEmitter<ArticleFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    { label: 'Todos', value: 0 },
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 }
  ];

  taxPlanId: number;
  taxId: number;

  @Input() costCenters: CostCenter[];
  @Input() classifications: ArticleClassification[];
  @Input() types: ArticleType[];
  @Input() taxPlans: TaxPlan[];
  @Input() rawTaxes: TaxPlanRawTax[];

  filteredTaxes(taxPlanId: number) {
    const plan = this.taxPlans.find(p => p.id == taxPlanId)
    if (!plan) {
      return this.rawTaxes.map(t => ({
        label: t.abbreviation+'-'+ t.name,
        value: t.id,
      }))
    }
    return this.rawTaxes.filter(t => plan.taxes.some(pt => pt.taxId == t.id)).map(t => ({
        label: t.abbreviation || t.name,
        value: t.id,
      }))
  }

  id: number;
  nombre: string;
  idClasification: number;
  idType: number;
  idTaxPlan: number;
  idTaxation: number;
  idCostCenter: number;
  active: number;

  // classificationlist: SelectItem[]; 
  // selectedclassification: Article;
  constructor() { }

  ngOnInit(): void {

    this.clearFilters();
  }

 
  search() {
 
    this.filters.articleId = this.id ? this.id : -1
    this.filters.articleName = this.nombre ? this.nombre.trim() : ''
    this.filters.claseArticuloId = this.idClasification ? this.idClasification : -1
    this.filters.tipoArticuloId = this.idType ? this.idType : -1
    this.filters.planImpuestoId = this.idTaxPlan ? this.idTaxPlan : -1
    this.filters.articuloImpuestoId = this.idTaxation ? this.idTaxation : -1
    this.filters.centroCostoId = this.idCostCenter ? this.idCostCenter : -1
    this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);

  }

  clearFilters() {
debugger
    this.id = null;
    this.nombre = null;
    this.idClasification = null;
    this.idType = null;
    this.idTaxPlan = null;
    this.idTaxation = null;
    this.idCostCenter = null;
    this.active = null;

  }
}
