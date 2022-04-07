import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'jspdf-autotable';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { StatusRequest } from '../../merchandise-request/shared/enum/status-request';
import { MerchandiseRequestFilter } from '../../merchandise-request/shared/filters/merchandise-request-filter';
import { MerchandiseRequestTransferFilter } from '../../merchandise-request/shared/filters/merchandise-request-transfer-filter';
import { MerchandiseRequestService } from '../../merchandise-request/shared/service/merchandise-request.service';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { MerchandiseTransfersService } from '../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-merchandise-request-selection-modal',
  templateUrl: './merchandise-request-selection-modal.component.html',
  styleUrls: ['./merchandise-request-selection-modal.component.scss'],
  providers: [DatePipe]
})
export class MerchandiseRequestSelectionModalComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog")  showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  filters: MerchandiseRequestTransferFilter = new MerchandiseRequestTransferFilter();
  requestTypeList: SelectItem[] = [];
  selectedmerchandiseResquest: MerchandiseRequest[] = [];
  merchandiseResquestList : MerchandiseRequest[] = [];
  branchOfficeList: SelectItem[] = [];
  stringMerchandiseRequestSelected: string = "";

  displayedColumns: ColumnD<MerchandiseRequest>[] =
  [
    { template: (data) => { return data.id; }, header: 'idProductBranchOfficePacking', display: 'none',field:'id' },
    { template: (data) => { return data.requestNumber; }, header: 'Número de la solicitud', display: 'table-cell',field:'requestNumber' },
    { template: (data) => { return data.demandBranch.branchOfficeName; }, header: 'Sucursal demanda', display: 'table-cell',field: 'demandBranch.branchOfficeName' }, 
    { template: (data) => { return data.requestType.name; }, header: 'Tipo de solicitud', display: 'table-cell',field: 'requestType.name' }, 
    { template: (data) => { return this.datePipe.transform(data.createDate, 'dd/MM/yyyy'); }, header: 'Fecha', display: 'table-cell',field: 'createDate' }, 
    { template: (data) => { return data.category.name; }, header: 'Categoría', display: 'table-cell',field: 'category.name' }, 
  ];

  constructor(private branchOfficeService: BranchofficeService,
    private commonTMSservice: CommontmsService,
    public merchandiseRequestService: MerchandiseRequestService,
    private messageService: MessageService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private merchandiseTransferService: MerchandiseTransfersService,
    private router: Router) { }

  ngOnInit(): void {
    this.onLoadBranchOfficeList();
    this.onLoadRequestTypeList();
    
  }

  onShow(){
    this.search();
  }

  onHide(){
    this. showDialog = false;
    this.showDialogChange.emit(this. showDialog);
  }

  search()
  {
    this.loading = true;
    this.filters.dispatchBranchId = parseInt(this.authService.currentOffice);
    /* this.merchandiseRequestFilters.startDateString = this.datePipe.transform(this.merchandiseRequestFilters.startDate, "yyyyMMdd");
    this.merchandiseRequestFilters.endDateString = this.datePipe.transform(this.merchandiseRequestFilters.endDate, "yyyyMMdd"); */
    this.merchandiseRequestService.getMerchandiseRequestTransfer(this.filters).subscribe((data: MerchandiseRequest[]) => {
      var dat: any[] = data;
      this.merchandiseResquestList = dat.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las solicitudes"});
    });
  }

  addRequests()
  { 
    if(this.selectedmerchandiseResquest != null && this.selectedmerchandiseResquest.length > 0){
      this.stringMerchandiseRequestSelected = "";
      this.selectedmerchandiseResquest.forEach(request => {
        this.stringMerchandiseRequestSelected = this.stringMerchandiseRequestSelected == "" ? request.id.toString() : this.stringMerchandiseRequestSelected + "," + request.id.toString();
      });
      this.merchandiseTransferService.InsertMerchandiseTransfersXRequest(this.stringMerchandiseRequestSelected).subscribe((data) => {
        if (data > 0) {
          debugger;
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Transferencia creada con éxito." });
          this.router.navigate(['/tms/merchandise-transfers', data,0]);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al crear la transferencia." });
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al crear la transferencia." });
      });
     
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Seleccione al menos una solicitud para crear la transferencia"});
    }
  }

  clearFilters(){
    this.filters.demandBranchId=-1;
    this.filters.requestTypeId=-1;
    this.filters.requestNumber="";
  }

  onLoadBranchOfficeList() {
    var filter: BranchofficeFilter = new BranchofficeFilter();
    filter.active = 1;
    this.branchOfficeService.getBranchOfficeList(filter)
      .subscribe((data) => {
        this.branchOfficeList = data.map((item) => ({
          label: item.branchOfficeName,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadRequestTypeList() {
    var filter: RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getRequestTypesList(filter)
      .subscribe((data) => {
        this.requestTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
}
