import { Category } from "../masters-mpc/category";
import { Status } from "../masters-mpc/common/status";
import { Branchoffice } from "../masters/branchoffice";
import { UseType } from "./usetype";

export class MerchandiseTransfersReportFilter
{
    transferNumber: string = "";
    transferType: string = "";
    useType: "";
    originBranch: Branchoffice = new Branchoffice();
    originArea: string = "";
    destinyBranch: Branchoffice = new Branchoffice();
    destinyArea: string = "";
    status: -1;
    productCodeBar:string = "";
    productDescription :string = "";
    category: Category = new Category();
    startDate: string = "";
    endDate: string = "";
}