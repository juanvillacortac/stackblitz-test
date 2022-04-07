import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { DetailInventoryFilter } from '../shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../shared/filter/inventory-count-filter';
import { InventorycountService } from '../shared/service/inventorycount.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';

@Component({
  selector: 'app-inventory-counts-list',
  templateUrl: './inventory-counts-list.component.html',
  styleUrls: ['./inventory-counts-list.component.scss'],
  providers: [DatePipe]
})
export class InventoryCountsListComponent implements OnInit {

  loading = false;
  showFilters = true;

  _ViewModel: InventoryCount = new InventoryCount();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  filter: InventoryCountFilter = new InventoryCountFilter ();
  filterSearch: InventoryCountFilter = new InventoryCountFilter ();
  inventoryFilters: InventoryCountFilter[] = [];
  filterDetail: DetailInventoryFilter = new DetailInventoryFilter ();
  @Input() idate: Date = new Date();
  @Output() hideDialogForm = new EventEmitter();
  first = 0;
  @ViewChild('dt', {static: false})dt: any;

  displayedColumns: ColumnD<InventoryCount>[] =
  [
    { template: (data) => data.id, header: 'Id', display: 'none', field: 'id' },
    { template: (data) => data.numberDocument, header: 'Número de documento', display: 'table-cell', field: 'numberDocument' },
    { template: (data) => data.idArea, header: 'IdArea', display: 'none', field: 'idArea' },
    { template: (data) => data.area, header: 'Área', display: 'table-cell', field: 'area' },
    { template: (data) => data.description, header: 'Descripción', display: 'table-cell', field: 'description' },
    { template: (data) => data.idstatus, header: 'Id estatus', display: 'none', field: 'idstatus' },
    { field: 'idstatus', header: 'Estatus', display: 'table-cell' },
    // { template: (data) => { return data.status; }, header: 'Estatus', display: 'table-cell',field: 'status' },
    { template: (data) => data.idResponsibleUser, header: 'Id Responsable', display: 'none', field: 'idResponsibleUser' },
    { template: (data) => data.responsibleUser, header: 'Responsable', display: 'table-cell', field: 'responsibleUser' },
    { template: (data) => data.idCategory, header: 'Id categoria', display: 'none', field: 'idCategory' },
    { template: (data) => data.category, header: 'Categoría', display: 'table-cell', field: 'category' },
    { template: (data) => this.datepipe.transform(data.inicialDate,"dd/MM/yyyy"), header: 'Fecha de conteo', display: 'table-cell', field: 'inicialDate' },
    { template: (data) => data.count, header: 'Número de ítems', display: 'table-cell', field: 'count' }
  ];
  constructor(
    public _Service: InventorycountService, private breadcrumbService:
     BreadcrumbService, private messageService: MessageService,
     private readonly loadingService: LoadingService,
      public datepipe: DatePipe, private router: Router, public userPermissions: UserPermissions,
      private activatedRoute: ActivatedRoute,
      private _selectorService: CurrentOfficeSelectorService,
      private _authService: AuthService) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Conteos de inventario', routerLink: ['/ims/inventory-count-list']}
    ]);
    this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
  }

  ngOnInit(): void {
    const filters = this.activatedRoute.snapshot.queryParamMap.get('filters');
    this._Service._List=[]
    if (filters === null) {
      this.inventoryFilters = [];
      this.filter.idBranchOffice = this._authService.currentOffice;
      this.filter.initialDate = this.datepipe.transform(this.idate, 'yyyyMMdd');
      this.filter.finalDate = this.datepipe.transform(this.idate, 'yyyyMMdd');
    } else {
      this.loading = false;
      this.inventoryFilters = JSON.parse(filters);
      this.filter = this.inventoryFilters[0];
      this.filterSearch = this.inventoryFilters[1];
      const formattediDate = this.datepipe.transform(this.filter.iDate, 'MM/dd/yy');
      const formattedfDate = this.datepipe.transform(this.filter.fDate, 'MM/dd/yy');
      this.filter.iDate = new Date(formattediDate);
      this.filter.fDate = new Date(formattedfDate);        
      //this.router.navigateByUrl(this.router.url.substring(0, 21));
      this.search();
    }
  }

  search() {
    this.filterSearch = {
         id: this.filter.id,
         idBranchOffice: this.filter.idBranchOffice,
         numberDocument: this.filter.numberDocument,
         description : this.filter.description,
         idArea : this.filter.idArea,
         idSpace : this.filter.idSpace,
         operator: this.filter.operator,
         idOperatorstring: this.filter.idOperatorstring,
         idOperator: this.filter.idOperator,
         idStatus: this.filter.idStatus,
         idCategory: this.filter.idCategory,
         initialDate: this.filter.initialDate,
         finalDate: this.filter.finalDate,
         iDate: this.filter.iDate,
         fDate: this.filter.fDate,
         operatorsString: this.filter.operatorsString
    };
    //this.loading = true;
    this.loadingService.startLoading();
    if (this.dt != undefined) {
        this.dt.first=0;
    }
    if (this.filter.idStatus == null) {
        this.filter.idStatus=-1;
    }
    if (this.filter.idArea == null) {
       this.filter.idArea=-1;
    }
    if (this.filter.idCategory == null || this.filter.idCategory == -2 ) {
       this.filter.idCategory=-2;
    }

    this._Service.getInventoryCountList(this.filter).subscribe((data: InventoryCount[]) => {
      this._Service._List = data;
      this.loadingService.stopLoading();
      //this.loading = false;
    }, (error: HttpErrorResponse) => {
      //this.loading = false;
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });

  }

  open(count: InventoryCount) {
    const queryParams: any = {};
    this.filterDetail = new DetailInventoryFilter ();
    this.filterDetail.idPhysicalCount = count.id;
    this.inventoryFilters = [];
    this.inventoryFilters.push(this.filter);
    this.inventoryFilters.push(this.filterSearch);
    queryParams.filters = JSON.stringify(this.inventoryFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/ims/detail-inventory-count', this.filterDetail.idPhysicalCount], {state: navigationExtras});
  }
  new() {
    const queryParams: any = {};
    this.filterDetail = new DetailInventoryFilter ();
    this.filterDetail.idPhysicalCount = 0;
    this.inventoryFilters = [];
    this.inventoryFilters.push(this.filter);
    this.inventoryFilters.push(this.filterSearch);
    queryParams.filters = JSON.stringify(this.inventoryFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/ims/detail-inventory-count', this.filterDetail.idPhysicalCount], {state: navigationExtras});
  }
}
