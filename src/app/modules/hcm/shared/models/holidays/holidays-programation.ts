import { HolidaysBalance } from "./holidays-balance";

export class HolidaysProgramation{
    idDetailHolidayProgramation: number = -1;
    idLaborRelationship: number = -1;
    employmentCode: string = '';
    idDocumentType: number = -1;
    documentType: string = '';
    identifier: string = '';
    documentNumber: string = '';
    employeeFirstName: string = '';
    employeeSecondName: string = '';
    employeeLastName: string = '';
    employeeSecondLastName: string = '';
    idPayrollClass: number = -1;
    payrollClass: string = '';
    abbreviation: string = '';
    idHolidayCycle: number = -1;
    holidayCycle: string = '';
    endDate: string = '';
    createdByUser: string = '';
    updateByUser: string = '';
    balance: HolidaysBalance = new HolidaysBalance();
}