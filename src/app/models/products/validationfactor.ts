import { Packingtype } from "src/app/models/masters-mpc/common/packingtype";
import { Packagingpresentation } from "src/app/models/masters-mpc/packagingpresentation";

export class ValidationFactor{
    idValidationFactor: number = -1;
    idProduct: number = -1;
    idPacking: number = -1;
    idValidationRange: number = -1;
    idBranchOffice: number = -1;
    packingPresentation: Packagingpresentation = new Packagingpresentation();
    packingType: Packingtype = new Packingtype();
    units: number = 0;
    minFactor: number = 0;
    midFactor: number = 0;
    maxFactor: number = 0;
    active: boolean = false;
}