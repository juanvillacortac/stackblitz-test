import { ContactNumber } from "./contact-number";
import { Address } from "./address";
import { CompanyBankAccount } from "src/app/modules/hcm/shared/models/masters/company-bank-account";

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
    identification: string="";
    nit: string="";
    idCountry: number=-1;
    contactNumbers: ContactNumber[];
    addresses: Address[];
    active: boolean = false;
    isdisabled:boolean;
    indSupplier: boolean = false

    // se agrego  esto es de Hcm//
    // debería usarse un sub tipo con ésta lógica que solo necesita HCM //
    identifier: string = "";
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
    idsupplierclasification:number=-1;
    supplierclasification:string=""
    idcurrency:number=-1;
    currency :string="";
    fullDocument: string = "";  //se requiere para filtrar por documento
}
