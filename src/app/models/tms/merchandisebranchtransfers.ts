import { Category } from "../masters-mpc/category";
import { Status } from "../masters-mpc/common/status";
import { Area } from "../masters/area";
import { Branchoffice } from "../masters/branchoffice";
import { MerchandiseRequestDetail } from "./merchandiserequestdetail";
import { MerchandiseBranchTransfersDetail } from "./merchandisebranchtransfersdetail";
import { RequestType } from "./requesttype";
import { UseType } from "./usetype";
import { MerchandiseBranchTransfersTransport } from "./merchandisebranchtransferstransport";
import { MerchandiseBranchTransfersPalette } from "./merchandisebranchtransferspalette";

export class MerchandiseBranchTransfers{
    idTransfer: number = -1;
    idBranchTransfer: number = -1;
    idTypeDocumentTransfer: number = -1;
    idDocumentTransfer: number = -1;
    status: Status = new Status();
    destinationBranch: Branchoffice = new Branchoffice();
    destinityArea: Area = new Area();
    createByUserID: number = -1;
    updateByUserID: number = -1;
    transfersNumber: string = "";
    controlNumber: string = "";
    transportGuideNumber: string = "";
    observations: string = "";
    totalPackages: number = 0;
    totalUnitsShipped: number = 0;
    totalUnitsReceived: number = 0;
    totalCosts: number = 0;
    indHaveTransport: number = 1;
    createDate: Date = new Date();
    updateDate: Date = new Date();
    indPalletizing: boolean = false;
    indReceivePallette: boolean = false;
    branchTransfersDetail: MerchandiseBranchTransfersDetail[] = [];
    additionalData: MerchandiseBranchTransfersTransport[] = [];
    branchTransferPallette: MerchandiseBranchTransfersPalette[] = [];
}