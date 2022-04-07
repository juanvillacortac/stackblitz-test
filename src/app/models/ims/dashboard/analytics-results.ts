import { AnalyticsDetailsResults } from "./analytics-details-results";
import { AnalyticsLabels } from "./analytics-labels";
import { AnalyticsValuesLabels } from "./analytics-values-labels";

export class AnalyticsResults 
{
    indicator:string;
    colorHex:string;
    campoURL:string;
    etiqueta:string;
    currentValue:string;
    totalValue:string;
    goal:string;
    percent:string;
    comparator:string;
    value:string;
    //  value1:any;
    //  value2:any;
    //  value3:any;
    //  value4:any;
    // value5:any;
    // value6:any;
    valores: DataAnalyticsDao = new DataAnalyticsDao();
    labels:AnalyticsLabels[]=[];
    valuesLabels:AnalyticsValuesLabels[]=[];
    detailsResults:AnalyticsDetailsResults[]=[];
}

export class DataAnalyticsDao {
  
    valor1: string = ""
    valor2: string = ""
    valor3: string = ""
    valor4: string = ""
    valor5: string = ""
    valor6: string = ""
  
  }