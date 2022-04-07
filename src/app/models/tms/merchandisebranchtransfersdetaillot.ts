import { PackingByBranchOffice } from "../products/packingbybranchoffice";
import { Lot } from "./lot";
import { MerchandiseBranchTransfersDetail } from "./merchandisebranchtransfersdetail";

export class MerchandiseBranchTransfersDetailLot{
    idBranchTransferDetailLot: number = -1;
    idBranchTransferDetail: number = -1;
    createByUserID: number = -1;
    updateByUserID: number = -1;
    lot: Lot = new Lot();
    numberUnitsShipped: number = 0;
    NumberUnitsReceived: number = 0;
    createDate: Date = new  Date();
    updateDate: Date = new Date();
    packingProduct: PackingByBranchOffice = new PackingByBranchOffice();
}