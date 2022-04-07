import { InventoryProductPackage } from "./inventory-product-package";
export class InventoryProductAbc {
    productId : number;
    product: string;
    barcode: string;
    reference: string;
    factoryReference: string;
    brand: string;
    category: string;
    utility: number;
    sales: number;
    units: number;
    productAbc: string;
    packages: InventoryProductPackage[];
}

