import { PayrollInstruccionsCalc } from "./payroll-politic-instruccion";
import { PayrollPoliticVariables } from "./payrroll-politic-vars";

export class PoliticCalc {
    conceptId: number = -1;
    variables:PayrollPoliticVariables[];
    instructions:PayrollInstruccionsCalc[];
}