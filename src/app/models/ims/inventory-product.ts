export class InventoryProduct {
idbranchoffice:number;
branchoffice : string;
idpackage:number;
idarea:number;
idspace:number;
bar: string;
idproduct:number;
name : string;
idpackagepresentation:number;
packagepresentation : string;
idpackagetype:number;
packagetype : string;
unitsxpackage:number;
Productestatus:number;
Estatus : string;
inventory:number;//inventario
blockedinventory:number;//bloqueado
avaliableinventory:number;//disponible
reserverdinventory:number;//reservado
transitinventory:number;//transito
createdByUser: string;
createdByUserId:number;
updatedByUser: string;
updatedByUserId:number;
idprovider:number = 1;
indHeavy:boolean=false;
}
