import { Wage } from "./salary";
import { SalaryAdjustment } from "./salary-adjustment"

export class Salaries {
    salary: Wage = new Wage();                                          
    adjustment: SalaryAdjustment = new SalaryAdjustment();                                             
}