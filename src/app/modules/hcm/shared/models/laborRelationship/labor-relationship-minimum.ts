
export class LaborRelationshipMinimum {

    idLaborRelationship: number = -1;
    branchOfficeId: number = -1;
    branchOffice: string = "";
    idEstatus: number = -1;
    estatus: string = "";
    idCompany: number = -1;
    idEmployee: number = -1;
    employeeName: string = "";
    idDocumentType: number = -1;
    documentType: string = "";
    documentNumber: string = "";
    identifier: string = "";
    jobPositionId: number = -1;
    jobPosition: string = "";
    pictureSource: string = "";
    employmentCode: string = "";
    
    idMaritalState: number = -1;
    // por default debe llevar "1900-01-01"
    // employmentDate: Date;
    // seniorityDate: Date;
    // egressDate: Date;
    employmentDate: string;
    seniorityDate: string;
    egressDate: string;
    /////////////
    fullDocument: string = "";
    idPayrollClass: number = -1;
    idTypeDocument: number = -1;
    selected: boolean = false; // val used in Incidents massive filter component.
}

