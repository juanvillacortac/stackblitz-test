import { Category } from "src/app/models/masters-mpc/category";
import { Typeofparts } from "src/app/models/masters-mpc/typeofparts";

export class ProductAssociationComponentViewModel{
    idProductAssociationComponent: number = -1;
    idProduct: number = -1;
    name: string = "";
    barCode: string = "";
    category: Category = new Category();
    partsType: Typeofparts = new Typeofparts();
    amount: number = 0;
    createdByUser: string = "";
    updateByUser: string = "";
    active: boolean = false;
}