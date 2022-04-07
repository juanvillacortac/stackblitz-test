import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { BranchOfficeService } from 'src/app/modules/hcm/shared/services/branch-office.service';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { ProductBranchFilter } from 'src/app/modules/products/shared/filters/productbranch-filter';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import { DetailUseTypeFilter } from '../../../shared/filters/detailusetype-filter';
import { CommontmsService } from '../../../shared/service/common.service';
import { StatusTransfer } from '../../shared/enum/status-transfer';
import { TransferType } from '../../shared/enum/transfer-type';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-merchandise-transfer-product',
  templateUrl: './merchandise-transfer-product.component.html',
  styleUrls: ['./merchandise-transfer-product.component.scss']
})
export class MerchandiseTransferProductComponent implements OnInit {

  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers;
  @Input("productMerchandiseTransfer") productMerchandiseTransfer: MerchandiseBranchTransfersDetail;
  @Input("listProducts") listProducts: MerchandiseBranchTransfers[];
  @Input("branchOfficeDestinationSelected") branchOfficeDestinationSelected: SelectItem[];
  @Output() listProductsChange = new EventEmitter<MerchandiseBranchTransfers[]>();
  @Output() refreshTransfer = new EventEmitter();
  showDialogAdvanceProductSearch: boolean = false;
  categoriesString: string;
  selectedCategories: any[] = [];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  items: MenuItem[] = [
    {
      label: 'Busqueda avanzada', command: () => {
        //this.searchProducts();
      }
    }

  ];
  destinationBranch: number = -1;
  barProduct: string = "";
  product: PackingByBranchOffice = new PackingByBranchOffice();
  showButtonSave: boolean = false;
  showButtonAdd: boolean = true;
  submittedAdd: boolean = false;
  searchBarCode: boolean = false;
  detailUseTypeList: SelectItem[] = [];
  indModule = 2;
  originBranchOfficeId: number = 0;
  defectImage: DefeatImage = new DefeatImage()
  showProductNotFound: boolean = false;


  constructor(public _categoryservice: CategoryService,
    private _packingproductservice: ProductbranchofficeService,
    private commonTMSservice: CommontmsService,
    private messageService: MessageService,
    private merchandiseTranferService: MerchandiseTransfersService,
    private loadingService: LoadingService,) { }

  ngOnInit(): void {
  }

