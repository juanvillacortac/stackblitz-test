import { InventoryOfficesComparative } from './inventory-offices-comparative';

export class InventoryProductByOffice {
    barcode: string;
    productName: string;
    productId: number;
    scaleCode: string;
    category: string;
    offices: InventoryOfficesComparative[];
}
