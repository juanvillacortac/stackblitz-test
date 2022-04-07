import { PackingByBranchOffice } from "../products/packingbybranchoffice";
import { DetailUseType } from "./detailusetype";

export class MerchandiseRequestDetail{
    idRequestDetail: number = -1;
    idMerchandiseRequest: number = -1;
    idProduct: number = -1;
    packingProduct: PackingByBranchOffice = new PackingByBranchOffice();
    detailUseType: DetailUseType = new DetailUseType();
    requestedAmount: number = 0;
    quantityDispatched: number = 0;
    createDate: Date = new  Date();
    updateDate: Date = new Date();
}