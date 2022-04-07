import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AddressSupplier } from 'src/app/models/masters/addres-supplier';
import { Address } from 'src/app/models/masters/address';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { EditAddressComponent } from 'src/app/modules/common/components/edit-address/edit-address.component';
import { SupplierService } from '../../shared/services/supplier.service';

@Component({
  selector: 'app-addresses-suppliers',
  templateUrl: './addresses-suppliers.component.html',
  styleUrls: ['./addresses-suppliers.component.scss']
})
export class AddressesSuppliersComponent implements OnInit {
  @Input("_dataSupplier") _dataSupplier: SupplierExtend;
  @ViewChild(EditAddressComponent) addressDialog: EditAddressComponent; 
  selectedAddressIndex: number = -1;
  addressDialogVisible: boolean = false;
  addresses:Address[]=[];
  public _addressCopy: Address[];
  displayedColumnsAddress: ColumnD<AddressSupplier>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'Id', display: 'none' },
    { template: (data) => { return data.addressType; }, header: 'Tipo', field: 'addressType', display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
    { template: (data) => { return data.state; }, header: 'Estado', field: 'state', display: 'table-cell' },
    { template: (data) => { return data.municipality; }, header: 'Municipio', field: 'municipality', display: 'table-cell' },
    { template: (data) => { return data.city; }, header: 'Ciudad', field: 'city', display: 'table-cell' },
    { template: (data) => { return data.street; }, header: 'Calle/Avenida', field: 'street', display: 'table-cell' },
    { template: (data) => { return data.edifice; }, header: 'Edificio', field: 'edifice', display: 'table-cell' }
  ];
  constructor( public _supplierservice:SupplierService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.addresses=this._dataSupplier.addresses;
  }

  editAddress(address:Address,index:number)
  {
    this.selectedAddressIndex=index;
    this.addressDialog.edit(this._dataSupplier.addresses[this.selectedAddressIndex], this.selectedAddressIndex);
  }

  removeAddress(address:AddressSupplier)
  {
    if(address.id<=0)
       this._dataSupplier.addresses =  this._dataSupplier.addresses.filter(x => x !=address);

    else
    {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar el registro?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
                this._supplierservice.InactiveAddressSupplier(address.idClientSupllier,address.id).subscribe((data) => {
             if (data> 0)
             {
                   this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Se eliminó el registro exitosamente." });
                   this._dataSupplier.addresses =  this._dataSupplier.addresses.filter(x => x !=address);
             }
             else
             {     
                if(data==0)
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos." });   
             }
            }, (error: HttpErrorResponse) => {
                 this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos." });
             });
        },
        reject: (type) => {
          switch (type) {
           
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }); 
    }
  }

  onSubmitAddress(data) {
    if (data.identifier == -1)
      data.address.id = -1;

    var error = this.validateAddress(data.address, data.identifier);

    if (error === null) {
      if (data.identifier == -1) {
        this._dataSupplier.addresses = this._dataSupplier.addresses.concat(data.address);
      } else {
        this._dataSupplier.addresses.splice(data.identifier, 1, data.address);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      this.addressDialog.edit(data.address, this.selectedAddressIndex);
    }
  }

  onToggleAddress(visible: boolean) {
    this.addressDialogVisible = visible;
  }

  validateAddress(address: Address, identifier: number) {
    this._addressCopy = [];
    this._dataSupplier.addresses.forEach(element => {
      this._addressCopy.push(element);
    });
    if (identifier == -1) {
      this._addressCopy.push(address);
    } else {
      this._addressCopy.splice(identifier, 1, address);
    }
    var AddressType = this._dataSupplier.addresses.filter(x => x.idAddressType == 1);
    var index = this._dataSupplier.addresses.findIndex(x => x.id == address.id && x.idAddressType == address.idAddressType);

    // if(address.idAddressType == 1 && AddressType.length >= 1 && address.id != AddressType[0].id)
    // {
    //   return "Ya se encuentra registrada una dirección fiscal.";
    // } else {
    //   if (index >= 0 && index == identifier || index < 0) {
    //     return null;
    //   } else {
    //     return "La dirección ya se ha agregado previamente a la lista.";
    //   }
    // }

    if(address.idAddressType == 1 && AddressType.length >= 1 && address.id != AddressType[0].id )
    {
      return "Ya se encuentra registrada una dirección fiscal.";
    }else
    {
      return null;
    }
  }

}
