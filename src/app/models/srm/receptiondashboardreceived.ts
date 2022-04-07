import { ColourLabelDashboard } from "./common/colourlabeldashboar";
import { DescriptionLabelDashboard } from "./common/descriptionlabeldashboard";
import { ValuesLabelDashboard } from "./common/valueslabeldashboard";

export class ReceptionDashboardReceived {
     unitReceived: number=0;
     unitExpected:number=0;
     unitDiferences :number=0;
     percentage: number=0;
     colour: string; 
     descriptions:DescriptionLabelDashboard[]=[];
     values:ValuesLabelDashboard[]=[];
     colours:ColourLabelDashboard[]=[];
    
}