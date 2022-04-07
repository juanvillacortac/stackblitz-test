import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserSupplier } from 'src/app/models/masters/usersuppliers';
import { User } from 'src/app/models/security/User';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';

@Component({
  selector: 'user-modal-list',
  templateUrl: './user-modal-list.component.html',
  styleUrls: ['./user-modal-list.component.scss']
})
export class UserModalListComponent implements OnInit {

  @Input() multiples:boolean=true;
  @Input() model:boolean=false;
  @Input("visible") visible : boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{user: UserSupplier[], identifier: number}>();
  @Output("StringChange") StringChange = new EventEmitter<UserSupplier[]>();
  @Output("userexpandedChange") userexpandedChange = new EventEmitter<number>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_users") _users: UserSupplier[];
  @Input("idCompany") idCompany:number;
  @Input("userexpanded") userexpanded:number;
  loading : boolean = false;
  identifierToEdit: number = -1;
  selectedUser : any[] = []; 
  _user: UserSupplier[]=[];
  selectUser : any;
  userFilters: UserFilterViewModel=new UserFilterViewModel;
  operators: UserSupplier=new UserSupplier;
  RolList : SelectItem[];
  branchOffice:number;
  submitted:boolean=false
  @ViewChild('dtu') dtu: Table;

  displayedColumns:ColumnD<User>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.person.name+' '+data.person.lastName; }, header: 'Operador',field:'person.name' ,display: 'table-cell' },
    //{ template: (data) => { return data.person.lastName; }, header: 'Apellido',field:'person.lastName' ,display: 'table-cell' },
    { template: (data) => { return data.mainEmail; }, header: 'Correo electrónico',field:'mainEmail' ,display: 'table-cell' },
    { field: 'status', header: 'Estatus', display: 'table-cell' }
  ];

  constructor(public _Service: UserService,
              public service: RoleService,
              private messageService: MessageService,
              private readonly _authService: AuthService) { }

  ngOnInit(): void {
    this.selectUser="";
    this.selectedUser=[];
    this.userFilters=new UserFilterViewModel();
    this.branchOffice  = this._authService.currentOffice;
  }

  onShow(){
    this.submitted=false;
    this.selectedUser=[];
    this.emitVisible();  
    this.getRoles();
    this.ngOnInit();
  }

  onHide()
  {
    this.submitted=false;
    this.dtu.reset();
    this.emitVisible();
    this.userFilters=new UserFilterViewModel();
    this._Service._List=[];
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }
  load(){
 
    this.loading = true;
    this.userFilters.idSubsidiary=this._authService.currentOffice;/// se esta colocando 1, de be eser la sucursal donde se esta loqueado
    this.userFilters.idTypeUser=2;
    this._Service.getAllUsers(this.userFilters).subscribe((data: User[]) => {
      this._Service._List= data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this._Service._List= [];
    });
  }

  getRoles()
  {
    this.branchOffice = this._authService.currentOffice;//se coloco 1  debe ser la sucursal donde  se esta logueado
    this.service.getRolesActive(-1, this.branchOffice,true)
      .then(data => {
        var rol= data.filter(x=>x.isActive==true);
        this.RolList = rol.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
          label: item.name,
          value: item.id
        }));
    }); 
  }

  submitVarious()
  { 
    let cont = 0;
    this.userexpanded=this.idCompany;
    this.submitted=true;
    //this.userexpanded=this.idCompany;
    if(this.selectedUser.length >0)
    {
       for (let i = 0; i < this.selectedUser.length; i++)
    {
      cont += 1;
      this.operators=new UserSupplier;
      this.operators.idUser=this.selectedUser[i].id;
      this.operators.active=true;
      this.operators.name=this.selectedUser[i].person.name+' '+ this.selectedUser[i].person.lastName;
      this.operators.email=this.selectedUser[i].mainEmail;
      this.operators.idCompany=this.idCompany;
      if(this._users.findIndex(x=>x.idUser==this.selectedUser[i].id && x.idCompany==this.idCompany)==-1)
      {
          this. _user.push(this.operators);
      }         
       }
   
    this.onSubmit.emit({
      user: this._user,
      identifier: this.identifierToEdit
    });
    this.selectedUser=[]; 
    this. _user=[];
    this.visible = false;
    this.submitted=false;
    this.emitVisible();
    this.userexpandedChange.emit(this.userexpanded)
    }
  }

  search()
  { 
     if (this.userFilters.mainEmail != "" || this.userFilters.idRole >=-1)
     {
       if(this.userFilters.idRole==-1 || this.userFilters.idRole==undefined)
          this.userFilters.idRole=0

          this.load();
     }
  }

  clearFilters(){
    this.userFilters.status=1;
    this.userFilters.idUser=-1;
    this.userFilters.idSubsidiary=this._authService.currentOffice;//verificar esto se esta pasando uno por los momentos
    this.userFilters.idCompany=1;
    this.userFilters.idRole=-1;
    this.userFilters.mainEmail="";
  }
}
