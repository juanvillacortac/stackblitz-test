import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { SelectItem } from 'primeng/api/selectitem';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { SuppliercatalogFilter } from '../../../shared/filters/suppliercatalog-filter';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'suppliercatalog-filter-panel',
  templateUrl: './suppliercatalog-filter-panel.component.html',
  styleUrls: ['./suppliercatalog-filter-panel.component.scss'],
  providers: [DatePipe]

})
export class SuppliercatalogFilterPanelComponent implements OnInit {

  @ViewChild('marca',{static:false})marca:any
  @Input() expanded: boolean = false;
  @Input("filters") filters: SuppliercatalogFilter;
  @Input("loading") loading: boolean = false;
  @Input("supplierstring") supplierstring: string = "";
  @Input("productsuppliercataloglist") productsuppliercataloglist: SupplierCatalog[];
  @Input("_selectedColumns") _selectedColumns: any[];
  @Output("onSearch") onSearch = new EventEmitter<SuppliercatalogFilter>();
  colstable: any[] = [["Nombre", "Categoría", "Tipo de empaque", "Empaque", "Barra", "Estatus", "Ind. Pesado", "Clasificación", "Costo base", "Costo Conversión", "Disponible"]];
  categorylist: any[];
  brandslist: SelectItem[];
  producttypelist: SelectItem[];
  packingTypeslist: SelectItem[];
  SupplierDialogVisible = false;
  submitted: boolean;
  cont: number = 0;
  todos: SelectItem =
    { label: "Todos", value: '-1' };

