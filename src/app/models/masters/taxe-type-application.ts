import { BaseModel } from "../common/BaseModel";


export class TaxeTypeApplication extends BaseModel { 
    abbreviation : string;
    active:boolean = true;
    createdByUser: string;
    createdByUserId?:number;
    updatedByUser: string;
    updatedByUserId?:number;  

}