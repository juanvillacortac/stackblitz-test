import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Category } from 'src/app/models/masters-mpc/category';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { DetailUseType } from 'src/app/models/tms/detailusetype';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { DetailUseTypeFilter } from '../../shared/filters/detailusetype-filter';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { UseTypeFilter } from '../../shared/filters/usetype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { StatusTransfer } from '../shared/enum/status-transfer';
import { TransferType } from '../shared/enum/transfer-type';
import { MerchandiseTransfersFilter } from '../shared/filters/merchandise-transfers-filters';
import { MerchandiseTransfersService } from '../shared/service/merchandise-transfers.service';
import { MerchandiseTransferProductReceiveComponent } from './merchandise-transfer-product-receive/merchandise-transfer-product-receive.component';
import { MerchandiseTransferProductComponent } from './merchandise-transfer-product/merchandise-transfer-product.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import { ValidationFactorFilter } from 'src/app/modules/products/shared/filters/validationfactorfilter';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { MerchandiseRequestFilter } from '../../merchandise-request/shared/filters/merchandise-request-filter';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { MerchandiseRequestService } from '../../merchandise-request/shared/service/merchandise-request.service';
import { TelerikReportModalComponent } from 'src/app/modules/common/components/telerik-report-modal/telerik-report-modal.component';

@Component({
  selector: 'app-merchandise-transfers-new',
  templateUrl: './merchandise-transfers-new.component.html',
  styleUrls: ['./merchandise-transfers-new.component.scss'],
  providers: [DecimalPipe]
})
export class MerchandiseTransfersNewComponent implements OnInit {

