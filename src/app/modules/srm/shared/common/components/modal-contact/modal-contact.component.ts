import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ContactFilter } from 'src/app/models/masters/contact-filter';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';

@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.component.html',
  styleUrls: ['./modal-contact.component.scss']
})
export class ModalContactComponent implements OnInit {

  SelectedContactNumber:ContactNumberSupplier = new ContactNumberSupplier();
  @ViewChild('dt',{static:false})dt:any
  selectedContact: any[] = [];
  selectedContactOnly: any = null;
  loading: boolean = false;

  @Input() visible: boolean = false;
  @Input("ContactsupplierFilters") ContactsupplierFilters: ContactFilter = new ContactFilter();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("multiple") multiple : boolean= false;
  @Input() model:boolean=false;

  @Input("contactmodal") contactmodal: ContactNumberSupplier;
  @Output("contactmodalChange") contactmodalChange= new  EventEmitter<ContactNumberSupplier>();

  constructor(private messageService: MessageService,
    public _supplierservice:SupplierService) { }

  ngOnInit(): void {
  }
  existCheck:boolean=false;
 
  displayedColumns:ColumnD<ContactNumberSupplier>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'Id', display: 'none' },
    { template: (data) => { return data.idCountry; }, header: 'Pais', field: 'idCountry', display: 'none' },
    { template: (data) => { return data.contact; }, header: 'Contacto', field: 'contact', display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'Pais', field: 'country', display: 'table-cell' },
    { template: (data) => { return   data.number; }, header: 'Telefono', field: 'number', display: 'table-cell' }
    // { template: (data) => { return data.type; }, header: 'Tipo', field: 'type', display: 'table-cell' }

  ];

  emitVisible() {
    this.onToggle.emit(this.visible);
  }
  onShow() {
    this.emitVisible();
    this.loadContact();
  }
  onHide(){
    this.emitVisible();
  }

  loadContact() {
    this.loading = true;
    this.ContactsupplierFilters.idCom = 1;
    this.ContactsupplierFilters.active = 1;
    this._supplierservice.getContactSupplierList(this.ContactsupplierFilters).subscribe((data: ContactNumberSupplier[]) => {
      this._supplierservice._supplierContacList = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }

  submitContact() {

    if (this.multiple) {
      if (this.selectedContact.length > 0) {
        this.contactmodal.name = "";
        this.contactmodal.id = -1;
        let cont = 0;
        for (let i = 0; i < this.selectedContact.length; i++) {
          cont += 1;
          //this.suppliermodal.socialReason = this.suppliermodal.socialReason == "" ? this.selectedContact[i].socialReason : cont >= 5 ? cont + " proveedores seleccionados" : this.suppliermodal.socialReason + ", " + this.selectedContact[i].socialReason;
          //this.filters.supplierstring= this.supplierstring;
          //this.suppliermodal.idSupplier = this.suppliermodal.idSupplier == "" ? this.selectedContact[i].id : this.suppliermodal.idSupplier + "," + this.selectedContact[i].id;
          this.contactmodalChange.emit(this.contactmodal);
          //this.supplierinputChange.emit(this.supplierinput);
          this.visible = false;
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
      }
    } else {
      if (this.selectedContact!= null && this.selectedContact.length==undefined) {
        this.selectedContactOnly = this.selectedContact;
        this.contactmodal.contact = this.selectedContactOnly.contact;
        this.contactmodal.number= this.selectedContactOnly.number;
        this.contactmodal.idContactNumber = this.selectedContactOnly.idContactNumber;
        this.contactmodal.direction= this.selectedContactOnly.direction;
        this.contactmodalChange.emit(this.contactmodal);
        this.visible = false;
      } else {

        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un contacto." });
      }

    }
  }

}