  status: SelectItem[] = [
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' },
  ];

  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  categoriesString: string;
  _validations: Validations = new Validations();
  items: MenuItem[] = [
    {
      label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
      }
    },
    {
      label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf();
      }
    }
  ];

  constructor(public _categoryservice: CategoryService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {

    this.onLoadCategorys();

    this.onLoadPackingTypes();
    this.onLoadBrandsList();
    this.supplierstring = "";
  }

  search() {
    if (this.filters.name != "" || this.filters.supplierRef != "" || this.filters.active != -2 ||
      this.filters.categoryId != "" || this.filters.idTypePacking != -2 || this.filters.brandId != "" ||
      this.filters.internalRef != "" || this.filters.barcode != "" || this.filters.idsupplier!="") {
     
        this.onSearch.emit(this.filters);
    }
    // this.submitted=true;
    // if(this.supplierstring.trim()){

    //     this.submitted=false;
    // }

  }
  onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
      .subscribe((data: Category[]) => {
        this._categoryservice._categoryList = data;
        if (this.filters.categoryId.toString() != "") {
          var categories = this.filters.categoryId.toString().split(",");
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
        if (this.filters.brandId.toString() != "") {
          var brands = this.filters.brandId.toString().split(",");
          for (let i = 0; i < brands.length; i++) {
            this.brandsselected.push(parseInt(brands[i]));
          }
        }
      }, (error) => {
        console.log(error);
      });
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

  ValidateChecksBrands() {
    debugger;
    
    this.filters.brandId = "";
    if (this.brandsselected.length > 0) {
      for (let i = 0; i < this.brandsselected.length; i++) {
        this.filters.brandId = this.filters.brandId == "" ? this.brandsselected[i] : this.filters.brandId + "," + this.brandsselected[i];
      }
    } else {
      this.brandsselected = [];
    }
  }
  ValidateCheckeds(control, category: Category): void {
    this.categoriesString = "";
    this.filters.categoryId = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if (this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0) {
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filters.categoryId = this.filters.categoryId == "" ? this.selectedCategories[i].data.id : this.filters.categoryId + "," + this.selectedCategories[i].data.id;
      }
    }
  }

  exportPdf() {
    var cols: any[] = [];
    var cols1: any[] = ["Nombre"];
    this._selectedColumns.forEach(col => {
      if (col.field != "name") {
        cols1.push(col.header);
      }
    })
    cols.push(cols1);
    var list = this.productsuppliercataloglist.map(lstItem => {
      var itm: Array<string> = [];
      itm.push(lstItem.name);
      this._selectedColumns.forEach(col => {
        if (col.field == "barra") {
          itm.push(lstItem.barra)
        }
        if (col.field == "typePacking") {
          itm.push(lstItem.typePacking)
        }
        if (col.field == "presentationPacking") {
          itm.push(lstItem.presentationPacking)
        }
        if (col.field == "category") {
          itm.push(lstItem.category)
        }
        if (col.field == "supplierRef") {
          itm.push(lstItem.supplierRef)
        }

        if (col.field == "internalRef") {
          itm.push(lstItem.internalRef)
        }
        if (col.field == "baseCost") {
          itm.push(lstItem.baseCost.toString())
        }
        if (col.field == "conversionCost") {
          itm.push(lstItem.conversionCost.toString())
        }
        if (col.field == "available") {
          itm.push(lstItem.available.toString())
        }
        if (col.field == "commercialReason") {
          itm.push(lstItem.commercialReason.toString())
        }
        if (col.field == "dateCreate") {
          itm.push(this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"))
        }
        if (col.field == "dateUpdate") {
          itm.push(this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy"))
        }
        if (col.field == "active") {
          if (lstItem.active) {
            itm.push("Activo");
          } else {
            itm.push("Inactivo");
          }

        }
        if (col.field == "createdByUser") {
          itm.push(lstItem.createdByUser.toString())
        }
        if (col.field == "updatedByUser") {
          itm.push(lstItem.updatedByUser.toString())
        }
      });
      return itm;
    })

    var doc = new jsPDF('p', 'pt');
    // if (this._selectedColumns.length > 12) {
    doc = new jsPDF('l', 'pt', 'legal');
    // }

    // @ts-ignore
    doc.autoTable({
      head: cols,
      body: list,
      styles: { fontSize: 7 }
    });
    doc.save('productsxsupplier.pdf');
  }

  exportExcel() {
    var list = this.productsuppliercataloglist.map(lstItem => {
      var itm = <any>{};
      itm.Nombre = lstItem.name;
      this._selectedColumns.forEach(col => {
        if (col.field == "barra") {
          itm.Barra = lstItem.barra;
        }
        if (col.field == "active") {
          if (lstItem.active) {
            itm['Estatus'] = "Activo";
          } else {
            itm['Estatus'] = "Inactivo";
          }
        }
        if (col.field == "typePacking") {
          itm['Tipo de empaque'] = lstItem.typePacking;
        }
        if (col.field == "presentationPacking") {
          itm['Empaque'] = lstItem.presentationPacking;
        }
        if (col.field == "internalRef") {
          itm['Ref. interna'] = lstItem.internalRef;
        }
        if (col.field == "supplierRef") {
          itm['Ref. proveedor'] = lstItem.supplierRef;
        }
        if (col.field == "category") {
          itm.Categoría = lstItem.category;
        }
        if (col.field == "baseCost") {
          itm['Costo base'] = lstItem.baseCost;
        }
        if (col.field == "conversionCost") {
          itm['Costo conversión'] = lstItem.conversionCost;
        }
        if (col.field == "available") {
          itm['Disponible'] = lstItem.available;
        }
        if (col.field == "dateCreate") {
          itm['Fecha creación'] = this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy");
        }
        if (col.field == "dateUpdate") {
          itm['Fecha de modificación'] = this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
        }
        if (col.field == "commercialReason") {
          itm['Razón comercial'] = lstItem.commercialReason;
        }

      });
      return itm;
    })
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(list);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "productxsupplier");
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

  onToggleSupplier(visible: boolean) {
    this.SupplierDialogVisible = visible;
  }

  clearFilters() {
    this.supplierstring = "";
    //this.filters.supplierstring= "";
    this.categoriesString = "";
    this.filters.categoryId = "";
    this.filters.brandId = "";
    this.filters.idTypePacking = -2;
    this.filters.barcode = "";
    this.filters.supplierRef = "";
    this.filters.internalRef = "";
    //this.filters.idCom=1;
    this.selectedCategories = [];
    this.brandsselected = [];
    this.filters.active = -2;
    this.filters.brandId = "";
    this.filters.idsupplier = "";
  }
}
