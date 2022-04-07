import { BaseModel } from "../common/BaseModel";
import { MotivesType } from "./motives-type";

export class Motives extends BaseModel { 
    abbreviation : string;
    active:boolean;
    motiveType: MotivesType;
    createdByUser: string;
    createdByUserId?:number;
    updatedByUser: string;
    updatedByUserId?:number;  

}