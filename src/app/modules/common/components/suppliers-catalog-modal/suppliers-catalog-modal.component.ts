import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TabPanel } from 'primeng/tabview';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierCatalogExpressDetail } from 'src/app/models/common/supplier-catalog-express-detail';
import { SupplierCatalogModal } from 'src/app/models/common/supplier-catalog-modal';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { SuppliercatalogFilter } from 'src/app/modules/srm/shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from 'src/app/modules/srm/shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierCatalog } from 'src/app/modules/srm/shared/view-models/supplier-catalog.viewmodel';

@Component({
  selector: 'suppliers-catalog-modal',
  templateUrl: './suppliers-catalog-modal.component.html',
  styleUrls: ['./suppliers-catalog-modal.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class SuppliersCatalogModalComponent implements OnInit {

  @Input("visible") visible : boolean = false;
  @Input("supplierstring") supplierstring: string = "";
  @Output("onSubmit") onSubmit = new EventEmitter<{supplier: SupplierCatalogModal[], identifier: number}>();
  @Output("StringChange") StringChange = new EventEmitter<SupplierCatalogModal[]>();
  @ViewChild('ClickEditable') ClickEditable: ElementRef<HTMLElement>;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("idCompany") idCompany:number;
  @Input("idbranchOffice") idbranchOffice:number;
  @Input("_idSupplier") _idSupplier:number;
  @ViewChild('dtsp') dtsp: Table;
  @ViewChild('dtsl') dtsl: Table;
  @ViewChild('bsearch') bsearch:TabPanel
  loading : boolean = false;
  submitted:boolean=false;
  submitted1:boolean=false;
  activeIndexsu:number=0;
  identifierToEdit: number = -1;
  selectedsupplier : any[] = []; 
  addselectedsuppliers: any[] = []; 
  addselectedsuppliersaux: any[] = [];
  _supplierlistaux: SupplierCatalogModal[]=[];
  _supplier:SupplierCatalogModal;
  filters:  SuppliercatalogFilter=new  SuppliercatalogFilter;
  _validations: Validations = new Validations();
  branchOffice:number;
  categorylist: any[];
  brandslist: SelectItem[];
  categoriesString: string;
  producttypelist: SelectItem[];
  packingTypeslist: SelectItem[];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  cont: number = 0;
  todos: SelectItem =
  { label: "Todos", value: '-1' };
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  clonedsuppliercatalog: { [s: string]: SupplierCatalogExpressDetail; } = {};
  clonedDetail: SupplierCatalogExpressDetail[] = [];
  quantitypackageheavy:number=0
  quantitypackage:number=0
  quantityunitheavy:number=0
  quantityunit:number=0;
  quantintyproductHeavy:number=0;
  quantityproduct:number=0;
  convertioncostheavy:number=0;
  convertioncost:number=0;
  basecostheavy:number=0;
  basecost:number=0;
  tabdefault:boolean=true;
  tabselected: boolean = false;


  displayedColumns:ColumnD<SupplierCatalogModal>[] = 
  [
    {template: (data) => { return data.idProductSupplier; },field: 'idProductSupplier', header: 'idProductSupplier', display: 'none'},
    {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
    {template: (data) => { return data.barra; },field: 'barra', header: 'Barra', display: 'table-cell'},
    {template: (data) => { return data.supplierRef; },field: 'supplierRef', header: 'Ref. proveedor', display: 'table-cell'},
    {template: (data) => { return data.internalRef; },field: 'internalRef', header: 'Ref. interna', display: 'table-cell'},
    {template: (data) => { return data.category; },field: 'category', header: 'Categoría', display: 'table-cell'},
    // {template: (data) => { return data.unitMeasure; },field: 'unitMeasure', header: 'Unidad de medida', display: 'table-cell'},
    //  {field: 'active', header: 'Estatus', display: 'table-cell'},      
  ];


  displayedColumnsDetail:ColumnD<SupplierCatalogExpressDetail>[] = 
  [
    {template: (data) => { return data.idProductSupplier; },field: 'idProductSupplier', header: 'idProductSupplier', display: 'none'},
    {template: (data) => { return data.idPacking; },field: 'idPacking', header: 'idPacking', display: 'none'},
    {template: (data) => { return data.typePacking; },field: 'typePacking', header: 'Tipo de empaque', display: 'table-cell'},
    {template: (data) => { return data.presentationPacking; },field: 'presentationPacking', header: 'Empaque', display: 'table-cell'},
    {template: (data) => { return data.unitPerPackaging; },field: 'unitPerPackaging', header: 'Número de unidades', display: 'table-cell'},
    {template: (data) => { if (data.indHeavy==true) return data.available.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); else return data.available.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) }, header: 'Emp. disponibles', display: 'table-cell',field: 'available' },    
    {template: (data) => { if (data.indHeavy==true) return (data.unitAvailable=data.available*data.unitPerPackaging).toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); else return (data.unitAvailable=data.available*data.unitPerPackaging).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}, header: 'Unds. disponibles', display: 'table-cell',field: 'UnitAvailable' } , 
    {template: (data) => { return data.baseCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); },field: 'baseCost', header: 'Costo base', display: 'table-cell'},
    {template: (data) => { return data.conversionCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); },field: 'conversionCost', header: 'Costo conversión', display: 'table-cell'},   
    // {template: (data) => { return  this.decimalPipe.transform(data.quantity) }, header: 'Cantidad', field: 'quantity', display: 'table-cell' },
    // {template: (data) => { return  this.decimalPipe.transform(data.quantityTotal) }, header: 'Total', field: 'quantityTotal', display: 'table-cell' },
    // {template: (data) => { return this.decimalPipe.transform(data.baseCostActual, '.2'); },field: 'baseCostActual', header: 'Costo base total', display: 'table-cell'},
    // {template: (data) => { return this.decimalPipe.transform(data.conversionCostActual, '.2'); },field: 'conversionCostActual', header: 'Costo conversión total', display: 'table-cell'},   
  ];

  constructor(
    public _categoryservice: CategoryService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    public datepipe: DatePipe ,
    private decimalPipe: DecimalPipe,
    public  _service: SuppliercatalogService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.selectedsupplier=[];
    this.addselectedsuppliers=[]; 
    this._supplierlistaux=[];
    this.addselectedsuppliersaux=[];
    this.activeIndexsu=0;
  }

  onShow(){
    this.activeIndexsu=0;
    this.submitted=false;
    //this.bsearch.selected=true;
    this.selectedsupplier=[];
    this.addselectedsuppliers=[]; 
    this.addselectedsuppliersaux=[];
    this._supplierlistaux=[];
    this._service._SupplierCatalogExpressList=[];
    this.onLoadCategorys();
    this.onLoadPackingTypes();
    this.onLoadBrandsList();
    this.supplierstring = "";
    this.emitVisible();  
    this.ngOnInit();
  }

  onHide()
  {
    this.submitted=false;
    this.dtsp.reset();
    this.emitVisible();
    this.filters=new SuppliercatalogFilter ();
    this._service._SupplierCatalogList=[];
    this.identifierToEdit = -1;
    this.selectedsupplier=[];
    this.addselectedsuppliers=[]; 
    this.addselectedsuppliersaux=[];
    this._service._SupplierCatalogExpressList=[];
    this._supplierlistaux=[];
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }
  load(){
    this.loading = true;
    this.filters.active=1;
    this.filters.idCom=this.idCompany;
    if(this._idSupplier <0)
      this.filters.idsupplier="";
    else
       this.filters.idsupplier=this._idSupplier.toString();

    this._service.getSupplierCatalogExpressfilter(this.filters).subscribe((data: SupplierCatalogModal[]) => {
      this._service._SupplierCatalogExpressList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  submitVarious()
  { 
    let cont = 0;
    this.submitted1=true;
    if(this.addselectedsuppliers.length >0)
    {  
       for (let i = 0; i < this.addselectedsuppliers.length; i++)
       {
        cont += 1;
        this._supplierlistaux.push(this.addselectedsuppliers[i]);             
       }  
       this.onSubmit.emit({
        supplier: this._supplierlistaux,
        identifier: this.identifierToEdit
       });
       this.selectedsupplier=[]; 
       this.addselectedsuppliers=[]; 
       this._supplierlistaux=[];
       this.activeIndexsu=0;
       this.visible = false;
       this.submitted1=false;
       this.emitVisible();
    }
  }

  search()
  {    
     this.load();  
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
  CalculateEntriesOutpouts(event) {}
  CalculatequantityTable(event, orders: SupplierCatalogExpressDetail) {
    if(event.value != ""){
      var quantity =  event.value;
      if (quantity != null) {
         orders.quantityTotal=quantity*orders.unitPerPackaging;
         orders.conversionCostActual=quantity*orders.conversionCost;
         orders.baseCostActual=quantity*orders.baseCost;
      } else {
        orders.quantityTotal=0;
        orders.conversionCostActual=0;
        orders.baseCostActual=0;
      }    
    }else
    {
        event.value =  orders.indHeavy == true ? "0,000" : "0";
        orders.quantityTotal=0;
        orders.conversionCostActual=0;
        orders.baseCostActual=0;
    }

  }
  CalculatetotalTable(event, orders: SupplierCatalogExpressDetail)
  {
    if(event.value != ""){
      var quantity = event.value;
      if (quantity != null) {
         orders.quantity=quantity/orders.unitPerPackaging;
         orders.conversionCostActual=orders.quantity*orders.conversionCost;
         orders.baseCostActual=orders.quantity*orders.baseCost;
      } else {
        orders.quantity=0;
        orders.conversionCostActual=0;
        orders.baseCostActual=0;
      }    
    }else
    {
        event.value =  orders.indHeavy == true ? "0,000" : "0";
        orders.quantity=0;
        orders.conversionCostActual=0;
        orders.baseCostActual=0;
    }
  }
  clear(event) {
    if (event.target.value == "0,000") {
      event.target.value = "";
    }
  }

  triggerFalseClick(orders: SupplierCatalogExpressDetail) {
    this.onRowEditSave(orders);
  }
  onRowEditInit(orders: SupplierCatalogExpressDetail) {
    
    this.clonedDetail= [];
    var Detail = new SupplierCatalogExpressDetail();
    Detail.quantity = orders.quantity;
    this.clonedDetail.push(Detail);
    this.clonedsuppliercatalog[orders.idProductSupplier] = { ...orders };
  }

  onRowEditSave(orders: SupplierCatalogExpressDetail) {   
    if(orders.quantity != null)
    {    
      let objIndex = this._service._SupplierCatalogExpressList.findIndex((obj => obj.detail.findIndex(x=>x.idProductSupplier== orders.idProductSupplier)));
      this._service._SupplierCatalogExpressList[objIndex].detail[0].quantity = this.clonedDetail[0].quantity;
      this._service._SupplierCatalogExpressList[objIndex].detail[0].quantityTotal=  this.clonedDetail[0].quantityTotal;
      this._service._SupplierCatalogExpressList[objIndex].detail[0].baseCostActual= this.clonedDetail[0].baseCostActual;
      this._service._SupplierCatalogExpressList[objIndex].detail[0].conversionCostActual=  this.clonedDetail[0].conversionCostActual;
      if(orders.indHeavy)
      {
        this.quantitypackageheavy=this.quantitypackageheavy+orders.quantity;
        this.quantityunitheavy=this.quantityunitheavy+orders.quantityTotal;
        this.quantintyproductHeavy=this.quantintyproductHeavy+1;
        this.basecostheavy= this.basecostheavy+orders.baseCost;
        this.convertioncostheavy=this.convertioncostheavy+orders.conversionCostActual;
      }
      else
      {
        this.quantitypackage=this.quantitypackage+orders.quantity;
        this.quantityunit=this.quantityunit+orders.quantityTotal;
        this.quantityproduct=this.quantityproduct+1;
        this.basecost= this.basecost+orders.baseCost;
        this.convertioncost=this.convertioncost+orders.conversionCostActual;
      }
    }else
    {     
      orders.quantity = this.clonedDetail[0].quantity;
      orders.quantityTotal = this.clonedDetail[0].quantityTotal;
      orders.conversionCostActual = this.clonedDetail[0].conversionCostActual;
      orders.baseCostActual = this.clonedDetail[0].baseCostActual;

    }

  }
  onRowEditCancel(orders: SupplierCatalogExpressDetail) {
    let objIndex = this._service._SupplierCatalogExpressList.findIndex((obj => obj.detail.findIndex(x=>x.idProductSupplier== orders.idProductSupplier)));
    this._service._SupplierCatalogExpressList[objIndex].detail[0].quantity = this.clonedDetail[0].quantity;
    this._service._SupplierCatalogExpressList[objIndex].detail[0].quantityTotal=  this.clonedDetail[0].quantityTotal;
  }

  add()
  {
     this.submitted=true;
     let cont=0
     if(this.selectedsupplier.length !=0)
     {
      for (let i = 0; i < this.selectedsupplier.length; i++)
      {
        cont += 1;
        this._supplier=new SupplierCatalogModal();
        this._supplier.idProductSupplier=this.selectedsupplier[i].idProductSupplier;
        this._supplier.idProduct=this.selectedsupplier[i].idProduct;
        this._supplier.name=this.selectedsupplier[i].name;
        this._supplier.barra=this.selectedsupplier[i].barra;
        this._supplier.internalRef=this.selectedsupplier[i].internalRef;
        this._supplier.supplierRef=this.selectedsupplier[i].supplierRef;
        this._supplier.idCategory=this.selectedsupplier[i].idCategory;
        this._supplier.category=this.selectedsupplier[i].category;
        this._supplier.idUnityMeasurePresentation=this.selectedsupplier[i].idUnityMeasurePresentation;
        this._supplier.unitMeasure=this.selectedsupplier[i].unitMeasure;
        this._supplier.idCom=this.selectedsupplier[i].idCom;
        this._supplier.idSupplier=this.selectedsupplier[i].idSupplier;
        this._supplier.indHeavy=this.selectedsupplier[i].indHeavy;
        this._supplier.detail=this.selectedsupplier[i].detail;
        if(this.addselectedsuppliers.findIndex(x=>x.idProductSupplier==this.selectedsupplier[i].idProductSupplier)==-1)
        {           
            this.addselectedsuppliersaux.push(this._supplier);
            this.dtsl.reset();
            this.addselectedsuppliers= this.addselectedsuppliersaux;      
            if(this._supplier.indHeavy){
              //this.quantitypackageheavy=this.quantitypackageheavy+orders.quantity;
              //this.quantityunitheavy=this.quantityunitheavy+orders.quantityTotal;
              this.quantintyproductHeavy=this.quantintyproductHeavy+1;
              this.basecostheavy= this.basecostheavy+this._supplier.detail[0].baseCost;
              this.convertioncostheavy=this.convertioncostheavy+this._supplier.detail[0].conversionCost;
            }
            else{
              //this.quantitypackage=this.quantitypackage+orders.quantity;
              //this.quantityunit=this.quantityunit+orders.quantityTotal;
              this.quantityproduct=this.quantityproduct+1;
              this.basecost= this.basecost+this._supplier.detail[0].baseCost;
              this.convertioncost=this.convertioncost+this._supplier.detail[0].conversionCost;
            }
        }   
      }
      this.tabselected = true;
      this.tabdefault=false;
      this.activeIndexsu=1;
    }
     
  }
  handleChange(e) {
    var index = e.index;
    if(index==1)
    { 
    }
    else
    {}  
 }
 removeselected(supplier: SupplierCatalogModal) {
  if (supplier.idProductSupplier != 0) 
  {
     this.addselectedsuppliersaux=this.addselectedsuppliersaux.filter(x =>x!= supplier);
     this.addselectedsuppliers = this.addselectedsuppliers.filter(x =>x!= supplier);
   
     if(supplier.indHeavy){
      //this.quantitypackageheavy=this.quantitypackageheavy+orders.quantity;
      //this.quantityunitheavy=this.quantityunitheavy+orders.quantityTotal;
      this.quantintyproductHeavy=this.quantintyproductHeavy-1;
      this.basecostheavy= this.basecostheavy-supplier.detail[0].baseCost;
      this.convertioncostheavy=this.convertioncostheavy-supplier.detail[0].conversionCost;
    }
    else{
      //this.quantitypackage=this.quantitypackage+orders.quantity;
      //this.quantityunit=this.quantityunit+orders.quantityTotal;
      this.quantityproduct=this.quantityproduct-1;
      this.basecost= this.basecost-supplier.detail[0].baseCost;
      this.convertioncost=this.convertioncost-supplier.detail[0].conversionCost;
    }
  }
}
}
