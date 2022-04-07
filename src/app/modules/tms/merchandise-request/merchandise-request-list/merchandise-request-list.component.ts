import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MerchandiseRequestFilter } from '../shared/filters/merchandise-request-filter';
import { MerchandiseRequestService } from '../shared/service/merchandise-request.service';

@Component({
  selector: 'app-merchandise-request-list',
  templateUrl: './merchandise-request-list.component.html',
  styleUrls: ['./merchandise-request-list.component.scss'],
  providers: [DatePipe]
})
export class MerchandiseRequestListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  @ViewChild('dt', {static: false})dt: any;

  merchandiseRequestFilters: MerchandiseRequestFilter = new MerchandiseRequestFilter();

  displayedColumns: ColumnD<MerchandiseRequest>[] =
  [
   {template: (data) => { return data.requestNumber; },field: 'requestNumber', header: 'Número de solicitud', display: 'table-cell'},
   {template: (data) => { return data.demandBranch.branchOfficeName; },field: 'demandBranch.branchOfficeName', header: 'Sucursal demanda', display: 'table-cell'},
   {template: (data) => { return data.requestType.name; },field: 'requestType.name', header: 'Tipo de solicitud', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.useType.name; },field: 'useType.name', header: 'Tipo de uso', display: 'table-cell'},
   {template: (data) => { return data.status.name; },field: 'status.name', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.associatedDocument; },field: 'associatedDocument', header: 'Documento asociado', display: 'table-cell'},
   {template: (data) => { return this.datePipe.transform(data.associatedDocumentDate, "dd/MM/yyyy") == "01/01/1900" ? '' : this.datePipe.transform(data.associatedDocumentDate, "dd/MM/yyyy") == "01/01/0001" ? "" : this.datePipe.transform(data.associatedDocumentDate, "dd/MM/yyyy"); },field: 'associatedDocumentDate', header: 'Fecha documento asociado', display: 'table-cell'},
   {template: (data) => { return this.datePipe.transform(data.createDate, "dd/MM/yyyy"); },field: 'createDate', header: 'Fecha de creación', display: 'table-cell'},
   ];

  constructor(public breadcrumbService: BreadcrumbService,
    public merchandiseRequestService: MerchandiseRequestService,
    private messageService: MessageService,
    private _Authservice: AuthService,
    private router: Router,
    private datePipe: DatePipe) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Solicitudes de mercancía', routerLink: ['/tms/merchandise-request-list'] }
    ]);
   }

  ngOnInit(): void {
    this.merchandiseRequestFilters.demandBranchId = this._Authservice.currentOffice;    
    this.searchMerchandiseRequest();
  }

  openNew(){

    this.router.navigate(['/tms/merchandise-request', 0,1]);
  }

  clickSearch(){
    this.searchMerchandiseRequest();
  }

  onEdit(request: MerchandiseRequest){
    this.router.navigate(['/tms/merchandise-request', request.id,1]);
  }

  searchMerchandiseRequest(){
    this.loading = true;
    if (this.dt != undefined) {
      this.dt.first=0;
    }
    this.merchandiseRequestFilters.startDateString = this.datePipe.transform(this.merchandiseRequestFilters.startDate, "yyyyMMdd");
    this.merchandiseRequestFilters.endDateString = this.datePipe.transform(this.merchandiseRequestFilters.endDate, "yyyyMMdd");
    this.merchandiseRequestService.getMerchandiseRequestList(this.merchandiseRequestFilters).subscribe((data: MerchandiseRequest[]) => {
      this.merchandiseRequestService.merchandiseRequestList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las solicitudes"});
    });
  }
}
