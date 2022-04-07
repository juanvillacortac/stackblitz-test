export class SalaryRangeViewModel{
    idCompany: number = -1;
    idSalaryRange: number = -1;
    idJobPosition: number = -1;
    jobPosition: string;
    idTypeSalary: number = -1;
    typeSalary: string;
    minAmount: number;
    maxAmount: number;
    idCurrency: number = -1;
    abbreviation: string = "";
    currency: string = "";
    symbol: string = "";
    conversionFactor: number;
    dateFactor: string = '';
    userCreate: string;
    userUpdate: string;
}