import { Person } from './Person';

  export interface Profile {
    id?: number;
    mainEmail?: string;
    secondaryEmail?: string;
    person?: Person;
  }
