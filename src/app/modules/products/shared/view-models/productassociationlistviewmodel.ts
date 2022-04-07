import { Product } from "src/app/models/products/product";
import { ProductAssociationViewModel } from "./productassociation";

export class ProductAssociationListViewModel{
    idProduct: number = -1;
    name: string = "";
    productFather: Product[] = [];
    components:ProductAssociationViewModel[] = [];
    derivates: ProductAssociationViewModel[]= [];
    related: ProductAssociationViewModel[] = [];
}