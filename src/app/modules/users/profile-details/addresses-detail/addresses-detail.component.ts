import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseModel } from "../../../../models/common/BaseModel";
import { Address } from "../../../../models/users/Address";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Country } from "../../../../models/masters/country";
import { Profile } from "../../../../models/users/Profile";
import { ConfirmationService, SelectItem } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersService } from "../../shared/users.service";
import { MastersService } from "../../shared/masters.service";
import { DialogsService } from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-addresses-detail',
  templateUrl: './addresses-detail.component.html',
  styleUrls: ['./addresses-detail.component.scss']
})
export class AddressesDetailComponent implements OnInit {
  @Input() profile: Profile;
  @Input() address: Address;
  @Output() onDismissDialog: EventEmitter<boolean> = new EventEmitter();
  fillFields = true;
  submitted = false;
  formTittle: string;
  addressForm: FormGroup;
  addresses: Address[] = [];
  addressType: SelectItem<BaseModel[]> = {value: null};
  provinces: SelectItem<BaseModel[]> = {value: null};
  districts: SelectItem<BaseModel[]> = {value: null};
  cities: SelectItem<BaseModel[]> = {value: null};
  places: SelectItem<BaseModel[]> = {value: null};
  countries: SelectItem<BaseModel[]> = {value: null};

  constructor(public _usersService: UsersService,
              private readonly _mastersService: MastersService,
              private readonly _confirmationService: ConfirmationService,
              private readonly _formBuilder: FormBuilder,
              private readonly _dialogService: DialogsService) { }

  ngOnInit(): void {
    this.addressForm = this.newAddressForm();
    this.getCountries();
    this.formTittle = this.address.id === -1 ? "Nueva dirección" : "Editar dirección";
  }

  onCountrySelected(country: BaseModel) {
    this.getProvinces(Number(country.id))
  }

  onProvinceSelected(province: BaseModel) {
    this.getDistricts(Number(province.id))
  }

  onDistrictSelected(district: BaseModel) {
    this.getCities(Number(district.id))
  }

  private getAddressTypes() {
    this._mastersService.getAddressTypes()
      .then(addressTypes => this.addressType.value = addressTypes.sort((a, b) => a.name.localeCompare(b.name)))
      .catch(error => this.handleError(error));
  }

  private getPlaceTypes() {
    this._mastersService.getPlaceTypes()
      .then(placesType => this.places.value = placesType.sort((a, b) => a.name.localeCompare(b.name)))
      .catch(error => this.handleError(error));
  }

  private getCountries() {
    this._mastersService.getCountries(-1, -1)
      .then(countries => this.countries.value = this.mapCountryToBaseModel(countries))
      .then(() => {
        this.getAddressTypes();
        this.getPlaceTypes();
      })
      .then(() => this.loadProvincesIfNeeded())
      .catch(error => this.handleError(error));
  }

  private loadProvincesIfNeeded() {
    if (this.address.idCountry !== -1 && this.fillFields) {
      this.getProvinces(Number(this.address.idCountry))
    }
  }

  private loadDistrictsIfNeeded() {
    if (this.address.idProvince !== -1 && this.fillFields) {
      this.getDistricts(Number(this.address.idProvince))
    }
  }

  private loadCitiesIfNeeded() {
    if (this.address.idDistrict !== -1 && this.fillFields) {
      this.getCities(Number(this.address.idDistrict))
    }
  }

  private getProvinces(countryId: number) {
    this._mastersService.getProvinces(countryId, -1, -1)
      .then(response => this.provinces.value = response)
      .then(() => this.cleanDistricts())
      .then(() => this.loadDistrictsIfNeeded())
      .catch(error => this.handleError(error));
  }

  private getDistricts(provinceId: number) {
    this._mastersService.getDistricts(provinceId, -1, -1)
      .then(response => this.districts.value = response)
      .then(() => this.cities.value = null)
      .then(() => this.loadCitiesIfNeeded())
      .catch(error => this.handleError(error));
  }

  private getCities(districtId: number) {
    this._mastersService.getCities(districtId, -1, -1)
      .then(response => this.cities.value = response)
      .then(() => this.editAddress())
      .catch(error => this.handleError(error));
  }

  editAddress() {
    if (this.address.id === -1 || !this.fillFields) return;
    this.fillFields = false;
    this.addressForm.patchValue({
      idAddressType: this.addressType.value.find(place => Number(place.id) === Number(this.address.idAddressType)),
      idCountry: this.countries.value.find(country => Number(country.id) === Number(this.address.idCountry)),
      idProvince: this.provinces.value.find(province => Number(province.id) === Number(this.address.idProvince)),
      idDistrict: this.districts.value.find(district => Number(district.id) === Number(this.address.idDistrict)),
      idCity: this.cities.value.find(city => Number(city.id) === Number(this.address.idCity)),
      idPlaceType: this.places.value.find(place => Number(place.id) === Number(this.address.idPlaceType)),
      avenue: this.address.avenue,
      street: this.address.street,
      building: this.address.building,
      floor: this.address.floor,
      apartment: this.address.apartment,
      reference: this.address.reference,
      idEntity: this.profile.person.id.toString(),
      id: this.address.id
    });
  }
  onCloseDialog() {
    this.submitted = false;
    this.addressForm = null;
    this.onDismissDialog.emit(false)
  }

  private newAddressForm = () => {
    return this._formBuilder.group({
      id: -1,
      idAddressType: [0, Validators.required],
      idCountry: [0, Validators.required],
      idCity: [0, Validators.required],
      idDistrict: [0, Validators.required],
      idProvince: [0, Validators.required],
      idPlaceType: [0, Validators.required],
      avenue: [''],
      street: ['', Validators.required],
      building: ['', Validators.required],
      floor: ['', Validators.maxLength(2)],
      apartment: ['', Validators.maxLength(4)],
      reference: ''
    });
  }

  private mapCountryToBaseModel = (countries: Country[]): BaseModel[] => {
    return countries.map<BaseModel>(c => ({ id: c.id, name: c.name }));
  }

  private handleError(error: HttpErrorResponse) {
    this._dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  onSubmitProfile() {
    this.submitted = true;
    const addressesToSave: Address[] = [];

    if (this.addressForm) {
      if (this.addressForm.valid) {
        const formValues = {...this.addressForm.value};
        addressesToSave.push({
          idAddressType: formValues.idAddressType.id,
          idCity: formValues.idCity.id,
          idProvince: formValues.idProvince.id,
          idDistrict: formValues.idDistrict.id,
          idPlaceType: formValues.idPlaceType.id,
          avenue: formValues.avenue,
          street: formValues.street,
          building: formValues.building,
          floor: formValues.floor,
          apartment: formValues.apartment,
          reference: formValues.reference,
          idEntity: this.profile.person.id.toString(),
          id: this.address.id
        });
      }
    }
    this.profile.person.address = addressesToSave
    this.profile.person.phones = []
    this.saveAddress(this.profile)

  }
  saveAddress(profile: Profile) {
    this._usersService.saveProfile(profile)
      .then(_ => this.onDismissDialog.emit(true))
      .catch(error => this.handleError(error))
  }

  private cleanDistricts() {
    this.districts.value = null;
    this.cities.value = null;
  }
}
