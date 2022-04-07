import { AnalyticsResults } from "./analytics-results";

export class AnalyticsTMS 
{
    idIndicator:number;
    idFilterType:number;
    indicator:string;
    description: string;
    indicatorCategory:string;
    moduleName:string;
    filterType:string;
    representationType:string;
    unitExpression:string;
    results: AnalyticsResults[];
}
