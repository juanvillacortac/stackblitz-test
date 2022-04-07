import { LoanInstallment } from "./loan-installment";

export class Loan {
    idLoan: number = -1;
    idCompany: number = -1;
    idLaborRelationship: number = -1;
    idLoanType: number = -1;
    idCurrency: number = -1;
    idConversionCurrency: number = -1;
    idStatus: number = -1;
    createUser: string = "";
    updateUser: string = "";
    status: string = "";
    currency: string = "";
    discountStartDate: string = "";
    createDate: string = "";
    loanPayDate: string = "";
    loanType: string = "";
    amount: number = 0;
    interestRateAmount: number = 0;
    loanAmount: number = 0;
    quotasAmount: number = 0;
    quotaAmount: number = 0;
    conversionQuotaAmount: number = 0;
    conversionInterestRateAmount: number = 0;
    conversionLoanAmount: number = 0;
    conversionAmount: number = 0;
    conversionFactor: number = 0;
    interestRate: number = 0;
    quotaList: LoanInstallment[] = [];
}