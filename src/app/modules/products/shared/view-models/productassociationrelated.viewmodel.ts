import { Category } from "src/app/models/masters-mpc/category";
import { Productassociation } from "src/app/models/masters-mpc/productassociation";

export class ProductAssociationRelatedViewModel{
    idProductAssoicationRelated: number = -1;
    idProduct: number = -1;
    name: string = "";
    barCode: string = "";
    category: Category = new Category();
    createdByUser: string = "";
    relation: Productassociation = new Productassociation();
    updateByUser: string = "";
    active: boolean = false;
}