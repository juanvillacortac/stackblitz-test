import { BaseModel } from '../common/BaseModel';

export interface CompanyOffice extends BaseModel {
    offices: BaseModel[];
}
