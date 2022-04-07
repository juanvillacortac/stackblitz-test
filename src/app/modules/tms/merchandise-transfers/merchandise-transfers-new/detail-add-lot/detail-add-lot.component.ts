import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isThisISOWeek } from 'date-fns';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Lot } from 'src/app/models/tms/lot';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseBranchTransfersDetailLot } from 'src/app/models/tms/merchandisebranchtransfersdetaillot';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { LotFilter } from '../../../shared/filters/lot-filter';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-detail-add-lot',
  templateUrl: './detail-add-lot.component.html',
  styleUrls: ['./detail-add-lot.component.scss'],
  providers: [DatePipe]
})
export class DetailAddLotComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog") showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("merchandiseBranchTransferDetail") merchandiseBranchTransferDetail: MerchandiseBranchTransfersDetail = new MerchandiseBranchTransfersDetail();
  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers = new MerchandiseTransfers();
  submitted: boolean = false;
  amountSent: number = 0;
  lot: MerchandiseBranchTransfersDetailLot = new MerchandiseBranchTransfersDetailLot();
  lotList: SelectItem[] = [];
  expirationDate: string = "";

  displayedColumns: ColumnD<MerchandiseBranchTransfersDetailLot>[] =
    [
      { template: (data) => { return data.packingProduct.product.barcode; }, header: 'Barra', display: 'table-cell', field: 'packingProduct.product.barcode' },
      { template: (data) => { return data.packingProduct.product.name; }, header: 'Nombre', display: 'table-cell', field: 'packingProduct.product.name' },
      { template: (data) => { return data.lot.lotNumber; }, header: 'Número de lote', display: 'table-cell', field: 'lot.lotNumber' },
      { template: (data) => { return data.lot.expirationDateString }, header: 'Fecha de vencimiento', display: 'table-cell', field: 'lot.expirationDateString' },
      { template: (data) => { return data.numberUnitsShipped; }, header: 'Cantidad', display: 'table-cell', field: 'numberUnitsShipped' },
    ];

  constructor(private confirmationService: ConfirmationService,
    public merchandiseTranferService: MerchandiseTransfersService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  onShow() {
    this.getLots();
    this.amountSent = this.merchandiseBranchTransferDetail.amountSent;
    if (this.merchandiseBranchTransferDetail.branchTransferDetailLot != null && this.merchandiseBranchTransferDetail.branchTransferDetailLot.length > 0) {
      this.merchandiseBranchTransferDetail.branchTransferDetailLot.forEach(lot => {
        this.amountSent = this.amountSent - lot.numberUnitsShipped;
        lot.packingProduct = this.merchandiseBranchTransferDetail.packingProduct;
        lot.lot.expirationDateString = this.datePipe.transform(lot.lot.expirationDate, "dd/MM/yyyy")
      });
    }
  }

  onHide() {
    this.showDialog = false;
    this.submitted = false;
    this.expirationDate = "";
    this.lot = new MerchandiseBranchTransfersDetailLot();
    this.showDialogChange.emit(this.showDialog);
  }

  addLot() {
    this.loadingService.startLoading('wait_loading');
    this.submitted = true;
    if (this.merchandiseBranchTransferDetail.branchTransferDetailLot == null || this.merchandiseBranchTransferDetail.branchTransferDetailLot.filter(x => x.lot.id == this.lot.lot.id).length == 0) {
      if (this.lot.numberUnitsShipped > 0 && this.lot.lot.id > 0 && this.lot.numberUnitsShipped <= this.amountSent) {
        this.lot.idBranchTransferDetail = this.merchandiseBranchTransferDetail.idBranchTransferDetail;
        this.lot.numberUnitsShipped = parseFloat(this.lot.numberUnitsShipped.toString());
        this.merchandiseTranferService.updateMerchandiseBranchTransfersDetailLot(this.lot).subscribe((data) => {
          if (data.errorId == 0) {
            this.amountSent = this.amountSent - this.lot.numberUnitsShipped;
            this.lot.lot = new Lot()
            this.expirationDate = "";
            this.lot.numberUnitsShipped = 0;
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.getMerchandiseBranchTransferDetailLot(this.merchandiseBranchTransferDetail.idBranchTransferDetail);
            this.submitted = false;
            this.loadingService.stopLoading();
          }
          else {
            if (data.errorId > 1000){
              this.loadingService.stopLoading();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
            }else if (data.errorId == 1000){
              this.loadingService.stopLoading();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el lote" });
            }
          }
        }, (error: HttpErrorResponse) => {
          this.loadingService.stopLoading();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el lote" });
        });
      }else{
        this.loadingService.stopLoading();
      }
    }else{
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este lote ya se encuentra registrado" });
    }
  }

  onDeleteLot(lot: MerchandiseBranchTransfersDetailLot) {
    console.log(lot);
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Este lote será eliminado. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.deleteMerchandiseTrasnferDetailLot(this.merchandiseBranchTransferDetail.idBranchTransferDetail, lot.idBranchTransferDetailLot).subscribe((resp: any) => {
          if (resp.result == true) {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Lote eliminado con éxito" });
            this.merchandiseBranchTransferDetail.branchTransferDetailLot = this.merchandiseBranchTransferDetail.branchTransferDetailLot.filter(x => x.idBranchTransferDetailLot != lot.idBranchTransferDetailLot);
            this.amountSent = this.amountSent + lot.numberUnitsShipped;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar el lote" });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar el lote" });
        });
      },
      reject: (type) => {
      }
    })
  }

  getLots() {
    var filter: LotFilter = new LotFilter();
    filter.productId = this.merchandiseBranchTransferDetail.idProduct;
    filter.packingId = this.merchandiseBranchTransferDetail.packingProduct.idPacking;
    filter.branchId = this.merchandiseTransfer.originBranch.id;
    filter.areaId = this.merchandiseTransfer.originArea.id;
    this.merchandiseTranferService.getLotList(filter)
      .subscribe((data) => {
        this.lotList = data.map((item) => ({
          label: item.lotNumber,
          value: item.id,
          title: this.datePipe.transform(item.expirationDate, "dd/MM/yyyy")
        }));
      }, (error) => {
        console.log(error);
      });
  }

  changeLot() {
    this.expirationDate = this.lotList.find(x => x.value == this.lot.lot.id).title;
  }

  getMerchandiseBranchTransferDetailLot(idBranchTranferDetail: number) {
    this.merchandiseTranferService.getBranchTransferDetailLot(idBranchTranferDetail).subscribe((data: MerchandiseBranchTransfersDetailLot[]) => {
      this.merchandiseBranchTransferDetail.branchTransferDetailLot = data;
      if (this.merchandiseBranchTransferDetail.branchTransferDetailLot != null && this.merchandiseBranchTransferDetail.branchTransferDetailLot.length > 0) {
        this.merchandiseBranchTransferDetail.branchTransferDetailLot.forEach(lot => {
          lot.packingProduct = this.merchandiseBranchTransferDetail.packingProduct;
          lot.lot.expirationDateString = this.datePipe.transform(lot.lot.expirationDate, "dd/MM/yyyy")
        });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los lotes asociados." });
    });
  }
}
