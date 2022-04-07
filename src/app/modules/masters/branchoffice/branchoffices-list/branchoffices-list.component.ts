import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BranchofficeFilter } from '../shared/filters/branchoffice-filter';
import { BranchofficeService } from '../shared/services/branchoffice.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { BranchofficesEditDialogComponent } from './branchoffices-edit-dialog/branchoffices-edit-dialog.component';

@Component({
  selector: 'app-branchoffices-list',
  templateUrl: './branchoffices-list.component.html',
  styleUrls: ['./branchoffices-list.component.scss']
})
export class BranchofficesListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  BranchOfficeShowDialog: boolean = false;
  _branchOfficeViewModel: Branchoffice=new Branchoffice();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  branchofficeFilter: BranchofficeFilter = new BranchofficeFilter();

  @ViewChild(BranchofficesEditDialogComponent) branchofficesEditDialogComponent: BranchofficesEditDialogComponent; 

  displayedColumns: ColumnD<Branchoffice>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },
      { template: (data) => { return data.branchOfficeName; }, header: 'Sucursal', display: 'table-cell', field:'branchOfficeName' },
      { template: (data) => { return data.branchOfficeCode; }, header: 'Código', display: 'table-cell', field:'branchOfficeCode'  },
      { template: (data) => { return data.branchOfficeTypeName; }, header: 'Tipo de sucursal', display: 'table-cell', field:'branchOfficeTypeName'  },
      { template: (data) => { return data.branchOfficeManager; }, header: 'Gerente', display: 'table-cell', field:'branchOfficeManager'  },            
      { template: (data) => { return data.companyName; }, header: 'Empresa', display: 'table-cell', field:'companyName'  },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updatedByUser' }
    ];

    constructor(public _branchofficeService: BranchofficeService, private breadcrumbService: BreadcrumbService,private messageService: MessageService, public userPermissions: UserPermissions) {
      this.breadcrumbService.setItems([
        { label: 'Configuración' },
        { label: 'Maestros generales' },
        { label: 'Sucursales', routerLink: ['/branchoffices-list'] }
      ]);
    }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this._branchofficeService.getBranchOfficeList(this.branchofficeFilter).subscribe((data: Branchoffice[]) => {
      this._branchofficeService._branchOfficeList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  editBranchOffice(_branchOffice: Branchoffice){      
    this.branchofficesEditDialogComponent.branchOfficeEdit(_branchOffice.id);
  }
  
  newBranchOffice(){      
    this.branchofficesEditDialogComponent.branchOfficeEdit(-1);
  }
}
