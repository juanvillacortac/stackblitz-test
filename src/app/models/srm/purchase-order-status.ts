export enum PurchaserOrderStatus {
    planning= 14,
    draft= 15,
    elaborated = 16,
    authorized = 17,
    pending = 18,
    inReview = 19,
    reviewFinalized = 20,
    inReception = 21,
    partialReceived = 22,
    received = 23,
    expired = 24,
    voided = 25,
    rejectedBySupplier = 68,
    receptionRejected = 69,
    receptionFinalized = 70

}

export class PurchaseOrderUpdateStatus {
    purchaseOrderId: number;
    statusId: number;
    motiveId: number;
    observation: string;
}