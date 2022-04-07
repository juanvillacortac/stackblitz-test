import { Attributeoption } from "src/app/models/masters-mpc/attributeoption";

export class AttributeFilter {
    id: number = -1;
    idAttributeAgrupation: number = -1;
    idAttributeType: number = -1;
    idMeasurementUnit: number = -1;
    idGroupingUnitMeasure: number = -1;
    attributeOptions: Attributeoption[];
    name: string = "";
    active: number = -1;
    idUser: number = -1;
}
