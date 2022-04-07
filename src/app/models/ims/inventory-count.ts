import { Operator } from '../common/operator';
import { DetailInventoryCount } from './detail-inventory-count';
import { OperatorInventoryCount } from './operator-count';

export class InventoryCount {
    id = -1;
    idBranchOffice = -1;
    idCategory = -2;
    category = '';
    idArea = -1;
    area = '';
    idSpace = -1;
    space = '';
    idstatus = -1;
    status = '';
    idTransactionType = 12;
    idUserCreate = -1;
    userCreate = '';
    idUserUpdate = -1;
    userUpdate = '';
    operator: Operator;
    idResponsibleUser = -1;
    idResponsibleUserstring = '';    
    responsibleUser = '';
    imageResponsibleUser = '';
    employmentRelationshipId = -1;
    description = '';
    numberDocument = '';
    observation = '';
    active = false;
    dateCreate: Date;
    dateUpdate: Date;
    inicialDate: Date;
    iDate: Date = new Date();
    finalDate: Date;
    count = 0;
    details: DetailInventoryCount[];
    operators: OperatorInventoryCount[];
}
