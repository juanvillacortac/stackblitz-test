import { ContactNumber } from "./contact-number";
import { Address } from "./address";
import { CompanyBankAccount } from "./company-bank-account";

export class Company {
    id: number = -1 ;
    name: string = "" ;
    idClassification = -1;
    idType: number = -1;
    idGroup: number = -1;
    group:string ="";
    idTypeIdentification: number =-1;
    idTypeNIT: number =-1;
    socialName: string ="";
    identifier: string = "";
    identification: string="";
    nit: string="";
    idCountry: number=-1;
    contactNumbers: ContactNumber[];
    addresses: Address[];
    active: boolean = false;
    isdisabled:boolean;

    bankAccounts: CompanyBankAccount[];

    idSecundaryCurrency: number =-1;
    idTypeDocumentLR: number = -1;
    lrIdentifier: string ="";
    closingDay: number = 0;
    closingMonth: number = 0;
    volume: string = "";
    record: string = "";
    documentLR: string ="";
    firstNameLR: string = "";
    lastNameLR: string="";
    phoneLR: string="";
    emailLR: string ="";
    payrollCode: string = "";
    financialCode: string="";
    recordNumber: string = "";
    recordDate: Date;
}