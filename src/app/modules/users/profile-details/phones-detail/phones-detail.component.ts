import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Phone } from "../../../../models/users/Phones";
import { CountryViewModel } from "../../shared/view-model/country.viewmodel";
import { Country } from "../../../../models/masters/country";
import { BaseModel } from "../../../../models/common/BaseModel";
import { SelectItem } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersService } from "../../shared/users.service";
import { MastersService } from "../../shared/masters.service";
import { DialogsService } from "../../../common/services/dialogs.service";
import { Profile } from "../../../../models/users/Profile";

@Component({
  selector: 'app-phones-detail',
  templateUrl: './phones-detail.component.html',
  styleUrls: ['./phones-detail.component.scss']
})
export class PhonesDetailComponent implements OnInit {
  @Input() profile: Profile;
  @Input() phone: Phone;
  @Output() onDismissDialog: EventEmitter<boolean> = new EventEmitter();
  formTittle: string;
  phoneDialog: boolean;
  submitted = false;
  phoneForm: FormGroup;
  phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
  phoneTypes: SelectItem<BaseModel[]> = {value: null};

  constructor(public _usersService: UsersService,
              private readonly _mastersService: MastersService,
              private readonly _formBuilder: FormBuilder,
              private readonly _dialogService: DialogsService) { }

  ngOnInit(): void {
    this.phoneForm = this.newPhoneForm();
    this.getCountries();
    this.formTittle = this.phone.id === -1 ? "Agregar teléfono" : "Editar teléfono";
  }

  onCloseDialog() {
    this.submitted = false;
    this.phoneForm = null;
    this.onDismissDialog.emit(false)
  }

  private getCountries() {
    this._mastersService.getCountries(-1, -1)
      .then(countries => this.setProfilePrefixes(countries))
      .then(() => this.getPhoneTypes())
      .catch(error => this.handleError(error));
  }

  private setProfilePrefixes(countries: Country[]) {
    this.phonePrefixes.value = countries.map<CountryViewModel>(country => this.toViewModel(country))
  }

  private toViewModel = (country): CountryViewModel => {
    return {
      id: country.id,
      code: country.code,
      codePrefix: country.code + ' +' + country.prefix,
      prefix: country.prefix
    };
  }

  setEditPhoneForm(phone: Phone) {
    this.phoneForm.patchValue({
      idPhoneType: this.phoneTypes.value.find(type => type.id === phone.idPhoneType),
      prefix: this.phonePrefixes.value.find(prefix => prefix.prefix === phone.prefix),
      phoneNumber: phone.phoneNumber
    });
  }

  onSubmitProfile() {
    const phonesToSave: Phone[] = [];
    if (this.phoneForm) {
      if (this.phoneForm.value) {
        const formPhoneValues = {...this.phoneForm.value};
        phonesToSave.push({
          id: this.phone.id ?? -1,
          idEntity: Number(this.profile.person.id),
          idPhoneType: formPhoneValues.idPhoneType.id,
          idCountry: formPhoneValues.prefix.id,
          phoneType: '',
          phoneNumber: formPhoneValues.phoneNumber,
          prefix: formPhoneValues.prefix.prefix
        });
      }
    }
    this.profile.person.phones = phonesToSave;
    this.profile.person.address = []
    return this._usersService.saveProfile(this.profile)
      .then(_ => this.onDismissDialog.emit(true))
      .catch(error => this.handleError(error))
  }
  private getPhoneTypes() {
    this._mastersService.getPhonetypes({ idPhoneType: -1 })
      .then(response => this.phoneTypes.value = response)
      .then(() => this.setEditPhoneForm(this.phone))
      .catch(error => this.handleError(error));
  }

  private newPhoneForm() {
    return this._formBuilder.group({
      idPhoneType: [0, Validators.required],
      phoneNumber: ['', Validators.required],
      prefix: [0, Validators.required],
    });
  }
  private handleError(error: HttpErrorResponse) {
    this._dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
