import { SpecificationValues } from "src/app/modules/products/shared/view-models/specificationvalues";
import { Attribute } from "../masters-mpc/attribute";
import { Attributeagrupation } from "../masters-mpc/attributeagrupation";
import { Attributeoption } from "../masters-mpc/attributeoption";
import { Attributetype } from "../masters-mpc/common/attributetype";
import { measurementunits } from "../masters-mpc/measurementunits";

export class Specification {
    id: number= -1;
    productId: number=-1;
    unitsmeasurement: measurementunits = new measurementunits();
    attributeagrupation:Attributeagrupation =  new Attributeagrupation();
    idAttribute: number = -1;
    attributes:Attribute = new Attribute();
    attributeTypes: Attributetype = new Attributetype();
    createdByUserId:number=-1;
    updatedByUser: string="";
    createdByUser: string="";
    active: boolean = false;
    createdDate: Date;
    updatedDate: Date;
    values: SpecificationValues[] = [];
    value: string = "";
}