  displayedColumnsBranchTransfers: ColumnD<MerchandiseBranchTransfers>[] =
    [
      { template: (data) => { return data.transfersNumber; }, field: 'transfersNumber', header: 'Número de transferencia', display: 'table-cell' },
      { template: (data) => { return data.destinationBranch.branchOfficeName; }, field: 'destinationBranch.branchOfficeName', header: 'Sucursal destino', display: 'table-cell' },
      { template: (data) => { return data.status.name; }, field: 'status.name', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalUnitsShipped, '.2'); }, field: 'totalUnitsShipped', header: 'Total de unidades a enviar', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalUnitsReceived, '.2'); }, field: 'totalUnitsReceived', header: 'Total de unidades recibidas', display: 'table-cell' },
    ];

  displayedColumnsBranchTransfersDetail: ColumnD<MerchandiseBranchTransfersDetail>[] =
    [
      { template: (data) => { return data.packingProduct.product.barcode; }, field: 'product.product.barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.product.name; }, field: 'product.product.name', header: 'Nombre', display: 'table-cell' },
      //{ template: (data) => { return data.packingProduct.product.referent; }, field: 'product.product.referent', header: 'Referencia', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.packingPresentation.name; }, field: 'product.packingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.units; }, field: 'product.units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return data.detailUseType.name; }, field: 'detailUseType.name', header: 'Detalle tipo de uso', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.available; }, field: 'existence', header: 'Existencia', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.amountSent, '.2'); }, field: 'amountSent', header: 'Cantidad a enviar', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.receivedAmount, '.2'); }, field: 'receivedAmount', header: 'Cantidad recibida', display: 'table-cell' },
    ];

  idBranchOfficeLogged: number = 0;
  indmenu: number = 0;
  transferTypeList: SelectItem[] = [];
  useTypeList: SelectItem[] = [];
  branchOfficeList: SelectItem[] = [];
  CategoriesList: SelectItem[] = [];
  idMerchadiseTransfer: number = 0;
  idMerchadiseBranchTransfer: number = 0;
  merchandiseTransfer: MerchandiseTransfers = new MerchandiseTransfers();
  merchandiseTransferDB: MerchandiseTransfers = new MerchandiseTransfers();
  productMerchandiseTransfer: MerchandiseBranchTransfersDetail = new MerchandiseBranchTransfersDetail();
  merchandiseBranchTransfer: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  listProducts: MerchandiseBranchTransfers[] = [];
  submittedSave: boolean = false;
  submittedReceive: boolean = false;
  @ViewChild(TelerikReportModalComponent) telerikReportModalComponent: TelerikReportModalComponent;
  @ViewChild(MerchandiseTransferProductComponent) MerchandiseTransferProductComponent: MerchandiseTransferProductComponent;
  @ViewChild(MerchandiseTransferProductReceiveComponent) MerchandiseTransferProductReceiveComponent: MerchandiseTransferProductReceiveComponent;
  statusTrasfer = StatusTransfer;
  showBranchTransferListModal: boolean = false;
  showAddLotModal: boolean = false;
  areaListOrigin: SelectItem[] = [];
  areaListDestination: SelectItem[] = [];
  branchOfficeSelected: any[] = [];
  branchOfficeSelectedLoad: any[] = [];
  branchOfficeDestinationSelected: SelectItem[] = [];
  totalHeaderUnitsShipped: String = "";
  totalCosts: number = 0;
  disableHeadboard: boolean = false;
  statusTransfer = StatusTransfer;
  transferType = TransferType;

  showButtonSendTransfer: boolean = true;
  showButtonUpdateTransfer: boolean = true;
  showNewProduct: boolean = true;
  showReceivedProduct: boolean = false;
  showPanelDetail: boolean = true;
  showAdditionalData: boolean = false;
  showCancelButton: boolean = false;
  showReceiveButton: boolean = false;
  showReceivePalletteButton: boolean = false;
  showReceiveAllButton: boolean = false;
  showFinishButton: boolean = false;
  showPalletteButton: boolean = false;
  showCleanButton: boolean = true;
  showDetinationArea: boolean = false;
  branchTransferList: MerchandiseBranchTransfers[] = [];
  permissionsIDs = { ...Permissions };
  productSelected: PackingByBranchOffice = new PackingByBranchOffice();
  textButtonPalletizing: string = "Paletizar";
  showReceivePallette: boolean = false;
  showPrintTransfer: boolean = false;
  transferCancelled: boolean = false;

  disabledDestinationArea: boolean = false;
  idDestinationArea: number = 0;

  statusBranchTransfer: number = 0;

  validationFactor: ValidationFactor = new ValidationFactor();
  receivedAmount: number = 0;

  disabledSendButton: boolean = false;

  constructor(public merchandiseTranferService: MerchandiseTransfersService,
    private commonTMSservice: CommontmsService,
    private commonService: CommonService,
    private branchOfficeService: BranchofficeService,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private _categoryservice: CategoryService,
    public breadcrumbService: BreadcrumbService,
    private areaService: AreaService,
    private _Authservice: AuthService,
    private loadingService: LoadingService,
    private decimalPipe: DecimalPipe,
    public userPermissions: UserPermissions,
    private productBrachOfficeService: ProductbranchofficeService,
    public merchadiseRequestService: MerchandiseRequestService,) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Transferencia de mercancía', routerLink: ['/tms/merchandise-transfers-list'] }
    ]);
  }

  ngOnInit(): void {
    debugger
    this.idMerchadiseTransfer = parseInt(this.actRoute.snapshot.params['idTransfer']);
    this.idMerchadiseBranchTransfer = parseInt(this.actRoute.snapshot.params['idBranchTransfer']);
    this.idBranchOfficeLogged = this._Authservice.currentOffice;
    if (this.idMerchadiseTransfer == 0 && this.idMerchadiseBranchTransfer == 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Desea generar el número de documento?',
        accept: () => {
          this.InsertMerchandiseTransfer();
          //this.requestTypeList = this.requestTypeList.filter(x => x.value != 1);
        },
        reject: (type) => {
          this.router.navigate(['/tms/merchandise-transfers-list']);
        }
      })
      this.onLoadBranchOfficeList();
    } else {
      if (this.idMerchadiseBranchTransfer == 0) {
        this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
      } else {
        this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
      }

    }
    this.onLoadTransferTypeList();
    this.onLoadUseTypeList();
    this.onLoadCategorys();    
  }

  onLoadMerchandiseRequest(idMerchandiseRequest: number) {
    var filter = new MerchandiseRequestFilter();
    filter.id = idMerchandiseRequest;
    this.merchadiseRequestService.getMerchandiseRequestList(filter).subscribe((data: MerchandiseRequest[]) => {
      var merchandiseRequest = data[0];
      console.log(data);
      /* var dat: any[] = data;
      this.merchandiseRequest = data[0];
      this.merchandiseRequestDB = data[0];
      this.MerchandiseRequestProductComponent.onLoadDetailUseTypeList(this.merchandiseRequest.useType.id);
      this.listProducts = data[0].requestDetail;
      this.onLoadUseTypeList(true); */
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener el detalle de las solicitudes" });
    });
  }

  onChangeUseType() {
    this.MerchandiseTransferProductComponent.onLoadDetailUseTypeList(this.merchandiseTransfer.useType.id);
    var detail;
    var filter: DetailUseTypeFilter = new DetailUseTypeFilter();
    filter.idUseType = this.merchandiseTransfer.useType.id;
    this.commonTMSservice.getDetailUseTypesList(filter)
      .subscribe((data) => {
        detail = data[0];
        this.listProducts.forEach(product => {
          product.branchTransfersDetail.forEach(transferDetail => {
            if (transferDetail.detailUseType.idUseType != this.merchandiseTransfer.useType.id) {
              transferDetail.detailUseType.id = detail.id;
              transferDetail.detailUseType.name = detail.name;
              transferDetail.detailUseType.idUseType = detail.idUseType;
            }
          });
        });
      }, (error) => {
        console.log(error);
      });

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

  onLoadUseTypeList() {
    var filter: UseTypeFilter = new UseTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getUseTypesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.useTypeList = data.map((item) => ({
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
    filter.idCompany = this._Authservice.currentCompany;
    this.branchOfficeService.getBranchOfficeList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
        this.branchOfficeList = data.map((item) => ({
          label: item.branchOfficeName,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadBranchOfficeListWithSelected() {
    var filter: BranchofficeFilter = new BranchofficeFilter();
    filter.active = 1;
    filter.idCompany = this._Authservice.currentCompany;
    this.branchOfficeService.getBranchOfficeList(filter)
      .subscribe((data) => {
        this.branchOfficeList = data.map((item) => ({
          label: item.branchOfficeName,
          value: item.id
        }));
        this.branchOfficeDestinationSelected = this.branchOfficeSelected.map<SelectItem>((item) => ({
          label: this.branchOfficeList.find(x => x.value == item).label,
          value: item
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadAreasList(idBranch: number) {
    var filter: AreaFilter = new AreaFilter();
    filter.idBranchOffice = idBranch;
    filter.active = 1;
    this.areaService.getareaList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.areaListOrigin = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadAreasDestinyList(idBranch: number) {
    var filter: AreaFilter = new AreaFilter();
    filter.idBranchOffice = idBranch;
    filter.active = 1;
    this.areaService.getareaList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.areaListDestination = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  changeBranch() {
    this.onLoadAreasList(this.merchandiseTransfer.originBranch.id);
  }

  onDeleteBranchTransferDetail(productDetail: MerchandiseBranchTransfersDetail, idBranchOffcie: number) {
    if (productDetail.idBranchTransferDetail == -1) {
      var listBranchTransfer = this.listProducts.find(x => x.destinationBranch.id == idBranchOffcie);
      listBranchTransfer.totalUnitsShipped = listBranchTransfer.totalUnitsShipped - (productDetail.packingProduct.units * productDetail.amountSent);
      var listBranchTransferDetail = listBranchTransfer.branchTransfersDetail.filter(x => x.idProduct != productDetail.idProduct);
      listBranchTransfer.branchTransfersDetail = listBranchTransferDetail;
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Este producto será eliminado. ¿Desea continuar?',
        accept: () => {
          var stringDeleteBranchTransfer = productDetail.idBranchTransferDetail.toString();
          var idBranchTranfer = productDetail.idBranchTransfer;
          this.merchandiseTranferService.DeleteMerchandiseTrasnferDetail(stringDeleteBranchTransfer, idBranchTranfer).subscribe((resp: DatabaseResult) => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Producto eliminado con éxito" });
            this.removeBranchTransferDerail(idBranchOffcie, productDetail.idBranchTransferDetail);
            var listBranchTransfer = this.listProducts.find(x => x.destinationBranch.id == idBranchOffcie);
            listBranchTransfer.totalUnitsShipped = listBranchTransfer.totalUnitsShipped - (productDetail.packingProduct.units * productDetail.amountSent);
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
  }

  onEditBranchTransferDetail(productDetail: MerchandiseBranchTransfersDetail, branchTransfer: MerchandiseBranchTransfers) {
    if (branchTransfer.status.id == StatusTransfer.SENT || branchTransfer.status.id == StatusTransfer.RECEIVED) {
      this.showPanelDetail = true;
    }
    this.merchandiseTranferService.getImage(productDetail.packingProduct.product).subscribe((data: string) => {
      productDetail.packingProduct.product.image = data;
    });
    if (this.showNewProduct) {
      this.productMerchandiseTransfer = new MerchandiseBranchTransfersDetail();
      this.productMerchandiseTransfer.idBranchTransfer = productDetail.idBranchTransfer;
      this.productMerchandiseTransfer.idBranchTransferDetail = productDetail.idBranchTransferDetail;
      this.productMerchandiseTransfer.idProduct = productDetail.idProduct;
      this.productMerchandiseTransfer.packingProduct = new PackingByBranchOffice();
      productDetail.packingProduct.idProduct = productDetail.idProduct;
      this.productMerchandiseTransfer.packingProduct = productDetail.packingProduct;
      this.productMerchandiseTransfer.detailUseType = new DetailUseType();
      this.productMerchandiseTransfer.detailUseType = { ...productDetail.detailUseType };
      this.productMerchandiseTransfer.amountSent = productDetail.amountSent;
      this.MerchandiseTransferProductComponent.product = productDetail.packingProduct;
      this.MerchandiseTransferProductComponent.barProduct = productDetail.packingProduct.product.barcode;
      this.MerchandiseTransferProductComponent.destinationBranch = branchTransfer.destinationBranch.id;
      this.MerchandiseTransferProductComponent.showButtonAdd = false;
      this.MerchandiseTransferProductComponent.showButtonSave = true;
    } else {
      if (branchTransfer.status.id == StatusTransfer.RECEIVED) {
        this.searchValidationFactorbyBranchOffice(branchTransfer.destinationBranch.id, productDetail.idProduct)
      }
      this.productMerchandiseTransfer = productDetail;
      this.merchandiseBranchTransfer = branchTransfer;
      this.receivedAmount = productDetail.receivedAmount;
      this.productSelected = productDetail.packingProduct;
    }

  }

  back() {
    this.router.navigate(['/tms/merchandise-transfers-list']);
  }

  onLoadMerchandiseTransfer(idMerchandiseTransfer: number, idMerchandiseBranchTransfer: number, indSent: boolean) {
    this.loadingService.startLoading('wait_loading');
    var filter = new MerchandiseTransfersFilter();
    filter.id = idMerchandiseTransfer;
    this.merchandiseTranferService.getMerchandiseTransfersList(filter).subscribe((data: MerchandiseTransfers[]) => {
      var dat: any[] = data;
      this.merchandiseTransfer = data[0];
      this.merchandiseTransferDB = data[0];

      this.onLoadAreasList(this.merchandiseTransfer.originBranch.id);
      if (this.idMerchadiseBranchTransfer == 0) {
        if (this.MerchandiseTransferProductComponent != undefined && this.MerchandiseTransferProductComponent != null) {
          this.MerchandiseTransferProductComponent.onLoadDetailUseTypeList(this.merchandiseTransfer.useType.id);
        }
      }
      if (idMerchandiseBranchTransfer == 0) {
        this.listProducts = this.merchandiseTransfer.branchTransfer;
debugger
        if (this.merchandiseTransfer.branchTransfer != null) {
          if (this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.EXECUTION).length > 0) {
            if (this.userPermissions.allowed(this.permissionsIDs.CANCEL_TRANSFER_ERASER_PERMISSION_ID)) {
              this.showCancelButton = true;
            } else {
              this.showCancelButton = false;
            }
          } else {
            if (this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.SENT).length > 0
              || this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.FINALIZED).length > 0
              || this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.RECEIVED).length > 0) {
              this.showCancelButton = false;
              this.showPrintTransfer = true;
            }
          }
        }else{
          if (this.userPermissions.allowed(this.permissionsIDs.CANCEL_TRANSFER_ERASER_PERMISSION_ID)) {
            this.showCancelButton = true;
          } else {
            this.showCancelButton = false;
          }
        }
      } else {
        this.showPrintTransfer = true;
        this.listProducts = this.merchandiseTransfer.branchTransfer.filter(x => x.idBranchTransfer == idMerchandiseBranchTransfer);
        this.onLoadAreasDestinyList(this.listProducts[0].destinationBranch.id)
        if (this.merchandiseTransfer.branchTransfer.filter(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer && x.status.id == StatusTransfer.SENT).length == this.listProducts.length) {
          this.showDetinationArea = true;
          if (this.userPermissions.allowed(this.permissionsIDs.CANCEL_TRANSFER_SENT_PERMISSION_ID)) {
            this.showCancelButton = true;
          } else {
            this.showCancelButton = false;
          }
        }
        if (this.merchandiseTransfer.branchTransfer.filter(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer && x.status.id == StatusTransfer.RECEIVED).length == this.listProducts.length) {
          this.idDestinationArea = this.listProducts[0].destinityArea.id;
          this.showDetinationArea = true;
          this.disabledDestinationArea = true;

          if (this.userPermissions.allowed(this.permissionsIDs.CANCEL_TRANSFER_RECEIVE_PERMISSION_ID)) {
            this.showCancelButton = true;
          } else {
            this.showCancelButton = false;
          }
        }

        if (this.merchandiseTransfer.branchTransfer.filter(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer && x.status.id == StatusTransfer.FINALIZED).length == this.listProducts.length) {
          this.idDestinationArea = this.listProducts[0].destinityArea.id;
          this.showDetinationArea = true;
          this.disabledDestinationArea = true;
          if (this.userPermissions.allowed(this.permissionsIDs.CANCEL_TRANSFER_FINALIZE_PERMISSION_ID)) {
            this.showCancelButton = true;
          } else {
            this.showCancelButton = false;
          }
        }

        if (this.listProducts.filter(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer && x.status.id == StatusTransfer.SENT).length > 0) {
          this.showReceiveButton = true;
          this.showReceiveAllButton = true;
        } else {
          this.showReceiveButton = false;
          this.showReceiveAllButton = false;
        }
        if (this.listProducts.filter(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer && x.status.id == StatusTransfer.RECEIVED).length > 0) {
          this.showFinishButton = true;
        } else {
          this.showFinishButton = false;
        }
        if (this.merchandiseTransfer.transferType.id == TransferType.CERTIFIEDMERCHANDISETRANSFER &&
          this.listProducts.filter(x => x.indPalletizing == false).length == 0) {
          this.showReceivePalletteButton = true;
          this.textButtonPalletizing = "Paletizado";
        }
        if (this.listProducts.filter(x => x.indReceivePallette == false).length == 0) {
          this.showReceivePalletteButton = false;
        }
        if (this.listProducts.filter(x => x.indReceivePallette == false).length > 0) {
          this.showReceiveButton = false;
          this.showReceiveAllButton = false;
        }
      }
      this.branchOfficeSelected = [];

      if (this.merchandiseTransfer.branchTransfer != null) {
        this.merchandiseTransfer.branchTransfer.forEach(branchTransfer => {
          this.branchOfficeSelected.push(
            branchTransfer.destinationBranch.id
          )
        });
        if (this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.EXECUTION).length == 0) {
          this.showPanelDetail = false;
          this.showAdditionalData = true;
          this.showPalletteButton = true;
          this.showButtonUpdateTransfer = false;
          this.showCleanButton = false;
        }
        if (this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.SENT).length > 0
          || this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.FINALIZED).length > 0
          || this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.RECEIVED).length > 0) {

          this.disableHeadboard = true;
          this.showButtonSendTransfer = false;
          this.showNewProduct = false;
          this.showReceivedProduct = true;
          this.showButtonUpdateTransfer = false;
          this.showCleanButton = false
        } else {
          this.disableHeadboard = false;
          this.showButtonSendTransfer = true;
          this.showNewProduct = true;
          this.showReceivedProduct = false;
        }
        if (this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.CANCELED).length == this.listProducts.length) {
          this.showAdditionalData = false;
          this.showPalletteButton = false;
          this.showButtonSendTransfer = false;
          this.showButtonUpdateTransfer = false;
          this.showCancelButton = false;
          this.disableHeadboard = true;
          this.showCleanButton = false;
          this.transferCancelled = true;
        }
        if (this.listProducts != null && this.listProducts.filter(x => x.status.id != StatusTransfer.CANCELED).length > 0 && this.listProducts.filter(x => x.idBranchTransfer != -1).length > 0) {
          //this.showCancelButton = true;
        } else {
          this.showCancelButton = false;
        }
      }

      if (indSent && this.merchandiseTransfer.branchTransfer.filter(x => x.status.id == StatusTransfer.CANCELED).length != this.listProducts.length) {
        this.showBranchTransferListModal = true;
      }

      this.branchOfficeSelectedLoad = [...this.branchOfficeSelected];
      this.onLoadBranchOfficeListWithSelected();
      /* if (this.merchandiseTransfer.transferType.id == 2) {
        this.transferTypeList = this.transferTypeList.filter(x => x.value != 1);
      } */
      if (this.merchandiseTransfer.branchTransfer != null) {
        this.totalHeaderUnitsShipped = this.decimalPipe.transform(this.merchandiseTransfer.branchTransfer.reduce(function (a, b) { return a + b.totalUnitsShipped; }, 0), '.2');
      }

      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la transferencia" });
    });
  }

  cleanHeaderMerchandiseTransfer() {
    //this.merchandiseTransfer.originBranch.id = -1;
    this.merchandiseTransfer.originArea.id = -1;
    this.merchandiseTransfer.transferType.id = -1;
    this.merchandiseTransfer.useType.id = -1;
    this.merchandiseTransfer.observations = "";
    this.branchOfficeSelected = [];
    this.MerchandiseTransferProductComponent.clearProduct();
    this.listProducts = [];
  }

  cancelMerchandiseTransfer() {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Esta transferencia será anulada. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.cancelBranchTransfer(this.idMerchadiseTransfer, (this.idMerchadiseBranchTransfer == 0 ? -1 : this.idMerchadiseBranchTransfer)).subscribe((data) => {
          if (data.result == true) {
            this.listProducts.forEach(branchTransfer => {
              branchTransfer.status.id = StatusTransfer.CANCELED;
              branchTransfer.status.name = "Anulada";
            });
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Transferencia anulada con éxito." });
            this.showCancelButton = false;
            this.showPanelDetail = false;
            this.submittedSave = false;
            this.showButtonUpdateTransfer = false;
            this.showButtonSendTransfer = false;
            if (this.merchandiseTransfer.transferType.id == TransferType.CERTIFIEDMERCHANDISETRANSFER) {
              if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, false);
              } else {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
              }
            } else {
              if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, false);
              } else {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
              }
            }
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al anular la transferencia." });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al anular la transferencia." });
        });
      },
      reject: (type) => {
      }
    })

  }

  cancelMerchandiseBranchTransfer(idBranchTransfer: number){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Esta transferencia será anulada. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.cancelBranchTransfer(this.idMerchadiseTransfer, idBranchTransfer).subscribe((data) => {
          if (data.result == true) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Transferencia anulada con éxito." });
            if (this.merchandiseTransfer.transferType.id == TransferType.CERTIFIEDMERCHANDISETRANSFER) {
              if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, false);
              } else {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
              }
            } else {
              if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, false);
              } else {
                this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
              }
            }
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al anular la transferencia." });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al anular la transferencia." });
        });
      },
      reject: (type) => {
      }
    })
  }

  finishMerchandiseRequest() {
    this.submittedSave = true;
    var validateDetailUseType: boolean = false;
    if (this.listProducts != null) {
      this.listProducts.forEach(product => {
        /* if (product.detailUseType.id == -1) {
          validateDetailUseType = true;
        } */
      });
    }
    if ((this.merchandiseTransfer.originBranch.id != undefined && this.merchandiseTransfer.originBranch.id > 0) && this.merchandiseTransfer.transferType.id > 0
      && this.merchandiseTransfer.useType.id > 0) {
      if (this.listProducts == null || this.listProducts.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos un producto para finalizar." });
      } else {
        if (validateDetailUseType) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Asigne el detalle tipo de uso a todos los productos." });
        } else {
          //this.merchandiseTransfer.status.id = this.statusTrasfer.FINALIZED;
          //this.merchandiseTransfer.requestDetail = this.listProducts;
          /* this.merchandiseTranferService.UpdateMerchandiseRequests(this.merchandiseTransfer).subscribe((data) => {
            if (data.errorId == 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
              this.onLoadMerchandiseTransfer(this.merchandiseTransfer.idTransfer);
              this.submittedSave = false;
            }
            else {
              if (data.errorId > 1000)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
              else if (data.errorId == 1000)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
            }
          }, (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
          }); */
        }
      }
    }
  }

  sendMerchadiseTransfer() {
    this.loadingService.startLoading('wait_loading');
    this.disabledSendButton = true;
    this.submittedSave = true;
    var validateListDetail: boolean = false;
    var validateDetailUseType: boolean = false;
    var validateLot: boolean = false;
    var validateSumLot: boolean = false;
    var validateQuantity: boolean = false;
    if (this.listProducts != null && this.listProducts.length > 0) {
      this.listProducts.forEach(branchTransfer => {
        if (branchTransfer.branchTransfersDetail == null || branchTransfer.branchTransfersDetail.length == 0) {
          validateListDetail = true;
        }
        if (branchTransfer.branchTransfersDetail != null) {
          branchTransfer.branchTransfersDetail.forEach(branchTransferDetail => {
            if (branchTransferDetail.detailUseType.id == -1) {
              validateDetailUseType = true;
            }
            if (branchTransferDetail.packingProduct.product.lotInd == true && (branchTransferDetail.branchTransferDetailLot == null || branchTransferDetail.branchTransferDetailLot == undefined || branchTransferDetail.branchTransferDetailLot.length == 0)) {
              validateLot = true;
            }
            if (branchTransferDetail.branchTransferDetailLot != undefined && branchTransferDetail.branchTransferDetailLot != null && branchTransferDetail.branchTransferDetailLot.length > 0) {
              if (branchTransferDetail.amountSent != branchTransferDetail.branchTransferDetailLot.reduce(function (a, b) { return a + b.numberUnitsShipped; }, 0)) {
                validateSumLot = true;
              }
            }
            if (branchTransferDetail.amountSent == 0) {
              validateQuantity = true;
            }
          });
        }
      });
    }
    if ((this.merchandiseTransfer.originBranch.id != undefined && this.merchandiseTransfer.originBranch.id > 0) && this.merchandiseTransfer.originArea.id > 0 && this.merchandiseTransfer.transferType.id > 0
      && this.merchandiseTransfer.useType.id > 0 && this.branchOfficeSelected.length > 0) {
      if (this.listProducts != null || this.listProducts.length > 0) {
        if (!validateListDetail) {
          if (validateDetailUseType) {
            this.loadingService.stopLoading();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Agregue el detalle tipo de uso a todos los productos" });
          } else {
            if (validateQuantity) {
              this.loadingService.stopLoading();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad a enviar para todos los productos debe ser mayor a 0." });
            } else {
              //if (validateLot) {
                //this.loadingService.stopLoading();
                //this.messageService.add({ severity: 'error', summary: 'Error', detail: "Agregue los lotes a los productos que lo requieren" });
              //} else {
                if (validateSumLot) {
                  this.loadingService.stopLoading();
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de lotes enviados debe ser igual a la cantidad enviada del producto" });
                } else {
                  this.merchandiseTransfer.branchTransfer = this.listProducts;
                  this.merchandiseTranferService.SendMerchandiseTrasnfers(this.merchandiseTransfer).subscribe((data) => {

                    if (data != null && data.length >= 0) {
                      this.branchTransferList = data.filter(x => x.status.id != StatusTransfer.CANCELED);

                    }
                    if (this.merchandiseTransfer.transferType.id == TransferType.CERTIFIEDMERCHANDISETRANSFER) {
                      if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                        this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, true);
                      } else {
                        this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
                      }
                    } else {
                      if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                        this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, true);
                      } else {
                        this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
                      }
                    }
                    this.loadingService.stopLoading();
                  }, (error: HttpErrorResponse) => {
                    this.loadingService.stopLoading();
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
                  });
                }
              //}
            }
          }
        } else {
          this.loadingService.stopLoading();
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: 'Las sucursales sin productos serán anuladas. ¿Desea continuar?',
            accept: () => {
              this.loadingService.startLoading('wait_loading');
              if (validateDetailUseType) {
                this.loadingService.stopLoading();
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Agregue el detalle tipo de uso a todos los productos" });
              } else {
                if (validateQuantity) {
                  this.loadingService.stopLoading();
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad a enviar para todos los productos debe ser mayor a 0." });
                } else {
                  if (validateLot) {
                    this.loadingService.stopLoading();
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Agregue los lotes a los productos que lo requieren" });
                  } else {
                    if (validateSumLot) {
                      this.loadingService.stopLoading();
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La centidad de lotes enviados debe ser igual a la cantidad enviada del producto" });
                    } else {
                      this.merchandiseTransfer.branchTransfer = this.listProducts;
                      this.merchandiseTranferService.SendMerchandiseTrasnfers(this.merchandiseTransfer).subscribe((data) => {

                        if (data != null && data.length >= 0) {
                          this.branchTransferList = data;
                          //this.showBranchTransferListModal = true;
                        }
                        if (this.merchandiseTransfer.transferType.id == TransferType.CERTIFIEDMERCHANDISETRANSFER) {
                          if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                            this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, true);
                          } else {
                            this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
                          }
                        } else {
                          if (parseInt(this.idMerchadiseBranchTransfer.toString()) == 0) {
                            this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), 0, true);
                          } else {
                            this.onLoadMerchandiseTransfer(parseInt(this.idMerchadiseTransfer.toString()), parseInt(this.idMerchadiseBranchTransfer.toString()), true);
                          }
                        }
                        this.loadingService.stopLoading();
                      }, (error: HttpErrorResponse) => {
                        this.loadingService.stopLoading();
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
                      });
                    }
                  }
                }
              }
            },
            reject: (type) => {
            }
          })
        }
      } else {
        this.loadingService.stopLoading();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Agregue las sucursales destinos con sus productos." });
      }
    } else {
      this.loadingService.stopLoading();
    }
    this.disabledSendButton = false;

  }

  taskMerchadiseTransfer() {

  }


  printMerchadiseTransfer(idBranchTransfer: number) {

    this.router.navigate(['/tms/printed-report', idBranchTransfer]);

    // this.telerikReportModalComponent.param1 = idBranchTransfer
    // this.telerikReportModalComponent.reloadViewer(idBranchTransfer)
    // this.telerikReportModalComponent.name = "Reporte de Transferencias"
    // this.telerikReportModalComponent.visible = true

  }

  updateMerchadiseTransfer() {
    this.loadingService.startLoading('wait_loading');
    this.submittedSave = true;
    var validateDetailUseType: boolean = false;
    if (this.listProducts != null && this.listProducts.length > 0) {
      this.listProducts.forEach(branchTransfer => {
        if (branchTransfer.branchTransfersDetail != null) {
          branchTransfer.totalUnitsShipped = branchTransfer.branchTransfersDetail.reduce(function (a, b) { return a + (b.packingProduct.units * b.amountSent); }, 0)
          branchTransfer.branchTransfersDetail.forEach(branchTransferDetail => {
            if (branchTransferDetail.detailUseType.id == -1) {
              validateDetailUseType = true;
            }
          });
        }
      });
    }
    if ((this.merchandiseTransfer.originBranch.id != undefined && this.merchandiseTransfer.originBranch.id > 0) && this.merchandiseTransfer.originArea.id > 0 && this.merchandiseTransfer.transferType.id > 0
      && this.merchandiseTransfer.useType.id > 0 && this.branchOfficeSelected.length > 0) {

      if (validateDetailUseType) {
        this.loadingService.stopLoading();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Asigne el detalle tipo de uso a todos los productos" });
      } else {
        /* if (this.merchandiseTransfer.status.id == this.statusTrasfer.ERASER) {
          this.merchandiseTransfer.status.id = this.statusTrasfer.EXECUTION;
        } */
        this.merchandiseTransfer.branchTransfer = this.listProducts;
        this.merchandiseTranferService.UpdateMerchandiseTransfers(this.merchandiseTransfer).subscribe((data) => {
          if (data.errorId == 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            if (this.idMerchadiseBranchTransfer == 0) {
              this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
            } else {
              this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
            }
            this.submittedSave = false;
            this.MerchandiseTransferProductComponent.clearProduct();
          }
          else {
            if (data.errorId > 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
            else if (data.errorId == 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
          }
          this.loadingService.stopLoading();
        }, (error: HttpErrorResponse) => {
          this.loadingService.stopLoading();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
        });

      }

    } else {
      this.loadingService.stopLoading();
    }

  }

  async onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.CategoriesList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });

  }

  ValidateDestinationBranch() {
    var idBranchTransferDelete: number = 0;
    if (this.branchOfficeSelectedLoad.length > 0) {
      this.branchOfficeSelectedLoad.forEach(branchOffice => {
        if (this.branchOfficeSelected.filter(x => x == branchOffice).length == 0) {
          idBranchTransferDelete = branchOffice;
        }
      })
      if (idBranchTransferDelete > 0) {
        if (this.listProducts.find(x => x.destinationBranch.id == idBranchTransferDelete).status.id == StatusTransfer.CANCELED) {
          this.branchOfficeSelected.push(
            idBranchTransferDelete
          )
        } else {
          if (this.listProducts.find(x => x.destinationBranch.id == idBranchTransferDelete).branchTransfersDetail != null && this.listProducts.find(x => x.destinationBranch.id == idBranchTransferDelete).branchTransfersDetail.length > 0) {
            this.confirmationService.confirm({
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              message: 'A la sucursal ' + this.branchOfficeList.find(x => x.value == idBranchTransferDelete).label + ' se le eliminarán\ todos los detalles. ¿Desea continuar?',
              accept: () => {
                var idBranchTransfer = this.listProducts.find(x => x.destinationBranch.id == idBranchTransferDelete).idBranchTransfer;
                var branchTransferDelete = this.listProducts.find(x => x.destinationBranch.id == idBranchTransferDelete);
                //this.branchOfficeSelectedLoad = this.branchOfficeSelectedLoad.filter(x => x != idBranchTransferDelete);
                var stringDeteleBranchTransfer = "";
                branchTransferDelete.branchTransfersDetail.forEach(detail => {
                  if (stringDeteleBranchTransfer == "") {
                    stringDeteleBranchTransfer = detail.idBranchTransferDetail.toString();
                  } else {
                    stringDeteleBranchTransfer = stringDeteleBranchTransfer + "," + detail.idBranchTransferDetail.toString();
                  }
                });
                this.merchandiseTranferService.DeleteMerchandiseTrasnferDetail(stringDeteleBranchTransfer, branchTransferDelete.idBranchTransfer).subscribe((resp: DatabaseResult) => {
                  this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Productos eliminado con éxito" });
                  this.branchOfficeSelected.push(
                    idBranchTransferDelete
                  )
                  this.ValidateAddRemoveDestinationBranch(idBranchTransferDelete);
                  branchTransferDelete.totalUnitsShipped = 0;
                }, (error: HttpErrorResponse) => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la transferencia" });
                });
              },
              reject: (type) => {
                this.branchOfficeSelected.push(
                  idBranchTransferDelete
                )
              }
            })
          } else {
            this.branchOfficeSelected.push(
              idBranchTransferDelete
            )
          }
        }
      } else {
        this.ValidateAddRemoveDestinationBranch(0);
      }
    } else {
      this.ValidateAddRemoveDestinationBranch(0);
    }
  }

  removeBranchTransferDerail(idBranchOffcie: number, idBranchTransferDetail: number) {
    var listDetail = this.listProducts.find(x => x.destinationBranch.id == idBranchOffcie);
    var listBranchTransferDetail = listDetail.branchTransfersDetail.filter(x => x.idBranchTransferDetail != idBranchTransferDetail);
    listDetail.branchTransfersDetail = listBranchTransferDetail;
    if (this.MerchandiseTransferProductComponent.showButtonSave == true) {
      this.MerchandiseTransferProductComponent.clearProduct();
    }
  }

  ValidateAddRemoveDestinationBranch(idBranchOffice: number) {
    if (idBranchOffice == 0) {
      this.MerchandiseTransferProductComponent.clearProduct();
      this.branchOfficeDestinationSelected = this.branchOfficeSelected.map<SelectItem>((item) => ({
        label: this.branchOfficeList.find(x => x.value == item).label,
        value: item
      }));
      if (this.branchOfficeDestinationSelected.length == 1) {
        this.MerchandiseTransferProductComponent.selectedFirstBranch(this.branchOfficeSelected[0]);
      }
      if (this.branchOfficeSelected.length > 0) {
        var list: MerchandiseBranchTransfers[] = [];
        this.branchOfficeSelected.forEach(branchOffice => {
          if (this.listProducts != null && this.listProducts.length > 0) {
            if (this.listProducts.filter(x => x.destinationBranch.id == branchOffice).length > 0) {
              list.push(this.listProducts.find(x => x.destinationBranch.id == branchOffice));
            } else {
              var branch = new MerchandiseBranchTransfers();
              branch.idTransfer = parseInt(this.idMerchadiseTransfer.toString());
              branch.status = new Status();
              branch.status.id = StatusTransfer.EXECUTION;
              branch.destinationBranch.id = branchOffice;
              branch.destinationBranch.branchOfficeName = this.branchOfficeList.find(x => x.value == branchOffice).label;
              branch.totalUnitsShipped = 0;
              branch.totalUnitsReceived = 0;
              branch.branchTransfersDetail = [];
              list.push(branch);
            }
          } else {
            var branch = new MerchandiseBranchTransfers();
            branch.idTransfer = parseInt(this.idMerchadiseTransfer.toString());
            branch.status = new Status();
            branch.status.id = StatusTransfer.EXECUTION;
            branch.destinationBranch.id = branchOffice;
            branch.destinationBranch.branchOfficeName = this.branchOfficeList.find(x => x.value == branchOffice).label;
            branch.totalUnitsShipped = 0;
            branch.totalUnitsReceived = 0;
            branch.branchTransfersDetail = [];
            list.push(branch);
          }

        });

        this.listProducts = list;
      } else {/*  */
        this.listProducts = [];
      }
    } else {
      this.listProducts.find(x => x.destinationBranch.id == idBranchOffice).branchTransfersDetail = [];
      //this.listProducts.find(x => x.destinationBranch.id == idBranchOffice).status.id = StatusTransfer.CANCELED;
      //this.listProducts.find(x => x.destinationBranch.id == idBranchOffice).status.name = "Anulado";
    }
  }

  showBranchTransferLitsAdditionalData() {
    var idTransfer: number = 0;
    var idBranchTransfer: number = 0;
    if (this.idMerchadiseBranchTransfer == 0) {
      idTransfer = parseInt(this.idMerchadiseTransfer.toString());
      idBranchTransfer = -1;
    } else {
      idTransfer = -1;
      idBranchTransfer = parseInt(this.idMerchadiseBranchTransfer.toString());
    }
    this.merchandiseTranferService.getTransferTransportList(idTransfer, idBranchTransfer).subscribe((data: MerchandiseBranchTransfers[]) => {
      this.showBranchTransferListModal = true;
      this.branchTransferList = data.filter(x => x.status.id != StatusTransfer.CANCELED);
      console.log(this.branchTransferList);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las transferencias" });
    });
  }

  refreshBranchTransfer() {
    var idTransfer: number = 0;
    var idBranchTransfer: number = 0;
    if (this.idMerchadiseBranchTransfer == 0) {
      idTransfer = parseInt(this.idMerchadiseTransfer.toString());
      idBranchTransfer = -1;
    } else {
      idTransfer = -1;
      idBranchTransfer = parseInt(this.idMerchadiseBranchTransfer.toString());
    }
    this.merchandiseTranferService.getTransferTransportList(idTransfer, idBranchTransfer).subscribe((data: MerchandiseBranchTransfers[]) => {
      this.branchTransferList = data;
      console.log(this.branchTransferList);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las transferencias" });
    });
  }

  showPalletizing() {
    this.router.navigate(['/tms/palletizing-merchandise-transfer', this.merchandiseTransfer.idTransfer, parseInt(this.idMerchadiseBranchTransfer.toString())]);
  }

  onAddLotBranchTransferDetail(productDetail: MerchandiseBranchTransfersDetail) {
    this.productMerchandiseTransfer = productDetail;//{...productDetail};
    this.showAddLotModal = true;
  }

  InsertMerchandiseTransfer() {
    this.loadingService.startLoading('wait_loading');
    this.merchandiseTransfer.transferType.id = 1;
    var filter: AreaFilter = new AreaFilter();
    filter.idBranchOffice = this._Authservice.currentOffice;
    filter.active = 1;
    this.areaService.getareaList(filter)
      .subscribe((data) => {
        this.merchandiseTransfer.originArea.id = data != null && data.length > 0 ? data[0].id : 0;
        this.merchandiseTransfer.idTypeDocumentTransfer = 1;
        this.merchandiseTransfer.useType.id = 1;
        this.merchandiseTransfer.observations = "";
        this.merchandiseTranferService.InsertMerchandiseTransfers(this.merchandiseTransfer).subscribe((data) => {
          this.idMerchadiseTransfer = parseInt(data.toString());
          this.idMerchadiseBranchTransfer = 0;
          this.onLoadMerchandiseTransfer(data, 0, false);
          this.router.navigate(['/tms/merchandise-transfers', data, 0]);
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al crear la transferencia." });
        });
      }, (error) => {
        console.log(error);
      });

  }

  onDeleteBranchTransferDetailLots(branchTransferDetail: MerchandiseBranchTransfersDetail) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Todos los lotes de este detalle serán eliminados. ¿Desea continuar?',
      accept: () => {
        this.merchandiseTranferService.deleteMerchandiseTrasnferDetailLot(branchTransferDetail.idBranchTransferDetail, -1).subscribe((resp: any) => {
          if (resp.result == true) {
            branchTransferDetail.branchTransferDetailLot = [];
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Lotes eliminados con éxito" });
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

  refreshTransfer() {
    if (this.idMerchadiseBranchTransfer == 0) {
      this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
    } else {
      this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
    }
  }

  receiveBranchTranfer() {
    this.submittedReceive = true;
    var branchTransfer = this.merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer);
    if (this.idDestinationArea > 0) {
      this.submittedReceive = false;
      if (this.merchandiseTransfer.originBranch.id == branchTransfer.destinationBranch.id || (this.merchandiseTransfer.originBranch.id != branchTransfer.destinationBranch.id && branchTransfer.indHaveTransport == 1)) {
        if (branchTransfer.branchTransfersDetail.filter(x => x.receivedAmount == 0).length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Coloque la cantidad recibida para cada producto." });
        } else {
          if (this.merchandiseTransfer.originBranch.id != branchTransfer.destinationBranch.id && branchTransfer.controlNumber == "") {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar el número de control." });
          } else {
            this.confirmationService.confirm({
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              message: '¿Desea recibir esta transferencia?',
              accept: () => {
                var branchTransfer = this.merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer);
                this.merchandiseTranferService.receiveMerchandiseBranchTransfer(branchTransfer, this.idDestinationArea).subscribe((data: DatabaseResult) => {
                  if (data.errorId == 0) {
                    if (this.idMerchadiseBranchTransfer == 0) {
                      this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
                    } else {
                      this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
                    }
                    this.messageService.add({ severity: 'success', summary: 'Recibida', detail: "Se ha recibido la transferencia exitosamente." });
                  }
                  else {
                    if (data.errorId > 1000)
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
                    else if (data.errorId == 1000)
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia." });
                  }
                }, (error: HttpErrorResponse) => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia" });
                });
              },
              reject: (type) => {
              }
            })
          }
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Lo datos de transporte no han sido registrados." });
      }
    }
  }

  receiveAllBranchTranfer() {
    this.submittedReceive = true;
    var branchTransfer = this.merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer);
    if (this.idDestinationArea > 0) {
      this.submittedReceive = false;
      if (this.merchandiseTransfer.originBranch.id != branchTransfer.destinationBranch.id && branchTransfer.controlNumber == "") {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar el número de control." });
      } else {
        if (this.merchandiseTransfer.originBranch.id == branchTransfer.destinationBranch.id || (this.merchandiseTransfer.originBranch.id != branchTransfer.destinationBranch.id && branchTransfer.indHaveTransport == 1)) {
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Desea recibir ésta transferencia con todos los productos?',
            accept: () => {
              this.merchandiseTransfer.branchTransfer.forEach(branchTransfers => {
                branchTransfers.branchTransfersDetail.forEach(detail => {
                  if (detail.receivedAmount == 0) {
                    detail.receivedAmount = detail.amountSent;
                  }
                });
              });
              this.merchandiseTranferService.receiveMerchandiseBranchTransfer(branchTransfer, this.idDestinationArea).subscribe((data: DatabaseResult) => {
                if (data.errorId == 0) {
                  if (this.idMerchadiseBranchTransfer == 0) {
                    this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
                  } else {
                    this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
                  }
                  this.messageService.add({ severity: 'success', summary: 'Recibida', detail: "Se ha recibido la transferencia exitosamente." });
                }
                else {
                  if (data.errorId > 1000)
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
                  else if (data.errorId == 1000)
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia." });
                }
              }, (error: HttpErrorResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar el lote" });
              });
            },
            reject: (type) => {
            }
          })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Lo datos de transporte no han sido registrados." });
        }
      }
    }
  }

  finishBranchTranfer() {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Desea finalizar esta transferencia?',
      accept: () => {
        var branchTransfer = this.merchandiseTransfer.branchTransfer.find(x => x.idBranchTransfer == this.idMerchadiseBranchTransfer);
        this.merchandiseTranferService.finishMerchandiseBranchTransfer(branchTransfer).subscribe((data: DatabaseResult) => {
          if (data.errorId == 0) {
            if (this.idMerchadiseBranchTransfer == 0) {
              this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, 0, false);
            } else {
              this.onLoadMerchandiseTransfer(this.idMerchadiseTransfer, this.idMerchadiseBranchTransfer, false);
            }
            this.messageService.add({ severity: 'success', summary: 'Recibida', detail: "Se ha finalizado la transferencia exitosamente." });
          }
          else {
            if (data.errorId > 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
            else if (data.errorId == 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia." });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al recibir la transferencia" });
        });
      },
      reject: (type) => {
      }
    })
  }

  ReceivePallette() {
    this.showReceivePallette = true;
  }

  searchValidationFactorbyBranchOffice(idBranchOffice: number, idProduct: number) {
    var validationFactorFilter: ValidationFactorFilter = new ValidationFactorFilter();
    validationFactorFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    validationFactorFilter.idProduct = parseInt(idProduct.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(validationFactorFilter).subscribe((data: ValidationFactor[]) => {
      this.validationFactor = data.length == 0 ? new ValidationFactor() : data[0];
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los factores de validacion" });
    });
  }
}
