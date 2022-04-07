import { Category } from "src/app/models/masters-mpc/category";

export class ProductAssociationDerivateViewModel{
    idProductAssociationDerivate: number = -1;
    idProduct: number = -1;
    name: string = "";
    barCode: string = "";
    category: Category = new Category();
    createdByUser: string = "";
    updateByUser: string = "";
    active: boolean = false;
}