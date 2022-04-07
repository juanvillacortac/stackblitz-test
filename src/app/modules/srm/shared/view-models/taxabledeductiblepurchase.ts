import { DeductibleRep } from "src/app/models/srm/reception/deductible-rep"
import { TaxableRep } from "src/app/models/srm/reception/taxable-rep"

export class TaxableDeductiblePurchase {
    idPurchase:number=-1
    taxables:TaxableRep[]=[]
    deductibles:DeductibleRep[]=[]
}