import { Component, OnInit } from '@angular/core';
import { ConfirmedValidator } from 'src/app/helpers/confirmed.validator';
import {ActivatedRoute, Router} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/users.service';
import { Address } from 'src/app/models/users/Address';
import { Phone } from 'src/app/models/users/Phones';
import { AddressViewModel } from '../shared/view-model/address.viewmodel';
import { PhoneVieModel } from '../shared/view-model/phone.viewmodel';
import { Profile } from 'src/app/models/users/Profile';
import { MastersService } from '../shared/masters.service';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { HttpErrorResponse } from "@angular/common/http";
import { DialogsService } from "../../common/services/dialogs.service";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ProfileDetailsComponent implements OnInit {
  userId: number;
  addressDialog: boolean;
  phoneDialog: boolean;
  profile: Profile;
  address: Address;
  addresses: Address[] = [];
  addressesVM: AddressViewModel[] = [];
  phone: Phone;
  phones: Phone[] = [];
  phonesVM: PhoneVieModel[] = [];
  submitted = false;

  constructor(
    private readonly _usersService: UsersService,
    private readonly _mastersService: MastersService,
    private readonly _actRoute: ActivatedRoute,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogService: DialogsService,
    private readonly _router: Router
  ) {
    this.userId = this._actRoute.snapshot.params['id'] ?? '';
    this.setBreadCrumb();
  }

  ngOnInit(): void {
    this.getProfile();
  }

  newAddressHandler(isOpen: boolean) {
    this.addressDialog = isOpen;
    this.address = new Address();
    this.submitted = false;
  }

  editAddressHandler(idAddress: any) {
    this.address = this.addresses.find(addr => Number(addr.id) === Number(idAddress));
    this.addressDialog = true;
  }

  newPhoneHandler(isOpen: boolean) {
    this.phoneDialog = isOpen;
    this.phone = new Phone();
    this.submitted = false;
  }

  editPhoneHandler(idPhone: any) {
    this.phone = this.phones.find(phone => Number(phone.id) === Number(idPhone));
    this.phoneDialog = true;
  }

  onPhoneDialogClosed(value) {
    this.phoneDialog = false;
    if (value) { this.onProfileUpdated() }
  }

  onAddressDialogClosed(value) {
    this.addressDialog = false;
    if (value) { this.onProfileUpdated() }
  }

  saveAddress(profile: Profile) {
    this._usersService.saveProfile(profile).then(result => result)
      .then(_ => this.onProfileUpdated())
      .catch(error => this.handleError(error));
  }

  navigateBack() {
    this._router.navigate(['/profile/me']);
  }
  
  private onProfileUpdated() {
    this._dialogService.successMessage('Guardar datos', 'Datos grabados de forma exitosa');
    this.getProfile();
  }

  private getProfile() {
    this._usersService.getEntityProfile(Number(this.userId))
      .then(profile => {
        this.profile = profile;
        this.addresses = profile.person.address;
        this.addressesVM = this.fromAddressToAddressVM(profile.person.address);
        this.phones = profile.person.phones;
        this.phonesVM = this.fromPhoneToPhoneVM(this.phones);
      })
      .catch(error => this.handleError(error));
  }

  private fromAddressToAddressVM = (addresses: Address[]) => {
    return addresses.map<AddressViewModel>(addr => ({
      id: addr.id,
      addressType: addr.addressType,
      apartment: addr.apartment,
      avenue: addr.avenue,
      building: addr.building,
      city: addr.city,
      district: addr.district,
      floor: addr.floor,
      placeType: addr.placeType,
      province: addr.province,
      reference: addr.reference,
      street: addr.street
    }));
  }

  private fromPhoneToPhoneVM = (phones: Phone[]) => {
    return phones.map<PhoneVieModel>(phone => ({
      id: phone.id,
      idPhoneType: phone.idPhoneType,
      phoneNumber: phone.phoneNumber,
      phoneType: phone.phoneType,
      prefix: phone.prefix
    }));
  }

  private setBreadCrumb() {
    this._breadcrumbService.setItems([
      { label: 'Perfil', routerLink: ['/profile/me'] },
      { label: 'Actualizar datos de contacto' }
    ]);
  }
  private handleError(error: HttpErrorResponse) {
    this._dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
