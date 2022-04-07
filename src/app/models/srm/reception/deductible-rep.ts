export class DeductibleRep {
    idPurchaseTaxableDeductible:number=-1;
    idPurchase:number=-1;
    idPurchaseDetail:number=-1;
    taxableDeductibleBaseId:number=-1;
    taxableDeductibleBaseparentId:number=-1;
    idTaxableType:number=-1;
//nombre del tipo impuesto o descueto
    taxableType:string="";
//Aplica a select de aplicacion app cable
    idApply:number;
    applyCost: string="";
    //tipo de distribucion de calculo cable
    distributionCalculationId:number=-1;
    distributionCalculation: string="";
    idTaxType:number=-1;
    idTax:number=-1;
    taxableDeductibleBase:string="";
    indFixedTax:boolean=false;
    indTaxable:boolean=false;
    indDeductible:boolean=true;
    indPurchaseTaxable:boolean=false;
    indPurchaseTaxableDetail: boolean=false;
    indProductsAll:boolean=false;
    indBaseNetCost:boolean=false;
    indBaseNetSale:boolean=false;
    rate:number=0;
    amount=0;
    //valores nuevos
    idDiscountRate: number=-1;
    discountRate:string="";
    idTypeValue=-1;
    typeValue:string="";
    active:boolean=false;
    //key temporal para eliminar
    idTemp:number=-1;
    indOdc:boolean=false;
}
