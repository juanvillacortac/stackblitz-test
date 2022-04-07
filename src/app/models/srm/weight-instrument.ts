export class WeightInstrument {
    id: number;
    name: string;
    instrumentTypeId: string;
    instrumentType: string;
    weight: number;
    measurementUnit: string;
    measurementUnitId: number;
    height: number;
    width: number;
    depth: number;
    cubic: number;
    createdBy: number;
    updatedBy: number;
    active: number;
    isTransport: number;
    quantity:number=0;
    total:number=0;
    companyId:number=-1;
}

export class WeightInstrumentType {
    id: number;
    name: string;
    active: boolean;
}

export class WeightInstrumentFilters {
    id = -1;
    name = '';
    instrumentTypes = '';
    active = -1;
    isTransport = -1;
    companyId:number=-1;
}