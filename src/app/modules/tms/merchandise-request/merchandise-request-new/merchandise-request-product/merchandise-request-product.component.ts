import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { Product } from 'src/app/models/products/product';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { MerchandiseRequestDetail } from 'src/app/models/tms/merchandiserequestdetail';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { ProductFilter } from 'src/app/modules/products/shared/filters/product-filter';
import { ProductBranchFilter } from 'src/app/modules/products/shared/filters/productbranch-filter';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { ProductBranch } from 'src/app/modules/products/shared/view-models/product-branch.viewmodel';
import { DetailUseTypeFilter } from '../../../shared/filters/detailusetype-filter';
import { CommontmsService } from '../../../shared/service/common.service';

@Component({
  selector: 'app-merchandise-request-product',
  templateUrl: './merchandise-request-product.component.html',
  styleUrls: ['./merchandise-request-product.component.scss']
})
export class MerchandiseRequestProductComponent implements OnInit {

  @Input("merchandiseRequest") merchandiseRequest: MerchandiseRequest;
  @Input("productMerchandiseRequest") productMerchandiseRequest: MerchandiseRequestDetail;
  @Input("listProducts") listProducts: MerchandiseRequestDetail[];
  @Output() listProductsChange = new EventEmitter<MerchandiseRequestDetail[]>();
  showDialogAdvanceProductSearch: boolean = false;
  categoriesString: string;
  selectedCategories: any[] = [];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  items: MenuItem[] = [
    {
      label: 'Busqueda avanzada', command: () => {
        this.searchProducts();
      }
    }

  ];
  barProduct: string = "";
  product: PackingByBranchOffice = new PackingByBranchOffice();
  showButtonSave: boolean = false;
  showButtonAdd: boolean = true;
  submittedAdd: boolean = false;
  searchBarCode: boolean = false;
  detailUseTypeList: SelectItem[] = [];
  productList: PackingByBranchOffice[] = [];
  defectImage: DefeatImage = new DefeatImage();
  originBranchOfficeId: number = 0;
  showProductNotFound: boolean = false;
  indModule = 1;

  displayedColumns: ColumnD<any>[] =
    [
      { template: (data) => { return data.product.barcode; }, field: 'barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.product.name; }, field: 'name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.packingType.name; }, field: 'packingType.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.units; }, field: 'units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return data.existence; }, field: 'existence', header: 'Existencia', display: 'table-cell' },
    ];

  constructor(public _categoryservice: CategoryService,
    private _packingproductservice: ProductbranchofficeService,
    private commonTMSservice: CommontmsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  searchProduct() {
    if (this.merchandiseRequest.dispatchBranch.id > 0) {
      this.showButtonAdd = true;
      this.showButtonSave = false;
      //this.clearProduct();
      this.searchBarCode = true;
      if (this.barProduct != "") {
        this.searchBarCode = false;
        var filter = new ProductBranchFilter();
        filter.completeBarCode = this.barProduct;
        filter.idBranchOffice = this.merchandiseRequest.dispatchBranch.id;
        this._packingproductservice.getProductBranchOfficebyfilter(filter).subscribe((data: PackingByBranchOffice[]) => {
          if (data.length > 0) {
            this.showProductNotFound = false;
            this.product = data[0];
          }else{
            this.showProductNotFound = true;
            this.clearProduct();
          }
        })
      }else{
        this.submittedAdd = false;
        this.showProductNotFound = false;
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar una sucursal de despacho para poder buscar el producto." });
    }
  }

  saveproduct() {
    this.submittedAdd = true;
    var product = this.listProducts.find(x => x.packingProduct.product.barcode == this.product.product.barcode);
    if ((this.product != undefined && this.product.idProductBranchOfficePacking != -1) && (this.productMerchandiseRequest != undefined && this.productMerchandiseRequest.detailUseType.id != -1)
      && (this.productMerchandiseRequest != undefined || this.productMerchandiseRequest.requestedAmount > 0)) {
        this.submittedAdd = false;
        product.requestedAmount = parseInt(this.productMerchandiseRequest.requestedAmount.toString());
        product.detailUseType.name = this.detailUseTypeList.find(x => x.value == this.productMerchandiseRequest.detailUseType.id).label;
        product.detailUseType.idUseType = parseInt(this.detailUseTypeList.find(x => x.value == this.productMerchandiseRequest.detailUseType.id).title);
        this.listProductsChange.emit(this.listProducts);
        this.clearProduct();
        this.showButtonAdd = true;
        this.showButtonSave = false;
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: "El producto se editó con éxito" });
    }
  }

  searchProducts() {

  }

  addproduct() {
    this.submittedAdd = true;
    this.searchBarCode = false;
    if ((this.product != undefined && this.product.idProductBranchOfficePacking != -1) && (this.productMerchandiseRequest != undefined && this.productMerchandiseRequest.detailUseType.id != -1)
      && (this.productMerchandiseRequest != undefined || this.productMerchandiseRequest.requestedAmount > 0)) {
      this.submittedAdd = false;
      if (this.listProducts == null || this.listProducts.filter(x => x.packingProduct.product.barcode == this.product.product.barcode).length == 0) {
        this.productMerchandiseRequest.idRequestDetail = -1;
        this.productMerchandiseRequest.idProduct = this.product.idProduct;
        this.productMerchandiseRequest.packingProduct = this.product;
        this.productMerchandiseRequest.detailUseType.name = this.detailUseTypeList.find(x => x.value == this.productMerchandiseRequest.detailUseType.id).label;
        this.productMerchandiseRequest.detailUseType.idUseType = parseInt(this.detailUseTypeList.find(x => x.value == this.productMerchandiseRequest.detailUseType.id).title);
        var list: MerchandiseRequestDetail[] = [];
        if (this.listProducts != null) {
          this.listProducts.forEach(product => {
            list.push(product);
          });
        }
        
        list.push(this.productMerchandiseRequest);
        this.listProducts = list;
        this.listProductsChange.emit(this.listProducts);
        this.clearProduct();
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: "El producto se agregó con éxito" });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto ya se encuentra en la lista" });
      }

    }
  }

  clearProduct() {
    this.barProduct = "";
    this.product = new PackingByBranchOffice();
    this.productMerchandiseRequest = new MerchandiseRequestDetail();
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

  onAdvancedProductSearch() {
    this.originBranchOfficeId = this.merchandiseRequest.dispatchBranch.id;
    this.showDialogAdvanceProductSearch = true;
  }

  addproductslist() {
    var list: MerchandiseRequestDetail[] = [];
    if (this.listProducts != null) {
      this.listProducts.forEach(product => {
        list.push(product);
      });
    }
    this.productList.forEach(product => {
      var productmerchandiserequest = new MerchandiseRequestDetail();
      productmerchandiserequest.idRequestDetail = -1;
      productmerchandiserequest.idProduct = product.idProduct;
      productmerchandiserequest.packingProduct = product;
      list.push(productmerchandiserequest);
    });
    this.listProducts = list;
    this.listProductsChange.emit(this.listProducts);
  }
}
