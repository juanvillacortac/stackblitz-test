import { Area } from "../masters/area";
import { PackingByBranchOffice } from "../products/packingbybranchoffice";
import { DetailUseType } from "./detailusetype";
import { MerchandiseBranchTransfersDetailLot } from "./merchandisebranchtransfersdetaillot";

export class MerchandiseBranchTransfersDetail{
    idBranchTransfer: number = -1;
    idBranchTransferDetail: number = -1;
    idBranchTransferDistributionDetail: number = -1;
    createByUserID: number = -1;
    updateByUserID: number = -1;
    packingProduct: PackingByBranchOffice = new PackingByBranchOffice();
    detailUseType: DetailUseType = new DetailUseType();
    idProduct: number = -1;
    idDiscount: number = 0;
    idTaxRate: number = 0;
    amountSent: number = 0;
    receivedAmount: number = 0;
    unitsShipped: number = 0;
    unitsReceived: number = 0;
    discount: number = 0;
    taxRate: number = 0;
    iva: number = 0;
    baseValidationPrice: number = 0;
    conversionValidationPrice: number = 0;
    percentageVaraitionPrice: number = 0;
    quantityofAggregates: number = 0;
    createDate: Date = new  Date();
    updateDate: Date = new Date();
    branchTransferDetailLot: MerchandiseBranchTransfersDetailLot[] = [];
}