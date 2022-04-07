import{ ContactNumber }from "src/app/models/masters/contact-number";
import { Address } from 'src/app/models/masters/address';

export class BranchofficeViewmodel {
    Id: number;
    BranchOfficeName: string;
    IdBranchOfficeType: number;
    BranchOfficeTypeName: string;
    IdCompany: number;
    CompanyName: string;
    IdCountry: number;
    CountryName: string;
    BranchOfficeCode: string;
    BranchOfficeManager: string;
    Active: boolean;
    InternationalPurchases: boolean;
    NationalPurchases: boolean;
    CreatedByUserId: number;
    CreatedByUser: string;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    CreatedDate: string;
    UpdatedDate: string;
    ContactNumbers: ContactNumber[];
    Addresses: Address[];
}
