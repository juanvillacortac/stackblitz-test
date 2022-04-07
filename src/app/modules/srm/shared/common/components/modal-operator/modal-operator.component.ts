import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Operator } from 'src/app/models/common/operator';
import { User } from 'src/app/models/security/User';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { OperatorViewModel } from 'src/app/modules/security/shared/view-models/OperatorViewModel';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { FilterViewerocSupplier } from '../../../filters/filter-vieweroc-supplier';
import { OperatorModal } from '../../../view-models/common/operatormodal';

@Component({
  selector: 'app-modal-operator',
  templateUrl: './modal-operator.component.html',
  styleUrls: ['./modal-operator.component.scss']
})
export class ModalOperatorComponent implements OnInit {

  @Input() visible: boolean = false;
  @Input("multiple") multiple : boolean= false;
  @Input() model:boolean=false;

  @Input("operatormodal") operatormodal: OperatorModal;
  @Output("operatormodalChange") operatormodalChange= new  EventEmitter<OperatorModal>();
 
  @Input("filter") filter: FilterViewerocSupplier;
  @Output("filterChange") filterChange = new EventEmitter<FilterViewerocSupplier>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();

  loading : boolean = false;
  identifierToEdit: number = -1;
  selectedUser : any[] = []; 
  selectUser : any;
  user: Operator=new Operator;
  userFilters: UserFilterViewModel=new UserFilterViewModel;
  //operators: OperatorInventoryCount=new OperatorInventoryCount;
  RolList : SelectItem[];
  branchOffice:number;

  displayedColumns:ColumnD<User>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.person.name+' '+data.person.lastName; }, header: 'Operador',field:'person.name'+'person.lastName' ,display: 'table-cell' },
    //{ template: (data) => { return data.person.lastName; }, header: 'Apellido',field:'person.lastName' ,display: 'table-cell' },
    { template: (data) => { return data.mainEmail; }, header: 'Correo',field:'mainEmail' ,display: 'table-cell' },
    { field: 'status', header: 'Estatus', display: 'table-cell' }
  ];

  constructor(public _Service: UserService ,public service: RoleService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.selectUser="";
    this.selectedUser=[];
    this.userFilters=new UserFilterViewModel();
    this.load();
  }

  onShow(){
    // this. emitVisible();  
    // this. getRoles();
    this.ngOnInit();

  }

  onHide(){
    this.emitVisible();
    this.user = new OperatorViewModel(); 
    this.userFilters=new UserFilterViewModel();
    this._Service._List=[];
    this.identifierToEdit = -1;
    //this.showDialog = false;
  }
  emitVisible(){
    this.onToggle.emit(this.visible);
  }
  load(){
    this.loading = true;
    this.userFilters.status=1;
    this.userFilters.idTypeUser=1;
    this.userFilters.idSubsidiary=1;/// se esta colocando 1, de be eser la sucursal donde se esta loqueado
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
      this.RolList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 
  }

  submit()
  {  

    if(this.filter!= undefined && this.filter.indModalUserCreated){
       if(!this.multiple){
        this.selectUser=this.selectedUser;
        this.filter.userCreated= this.filter.userCreated == "" ? this.selectUser.person.name + ' '+ this.selectUser.person.lastName:this.selectUser.person.name + ' '+ this.selectUser.person.lastName;
        this.filter.idUserCreated = this.filter.idUserCreated ==-1  ? this.selectUser.id:this.selectUser.id;
        this.visible = false;
        // this.onSubmit.emit({
        //   operator: this.user,
        //   identifier: this.identifierToEdit
        // }); 
        this.filterChange.emit(this.filter);
        this.selectUser="";
        this.selectedUser=[];  
        this.visible = false;
        this.emitVisible();    
       }

    }else{

      if(!this.multiple)
      {
        this.selectUser=this.selectedUser;
        this.operatormodal.namesoperators= this.operatormodal.namesoperators == "" ? this.selectUser.person.name + ' '+ this.selectUser.person.lastName:this.selectUser.person.name + ' '+ this.selectUser.person.lastName;
        this.operatormodal.idOpetator = this.operatormodal.idOpetator ==-1  ? this.selectUser.id:this.selectUser.id;
        this.visible = false;
        // this.onSubmit.emit({
        //   operator: this.user,
        //   identifier: this.identifierToEdit
        // }); 
        this.operatormodalChange.emit(this.operatormodal);
        this.selectUser="";
        this.selectedUser=[];  
        this.visible = false;
        this.emitVisible();    
      } 
    }
  }

  submitVarious()
  { 
    let cont = 0;
    this.operatormodal=new OperatorModal();
    for (let i = 0; i < this.selectedUser.length; i++) {
        cont += 1;
        this.operatormodal.namesoperators = this.operatormodal.namesoperators == "" ? this.selectedUser[i].person.name : cont >= 5 ? cont + " operadores seleccionados" : this.operatormodal.namesoperators + ", " + this.selectedUser[i].person.name;
        //this.filters.supplierstring= this.supplierstring;
        this.operatormodal.idMultipleOperatos= this.operatormodal.idMultipleOperatos=="" ? this.selectedUser[i].id: this.operatormodal.idMultipleOperatos +"," + this.selectedUser[i].id;
        this.operatormodalChange.emit(this.operatormodal);
        this.visible =false;
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
    this.userFilters.idSubsidiary=1;//verificar esto se esta pasando uno por los momentos
    this.userFilters.idCompany=1;
    this.userFilters.idRole=-1;
    this.userFilters.mainEmail="";
  }
}
