import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {BreadcrumbService} from 'src/app/design/breadcrumb.service';
import {Entity} from 'src/app/models/security/Entity';
import {User} from 'src/app/models/security/User';
import {Address} from 'src/app/models/users/Address';
import {Phone} from 'src/app/models/users/Phones';
import {EntityViewModel} from '../../shared/view-models/Entity.viewmodel';
import {UserViewModel} from '../../shared/view-models/User.viewmodel';
import {UserService} from '../shared/user.service';
import {CountryViewModel} from 'src/app/modules/users/shared/view-model/country.viewmodel';
import {MastersService} from 'src/app/modules/users/shared/masters.service';
import {DateHelperService} from 'src/app/modules/common/services/date-helper/date-helper.service';
import {LoadingService} from 'src/app/modules/common/components/loading/shared/loading.service';
import {DialogsService} from 'src/app/modules/common/services/dialogs.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Country} from "../../../../models/masters/country";
import {IdentifierType} from 'src/app/models/security/IdentifierType';
import {LaborRelationshipFilter} from "../../../hcm/shared/filters/laborRelationship/labor-relationship-filter";
import {LaborRelationshipService} from '../../../hcm/shared/services/labor-relationship.service';
import {LaborRelationship} from "../../../hcm/shared/models/laborRelationship/labor-relationship";
import {AuthService} from "../../../login/shared/auth.service";
import {Employee} from "../../../hcm/shared/models/laborRelationship/employee";
import {PhoneNumber} from "../../../hcm/shared/models/laborRelationship/phone-number";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  providers: []
})

