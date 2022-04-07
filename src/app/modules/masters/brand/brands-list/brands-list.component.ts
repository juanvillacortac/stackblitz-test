import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Brands } from 'src/app/models/masters/brands';
import { BrandClass } from 'src/app/models/masters/brandClass';
import { BrandsViewModel } from '../shared/view-model/brands-viewmodel';
import { brandsFilter } from '../shared/filters/brands-Filters';
import { BrandsService } from '../shared/services/brands.service';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit {

  showDialog: boolean = false
  BrandshowDialog: boolean = false;
  _brandViewModel: Brands=new Brands();
  showFilters : boolean = false;
  loading : boolean = false;
  _brandsClassList: BrandClass[];

  brandsFilters: brandsFilter = new brandsFilter();
  
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  _status:boolean=true;


  displayedColumns: ColumnD<BrandsViewModel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.name; }, header: 'Marca', display: 'table-cell',field: 'name' }, 
      { template: (data) => { return data.brandClass; }, header: 'Clase', display: 'table-cell',field: 'brandClass' },
      { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', display: 'table-cell',field: 'abbreviation' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updateByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updateByUser' }
    ];
  constructor(public _brandService: BrandsService, private breadcrumbService: BreadcrumbService,private messageService: MessageService,public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Marcas', routerLink: ['/brands-list'] }
    ]);
   }

  ngOnInit(): void {
    this.search();
  }
  search(){
    this.loading = true;
    this._brandService.getBrandsList(this.brandsFilters).subscribe((data: Brands[]) => {
      this._brandService._brandsList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  
  Edit(brand :Brands) {
    this._brandViewModel=new Brands();
    this._brandViewModel.id=brand.id;
    this._brandViewModel.idClass=brand.idClass;
    this._brandViewModel.name=brand.name;
    this._brandViewModel.abbreviation=brand.abbreviation;
    this._brandViewModel.active=brand.active;
    this._status=brand.active;
    this.BrandshowDialog = true;    
  }
  
}
