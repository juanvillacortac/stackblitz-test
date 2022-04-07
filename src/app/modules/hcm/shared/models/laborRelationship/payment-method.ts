
export class PaymentMethod {
    id: number = -1;
    createdByUserId: number = -1;
    updatedByUserId: number = -1;
    paymentMethodName: string = "";
    abbreviation: string = "";
    active: boolean;
    indInitialConfiguration: boolean;
}