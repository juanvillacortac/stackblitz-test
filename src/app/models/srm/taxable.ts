export class Taxable {
    idPurchaseOrderTaxableDeductible:number=-1;
    idPurchaseOrder:number=-1;
    idPurchaseOrderDetail:number=-1;
    taxableDeductibleBaseId:number=-1;
    taxableDeductibleBaseparentId:number=-1;
    idTaxableType:number=-1;
//nombre del tipo impuesto o descueto
    taxableType:string="";
//Aplica a select de aplicacion app cable
    idApply:number=-1;
    applyCost: string="";
    //tipo de distribucion de calculo cable
    distributionCalculationId:number=-1;
    distributionCalculation: string="";
    idTaxType:number=-1;
    idTax:number=-1;
    idRate:number=-1;
    taxableDeductibleBase:string="";
    indFixedTax:boolean=false;
    indTaxable:boolean=true;
    indDeductible:boolean=false;
    indPurchaseTaxable:boolean=false;
    indPurchaseTaxableDetail: boolean=false;
    indProductsAll:boolean=false;
    indBaseNetCost:boolean=false;
    indBaseNetSale:boolean=false;
    rate:number=0;
    amount=0;
    idTypeValue=-1;
    //valores nuevos
    idDiscountRate: number=-1;
    discountRate:string="";
    //campo netamente referencial para los productos con impuesto
    idProducTax:number=-1;
    active:boolean=false;

}
