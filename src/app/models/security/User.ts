import { Phone } from '../users/Phones';
import { Entity } from './Entity';

export interface User {
    id: number;
    idEntity?: number;
    mainEmail: string;
    secondaryEmail: string;
    password?: string;
    phone: Phone;
    status: number;
    observations: string;
    createdUser?: number;
    modifiedUser?: number;
    createdDate?: Date;
    modifiedDate?: Date;
    person: Entity;
    userType: number;
}
