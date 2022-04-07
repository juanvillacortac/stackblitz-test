import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { SalaryTypeService } from '../../shared/services/salary-type.service';

@Component({
  selector: 'app-mstg-salarytypes',
  templateUrl: './mstg-salarytypes.component.html',
  styleUrls: ['./mstg-salarytypes.component.scss']
})
export class MstgSalarytypesComponent implements OnInit {
  permissionsIDs = {...Permissions};
  showDialog = false;
  showFilters : boolean = false;
  loading = false;
  salaryType = new SalaryType();
  salaryTypes = [] as SalaryType[];
  salaryTypeFilter = new SalaryTypeFilter
  _Authservice : AuthService = new AuthService(this._httpClient);

  submitted: boolean;
  isCallback = false;
  showPanel = false;

  log=console.log;
  displayedColumns: ColumnD<SalaryType>[] =
  [

  //{template: (data) => { return data.id; }, field: 'id', header: 'Código', display: 'table-cell'},
  {template: (data) => { return data.name; }, field: 'name', header: 'Descripción', display: 'table-cell'},
  {template: (data) => { return null; }, field: 'salaryCharacter', header: 'Indicador salarial', display: 'table-cell' },
  {template: (data) => { return null; }, field: 'required', header: 'Indicador obligatorio', display: 'table-cell' },
  {template: (data) => { return data.currency; }, field: 'currency', header: 'Moneda', display: 'table-cell'},
  {template: (data) => { return null; }, field: 'active', header: 'Estatus', display: 'table-cell' },

  ];

  constructor(public _salaryTypeService: SalaryTypeService,  
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService, 
    private _httpClient: HttpClient,
    public userPermissions: UserPermissions,
    private router :Router , 
    injector:Injector) {
      this.breadcrumbService.setItems([
        { label: 'HCM' },
        { label: 'Maestros' },
        { label: 'Tipos de sueldos', routerLink: ['/hcm/mstg-salarytypes'] }
         ]);
     }

  ngOnInit(): void {
    this.search();
  }

  search(){
    if (this.loading)
      return;
    this.loading = true;
    this.salaryTypeFilter.companyId = parseInt(this._Authservice.currentCompany);
    this._salaryTypeService.GetSalaryType(this.salaryTypeFilter).subscribe((data: SalaryType[]) => {      
      this.salaryTypes = data.sort((a,b) => 0 - (a.id < b.id ? -1 : 1));
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de sueldos." });
        
    });
  
  
  }

  openNew() {
    debugger
    this.salaryType = { id: -1 } as SalaryType;
/*     this.salaryType = new SalaryType();
    this.salaryType.id = -1;
    this.salaryType.name = "";
    this.salaryType.currency = 1;
    this.salaryType.salaryCharacter = false;
    this.salaryType.required = false;
    this.salaryType.active = true; */
    this.showDialog = true;
  }

  edit(_salaryType: SalaryType): void {
    debugger
    this.salaryType.id = _salaryType.id;
    this.salaryType.name = _salaryType.name;
    this.salaryType.currency = _salaryType.currency;
    this.salaryType.salaryCharacter= _salaryType.salaryCharacter;
    this.salaryType.required = _salaryType.required;
    //this.salaryType.updateByUser = _salaryType.updateByUser;
    this.salaryType.active = _salaryType.active;
    this.showDialog = true;
  }


}
