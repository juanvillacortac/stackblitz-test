import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { MerchandiseBranchTransfersPaletteDetail } from 'src/app/models/tms/merchandisebranchtransferpalettedetail';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseBranchTransfersPalette } from 'src/app/models/tms/merchandisebranchtransferspalette';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { StatusTransfer } from '../shared/enum/status-transfer';
import { MerchandiseTransfersFilter } from '../shared/filters/merchandise-transfers-filters';
import { MerchandiseTransfersService } from '../shared/service/merchandise-transfers.service';
import { PalletizingMerchandiseProductComponent } from './palletizing-merchandise-product/palletizing-merchandise-product.component';

@Component({
  selector: 'app-palletizing-merchandise',
  templateUrl: './palletizing-merchandise.component.html',
  styleUrls: ['./palletizing-merchandise.component.scss']
})
export class PalletizingMerchandiseComponent implements OnInit {

  indmenu: number = 0;
  transferTypeList: SelectItem[] = [];
  areaList: SelectItem[] = [];
  branchOfficeList: SelectItem[] = [];
  branchTransferList: SelectItem[] = [];
  CategoriesList: SelectItem[] = [];
  idMerchadiseRequest: number = 0;
  idMerchadiseBranchTransfer: number = 0;
  merchandiseTransfer: MerchandiseTransfers = new MerchandiseTransfers();
  merchandiseTransferDB: MerchandiseTransfers = new MerchandiseTransfers();
  merchandiseBranchTransfer: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  productMerchandiseTransfer: MerchandiseBranchTransfersDetail = new MerchandiseBranchTransfersDetail();
  listPallete: MerchandiseBranchTransfersPalette[] = [];
  submittedSave: boolean = false;
  statusTrasfer = StatusTransfer;
  idMerchadiseTransfer: number = 0;
  idBranchTransferSelected: number = 0;
  showPanel: boolean = false;
  productSelected: PackingByBranchOffice = new PackingByBranchOffice();
  showOpenPallete: boolean = true;
  showClosePallete: boolean = false;
  showRemovePallette: boolean = false;
  showFinishPallete: boolean = false;
  openPalette: MerchandiseBranchTransfersPalette = new MerchandiseBranchTransfersPalette();

