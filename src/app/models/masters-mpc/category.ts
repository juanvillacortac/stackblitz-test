export class Category {
    id: number = -1;
    idParentCategory: number = 0;
    idCostCenter?: number = -1;
    name: string = "";
    description: string = "";
    childAmount: number = 0;
    createdByUser: string = "";
    createdByUserId: number = 0; 
    updatedByUser: string = "";
    active: boolean = false;
    initialSetup: boolean = false;
    validateInactivateFather: Boolean = false;
    validateInactivateChild: boolean = false;
    validateOnlyChild: boolean = false;
    Key ?  = '';
}
