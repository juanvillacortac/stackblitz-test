import { PayrollTypeObjectViewModel } from "./payroll-type-object-viewmodel";
import { AccountingItemViewModel } from "../accounting-item-viewmodel";

export class PayrollCompanyViewModel {

    idCompany: number;
    companyName: string;
	payrollTemplates: PayrollTypeObjectViewModel;
    payrollTypes: PayrollTypeObjectViewModel;
    accounts: AccountingItemViewModel;
}