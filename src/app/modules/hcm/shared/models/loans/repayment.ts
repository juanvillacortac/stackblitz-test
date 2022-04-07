import { LoanInstallment } from "./loan-installment";
import { RedemptionPayment } from "./redemption-payment";
import { RepaymentInstallment } from "./repayment-installment";

export class Repayment {
    idRepayment: number = -1;
    idLoan: number = -1;
    idRepaymentType: number = -1;
    idMotive: number = -1;
    amountRepayment: number = 0;
    repaymentDate = "";
    quotaList: LoanInstallment[] = [];
    redemptionPaymentList: RedemptionPayment[] = [];
}