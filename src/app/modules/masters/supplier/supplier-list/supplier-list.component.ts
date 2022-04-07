import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { SupplierextendFilter } from '../shared/filters/supplierextend-filter';
import { SupplierService } from '../shared/services/supplier.service';
import { SupplierextendViewmodel } from '../shared/view-models/supplierextend-viewmodel';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  providers: [DatePipe]
})
export class SupplierListComponent implements OnInit {
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  id:number=0;
  idate:Date=new Date();
  permissionsIDs = {...Permissions};
  SupplierFilters: SupplierextendFilter = new SupplierextendFilter();
  supplierFilterSearch : SupplierextendFilter = new SupplierextendFilter();
  supplierFiltersArray: SupplierextendFilter[]=[];
  constructor(public _SupplierService : SupplierService, 
              public userPermissions: UserPermissions,  
              private breadcrumbService: BreadcrumbService ,
              private messageService: MessageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public datepipe: DatePipe) 
              {

                this.breadcrumbService.setItems([
                  { label: 'Configuración' },
                  { label: 'Maestros generales' },
                  { label: 'Proveedores', routerLink: ['/supplier-list'] }
                ]);
               }
 
   displayedColumns:ColumnD<SupplierextendViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field:'Id' ,display: 'none' },
    { template: (data) => { return data.country; }, header: 'País',field:'country' ,display: 'table-cell' },
    { template: (data) => { return data.socialReason; }, header: 'Razón social',field:'socialReason' ,display: 'table-cell' },
    { template: (data) => { return data.identifier+"-"+data.documentnumber ; }, header: 'Número de documento',field:'documentnumber' ,display: 'table-cell' },
    { template: (data) => { return data.supplierclasification=data.companies[0].supplierclasification; }, header: 'Clasificación',field:'supplierclasification' ,display: 'table-cell' },
    { template: (data) => { return data.currency=data.companies[0].currency; }, header: 'Moneda por defecto', field:'currency' ,display: 'table-cell'},
    // { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];

  ngOnInit(): void {
    const filters = this.activatedRoute.snapshot.queryParamMap.get('filters');
    if (filters === null) {
      this.supplierFiltersArray = [];
      this.SupplierFilters.startdate= this.datepipe.transform(this.idate, "yyyyMMdd");;
      this.SupplierFilters.enddate=this.datepipe.transform(this.idate, "yyyyMMdd");
    } else {
      this.loading = false;
      this.supplierFiltersArray = JSON.parse(filters);
      this.SupplierFilters = this.supplierFiltersArray[0];
      this.supplierFilterSearch = this.supplierFiltersArray[1];
      let formattediDate = this.datepipe.transform(this.SupplierFilters.iDate, 'MM/dd/yy')
      let formattedfDate = this.datepipe.transform(this.SupplierFilters.fDate, 'MM/dd/yy')
      if(formattediDate!=null)
         this.SupplierFilters.iDate=new Date(formattediDate);
      else
         this.SupplierFilters.iDate===null

      if(formattedfDate!=null)
          this.SupplierFilters.fDate=new Date(formattedfDate);
      else
         this.SupplierFilters.fDate=null;

      //this.filter.initDate=new Date(formattediDate);
      //this.filter.fDate=new Date(formattedfDate);
      this.router.navigateByUrl(this.router.url.substring(0,14));
      this.search();
      
    }
  }

  search() {
    this.supplierFilterSearch = 
    {
    
      id:this.SupplierFilters.id,
      document:this.SupplierFilters.document,
      identifier:this.SupplierFilters.identifier,
      ididentifier:this.SupplierFilters.ididentifier,
      socialreason:this.SupplierFilters.socialreason,
      idSupplierclasification:this.SupplierFilters.idSupplierclasification,
      idcountry:this.SupplierFilters.idcountry,
      active: this.SupplierFilters.active,
      startdate:this.SupplierFilters.startdate,
      enddate:this.SupplierFilters.enddate,
      iDate:this.SupplierFilters.iDate,
      fDate:this.SupplierFilters.fDate,
      
    }
    this.SupplierFilters.ididentifier= this.SupplierFilters.ididentifier != null ? this.SupplierFilters.ididentifier : -1;
    this.SupplierFilters.idSupplierclasification= this.SupplierFilters.idSupplierclasification != null ? this.SupplierFilters.idSupplierclasification : -1;
    this.SupplierFilters.idcountry= this.SupplierFilters.idcountry != null ? this.SupplierFilters.idcountry : -1;
    this.SupplierFilters.active= this.SupplierFilters.active != null ? this.SupplierFilters.active : -1;
    this.loading = true;
    this._SupplierService.getSupplierExtendList(this.SupplierFilters).subscribe((data: SupplierExtend[]) => {
      this._SupplierService._suppliersExtendList= data.sort((a, b) => new Date(b.createdate).getTime() - new Date(a.createdate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }

  new()
  {
    const queryParams: any = {};
    this.id=0;
    this.supplierFiltersArray = [];
    this.supplierFiltersArray.push(this.SupplierFilters);
    this.supplierFiltersArray.push(this.supplierFilterSearch);
    queryParams.filters = JSON.stringify(this.supplierFiltersArray);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/masters/supplier-panel',this.id],{state:navigationExtras});
  }
  open(supplier:SupplierExtend)
  { 
    const queryParams: any = {};
    this.id=supplier.idclientsupplier;
    this.supplierFiltersArray = [];
    this.supplierFiltersArray.push(this.SupplierFilters);
    this.supplierFiltersArray.push(this.supplierFilterSearch);
    queryParams.filters = JSON.stringify(this.supplierFiltersArray);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/masters/supplier-panel',this.id],{state:navigationExtras});
  }

}
