import { BaseModel } from "../common/BaseModel";
import { Country } from "./country";
import { TaxeTypeApplication } from "./taxe-type-application";
import { AccountingAccountTax } from "./accounting-account-tax";

export class Tax extends BaseModel { 
    taxeTypeApplication: TaxeTypeApplication[];
    country: Country;
    abbreviation: string;
    taxTypeId: number;
    TaxType: string;
    taxBaseTypeId: number;
    taxBaseType: string;
    taxBaseId: number;
    TaxBase: string;
    AbbreviationTaxBase: string;
    ActiveTaxBase: boolean;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;
    BusinessId: number =1;
    AccountingAccountId: number;
    AuxiliaryId: number;
    accounts: AccountingAccountTax[];
}
