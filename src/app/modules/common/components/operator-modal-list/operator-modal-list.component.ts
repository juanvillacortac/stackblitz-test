import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Operator } from 'src/app/models/common/operator';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';
import { User } from 'src/app/models/security/User';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { OperatorViewModel } from 'src/app/modules/security/shared/view-models/OperatorViewModel';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';

@Component({
  selector: 'operator-modal-list',
  templateUrl: './operator-modal-list.component.html',
  styleUrls: ['./operator-modal-list.component.scss']
})
export class OperatorModalListComponent implements OnInit {

  @Input() multiples:boolean=true;
  @Input() model:boolean=false;
  @Input("showDialog") showDialog : boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{operator: Operator, identifier: number}>();
  @Output("OperatorStringChange") OperatorStringChange = new EventEmitter<OperatorInventoryCount[]>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_conteo") _conteo:InventoryCount;
  @Input("_status") _status:boolean = false;
  @Input("usertype") usertype:number= -1;
  @Input("_OperatorListTemp") _OperatorListTemp: OperatorInventoryCount[];
  @Input() title = 'Operadores';
  loading : boolean = false;
  identifierToEdit: number = -1;
  selectedUser : any[] = []; 
  selectUser : any;
  user: Operator=new Operator;
  userFilters: UserFilterViewModel=new UserFilterViewModel;
  operators: OperatorInventoryCount=new OperatorInventoryCount;
  RolList : SelectItem[];
  branchOffice:number=1;
  @ViewChild('dto') dto: Table;

  displayedColumns:ColumnD<User>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.person.name+' '+data.person.lastName; }, header: 'Operador',field:'person.name' ,display: 'table-cell' },
    //{ template: (data) => { return data.person.lastName; }, header: 'Apellido',field:'person.lastName' ,display: 'table-cell' },
    { template: (data) => { return data.mainEmail; }, header: 'Correo',field:'mainEmail' ,display: 'table-cell' },
    { field: 'status', header: 'Estatus', display: 'table-cell' }
  ];

  constructor(public _Service: UserService ,
              public service: RoleService,
              private readonly _authService: AuthService,
              private messageService: MessageService,
              private _httpClient: HttpClient) { }

  ngOnInit(): void {    
    this.selectUser="";
    this.selectedUser=[];
    this.userFilters=new UserFilterViewModel();
    this.branchOffice  = this._authService.currentOffice;
    const { idCompany } = this._authService.currentCompany;
  }

  onShow(){
    this. emitVisible();  
    this. getRoles();
    this.ngOnInit();

  }

  onHide(){
    this.dto.reset();  
    this.emitVisible();
    this.user = new OperatorViewModel(); 
    this.userFilters=new UserFilterViewModel();
    this._Service._List=[];
    this.identifierToEdit = -1;
    this.showDialog = false;
 
  }

  emitVisible(){
    this.onToggle.emit(this.showDialog);
  }
  load(){
    if(this._status == true)
      this.userFilters.status = -1;
    this.loading = true;
    this.userFilters.idSubsidiary=this.branchOffice;
    if(this.usertype !=-1)
      this.userFilters.idTypeUser=this.usertype// usuario tipo interno
    this._Service.getAllUsers(this.userFilters).subscribe((data: User[]) => {
      this._Service._List= data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this._Service._List= [];
      //this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  getRoles()
  {
    this.service.getRolesActive(-1, this.branchOffice, true)
      .then(data => {
        data = data.filter(x => x.isActive);
        this.RolList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
          label: item.name,
          value: item.id
        }));
      }); 
  }

  submit()
  {  
    if(!this.multiples)
    {
      
      this.selectUser=this.selectedUser;
      this.user.name= this.user.name == "" ? this.selectUser.person.name + ' '+ this.selectUser.person.lastName:this.selectUser.person.name + ' '+ this.selectUser.person.lastName;
      this.user.id = this.user.id ==0  ? this.selectUser.id : this.selectUser.id;      
      this.user.documentnumber = this.user.documentnumber == "" ? this.selectUser.person.dniNumber : this.selectUser.person.dniNumber;
      this.user.identifier = this.user.identifier == "" ? this.selectUser.person.identifier : this.selectUser.person.identifier;
      this.showDialog = false;
      this.onSubmit.emit({
        operator: this.user,
        identifier: this.identifierToEdit
      }); 
      this.selectUser="";
      this.selectedUser=[];  
      this.showDialog = false;
      this.emitVisible();    
    }  
  }

  submitVarious()
  { 
    let cont = 0;
    for (let i = 0; i < this.selectedUser.length; i++)
    {
      cont += 1;
      this.operators=new OperatorInventoryCount;
      this.operators.idOperator=this.selectedUser[i].id;
      this.operators.active=true;
      this.operators.idPysicalCount=this._conteo.id;
      this.operators.operator=this.selectedUser[i].person.name+' '+ this.selectedUser[i].person.lastName;
      if(this._OperatorListTemp.findIndex(x=>x.idOperator==this.selectedUser[i].id)==-1)
            this._OperatorListTemp.push(this.operators);

      this.OperatorStringChange.emit(this._OperatorListTemp)
      this.showDialog = false;
      this.emitVisible();
     
    }
    this.selectedUser=[];
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
    this.userFilters.idSubsidiary=this.branchOffice;
    this.userFilters.idCompany=1;
    this.userFilters.idRole=-1;
    this.userFilters.mainEmail="";
  }
}
