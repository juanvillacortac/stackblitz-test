import { ColourLabelDashboard } from "./common/colourlabeldashboar";
import { DescriptionLabelDashboard } from "./common/descriptionlabeldashboard";
import { ValuesLabelDashboard } from "./common/valueslabeldashboard";

export class ReceptionDashboardCategory {
    category: string;
    quantity:number;
    percentage: number;
    colour: string;   
    descriptions:DescriptionLabelDashboard[]=[];
    values:ValuesLabelDashboard[]=[];
    colours:ColourLabelDashboard[]=[];
}