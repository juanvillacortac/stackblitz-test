import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getDate } from 'date-fns';
import { MenuItem, SelectItem } from 'primeng/api';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { Category } from 'src/app/models/masters-mpc/category';
import { UserModalListComponent } from 'src/app/modules/common/components/user-modal-list/user-modal-list.component';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { NewIndicatorsComponent } from 'src/app/modules/products/product-branch-office/product-brach-office-indicators/new-indicators/new-indicators.component';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';

@Component({
  selector: 'inventory-count-filter',
  templateUrl: './inventory-count-filter.component.html',
  styleUrls: ['./inventory-count-filter.component.scss']
})
export class InventoryCountFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : InventoryCountFilter;
  @Input("_conteo")  _conteo : InventoryCount;
  @Input("loading") loading : boolean = false;
  @Input("inventorylist") inventorylist : InventoryCount[];
  @Output("onSearch") onSearch = new EventEmitter<InventoryCountFilter>();
  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();
  @Output() changes = new EventEmitter();
  @ViewChild(UserModalListComponent) operatorDialog: UserModalListComponent;

  multiples:boolean=false;
  model:boolean=false;
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
  arealist:SelectItem[];
  iDate:Date=new Date();
  fDate:Date=new Date();
  nDate:Date=new Date();
  _OperatorsString: string="";
  OperatorDialogVisible = false;
  valid:RegExp = /^[a-zA-Z0-9Á-ú\sñÑ.-]*$/;
  _showdialog: boolean = false;

  constructor(public _areaservice : AreaService,public _commonservice:CommonService,public _categoryservice: CategoryService,public datepipe:DatePipe ,public _service:InventorycountService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService) { 
      this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
    }

  ngOnInit(): void {
    this.loading = false;
    this.onloadAreas();
    this.onLoadStatusList();
    this.onloadCategorys();
  }

  onloadAreas(){
    var filterarea= new AreaFilter();
    filterarea.idBranchOffice=this._authService.currentOffice;
    this._areaservice.getareaList(filterarea)
    .subscribe((data)=>{
      this.arealist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }
  onLoadStatusList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 3;
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

  onloadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory=0;
    var category=new Category();
    category.id=-1;
    category.name="Todas";
    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name))
        let filterArray = [{ ...category }, ...data];
        this.categorylist = filterArray.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));  
    },(error)=>{
      console.log(error);
    });
  }
  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }
  search(){
    this.filters.initialDate=this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate=this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
    this.onSearch.emit(this.filters);
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
    this.filters.idArea = -1;
    this.filters.idStatus=-1;
    this.filters.idCategory=-2;
    this.filters.idOperator=-1;
    this.filters.numberDocument="";
    this.filters.description="";
    this._OperatorsString= "";
    this.filters.operatorsString="";
    this.filters.iDate=new Date();
    this.filters.fDate=new Date();
    this.filters.initialDate=this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate=this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
  }

  exportExcel() {
    let datexport=this.datepipe.transform(new Date(),"dd-MM-yyyy");
    var list = this._service._List.map(lstItem=>{
      return {
          'Número documento':lstItem.numberDocument,
          Área:lstItem.area,
          Descripción: lstItem.description,
          Estatus:lstItem.status,
          Responsable: lstItem.responsibleUser,
          'Fecha de conteo': this.datepipe.transform(lstItem.inicialDate,"dd/MM/yyy"),
          Productos:lstItem.count
        }
      })
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(list);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "Listado de conteos "+ datexport);
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

  onSubmitOperator(data)
  {
    this.filters.operator=data.operator;
    this.filters.idOperator=data.operator.id;
    this.filters.operatorsString=data.operator.name;
      
  }

  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

}
