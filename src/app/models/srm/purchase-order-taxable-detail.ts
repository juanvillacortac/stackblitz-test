export class PurchaseOrdertaxableDetail
{
    id:number=-1;
    idPurchaseOrder:number=-1;
    idPurchaseOrderDetail:number=-1;
    taxableDeductibleBaseId:number=-1;
    taxableDeductibleBaseparentId:number=-1;
    idTaxableType:number=-1;
    taxableType:string='';
    idTaxable:number=-1
    taxableDeductible:string='';
    idApply:number;
    applyCost:string="";
    distributionCalculationId:number=-1;
    distributionCalculation:string='';
    idTaxType:number=-1;
    idTax:number=-1;
    idRate:number=-1;
    taxableDeductibleBase:string='';
    indFixedTax:boolean=false;
    indTaxable:boolean=false;
    indDeductible:boolean=false;
    indPurchaseTaxable:boolean=false;
    indPurchaseTaxableDetail: boolean=false;
    indProductsAll:boolean=false;
    indBaseNetCost:boolean=false;
    indBaseNetSale:boolean=false;
    rate:number=0;
    amount=0;
    idDiscountRate: number=-1;
    discountRate:string='';
}

export class PurchasetaxableDetailfilter
{
    id:number=-1;
    amount:number=0;
    indImponible:number=0
}