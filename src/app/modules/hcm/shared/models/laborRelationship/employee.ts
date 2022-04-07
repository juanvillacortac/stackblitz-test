
import { AdditionalData } from "./additional-data";
import { Address } from "./address";
import { PhoneNumber } from "./phone-number";
import { Picture } from "./picture";

export class Employee {
    
    idLaborRelationship: number = -1;
    idEmployee: number = -1;
    idDocumentType?: number;
    documentType?: string;  
    identifier?: string;   
    documentNumber?: string;
    idMaritalState?: number; 
    maritalState?: string;
    idInstructionDegree?: number;     
    instructionDegree?: string;     
    idProfessionalArea?: number;     
    professionalArea?: string;    
    idEstatus?: number;
    estatus?: string;
    idBirthCity?: number;
    birthCity?: string;
    idCitizenship?: number;
    citizenship?: string;
    citizenshipName?: string;
    idTaxDocumentType?: number;
    taxIdentifier?: string;
    taxDocumentNumber?: string;
    gender?: string;
    employeeFirstName?: string;
    employeeSecondName?: string;
    employeeLastName?: string;
    employeeSecondLastName?: string;
    email?: string;
    insuranceNumber?: string;
    pictureSource?: string;
    picture?: Picture = new Picture();
    activeLaborRelationship?: boolean;
    // por default debe llevar "1900-01-01"
    // birthDate?: Date = new Date(1900101);
    birthDate?: string;
    //////////
    addresses?: Address = new Address();
    phoneNumbers?: PhoneNumber[] = [];
    additionalData?: AdditionalData = new AdditionalData();

}