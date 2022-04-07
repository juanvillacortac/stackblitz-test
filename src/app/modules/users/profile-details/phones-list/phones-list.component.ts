import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Columns } from 'src/app/models/common/columns';
import { Phone } from 'src/app/models/users/Phones';
import { MastersService } from '../../shared/masters.service';
import { UsersService } from '../../shared/users.service';
import { PhoneVieModel } from '../../shared/view-model/phone.viewmodel';
import {Address} from "../../../../models/users/Address";
import {AddressViewModel} from "../../shared/view-model/address.viewmodel";

@Component({
  selector: 'app-phones-list',
  templateUrl: './phones-list.component.html',
  styleUrls: ['./phones-list.component.scss']
})
export class PhonesListComponent implements OnInit {
  @Input() userId: number;
  @Output() displayPhoneDialog: EventEmitter<boolean> = new EventEmitter();
  @Output() editPhoneEmitter: EventEmitter<number> = new EventEmitter();
  @Input() phonesVM: PhoneVieModel[];
  displayedPhoneColumns: Columns[] =
  [
   {field: 'id', header: 'Id', display: 'none'},
   {field: 'idEntidad', header: 'idEntidad', display: 'none'},
   {field: 'idPhoneType', header: 'idPhoneType', display: 'none'},
   {field: 'idCountry', header: 'idCountry', display: 'none'},
   {field: 'phoneType', header: 'Tipo', display: 'table-cell'},
   {field: 'prefix', header: 'Prefijo', display: 'table-cell'},
   {field: 'phoneNumber', header: 'Número', display: 'table-cell'}
  ];
  constructor(public _usersService: UsersService,
    private _mastersService: MastersService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
  }

  ngOnInit(): void {

    // this.getProfile(this.userId)
    // .then(profile => profile.person)
    //   .then(person => person.phones)
    //   .then(addresses => { this.phones = addresses; return this.fromPhoneToPhoneVM(addresses); })
    //   .then( addressesVM => this.phonesVM = addressesVM)
    // .catch(error => throwError(error));
  }

  getProfile = (userId: number) => {
    return this._usersService.getEntityProfile(Number(userId)).then(profile =>  profile).catch(error => {
      this.messageService.add({severity:'error', summary:'Cargar perfil', detail: error.message});
      throwError(error);
  });
  }


  public onEmitPhoneDialog(open: boolean): void {
    this.displayPhoneDialog.emit(open);
  }

  public onEmitEditPhone(idPhone: any): void {
    this.editPhoneEmitter.emit(Number(idPhone));
  }


}
