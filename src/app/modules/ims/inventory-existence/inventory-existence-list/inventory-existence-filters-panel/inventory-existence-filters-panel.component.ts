import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { Brands } from 'src/app/models/masters/brands';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { InventoryExistenceFilter } from '../../shared/filters/inventory-existence-filter';
import { InventoryExistenceService } from '../../shared/services/inventory-existence.service';

@Component({
  selector: 'app-inventory-existence-filters-panel',
  templateUrl: './inventory-existence-filters-panel.component.html',
  styleUrls: ['./inventory-existence-filters-panel.component.scss'],
  providers: [DatePipe]
})
export class InventoryExistenceFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: InventoryExistenceFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  valid:RegExp = /^[a-zA-Z0-9Á-ú\sñÑ.-]*$/;
  statuslist: SelectItem[];
  ExistenceList: SelectItem[];
  AreaList: SelectItem[];
  selectedCategories: any[] = [];
  categoriesString: string;
  BrandsString: string;
  supplierstring: string;
  addressDialogVisible = false;
  BrandDialogVisible = false;
  SupplierDialogVisible = false;
  dateFilter:Date=new Date();
  maxDate:Date=new Date();
  ejemplo: string;
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  heavylist: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Pesados', value: "1"},
    {label: 'No pesados', value: "0"},
  ];
  @Output("onSearch") onSearch = new EventEmitter<InventoryExistenceFilter>();
  constructor(private _brandService : BrandsService, private _areaService : AreaService,public _categoryservice: CategoryService , public datepipe:DatePipe , public _commonService : CommonService , private _inventoryExistenceService : InventoryExistenceService,private _httpClient: HttpClient ) 
  {
    

      this.ExistenceList=[
        { label: 'Todos', value:  '2' },
        { label: 'Positiva', value: '1'},
        { label: 'Negativa', value: '-1'},
        { label: 'En cero', value: '0'}
        ];
    
   }
   _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this.onLoadCategorys();
    this.loadFilters();
   
  }

  loadFilters(){
    var filterarea=new AreaFilter();
    filterarea.idBranchOffice = this._Authservice.currentOffice;
    filterarea.active=1
    this._areaService.getareaList(filterarea)
    .subscribe((data)=>{
      this.AreaList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType =1 ;
    this._commonService.getStatus(filter)
    .subscribe((data)=>{
      this.statuslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  ValidateCheckeds(control, category: Category) : void{
    this.categoriesString = "";
    this.filters.idcategory = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filters.idcategory = this.filters.idcategory == "" ? this.selectedCategories[i].data.id : this.filters.idcategory + "," + this.selectedCategories[i].data.id;
      }
    }
  }


  onToggleSupplier(visible: boolean){
    this.SupplierDialogVisible = visible;
    this.ejemplo =this.supplierstring;

  }

  onToggleBrand(visible: boolean){
    this.BrandDialogVisible = visible;
    this.ejemplo =this.supplierstring;
  }

  onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
    .subscribe((data: Category[])=>{
      console.log(data)
      this._categoryservice._categoryList = data;
    },(error)=>{
      console.log(error);
    });
  }
  
  search() {
    this.filters.inventorydate = this.datepipe.transform(this.dateFilter, "yyyyMMdd");
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    debugger
    this.filters.bar= "";
    this.filters.productname="";
    this.filters.reference="";
    this.filters.factoryreference="";
    this.filters.scalecode="";
    this.filters.idsupplier="";
    this.filters.idbrand="";
    this.filters.idcategory="";
    this.filters.idproductestatus=-1;
    this.filters.indheavyproduct=-1;
    this.filters.inventorydate="";
    this.filters.existence=-2;
    this.filters.inventoryarea=-1;
    this.filters.idbranchoffice=-1;
    this.filters.idproduct=-1;
    this.BrandsString = "";
    this.supplierstring= "";
    this.filters.supplierstring="";
    this.categoriesString= "";
    this.dateFilter=new Date();
    //this._inventoryExistenceService._inventoryExistenceList = [];
  }

  exportExcel() {
    var list = this._inventoryExistenceService._inventoryExistenceList.map(lstItem=>{
      return {
          Sucursal:lstItem.branchoffice,
          Área:lstItem.inventoryarea,
          Barra: lstItem.bar,
          Referencia: lstItem.reference,
          ReferenciaFabrica: lstItem.factoryreference,
          SKU: lstItem.sku,
          Nombreproducto:lstItem.productname,
          Presentación:lstItem.presentation,
          Codigobalanza:lstItem.scalecode,
          Estatus: lstItem.productestatus,
          TipoProducto: lstItem.producttype,
          Categoria: lstItem.category,
          Marca: lstItem.brand,
          proveedor:lstItem.supplier,
          Clasificación:lstItem.clasification,
          Pesado:lstItem.indheavyproduct,
          Costobase:lstItem.basecost,
          Costoconversion:lstItem.conversioncost,
          FactorCIF:lstItem.cifFactor,
          FactorNeto:lstItem.netfactor,
          Costonetobase:lstItem.basenetcost,
          Costonetoconversion:lstItem.netcostconversion,
          factorventaneto:lstItem.netsalesfactor,
          CostoVentabaseneto:lstItem.netcostsellbase,
          CostoNetoVentaConversion:lstItem.netcostsellconversion,
          sellfactor:lstItem.sellfactor,
          PVP:lstItem.basePvp,
          PVPConversion:lstItem.pvpconversion,
          existencia:lstItem.existence,
      }
    })
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(list);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "products");
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }




}
