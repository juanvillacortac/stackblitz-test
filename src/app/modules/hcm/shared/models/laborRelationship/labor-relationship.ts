
import { AdditionalData } from "./additional-data";
import { Employee } from "./employee";
import { PayrollData } from "./payroll-data";

export class LaborRelationship {
    idLaborRelationship: number = -1;
    branchOfficeId?: number;
    branchOffice?: string;
    idEstatus?: number;
    estatus?: string;
    idCompany?: number;
    company?: string;
    socialCompanyName?: string;
    employmentCode?: string;
    employee?: Employee = new Employee();
    payrollData?: PayrollData = new PayrollData();
    // additionalData?: AdditionalData = new AdditionalData();
}