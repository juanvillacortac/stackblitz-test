
export class CompanyGovernmentalAgency {
    id: number = -1 ;
    governmentalAgency: number = -1 ;
    governmentalRecord: number = -1 ;
    governmentalRecordType: number = -1 ;
    company: number = -1 ;
    branchOffice: number = -1 ;
    documentType: number = -1 ;
    documentNumber: string = "" ;
    firstNameLR: string = "" ;
    lastNameLR: string = "" ;
    phone: string = "" ;
    recordNumber: string = "" ;
    recordDate: Date;
    employerContribution: number;
    employeeContribution: number;
    estatus: boolean;

    governmentalAgencyName: string = "";
    governmentalAgencyShortName: string = "";
    governmentalRecordName: string = "";
    governmentalRecordTypeName: string = "";
    branchOfficeName: string = "";
    documentTypeIdentifier: string = "";
    estatusName: string = "";
    // documentTypeLRId: number = -1;
    documentTypeLR: string = "";
    documentNumberLR: string = "";
    documentTypeIdentifierLR: string = "";

}