export class AnalyticsHCM{
   
    idIndicator: number =-1
        
    idFilterType: number =-1
   
    result:ResultAnalytics[]=[];
   
   }
   
   export class LabelAnalytics {
      
       labelName :string=""
      
      }
   
      export class ResultAnalytics {
      
        colorHex :string=""
   
        etiqueta :string=""

        totalValue: number=-1

        indicatorDesc :string=""

        comparatorDesc :string=""

        currentValue: number=-1 

        targetValue : number=-1

        percentValue : number=-1

        details: DetailsAnalytics[]=[];
   
        labels :LabelAnalytics[]=[];
   
        valuesLabels:ValuesLabelAnalytics[]=[];

        labelUrl :string=""

        idType :string=""

        identificator: number =-1

        valuesData: ValuesData  =new ValuesData()
   
      }
      export class ValuesLabelAnalytics {
      
        labels :string =""
   
        value :string =""
      
      }

      export class ValuesData
      {
      
              valueData1: string = ""
              valueData2: string = ""
              valueData3: string = ""
              valueData4: string = ""
              valueData5: string = ""
              valueData6: string = ""
      
            }

      export class DetailsAnalytics
      {
        colorHexDet: string = ""
        labelDet: string = ""
        valueDet: number =-1
      }
      
     
   
      export class AnalyticHCMFilter {
       
       idEmpresa :number =1
   
       idSucursal :number =-1
   
       indicators :IndicatorAnalyticsFilter[]=[];
     
     }

     export class IndicatorsHCMxModulesFilter {
    
        idModule :number =14
    
        idGroupCompany :number =1
    
        idPrincipal :number =-1
    
        idUser :number =-1
    
        idSucursal :number =-1
    
        idCompany :number =-1
      
    
      
      }
   
     export class IndicatorAnalyticsFilter {
       
       idIndicator :number = -1;
   
       idFilterType :number = -1;
   
       Parameters:object = null;
     
     }