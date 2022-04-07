export class LoanInstallment{
    idLoanInstallment: number = -1;
    idLoan: number = -1;
    idPayrollType: number = -1;
    idCalendar: number = -1;
    idStatus: number = -1;
    quotaAmount: number = 0;
    paidAmount: number = 0;
    pendingAmount: number = 0;
    conversionQuotaAmount: number = 0;
    conversionPaidAmount: number = 0;
    conversionPendingAmount: number = 0;
    repaymentAmount: number = 0;
    repaymentDifference: number = 0;
    payDate: string = "";
    payrollType: string = "";
    status: string = "";
    createUser: string = "";
    updateUser: string = "";
}
