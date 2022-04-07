import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { ProductorigintypeService } from 'src/app/modules/masters-mpc/shared/services/ProductOriginType/productorigintype.service';
import { ClassificationService } from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { Category } from 'src/app/models/masters-mpc/category';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ProductCatalog } from '../../shared/view-models/product-catalog.viewmodel';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { ProductorigintypeFilter } from 'src/app/modules/masters-mpc/shared/filters/productorigintype-filter';
import { ClassificationFilter } from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import { ProducttypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/producttype-filter';
import { StructuretypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/structuretype-filter';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { StatusProduct } from '../../shared/Utils/status-product';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'productcatalog-filter-panel',
  templateUrl: './productcatalog-filter-panel.component.html',
  styleUrls: ['./productcatalog-filter-panel.component.scss'],
  providers: [DatePipe]
})
export class ProductcatalogFilterPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : ProductcatalogFilter;
  @Input("loading") loading : boolean = false;
  @Input("productcataloglist") productcataloglist : ProductCatalog[];
  @Input("_selectedColumns") _selectedColumns : any[];
  @Output("onSearch") onSearch = new EventEmitter<ProductcatalogFilter>();
  colstable: any[] = [["Nombre", "Barra", "Estatus", "Estructura", "Ref. Interna", "Ref. Fábrica", "Categoría", "Clasificación", "Marca"]];
  categorylist: any[];
  origintypelist: SelectItem[];
  classificationlist: SelectItem[];
  producttypelist: SelectItem[];
  structuretypelist: SelectItem[];
  statuscreationlist: SelectItem[];
  brandslist: SelectItem[];
  cont: number = 0;
  heavylist: SelectItem[] = [
    {label: 'No pesados', value: 0},
    {label: 'Pesados', value: 1},
  ];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  categoriesString: string;
  _validations: Validations = new Validations();
  items: MenuItem[]= [
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
    }},
    {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf();
    }}
  ];

  constructor(public _categoryservice: CategoryService,
    private _origintypeservice: ProductorigintypeService,
    private _classificationservice: ClassificationService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    public datepipe: DatePipe,
    private messageService: MessageService,
    private _Authservice: AuthService) { }

  ngOnInit(): void {
    
    this.onLoadOriginTypes();
    this.onLoadClassification();
    this.onLoadProductTypes();
    this.onLoadStructureTypes();
    this.onLoadBrandsList();
    this.onLoadStatusCreationList();
    this.onLoadCategorys();
    
  }

  search(){
    if (this.filters.barcode == "" && this.filters.name == "" && this.filters.internalRef == ""
    && this.filters.categoryId == "" && this.filters.productTypeId == -1 && this.filters.statusId == -1
    && this.filters.structureTypeId == -1 && this.filters.originTypeId == -1 && this.filters.classificationId == -1
    && this.filters.brandId == "" && this.filters.indHeavy == -1) {
      this.messageService.add({severity:'error', summary:'Error', detail: "Debe indicar por lo menos un filtro"});
    }else{
      this.onSearch.emit(this.filters);
    }
    
/*     if (this.filters.productTypeId == -1 && this.filters.indHeavy == -1) {
      this.messageService.add({severity:'error', summary:'Error', detail: "Debe seleccionar los filtros obligatorios de búsqueda"});
    }else{
      this.onSearch.emit(this.filters);
    } */
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
    this.filters.companyId=this._Authservice.currentCompany;;
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
    this.filters.userId = -1;
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
      data = data.filter(x => x.id != 3);
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
  onLoadStatusCreationList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 2;
    this._commonservice.getStatus(filter)
    .subscribe((data)=>{
      data = data.filter(x => x.id != StatusProduct.Canceled)
      this.statuscreationlist = data.map((item)=>({
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
    //debugger;
    var cols:any[] = [];
    var cols1:any[] = ["Nombre"];
    this._selectedColumns.forEach(col => {
      if (col.field != "name") {
        cols1.push(col.header);
      }
    })
    cols.push(cols1);
    var list = this.productcataloglist.map(lstItem=>{
      var itm:Array<string> = [];
      itm.push(lstItem.name);
      this._selectedColumns.forEach(col => {
        if (col.field == "barcode") {
          itm.push(lstItem.barcode)
        }
        if (col.field == "status") {
          itm.push(lstItem.status)
        }
        if (col.field == "structureType") {
          itm.push(lstItem.structureType)
        }
        if (col.field == "internalRef") {
          itm.push(lstItem.internalRef)
        }
        if (col.field == "factoryRef") {
          itm.push(lstItem.factoryRef)
        }
        if (col.field == "category") {
          itm.push(lstItem.category)
        }
        if (col.field == "classification") {
          itm.push(lstItem.classification)
        }
        if (col.field == "brand") {
          itm.push(lstItem.brand)
        }
        if (col.field == "dateCreate") {
          itm.push(this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"))
        }
        if (col.field == "dateUpdate") {
          itm.push(this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy"))
        }
      });
      return itm;
    })
    const doc = new jsPDF('p', 'pt');
    // @ts-ignore
    doc.autoTable({
      head: cols,
      body: list,
    });
    doc.save('products.pdf');
  }

  exportExcel() {
    var list = this.productcataloglist.map(lstItem=>{
      var itm = <any>{};
      itm.Nombre = lstItem.name;
      this._selectedColumns.forEach(col => {
        if (col.field == "barcode") {
          itm.Barra = lstItem.barcode;
        }
        if (col.field == "status") {
          itm.Estatus = lstItem.status;
        }
        if (col.field == "structureType") {
          itm.Estructura = lstItem.structureType;
        }
        if (col.field == "internalRef") {
          itm['Ref. Interna'] = lstItem.internalRef;
        }
        if (col.field == "factoryRef") {
          itm['Ref. Fábrica'] = lstItem.factoryRef;
        }
        if (col.field == "category") {
          itm.Categoría = lstItem.category;
        }
        if (col.field == "classification") {
          itm.Clasificación = lstItem.classification;
        }
        if (col.field == "brand") {
          itm.Marca = lstItem.brand;
        }
        if (col.field == "dateCreate") {
          itm['Fecha creación'] = this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy");
        }
        if (col.field == "dateUpdate") {
          itm['Fecha actualización'] = this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
        }
      });
      return itm;
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
