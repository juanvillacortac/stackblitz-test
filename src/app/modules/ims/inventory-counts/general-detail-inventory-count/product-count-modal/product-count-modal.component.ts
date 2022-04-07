import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { statusproduct } from 'src/app/models/common/status-enum';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { ProductCountInventoryFilter } from '../../shared/filter/product-count-detail-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';

@Component({
  selector: 'product-count-modal',
  templateUrl: './product-count-modal.component.html',
  styleUrls: ['./product-count-modal.component.scss']
})
export class ProductCountModalComponent implements OnInit {

  loading: boolean = false;
  showFilters: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialogAddProduct")  showDialogAddProduct: boolean = false;
  @Input("idCategory")  idCategory: number = -1;
  @Input("idArea")      idArea: number = -1;
  @Output() showDialogAddProductChange = new EventEmitter<boolean>();
  @Output("refreshchange") refreshchange = new EventEmitter<number>();
  @Input("_DetailListTemp") _DetailListTemp: DetailInventoryCount[];
  @Output("DetailStringChange") DetailStringChange = new EventEmitter<DetailInventoryCount[]>();
  selectedProduct : any[] = [];
  blocked:boolean=false;

  _ViewModel: DetailInventoryCount=new DetailInventoryCount();
  filter: ProductCountInventoryFilter = new ProductCountInventoryFilter ();
  @ViewChild('dtpm') dtpm: Table;
 
  
  
  displayedColumns: ColumnD<DetailInventoryCount>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.idProduct; }, header: 'Id', display: 'none',field:'idProduct' },
      { template: (data) => { return data.gtin; }, header: 'Barra', display: 'table-cell',field: 'gtin' }, 
      { template: (data) => { return data.product; }, header: 'Nombre producto', display: 'table-cell',field: 'product' }, 
      { template: (data) => { return data.codeBalance; }, header: 'Código balanza', display: 'table-cell',field: 'codeBalance' },
      { template: (data) => { return data.packet; }, header: 'Empaque', display: 'table-cell',field: 'packet' },  
      { template: (data) => { return data.unitPerPackaging; }, header: 'Número de unidades', display: 'table-cell',field: 'unitPerPackaging' },    
      { template: (data) => { return data.category; }, header: 'Categoría', display: 'table-cell',field: 'category' }, 
      { field: 'indBlocked', header: 'Bloqueado', display: 'table-cell' },
      { template: (data) => { if (data.indHeavy==true) return data.existences.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); else return data.existences.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}, header: 'Existencia', display: 'table-cell',field: 'existences' },
      
    ];
  constructor(public _Service: InventorycountService, private _httpClient: HttpClient,private breadcrumbService: BreadcrumbService,private messageService: MessageService) 
  { }

  _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void
  { 
    this.filter.idArea=this.idArea;
    this.filter.idCategory=this.idCategory;  
  }

  onShow(){
    this.ngOnInit();
    this.search();
  }

  onHide(){
    this.dtpm.reset();
    this. showDialogAddProduct = false;
    this.showDialogAddProductChange.emit(this. showDialogAddProduct);
    this.filter=new ProductCountInventoryFilter ();
    this.selectedProduct=[];
  }
  search()
  {
    this.loading = true;
    this.filter.idBranchOffice=this._Authservice.currentOffice;
    this._Service.getProductInventoryCountList(this.filter).subscribe((data: DetailInventoryCount[]) => {
      this._Service._ProductList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  submitVarious()
  { 
    let cont = 0;
    let isdesincoprated=false;
    for (let i = 0; i < this.selectedProduct.length; i++)
    {
      cont += 1;
      if(this.selectedProduct[i].idStatusProduct==statusproduct.desincorporate)
            isdesincoprated=true ;

      else if(this.selectedProduct[i].indBlocked==true)
            this.blocked=true ;
      else
      {
          if(this._DetailListTemp.findIndex(x=>x.idProduct==this.selectedProduct[i].idProduct && x.idPacket==this.selectedProduct[i].idPacket && this.selectedProduct[i].indBlocked==false && this.selectedProduct[i].idStatusProduct==statusproduct.active )==-1)
             this._DetailListTemp.push(this.selectedProduct[i]);
      }
      this.refreshchange.emit();
      this.DetailStringChange.emit(this._DetailListTemp)
      this.showDialogAddProduct = false;
      this.showDialogAddProductChange.emit(this.showDialogAddProduct);
     
    }
    if(this.blocked==true)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Los productos con bloqueo no pueden ser añadidos al conteo" });
    
    if(isdesincoprated==true)
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "Los productos con estatus desincoroporado no pueden ser añadidos al conteo" });
    
    this.selectedProduct=[];
    this.blocked=false;
    isdesincoprated=false;
  }
}
