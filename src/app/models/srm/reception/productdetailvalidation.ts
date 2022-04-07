
import { DeductibleRep } from "./deductible-rep";
import { Productpackaging } from "./productpackaging";
import { TaxableRep } from "./taxable-rep";

export class Productdetailvalidation {
 id:number=-1;
 idProduct : number =-1;
 name :string="";
 category : string ="";
 internalReference: string ="";
 image : string ="";
 indHeavy: boolean = false;
 supplierExchangeRate: number=0;
 internalExchangeRate: number=0;
 packagingQuantity:number=0;
 idPacking:number;
 master: Productpackaging = new Productpackaging();
 individual: Productpackaging = new Productpackaging();
 taxables:TaxableRep[];
 deductibles:DeductibleRep[];
 totalCostbase:number=-1;
 totalcostconvertion:number=-1;
 totaltaxables:number=-1;
 totalDeductible:number=-1;
 totaltaxablesConvertion:number=-1;
 totalDeductibleConvertion:number=-1;
 subtotal:number=-1;
 subtotalConvertion:number=-1;
}