export class RegisterUserComponent implements OnInit {
  statusSelected = null;
  userForm: FormGroup;
  entityExistsForm: FormGroup;
  id: string;
  isAddMode: boolean;
  isWizardMode: boolean;
  genderOptions: SelectItem[] = [];
  maritalOptions: SelectItem[] = [];
  identifierTypeOptions: SelectItem[] = [];
  statusOptions: SelectItem[] = [];
  minDate: Date;
  maxDate: Date;
  phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
  laborRelationshipFilter = new LaborRelationshipFilter();
  isExternal: boolean;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _userService: UserService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _mastersService: MastersService,
    private readonly _dateHelper: DateHelperService,
    private readonly _dialogService: DialogsService,
    private readonly _loadingService: LoadingService,
    private readonly _laborRelationshipService: LaborRelationshipService,
    private readonly _authService: AuthService
  ) {
    this.setBreadCrumb();
    this.setMinAndMaxDate();
    this.loadIdentifierTypes();
  }

  ngOnInit() {
    this.isWizardMode = this._route.snapshot.url[0].path === 'registro' ?? false;
    this.id = this._route.snapshot.params['id'] ?? '';
    this.isAddMode = !this.id;

    this.setGenderOptions();
    this.setMaritalOptions();
    this.setStatusOptions();
    this.getPrefixes();

    this.entityExistsForm = this.setNewEntityExistsForm();
    this.userForm = this.setNewUserForm();

    this.enableUserForm(false);
    this.enableInputDni(false);

    if (!this.isAddMode) {
      this.getUser();
    }
  }

  onCheckEntityExist() {
    this.enableUserForm(false);
    this._userService.getEntity(0,
      Number(this.entityExistsForm.controls.identifierType.value),
      this.entityExistsForm.controls.dniNumber.value
    )
      .then(result => {
        if (!result) {
          this.getLaborRelationship();
        } else {
          const person: EntityViewModel = this.personToViewModel(result);
          const userActive: User = result.users?.find(p => p.status);
          const userViewModel = this.userToViewModel(person, userActive);
          this.userForm.setValue(userViewModel);
          this.enableUserForm(!userActive);

          if (userActive) {
            this._dialogService.errorMessage('Verificación de persona', 'El usuario ya se encuentra registrado.');
          }
        }
      })
      .catch(error => this.handleError(error));
  }

  onSubmitEntity() {
    if (this.userForm.invalid && this.entityExistsForm.invalid) {
      return;
    }
    const formValues = {...this.userForm.value};

    const payload: User = this.getPayloadFromForm(formValues);
    if (this.isAddMode) {
      return this._userService.createEntity(payload)
        .then(result => {
          this._dialogService.successMessage('Creacion de Usuario', 'Usuario creado de forma exitosa');
          this.userForm.reset(this.setNewUserForm());
          this.entityExistsForm.reset(this.setNewEntityExistsForm());
          if (this.isWizardMode) {
            this._router.navigate(['/security/register-wizard/roles', result]);
          }
        })
        .catch(error => this.handleError(error));
    }
  }

  onIdentifierTypeSelected() {
    this.enableInputDni(true);
    this.entityExistsForm.controls['dniNumber'].reset();
    this.userForm.reset(this.setNewUserForm());
    this.enableUserForm(false);
  }

  onDniNumberKeyUp() {
    this.userForm.reset(this.setNewUserForm());
    this.enableUserForm(false);
  }

  onUpdateStatus() {
    this._loadingService.startLoading();
    this._userService.updateUserStatus(Number(this.id), Number(this.statusSelected))
      .then(() => this.successResult())
      .catch(error => this.handleError(error));
  }

  cancel() {
    this._router.navigate(['/security/user-list']);
  }

  private getPrefixes() {
    this._mastersService.getCountries(-1, -1)
      .then(countries => this.phonePrefixes.value = this.mapPhonePrefixes(countries))
      .catch(error => this.handleError(error));
  }

  private getUser() {
    if (this.id) {
      this._userService.getUserEntity(Number(this.id))
        .then(user => {
            if (user && user.person) {
              const person = this.personToViewModel(user.person);
              const userViewModel = this.userToViewModel(person, user);
              const identityViewModel = this.identityToViewModel(user.person);
              this.userForm.patchValue(userViewModel);
              this.entityExistsForm.patchValue(identityViewModel);
              this.statusSelected = String(userViewModel.status);
              this.enableUserForm(false);
              this.entityExistsForm.disable();
            } else {
              this._dialogService.errorMessage('Datos incompletos', 'El usuario seleccionado posee datos incompletos')
            }
          }
        )
        .catch(error => this.handleError(error));
    }
  }

  private getLaborRelationship() {
    this.laborRelationshipFilter.idCompany = this._authService.currentCompany;
    this.laborRelationshipFilter.idDocumentType = Number(this.entityExistsForm.controls.identifierType.value);
    this.laborRelationshipFilter.documentNumber = this.entityExistsForm.controls.dniNumber.value;
    
    this.enableUserForm(true);

    this._laborRelationshipService.getLaborRelationshipPromise(this.laborRelationshipFilter)
      .then(result => {
        this.userForm.patchValue(this.laborRelationshipToViewModel(result));
        this.isExternal = false;
      })
      .catch(_ => {
          this.userForm.reset();
          this.isExternal = true;
        }
      );
  }

 
  private getPayloadFromForm(formValues: any): User {
    const phones: Phone[] = this.phoneToSave();
    const address: Address[] = [];
    return {
      id: Number(formValues.id ?? 0),
      idEntity: -1,
      phone: phones.find(item => item.id === -1),
      mainEmail: formValues.mainEmail,
      observations: formValues.observations ?? '',
      secondaryEmail: formValues.secondaryEmail ?? '',
      status: Number(this.statusOptions.find(status => Number(status.value) === 1)?.value) ?? 1,
      userType: this.isExternal ? 2 : 1,
      person: {
        birthDate: this._dateHelper.gmtToUTC(formValues.person.birthDate),
        businessReason: formValues.person.businessReason ?? '',
        identifier: this.entityExistsForm.value.identifier,
        dniNumber: this.entityExistsForm.value.dniNumber,
        gender: formValues.person.gender,
        id: Number(formValues.person.id ?? -1) ?? -1,
        identifierType: Number(this.entityExistsForm.value.identifierType),
        imagen: formValues.person.imagen ?? '',
        lastName: formValues.person.lastName,
        maritalStatus: formValues.person.maritalStatus,
        name: formValues.person.name,
        nit: formValues.person.nit ?? '',
        observations: formValues.person.observations ?? '',
        secondLastName: formValues.person.secondLastName ?? '',
        secondName: formValues.person.secondName ?? '',
        status: Number(formValues.person.status),
        tradeName: formValues.person.tradeName ?? '',
        address: address,
        phones: phones
      }
    };
  }

  private loadIdentifierTypes() {
    this._userService.getIdentifierTypes(-1, 1)
      .then(result => this.mapToIdentifierTypeOptions(result))
      .catch(error => this.handleError(error));
  }

  private enableInputDni(isEnable: boolean) {
    if (isEnable) {
      this.entityExistsForm.controls['dniNumber'].enable();
    } else {
      this.entityExistsForm.controls['dniNumber'].disable();
    }
  }

  public resetForm() {
    if (this.userForm.dirty || this.entityExistsForm.dirty) {
      this._confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar usuario?',
        accept: () => {
          this.userForm.reset(this.setNewUserForm());
          this.entityExistsForm.reset(this.setNewEntityExistsForm());
          this._router.navigate(['/security/user-list']);
        }
      });
    } else {
      this._router.navigate(['/security/user-list']);
    }
  }

  private handleError(error: HttpErrorResponse) {
    this._loadingService.stopLoading();
    this._dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

  private successResult() {
    this._loadingService.stopLoading();
    this._dialogService.successMessage('security', 'saved');
    this._router.navigate(['/security/user-list']);
  }

  private boolToNumber = value => value ? 1 : 0;

  private resetPhoneModel = () => <Phone>{
    id: 0,
    idPhoneType: 0,
    phoneType: '',
    phoneNumber: '',
    prefix: '',
    idEntity: 0,
    idCountry: 0
  };

  private phoneToSave() {
    const formValues = {...this.userForm.value};
    const phonesToSave: Phone[] = [];
    if (formValues.person.phones) {
      const formPhoneValues = {...formValues.person.phones};
      phonesToSave.push({
        id: -1,
        idEntity: Number(formValues.person.id),
        idPhoneType: 1,
        idCountry: Number(formPhoneValues.prefix.id),
        phoneType: '',
        phoneNumber: formPhoneValues.phoneNumber,
        prefix: formPhoneValues.prefix.prefix
      });
    }
    return phonesToSave;
  }

  private enableUserForm(isEnable: boolean) {
    if (isEnable) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  private identityToViewModel = (person: Entity) => <IdentityForm>{
    identifierType: person.identifierType ?? 0,
    dniNumber: person.dniNumber,
  };

  private laborRelationshipToViewModel(relationship: LaborRelationship) {
    return <UserViewModel>{
      mainEmail: relationship?.employee?.email ?? '',
      observations: '',
      secondaryEmail: '',
      status: Number(this.statusOptions.find(status => Number(status.value) === this.boolToNumber(relationship?.estatus)).value) ?? 0,
      id: -1,
      phone: this.resetPhoneModel(),
      person: this.employeeToViewModel(relationship.employee)
    };
  }

  private employeeToViewModel(employee: Employee) {
    return <EntityViewModel>{
      identifierType: employee?.idDocumentType ?? 0,
      identifier: employee.identifier,
      dniNumber: employee.documentNumber,
      birthDate: this._dateHelper.gmtToUTC(new Date(employee.birthDate)),
      businessReason: '',
      gender: this.genderOptions.find(gender => gender.value === employee.gender)?.value ?? 'A',
      id: -1,
      imagen: employee.pictureSource ?? '',
      lastName: employee.employeeLastName,
      maritalStatus: this.maritalOptions.find(marital => marital.value === employee.maritalState)?.value ?? 'C',
      name: employee.employeeFirstName,
      nit: '',
      observations: '',
      secondLastName: employee.employeeSecondLastName,
      secondName: employee.employeeSecondName,
      status: Number(this.statusOptions.find(status => Number(status.value) === this.boolToNumber(employee.idEstatus))?.value) ?? 1,
      tradeName: '',
      phones: this.PhoneNumberToViewModel(employee.phoneNumbers)
    };
  }

  private personToViewModel(person: Entity) {
    return <EntityViewModel>{
      identifierType: person.identifierType ?? 0,
      identifier: person.identifier,
      dniNumber: person.dniNumber,
      birthDate: this._dateHelper.gmtToUTC(new Date(person.birthDate)),
      businessReason: person.businessReason,
      gender: this.genderOptions.find(gender => gender.value === person.gender)?.value ?? 'A',
      id: Number(person.id ?? -1),
      imagen: person.imagen ?? '',
      lastName: person.lastName,
      maritalStatus: this.maritalOptions.find(marital => marital.value === person.maritalStatus)?.value ?? 'C',
      name: person.name,
      nit: person.nit,
      observations: person.observations,
      secondLastName: person.secondLastName,
      secondName: person.secondName,
      status: Number(this.statusOptions.find(status => Number(status.value) === this.boolToNumber(person.status))?.value) ?? 1,
      tradeName: person.tradeName,
      phones: this.phoneToViewModel(person.phones)
    };
  }

  private userToViewModel(person: EntityViewModel, user: User = null) {
    return <UserViewModel>{
      mainEmail: user?.mainEmail ?? '',
      observations: user?.observations ?? '',
      secondaryEmail: user?.secondaryEmail ?? '',
      status: Number(this.statusOptions.find(status => Number(status.value) === this.boolToNumber(user?.status)).value) ?? 0,
      id: user?.id ?? -1,
      phone: this.resetPhoneModel(),
      person: person
    };
  }

  private mapToIdentifierTypeOptions(result: IdentifierType[]) {
    result.map((data) => {
      this.identifierTypeOptions.push({
        value: data.id,
        label: data.type.toString().concat(' ( ' + data.identifier + ' )')
      });
    });
    this.identifierTypeOptions.sort((a, b) => a.label.localeCompare(b.label));
  }

  private PhoneNumberToViewModel(phones: PhoneNumber[]) {
    let phone: Phone = this.resetPhoneModel();
    if (phones != null) {
      if (phones.length > 0) {
        const phonesList = phones?.find(phoneType => phoneType.idPhoneNumberType === Number(1));
        if (phone != null) {
          return <Phone>{
            id: phonesList?.idPhoneNumber ?? 0,
            idPhoneType: phonesList?.idPhoneNumberType ?? 0,
            phoneType: '',
            phoneNumber: phonesList?.number ?? '',
            prefix: this.phonePrefixes?.value.find(prefix => prefix.id === phonesList.idCountry) ?? '',
            idEntity: 0,
            idCountry: phonesList.idCountry ?? 0
          };
        }
      }
    }
    return phone;
  }

  private phoneToViewModel(phones: Phone[]) {
    let phone: Phone = this.resetPhoneModel();
    if (phones != null) {
      if (phones.length > 0) {
        const phonesList = phones?.find(phoneType => phoneType.idPhoneType === Number(1));
        if (phonesList != null) {
          phone = <Phone>{
            id: phonesList?.id ?? 0,
            idPhoneType: phonesList?.idPhoneType ?? 0,
            phoneType: phonesList?.phoneType ?? '',
            phoneNumber: phonesList?.phoneNumber ?? '',
            prefix: this.phonePrefixes?.value.find(prefix => prefix.prefix === phonesList.prefix) ?? '',
            idEntity: phonesList?.idEntity ?? '',
            idCountry: phonesList?.idCountry ?? 0,
          };
        }
      }
    }
    return phone;
  }

  private mapPhonePrefixes(countries: Country[]) {
    const countryViewModel: CountryViewModel[] = [];
    countries.forEach(country => {
      countryViewModel.push({
        id: country.id,
        code: country.code,
        codePrefix: country.code + ' +' + country.prefix,
        prefix: country.prefix
      });
    });
    return countryViewModel;
  }

  private setMinAndMaxDate() {
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  private setNewEntityExistsForm() {
    return this._formBuilder.group({
      identifierType: ['', Validators.required],
      dniNumber: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }
  
  private setBreadCrumb() {
    this._breadcrumbService.setItems([
      {label: 'Seguridad'},
      {label: 'Usuarios', routerLink: ['/security/user-list']}
    ]);
  }
  
  private setGenderOptions() {
    this.genderOptions = [
      {'value': 'F', 'label': 'Femenino'},
      {'value': 'M', 'label': 'Masculino'}
    ];
  }

  private setMaritalOptions() {
    this.maritalOptions = [
      {'value': 'C', 'label': 'Casado(a)'},
      {'value': 'D', 'label': 'Divorciado(a)'},
      {'value': 'S', 'label': 'Soltero(a)'},
      {'value': 'V', 'label': 'Viudo(a)'}
    ];
  }

  private setStatusOptions() {
    this.statusOptions = [
      {'value': "1", 'label': 'Activo'},
      {'value': "0", 'label': 'Inactivo'}
    ];
  }

  private setNewUserForm() {
    return this._formBuilder.group({
        mainEmail: ['', Validators.pattern('^[_aA-zZ0-9._%+-]+@[_aA-zZ0-9.-]+\\.[Aa-zZ]{2,4}$')],
        secondaryEmail: ['', Validators.pattern('^[aA-zZ0-9._%+-]+@[aA-zZ0-90-9.-]+\\.[a-z]{2,4}$')],
        status: [''],
        observations: [''],
        id: [0],
        phone: this._formBuilder.group({
          id: [0],
          idPhoneType: 0,
          phoneType: '',
          idEntity: 0,
          idCountry: 0,
          prefix: [''],
          phoneNumber: [''],
        }),
        person: this._formBuilder.group({
          id: [{value: -1, disabled: true}],
          name: ['', Validators.required],
          secondName: [''],
          lastName: ['', Validators.required],
          secondLastName: [''],
          identifierType: [{value: '', disabled: true}],
          identifier: [''],
          dniNumber: [''],
          birthDate: ['', Validators.required],
          maritalStatus: ['', Validators.required],
          status: [''],
          gender: ['', Validators.required],
          observations: [''],
          businessReason: [''],
          tradeName: [''],
          nit: [''],
          imagen: [''],
          phones: this._formBuilder.group({
            id: [0],
            idPhoneType: 0,
            phoneType: '',
            idEntity: 0,
            idCountry: 0,
            prefix: ['', Validators.required],
            phoneNumber: ['', Validators.required],
          })
        }),
      }
    );
  }
}

export class IdentityForm {
  identifierType: number;
  dniNumber: string;
}
