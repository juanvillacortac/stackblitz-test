import { MeasurementUnits } from "src/app/modules/masters-mpc/shared/view-models/measurement-units.viewmodel";
import { SpecificationValues } from "src/app/modules/products/shared/view-models/specificationvalues";
import { IdentifierType } from "../security/IdentifierType";
import { Attributeagrupation } from "./attributeagrupation";
import { Attributeoption } from "./attributeoption";
import { Attributetype } from "./common/attributetype";
import { measurementunits } from "./measurementunits";

export class Attribute {
    id: number = -1;
    name: string = "";
    description: string = "";
    abbreviation: string = "";
    attributeType: Attributetype = new Attributetype();
    attributeAgrupation: Attributeagrupation =  new Attributeagrupation();
    measurementUnit: measurementunits = new measurementunits();
    attributeOptions: Attributeoption[] = new Array<Attributeoption>(); 
    createdByUserId: number = -1;
    createdByUser: string = "";
    updatedByUserId: number = -1;
    updatedByUser: string = "";
    createdDate: Date;
    updatedDate: Date;
    active: boolean = true;
    indInitialConfiguration: boolean = false;
}