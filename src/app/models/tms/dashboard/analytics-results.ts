import { AnalyticsDetailsResults } from "./analytics-details-results";
import { AnalyticsLabels } from "./analytics-labels";
import { AnalyticsValuesLabels } from "./analytics-values-labels";

export class AnalyticsResults 
{
    indicator:string;
    colorHex:string;
    uRLImage:string;
    etiqueta:string;
    currentValue:string;
    totalValue:string;
    comparator:string;
    goal:string;
    percent:string;
    value:string;
    // value1:string;
    // value2:string;
    // value3:string;
    // value4:string;
    // value5:string;
    // value6:string;
    valores: DataAnalyticsDao = new DataAnalyticsDao();
    labels:AnalyticsLabels[];
    valuesLabels:AnalyticsValuesLabels[];
    detailsResults:AnalyticsDetailsResults[];
}

export class DataAnalyticsDao {
  
    valor1: string = ""
    valor2: string = ""
    valor3: string = ""
    valor4: string = ""
    valor5: string = ""
    valor6: string = ""
  
  }