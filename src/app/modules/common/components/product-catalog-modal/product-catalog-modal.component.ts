import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ProductcatalogFilter } from 'src/app/modules/products/shared/filters/productcatalog-filter';
import { ProductcatalogService } from 'src/app/modules/products/shared/services/productcatalogservice/productcatalog.service';
import { StatusProduct } from 'src/app/modules/products/shared/Utils/status-product';
import { ProductCatalog } from 'src/app/modules/products/shared/view-models/product-catalog.viewmodel';
import { DefeatImage } from '../../image/defeatimage';

@Component({
  selector: 'app-product-catalog-modal',
  templateUrl: './product-catalog-modal.component.html',
  styleUrls: ['./product-catalog-modal.component.scss']
})
export class ProductCatalogModalComponent implements OnInit {
  expanded:boolean=true;
  loading : boolean = false;
  submitted: boolean = false;
  identifierToEdit: number = -1;
  permissionsIDs = {...Permissions};
  _selectedColumns: any[];
  categoriesString: string;
  cont: number = 0;
  selectedCategories: any[] = [];
  selectedProducts: any[] = [];
  idbranchoffice:number=-1
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  _validations: Validations = new Validations();
  productcatalogFilters: ProductcatalogFilter = new ProductcatalogFilter( );
  productcatalogFiltersSearch: ProductcatalogFilter = new ProductcatalogFilter();
  @Input() visible: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("onSubmit") onSubmit = new EventEmitter<{ Products: ProductCatalog[] }>();
    heavylist: SelectItem[] = [
      {label: 'No pesados', value: 0},
      {label: 'Pesados', value: 1},
    ];
  defectImage: DefeatImage=new DefeatImage() 
  displayedColumns: ColumnD<ProductCatalog>[] =
  [
   /* {template: (data) => { return data.productId; }, header: 'Id',field: 'Id', display: 'none'}, */
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barcode; },field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.structureType; },field: 'structureType', header: 'Estructura', display: 'table-cell'},
   {template: (data) => { return data.internalRef; },field: 'internalRef', header: 'Ref. Interna', display: 'table-cell'},
   {template: (data) => { return data.category; },field: 'category', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.classification; },field: 'classification', header: 'Clasificación', display: 'table-cell'},
   {template: (data) => { return data.brand; },field: 'brand', header: 'Marca', display: 'table-cell'}
  ];
  constructor(public _productcatalogservice: ProductcatalogService, 
              public _categoryservice: CategoryService,
              private messageService: MessageService,private _httpClient: HttpClient,
              private _selectorService: CurrentOfficeSelectorService,
              private _authService: AuthService) { }
              _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
   // this._selectedColumns = this.displayedColumns
   this.onLoadCategorys();
   this._productcatalogservice._ProductCatalogList=[];
    this.selectedProducts=[];
   //this.searchCatalogProducts();
  }

  clearFilters()
  {
    this.productcatalogFilters.barcode ="";
    this.productcatalogFilters.name = "";
    this.productcatalogFilters.internalRef = "";
    this.productcatalogFilters.categoryId = "";
    this.categoriesString = "";
  }


  searchCatalogProducts(){
    this.loading = true;
    this.productcatalogFilters.companyId=this._Authservice.currentOffice;
    this.productcatalogFilters.statusId = StatusProduct.Finish;
    this._productcatalogservice.getProductCatalogbyfilter(this.productcatalogFilters).subscribe((data: ProductCatalog[]) => {
      var dat: any[] = data;
      this._productcatalogservice._ProductCatalogList = dat.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los productos"});
    });
  }
  
  ValidateCheckeds(control, category: Category) : void{
    this.categoriesString = "";
    this.productcatalogFilters.categoryId = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.productcatalogFilters.categoryId = this.productcatalogFilters.categoryId == "" ? this.selectedCategories[i].data.id : this.productcatalogFilters.categoryId + "," + this.selectedCategories[i].data.id;
      }
    }
  }
  
  onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
    .subscribe((data: Category[])=>{
      this._categoryservice._categoryList = data;
      console.log(this._categoryservice._categoryList);
      if (this.productcatalogFilters.categoryId.toString() != "") {
        var categories = this.productcatalogFilters.categoryId.toString().split(",");
        this.categoriesString = "";
        for (let i = 0; i < categories.length; i++) {
          this.searchcategoryselected(data, parseInt(categories[i]))
        }
      }
    },(error)=>{
      console.log(error);
    });
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

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  onShow()
  {  
    this.productcatalogFilters=new ProductcatalogFilter();
    this._productcatalogservice._ProductCatalogList=[];
    this.selectedProducts=[];
    this.submitted=false; 
    this.emitVisible(); 
    //this.searchCatalogProducts();
    this.ngOnInit();
  }

  onHide(){
    this.submitted=false;
    this.emitVisible();
    this.identifierToEdit = -1;
    this.selectedProducts=[];
    this._productcatalogservice._ProductCatalogList=[];
  }

  submit()
  { 
    this.submitted=true;
    if(this.selectedProducts.length >0)
    { 
        this.onSubmit.emit({
          Products: this.selectedProducts
        });
        this.submitted=false;
        this.visible=false;
        this.onHide();
    }  
  }

}
