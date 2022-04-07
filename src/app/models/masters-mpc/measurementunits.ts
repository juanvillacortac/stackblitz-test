export class measurementunits {
    id: number = -1;
    name: string = '';
    abbreviation: string = '';
    idGroupingUnitofMeasure: number = -1;
    groupingUnitofMeasure: string = '';
    createdByUser: string = '';
    createdByUserId: number = -1;
    updatedByUser: string = '';
    createdDate: Date;
    updatedDate: Date;
    active: boolean = false;
    activeGroupingUnitofMeasure: boolean;
    initialSetup: boolean = false;
}