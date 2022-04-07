import { BaseModel } from "../common/BaseModel";
import { Country } from "./country";
import { priceGrouping } from "./price-grouping";

export class PriceType extends BaseModel { 
    pricesGrouping: priceGrouping;
    country: Country;
    abbreviation : string;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;

}