import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { PaymentMethodGroup } from 'src/app/models/masters/payment-method-group';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { PaymentMethodService } from '../shared/services/payment-method.service';

@Component({
  selector: 'app-payment-method-filters',
  templateUrl: './payment-method-filters.component.html',
  styleUrls: ['./payment-method-filters.component.scss']
})
export class PaymentMethodFiltersComponent implements OnInit {

  paymentMethodGroups: SelectItem<PaymentMethodGroup[]> = {value: null};
  currencies: SelectItem<Coins[]> = {value: null};
  status: SelectItem[] = [
    {label: 'INACTIVO', value: 2},
    {label: 'ACTIVO', value: 1}
  ];

  selectedPaymentMethodGroup: PaymentMethodGroup;
  selectedCurrency: Coins;
  active: number;

  @Input() expanded = false;
  @Input() filters: PaymentMethodFilters;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<PaymentMethodFilters>();

  constructor(private paymentMethodService: PaymentMethodService, private currencyService: CoinsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.active = null;
    this.selectedPaymentMethodGroup = null;
    this.selectedCurrency = null;

    this.getCurrencies();
    this.getPaymentMethodGroups();
  }

  getPaymentMethodGroups = () => {
    return  this.paymentMethodService.getPaymentMethodGroups().subscribe((data: PaymentMethodGroup[]) => {
      this.paymentMethodGroups.value = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los grupos de formas de pago' });
    });
  }

  getCurrencies = () => {
    return  this.currencyService.getCoinsList().subscribe((data: Coins[]) => {
      this.currencies.value = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los grupos de formas de pago' });
    });

  }

  search() {
    this.filters.currencyId = this.selectedCurrency ? this.selectedCurrency.id : -1;
    this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
    this.filters.paymentMethodGroupId = this.selectedPaymentMethodGroup ?  this.selectedPaymentMethodGroup.id : -1;
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.id = -1;
    this.filters.name = '';
    this.filters.currencyId = -1;
    this.filters.active = -1;
    this.filters.paymentMethodGroupId = -1;
    this.active = null;
    this.selectedPaymentMethodGroup = null;
    this.selectedCurrency = null;
  }

}
