import { Area } from "../masters/area";
import { Branchoffice } from "../masters/branchoffice";
import { MerchandiseBranchTransfers } from "./merchandisebranchtransfers";
import { TransferType } from "./transfertype";
import { UseType } from "./usetype";

export class MerchandiseTransfers{
    idTransfer: number = -1;
    transferType: TransferType = new TransferType();
    idTypeDocumentTransfer: number = -1;
    useType: UseType = new UseType();
    originBranch: Branchoffice = new Branchoffice();
    originArea: Area = new Area();
    createByUserID: number = -1;
    createByUser: string = "";
    updateByUserID: number = -1;
    updateByUser: string = "";
    observations: string = "";
    indHaveTransport: number = 1;
    createDate: Date = new Date();
    updateDate: Date = new Date();
    branchTransfer: MerchandiseBranchTransfers[] = [];
    edit: boolean = false;
}