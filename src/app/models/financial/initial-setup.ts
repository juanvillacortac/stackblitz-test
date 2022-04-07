export interface SelectedNode<T = any> {
  selected: boolean
  applyAux: boolean
  node?: T
}

export class Template {
    id :number= -1;
    idParent:number = -1;
    idAncestor:number=-1;
    codeItem:number=-1;
    itemName:string='';
    codeAccountingAccount:string='';
    level:number=0;
    isMovementAccount:number;
}


