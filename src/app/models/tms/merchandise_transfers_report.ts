import { Category } from "../masters-mpc/category";
import { Status } from "../masters-mpc/common/status";
import { Branchoffice } from "../masters/branchoffice";
import { MerchandiseRequestDetail } from "./merchandiserequestdetail";
import { RequestType } from "./requesttype";
import { UseType } from "./usetype";

export class MerchandiseTransfersReport{
    id: number = -1;
    transferNumber: string = "";
    transferType: string = "";
    useType: UseType = new UseType();
    originBranch: Branchoffice = new Branchoffice();
    originArea: string = "";
    destinyBranch: Branchoffice = new Branchoffice();
    destinyArea: string = "";
    status: Status = new Status();
    dateofsend: Date = new Date();
    dateofreception: Date = new Date();
    productCodeBar:string = "";
    productDescription :string = "";
    productReference:string = "";
    category: Category = new Category();
    productPackageType:string = "";
    unitsPerPackage: number =- 1;
    idRequestLot: number = -1;
    detailuseType: UseType = new UseType();
    sendQuantity: number =-1;
    recivedQuantity: number = -1;
    cost:number =-1;
    netcost:number =-1;
    salenetcost:number =-1;
    factorofsale:number =-1;
    pvp:number =-1;
}