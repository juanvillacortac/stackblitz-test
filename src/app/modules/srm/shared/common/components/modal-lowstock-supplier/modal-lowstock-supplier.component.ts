import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierCatalogModal } from 'src/app/models/common/supplier-catalog-modal';
import { InventoryProductInfo } from 'src/app/models/srm/inventoryproduct-info';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PoitnBreakSupplierCatalog } from '../../../filters/common/point-break-product-supplier';
import { SuppliercatalogFilter } from '../../../filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../../services/suppliercatalog/suppliercatalog.service';

@Component({
  selector: 'app-modal-lowstock-supplier',
  templateUrl: './modal-lowstock-supplier.component.html',
  styleUrls: ['./modal-lowstock-supplier.component.scss']
})
export class ModalLowstockSupplierComponent implements OnInit {
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("multiple") multiple: boolean = false;
  @Input("_idSupplier") _idSupplier:number;
  @Output("onSubmit") onSubmit = new EventEmitter<any[]>();
  @Input("visible") visible : boolean = false;
  listProduct:PoitnBreakSupplierCatalog[]=[];
  packingTypeslist: SelectItem[];
  defectImage: DefeatImage=new DefeatImage() 
  todos: SelectItem =
  { label: "Todos", value: '-1' };
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  detail:PoitnBreakSupplierCatalog;
  inventoryday:any;
  date1: Date = new Date();
  date2: Date = new Date();  
  filters:  SuppliercatalogFilter=new  SuppliercatalogFilter;
  loading : boolean = false;
  selectedProducts: any[] = [];
  //@Output() suppliers = new  EventEmitter<any[]>();
  constructor(private _commonservice: CommonService,private _Authservice: AuthService,public loadingService: LoadingService,public  _service: SuppliercatalogService,private messageService: MessageService) { }


  onShow(){
  
    this.ngOnInit();

  }
  ngOnInit(): void {

    this.onLoadPackingTypes();
    this.selectedProducts=[];
   // this.date1=Date.now();
    //this.date2=Date.now();
  //  this.userFilters=new UserFilterViewModel();
  
    this.listProduct=[
      { idProduct:1,category:'Viveres',name:'Harina de maíz precocida pan',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876',conversionCost:0,supplierRef:"222-790",idSupplier:1,baseCost:0,idCategory:1,internalRef:'58855-99',barra:'5555500004027',presentationPacking:'Individual'},      
      { idProduct:6,category:'Viveres',name:'Aceite de oliva chacon con ajo en spary 200ml',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitechaconcinajojpg_03112021_10:37:53202111031438232368',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'58855-99',barra:'05422272255555',presentationPacking:'Individual'},      
      { idProduct:19,category:'Viveres',name:'Cereal con dulce de leche flips 120g',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipsduldeleche3_03112021_10:20:48202111031421191126',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'58855-99',barra:'05422222255855',presentationPacking:'Individual'},      
      { idProduct:21,category:'Viveres',name:'Cereal de chocolate flips 220g',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocolate_03112021_10:20:14202111031420451515',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'58055-99',barra:'05422222255575',presentationPacking:'Individual'},      
      { idProduct:6,category:'Viveres',name:'Arroz risotto flora 1kg',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'50855-99',barra:'05422222255585',presentationPacking:'Individual'},      
      { idProduct:7,category:'Viveres',name:'Harina d/trigo rey del norte 45kg',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'58857-99',barra:'05422222259555',presentationPacking:'Individual'},      
      { idProduct:8,category:'Viveres',name:'Aceite de oliva  monini  extra virgen 500ml',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876',conversionCost:0,supplierRef:"222-000",idSupplier:1,baseCost:0,idCategory:1,internalRef:'57855-99',barra:'0542222285555',presentationPacking:'Individual'},      
      { idProduct:9,category:'Viveres',name:'Mezcla la lucha para panqueca 500g',inventory:20,pointMedium:100,pointMax:800,pointMin:50,image:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876',barra:'05422222255555',conversionCost:0,supplierRef:"222-000",idCategory:2,idSupplier:1,baseCost:0,internalRef:"227-000",presentationPacking:'Individual'},      
     
  
    ]
  }
  onHide(){
    this.emitVisible();
   
  }
  emitVisible(){
    this.onToggle.emit(this.visible);
  }
  onLoadPackingTypes() {
    var filter: PackingtypeFilter = new PackingtypeFilter();
    filter.active = 1;

    this._commonservice.getPackingTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.packingTypeslist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
        this.packingTypeslist.push(this.todos);
      }, (error) => {
        console.log(error);
      });
  }
  ProcessTemporal(data:SupplierCatalogModal[]){
    let item:PoitnBreakSupplierCatalog=new PoitnBreakSupplierCatalog;
    data.forEach( product => {
      item=new PoitnBreakSupplierCatalog;
   item= this.listProduct.filter(product2=>product2.idProduct==product.idProduct)[0];
      this.detail = new PoitnBreakSupplierCatalog();
     // let price = new PurchaseOrderProductPrice();
      this.detail.idProduct = product.idProduct;
      this.detail.name = product.name;
      this.detail.barra = product.barra;
      this.detail.internalRef = product.internalRef;
      //this.detail.indHeavy = true;
      this.detail.category = product.category;
      //this.detail.idPackagingType = 2;
      this.detail.presentationPacking =  'Individual';
      this.detail.supplierRef = product.supplierRef;

      if (item)
      {
        this.detail.pointMax = item.pointMax;
        this.detail.pointMedium = item.pointMedium;
        this.detail.pointMin = item.pointMin;
        this.detail.inventory=item.inventory;
        this.detail.image=item.image;

      }else
      {
        this.detail.pointMax = 100;
        this.detail.pointMedium = 50;
        this.detail.pointMin = 15;
        this.detail.inventory=10;
        this.detail.image='https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876';

      }
     
     });

  }
  searchProducts()
  {
    this.loadingService.startLoading();
    this.filters.active=1;
    this.filters.idCom=this._Authservice.currentCompany;;
    if(this._idSupplier <0)
      this.filters.idsupplier="";
    else
       this.filters.idsupplier=this._idSupplier.toString();

    this._service.getSupplierCatalogExpressfilter(this.filters).subscribe((data: SupplierCatalogModal[]) => {
      this._service._SupplierCatalogExpressList = data;
      this.ProcessTemporal(data);
     
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  add(){
    if (this.selectedProducts?.length > 0) {    
      this.onSubmit.emit(
         this.selectedProducts
       
       );
       this.visible = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: 'Seleccione al menos un producto.' });
 
    }
    

  }

}
