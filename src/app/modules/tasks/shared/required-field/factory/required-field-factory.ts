import { Injectable } from '@angular/core';
import { ServiceCallType } from 'src/app/models/tasks/service-call-type.enum';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { BranchOfficeField, CountryField, CurrencyField, MotivesField, SupplierField, UserField } from '../implementations/master-required-field';
import { IRequiredField } from '../interfaces/required-field';

@Injectable({
    providedIn: 'root'
  })
  export class RequiredFieldFactory {
    constructor(
        private readonly branchOfficeService: BranchofficeService,
        private readonly countryService: CountryService,
        private readonly currencyService: CoinsService,
        private readonly supplierService: SupplierService,
        private readonly userService: UserService,
        private readonly motivesService: MotivesService ) { }

    createRequiredField(serviceCallType: ServiceCallType): IRequiredField {
        switch (serviceCallType) {
            case ServiceCallType.branchoffice:
                return new BranchOfficeField(this.branchOfficeService);
            case ServiceCallType.country:
                return new CountryField(this.countryService);
            case ServiceCallType.currency:
                return new CurrencyField(this.currencyService);
            case ServiceCallType.supplier:
                return new SupplierField(this.supplierService);
            case ServiceCallType.user:
                return new UserField(this.userService);
            case ServiceCallType.motives:
                return new MotivesField(this.motivesService);
            default:
              break;
          }
    }
  }
