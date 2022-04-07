import { ConversionRate } from "./conversion-rate";

export class ConversionRateList{
    
    idCurrency: number = -1;
    currency: string = "";
    symbology: string = "";
    abbreviation: string = "";
    list: ConversionRate[] = [];
}