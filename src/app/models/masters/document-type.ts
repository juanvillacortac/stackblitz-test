import { BaseModel } from "../common/BaseModel";
import { Country } from "./country";
import { EntityType } from "./entity-type";

export class DocumentTypes extends BaseModel { 
entityType: EntityType;
country : Country;
identifier : string;
indAlphanumeric : boolean;
active:boolean;
createdByUser: string;
updatedByUser: string;
}
