import { BaseModel } from '../common/BaseModel';
import { SubModule } from './SubModule';

export class Module extends BaseModel {
    subModules: SubModule[];
    appUrl?: string;
    icon?: string;
    idApp?: number;
    idSoftware?: number;
}
