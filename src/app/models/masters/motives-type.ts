import { BaseModel } from "../common/BaseModel";

export class MotivesType extends BaseModel { 
    abbreviation : string;
    active:boolean;
    module: string;
    idModule:number;  
    createdByUser: string;
    createdByUserId?:number;
    updatedByUser: string;
    updatedByUserId?:number;  

}