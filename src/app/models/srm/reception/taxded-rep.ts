import { PurchaseOrderProduct } from "../purchase-order-product";
import { DeductibleRep } from "./deductible-rep";
import { TaxableRep } from "./taxable-rep";

export class TaxdedRep {
    idReception: number =-1;
    idReceptionDetail: number =-1;
    taxables:  TaxableRep[];
    deductibles: DeductibleRep[];
    products:PurchaseOrderProduct[]; // cambiar por el modelo de recepcion de productos
}
