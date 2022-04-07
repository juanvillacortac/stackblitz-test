import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DiscountRateService } from '../../discountrate/shared/discountrate.service';
import { PaymentConditionFilter } from '../../shared/filters/payment-condition-filter';
import { PaymentconditionService } from '../shared/paymentcondition.service';

@Component({
  selector: 'app-payment-conditions-filters',
  templateUrl: './payment-conditions-filters.component.html',
  styleUrls: ['./payment-conditions-filters.component.scss']
})
export class PaymentConditionsFiltersComponent implements OnInit {

  constructor(private paymentConditionService: PaymentconditionService, private disocuntrate: DiscountRateService,
    private messageService: MessageService) { }


  @Input() expanded: boolean = false;
  @Input("filters") filters: PaymentConditionFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  cboDiscountRates: SelectItem[] = [];


  @Output("onSearch") onSearch = new EventEmitter<PaymentConditionFilter>();

  paymentConditionFilters: PaymentConditionFilter = new PaymentConditionFilter();

  statuslist: SelectItem[] = [
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' }
  ];
  ngOnInit(): void {
    this.getDiscountRates();
    this.filters.active = -1;
  }

  search() {
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.amounterm = -1;
    this.filters.idPaymentCondition = -1;
    this.filters.idDiscountType = -1;
    this.filters.name = "";
    this.filters.active = -1;

  }

  getDiscountRates = () => {
    return this.disocuntrate.getDiscountRateList().subscribe((data) => {
      this.cboDiscountRates = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los tipos de descuentos' });
    });

  }

}
