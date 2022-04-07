import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs/internal/observable/throwError';

import { Columns } from 'src/app/models/common/columns';
import { MastersService } from '../../shared/masters.service';
import { UsersService } from '../../shared/users.service';
import { AddressViewModel } from '../../shared/view-model/address.viewmodel';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit {
  @Input() userId: number;
  @Output() displayAddressDialog: EventEmitter<boolean> = new EventEmitter();
  @Output() editAddressEmitter: EventEmitter<number> = new EventEmitter();
  @Input()  addressesVM: AddressViewModel[] = [];
  displayedAddressColumns: Columns[] =
  [
   {field: 'id', header: 'Id', display: 'none'},
   {field: 'addressType', header: 'Tipo de Dirección', display: 'none'},
   {field: 'city', header: 'Ciudad', display: 'table-cell'},
   {field: 'district', header: 'Municipio', display: 'table-cell'},
   {field: 'province', header: 'Estado', display: 'table-cell'},
   {field: 'placeType', header: 'Tipo de hogar', display: 'none'},
   {field: 'avenue', header: 'Avenida', display: 'table-cell'},
   {field: 'street', header: 'Calle', display: 'table-cell'},
   {field: 'building', header: 'Edificio', display: 'table-cell'},
   {field: 'floor', header: 'Piso', display: 'table-cell'},
   {field: 'apartment', header: 'Dept.', display: 'table-cell'},
   {field: 'reference', header: 'Referencia', display: 'none'}
  ];

  constructor(public _usersService: UsersService,
    private _mastersService: MastersService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  getProfile = (userId: number) => {
    return this._usersService.getEntityProfile(Number(userId)).then(profile =>  profile).catch(error => {
      this.messageService.add({severity:'error', summary:'Cargar perfil', detail: error.message});
      throwError(error);
  });
  }

  public onEmitAddressDialog(open: boolean): void {
    this.displayAddressDialog.emit(open);
  }

  public onEmitEditAddress(idAddress: any): void {
    this.editAddressEmitter.emit(Number(idAddress));
  }

}
