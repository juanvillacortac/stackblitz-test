import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { SortIcon, Table } from 'primeng/table';
import { BrowserStack } from 'protractor/built/driverProviders';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { UserSupplier } from 'src/app/models/masters/usersuppliers';
import { SupplierService } from '../../shared/services/supplier.service';

@Component({
  selector: 'app-users-suppliers',
  templateUrl: './users-suppliers.component.html',
  styleUrls: ['./users-suppliers.component.scss']
})
export class UsersSuppliersComponent implements OnInit {

  @Input("_dataSupplierUser") _dataSupplierUser: SupplierExtend;
  @Input("_CompaniesListTemp") _CompaniesListTemp: any[] = [];
  @Input("userexpanded") userexpanded: number;
  userDialogVisible: boolean = false;
  userDialogMasiveVisible: boolean = false;
  @Input("_users")_users:UserSupplier[]=[];
  idCompany:number=0;
  value:any;
  check:boolean=false;
   _User: UserSupplier[]=[];
   SelectedUserSupplier:UserSupplier = new UserSupplier();
   @ViewChild('dt') dt: Table;
   @ViewChild('picon') picon: SortIcon;
   

  displayedColumnsUsers: ColumnD<UserSupplier>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'Id', display: 'none' },
    { template: (data) => { return data.name; }, header: 'Nombre', field: 'name', display: 'table-cell' },
    { template: (data) => { return data.email; }, header: 'Correo electrónico', field: 'email', display: 'table-cell' }
  ];
  constructor(public _supplierservice:SupplierService, public messageService:MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  
  }
  
  onHideUser(visible: boolean) {
    this.userDialogVisible = visible;
  }

  onHideUserMasive(visible: boolean) {
    this.userDialogMasiveVisible = visible;
  }
  UpdateList(list : any[])
  {
    this.userexpanded = this.SelectedUserSupplier.idCompany;
  }

  show(e:any,id:number)
  { 
    event.stopPropagation();
    this.idCompany=id;
    this.userDialogVisible=true;
    
  }
  showMasive(e:any)
  { 
    event.stopPropagation();
    this.userDialogMasiveVisible=true;
    
  }
  onSubmit(data)
  {  
    let cont=0;
    for (let i = 0; i < data.user.length; i++)
    {
      cont += 1;
      if(this._dataSupplierUser.users.findIndex(x=>x.idUser==data.user[i].idUser && x.idCompany==data.user[i].idCompany)==-1)
      {
        this._dataSupplierUser.users.push(data.user[i]);
      }  
    } 
    this._users=this._dataSupplierUser.users.filter(x=>x.idCompany==this.idCompany);
  }

  onSubmitMasive(data)
  {
    let cont=0;
    for (let i = 0; i < data.user.length; i++)
    {
      cont += 1;
      if(this._dataSupplierUser.users.findIndex(x=>x.idUser==data.user[i].idUser && x.idCompany==data.user[i].idCompany)==-1)
      {
        this._dataSupplierUser.users.push(data.user[i]);
      }  
    } 
    this._users=this._dataSupplierUser.users.filter(x=>x.idCompany==this.idCompany);
  }

  searchUserbyCompanies(id:number,e:Event)
  {     
   
    //this.resetSort(); 
    e.stopPropagation();
    this.idCompany=id;
    this._users=this._dataSupplierUser.users.filter(x=>x.idCompany==id);      
  }

  onRowSelect(event)
  { 
     this.idCompany = this.SelectedUserSupplier.idCompany;
     this.userexpanded = this.SelectedUserSupplier.idCompany;
  }
  refreshUser(list:any[])
  {
    this._users=list.filter(x=>x.idCompany==this.idCompany);
  }
  inactiveUser(user:UserSupplier)
  { 
    if(user.id <=0)
    {
        this._users = this._users.filter(x => x !=user);
        this._dataSupplierUser.users=this._dataSupplierUser.users.filter(x=>x !=user);
    }
    else
    { this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          user.active=false;
          this._supplierservice.InactiveUserSupplier(user.idClientSupplier,user.idUser,user.idCompany).subscribe((data) => {
          if (data> 0)
          {
              this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Se eliminó el registro exitosamente." });
              this._users = this._users.filter(x => x !=user);
              this._dataSupplierUser.users=this._dataSupplierUser.users.filter(x=>x !=user);
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

  PrintCheck(id:Number)
  {
    if(this._dataSupplierUser.users != null && this._dataSupplierUser.users != undefined )
    {
      var a =this._dataSupplierUser.users.filter(x=>x.idCompany==id);
      if(a != null && a != undefined && a.length > 0 )
        return true;
      else
        return false;
    }else
    {
     
      return false;
    }
  
  }

  resetSort() {
    this.dt.lazy = false;
    this.dt.sortOrder =this.dt._sortOrder;
    if(this.dt.sortField==undefined)
    {
        this.dt.sortField = '';
    }   
   }

}
