import { Packingtype } from "../masters-mpc/common/packingtype";
import { Status } from "../masters-mpc/common/status";
import { Packagingpresentation } from "../masters-mpc/packagingpresentation";
import { Area } from "../masters/area";
import { Branchoffice } from "../masters/branchoffice";
import { Space } from "../masters/space";

export class InventoryProductBranchOffice{
    idProduct: number = -1;
    idPacking: number = -1;
    name: string = "";
    barCode: string = "";
    packingPresentation: Packagingpresentation = new Packagingpresentation();
    packingType: Packingtype = new Packingtype();
    branchOffice: Branchoffice = new Branchoffice();
    status: Status = new Status();
    area: Area = new Area();
    space: Space = new Space();
    existenceTransit: number = 0;
    existenceAvailable: number = 0;
    existenceBlocked: number = 0;
    existenceReserved: number = 0;
    existence: number = 0;
    units: number = 0;
}