
export class PayrollDataFilter {

    /// Obligatorio
    idCompany: number = -1;
    //////
    branchOfficeId: number = -1;
    idLaborRelationship: number = -1;
    employmentId: number = -1;
    jobPositionId: number = -1;
    statusId: number = -1;
    employmentCode: string = "";
    documentNumber: string = "";
    // por default debe llevar "1900-01-01"
    employmentDate: Date;
    seniorityDate: Date;
    /////////
    EmploymentName: string = "";
    
}