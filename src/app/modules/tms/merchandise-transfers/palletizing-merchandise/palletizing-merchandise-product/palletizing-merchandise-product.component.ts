import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { MerchandiseBranchTransfersPaletteDetail } from 'src/app/models/tms/merchandisebranchtransferpalettedetail';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseBranchTransfersPalette } from 'src/app/models/tms/merchandisebranchtransferspalette';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';

@Component({
  selector: 'app-palletizing-merchandise-product',
  templateUrl: './palletizing-merchandise-product.component.html',
  styleUrls: ['./palletizing-merchandise-product.component.scss']
})
export class PalletizingMerchandiseProductComponent implements OnInit {

  @Input("productMerchandiseTransfer") productMerchandiseTransfer: MerchandiseBranchTransfersDetail;
  @Input("product") product: PackingByBranchOffice = new PackingByBranchOffice();
  @Input("openPalette") openPalette: MerchandiseBranchTransfersPalette = new MerchandiseBranchTransfersPalette();
  @Input("showPanel") showPanel: boolean;
  @Output() showPanelChange = new EventEmitter<boolean>();
  @Output() productMerchandiseTransferChange = new EventEmitter<MerchandiseBranchTransfersDetail>();
  submitted: boolean = false;
  quantity: number = 0;
  defectImage: DefeatImage = new DefeatImage()

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  edit(){
    this.submitted = true;
    if (this.quantity > 0) {
      if (this.quantity <= (this.productMerchandiseTransfer.amountSent - (this.productMerchandiseTransfer.quantityofAggregates == undefined ? 0 : this.productMerchandiseTransfer.quantityofAggregates))) {
        if (this.openPalette.branchTransferPaletteDetail.filter(x => x.branchTransferDetail.idProduct == this.productMerchandiseTransfer.idProduct && x.branchTransferDetail.packingProduct.idPacking == this.productMerchandiseTransfer.packingProduct.idPacking).length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este producto ya se encuentra agregado en la paleta" });
        }else{
          var palletDetail: MerchandiseBranchTransfersPaletteDetail = new MerchandiseBranchTransfersPaletteDetail();
          this.productMerchandiseTransfer.quantityofAggregates = (this.productMerchandiseTransfer.quantityofAggregates == undefined ? 0 : this.productMerchandiseTransfer.quantityofAggregates) + this.quantity;
          palletDetail.numberPackages = this.quantity;
          palletDetail.branchTransferDetail = this.productMerchandiseTransfer;
          if(this.openPalette.branchTransferPaletteDetail == null){
            this.openPalette.branchTransferPaletteDetail = [];
          }
         
          this.openPalette.branchTransferPaletteDetail.push(palletDetail);
          this.openPalette.totalAmount = this.openPalette.branchTransferPaletteDetail.reduce(function(a,b){ return a + b.numberPackages},0)
          this.openPalette.totalUnits = this.openPalette.branchTransferPaletteDetail.reduce(function(a,b){ return a + (b.branchTransferDetail.packingProduct.units * b.numberPackages)},0)
          this.productMerchandiseTransferChange.emit(this.productMerchandiseTransfer);
          this.showPanel = false;
          this.showPanelChange.emit(this.showPanel);
          this.submitted = false;
        }
      }
    }
  }
}
