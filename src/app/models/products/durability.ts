import { Ambient } from "src/app/models/masters-mpc/common/ambient";
import { measurementunits } from "src/app/models/masters-mpc/measurementunits";

export class Durability {
    id: number = -1;
    idDurability: number = -1;
    idProductDurability: number = -1;
    temperature: number = 0;
    measurementUnitId: number = 0;
    measurementUnit: measurementunits;
    idAmbient: number = -1;
    ambient: Ambient;
    duration: number = 0;
    createdByUser: string = "";
    updateByUser: string = "";
    createdDate: Date;
    updateDate: Date;
    active: boolean = false;
    edit: boolean = false;
    stringCreateDate: string = "";
    stringUpdateDate: string = "";
}