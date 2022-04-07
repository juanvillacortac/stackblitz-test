import { Coins } from './coin';

export class PaymentMethod {
    id: number;
    name: string;
    active: boolean;
    paymentMethodGroupId: number;
    paymentMethodGroup: string;
    currencies: Coins[];
    currenciesNames: string;
    initialConfiguration: Boolean;
    createdByUserId: number;
 }

 export class PaymentMethodResult {
    id: number;
    name: string;
    active: boolean;
    paymentMethodGroupId: number;
    paymentMethodGroup: string;
    currencies: string;
    initialConfiguration: Boolean;
    createdByUserId: number;
 }
