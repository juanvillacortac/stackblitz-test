import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { ContactNumberSupplierComponent } from 'src/app/modules/common/components/contact-number-supplier/contact-number-supplier.component';
import { SupplierService } from '../../shared/services/supplier.service';

@Component({
  selector: 'app-contacts-suppliers',
  templateUrl: './contacts-suppliers.component.html',
  styleUrls: ['./contacts-suppliers.component.scss']
})
export class ContactsSuppliersComponent implements OnInit {
  idCompany : number = 0;
  public _contactNumbersCopy: ContactNumber[];
  @Input("_CompaniesListTemp") _CompaniesListTemp: any[] = [];
  @Input("_dataSupplierContacts") _dataSupplierContacts: SupplierExtend;
  @ViewChild(ContactNumberSupplierComponent ) contactDialog: ContactNumberSupplierComponent ; 
  contactNumberSupplierDialogVisible = false;
  contactNumberSupplierMasiveDialogVisible = false;
  selectedPhoneIndex: number = -1;
  contactexpanded: number = -1;
  _ContactFilterList : ContactNumberSupplier[] = []; 
  SelectedContactNumber:ContactNumberSupplier = new ContactNumberSupplier();
  @ViewChild('dt',{static:false})dt:any

  existCheck:boolean=false;
 
  displayedColumnsContacts:ColumnD<ContactNumberSupplier>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'Id', display: 'none' },
    { template: (data) => { return data.idCountry; }, header: 'Pais', field: 'idCountry', display: 'none' },
    { template: (data) => { return data.contact; }, header: 'Contacto', field: 'contact', display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'Pais', field: 'country', display: 'table-cell' },
    { template: (data) => { return  "(+"+data.areaCode+")"+" "+data.number; }, header: 'Telefono', field: 'number', display: 'table-cell' },
    { template: (data) => { return data.type; }, header: 'Tipo', field: 'type', display: 'table-cell' }

  ];

  constructor(public _supplierservice:SupplierService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
   
  }

  UpdateList(list : any[])
  {
  }


  showAddContactModal(event,id : number){
    event.stopPropagation();
    this.idCompany = id;
    this.contactNumberSupplierDialogVisible = true;
    //this.contactexpanded = id;
  }

  onHideContacNumberSupplier(visible: boolean) {
    this.contactNumberSupplierDialogVisible = visible;
  }

  onSubmitContactNumberSupplier(data) {
  
    if (data.identifier == -1)
      data.contactNumber.id = -1;

    var error = this.validatePhone(data.contactNumber, data.identifier);
    if (error === null) {
      if (data.identifier == -1) {
        this._dataSupplierContacts.contactNumbers = this._dataSupplierContacts.contactNumbers.concat(data.contactNumber);
        this._ContactFilterList = this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == this.idCompany );
        this.contactexpanded = this.idCompany;
      } else {
        this._dataSupplierContacts.contactNumbers.splice(data.identifier, 1, data.contactNumber);
        this.RefreshContactList( this._dataSupplierContacts.contactNumbers);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      this.contactDialog.edit(data.contactNumber, this.selectedPhoneIndex);
    }
  }

  onSubmitContactNumberSupplierMasive(data)
  {
    
    this._dataSupplierContacts.contactNumbers=data.contactNumbers;
    this._ContactFilterList=this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany==this.idCompany);
  }

  
  showPhoneMenu(event: Event, menu: Menu, index: number) {
    this.selectedPhoneIndex = index;
    menu.toggle(event);
  }

  validatePhone(contactNumber: ContactNumberSupplier, identifier: number) {
    
    this._contactNumbersCopy = [];
    this._dataSupplierContacts.contactNumbers.forEach(element => {
      this._contactNumbersCopy.push(element);
    });
    if (identifier == -1) {
      this._contactNumbersCopy.push(contactNumber);
    } else {
      this._contactNumbersCopy.splice(identifier, 1, contactNumber);
    }
    var index = this._dataSupplierContacts.contactNumbers.findIndex(x => x.idCountry == contactNumber.idCountry && x.number == contactNumber.number && x.idcompany == contactNumber.idcompany);

      if (index >= 0 && index == identifier || index < 0) {
        return null;
      } else {
        return "El número de télefono ya se ha agregado previamente a la lista.";
      }
    
  }

  editContact(contact:ContactNumberSupplier,index:number)
  {
    this.selectedPhoneIndex=index;
    this.contactDialog.edit(
      this._dataSupplierContacts.contactNumbers.find(x=>x ==contact)
      , this._dataSupplierContacts.contactNumbers.findIndex(x=>x==contact));
  }
    
    removeContact(contact:ContactNumberSupplier)
    {
      
      if(contact.idContactNumber<=0)
      {  this._ContactFilterList=this._ContactFilterList.filter(x => x !=contact);
         this._dataSupplierContacts.contactNumbers =  this._dataSupplierContacts.contactNumbers.filter(x => x !=contact);
      }
      else
      {
        this.confirmationService.confirm({
          message: '¿Está seguro que desea eliminar el registro?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
                this._supplierservice.InactiveContactSupplier(contact.idClientSupplier,contact.idcompany,contact.idContactNumber).subscribe((data) => {
                if (data> 0)
                {
                  this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Se eliminó el registro exitosamente." });
                  this._dataSupplierContacts.contactNumbers =  this._dataSupplierContacts.contactNumbers.filter(x => x !=contact);
                  this._ContactFilterList=this._ContactFilterList.filter(x => x !=contact);
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


    searchContactsByIdCompany(id: number,e:Event)
    { 
      e.stopPropagation();   
      this.idCompany = id;
      this._ContactFilterList = this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == id );
    
    }

    onRowSelect(event){
      this.idCompany = this.SelectedContactNumber.idcompany;
      this.contactexpanded = this.SelectedContactNumber.idcompany;
    }

    showMasive(e:any)
    { 
      event.stopPropagation();
      this.contactNumberSupplierMasiveDialogVisible=true;
    }

    onHideMasive(visible: boolean) {
      this.contactNumberSupplierMasiveDialogVisible = visible;
    }

    RefreshContactList(contactList :any[])
    {
      this._ContactFilterList = contactList.filter(x=>x.idcompany ==  this.idCompany );
    }

    getCompaniesListTemp(id:Number)
    {
      this._ContactFilterList = this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == id );
      
    }

    PrintCheck(id:Number)
    {
      if(this._dataSupplierContacts.contactNumbers != null && this._dataSupplierContacts.contactNumbers != undefined)
      {
        var a =   this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == id);
        if(a != null && a != undefined && a.length > 0)
          return true;
        else
          return false;
      }else
      {
       
       return false;
      }
    }


    GetListAndCheck(id:Number)
    {
      
      var exist =   this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == id);
      if(exist.length > 0)
      {
        this.existCheck = true;
        this._ContactFilterList = this._dataSupplierContacts.contactNumbers.filter(x=>x.idcompany == id );
        return  this._ContactFilterList;
      }else
      {
        this.existCheck = false;
        return this._ContactFilterList=[];
      }
    }

  }




