import { Productassociation } from "src/app/models/masters-mpc/productassociation";
import { Typeofparts } from "src/app/models/masters-mpc/typeofparts";
import { Product } from "src/app/models/products/product";

export class ProductAssociationViewModel{
    idProductAssociation: number = -1;
    idProductAssociationType: number = -1;
    productAssociationType: Productassociation = new Productassociation();
    idFatherProduct: number = -1;
    fatherProduct: Product = new Product();
    idChildProduct: number = -1;
    childProduct: Product = new Product();
    idPartsType: number = -1;
    partsType: Typeofparts = new Typeofparts();
    createByUser: string = "";
    updateByUser: string = "";
    active: boolean = false;
    amount: number = -1;
}