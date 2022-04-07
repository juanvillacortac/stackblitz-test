import { MerchandiseBranchTransfersPaletteDetail } from "./merchandisebranchtransferpalettedetail";

export class MerchandiseBranchTransfersPalette{
    idBranchTransferPalette: number = -1;
    idBranchTransfer: number = -1;
    createByUserID: number = -1;
    createByUser: string = "";
    updateByUserID: number = -1;
    updateByUser: string = "";
    palletNumber: number = 0;
    tagNumber: string = "";
    totalUnits: number = 0;
    totalAmount: number = 0;
    createDate: Date = new  Date();
    updateDate: Date = new Date();
    indReceived: boolean = false;
    indReturn: boolean = false;
    branchTransferPaletteDetail: MerchandiseBranchTransfersPaletteDetail[] = [];
}