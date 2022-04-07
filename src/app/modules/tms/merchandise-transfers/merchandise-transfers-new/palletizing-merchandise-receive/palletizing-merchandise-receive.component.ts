import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { MerchandiseBranchTransfersPaletteDetail } from 'src/app/models/tms/merchandisebranchtransferpalettedetail';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersPalette } from 'src/app/models/tms/merchandisebranchtransferspalette';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-palletizing-merchandise-receive',
  templateUrl: './palletizing-merchandise-receive.component.html',
  styleUrls: ['./palletizing-merchandise-receive.component.scss']
})
export class PalletizingMerchandiseReceiveComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers;
  @Input("validationFactor") validationFactor: ValidationFactor;
  @Input("idBranchTransfer") idBranchTransfer: number;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() refreshTransfer = new EventEmitter();
  loading: boolean = false;
  palletteList: SelectItem[] = [];
  pallettes: MerchandiseBranchTransfersPalette[] = [];
  palletteSelected: MerchandiseBranchTransfersPalette = new MerchandiseBranchTransfersPalette();
  palletteDetailList: MerchandiseBranchTransfersPaletteDetail[] = [];
  idPalletteSelected: number = -1;
  showReceiveButton: boolean = false;
  showReturnButton: boolean = false;
  showDialogReasonReturn: boolean = false;
  displayedColumns: ColumnD<MerchandiseBranchTransfersPaletteDetail>[] =
    [
      { template: (data) => { return data.idBranchTransferPaletteDetail; }, header: 'idBranchTransferPaletteDetail', display: 'none', field: 'id' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.product.barcode; }, header: 'Barra', display: 'table-cell', field: 'branchTransferDetail.packingProduct.product.barcode' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.product.name; }, header: 'Nombre', display: 'table-cell', field: 'branchTransferDetail.packingProduct.product.name' },
      { template: (data) => { return data.branchTransferDetail.amountSent; }, header: 'Cantidad enviada', display: 'table-cell', field: 'branchTransferDetail.amountSent' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.packingPresentation.name; }, header: 'Empaque', display: 'table-cell', field: 'branchTransferDetail.packingProduct.packingPresentation.name' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.units; }, header: 'Unidades', display: 'table-cell', field: 'branchTransferDetail.packingProduct.units' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.units * data.branchTransferDetail.amountSent; }, header: 'Cantidad de unidades', display: 'table-cell', field: 'branchTransferDetail.packingProduct.units' },
    ];

  constructor(private messageService: MessageService,
    private merchandiseTranferService: MerchandiseTransfersService,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  onShow() {
    this.merchandiseTranferService.getMerchandiseTransfersPallette(this.merchandiseTransfer.idTransfer, this.merchandiseTransfer.branchTransfer[0].idBranchTransfer).subscribe((data: MerchandiseTransfers[]) => {
      this.pallettes = data[0].branchTransfer.find(x => x.idBranchTransfer == this.merchandiseTransfer.branchTransfer[0].idBranchTransfer).branchTransferPallette;
      this.palletteList = data[0].branchTransfer.find(x => x.idBranchTransfer == this.merchandiseTransfer.branchTransfer[0].idBranchTransfer).branchTransferPallette.map((item) => ({
        label: item.tagNumber,
        value: item.idBranchTransferPalette
      }));
      var pallette = data[0].branchTransfer.find(x => x.idBranchTransfer == this.merchandiseTransfer.branchTransfer[0].idBranchTransfer).branchTransferPallette[0];
      pallette.branchTransferPaletteDetail.forEach(detail => {
        detail.branchTransferDetail = this.merchandiseTransfer.branchTransfer[0].branchTransfersDetail.find(x => x.idBranchTransferDetail == detail.branchTransferDetail.idBranchTransferDetail);
      });
      pallette.totalAmount = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + b.numberPackages }, 0)
      this.palletteSelected = pallette;
      this.idPalletteSelected = pallette.idBranchTransferPalette;
      this.showReceiveButton = pallette.indReceived == false && pallette.indReturn == false ? true : false;
      this.showReturnButton = pallette.indReceived == false && pallette.indReturn == false ? true : false;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las paletas" });
    });
  }

  onHide() {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  ReceivePallette() {
    this.loadingService.startLoading('wait_loading');
    this.merchandiseTranferService.receivePallette(this.idBranchTransfer,this.idPalletteSelected).subscribe((data: any) => {
      if (data.result == true) {
        this.palletteSelected.indReceived = true;
        this.showReceiveButton = false;
        this.showReturnButton = false;
        this.refreshTransfer.emit();
        this.messageService.add({ severity: 'success', summary: 'Recibida', detail: "Se ha recibido la paleta exitosamente." });
        this.loadingService.stopLoading();
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia." });
        this.loadingService.stopLoading();
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia" });
      this.loadingService.stopLoading();
    });
  }

  ReturnPallette() {
    this.showDialogReasonReturn = true;
  }

  changePallette() {
    var pallette = this.pallettes.find(x => x.idBranchTransferPalette == this.idPalletteSelected);
    pallette.branchTransferPaletteDetail.forEach(detail => {
      detail.branchTransferDetail = this.merchandiseTransfer.branchTransfer[0].branchTransfersDetail.find(x => x.idBranchTransferDetail == detail.branchTransferDetail.idBranchTransferDetail);
    });
    pallette.totalAmount = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + b.numberPackages }, 0)
    this.palletteSelected = pallette;
    this.showReceiveButton = pallette.indReceived == false && pallette.indReturn == false ? true : false;
    this.showReturnButton = pallette.indReceived == false && pallette.indReturn == false ? true : false;
  }

  refreshPallettes(){
    this.palletteSelected.indReturn = true;
    this.showReceiveButton = false;
    this.showReturnButton = false;
    this.refreshTransfer.emit();
  }
}
