export class PaymentMethodByCurrencyFilter {
  idPaymentMethod = -1;
  idCurrency = -1;
  indActive = 1;
}

export class PaymentMethodByCurrency {
  idPaymentMethodByCurrency: number;
  idPaymentMethod: number;
  paymentMethod: string;
  idCurrency: number;
  abreviatura: string;
  currency: string;
  symbol: string;
  indActive: boolean;
}
