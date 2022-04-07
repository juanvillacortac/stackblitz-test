import { SelectItem } from "primeng/api";

export class SalaryRangeViewFilter{
    company: number = -1;
    jobPosition: SelectItem = {label:"", value:0};
    typeSalary: SelectItem = {label:"", value:0};
    Currency: SelectItem = {label:"", value:0};
}