import { HolidaysProgramation } from "./holidays-programation";

export class HolidaysProgramationMassive{
    idCompany: number = -1;
    idProgramationType: number = -1;
    idHolidayType: number = -1;
    idHolidayProgramation: number = -1;
    idStatus: number = -1;
    holidayType: string = "";
    status: string = "";
    startDate: string = "";
    endDate: string = "";
    payDate: string = "";
    idCalendar: number = -1;
    cycleHolidays: string = "";
    idPayrollType: number = -1;
    detail: HolidaysProgramation[] = [];
}