import { InventoryProductBranchOffice } from "src/app/models/products/inventory";
import { PackingByBranchOffice } from "src/app/models/products/packingbybranchoffice";
import { PointOrder } from "src/app/models/products/pointorder";
import { ValidationFactor } from "src/app/models/products/validationfactor";

export class ProductBranchOfficeViewModel{
    idBranchOffice: number = -1;
    branchOffice: string = "";
    validationsFactor: ValidationFactor[] = [];
    pointOrder: PointOrder[] = [];
    pricesCosts: PackingByBranchOffice[] = [];
    inventory: InventoryProductBranchOffice[] = [];
    checkPrices: boolean = false;
    checkCosts: boolean = false;
    editPrices: boolean = false;
    editCosts: boolean = false;
    manageIndicators: boolean = false;
    managePointOrder: boolean = false;
    manageValidationFactor: boolean = false;
}