  displayedColumns: ColumnD<MerchandiseBranchTransfersDetail>[] =
    [
      { template: (data) => { return data.packingProduct.product.barcode; }, field: 'product.product.barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.product.name; }, field: 'product.product.name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.amountSent; }, field: 'amountSent', header: 'Cantidad transferencia', display: 'table-cell' },
      { template: (data) => { return data.quantityofAggregates; }, field: 'quantityofAggregates', header: 'Cantidad agregados', display: 'table-cell' },
      { template: (data) => { return data.amountSent - (data.quantityofAggregates == undefined ? 0 : data.quantityofAggregates); }, field: 'amounttoAdd', header: 'Cantidad por agregar', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.packingPresentation.name; }, field: 'packingProduct.packingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.units; }, field: 'packingProduct.units', header: 'Unidades por empaque', display: 'table-cell' },
      { template: (data) => { return (data.quantityofAggregates == undefined ? 0 : data.quantityofAggregates) * data.packingProduct.units; }, field: 'totalUnitsAdded', header: 'Total unidades agregadas', display: 'table-cell' },
      { template: (data) => { return data.amountSent * data.packingProduct.units; }, field: 'totalTransferUnits', header: 'Total Unidades transferencia', display: 'table-cell' },
    ];

  displayedColumnsPallete: ColumnD<MerchandiseBranchTransfersPalette>[] =
    [
      { template: (data) => { return data.palletNumber; }, field: 'palletNumber', header: 'Número de paleta', display: 'table-cell' },
      { template: (data) => { return data.tagNumber; }, field: 'tagNumber', header: 'Barra paleta', display: 'table-cell' },
      { template: (data) => { return data.totalAmount; }, field: 'totalAmount', header: 'Total cantidad', display: 'table-cell' },
      { template: (data) => { return data.totalUnits; }, field: 'totalUnits', header: 'Total unidades', display: 'table-cell' },
    ];

  displayedColumnsPalleteDetail: ColumnD<MerchandiseBranchTransfersPaletteDetail>[] =
    [
      { template: (data) => { return data.branchTransferDetail.packingProduct.product.barcode; }, field: 'branchTransferDetail.packingProduct.product.barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.product.name; }, field: 'branchTransferDetail.packingProduct.product.name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.numberPackages; }, field: 'numberPackages', header: 'Cantidad', display: 'table-cell' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.packingPresentation.name; }, field: 'branchTransferDetail.packingProduct.packingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.branchTransferDetail.packingProduct.units; }, field: 'branchTransferDetail.packingProduct.units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return data.numberPackages * data.branchTransferDetail.packingProduct.units; }, field: 'totalAmount', header: 'Total unidades', display: 'table-cell' },
    ];

  constructor(private router: Router,
    private actRoute: ActivatedRoute,
    public merchandiseTranferService: MerchandiseTransfersService,
    private messageService: MessageService,
    private commonTMSservice: CommontmsService,
    private branchOfficeService: BranchofficeService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.idMerchadiseTransfer = parseInt(this.actRoute.snapshot.params['idTransfer'].toString());
    this.idMerchadiseBranchTransfer = parseInt(this.actRoute.snapshot.params['idBranchTransfer'].toString());
    this.onLoadTransferTypeList();
    this.onLoadBranchOfficeList();
    this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer);
  }

  back() {
    if (this.idMerchadiseBranchTransfer == 0) {
      this.router.navigate(['/tms/merchandise-transfers', this.idMerchadiseTransfer, 0]);
    }else{
      this.router.navigate(['/tms/merchandise-transfers', this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer]);
    }
    
  }

  onLoadMerchandiseTransfer(idMerchandiseTransfer: number, idBranchTransfer: number) {
    this.merchandiseTranferService.getMerchandiseTransfersPallette(idMerchandiseTransfer, (idBranchTransfer == 0 ? -1 : idBranchTransfer)).subscribe((data: MerchandiseTransfers[]) => {
      this.merchandiseTransfer = data[0];
      this.merchandiseTransferDB = data[0];
      this.idBranchTransferSelected = this.merchandiseTransfer.branchTransfer[0].idBranchTransfer;
      this.branchTransferList = this.merchandiseTransfer.branchTransfer.map((item) => ({
        label: item.transfersNumber,
        value: item.idBranchTransfer
      }));
      this.merchandiseBranchTransfer = this.merchandiseTransfer.branchTransfer[0];
      if (this.merchandiseTransfer.branchTransfer[0].branchTransferPallette != null && this.merchandiseTransfer.branchTransfer[0].branchTransferPallette.length > 0) {
        this.showRemovePallette = true;
        this.merchandiseTransfer.branchTransfer[0].branchTransferPallette.forEach(pallette => {
          pallette.branchTransferPaletteDetail.forEach(detailPallette => {
            detailPallette.branchTransferDetail = this.merchandiseTransfer.branchTransfer[0].branchTransfersDetail.find(x => x.idBranchTransferDetail == detailPallette.branchTransferDetail.idBranchTransferDetail);
            var branchTransferDetail = this.merchandiseTransfer.branchTransfer[0].branchTransfersDetail.find(x => x.idBranchTransferDetail == detailPallette.branchTransferDetail.idBranchTransferDetail);
            branchTransferDetail.quantityofAggregates = (branchTransferDetail.quantityofAggregates == undefined ? 0 : branchTransferDetail.quantityofAggregates) + detailPallette.numberPackages;
          });
          pallette.totalAmount = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + b.numberPackages }, 0)
          pallette.totalUnits = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + (b.branchTransferDetail.packingProduct.units * b.numberPackages) }, 0)
        });
      }
      if (this.merchandiseTransfer.branchTransfer[0].branchTransfersDetail.filter(x => x.quantityofAggregates != x.amountSent).length == 0) {
        this.showOpenPallete = false;
        this.showFinishPallete = true;
      } else {
        this.showOpenPallete = true;
        this.showFinishPallete = false;
      }
      this.listPallete = this.merchandiseTransfer.branchTransfer[0].branchTransferPallette;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la transferencia" });
    });
  }

  changeBranchTranfer() {
    this.showClosePallete = false;
    this.showOpenPallete = true;
    this.showPanel = false;
    this.merchandiseBranchTransfer = this.merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.idBranchTransferSelected);
    this.idBranchTransferSelected = this.merchandiseBranchTransfer.idBranchTransfer;
    if (this.merchandiseBranchTransfer.branchTransferPallette == null) {
      this.merchandiseBranchTransfer.branchTransferPallette = [];
    }
    if (this.merchandiseBranchTransfer.branchTransferPallette.length > 0) {
      this.showRemovePallette = true;
    } else {
      this.showRemovePallette = false;
    }
    this.merchandiseBranchTransfer.branchTransferPallette.forEach(pallette => {
      pallette.branchTransferPaletteDetail.forEach(detailPallette => {
        detailPallette.branchTransferDetail = this.merchandiseBranchTransfer.branchTransfersDetail.find(x => x.idBranchTransferDetail == detailPallette.branchTransferDetail.idBranchTransferDetail);
        var branchTransferDetail = this.merchandiseBranchTransfer.branchTransfersDetail.find(x => x.idBranchTransferDetail == detailPallette.branchTransferDetail.idBranchTransferDetail);
        branchTransferDetail.quantityofAggregates = (branchTransferDetail.quantityofAggregates == undefined ? 0 : branchTransferDetail.quantityofAggregates) + detailPallette.numberPackages;
      });
      pallette.totalAmount = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + b.numberPackages }, 0)
      pallette.totalUnits = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + (b.branchTransferDetail.packingProduct.units * b.numberPackages) }, 0)
    });
    this.listPallete = this.merchandiseBranchTransfer.branchTransferPallette;
    if (this.merchandiseBranchTransfer.branchTransfersDetail.filter(x => x.quantityofAggregates != x.amountSent).length == 0) {
      this.showOpenPallete = false;
      this.showFinishPallete = true;
    } else {
      this.showOpenPallete = true;
      this.showFinishPallete = false;
    }
  }

  openPallette() {
    var pallete: MerchandiseBranchTransfersPalette = new MerchandiseBranchTransfersPalette();
    var list: MerchandiseBranchTransfersPalette[] = [];
    if (this.listPallete == null || this.listPallete.length == 0) {
      this.merchandiseTranferService.getGenerateTagPallett(this.merchandiseBranchTransfer.idBranchTransfer)
        .subscribe((data) => {
          pallete.palletNumber = 1;
          pallete.tagNumber = data[0].tag;
          pallete.idBranchTransfer = this.merchandiseBranchTransfer.idBranchTransfer;
          list.push(
            pallete
          )
          this.listPallete = list;
          this.openPalette = pallete;
        }, (error) => {
          console.log(error);
        });
    } else {
      this.merchandiseTranferService.getGenerateTagPallett(this.merchandiseBranchTransfer.idBranchTransfer)
        .subscribe((data) => {
          pallete.palletNumber = this.listPallete[this.listPallete.length - 1].palletNumber + 1;
          pallete.tagNumber = data[0].tag;
          pallete.idBranchTransfer = this.merchandiseBranchTransfer.idBranchTransfer;
          this.listPallete.forEach(pallet => {
            list.push(pallet)
          });
          list.push(
            pallete
          )
          this.listPallete = list;
          this.openPalette = pallete;
        }, (error) => {
          console.log(error);
        });

    }
    this.showClosePallete = true;
    this.showOpenPallete = false;
  }

  closePallette() {
    if (this.listPallete[this.listPallete.length - 1].branchTransferPaletteDetail.length == 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'La paleta ' + this.listPallete[this.listPallete.length - 1].palletNumber + ' será eliminada debido a que no tiene productos agregados. ¿Desea continuar?',
        accept: () => {
          this.listPallete = this.listPallete.filter(x => x.palletNumber != this.listPallete[this.listPallete.length - 1].palletNumber);
          this.showClosePallete = false;
          this.showOpenPallete = true;
        },
        reject: (type) => {

        }
      })
    } else {
      this.merchandiseBranchTransfer.branchTransferPallette = this.listPallete;
      this.merchandiseTranferService.insertBranchTransferPallette(this.merchandiseBranchTransfer).subscribe((data) => {
        this.merchandiseBranchTransfer.branchTransferPallette = data;
        this.merchandiseBranchTransfer.branchTransferPallette.forEach(pallette => {
          pallette.branchTransferPaletteDetail.forEach(detailPallette => {
            detailPallette.branchTransferDetail = this.merchandiseBranchTransfer.branchTransfersDetail.find(x => x.idBranchTransferDetail == detailPallette.branchTransferDetail.idBranchTransferDetail);
          });
          pallette.totalAmount = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + b.numberPackages }, 0)
          pallette.totalUnits = pallette.branchTransferPaletteDetail.reduce(function (a, b) { return a + (b.branchTransferDetail.packingProduct.units * b.numberPackages) }, 0)
        });
        this.listPallete = this.merchandiseBranchTransfer.branchTransferPallette;
        if (this.merchandiseBranchTransfer.branchTransfersDetail.filter(x => x.quantityofAggregates != x.amountSent).length == 0) {
          this.showOpenPallete = false;
          this.showFinishPallete = true;
        } else {
          this.showOpenPallete = true;
          this.showFinishPallete = false;
        }
        this.showClosePallete = false;
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cerrar la paleta." });
      });
    }
    if (this.listPallete.length == 0) {
      this.showRemovePallette = false;
    } else {
      this.showRemovePallette = true;
    }
    this.showPanel = false;
  }

  finishPalletizing() {
    this.merchandiseTranferService.finishBranchTransferPallette(this.merchandiseBranchTransfer.idBranchTransfer).subscribe((resp: boolean) => {
      if (resp = true) {
        this.merchandiseBranchTransfer.indPalletizing = true;
        this.messageService.add({ severity: 'success', summary: 'Finalizada', detail: "Se ha finalizado el paletizado correctamente" });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al finalizar la transferencia" });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al finalizar la transferencia" });
    });
  }

  removePallette() {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'La paleta ' + this.listPallete[this.listPallete.length - 1].palletNumber + ' será eliminada con todos los detalles. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.deleteBranchTransferPallette(this.listPallete[this.listPallete.length - 1].idBranchTransferPalette).subscribe((resp: boolean) => {
          if (resp = true) {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Paleta eliminada con éxito" });
            var pallette = this.listPallete[this.listPallete.length - 1];
            pallette.branchTransferPaletteDetail.forEach(detail => {
              var branchTransferDetail = this.merchandiseBranchTransfer.branchTransfersDetail.find(x => x.idProduct == detail.branchTransferDetail.idProduct && x.packingProduct.idPacking == detail.branchTransferDetail.packingProduct.idPacking);
              branchTransferDetail.quantityofAggregates = branchTransferDetail.quantityofAggregates - detail.numberPackages
            });
            this.listPallete = this.listPallete.filter(x => x.palletNumber != this.listPallete[this.listPallete.length - 1].palletNumber);
            if (this.merchandiseBranchTransfer.branchTransfersDetail.filter(x => x.quantityofAggregates != x.amountSent).length == 0) {
              this.showOpenPallete = false;
              this.showFinishPallete = true;
            } else {
              this.showOpenPallete = true;
              this.showFinishPallete = false;
            }
            this.showClosePallete = false;
            if (this.listPallete.length == 0) {
              this.showRemovePallette = false;
            }
            this.merchandiseBranchTransfer.branchTransfersDetail
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar la paleta" });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar la paleta" });
        });

      },
      reject: (type) => {

      }
    })

  }

  onLoadTransferTypeList() {
    var filter: RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getTransferTypesList(filter)
      .subscribe((data) => {
        this.transferTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
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

  onEdit(branchTransferDetail: MerchandiseBranchTransfersDetail) {
    this.showPanel = true;
    this.merchandiseTranferService.getImage(branchTransferDetail.packingProduct.product).subscribe((data: string) => {
      branchTransferDetail.packingProduct.product.image = data;
    });
    this.productMerchandiseTransfer = branchTransferDetail;
    this.productSelected = branchTransferDetail.packingProduct;
  }

  onDeleteAdditionalData(branchTransferPalletteDetail: MerchandiseBranchTransfersPaletteDetail, branchTransferPallette: MerchandiseBranchTransfersPalette) {
    var branchTransferDetail = this.merchandiseBranchTransfer.branchTransfersDetail.find(x => x.idProduct == branchTransferPalletteDetail.branchTransferDetail.idProduct && x.packingProduct.idPacking == branchTransferPalletteDetail.branchTransferDetail.packingProduct.idPacking);
    branchTransferDetail.quantityofAggregates = branchTransferDetail.quantityofAggregates - branchTransferPalletteDetail.numberPackages
    branchTransferPallette.branchTransferPaletteDetail = branchTransferPallette.branchTransferPaletteDetail.filter(x => x.branchTransferDetail.packingProduct.product.barcode != branchTransferPalletteDetail.branchTransferDetail.packingProduct.product.barcode);
  }
}