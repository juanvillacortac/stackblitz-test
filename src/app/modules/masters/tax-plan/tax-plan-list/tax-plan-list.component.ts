import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { TaxPlanFiltersComponent } from '../tax-plan-filters/tax-plan-filters.component';
import { TaxPlanTreeComponent } from '../tax-plan-tree/tax-plan-tree.component';
import { TaxPlan, TaxPlanApplicationType, TaxPlanFilter, TaxPlanRawTax } from 'src/app/models/masters/tax-plan';
import { TaxPlanService } from '../shared/services/tax-plan.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { TaxeTypeApplicationService } from '../../taxe-type-application/shared/taxe-type-application.service';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxPlanMutationModalComponent } from '../tax-plan-mutation-modal/tax-plan-mutation-modal.component';

@Component({
  selector: 'app-tax-plan-list',
  templateUrl: './tax-plan-list.component.html',
  styleUrls: ['./tax-plan-list.component.scss']
})
export class TaxPlanListComponent implements OnInit {
  plans: TaxPlan[]
  taxes: TaxPlanRawTax[]
  loaded = false
  showFilters: boolean = false;
  showDialog = false;

  isFiltered = false

  types: TaxPlanApplicationType[];
  appTypes: TaxeTypeApplication[];

  @ViewChild(TaxPlanTreeComponent, { static: true }) treeComp: TaxPlanTreeComponent;
  @ViewChild(TaxPlanMutationModalComponent) modal: TaxPlanMutationModalComponent;
  @ViewChild(TaxPlanFiltersComponent) filters: TaxPlanFiltersComponent;

  constructor(
    private service: TaxPlanService,
    private applicationTypeService: TaxeTypeApplicationService,
    private loadingService: LoadingService,
    private msgService: MessageService,
    public breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Planes de impuestos', routerLink: ['/masters/tax-plans'] }
    ]);
  }

  fetchPlans(filter = new TaxPlanFilter()) {
    return this.service.getList(filter)
      .toPromise()
  }

  lastFilter: TaxPlanFilter

  async refreshModalData() {
    await this.fetchData(undefined, true)
    this.modal?.refreshChecked()
    this.modal?.filterTable()
    if (this.modal?.filterAppIds?.length || this.modal?.plan?.taxes.length === 0) {
      this.modal.loaded = true
    }
  }

  fetchData(filter = new TaxPlanFilter(), lastFilter = false) {
    if (!lastFilter) {
      this.lastFilter = filter
    }

    return this.service.getRawTaxes().toPromise()
      .then((taxes) => {
        this.taxes = taxes.filter(t => t.rates.length)
      })
      .then(() => this.fetchPlans(lastFilter ? this.lastFilter : filter))
      .then((plans) => {
        this.plans = plans.sort((a, b) => b.id - a.id).map(p => ({
          ...p,
          taxes: p.taxes.filter(t => t.active && this.taxes.find(r => t.taxId == r.id)),
        }))
        if (this.filters) {
          this.filters.cancelLoading()
        }
      })
      .then(() => this.applicationTypeService.getTaxeTypeApplications({
        id: -1,
        active: 1,
        name: '',
      }))
      .then((types: TaxeTypeApplication[]) => {
        this.appTypes = types
      })
      .then(() => this.service.getRawTaxes().toPromise())
      .then((taxes) => {
        this.taxes = taxes.filter(t => t.rates.length)
        console.log(this.taxes)
      })
  }

  ngOnInit(): void {
    this.loadingService.startLoading()
    this.fetchData()
      .then(() => this.service.getApplicationTypes().toPromise())
      .then((types) => {
        this.types = types
      })
      // Totalmente cargado sin errores
      .then(() => {
        this.loaded = true
      })
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading()
      })
  }

  update() {
  }
}
