import { MeasurementUnits } from "src/app/modules/masters-mpc/shared/view-models/measurement-units.viewmodel";
import { IdentifierType } from "../security/IdentifierType";
import { Attributeagrupation } from "./attributeagrupation";
import { measurementunits } from "./measurementunits";

export class Attributeoption {
    id: number = -1;
    name: string = "";
    abbreviation: string = "";
    attributeAgrupation: Attributeagrupation = new Attributeagrupation();
    measurementUnit: measurementunits = new measurementunits();
    createdByUserId: number = -1;
    createdByUser: string = "";
    updatedByUserId: number = -1;
    updatedByUser: string = "";
    createdDate: Date;
    updatedDate: Date;
    active: boolean = true;
    indInitialConfiguration: boolean = false;
}