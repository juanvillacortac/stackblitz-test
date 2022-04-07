import { PayrollTypeObject } from "./payroll-type-object";
import { AccountingTemplate } from "./accounting-template";
import { AccountingItem } from "../masters/accounting-item";

export class PayrollCompany {

    idCompany: number = -1;
    companyName: string = "";
	payrollTemplates: AccountingTemplate[] = [];
    payrollTypes: PayrollTypeObject[] = [];
    accounts: AccountingItem;
}