  addproduct() {
    debugger
    this.loadingService.startLoading('wait_loading');
    this.submittedAdd = true;
    if ((this.product != undefined && this.product.idProductBranchOfficePacking != -1) && (this.productMerchandiseTransfer != undefined && this.productMerchandiseTransfer.detailUseType.id != -1)
      && this.destinationBranch > 0 && this.productMerchandiseTransfer.amountSent > 0) {
      this.submittedAdd = false;
      var branchs = this.listProducts.find(x => x.destinationBranch.id == this.destinationBranch);
      if (branchs.branchTransfersDetail == null || branchs.branchTransfersDetail.filter(x => x.packingProduct.product.barcode == this.product.product.barcode).length == 0) {
        var productMerchandiseTransfer = new MerchandiseBranchTransfersDetail();
        productMerchandiseTransfer.idBranchTransferDetail = -1;
        productMerchandiseTransfer.idBranchTransfer = branchs.idBranchTransfer;
        productMerchandiseTransfer.idProduct = this.product.idProduct;
        productMerchandiseTransfer.packingProduct = this.product;
        productMerchandiseTransfer.amountSent = this.productMerchandiseTransfer.amountSent;
        productMerchandiseTransfer.detailUseType.name = this.detailUseTypeList.find(x => x.value == this.productMerchandiseTransfer.detailUseType.id).label;
        productMerchandiseTransfer.detailUseType.id = parseInt(this.detailUseTypeList.find(x => x.value == this.productMerchandiseTransfer.detailUseType.id).value);
        var list: MerchandiseBranchTransfersDetail[] = [];
        if (branchs.branchTransfersDetail != null) {
          branchs.branchTransfersDetail.forEach(product => {
            list.push(product);
          });
        }
        list.push(productMerchandiseTransfer);
        branchs.branchTransfersDetail = list;
        branchs.totalUnitsShipped = branchs.branchTransfersDetail.reduce(function (a, b) { return a + (b.packingProduct.units * b.amountSent); }, 0)
        if (branchs.status.id == StatusTransfer.CANCELED) {
          branchs.status.id = StatusTransfer.EXECUTION;
          branchs.status.name = "Ejecución";
        }
        //this.listProducts = list;
        this.merchandiseTransfer.branchTransfer = this.listProducts;
        this.merchandiseTranferService.UpdateMerchandiseTransfers(this.merchandiseTransfer).subscribe((data) => {
          this.loadingService.stopLoading();
          if (data.errorId == 0) {
            this.listProductsChange.emit(this.listProducts);
            this.refreshTransfer.emit();
            this.messageService.add({ severity: 'success', summary: 'Agregado', detail: "El producto se agregó con éxito" });
          }
          else {
            if (data.errorId > 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
            else if (data.errorId == 1000)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al agregar el producto." });
          }
        }, (error: HttpErrorResponse) => {
          this.loadingService.stopLoading();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
        });
      } else {
        this.loadingService.stopLoading();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto ya se encuentra en la lista" });
      }

    }else{
      this.loadingService.stopLoading();
    }
  }

  searchProduct() {
    this.showButtonAdd = true;
    this.showButtonSave = false;
    this.searchBarCode = true;
    if (this.barProduct != "") {
      this.searchBarCode = false;
      var filter = new ProductBranchFilter();
      filter.completeBarCode = this.barProduct;
      filter.idBranchOffice = this.merchandiseTransfer.originBranch.id;
      this._packingproductservice.getProductBranchOfficebyfilter(filter).subscribe((data: PackingByBranchOffice[]) => {
        if (data.length > 0) {
          this.showProductNotFound = false;
          this.product = data[0];
        } else {
          this.showProductNotFound = true;
          this.clearProduct();
        }

      })
    } else {
      this.submittedAdd = false;
      this.showProductNotFound = false;
    }
  }

  saveproduct() {
    this.loadingService.startLoading('wait_loading');
    this.submittedAdd = true;
    var branchTransfer = this.listProducts.find(x => x.destinationBranch.id == this.destinationBranch);
    var detail = branchTransfer.branchTransfersDetail.find(x => x.packingProduct.product.barcode == this.product.product.barcode)
    if ((this.product != undefined && this.product.idProductBranchOfficePacking != -1) && (this.productMerchandiseTransfer != undefined && this.productMerchandiseTransfer.detailUseType.id != -1) && this.productMerchandiseTransfer.amountSent > 0) {
      this.submittedAdd = false;
      detail.amountSent = parseFloat(this.productMerchandiseTransfer.amountSent.toString());
      detail.detailUseType.name = this.detailUseTypeList.find(x => x.value == this.productMerchandiseTransfer.detailUseType.id).label;
      detail.detailUseType.id = this.productMerchandiseTransfer.detailUseType.id;this.merchandiseTransfer.branchTransfer = this.listProducts;
      this.merchandiseTranferService.UpdateMerchandiseTransfers(this.merchandiseTransfer).subscribe((data) => {
        this.loadingService.stopLoading();
        if (data.errorId == 0) {
          this.listProductsChange.emit(this.listProducts);
          this.refreshTransfer.emit();
          this.clearProduct();
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
    }else{
      this.loadingService.stopLoading();
    }
  }

  clearProductKeyPressBarCode() {
    this.product = new PackingByBranchOffice();
    this.productMerchandiseTransfer = new MerchandiseBranchTransfersDetail();
    this.showButtonAdd = true;
    this.showButtonSave = false;
  }

  clearProduct() {
    this.barProduct = "";
    this.product = new PackingByBranchOffice();
    this.productMerchandiseTransfer = new MerchandiseBranchTransfersDetail();
    this.showButtonAdd = true;
    this.showButtonSave = false;
  }

  selectedFirstBranch(branch: number) {
    this.destinationBranch = branch;
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
        this.productMerchandiseTransfer.detailUseType.id = data[0].id == 0 ? -1 : data[0].id;
      }, (error) => {
        console.log(error);
      });
  }

  onAdvancedProductSearch() {
    this.originBranchOfficeId = this.merchandiseTransfer.originBranch.id;
    this.showDialogAdvanceProductSearch = true;
  }

  addproductslist() {
    this.listProducts.forEach(branchTransfer => {

      if (branchTransfer.branchTransfersDetail != null && branchTransfer.branchTransfersDetail.length > 0 && branchTransfer.status.id == StatusTransfer.CANCELED) {
        branchTransfer.status.id = StatusTransfer.EXECUTION;
        branchTransfer.status.name = "Ejecución";
      }
      branchTransfer.branchTransfersDetail.forEach(product => {
        if (product.detailUseType.id == -1) {
          product.detailUseType.id = this.detailUseTypeList != null && this.detailUseTypeList.length > 0 ? this.detailUseTypeList[0].value : -1;
          product.detailUseType.name = this.detailUseTypeList != null && this.detailUseTypeList.length > 0 ? this.detailUseTypeList[0].label : "";
        }
      });
    });
    /* var list: MerchandiseBranchTransfersDetail[] = [];
    if(this.listProducts != null){
      this.listProducts.forEach(product => {
        list.push(product);
      });
    }
    this.productList.forEach(product => {
      var productmerchandiserequest = new MerchandiseBranchTransfersDetail();
      productmerchandiserequest.idBranchTransferDetail = -1;
      productmerchandiserequest.idProduct = product.idProduct;
      productmerchandiserequest.packingProduct = product;
      list.push(productmerchandiserequest); 
    });
    this.listProducts = list;
    this.listProductsChange.emit(this.listProducts); */
  }
}
