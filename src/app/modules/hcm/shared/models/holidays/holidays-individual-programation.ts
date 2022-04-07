import { HolidaysBalance } from "./holidays-balance";
import { HolidayCycle } from "./holiday-cycle"

export class HolidaysIndividualProgramation{
    idLaborRelationship: number = -1;
    idDocumentType: number = -1;
    idCompany: number = -1;
    company: string = '';
    idBranchOffice: number = -1;
    branchOffice: string = '';
    idJobPosition: number = -1;
    jobPosition: string = '';
    employmentCode: string = '';
    documentType: string = '';
    identifier: string = '';
    documentNumber: string = '';
    employeeFirstName: string = '';
    employeeSecondName: string = '';
    employeeLastName: string = '';
    employeeSecondLastName: string = '';
    payrollClass: string = '';
    fixedPositionInd: boolean = true;
    balance: HolidaysBalance;
    cycle: HolidayCycle[] = [];
}