import {groupingunitmeasure} from '../../../../models/masters-mpc/groupingunitmeasure'

export class MeasurementUnits {
    id: number = -1;
    name: string = "";
    abbreviation: string = "";
    groupingUnitofMeasure: groupingunitmeasure = new groupingunitmeasure();
    createdByUser: string = "";
    createdByUserId: number = 0;
    updatedByUser: string = "";
    active: number = 1;
    initialSetup: boolean = false; 
}
