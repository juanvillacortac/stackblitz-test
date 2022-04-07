import { Deductible } from "./deductible";
import { PurchaseOrderProduct } from "./purchase-order-product";
import { Taxable } from "./taxable";

export class Taxabledeductible {
    idPurchase: number =-1;
    idPurchaseDetail: number =-1;
    taxables:  Taxable[];
    deductibles: Deductible[];
    products:PurchaseOrderProduct[];
}
