import { purchaseOrderDetailsReceived } from "./purchase-order-details-received";
export class purchaseOrderReceived{
    productName: string = "";
    productCategory: string = "";
    totalPackagesRequested: number = -1;
    totalPackagesReceived: number = -1;
    totalPackagesMissing: number = -1;
    ordersReceived: Array <purchaseOrderDetailsReceived> = []
    image: string;
} 