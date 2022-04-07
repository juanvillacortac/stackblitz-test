import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { ProductBranchFilter } from 'src/app/modules/products/shared/filters/productbranch-filter';

@Component({
  selector: 'app-advanced-product-search-filter',
  templateUrl: './advanced-product-search-filter.component.html',
  styleUrls: ['./advanced-product-search-filter.component.scss']
})
export class AdvancedProductSearchFilterComponent implements OnInit {

  @Input("filters") filters : ProductBranchFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter();
  @Output() changes = new EventEmitter();

  statuslist:any[];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  BrandsString: string;
  supplierstring: string;
  BrandDialogVisible = false;
  SupplierDialogVisible = false;
  configurationList:SelectItem[]=[];
  valid:RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  selectedCategories: any[] = [];
  categoriesString: string;
  cont: number = 0;
  existencelist: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Con existencia', value: "1"},
    {label: 'Sin existencia', value: "0"},
    
  ];

  constructor(public _commonservice:CommonService,
    public _categoryservice: CategoryService) { }

  ngOnInit(): void {
    this.onLoadStatusCreationList();
    this.onLoadCategorys();
    this.supplierstring="";
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
  
  onLoadStatusCreationList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType =1;
    this._commonservice.getStatus(filter)
    .subscribe((data)=>{
      this.statuslist = data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onToggleSupplier(visible: boolean){
    this.SupplierDialogVisible = visible;
  }

  onToggleBrand(visible: boolean){
    this.BrandDialogVisible = visible;
  }
  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.barcode="";
    this.filters.name="";
    this.filters.internalRef="";
    this.categoriesString="";
    this.filters.existence=-1;
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

}
