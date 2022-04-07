import { ReceptionDashboardCategory } from "./receptiondashboardcategory";
import { ReceptionDashboardDiferences } from "./receptiondashboarddiferences";
import { ReceptionDashboardPacking } from "./receptiondashboardpacking";
import { ReceptionDashboardReceived } from "./receptiondashboardreceived";

export class ReceptionDashboard {
    category: ReceptionDashboardCategory[]=[];
    received: ReceptionDashboardReceived[]=[];
    packing: ReceptionDashboardPacking[]=[]; 
    heavy: ReceptionDashboardPacking[]=[]; 
    cubing: ReceptionDashboardPacking[]=[]; 
    diferences:  ReceptionDashboardDiferences[]=[]; 
}