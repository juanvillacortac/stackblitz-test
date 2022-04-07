import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { EditContactNumbersComponent } from 'src/app/modules/common/components/add-contact-numbers/edit-contact-numbers.component';
import { EditAddressComponent } from 'src/app/modules/common/components/edit-address/edit-address.component';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CompaniesFilter } from '../../../companies/shared/filters/companies-filter';
import { CompanyService } from '../../../companies/shared/services/company.service';
import { BranchofficeFilter } from '../../shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../shared/services/branchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Address } from 'src/app/models/masters/address';

@Component({
  selector: 'app-branchoffices-edit-dialog',
  templateUrl: './branchoffices-edit-dialog.component.html',
  styleUrls: ['./branchoffices-edit-dialog.component.scss']
})

export class BranchofficesEditDialogComponent implements OnInit{

  submitted: boolean = false;
  public _branchOffice: Branchoffice;
  public _contactNumbersCopy: ContactNumber[] ;
  public _addressCopy: Address[] ;
  companyfilters: CompaniesFilter = new CompaniesFilter();
  _validations:Validations=new Validations();
  
  visible: boolean = false;
  addressDialogVisible: boolean = false;
  _changestatus: boolean = false;
  contactNumberDialogVisible: boolean = false;
  permissionsIDs = {...Permissions};

  selectedPhoneIndex: number = -1;
  selectedAddressIndex: number = -1;

  @Input("filters") filters: BranchofficeFilter;
  @Input("branchOfficeId") branchOfficeId: number = -1;
  @ViewChild(EditAddressComponent) addressDialog: EditAddressComponent; 
  @ViewChild(EditContactNumbersComponent) contactDialog: EditContactNumbersComponent; 
            
  branchOfficeTypeList: SelectItem[];
  companyList : SelectItem[]; 
  statusList: SelectItem[];
  nationalPurchasesList: SelectItem[];
  internationalPurchasesList: SelectItem[];

