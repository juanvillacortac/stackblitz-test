import { Component, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Area } from 'src/app/models/masters/area';
import { AreaFilter } from '../shared/filters/area-filter';
import { AreaViewmodel } from '../shared/view-models/area-viewmodel';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AreaService } from '../shared/services/area.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit {
  AreaShowDialog:boolean=false;
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  
  _AreaViewModel:Area =  new Area();
  areaFilters: AreaFilter = new AreaFilter();
  areaEdit : AreaFilter;
  displayedColumns:ColumnD<AreaViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field:'Id' ,display: 'none' },
    { template: (data) => { return data.name; }, header: 'Área',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.abbreviation; }, header: 'Abreviatura',field:'abbreviation' ,display: 'table-cell' },
    { template: (data) => { return data.areaType; }, header: 'Tipo de área',field:'areaType' ,display: 'table-cell' },
    //{ template: (data) => { return data.FatherArea; }, header: 'Area padre',field:'FatherArea' ,display: 'table-cell' },
    { template: (data) => { return data.branchOffice; }, header: 'Sucursal',field:'branchOffice' ,display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];
  permissionsIDs = {...Permissions};

  constructor( public _AreaService : AreaService, private breadcrumbService: BreadcrumbService ,
    private messageService: MessageService, 
    public userPermissions: UserPermissions) {   
    this.breadcrumbService.setItems([
    { label: 'Configuración' },
    { label: 'Maestros generales' },
    { label: 'Áreas', routerLink: ['/area-list'] }
    ]);
    
    }

  ngOnInit(): void {
    this.search();
  }
  
  search() {

    this.loading = true;
    this._AreaService.getareaList(this.areaFilters).subscribe((data: Area[]) => {
      this._AreaService._areaList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las areas" });
    });
  }

  onEdit(area : Area) {
    debugger;
    this._AreaViewModel = new Area;
    this._AreaViewModel.id = area.id;
    this._AreaViewModel.name = area.name;
    this._AreaViewModel.abbreviation = area.abbreviation;
    this._AreaViewModel.idAreaType = area.idAreaType;
    this._AreaViewModel.idBranchOffice = area.idBranchOffice;
    this._AreaViewModel.active = area.active;
    this.AreaShowDialog = true;
  }

}
