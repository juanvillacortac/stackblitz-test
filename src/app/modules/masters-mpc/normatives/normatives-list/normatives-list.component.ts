import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Normative } from 'src/app/models/masters-mpc/normative';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { NormativeFilter } from '../../shared/filters/normative-filter';
import { NormativeService } from '../../shared/services/NormativeService/normative.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-normatives-list',
  templateUrl: './normatives-list.component.html',
  styleUrls: ['./normatives-list.component.scss']
})
export class NormativesListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  normativeDialog: boolean = false;
  _normativeFilters: NormativeFilter = new NormativeFilter();
  normativeList: Normative[] = [];
  normativeModel: Normative = new Normative();
  idproductorigintype: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Normative>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.description; },field: 'description', header: 'Descripción', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router, 
    public _authService: AuthService, 
    public _normativeService: NormativeService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
        { label: 'Normativas', routerLink: ['/master-mpc/normatives-list'] }
      ]);
    }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this.loading = false;
    this._normativeService.getNormativesbyfilter(this._normativeFilters).subscribe((data: Normative[]) => {
      this.normativeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las normativas"});
    });
  }

  onEdit(normative: Normative) {
    this.normativeModel = new Normative();
    this.normativeModel.id = normative.id;
    this.normativeModel.name = normative.name;
    this.normativeModel.description = normative.description;
    this.normativeModel.expirationDate = normative.expirationDate;
    this.normativeModel.active = normative.active == false ? false : true;
    this.normativeDialog = true;
  }

}
