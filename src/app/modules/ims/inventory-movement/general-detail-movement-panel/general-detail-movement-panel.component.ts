import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { productInventoryMovement } from 'src/app/models/ims/product-inventory-movemnt';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DetailInventoryMovementFilter } from '../shared/filter/detail-inventory-movement-filter';
import { InventoryMovementFilter } from '../shared/filter/inventory-movement-filter';
import { ProductInventoryMovementFilter } from '../shared/filter/product-inventory-movementr-filter';
import { InventoryMovementService } from '../shared/service/inventory-movement.service';

@Component({
  selector: 'app-general-detail-movement-panel',
  templateUrl: './general-detail-movement-panel.component.html',
  styleUrls: ['./general-detail-movement-panel.component.scss']
})
export class GeneralDetailMovementPanelComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
   _product : productInventoryMovement=new productInventoryMovement(); 
  filterDetail: DetailInventoryMovementFilter = new DetailInventoryMovementFilter ();
  filterProduct: ProductInventoryMovementFilter = new ProductInventoryMovementFilter ();
  filtersOfValues: InventoryMovementFilter[] = [];
  Show: boolean = false;
  showTransit :boolean = false;
  showproduct:boolean=true;

  constructor(public _Service: InventoryMovementService,public breadcrumbService: BreadcrumbService,private rutaActiva: ActivatedRoute,private messageService: MessageService, private router: Router, private readonly loadingService:LoadingService) { 
  this.breadcrumbService.setItems([
  { label: 'OSM' },
  { label: 'IMS' },
  { label: 'Reportes' },
  { label: 'Movimientos de inventario', routerLink: ['/ims/inventory-movement-list'] },
  { label: 'Detalles de los movimientos de inventario' }
 ]);}

  ngOnInit(): void {
    debugger
    if(this.filtersOfValues.length >0)
    {
      this.filtersOfValues=this.filtersOfValues;
    }
    else
    {   
      if(history.state.queryParams!=undefined)
      {
        const filters=history.state.queryParams.filters;//this.activatedRoute.snapshot.queryParamMap.get('filters');//history.state.queryParams//
        if (filters === null) 
          this.filtersOfValues = [];
        else 
          this.filtersOfValues = JSON.parse(filters);

          sessionStorage.setItem('searchParameters',filters);

        }
        else
            this.filtersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
          
         
    }
    this.filterDetail.idProduct= this.rutaActiva.snapshot.params.id,
    this.filterDetail.idArea=this.rutaActiva.snapshot.params.idarea,
    this.filterDetail.idPacket=this.rutaActiva.snapshot.params.idpacket,
    this.filterDetail.idBranchOffice=this.rutaActiva.snapshot.params.idbranchoffice,
    this.filterDetail.initialDate=this.rutaActiva.snapshot.params.fechaini;
    this.filterDetail.finalDate=this.rutaActiva.snapshot.params.fechafin;

    this.filterProduct.idProduct= this.rutaActiva.snapshot.params.id,
    this.filterProduct.idArea=this.rutaActiva.snapshot.params.idarea,
    this.filterProduct.idPacket=this.rutaActiva.snapshot.params.idpacket,
    this.filterProduct.idBranchOffice=this.rutaActiva.snapshot.params.idbranchoffice,
    this.filterDetail.initialDate=this.rutaActiva.snapshot.params.fechaini;
    this.filterDetail.finalDate=this.rutaActiva.snapshot.params.fechafin;
  
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.filterDetail.idProduct= this.rutaActiva.snapshot.params.id,
        this.filterDetail.idArea=this.rutaActiva.snapshot.params.idarea,
        this.filterDetail.idPacket=this.rutaActiva.snapshot.params.idpacket,
        this.filterDetail.idBranchOffice=this.rutaActiva.snapshot.params.idbranchoffice,
        this.filterDetail.initialDate=this.rutaActiva.snapshot.params.fechaini;
        this.filterDetail.finalDate=this.rutaActiva.snapshot.params.fechafin;

        this.filterProduct.idProduct= this.rutaActiva.snapshot.params.id,
        this.filterProduct.idArea=this.rutaActiva.snapshot.params.idarea,
        this.filterProduct.idPacket=this.rutaActiva.snapshot.params.idpacket,
        this.filterProduct.idBranchOffice=this.rutaActiva.snapshot.params.idbranchoffice,
        this.filterDetail.initialDate=this.rutaActiva.snapshot.params.fechaini;
        this.filterDetail.finalDate=this.rutaActiva.snapshot.params.fechafin;
      }
    );
    this.search();
  }

  search() {
    this.loadingService.startLoading();
    this._Service.getProducttInventoryMovementList(this.filterProduct).subscribe((data: productInventoryMovement) => {
      this._product  = data;
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  handleChange(e) {
    var index = e.index;
    if(index==1)
    {
      this.Show=true;
      this.showTransit=false;
    }
    else
    {
      this.Show=false;
      this.showTransit=true;    
     }
    
 }
 backList()
 {
   const queryParams: any = {};
   queryParams.filters = JSON.stringify(this.filtersOfValues);
   const navigationExtras: NavigationExtras = {
     queryParams,
     skipLocationChange:true
   };
   this.router.navigate(['/ims/inventory-movement-list'],navigationExtras);
 }

}
