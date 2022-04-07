import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { Coins } from 'src/app/models/masters/coin';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { ClassificationFilter } from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import { ProducttypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/producttype-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { StructuretypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/structuretype-filter';
import { ProductorigintypeFilter } from 'src/app/modules/masters-mpc/shared/filters/productorigintype-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { ClassificationService } from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { ProductorigintypeService } from 'src/app/modules/masters-mpc/shared/services/ProductOriginType/productorigintype.service';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ProductBranchFilter } from '../../shared/filters/productbranch-filter';
import { StatusProduct } from '../../shared/Utils/status-product';
import { ProductBranch } from '../../shared/view-models/product-branch.viewmodel';

@Component({
  selector: 'app-products-branch-filter',
  templateUrl: './products-branch-filter.component.html',
  styleUrls: ['./products-branch-filter.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ProductsBranchFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : ProductBranchFilter;
  @Input("loading") loading : boolean = false;
  @Input("productBranchList") productBranchList : PackingByBranchOffice[];
  @Output("onSearch") onSearch = new EventEmitter<ProductBranchFilter>();
  displayedColumns: ColumnD<PackingByBranchOffice>[] =
    [
      { template: (data) => { return data.product.barcode; }, field: 'product.barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.packingType.name; }, field: 'packingType.name', header: 'Tipo de empaque', display: 'table-cell' },
      { template: (data) => { return data.packingPresentation.name; }, field: 'packingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.units; }, field: 'units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.available, '.2'); }, field: 'available', header: 'Disponible', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalUnits, '.2'); }, field: 'totalUnits', header: 'Total unidades', display: 'table-cell' },
      { template: (data) => { return data.product.status.name; }, field: 'product.status.name', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.baseCost, '.4'); }, field: 'baseCost', header: 'Costo base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.4'); }, field: 'conversionCost', header: 'Costo conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netFactor, '.2'); }, field: 'netFactor', header: 'Factor neto', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.baseNetCost, '.4'); }, field: 'baseNetCost', header: 'Costo neto base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.conversionNetCost, '.4'); }, field: 'conversionNetCost', header: 'Costo neto conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netSalesFactor, '.2'); }, field: 'netSalesFactor', header: 'Factor neto venta', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netSellingCostBase, '.4'); }, field: 'netSellingCostBase', header: 'Costo neto venta base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.netSellingCostConversion, '.4'); }, field: 'netSellingCostConversion', header: 'Costo neto venta conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.sellingFactor, '.2'); }, field: 'sellingFactor', header: 'Factor venta', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.basePVP, '.2'); }, field: 'basePVP', header: 'PVP', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.conversionPVP, '.2'); }, field: 'conversionPVP', header: 'PVP conversión', display: 'table-cell' },
      
    ];
  colstable: any[] = [["Producto", "Categoría", "Ref. interna", "Clasificación", "Estructura", "Barra", "Tipo de empaque", "Empaque", "Estatus",
                        "Costo neto base","Costo neto conversión","Costo base","Costo neto venta base","Costo neto venta conversión","PVP base", "Factor neto",
                      "Factor venta","PVP conversión"]];
  categorylist: any[];
  origintypelist: SelectItem[];
  classificationlist: SelectItem[];
  producttypelist: SelectItem[];
  structuretypelist: SelectItem[];
  statuslist: SelectItem[];
  brandslist: SelectItem[];
  cont: number = 0;
  heavylist: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'No pesados', value: "0"},
    {label: 'Pesados', value: "1"},
  ];
  list: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  existencelist: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Con existencia', value: "1"},
    {label: 'Sin existencia', value: "0"},
    
  ];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  categoriesString: string;
  items: MenuItem[]= [
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
    }},
    {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf();
    }}
  ];

  basesymbolcoin: string = "";
  conversionsymbolcoin : string = "";
  
  constructor(public _categoryservice: CategoryService,
    private _origintypeservice: ProductorigintypeService,
    private _classificationservice: ClassificationService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private coinsService: CoinsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.onLoadCategorys();
    this.onLoadOriginTypes();
    this.onLoadClassification();
    this.onLoadProductTypes();
    this.onLoadStructureTypes();
    this.onLoadBrandsList();
    this.onLoadStatusList();
    this.searchCoinsxCompany();
  }
  
  search(){
    if (this.filters.barcode == "" && this.filters.name == "" && this.filters.internalRef == ""
    && this.filters.categoryId == "" && this.filters.productTypeId == -1 && this.filters.statusId == -1
    && this.filters.structureTypeId == -1 && this.filters.originTypeId == -1 && this.filters.classificationId == -1
    && this.filters.brandId == "" && this.filters.indHeavy == -1 && this.filters.existence==-1 && this.filters.indOnline==-1 && this.filters.indConsignment==-1 && this.filters.indActiveBuy==-1 && this.filters.indActiveSale==-1) {
      this.messageService.add({severity:'error', summary:'Error', detail: "Debe seleccionar al menos 1 filtro para la búsqueda"});
     

    }else
      this.onSearch.emit(this.filters);
    
  }

  ValidateChecksBrands(){
    this.filters.brandId = "";
    if(this.brandsselected.length > 0){
      for (let i = 0; i < this.brandsselected.length; i++) {
        this.filters.brandId = this.filters.brandId == "" ? this.brandsselected[i] : this.filters.brandId + "," + this.brandsselected[i];
      }
    }
  }

  clearFilters(){
    this.filters.productId = -1;
    this.filters.barcode="";
    this.filters.name="";
    this.filters.statusId=-1;
    this.filters.categoryId="";
    this.filters.internalRef="";
    this.filters.productTypeId=-1;
    this.filters.structureTypeId=-1;
    this.filters.originTypeId=-1;
    this.filters.classificationId=-1;
    this.filters.indHeavy=-1;
    this.filters.indActiveBuy=-1;
    this.filters.indActiveSale=-1;
    this.filters.indConsignment=-1;
    this.filters.indOnline=-1;
    this.filters.existence = -1;
    this.categoriesString = "";
    this.selectedCategories = [];
    this.brandsselected = [];
    this.filters.brandId = "";
  }

  onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
    .subscribe((data: Category[])=>{
      this._categoryservice._categoryList = data;
      if (this.filters.categoryId.toString() != "") {
        var categories = this.filters.categoryId.toString().split(",");
        this.categoriesString = "";
        for (let i = 0; i < categories.length; i++) {
          this.searchcategoryselected(data, parseInt(categories[i]))
        }
      }
    },(error)=>{
      console.log(error);
    });
  }

  onLoadOriginTypes(){
    var filter: ProductorigintypeFilter = new ProductorigintypeFilter()
    filter.active = 1;
    this._origintypeservice.getProductorigintypebyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.origintypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadClassification(){
    var filter: ClassificationFilter = new ClassificationFilter()
    filter.active = 1;
    this._classificationservice.getClassificationbyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.classificationlist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadProductTypes(){
    var filter: ProducttypeFilter = new ProducttypeFilter()
    filter.active = 1;
    this._commonservice.getProductTypes(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.producttypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadStructureTypes(){
    var filter: StructuretypeFilter = new StructuretypeFilter();
    filter.active = 1;
    this._commonservice.getStructureTypes(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.structuretypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadBrandsList(){
    var filter: brandsFilter = new brandsFilter()
    filter.active = 1;
    this._brandservice.getBrandsList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.brandslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      if (this.filters.brandId.toString() != "") {
        var brands = this.filters.brandId.toString().split(",");
        for (let i = 0; i < brands.length; i++) {
          this.brandsselected.push(parseInt(brands[i]));
        }
      }
    },(error)=>{
      console.log(error);
    });
  }
  
  onLoadStatusList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 1;
    this._commonservice.getStatus(filter)
    .subscribe((data)=>{
      data = data.filter(x => x.id != StatusProduct.Canceled)
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
    this.filters.categoryId = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filters.categoryId = this.filters.categoryId == "" ? this.selectedCategories[i].data.id : this.filters.categoryId + "," + this.selectedCategories[i].data.id;
      }
    }
  }

  searchcategoryselected(cateorys, id){
    if (cateorys.filter(x => x.data.id == id).length > 0) {
      this.cont = this.cont + 1;
      var category = cateorys.find(x => x.data.id == id);
      this.selectedCategories.push(category);
      this.categoriesString = this.categoriesString == "" ? category.data.name : this.cont >= 5 ? this.cont + " categorías seleccionadas" : this.categoriesString + ", " + category.data.name;
    }else{
      cateorys.forEach(Category => {
        if (Category.children.length > 0) {
          this.searchcategoryselected(Category.children, id);
        }
      });
    }
  }

  exportPdf() {
    console.log(this.productBranchList);
    var cols:any[] = [];
    var cols1:any[] = [];
    this.displayedColumns.forEach(col => {
      cols1.push(col.header);
    })
    cols.push(cols1);
    var list = this.productBranchList.map(lstItem=>{
      var itm:Array<string> = [];
      this.displayedColumns.forEach(col => {
        if (col.field == "product.barcode") {
          itm.push(lstItem.product.barcode)
        }
        if (col.field == "packingType.name") {
          itm.push(lstItem.packingType.name)
        }
        if (col.field == "packingPresentation.name") {
          itm.push(lstItem.packingPresentation.name)
        }
        if (col.field == "units") {
          itm.push(lstItem.units.toString())
        }
        if (col.field == "available") {
          itm.push(lstItem.available.toString())
        }
        if (col.field == "totalUnits") {
          itm.push(lstItem.totalUnits.toString())
        }
        if (col.field == "product.status.name") {
          itm.push(lstItem.product.status.name)
        }
        if (col.field == "baseCost") {
          itm.push(this.decimalPipe.transform(lstItem.baseCost, '.4') + this.basesymbolcoin);
        }
        if (col.field == "conversionCost") {
          itm.push(this.decimalPipe.transform(lstItem.conversionCost, '.4') + this.conversionsymbolcoin);
        }
        if (col.field == "netFactor") {
          itm.push(this.decimalPipe.transform(lstItem.netFactor, '.2'));
        }
        if (col.field == "baseNetCost") {
          itm.push(this.decimalPipe.transform(lstItem.baseNetCost, '.4') + this.basesymbolcoin);
        }
        if (col.field == "conversionNetCost") {
          itm.push(this.decimalPipe.transform(lstItem.conversionNetCost, '.4') + this.conversionsymbolcoin);
        }
        if (col.field == "netSalesFactor") {
          itm.push(this.decimalPipe.transform(lstItem.netSalesFactor, '.2'));
        }
        if (col.field == "netSellingCostBase") {
          itm.push(this.decimalPipe.transform(lstItem.netSellingCostBase, '.4') + this.basesymbolcoin);
        }
        if (col.field == "netSellingCostConversion") {
          itm.push(this.decimalPipe.transform(lstItem.netSellingCostConversion, '.4') + this.conversionsymbolcoin);
        }
        if (col.field == "sellingFactor") {
          itm.push(this.decimalPipe.transform(lstItem.sellingFactor, '.2'));
        }
        if (col.field == "basePVP") {
          itm.push(this.decimalPipe.transform(lstItem.basePVP, '.2') + this.basesymbolcoin);
        }
        if (col.field == "conversionPVP") {
          itm.push(this.decimalPipe.transform(lstItem.conversionPVP, '.2') + this.conversionsymbolcoin);
        }
      });
      return itm;
    })
    const doc = new jsPDF('l', 'pt', 'legal');
    // @ts-ignore
    doc.autoTable({
      head: cols,
      body: list,
      styles: {fontSize: 7}
    });
    doc.save('productos_por_sucursal.pdf');
  }

  exportExcel() {
    console.log(this.productBranchList);
    var list = this.productBranchList.map(lstItem=>{
      var itm = <any>{};
      this.displayedColumns.forEach(col => {
        if (col.field == "product.barcode") {
          itm.Barra = lstItem.product.barcode;
        }
        if (col.field == "packingType.name") {
          itm['Tipo de empaque'] = lstItem.packingType.name;
        }
        if (col.field == "packingPresentation.name") {
          itm.Empaque = lstItem.packingPresentation.name;
        }
        if (col.field == "units") {
          itm.Unidades = lstItem.units;
        }
        if (col.field == "available") {
          itm['Disponible'] = lstItem.available;
        }
        if (col.field == "totalUnits") {
          itm['Total unidades'] = lstItem.totalUnits;
        }
        if (col.field == "product.status.name") {
          itm.Estatus = lstItem.product.status.name;
        }
        if (col.field == "baseCost") {
          itm['Costo base'] = this.decimalPipe.transform(lstItem.baseCost, '.4') + this.basesymbolcoin;
        }
        if (col.field == "conversionCost") {
          itm['Costo conversión'] = this.decimalPipe.transform(lstItem.conversionCost, '.4') + this.conversionsymbolcoin;
        }
        if (col.field == "netFactor") {
          itm['Factor neto'] = this.decimalPipe.transform(lstItem.netFactor, '.2');
        }
        if (col.field == "baseNetCost") {
          itm['Costo neto base'] = this.decimalPipe.transform(lstItem.baseNetCost, '.4') + this.basesymbolcoin;
        }
        if (col.field == "conversionNetCost") {
          itm['Costo neto conversión'] = this.decimalPipe.transform(lstItem.conversionNetCost, '.4') + this.conversionsymbolcoin;
        }
        if (col.field == "netSalesFactor") {
          itm['Factor neto venta'] = this.decimalPipe.transform(lstItem.netSalesFactor, '.2');
        }
        if (col.field == "netSellingCostBase") {
          itm['Costo neto venta base'] = this.decimalPipe.transform(lstItem.netSellingCostBase, '.4') + this.basesymbolcoin;
        }
        if (col.field == "netSellingCostConversion") {
          itm['Costo neto venta conversión'] = this.decimalPipe.transform(lstItem.netSellingCostConversion, '.4') + this.conversionsymbolcoin;
        }
        if (col.field == "sellingFactor") {
          itm['Factor venta'] = this.decimalPipe.transform(lstItem.sellingFactor, '.2');
        }
        if (col.field == "basePVP") {
          itm['PVP base'] = this.decimalPipe.transform(lstItem.basePVP, '.2') + this.basesymbolcoin;
        }
        if (col.field == "conversionPVP") {
          itm['PVP conversión'] = this.decimalPipe.transform(lstItem.conversionPVP, '.2') + this.conversionsymbolcoin;
        }
      });
      return itm;
    })
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(list);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "productos_por_sucursal");
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

  searchCoinsxCompany(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = 1;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
        }else{
          this.conversionsymbolcoin = coin.symbology;
        }
      });
    })
  }
}
