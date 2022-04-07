import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { DetailUseType } from 'src/app/models/tms/detailusetype';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseRequestDetail } from 'src/app/models/tms/merchandiserequestdetail';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { ProductBranchFilter } from 'src/app/modules/products/shared/filters/productbranch-filter';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-advanced-product-search',
  templateUrl: './advanced-product-search.component.html',
  styleUrls: ['./advanced-product-search.component.scss']
})
export class AdvancedProductSearchComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialogAddProduct") showDialogAddProduct: boolean = false;
  @Output() showDialogAddProductChange = new EventEmitter<boolean>();
  @Output("addproductslist") addproductslist = new EventEmitter();
  @Input("branchOfficeDestinationSelected") branchOfficeDestinationSelected: SelectItem[];
  @Input("originBranchOfficeId") originBranchOfficeId: number;
  @Input("indModule") indModule: number;
  selectedProduct: PackingByBranchOffice[] = [];
  blocked: boolean = false;
  @Input("productList") productList: PackingByBranchOffice[] = [];
  @Input("listProducts") listProducts: MerchandiseBranchTransfers[] = [];
  @Input("listProductsRequest") listProductsRequest: MerchandiseRequestDetail[] = [];
  @Output("productListChange") productListChange = new EventEmitter();
  @Output("listProductsChange") listProductsChange = new EventEmitter();
  filter: ProductBranchFilter = new ProductBranchFilter();
  @ViewChild('dtpm') dtpm: Table;
  branchOfficeSelected: any[] = [];
  submittedAdd: boolean = false;

  displayedColumns: ColumnD<PackingByBranchOffice>[] =
    [
      { template: (data) => { return data.idProductBranchOfficePacking; }, header: 'idProductBranchOfficePacking', display: 'none', field: 'id' },
      { template: (data) => { return data.idProduct; }, header: 'Id', display: 'none', field: 'idProduct' },
      { template: (data) => { return data.product.barcode; }, header: 'Barra', display: 'table-cell', field: 'product.barcode' },
      { template: (data) => { return data.product.name; }, header: 'Nombre producto', display: 'table-cell', field: 'product.name' },
      { template: (data) => { return data.product.referent; }, header: 'Referencia', display: 'table-cell', field: 'product.referent' },
      { template: (data) => { return data.product.category.name; }, header: 'Categoría', display: 'table-cell', field: 'product.category.name' },
      { template: (data) => { return data.packingPresentation.name; }, header: 'Empaque', display: 'table-cell', field: 'packingPresentation.name' },
      { template: (data) => { return data.units; }, header: 'Número de unidades', display: 'table-cell', field: 'units' },
      { template: (data) => { return data.available; }, header: 'Existencia', display: 'table-cell', field: 'available' },
    ];
  constructor(public productbranchofficeservice: ProductbranchofficeService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onShow() {
    this.productList = [];
    this.selectedProduct = [];
    this.filter = new ProductBranchFilter();
  }

  onHide() {
    this.dtpm.reset();
    this.showDialogAddProduct = false;
    this.showDialogAddProductChange.emit(this.showDialogAddProduct);
  }
  search() {
    if (this.originBranchOfficeId > 0) {
      this.filter.idBranchOffice = this.originBranchOfficeId;
      this.loading = true;
      this.productbranchofficeservice.getProductBranchOfficebyfilter(this.filter).subscribe((data: PackingByBranchOffice[]) => {
        this.productList = data;
        this.loading = false;
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los datos." });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar una sucursal de despacho para poder buscar los productos." });
    }

  }

  addProducts() {
    if (this.indModule == 1) {
      var validateProduct = false;
      this.selectedProduct.forEach(product => {
        this.listProductsRequest = this.listProductsRequest == null ? [] : this.listProductsRequest = this.listProductsRequest;
        var a = this.listProductsRequest.filter(x => x.idProduct == product.idProduct).length;
        if(this.listProductsRequest.filter(x => x.idProduct == product.idProduct).length > 0){
          validateProduct = true;
        }
      });
      if (validateProduct) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Hay productos seleccionados que ya estan agregados en la lista" });
      }else{
        this.showDialogAddProduct = false;
        this.showDialogAddProductChange.emit(this.showDialogAddProduct);
        this.productListChange.emit(this.selectedProduct);
        this.addproductslist.emit();
      }
    } else {
      this.submittedAdd = true;
      if (this.branchOfficeSelected.length > 0) {
        this.branchOfficeSelected.forEach(branchOffice => {
          var branchDestination = this.listProducts.find(x => x.destinationBranch.id == branchOffice);
          this.selectedProduct.forEach(product => {
            if (branchDestination.branchTransfersDetail != null) {
              if (branchDestination.branchTransfersDetail.filter(x => x.idProduct == product.idProduct).length == 0) {
                var branchTransferDetail = new MerchandiseBranchTransfersDetail();
                branchTransferDetail.idBranchTransferDetail = -1;
                branchTransferDetail.idProduct = product.idProduct;
                branchTransferDetail.packingProduct = product;
                branchTransferDetail.detailUseType = new DetailUseType();
                branchDestination.branchTransfersDetail = branchDestination.branchTransfersDetail == null ? [] : branchDestination.branchTransfersDetail;
                branchDestination.branchTransfersDetail.push(branchTransferDetail);
              }
            } else {
              var branchTransferDetail = new MerchandiseBranchTransfersDetail();
              branchTransferDetail.idBranchTransferDetail = -1;
              branchTransferDetail.idProduct = product.idProduct;
              branchTransferDetail.packingProduct = product;
              branchTransferDetail.detailUseType = new DetailUseType();
              branchDestination.branchTransfersDetail = branchDestination.branchTransfersDetail == null ? [] : branchDestination.branchTransfersDetail;
              branchDestination.branchTransfersDetail.push(branchTransferDetail);
            }
          });
        });
        this.showDialogAddProduct = false;
        this.showDialogAddProductChange.emit(this.showDialogAddProduct);
        this.listProductsChange.emit(this.listProducts);
        this.addproductslist.emit();
      }
    }

  }
}
