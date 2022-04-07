import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Company } from 'src/app/models/masters/company';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { UserSupplier } from 'src/app/models/masters/usersuppliers';
import { User } from 'src/app/models/security/User';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';

@Component({
  selector: 'app-user-supplier-masive',
  templateUrl: './user-supplier-masive.component.html',
  styleUrls: ['./user-supplier-masive.component.scss']
})
export class UserSupplierMasiveComponent implements OnInit {

  @Input() multiples:boolean=true;
  @Input() model:boolean=false;
  @Input("visible") visible : boolean = false;
  @Input("_dataSupplier") _dataSupplier:SupplierExtend;
  @Output("onSubmit") onSubmit = new EventEmitter<{user: UserSupplier[], identifier: number}>();
  @Output("StringChange") StringChange = new EventEmitter<UserSupplier[]>();
  @Output("userexpandedChange") userexpandedChange = new EventEmitter<number>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_users") _users: UserSupplier[];
  @Input("idCompany") idCompany:number;
  @Input("userexpanded") userexpanded:number;
  loading : boolean = false;
  submitted:boolean=false;
  identifierToEdit: number = -1;
  selectedUser : any[] = []; 
  _user: UserSupplier[]=[];
  selectUser : any;
  userFilters: UserFilterViewModel=new UserFilterViewModel;
  operators: UserSupplier=new UserSupplier;
  RolList : SelectItem[];
  branchOffice:number;
  checkAllCompany: boolean = false;
  companieslist: Company[] = [];
  selectedCompanies: any[] = [];
  @ViewChild('dtum') dtum: Table;

  displayedColumns:ColumnD<User>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.person.name+' '+data.person.lastName; }, header: 'Operador',field:'person.name' ,display: 'table-cell' },
    //{ template: (data) => { return data.person.lastName; }, header: 'Apellido',field:'person.lastName' ,display: 'table-cell' },
    { template: (data) => { return data.mainEmail; }, header: 'Correo electrónico',field:'mainEmail' ,display: 'table-cell' },
    { field: 'status', header: 'Estatus', display: 'table-cell' }
  ];

  constructor(public _Service: UserService ,public service: RoleService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.selectUser="";
    this.selectedUser=[];
    this.userFilters=new UserFilterViewModel();
  }

  onShow()
  {
    this.submitted=false;
    this.emitVisible();  
    this.getRoles();
    this.companieslist=this._dataSupplier.companies;
    this.ngOnInit();

  }

  onHide()
  {
    this.submitted=false;
    this.dtum.reset();
    this.emitVisible();
    this.userFilters=new UserFilterViewModel();
    this._Service._List=[];
    this.identifierToEdit = -1;
    this.selectedCompanies=[];
    this.checkAllCompany=false;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }
  load(){
 
    this.loading = true;
    this.userFilters.idSubsidiary=1;/// se esta colocando 1, de be eser la sucursal donde se esta loqueado
    this.userFilters.idTypeUser=2;
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
    this.branchOffice=1;//se coloco 1  debe ser la sucursal donde  se esta logueado
    this.service.getRoles(-1, this.branchOffice)
      .then(data => {
      var rol= data.filter(x=>x.isActive==true);
      this.RolList =rol.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 
  }
  checkAllCompanies(){
    if (this.checkAllCompany) {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
      var companyselected: Company[] = [];
      this.companieslist.forEach(company => {
        if (company.active) {
           this.selectedCompanies.push(company);
        }
      });
    }else{
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
    }
  }
  checkedcompany(e:any)
  {
    if(e.checked)
    {
       if(this.selectedCompanies.length==this.companieslist.filter(x=>x.active).length)
         this.checkAllCompany=true;
    }     
    else
       this.checkAllCompany=false;
  }

  submitVarious()
  { 
    let cont ,cont1= 0;
    this.submitted=true;
    //this.userexpanded=this.idCompany;
    if(this.selectedCompanies.length>0 && this.selectedUser.length >0)
    {
     
      for (let i = 0; i < this.selectedCompanies.length; i++)
      {
        cont1+=1;
       for (let j=0 ;j < this.selectedUser.length; j++)
       {    
        cont += 1;
        this.operators=new UserSupplier;
        this.operators.idUser=this.selectedUser[j].id;
        this.operators.active=true;
        this.operators.name=this.selectedUser[j].person.name+' '+ this.selectedUser[j].person.lastName;
        this.operators.email=this.selectedUser[j].mainEmail;
        this.operators.idCompany=this.selectedCompanies[i].id;
        if(this._users.findIndex(x=>x.idUser==this.selectedUser[j].id && x.idCompany==this.selectedCompanies[i].id)==-1)
        {
          this. _user.push(this.operators);
        }         
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
    //this.userexpandedChange.emit(this.userexpanded)
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
    this.userFilters.idSubsidiary=1;//verificar esto se esta pasando uno por los momentos
    this.userFilters.idCompany=1;
    this.userFilters.idRole=-1;
    this.userFilters.mainEmail="";
  }

}
