import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { RequestType } from 'src/app/models/tms/requesttype';
import { UseType } from 'src/app/models/tms/usetype';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { UseTypeFilter } from '../../shared/filters/usetype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { MerchandiseRequestFilter } from '../shared/filters/merchandise-request-filter';
import { MerchandiseRequestService } from '../shared/service/merchandise-request.service';

@Component({
  selector: 'app-merchandise-request-filter',
  templateUrl: './merchandise-request-filter.component.html',
  styleUrls: ['./merchandise-request-filter.component.scss'],
  providers: [DatePipe]
})
export class MerchandiseRequestFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : MerchandiseRequestFilter;
  @Input("displayedColumns") displayedColumns : any[];
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<MerchandiseRequestFilter>();

  requestTypeList: SelectItem[] = [];
  useTypeList: SelectItem[] = [];
  branchOfficeList: SelectItem[] =[];
  categoriesList: SelectItem[] =[];

  statusList: SelectItem[] = [];
  
  constructor(private commonTMSservice: CommontmsService,
    private commonService: CommonService,
    private branchOfficeService: BranchofficeService,
    private _categoryservice: CategoryService,
    private merchandiseRequestService: MerchandiseRequestService,
    private datePipe: DatePipe,
    private _Authservice: AuthService) { }

  ngOnInit(): void {
    this.onLoadRequestTypeList();
    this.onLoadUseTypeList();
    this.onLoadCategorys();
    this.onLoadStatusList();
    this.onLoadBranchOfficeList();
  }

  search(){
    
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.requestNumber = "";
    this.filters.demandBranchId = -1;
    this.filters.endDate = null;
    this.filters.startDate = null;
    this.filters.statusId = -1;
    this.filters.requestTypeId = -1;
    this.filters.useTypeId = -1;
    this.filters.categoryId = -1;
  }

  onLoadRequestTypeList(){
    var filter : RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getRequestTypesList(filter)
    .subscribe((data)=>{
      this.requestTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadUseTypeList(){
    var filter : UseTypeFilter = new UseTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getUseTypesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.useTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadBranchOfficeList(){
    var filter : BranchofficeFilter = new BranchofficeFilter();
    filter.active = 1;
    filter.idCompany = this._Authservice.currentCompany;
    this.branchOfficeService.getBranchOfficeList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
      this.branchOfficeList = data.map((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onLoadStatusList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 13;
    this.commonService.getStatus(filter)
    .subscribe((data)=>{
      this.statusList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    let category = new Category();
    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.categoriesList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });

  }

  exportExcel(){
    var list = this.merchandiseRequestService.merchandiseRequestList.map(lstItem=>{
      var itm = <any>{};
      this.displayedColumns.forEach(col => {
        if (col.field == "requestNumber") {
          itm['Número de solicitud'] = lstItem.requestNumber;
        }
        if (col.field == "demandBranch.branchOfficeName") {
          itm['Sucursal demanda'] = lstItem.demandBranch.branchOfficeName;
        }
        if (col.field == "requestType.name") {
          itm['Tipo de solicitud'] = lstItem.requestType.name;
        }
        if (col.field == "useType.name") {
          itm['Tipo de uso'] = lstItem.useType.name;
        }
        if (col.field == "status.name") {
          itm['Estatus'] = lstItem.status.name;
        }
        if (col.field == "associatedDocument") {
          itm['Documento asociado'] = lstItem.associatedDocument;
        }
        if (col.field == "associatedDocumentDate") {
          itm['Fecha documento asociado'] = this.datePipe.transform(lstItem.associatedDocumentDate, 'dd/MM/yyyy') == "01/01/0001" ? "" : this.datePipe.transform(lstItem.associatedDocumentDate, "dd/MM/yyyy");
        }
        if (col.field == "createDate") {
          itm['Fecha de creación'] = this.datePipe.transform(lstItem.createDate, 'dd/MM/yyyy');
        }
      });
      return itm;
    })
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(list);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "listado_solicitudes");
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
