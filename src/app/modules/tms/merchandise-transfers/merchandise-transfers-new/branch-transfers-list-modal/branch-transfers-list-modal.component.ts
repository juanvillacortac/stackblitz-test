import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersTransport } from 'src/app/models/tms/merchandisebranchtransferstransport';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { StatusTransfer } from '../../shared/enum/status-transfer';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-branch-transfers-list-modal',
  templateUrl: './branch-transfers-list-modal.component.html',
  styleUrls: ['./branch-transfers-list-modal.component.scss'],
  providers: [DatePipe]
})
export class BranchTransfersListModalComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog")  showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("branchTransferList") branchTransferList: MerchandiseBranchTransfers[] = [];
  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers = new MerchandiseTransfers();
  @Output("refreshBranchTransfer") refreshBranchTransfer = new EventEmitter();
  @Output("refreshTransfer") refreshTransfer = new EventEmitter();
  showDialogAdditionalData: boolean = false;
  merchandiseBranchTransfer: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  edit: boolean = false;
  idBranchOfficeLogged: number = 0;
  statusTrasfer = StatusTransfer;

  displayedColumns: ColumnD<MerchandiseBranchTransfers>[] =
    [
      { template: (data) => { return data.idBranchTransfer; }, header: 'idBranchTransfer', display: 'none',field:'id' },
      { template: (data) => { return data.transfersNumber; }, header: 'Número de transferencia', display: 'table-cell',field:'idProduct' },
      { template: (data) => { return data.destinationBranch.branchOfficeName; }, header: 'Sucursal destino', display: 'table-cell',field: 'destinationBranch.branchOfficeName' },
      { template: (data) => { return data.controlNumber; }, header: 'Número de control', display: 'table-cell',field: 'controlNumber.branchOfficeName' }, 
      { template: (data) => { return data.transportGuideNumber; }, header: 'Número de guía', display: 'table-cell',field: 'transportGuideNumber.branchOfficeName' }, 
    ];
  
    displayedColumnsAdditionalData: ColumnD<MerchandiseBranchTransfersTransport>[] =
    [
      { template: (data) => { return data.idBranchTransferTransport; }, header: 'idBranchTransferTransport', display: 'none',field:'id' },
      { template: (data) => { return data.vehicle.vehicleCode; }, header: 'Vehículo', display: 'table-cell',field:'vehicle.vehicleCode' },
      { template: (data) => { return data.vehicle.vehicleRegistrationPlate; }, header: 'Placa', display: 'table-cell',field:'vehicle.vehicleRegistrationPlate' },
      { template: (data) => { return data.vehicle.vehicleDriver; }, header: 'Conductor principal', display: 'table-cell',field:'vehicle.vehicleDriver' },
      { template: (data) => { return this.datePipe.transform(data.departureDate, 'dd/MM/yyyy'); }, header: 'Fecha de salida', display: 'table-cell',field:'departureDate' },
      { template: (data) => { return this.datePipe.transform(data.entryDate, 'dd/MM/yyyy'); }, header: 'Fecha de entrada', display: 'table-cell',field:'entryDate' },
    ];
  constructor(private confirmationService: ConfirmationService,
    public merchandiseTranferService: MerchandiseTransfersService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private _Authservice: AuthService) { }

  ngOnInit(): void {
  }

  onShow(){
    this.idBranchOfficeLogged = this._Authservice.currentOffice;
  }

  onHide(){
    this. showDialog = false;
    this.showDialogChange.emit(this. showDialog);
  }

  onAddAdditionalData(branchTransfer: MerchandiseBranchTransfers){
    this.merchandiseBranchTransfer = branchTransfer;
    this.edit = false;
    this.showDialogAdditionalData = true;
  }

  onEditAdditionalData(branchTransfer: MerchandiseBranchTransfers){
    this.merchandiseBranchTransfer = {...branchTransfer};
    this.edit = true;
    this.showDialogAdditionalData = true;
  }

  onDeleteAdditionalData(additionalData: MerchandiseBranchTransfersTransport, branchTransfer: MerchandiseBranchTransfers){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Este vehículo será eliminado. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.DeleteMerchandiseTrasnferTransport(additionalData.idBranchTransferTransport).subscribe((resp: DatabaseResult) => {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Vehículo eliminado con éxito" });
          branchTransfer.additionalData = branchTransfer.additionalData.filter(x => x.idBranchTransferTransport != additionalData.idBranchTransferTransport);
          
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la transferencia" });
        });
        //this.insertMerchandiseRequest();
        //this.requestTypeList = this.requestTypeList.filter(x => x.value != 1);
      },
      reject: (type) => {
      }
    })
  }

  refreshBranchTransferList(){
    this.refreshBranchTransfer.emit();
    this.refreshTransfer.emit();
  }
}
