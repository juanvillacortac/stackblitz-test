import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isDate } from 'moment';
import { MenuItem, SelectItem } from 'primeng/api';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { InventoryMovement } from 'src/app/models/ims/inventory-movement';
import { Category } from 'src/app/models/masters-mpc/category';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { InventoryMovementFilter } from '../../shared/filter/inventory-movement-filter';
import { InventoryMovementService } from '../../shared/service/inventory-movement.service';


@Component({
  selector: 'inventory-movement-filter',
  templateUrl: './inventory-movement-filter.component.html',
  styleUrls: ['./inventory-movement-filter.component.scss'],
  providers: [DatePipe]
})
export class InventoryMovementFilterComponent implements OnInit {

  
  @Input() expanded : boolean = false;
  @Input("filters") filters : InventoryMovementFilter;
  @Input("loading") loading : boolean = false;
  @Input("inventorylist") inventorylist : InventoryMovement[];
  @Output("onSearch") onSearch = new EventEmitter<InventoryMovementFilter>();
  @Output() changes = new EventEmitter();

  categorylist: any[];
  statuslist:any[];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  items: MenuItem[]= [
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
    }}
  ];
  selectedCategories: any[] = [];
  categoriesString: string;
  arealist:SelectItem[];
  BrandsString: string;
  supplierstring: string;
  BrandDialogVisible = false;
  SupplierDialogVisible = false;

  heavylist: SelectItem[] = [
    { label: 'Todos', value: '-1' },
    {label: 'Pesados', value:'1'},
    {label: 'No pesados', value: '0'},
  ];
  iDate:Date=new Date();
  fDate:Date=new Date();
  nDate:Date=new Date();
  valid:RegExp = /^[a-zA-Z0-9Á-ú\sñÑ.-]*$/;

  constructor(public _categoryservice: CategoryService, public _areaservice : AreaService,public _commonservice:CommonService,public datepipe:DatePipe ,public _service:InventoryMovementService ,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService) { 
      this._selectorService.setSelectorType(EnumOfficeSelectorType.office)      
    }

  ngOnInit(): void {
    this.onLoadCategorys();
    this.onloadAreas();
    this.onLoadStatusCreationList();
    this.supplierstring="";
  }
  onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
    .subscribe((data: Category[])=>{
      this._categoryservice._categoryList = data;
    },(error)=>{
      console.log(error);
    });
  }
  onloadAreas(){
    var filter=new AreaFilter()
    filter.idBranchOffice=this._authService.currentOffice;
    this._areaservice.getareaList(filter)
    .subscribe((data)=>{
      this.arealist = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }
  onLoadStatusCreationList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 1;
    this._commonservice.getStatus(filter)
    .subscribe((data)=>{
      this.statuslist = data.map((item)=>({
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
    this.filters.initialDate=this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate=this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
    this.onSearch.emit(this.filters);
  }
  ValidateCheckeds(control, category: Category) : void{
    this.categoriesString = "";
    this.filters.idCategory = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0){
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filters.idCategory= this.filters.idCategory == "" ? this.selectedCategories[i].data.id : this.filters.idCategory + "," + this.selectedCategories[i].data.id;
      }
    }
    console.log(this.filters.idCategory)
  }

  onBlurMethod(event: any)
  {
    let dates = new Date(event);
    if(dates > this.fDate)
    {
      this.filters.fDate=dates;
       this.changes.emit(this.filters.fDate);
    }     
  }  
       
  clearFilters(){
    this.filters.id=-1;
    this.filters.idProduct = -1;
    this.filters.gtin="";
    this.filters.product="";
    this.filters.idArea=-1;
    this.filters.idCategory="";
    this.filters.idbrand="";
    this.filters.idsupplier="";
    this.filters.idStatusProduct=1;
    this.filters.indWeigth=-1;
    this.filters.codeBalance="";
    this.filters.internalReferences="";
    this.filters.factoryReferences="";
    this.categoriesString = "";
    this.BrandsString = "";
    this.supplierstring= "";
    this.filters.supplierstring="";
    this.selectedCategories = [];
    this.filters.iDate=new Date();
    this.filters.fDate=new Date();
    this.filters.initialDate=this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate=this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
  }

  exportExcel() {
    var list = this._service._List.map(lstItem=>{
      return {
          Barra:lstItem.gtin,
          Nombre:lstItem.product,
          'Código balanza': lstItem.codeBalance,
          Empaque:lstItem.packet,
          Categoría: lstItem.category,
          Área: lstItem.area,
          Entradas: lstItem.entries,
          Salidas:lstItem.outputs
        }
      })
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(list);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "InventoryMovement");
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
