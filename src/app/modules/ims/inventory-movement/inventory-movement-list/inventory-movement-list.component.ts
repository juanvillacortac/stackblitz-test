import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryMovement } from 'src/app/models/ims/inventory-movement';
import { DetailInventoryMovementFilter } from '../shared/filter/detail-inventory-movement-filter';
import { InventoryMovementFilter } from '../shared/filter/inventory-movement-filter';
import { InventoryMovementService } from '../shared/service/inventory-movement.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-inventory-movement-list',
  templateUrl: './inventory-movement-list.component.html',
  styleUrls: ['./inventory-movement-list.component.scss'],
  providers: [DatePipe]
})
export class InventoryMovementListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = true

  _ViewModel: InventoryMovement=new InventoryMovement();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  filter: InventoryMovementFilter = new InventoryMovementFilter ();
  filterSearch: InventoryMovementFilter = new InventoryMovementFilter ();
  inventoryFilters: InventoryMovementFilter[] = [];
  filterDetail: DetailInventoryMovementFilter = new DetailInventoryMovementFilter ();
  idate:Date=new Date();
  
  displayedColumns: ColumnD<InventoryMovement>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.idBranchOffice; }, header: 'IdSucursal', display: 'none',field:'idBranchOffice' },
      { template: (data) => { return data.idProduct; }, header: 'Id', display: 'none',field:'idProduct' },
      { template: (data) => { return data.gtin; }, header: 'Barra', display: 'table-cell',field: 'gtin' }, 
      { template: (data) => { return data.product; }, header: 'Nombre del producto', display: 'table-cell',field: 'product' }, 
      { template: (data) => { return data.codeBalance; }, header: 'Código de balanza', display: 'table-cell',field: 'codeBalance' },
      { template: (data) => { return data.packet; }, header: 'Empaque', display: 'table-cell',field: 'packet' },  
      { template: (data) => { return data.category; }, header: 'Categoría', display: 'table-cell',field: 'category' }, 
      { template: (data) => { return data.area; }, header: 'Área', display: 'table-cell',field: 'area' }, 
      { template: (data) => { return data.entries.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); }, header: 'Entradas', display: 'table-cell',field: 'entries' },
      { template: (data) => { return data.outputs.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); }, header: 'Salidas', display: 'table-cell',field: 'outputs' }
    ];
  constructor(public _Service: InventoryMovementService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,  private router: Router,public datepipe:DatePipe,private activatedRoute: ActivatedRoute, private readonly loadingService: LoadingService, private _authService: AuthService) 
  { this.breadcrumbService.setItems([
    { label: 'OSM' },
    { label: 'IMS' },
    { label: 'Reportes' },
    { label: 'Movimientos de inventario', routerLink: ['/ims/inventory-movement-list'] }
  ]);}

  ngOnInit(): void { 
    const filters = this.activatedRoute.snapshot.queryParamMap.get('filters');
    if (filters === null) {
      this.inventoryFilters = [];
      this.filter.idBranchoffice=this._authService.currentOffice;
      this.filter.initialDate= this.datepipe.transform(this.idate, "yyyyMMdd");;
      this.filter.finalDate=this.datepipe.transform(this.idate, "yyyyMMdd");
    } else {
      this.inventoryFilters = JSON.parse(filters);
      this.filter = this.inventoryFilters[0];
      this.filterSearch = this.inventoryFilters[1];
      let formattediDate = this.datepipe.transform(this.filter.iDate, 'MM/dd/yy')
      let formattedfDate = this.datepipe.transform(this.filter.fDate, 'MM/dd/yy')
      if(formattediDate!=null)
        this.filter.iDate=new Date(formattediDate);
      else
         this.filter.iDate==null

      if(formattedfDate!=null)
          this.filter.fDate=new Date(formattedfDate);
      else
          this.filter.fDate=null;
          
      //this.router.navigateByUrl(this.router.url.substring(0, 24));/
      this.search(); 
    }
  }
  search() {
    this.filterSearch ={
      id: this.filter.id,
      idProduct:this.filter.idProduct,
      product:this.filter.product,
      gtin :this.filter.gtin,
      idArea :this.filter.idArea,
      area:this.filter.area,
      idCategory :this.filter.idCategory,
      category:this.filter.category,
      factoryReferences:this.filter.factoryReferences,
      internalReferences:this.filter.internalReferences,
      idsupplier:this.filter.idsupplier,
      supplier:this.filter.supplier,
      idbrand:this.filter. idbrand,
      brand:this.filter.brand,
      indWeigth:this.filter.indWeigth,
      idStatusProduct:this.filter.idStatusProduct,
      existences:this.filter.existences,
      initialDate:this.filter.initialDate,
      finalDate:this.filter. finalDate,
      iDate:this.filter.iDate,
      fDate:this.filter.fDate,
      idBranchoffice:this.filter.idBranchoffice,
      codeBalance:this.filter.codeBalance,
      supplierstring:this.filter.supplierstring
    }
    this.loadingService.startLoading();
    //this.loading = true;
    this.filter.idBranchoffice=this._authService.currentOffice;
    this._Service.getInventoryMovementList(this.filter).subscribe((data: InventoryMovement[]) => {
      this._Service._List = data;
      //this.loading = false;
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      //this.loading = false;
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  open(movement:InventoryMovement){
    this.filterDetail=new DetailInventoryMovementFilter ();
    this.filterDetail.idProduct=movement.idProduct;
    this.filterDetail.idArea=movement.idArea;
    this.filterDetail.idBranchOffice=movement.idBranchOffice;
    this.filterDetail.idPacket=movement.idPacket;
    this.filterDetail.initialDate=this.filter.initialDate;
    this.filterDetail.finalDate=this.filter.finalDate;
    const queryParams: any = {};
    this.inventoryFilters = [];
    this.inventoryFilters.push(this.filter);
    this.inventoryFilters.push(this.filterSearch);
    queryParams.filters = JSON.stringify(this.inventoryFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/ims/detail-inventory-movement',this.filterDetail.idProduct,this.filterDetail.idBranchOffice,this.filterDetail.idPacket,this.filterDetail.idArea,this.filterDetail.initialDate,this.filterDetail.finalDate],{state:navigationExtras});
  }

}
