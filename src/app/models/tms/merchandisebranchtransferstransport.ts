import { Vehicle } from "./vehicle";

export class MerchandiseBranchTransfersTransport{
    idBranchTransferTransport: number = -1;
    idBranchTransfer: number = -1;
    createByUserID: number = -1;
    createByUser: string = "";
    updateByUserID: number = -1;
    updateByUser: string = "";
    vehicle: Vehicle = new Vehicle();
    departureDate: Date = new Date();
    entryDate: Date = new Date();
    createDate: Date = new Date();
    updateDate: Date = new Date();
}