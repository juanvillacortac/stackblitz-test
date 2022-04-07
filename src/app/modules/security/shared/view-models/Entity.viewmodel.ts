import { User } from "src/app/models/security/User";
import { Phone } from "src/app/models/users/Phones";

export class EntityViewModel {
    id: number;
    name: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    birthDate: Date;
    maritalStatus: string;
    status: number;
    gender: string;
    observations: string;
    businessReason: string;
    tradeName: string;
    nit: string;
    imagen: string;
    phones?: Phone;
}
