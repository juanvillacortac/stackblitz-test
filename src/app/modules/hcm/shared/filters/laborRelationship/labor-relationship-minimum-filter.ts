import { Dto } from "src/app/modules/shared/utils/dto";

const toDate = (str: string) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
        padLeft(d.getDate()),
        padLeft(d.getMonth() + 1),
        d.getFullYear()
    ].join('/');
    return dformat
}

export class LaborRelationshipMinimumFilter {

    idLaborRelationship: number = -1;
    branchOfficeId: number = null;
    idEstatus: number = null;
    idCompany: number = -1;
    idUser: number = -1;
    employeeName: string = "";
    employmentCode: string = "";
    idPayrollClass: number = -1;
    idTypeDocument: number = -1;
    // por default debe llevar "1900-01-01"
    // employmentDate: Date;
    // seniorityDate: Date;
    @Dto(toDate)
    employmentDate: string;
    @Dto(toDate)
    seniorityDate: string;
    /////////////

}