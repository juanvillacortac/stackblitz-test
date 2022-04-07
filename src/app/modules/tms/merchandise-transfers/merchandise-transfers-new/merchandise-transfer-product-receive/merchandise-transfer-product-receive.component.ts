import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { DetailUseTypeFilter } from '../../../shared/filters/detailusetype-filter';
import { CommontmsService } from '../../../shared/service/common.service';
import { StatusTransfer } from '../../shared/enum/status-transfer';
import { TransferType } from '../../shared/enum/transfer-type';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-merchandise-transfer-product-receive',
  templateUrl: './merchandise-transfer-product-receive.component.html',
  styleUrls: ['./merchandise-transfer-product-receive.component.scss']
})
export class MerchandiseTransferProductReceiveComponent implements OnInit {

  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers;
  @Input("merchandiseBranchTransfer") merchandiseBranchTransfer: MerchandiseBranchTransfers;
  @Input("productMerchandiseTransfer") productMerchandiseTransfer: MerchandiseBranchTransfersDetail;
  @Input("product") product: PackingByBranchOffice = new PackingByBranchOffice();
  @Input("showReceivedProduct") showReceivedProduct: boolean = false;
  @Input("validationFactor") validationFactor: ValidationFactor;
  @Output() showReceivedProductChange = new EventEmitter<boolean>();
  @Output() refreshTransfer = new EventEmitter();

  submittedAdd: boolean = false;
  detailUseTypeList: SelectItem[] = [];
  transferType = TransferType;
  statusTransfer = StatusTransfer;
  @Input("receivedAmount") receivedAmount: number = 0;

  constructor(private commonTMSservice: CommontmsService,
    private messageService: MessageService,
    private merchandiseTranferService: MerchandiseTransfersService) { }

  ngOnInit(): void {
  }

  clearProduct() {
    this.product = new PackingByBranchOffice();
    this.productMerchandiseTransfer = new MerchandiseBranchTransfersDetail();
    this.showReceivedProduct = false;
    this.showReceivedProductChange.emit(this.showReceivedProduct);
  }

  onLoadDetailUseTypeList(idUseType: number) {
    var filter: DetailUseTypeFilter = new DetailUseTypeFilter();
    filter.idUseType = idUseType;
    this.commonTMSservice.getDetailUseTypesList(filter)
      .subscribe((data) => {
        this.detailUseTypeList = data.map((item) => ({
          label: item.name,
          title: idUseType.toString(),
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  saveproduct() {
    this.submittedAdd = true;
    this.submittedAdd = false;

    var merchandiseTransfer = {...this.merchandiseTransfer};
    if (this.merchandiseBranchTransfer.status.id == this.statusTransfer.RECEIVED) {
      merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.merchandiseBranchTransfer.idBranchTransfer).branchTransfersDetail.find(x => x.idBranchTransferDetail == this.productMerchandiseTransfer.idBranchTransferDetail).packingProduct = this.product;
    }else{
      merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.merchandiseBranchTransfer.idBranchTransfer).branchTransfersDetail.find(x => x.idBranchTransferDetail == this.productMerchandiseTransfer.idBranchTransferDetail).receivedAmount = this.receivedAmount;
    }
    this.merchandiseTranferService.UpdateMerchandiseTransfers(merchandiseTransfer).subscribe((data) => {
      if (data.errorId == 0) {
        this.clearProduct();
        this.refreshTransfer.emit();
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: "El producto se editó con éxito" });
      }
      else {
        if (data.errorId > 1000)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
        else if (data.errorId == 1000)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al agregar el producto." });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }

  calculate(ind){
    if (ind == 1) {
      this.product.basePVP = this.product.netSellingCostBase * this.product.sellingFactor;
      this.product.conversionPVP = this.product.netSellingCostConversion * this.product.sellingFactor;
    }else if(ind == 2){
      this.product.sellingFactor = this.product.basePVP / this.product.netSellingCostBase;
      this.product.conversionPVP = this.product.netSellingCostConversion * this.product.sellingFactor;
    }else if(ind == 3){
      this.product.sellingFactor = this.product.conversionPVP / this.product.netSellingCostConversion;
      this.product.basePVP = this.product.netSellingCostBase * this.product.sellingFactor;
    }
    
  }
}
