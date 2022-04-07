import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { StatusTransfer } from '../shared/enum/status-transfer';
import { MerchandiseTransfersFilter } from '../shared/filters/merchandise-transfers-filters';
import { MerchandiseTransfersService } from '../shared/service/merchandise-transfers.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-merchandise-transfers-list',
  templateUrl: './merchandise-transfers-list.component.html',
  styleUrls: ['./merchandise-transfers-list.component.scss'],
  providers: [DatePipe]
})
export class MerchandiseTransfersListComponent implements OnInit {

  idBranchOfficeLogged: number = 0;
  showFilters : boolean = true;
  loading : boolean = false;
  submitted: boolean;
  StatusTransfer = StatusTransfer;
  permissionsIDs = {...Permissions};
  @ViewChild('dt', {static: false})dt: any;

  merchandiseTransferFilters: MerchandiseTransfersFilter = new MerchandiseTransfersFilter();

  displayedColumnsTransfers: ColumnD<MerchandiseTransfers>[] =
  [
    {template: (data) => { return data.idTransfer; },field: 'idTransfer', header: 'Id', display: 'table-cell'},
   {template: (data) => { return data.originBranch.branchOfficeName; },field: 'originBranch.branchOfficeName', header: 'Sucursal origen', display: 'table-cell'},
   {template: (data) => { return data.originArea.name; },field: 'originArea.name', header: 'Área origen', display: 'table-cell'},
   {template: (data) => { return data.createByUser; },field: 'createByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.createDate; },field: 'createDate', header: 'Fecha de creación', display: 'table-cell'},
  ];

  displayedColumnsBranchTransfers: ColumnD<MerchandiseBranchTransfers>[] =
  [
    {template: (data) => { return data.transfersNumber; },field: 'transfersNumber', header: 'Número de transferencia', display: 'table-cell'},
   {template: (data) => { return data.destinationBranch.branchOfficeName; },field: 'destinationBranch.branchOfficeName', header: 'Sucursal destino', display: 'table-cell'},
   {template: (data) => { return data.destinityArea.name; },field: 'destinityArea.name', header: 'Área destino', display: 'table-cell'},
   {template: (data) => { return data.status.name; },field: 'status.name', header: 'Estatus', display: 'table-cell'},
  ];

  constructor(private datePipe: DatePipe,
    public breadcrumbService: BreadcrumbService,
    public merchandiseTransfersService: MerchandiseTransfersService,
    private messageService: MessageService,
    private router: Router,
    private _Authservice: AuthService,
    public userPermissions: UserPermissions) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'TMS' },
        { label: 'Transferencias de mercancía', routerLink: ['/tms/merchandise-transfers-list'] }
      ]);
    }

  ngOnInit(): void {
    this.idBranchOfficeLogged = this._Authservice.currentOffice;
    this.merchandiseTransferFilters.destinationBranchId = this._Authservice.currentOffice;
    //this.merchandiseTransferFilters.originBranchId = this._Authservice.currentOffice;
    this.searchMerchandiseTransfers();
  }
  
  clickSearch(){
    this.searchMerchandiseTransfers();
  }

  onEdit(transfer: MerchandiseTransfers){
    this.router.navigate(['/tms/merchandise-transfers', transfer.idTransfer,0]);
  }

  onEditBranchTransfer(branchTransfer: MerchandiseBranchTransfers, idTransfer: number){
    this.router.navigate(['/tms/merchandise-transfers', idTransfer, branchTransfer.idBranchTransfer]);
  }

  searchMerchandiseTransfers(){
    debugger
    this.loading = true;
    if (this.dt != undefined) {
      this.dt.first=0;
    }
    this.merchandiseTransferFilters.startDateString = this.datePipe.transform(this.merchandiseTransferFilters.startDate, "yyyyMMdd");
    this.merchandiseTransferFilters.endDateString = this.datePipe.transform(this.merchandiseTransferFilters.endDate, "yyyyMMdd");
    this.merchandiseTransfersService.getMerchandiseTransfersList(this.merchandiseTransferFilters).subscribe((data: MerchandiseTransfers[]) => {
      
      data.forEach(transfer => {
        if (transfer.branchTransfer != null) {
          if (transfer.branchTransfer.filter(x => x.status.id == StatusTransfer.EXECUTION || x.status.id == StatusTransfer.ERASER).length > 0) {
            transfer.edit = false;
          }
          if (transfer.branchTransfer.filter(x => x.status.id == StatusTransfer.SENT || x.status.id == StatusTransfer.FINALIZED || x.status.id == StatusTransfer.RECEIVED).length > 0) {
            transfer.edit = true;
          }
        }
      });
      this.merchandiseTransfersService.merchandiseTransfersList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las transferencias"});
    });
  }

  getBranchTransfers(idTransfer: number){

  }

  
  printMerchadiseTransfer(idBranchTransfer: number) {

    this.router.navigate(['/tms/printed-report', idBranchTransfer]);

    // this.telerikReportModalComponent.param1 = idBranchTransfer
    // this.telerikReportModalComponent.reloadViewer(idBranchTransfer) 
    // this.telerikReportModalComponent.name = "Reporte de Transferencias"
    // this.telerikReportModalComponent.visible = true
    
  }

}
