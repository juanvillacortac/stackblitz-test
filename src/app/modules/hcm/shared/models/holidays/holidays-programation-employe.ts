import { HolidaysBalance } from "./holidays-balance";

export class HolidaysProgramationEmployee{
    idLaborRelationship: number = -1;
    idCompany: number = -1;
    idBranchOffice: number = -1;
    branchOffice: string = "";
    idJobPosition: number = -1;
    jobPosition: string = "";
    idHolidayCycle: number = -1;
    holidayCycle: string = "";
    employmentCode: string = "";
    idDocumentType: number = -1;
    documentType: string = "";
    identifier: string = "";
    documentNumber: string = "";
    employeeFirstName: string = "";
    employeeSecondName: string = "";
    employeeLastName: string = "";
    employeeSecondLastName: string = "";
    idPayrollClass: number = -1;
    payrollClass: string = "";
    employmentDate: string = "";
    seniorityDate: string = "";
    endDate: string = "";
    selected: boolean = false;
    balance: HolidaysBalance = new HolidaysBalance();
}