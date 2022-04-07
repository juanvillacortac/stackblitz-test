import{ ContactNumber }from "./contact-number";
import{ Address }from "./address";

export class Branchoffice {
    id: number;
    branchOfficeName: string;
    idBranchOfficeType: number;
    branchOfficeTypeName: string;
    idCompany: number;
    companyName: string;
    idCountry: number;
    countryName: string;
    branchOfficeCode: string;
    branchOfficeManager: string;
    active: boolean;
    internationalPurchases: boolean;
    nationalPurchases: boolean;
    createdByUserId: number;
    createdByUser: string;
    updatedByUserId: number;
    updatedByUser: string;
    createdDate: string;
    updatedDate: string;
    contactNumbers: ContactNumber[];
    addresses: Address[];
    isDisabled: boolean;
}
