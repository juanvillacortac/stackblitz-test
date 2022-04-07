import { MerchandiseBranchTransfersDetail } from "./merchandisebranchtransfersdetail";

export class MerchandiseBranchTransfersPaletteDetail{

    idBranchTransferPaletteDetail: number = -1;
    idBranchTransferPalette: number = -1;
    //idBranchTransferDetail: number = -1;
    branchTransferDetail: MerchandiseBranchTransfersDetail = new MerchandiseBranchTransfersDetail();
    createByUserID: number = -1;
    createByUser: string = "";
    updateByUserID: number = -1;
    updateByUser: string = "";
    numberPackages: number = 0;
    totalUnits: number = 0;
    createDate: Date = new  Date();
    updateDate: Date = new Date();
}