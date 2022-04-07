import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { UserDetailsComponent } from './dashboard-profile/user-details/user-details.component';
import { ContactDetailsDashboardComponent } from './dashboard-profile/contact-details/contact-details.component';
import { RatingDetailsComponent } from './dashboard-profile/rating-details/rating-details.component';
import { ProfileDetailsDashboardComponent } from './dashboard-profile/profile-details/profile-details.component';
import { UserDashboardComponent } from './dashboard-profile/user-dashboard/user-dashboard.component';
import { PhoneDetailsDashboardComponent } from './dashboard-profile/contact-details/phone-details/phone-details.component';
import { AddressDetailsDashboardComponent } from './dashboard-profile/contact-details/address-details/address-details.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { UserOptionsComponent } from './dashboard-profile/user-options/user-options.component';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { UsersRoutingModule } from "./users-routing.module";
import { PrimengModule } from "../primeng/primeng.module";
import { PhonesDetailComponent } from './profile-details/phones-detail/phones-detail.component';
import { AddressesDetailComponent } from './profile-details/addresses-detail/addresses-detail.component';
import { PhonesListComponent } from "./profile-details/phones-list/phones-list.component";
import { AddressesListComponent } from "./profile-details/addresses-list/addresses-list.component";


@NgModule({
  declarations: [
    UserDetailsComponent,
    ContactDetailsDashboardComponent,
    RatingDetailsComponent,
    ProfileDetailsDashboardComponent,
    UserDashboardComponent,
    PhoneDetailsDashboardComponent,
    AddressDetailsDashboardComponent,
    ProfileDetailsComponent,
    AddressesListComponent,
    PhonesListComponent,
    UserOptionsComponent,
    PhonesDetailComponent,
    AddressesDetailComponent
  ],
  imports: [
    UsersRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    PrimengModule
  ],
  providers:
  [
    [ConfirmationService]
  ]
})
export class UsersModule { }
