export class PaymentCondition
{
        idPaymentCondition:number=-1;
        name:string="";
        amounterm:number=0;
        discount:number=0;
        idDiscountType:number=-1;
        idCoin: number =-1;
        coin: string = "";
        simbology: string = "";
        createDate:Date;
        updatedDate:Date;
        idCreatebyUser:number=-1
        createbyUser:string="";
        idUpdatebyuser:number=-1
        updatebyUser:string="";
        active:boolean=true;
        idCompany:number=1;
        simbolyDiscount: string = "";
}


