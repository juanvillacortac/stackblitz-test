export class MaintenanceClaim{

    idMaintenanceClaim: number =-1;
    idLaborRelationship: number = -1;
    idLaborRelationshipxFamilyBurden: number = -1;
    iDocumentTypeBeneficiary: number = -1;
    idSalaryType: number = -1;
    documentNumberBeneficiary: string ="";
    firstNameBeneficiary: string ="";
    lastNameBeneficiary: string ="";
    recordNumber: string ="";
    paymentsDeductionFlag: boolean = false;
    porcentage: number = 0.00;
    amount: number = 0.000; 
    beneficiary: string;
    createdByUserId: number = -1;
    updatedByUserId: number = -1;
}