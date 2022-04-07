import { Address } from '../users/Address';
import { Phone } from '../users/Phones';
import { User } from './User';

export interface Entity {
  id?: number;
  identifierType: number;
  identifier: string;
  dniNumber: string;
  name: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  birthDate: Date;
  maritalStatus: string;
  status: number;
  gender: string;
  observations: string;
  userCreated?: number;
  userModified?: number;
  createdDate?: Date;
  modifiedDate?: Date;
  businessReason: string;
  tradeName: string;
  nit: string;
  imagen?: string;
  address: Address[];
  phones?: Phone[];
  users?: User[];
}
