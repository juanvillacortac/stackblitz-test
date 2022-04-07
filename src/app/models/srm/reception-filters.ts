export class ReceptionFilters {
    id = -1;
    branchOfficeId = -1;
    receptionNumber  = '';
    invoiceNumber  = '';
    documentNumber  = '';
    documentType = -1;
    documentNumberRelated  = '';
    externalDocumentNumber=  '';
    suppliersId  = '';
    ocDocumentType = -1;
    receptionOperator = -1;
    validationOperator = -1;
    documentStatus = -1;
    dateStatus = -1;
    initialDate  = '';
    finalDate  = '';
    receptionType = -1;
    receptionAreas  = '';
    negotiationType = -1;
}

export class ChildReceptionFilters {
    receptionId :number= -1;
    purchaseId :number= -1;

}