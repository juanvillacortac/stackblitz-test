import { Regulations } from "src/app/modules/products/shared/view-models/regulation.viewmodel";

export class Qaproduct {
    id: number =-1;
    idProduct: number =-1;
    regulations:  Regulations[];
    createdByUser: string = "";
    createdByUserId: number=-1;
    UpdatedByUser: string="";
    UpdatedByUserId: number=-1;
    active: boolean= true;
}
