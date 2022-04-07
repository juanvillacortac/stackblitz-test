import { AccountforPayrollData } from "./accountforpayrolldata";
import { SalariesForPayrollData } from "./salariesforpayrolldata";

export class PayrollData {

    idLaborRelationship: number = -1;
    employmentId: number = -1;
    employment?: string;
    documentTypeId?: number;
    documentType?: string;
    identifier?: string;
    documentNumber?: string;
    centralCostId?: number;
    centralCost?: string;
    jobPositionId?: number;
    jobPosition?: string;
    contractPeriodId?: number;
    contractPeriod?: string;
    // duration?: string;
    unitId?: number;
    unit?: string;
    documentWorksheetId?: number; 
    documentWorksheet?: string;
    paymentMethodId?: number = 1;
    paymentMethod?: string;
    statusId?: number;
    status?: string;
    islr?: number;
    // por default debe llevar "1900-01-01"
    // employmentDate?: Date;
    // seniorityDate?: Date;
    // egressDate?: Date;
    employmentDate?: string;
    seniorityDate?: string;
    egressDate?: string;
    /////////
    fixedPositionInd?: boolean;
    accountDenomination?: string;
    corporateEmail?: string;
    supervisorPositionId?: number;
    supervisorPosition?: string;
    supervisorOperativeId?: number;
    supervisorOperative?: string;
    idAntiquitySystem?: number;
	idPayrollClass?: number;
	payrollClassName?: string;
	idWorkShift?: number;
	workShift?: string;
	idWorkDay?: number;
	workDay?: string;
    salariesforPayrollData?: SalariesForPayrollData[] = [];
    accountforPayrollData?: AccountforPayrollData[] = [];
    createdBy?: string;
    modifiedBy?: string;
    
}
