export enum StatusPurchase {
    New=-1,
    Planned = 14,
    Eraser =15,
    Elaborated = 16,
    Authorized = 17,
    PendingForReview=18,
    InReview=19,
    ReviewCompleted=20,
    Reception=21,
    PartialReceived=22,
    Received=23,
    Overdue=24, //vencida
    Canceled=25,
    RejectedBySupplier=68,// rechazadas por proveedor
    ReceptionRejected=69,
    ReceptionCompleted=70
}
