export class ExchangeRateByCurrency {

    id: number = -1


    exchangeTypeId: number = -1


    exchangeType: string = ""


    originCurrencyId: number = -1


    originCurrencySymbol: string = ""


    destinationCurrencyId: number = -1


    destinationCurrencySymbol: string = ""


    conversionFactor: number = -1


    effectiveDate: string = ""
}

export class ExchangeRateByCurrencyFilter {

    currencyId: number = 2


    exchangeTypeId: number = -1

}