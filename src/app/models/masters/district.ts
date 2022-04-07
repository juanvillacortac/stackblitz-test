import { BaseModel } from "../common/BaseModel";
import { Country } from "./country";
import { State } from "./state";

export class District extends BaseModel { 
    state: State;
    country: Country;
    abbreviation : string;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;

}