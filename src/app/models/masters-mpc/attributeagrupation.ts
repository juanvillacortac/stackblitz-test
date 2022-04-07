import { IdentifierType } from "../security/IdentifierType";

export class Attributeagrupation {
    id: number = -1;
    name: string = "";
    description: string = "";
    attributesChilds: number = 0;
    attributeOptionsChilds: number = 0;
    createdByUserId: number = -1;
    createdByUser: string = "";
    updatedByUser: string = "";
    createdDate: Date;
    updatedDate: Date;
    active: boolean = true;
    initialSetup: boolean = false;
}