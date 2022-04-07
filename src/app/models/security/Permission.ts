import { BaseModel } from '../common/BaseModel';

export class Permission extends BaseModel {
    module: string;
    idModule: number;
    idModuleParent: number;
    selected: boolean;
    app?: string;
  }
