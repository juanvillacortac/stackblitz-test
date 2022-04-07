import { Phone } from 'src/app/models/users/Phones';
import { EntityViewModel } from './Entity.viewmodel';

export interface UserViewModel {
    person: EntityViewModel;
    id: number;
    mainEmail: string;
    secondaryEmail: string;
    status: number;
    observations: string;
    phone?: Phone;
}
