import { DescriptionType } from "src/app/models/masters-mpc/description-type";
import { Country } from "src/app/models/masters/country";

export class Description {
    id: number = -1;
    idDescription: number = -1;
    countryId: number = -1;
    country: Country;
    descriptionTypeId: number = -1;
    descriptionType: DescriptionType;
    description: string = "";
    createdByUser: string = "";
    updateByUser: string = "";
    createdDate: Date;
    updateDate: Date;
    active: boolean = false;
    edit: boolean = false;
    stringCreateDate: string = "";
    stringUpdateDate: string = "";
}