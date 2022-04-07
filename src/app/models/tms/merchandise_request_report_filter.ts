
export class MerchandiseRequestReportFilter
{
    id: number = -1;
    requestNumber: string = "";
    requestType: -1;
    demandBranch: number = -1;
    demandArea: -1;
    useType:string="";
    status: -1;
    startDate: string = "";
    endDate: string = "";
    productBarcode: string = "";
    productNamee: string = "";
    category: number = -1;
    DateOfStart = Date();
    DateOfEnd = Date();
}