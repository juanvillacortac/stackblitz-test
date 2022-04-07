import { BaseModel } from "../common/BaseModel";
import { RateType } from "./rate-type";
import { Tax } from "./tax";
import { TaxRateApplication } from "./tax-rate-application";
export class TaxRate extends BaseModel { 
   
    tax: Tax;
    rateType: RateType;
    abbreviation : string;
    value: number;
    taxBaseId: number;
    taxBase: string;
    abbreviationTaxBase: string;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;
    baseTaxRateId: number;
    baseTaxRate: string;
    axable: string;
    BaseFrom: string;
    BaseUp: string;
    tributaryCode: string;
    taxRateApplication: TaxRateApplication[];

}
