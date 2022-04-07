
export class SalesReportFilter {
    productId: number = -1;
    name: string = "";
    barcode: string = "";
    categoryId: string = "";
    productTypeId: number = -1;
    statusId: number = -1;
    structureTypeId: number = -1;
    originTypeId: number = -1;
    classificationId: number = -1;
    brandId: string = "";
    internalRef: string = "";
    indActiveSale: number = -1;
    indActiveBuy: number = -1;
    indConsignment: number = -1;
    indOnline: number = -1;
    indHeavy: number = -1;
    idBranchOffice: number = -1;
    existence: number = -1;
    completeBarCode: string = "";
    initDate:string
    finalDate:string
    iDate:Date=new Date();
    fDate:Date=new Date();
    personalize:boolean=false;
    datePersonalize:number=-1;

}