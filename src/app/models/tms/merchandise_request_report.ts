import { Category } from "../masters-mpc/category";
import { Status } from "../masters-mpc/common/status";
import { Branchoffice } from "../masters/branchoffice";
import { MerchandiseRequestDetail } from "./merchandiserequestdetail";
import { RequestType } from "./requesttype";
import { UseType } from "./usetype";

export class MerchandiseRequestReport{
    id: number = -1;
    idRequestLot: number = -1;
    productCodeBar:string = "";
    productDescription :string = "";
    productReference:string = "";
    productPackageType:string = "";
    unitsPerPackage: number =- 1;
    requestType: RequestType = new RequestType();
    idDocumentRequest: number = -1;
    useType: UseType = new UseType();
    category: Category = new Category();
    status: Status = new Status();
    demandBranch: Branchoffice = new Branchoffice();
    dispatchBranch: Branchoffice = new Branchoffice();
    updateByUserID: number = -1;
    updateByUser: string = "";
    requestNumber: string = "";
    associatedDocument: string = "";
    associatedDocumentDate: Date = new Date();
    requestedQuantity: number =-1;
    processedQuantity: number = -1;
}