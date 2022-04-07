import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { IRequiredField } from '../interfaces/required-field';

export class BranchOfficeField implements IRequiredField {

    constructor(private branchOfficeService: BranchofficeService) {
    }
    load(value: string) {
        return this.branchOfficeService.getBranchOfficeList().toPromise();
    }
}

export class CountryField implements IRequiredField {

    constructor(private countryService: CountryService) {
    }
   load(value: string)  {
        return this.countryService.getCountriesPromise(new CountryFilter);
    }
}

export class CurrencyField implements IRequiredField {

    constructor(private currencyService: CoinsService) {
    }
   load(value: string)  {
        return this.currencyService.getCoinsList();
    }
}

export class SupplierField implements IRequiredField {

    constructor(private supplierService: SupplierService) {
    }
   load(value: string)  {
        return this.supplierService.getSupplierList();
    }
}

export class UserField implements IRequiredField {

    constructor(private userService: UserService) {
    }
   load(value: string)  {
        const filter = new UserFilterViewModel;
        return this.userService.getAllUsersPromise(filter);
    }
}

export class MotivesField implements IRequiredField {

    constructor(private motivesService: MotivesService) {
    }
   load(value: string)  {
       const filter = new MotivesFilters;
       filter.name = value;
        return this.motivesService.getMotives(filter);
    }
}
