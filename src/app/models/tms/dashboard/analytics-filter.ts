import { AnalyticsIndicatorFilter } from "./analytics-indicator-filter";

export class AnalyticsFilter 
{
    idCompany:number = 1;
    idBranchOffice:number = -1;
    indicators:AnalyticsIndicatorFilter[] = [];
    indicatorsString:string="";
}
