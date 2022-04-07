export class Route {

    id:number=-1;

    idBranchOfficeOrigin:number= -1;

    idBranchOfficeDestination:number=-1;

    idCurrency:number=-1;

    branchOfficeOrigin:string;

    branchOfficeDestination:string;

    codeRoute:string;

    approximateDistance:number;

    approximateTime:number;

    viaticAmount:number;

    observations:string="";

    indViatics:boolean;

    active:boolean;

    createdByUser:string;

    createdByUserId:number;

    updatedByUser:string;

    updatedByUserId:number;

    dateCreate:Date;

    dateUpdate:Date;

}