  menuItemsPhone: MenuItem[] = [
      {
        label: 'Editar', 
        icon: 'pi pi-fw pi-pencil',
        command: (t)=>{
          this.contactDialog.edit(this._branchOffice.contactNumbers[this.selectedPhoneIndex], this.selectedPhoneIndex);
        }
      },
      {
        label: 'Eliminar', 
        icon: 'pi pi-fw pi-trash',
        command: (t)=>{
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro que desea eliminar este número de teléfono?',
            accept: () => {
              this._branchOffice.contactNumbers.splice(this.selectedPhoneIndex,1);
            },
          });            
        }
      }
  ];  

  menuItemsAddress: MenuItem[] = [
    {
      label: 'Editar', 
      icon: 'pi pi-fw pi-pencil',
      command: (t)=>{
        this.addressDialog.edit(this._branchOffice.addresses[this.selectedAddressIndex], this.selectedAddressIndex);
      }
    },
    {
      label: 'Eliminar', 
      icon: 'pi pi-fw pi-trash',
      command: (t)=>{
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea eliminar esta dirección?',
          accept: () => {
            this._branchOffice.addresses.splice(this.selectedAddressIndex,1);
          },
        });            
      }
    }
  ];  
  
  constructor(public _branchofficeService: BranchofficeService, public _companyService: CompanyService, public messageService: MessageService, public userPermissions: UserPermissions, private confirmationService: ConfirmationService)
  { 
    this.statusList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];
  
    this.nationalPurchasesList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];
      
    this.internationalPurchasesList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];

  }

  ngOnInit(): void {
    this._branchOffice = new Branchoffice();
    this._branchOffice.contactNumbers = [
    ];
    this._branchOffice.addresses = [
    ];
    this._branchOffice.idBranchOfficeType = 0;
    this._branchOffice.idCompany = 0;
    this.getCompanies();
    this.getBranchOfficeType();
    this.getBranchOfficeById();    
  }

  branchOfficeEdit(branchOfficeId: number){    
    this.branchOfficeId = branchOfficeId;
    this.visible = true;
    this.ngOnInit();
  }

  hideDialog(): void {
    this.visible = false;
    this.submitted = false;    
  }

  getCompanies(){
    this.companyfilters.active = 1;
    this._companyService.getCompaniesByOrderName(this.companyfilters)
    .subscribe((data)=>{
      this.companyList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  getBranchOfficeType(){
    this._branchofficeService.getBranchOfficeTypeList({
      id: -1
    }).subscribe((data)=>{
      this.branchOfficeTypeList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeTypeName,
        value: item.id
      }))
    });
  }
  changestatus(){
    debugger;
    this._changestatus = true;
  }

  getBranchOfficeById(){
    this._branchOffice.id = this.branchOfficeId;

    if(this.branchOfficeId != -1)
    {
      this._branchofficeService.getBranchOffice(this.branchOfficeId)
      .subscribe((data)=>{
        if(data){
          this._branchOffice = data;
        }else{
          this.visible = false;
          alert("No se consiguio el registro");
        }
      },(error) => {
        this.visible = false;
        alert("Ha ocurrido un error cargando la sucursal");
        console.log(error);
      });
    }
  } 

  submit(){
    this.submitted = true;
    this._branchOffice.isDisabled = true;
    //document.getElementById("btnGuardar").setAttribute('disabled', 'disabled');
    if (this._branchOffice.branchOfficeName != undefined && this._branchOffice.branchOfficeCode != undefined && this._branchOffice.branchOfficeManager != undefined && this._branchOffice.idBranchOfficeType > 0 && this._branchOffice.idCompany > 0){
      if (this._branchOffice.branchOfficeName != "" && this._branchOffice.branchOfficeCode != "" && this._branchOffice.branchOfficeManager != ""){
        this._branchOffice.id = this._branchOffice.id == 0 ? -1 : this._branchOffice.id;
        var a = this._branchOffice.contactNumbers.filter(x=>x.idType == 1)
        if(this._branchOffice.contactNumbers.length > 0 && a.length > 0)
        {
          var b = this._branchOffice.addresses.filter(x=>x.idAddressType == 1)
          if(this._branchOffice.addresses.length > 0 && b.length > 0)
          {
            this._branchOffice.id == 0 ? -1 : this._branchOffice.id;
            if(this._changestatus == true && this._branchOffice.active == false)
            {
              this.confirmationService.confirm({
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                message: 'Si inactiva el registro, las configuraciones asociadas\ a esta se dejarán de visualizar, desea proceder con la acción?',
                accept: () => {
                    this.save();
                },
              });
            }else{
              this.save();
            }                          
          }
          else
          {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar una dirección fiscal a la sucursal" });
          }                           
        }else
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar un teléfono principal a la sucursal" });
        }
      }      
    }
    this._branchOffice.isDisabled = false;    
  }

  save(){
    this._branchofficeService.postBranchOffice(this._branchOffice).subscribe((data: number) => {
      if (data > 0){
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.visible = false;   
        this._changestatus = false;       
        this._branchOffice= new Branchoffice();
        this._branchOffice.active = true;               
        this._branchofficeService.getBranchOfficeList(this.filters).subscribe((data: Branchoffice[]) => {
          this._branchofficeService._branchOfficeList = data;
        });
        this.submitted = false;                   
      }else if(data==-1)
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La sucursal o el código ya existen." });
      else if(data==-2)
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La sucursal o el código ya existen." });
      else if(data==-3)
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El registro no se encuentra." });
      else
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }

  //#region Phone
  showPhoneMenu(event: Event, menu: Menu, index: number){
    debugger;
    this.selectedPhoneIndex = index;
    menu.toggle(event);
  }

  onHideContacNumber(visible: boolean){
    this.contactNumberDialogVisible = visible;
  }

  validatePhone(contactNumber: ContactNumber, identifier: number){ 
    this._contactNumbersCopy = [];
    this._branchOffice.contactNumbers.forEach(element => {
      this._contactNumbersCopy.push(element);
    });
    if(identifier == -1){
      this._contactNumbersCopy.push(contactNumber);
    }else{
      this._contactNumbersCopy.splice(identifier, 1, contactNumber);
    }
    var PhoneType = this._contactNumbersCopy.filter(x=>x.idType == 1);
    var index = this._branchOffice.contactNumbers.findIndex(x=>x.idCountry==contactNumber.idCountry && x.number == contactNumber.number);

    if(contactNumber.idType == 1 && PhoneType.length > 1)
    {
      return "Ya se encuentra registrado un teléfono principal.";
    }else
    {
      if(index>=0 && index==identifier || index < 0){
        return null;
      }else{
        return "El número de télefono ya se ha agregado previamente a la lista.";
      }
    }
  }

  onSubmitContactNumber(data){
    if(data.identifier == -1)
      data.contactNumber.id = -1;
    
    var error = this.validatePhone(data.contactNumber, data.identifier);
    
    if(error===null){
      if(data.identifier == -1){
        this._branchOffice.contactNumbers = this._branchOffice.contactNumbers.concat(data.contactNumber);
      }else{
        this._branchOffice.contactNumbers.splice(data.identifier, 1, data.contactNumber);
      }
    }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        this.contactDialog.edit(data.contactNumber, this.selectedPhoneIndex);
    }
  }
  //#endregion

  //#region Address
  showAddressMenu(event: Event, menu: Menu, index: number){
    this.selectedAddressIndex = index;
    menu.toggle(event);
  }

  onToggleAddress(visible: boolean){
    this.addressDialogVisible = visible;
  }
  
  validateAddress(address: Address, identifier: number)
  {
    this._addressCopy = [];
    this._branchOffice.addresses.forEach(element => {
      this._addressCopy.push(element);
    });
    if(identifier == -1){
      this._addressCopy.push(address);
    }else{
      this._addressCopy.splice(identifier, 1, address);
    }

    var AddressType = this._branchOffice.addresses.filter(x=>x.idAddressType == 1);
    var index = this._branchOffice.addresses.findIndex(x=>x.id==address.id && x.idAddressType == address.idAddressType);

    if(address.idAddressType == 1 && AddressType.length >= 1)
    {
      return "Ya se encuentra registrado una dirección fiscal.";
    }else
    {
      if(index>=0 && index==identifier || index < 0){
        return null;
      }else{
        return "La dirección ya se ha agregado previamente a la lista.";
      }
    }
  }

  onSubmitAddress(data){
    if(data.identifier == -1)
      data.address.id = -1;
    
    var error = this.validateAddress(data.address, data.identifier);

    if(error===null){
      if(data.identifier == -1){
        this._branchOffice.addresses = this._branchOffice.addresses.concat(data.address);
      }else{
        this._branchOffice.addresses.splice(data.identifier, 1, data.address);
      }
    }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        this.addressDialog.edit(data.address, this.selectedAddressIndex);
    }
  }
  //#endregion  
}
