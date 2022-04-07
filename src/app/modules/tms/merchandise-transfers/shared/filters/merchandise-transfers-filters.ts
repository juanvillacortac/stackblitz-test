export class MerchandiseTransfersFilter{
    id: number = -1;
    transferTypeId: number = -1;
    originBranchId: number = -1;
    destinationBranchId: number = -1;
    useTypeId: number = -1;
    transferNumber: string = "";
    startDate: Date;
    endDate: Date;
    statusId: number = -1;
    startDateString: string = "";
    endDateString: string = "";
}