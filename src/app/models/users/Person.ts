import { Address } from './Address';
import { Phone } from './Phones';

export interface Person {
    id?: number;
    name?: string;
    secondName?: string;
    lastName?: string;
    secondLastName?: string;
    birthDate?: Date;
    status?: boolean;
    maritalStatus?: string;
    gender?: string;
    image?: string;
    dateToShow?: string;
    address?: Address[];
    phones?: Phone[];
}
