import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Adjustment } from 'src/app/models/ims/adjustment';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AdjustmentFilter } from '../shared/filters/adjustment-filter';
import { InventoryAdjustmentService } from '../shared/services/inventory-adjustment.service';
import { AdjustmentViewmodel } from '../shared/view-models/adjustment-viewmodel';

@Component({
  selector: 'app-inventory-adjustment-list',
  templateUrl: './inventory-adjustment-list.component.html',
  styleUrls: ['./inventory-adjustment-list.component.scss'],
  providers: [DatePipe]
})
export class InventoryAdjustmentListComponent implements OnInit {
  adjustmentshowDialog:boolean=false;
  showFilters:boolean=true;
  showDialog:boolean=false;
  loading: boolean = false;
  _AdjustmentViewModel:Adjustment;
  adjustmentFilters: AdjustmentFilter = new AdjustmentFilter();
  adjustmentEdit : AdjustmentFilter;
  @ViewChild('dt',{static:false})dt:any

  displayedColumns:ColumnD<AdjustmentViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field:'Id' ,display: 'none' },
    { template: (data) => { return data.documentnumber; }, header: 'Número de ajuste',field:'documentnumber' ,display: 'table-cell' },
    { template: (data) => { return data.description; }, header: 'Descripción',field:'description' ,display: 'table-cell' },
    { template: (data) => { return data.area; }, header: 'Área',field:'area' ,display: 'table-cell' },
    { template: (data) => { return data.adjustmenttype; }, header: 'Tipo de ajuste',field:'adjustmenttype' ,display: 'table-cell' },
    { template: (data) => { return data.physicalCount; }, header: 'Número de conteo',field:'physicalCount' ,display: 'table-cell' },
    { template: (data) => { return data.idEstatus; }, header: 'Id estatus',field:'idestatus' ,display: 'none' },
    { field:'idEstatus',header: 'Estatus' ,display: 'table-cell' },
    //{ template: (data) => { return data.estatus; }, header: 'Estatus',field:'estatus' ,display: 'table-cell' },
    { template: (data) => { return data.operator; }, header: 'Responsable',field:'estatus' ,display: 'table-cell' },
    { template: (data) => { return  this.datepipe.transform(data.createdate, "dd/MM/yyyy HH:mm"); }, header: 'Fecha de creación', field:'createdate' ,display: 'table-cell' },
    { template: (data) => { return data.numberitems; }, header: 'Número de ítems', field:'numberitems' ,display: 'table-cell' }
   
  ];


  permissionsIDs = {...Permissions};
  constructor(public _AdjustmentService: InventoryAdjustmentService,
    private breadcrumbService: BreadcrumbService ,
    private messageService: MessageService,   private _authService: AuthService,
    private readonly loadingService: LoadingService,
    public userPermissions: UserPermissions,  private router: Router,public datepipe: DatePipe) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'IMS' },
        { label: 'Ajustes de inventario', routerLink: ['/ims/inventory-adjustment-list'] }
        ]);

}

  ngOnInit(): void {
    this._AdjustmentService._AdjustmentList=[];
    //this.search();
  }

  search() {
    //this.loading = true;
    this.loadingService.startLoading();
    if(this.dt != undefined){
      this.dt.first=0;
    }
    this.adjustmentFilters.idbranchoffice=this._authService.currentOffice;
    this._AdjustmentService.getAdjustmentList(this.adjustmentFilters).subscribe((data: Adjustment[]) => {
      this._AdjustmentService._AdjustmentList= data.sort((a, b) => new Date(b.createdate).getTime() - new Date(a.createdate).getTime());
      this.loadingService.stopLoading();
      //this.loading = false;
    }, (error: HttpErrorResponse) => {
        //this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los ajustes de inventario." });
    });
  }

  openNew = () => {
    this.router.navigate(['/ims/adjustment-panel', 0]);
  }
  
  async onEdit(id) {
    this.router.navigate(['/ims/adjustment-panel', id]);
  }

}
