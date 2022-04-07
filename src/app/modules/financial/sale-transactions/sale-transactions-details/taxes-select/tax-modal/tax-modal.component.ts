import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { TaxPlan, TaxPlanRawTax } from 'src/app/models/masters/tax-plan';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxWOrigin } from '../taxes-select.component';

@Component({
  selector: 'app-sale-transactions-taxes-select-modal',
  templateUrl: './tax-modal.component.html',
  styleUrls: ['./tax-modal.component.scss'],
})
export class SaleTransactionsTaxesSelectModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @Input() rateOptions = {}
  @Input() baseRateOptions = {}

  taxTypeFilterIds: number[] = []

  selectedTax: number;
  selectedRate: number;
  selectedBaseTaxRate: number;

  @Output() onSelect = new EventEmitter<{
    selectedTax: number
    selectedRate: number
    selectedBaseTaxRate: number
  }>();

  @Input() taxData: {
    plans?: TaxPlan[]
    raws?: TaxPlanRawTax[]
    types?: TaxeTypeApplication[]
    wOrigin?: TaxWOrigin[]
    wOriginTable?: TaxWOrigin[]
  }

  loaded = false

  getTaxList = (taxes: TaxPlanRawTax[], ids: number[], wOrigin: TaxWOrigin[]) => [
    ...(ids?.length ? taxes
      .filter(t => ids.some(id => t.applicationTypeIds.some(tid => tid == id))) : taxes)
      .map(p => ({
        label: p.abbreviation + '-' + p.name + (p.baseTaxId ? ' (compuesto)' : ''),
        value: p.id,
      }))]


  getRateOptions = (taxId): SelectItem<number>[] => this.taxData.raws.find(t => t.id == taxId)?.rates.map(r => ({
    label: `${r.name} - ${r.value}${r.typeId == 1 ? '%' : ''}`,
    value: r.id,
  }))

  getBaseRateOptions = (taxId): SelectItem<number>[] => this.taxData.raws.find(t => t.id == taxId)?.baseTaxRates.map(r => ({
    label: `${r.name} - ${r.value}${r.typeId == 1 ? '%' : ''}`,
    value: r.id,
  })) || []

  getRateName = (taxId: number, rateId: number) => this.getRateOptions(taxId)?.find(r => r.value == rateId)?.label
  getBaseRateName = (taxId: number, rateId: number) => this.getBaseRateOptions(taxId)?.find(r => r.value == rateId)?.label

  getBaseTax = (taxId: number) => {
    const tax = this.taxData.raws.find(rt => rt.id == +taxId)
    if (tax?.baseTaxId) {
      return this.taxData.raws.find(rt => rt.id == tax.baseTaxId)
    }
  }

  log = console.log

  constructor() {
  }

  select() {
    this.onSelect.emit({
      ...this
    })
    this.hideDialog()
  }

  ngOnInit(): void {
    this.displayModalChange.emit(this.displayModal);
  }

  filtered = false

  clear() {
    this.taxTypeFilterIds = []
    this.selectedBaseTaxRate = null
    this.selectedRate = null
    this.selectedTax = null
  }

  hideDialog() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
    this.clear()
  }
}
