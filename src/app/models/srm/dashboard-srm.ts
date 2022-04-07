export class AnalyticSRM {
   
    idIndicator: number =-1
        
    idFilterType: number =-1
   
    result:ResultAnalytics[]=[];
   
   }
   export class IndicatorXModuleSRM {
   
    idIndicator: number =-1
        
    idFilterType: number =-1  
   
   
   }
   export class IndicatorXModuleSRMFilter {
   
    IdModule: number =-1; 
    IdGroupCompany: number =-1;
    IndIndicatorMain: number =-1; 
    IdUser: number =-1;  
    IdBranchOffice: number =-1;  
    IdCompany: number =-1;  
     
   }
   export class LabelAnalytics {
      
       labelName :string="";
      
      }   
      export class ResultAnalytics {
      
        colorHex :string="";   
        etiqueta :string="";        
        campoUrl:string="";
        campoId :string="";
        totalvalue:number=0;   
        value:number=0;
        values: Values=new Values;
        details :ResultAnalyticsDetails[]=[];
        labels :LabelAnalytics[]=[];   
        valuesLabels:ValuesLabelAnalytics[]=[];
   
      }
      export class ResultAnalyticsDetails {
      
        colorHex :string="";   
        etiqueta :string="";   
        value:number=0;      
      }
      export class ValuesLabelAnalytics {
      
        labels :string ="";   
        value :number =0;      
      }
   
      export class AnalyticSRMFilter {
       
       idEmpresa :number =1;
   
       idSucursal :number =-1;
   
       indicators :IndicatorAnalyticsFilter[]=[];
       indicatorsString:string ="";
       
     }
   
     export class IndicatorAnalyticsFilter {
       
       idIndicator :number = -1;//37   
       idFilterType :number = -1;//11
       parameters:Parameters=null;
       
     
     }
     export class Parameters {
      
      idSupplier :number =1;   
      
    }
   

     export class Values {
      
      value1 :string ="";   
      value2 :string ="";   
      value3 :string ="";   
      value4 :string ="";   
      value5 :string ="";   
      value6 :string ="";   
    }
   
   
      
   
   