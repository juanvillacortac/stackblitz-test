import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { ClassificationFilter } from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { ClassificationService } from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';
import { ProductcomFilter } from 'src/app/modules/products/shared/filters/productcom-filter';
// import { ProductcomFilter } from '../../../shared/filters/product-filter';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Input("filtersprod") filtersprod: ProductcomFilter = new ProductcomFilter();
  @Input("loading") loading: boolean = false;
  @Input("productsupplierlist") productsupplierlist: SupplierCatalog[];
  @Output("onSearchproduct") onSearchproduct = new EventEmitter<ProductcomFilter>();

  categorylist: any[];
  classificationlist: SelectItem[];
  brandslist: SelectItem[];
  cont: number = 0;
  heavylist: SelectItem[] = [
    { label: 'No pesados', value: 0 },
    { label: 'Pesados', value: 1 },
  ];

  typeslist: SelectItem[];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  categoriesString: string;
  _validations: Validations = new Validations();
  constructor(public _categoryservice: CategoryService,
    private _classificationservice: ClassificationService,
    private _brandservice: BrandsService,
    private _commonservice: CommonService) { }

  ngOnInit(): void {
    this.onLoadCategorys();
    this.onLoadBrandsList();
    this.onLoadClassification();
    this.onLoadPackingTypes();
  }

  searchprod() {
    if (this.filtersprod.indHeavy != -2 || this.filtersprod.brandId != "" || this.filtersprod.classificationId != -1 ||
      this.filtersprod.internalRef != "" || this.filtersprod.name != "" || this.filtersprod.idTypePacking != -2
      || this.filtersprod.barcode != "") {
            this.onSearchproduct.emit(this.filtersprod);
    }
  }
  ValidateChecksBrands() {
    this.filtersprod.brandId = "";
    if (this.brandsselected.length > 0) {
      for (let i = 0; i < this.brandsselected.length; i++) {
        this.filtersprod.brandId = this.filtersprod.brandId == "" ? this.brandsselected[i] : this.filtersprod.brandId + "," + this.brandsselected[i];
      }
    }
  }
  clearFilters() {
    this.filtersprod.companyId = -1;
    this.filtersprod.idProduct = -1;
    this.filtersprod.barcode = "";
    this.filtersprod.name = "";
    this.filtersprod.categoryId = "";
    this.filtersprod.internalRef = "";
    this.filtersprod.classificationId = -1;
    this.filtersprod.indHeavy = -2;
    this.filtersprod.idTypePacking = -2;
    this.filtersprod.userId = -1;
    this.categoriesString = "";
    this.selectedCategories = [];
    this.brandsselected = [];
    this.filtersprod.brandId = "";
  }

  onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
      .subscribe((data: Category[]) => {
        this._categoryservice._categoryList = data;
        if (this.filtersprod.categoryId.toString() != "") {
          var categories = this.filtersprod.categoryId.toString().split(",");
          this.categoriesString = "";
          for (let i = 0; i < categories.length; i++) {
            this.searchcategoryselected(data, parseInt(categories[i]))
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  onLoadBrandsList() {
    var filter: brandsFilter = new brandsFilter()
    filter.active = 1;
    this._brandservice.getBrandsList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.brandslist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
        if (this.filtersprod.brandId.toString() != "") {
          var brands = this.filtersprod.brandId.toString().split(",");
          for (let i = 0; i < brands.length; i++) {
            this.brandsselected.push(parseInt(brands[i]));
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  ValidateCheckeds(control, category: Category): void {
    this.categoriesString = "";
    this.filtersprod.categoryId = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if (this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0) {
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filtersprod.categoryId = this.filtersprod.categoryId == "" ? this.selectedCategories[i].data.id : this.filtersprod.categoryId + "," + this.selectedCategories[i].data.id;
      }
    }
  }

  searchcategoryselected(cateorys, id) {
    if (cateorys.filter(x => x.data.id == id).length > 0) {
      this.cont = this.cont + 1;
      var category = cateorys.find(x => x.data.id == id);
      this.selectedCategories.push(category);
      this.categoriesString = this.categoriesString == "" ? category.data.name : this.cont >= 5 ? this.cont + " categorías seleccionadas" : this.categoriesString + ", " + category.data.name;
    } else {
      cateorys.forEach(Category => {
        if (Category.children.length > 0) {
          this.searchcategoryselected(Category.children, id);
        }
      });
    }
  }

  onLoadClassification() {
    var filter: ClassificationFilter = new ClassificationFilter()
    filter.active = 1;
    this._classificationservice.getClassificationbyfilter(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.classificationlist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadPackingTypes() {
    var filter: PackingtypeFilter = new PackingtypeFilter();
    filter.active = 1;
    this._commonservice.getPackingTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.typeslist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

}
