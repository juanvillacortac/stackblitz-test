import { Category } from "../masters-mpc/category";
import { Status } from "../masters-mpc/common/status";
import { Branchoffice } from "../masters/branchoffice";
import { MerchandiseRequestDetail } from "./merchandiserequestdetail";
import { RequestType } from "./requesttype";
import { UseType } from "./usetype";

export class MerchandiseRequest{
    id: number = -1;
    idRequestLot: number = -1;
    requestType: RequestType = new RequestType();
    idDocumentRequest: number = -1;
    useType: UseType = new UseType();
    category: Category = new Category();
    status: Status = new Status();
    idReason: number = -1;
    demandBranch: Branchoffice = new Branchoffice();
    dispatchBranch: Branchoffice = new Branchoffice();
    createByUserID: number = -1;
    createByEmploymentRelationshipId: number = -1;
    imageCreateByUser: string = "";
    createByUser: string = "";
    updateByUserID: number = -1;
    updateByEmploymentRelationshipId: number = -1;
    imageUpdateByUser: string = "";
    updateByUser: string = "";
    requestNumber: string = "";
    observations: string = "";
    quantityItems: number = -1;
    associatedDocument: string = "";
    associatedDocumentDate: Date = new Date();
    createDate: Date = new Date();
    updateDate: Date = new Date();
    expirationDate: Date = new Date();
    requestDetail: MerchandiseRequestDetail[] = [];
}