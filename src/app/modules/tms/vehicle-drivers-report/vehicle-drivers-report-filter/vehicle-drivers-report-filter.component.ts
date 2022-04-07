import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { VehicleDriverReportFilter } from 'src/app/models/tms/vehicle-driver-report-filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { CommontmsService } from '../../shared/service/common.service';
import { VehicleDriversReportService } from '../shared/vehicle-drivers-report.service';


@Component({
  selector: 'app-vehicle-drivers-report-filter',
  templateUrl: './vehicle-drivers-report-filter.component.html',
  styleUrls: ['./vehicle-drivers-report-filter.component.scss'],
  providers: [DatePipe]
})
export class VehicleDriversReportFilterComponent implements OnInit {
  @Input() expanded = false;
  @Input("filters") filters:  VehicleDriverReportFilter;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output("search") search = new EventEmitter<VehicleDriverReportFilter>();
  @Output() exportExcel = new EventEmitter();
  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  multiples:boolean=false;
  model:boolean=false;
  flag:boolean=false;
  _showdialog: boolean = false;
  statuslist: SelectItem[];
  Indicators:SelectItem[];
  brandsString: string;
  supplierstring = '';
  brandDialogVisible = false;
  supplierDialogVisible = false;
  startDateFilter: Date = new Date();
  finalDateFilter: Date = new Date();
  maxDate: Date = new Date();
  VehicleModelList: SelectItem[];
  VehicleTypeList: SelectItem[];
  typeDriverList: SelectItem[];
  levellicenseList: SelectItem[];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];

  constructor(
    private Service: VehicleDriversReportService,
    private _httpClient: HttpClient,
    private _areaService: AreaService,
    public _categoryservice: CategoryService ,
    public datepipe: DatePipe ,
    public _commonService: CommonService,
    private readonly loadingService: LoadingService,
    private commonTMSservice: CommontmsService,
    private dialogService: DialogsService
    ) 
    {
      this.statuslist=[
        { label: 'Todos', value: '-1' },
        { label: 'Activo', value: '1'},
        { label: 'Inactivo', value: '0'}
        ];
      this.Indicators=[
        { label: 'Todos', value: '-1' },
        { label: 'Si', value: '1'},
        { label: 'No', value: '0'}
        ];
   }

   _Authservice: AuthService = new AuthService(this._httpClient);
   
  ngOnInit(): void {
   this.loadFilters();
  }

  loadFilters() {

    this.Service.getVehicleModelList()
    .subscribe((data)=>
    {
      this.VehicleModelList = data.map<SelectItem>((item)=>({
        label: item.vehicleModel,
        value: item.id
      }));
      this.VehicleModelList.sort(function(a, b){
        if(a.label < b.label) { return -1; }
        if(a.label > b.label) { return 1; }
        return 0;
    });
    },
    (error)=>
    {
      console.log(error);
    });

    this.Service.getVehicleTypeList()
    .subscribe((data)=>{
      this.VehicleTypeList = data.map<SelectItem>((item)=>({
        label: item.vehicleType,
        value: item.vehicleTypeID
      }));
    },(error)=>{
      console.log(error);
    });

    this.Service.getTypeDriversList()
    .subscribe((data)=>{
      this.typeDriverList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });

    this.Service.getLevelLicenseList()
    .subscribe((data)=>{
      this.levellicenseList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onSearch() {
    debugger
    this.filters.DateOfStart = this.datepipe.transform(this.startDateFilter, 'yyyy-MM-dd');
    this.filters.DateOfEnd = this.datepipe.transform(this.finalDateFilter, 'yyyy-MM-dd');
      this.search.emit(this.filters);
  }
  
  onExportExcel() {
    this.exportExcel.emit();
  }

  showmodal(multples:boolean,models:boolean,flag:boolean=false)
  {    
    this.flag = flag;
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
  }

  onSubmitOperator(data)
  {
    if(!this.flag){
    this.filters.driverID = data.operator.id;
    this.filters.driverName = data.operator.name;
    }
    else{
    this.filters.driverID = data.operator.id;
    this.filters.driverName = data.operator.name;   
    }
  }
  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

  clearFilters() {
    this.filters.vehicleCode = "";
    this.filters.vehicleModelID =-1;
    this.filters.vehicleTypeID  =-1;
    this.filters.vehicleRegistrationPlate ="";
    this.filters.driverID = -1;
    this.filters.driverTypeID = -1;
    this.filters.indDriverLicense = -1;
    this.filters.IndMedicalCertificate = -1;
    this.filters.IndVehicleActive = -1;
    this.filters.LicenseLevelID = -1;
    this.filters.IndDriverActive = -1;
    this.startDateFilter = new Date();
    this.finalDateFilter = new Date();
  }

  
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.product_histories.product_history', error?.error?.message ?? 'error_service');
  }

}
