import { Operator } from "src/app/models/common/operator";

export class InventoryCountFilter
{
    id: number = -1;
    idBranchOffice:number =-1;
    numberDocument:string="";
    description :string="";
    idArea :number=-1;
    idSpace :number=-1;
    operator:Operator;
    idOperatorstring:string="";
    idOperator:number=-1;
    idStatus:number=-1;
    idCategory:number=-2;
    initialDate:string;
    finalDate:string;
    iDate:Date=new Date();
    fDate:Date=new Date();
    operatorsString:string="";
}