export class ExchangeRates{
    idExchangeRate: number = -1;
    idExchangeRateType: number = -1;
    idOiriginCurrency: number = -1;
    idDestinationCurrency: number = -1;
    userId: number = -1;
    exchangeRateType: string = "";
    originCurrency: string = "";
    destinationCurrency: string = "";
    createbyUser: string = "";
    conversionFactor: number = 0;
    effectiveDate: Date = new Date();
}