import { ContactNumber } from "./contact-number";
import { Address } from "./address";

export class BranchOffice{
    id: number = -1;
    branchOfficeName: string = "";
    idBranchOfficeType: number = -1;
    branchOfficeTypeName: string = "";
    idCompany: number = -1;
    companyName: string = "";
    idCountry: number = -1;
    countryName: string = "";
    branchOfficeCode: string = "";
    branchOfficeManager: string = "";
    active: boolean;
    internationalPurchases: boolean;
    nationalPurchases: boolean;
    contactNumbers: ContactNumber[];
    addresses: Address[];
}