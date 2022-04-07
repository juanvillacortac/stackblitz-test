import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryProductBranchOffice } from 'src/app/models/products/inventory';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { InventoryFilter } from '../../shared/filters/inventory-filter';
import { ProductbranchofficeService } from '../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-product-brach-office-inventory',
  templateUrl: './product-brach-office-inventory.component.html',
  styleUrls: ['./product-brach-office-inventory.component.scss'],
  providers: [DecimalPipe]
})
export class ProductBrachOfficeInventoryComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  inventoryFilter: InventoryFilter = new InventoryFilter();
  idBranchOffice : number = 0;
  inventoryList: InventoryProductBranchOffice[] = [];
  totalsuminventory: number = 0;
  totalsuminventoryblocked: number = 0;
  totalsuminventorytransit: number = 0;
  totalsuminventoryreserved: number = 0;
  totalsuminventorytotal: number = 0;
  displayedColumnsInventory: ColumnD<InventoryProductBranchOffice>[] =
  [
    //{template: (data) => { return data.area.name ; },field: 'area.name', header: 'Área', display: 'table-cell'},
    //{template: (data) => { return data.space.name ; },field: 'space.name', header: 'Espacio', display: 'table-cell'},
    {template: (data) => { return data.packingPresentation.name; }, header: 'Empaque',field: 'packingPresentation.name', display: 'table-cell'},
    {template: (data) => { return data.units; },field: 'units', header: 'Unidades', display: 'table-cell'},
    {template: (data) => { return data.packingType.name ; },field: 'packingType.name', header: 'Tipo', display: 'table-cell'},
    {template: (data) => { return this.decimalPipe.transform(data.existenceAvailable, '.3'); },field: 'existenceAvailable', header: 'Disponible', display: 'table-cell'},
    {template: (data) => { return this.decimalPipe.transform(data.existenceBlocked, '.3'); },field: 'existenceBlocked', header: 'Bloqueado', display: 'table-cell'},
    {template: (data) => { return this.decimalPipe.transform(data.existenceTransit, '.3'); },field: 'existenceTransit', header: 'En tránsito', display: 'table-cell'},
    {template: (data) => { return this.decimalPipe.transform(data.existenceReserved, '.3'); },field: 'existenceReserved', header: 'Reservado', display: 'table-cell'},
    {template: (data) => { return this.decimalPipe.transform(data.existence, '.3'); },field: 'existence', header: 'Total', display: 'table-cell'},
  ];

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService,
    private decimalPipe: DecimalPipe,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  searchInventoryBranchOffice(idBranchOffice: number){
    //this.loadingService.startLoading('wait_loading');
    this.totalsuminventory = 0;
    this.totalsuminventoryblocked = 0;
    this.totalsuminventorytransit = 0;
    this.totalsuminventoryreserved = 0;
    this.totalsuminventorytotal = 0;
    this.idBranchOffice = idBranchOffice;
    this.inventoryFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.inventoryFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getInventorybyfilter(this.inventoryFilter).subscribe((data: InventoryProductBranchOffice[]) => {
      this.inventoryList = data;
      this.inventoryList.forEach(inventory => {
        this.totalsuminventory = inventory.existenceAvailable + this.totalsuminventory;
        this.totalsuminventoryblocked = inventory.existenceBlocked + this.totalsuminventoryblocked;
        this.totalsuminventorytransit = inventory.existenceTransit + this.totalsuminventorytransit;
        this.totalsuminventoryreserved = inventory.existenceReserved + this.totalsuminventoryreserved;
        this.totalsuminventorytotal = inventory.existence + this.totalsuminventorytotal;
        
      });
      //this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      //this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando el inventario"});
    });
  }
}
