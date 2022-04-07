import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierCatalogModal } from 'src/app/models/common/supplier-catalog-modal';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { DistributedBranchoffices } from 'src/app/models/srm/distributed-branchoffices';
import { DistributedProduct } from 'src/app/models/srm/distributed-product';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FilterDistributedPurchaseOrder } from '../../shared/filters/filter-distributed-purchase-order';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { SuppliercatalogService } from '../../shared/services/suppliercatalog/suppliercatalog.service';
import * as  typenegotiation from '../../shared/filters/enum-type-negotiation';
import { StatusPurchase } from '../../shared/Utils/status-purchase';
import { DistributedProductPanelComponent } from './distributed-product-panel/distributed-product-panel.component';
import { ProductcatalogService } from 'src/app/modules/products/shared/services/productcatalogservice/productcatalog.service';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { ProductCatalog } from 'src/app/modules/products/shared/view-models/product-catalog.viewmodel';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { Packing } from 'src/app/models/products/packing';
import { PurchaselistViewmodel } from '../../shared/view-models/purchaselist-viewmodel';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { Router } from '@angular/router';
import { TypeDistributionEnum } from '../../shared/Utils/type-distribution-enum';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { DistributedDocumentBase } from 'src/app/models/srm/distributed-document-base';
import { DistributedDocument } from 'src/app/models/srm/distributed-document';
import { BranchofficeModalComponent } from 'src/app/modules/common/components/branchoffice-modal/branchoffice-modal.component';
@Component({
  selector: 'app-distributed-purchase-order',
  templateUrl: './distributed-purchase-order.component.html',
  styleUrls: ['./distributed-purchase-order.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class DistributedPurchaseOrderComponent implements OnInit {
  defectImage: DefeatImage=new DefeatImage();
  _showdialog :boolean=false;
  catalogDialogVisible:boolean=false;
  PurchaseOrderDialogVisible = false;
  ProductCatalogDialogVisible = false;
  isDocument:boolean=false;
  isDistribution:boolean=true;
  BranchOfficeDialogVisible = false;
  values: Branchoffice[] = [];
  BranchOfficeValuesList:Branchoffice[]=[];
  BranchOfficeValue:Branchoffice = new Branchoffice();
  products:any[];
  _selectedColumns: any[];
  _Authservice: AuthService = new AuthService(this._httpClient);
  idCompany:number;
  idOffice:number;
  _idBranchOrigin:number;
  productDetail: DistributedProduct;
  _DistributedProductlist : DistributedProduct[]=[];
  ProductList:DistributedProduct[]=[];
  listsupplier: SupplierCatalogModal[];
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Output("RefreshDistributedStatusChange") RefreshDistributedStatusChange = new EventEmitter<Groupingpurchaseorders>();
  @Input("_idCompany") _idCompany: number = -1;
  @ViewChild("chipId") chipId: ElementRef;
  @ViewChild(BranchofficeModalComponent) branchOfficeModalViewChild: BranchofficeModalComponent;
  typenegotiation: number[] = [];
  typenegotiationIDs = { ...typenegotiation };
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  Distributedfilter:FilterDistributedPurchaseOrder= new FilterDistributedPurchaseOrder();
  selectedProducts:DistributedProduct[]=[];
  contproductactive: number = 0;
  contproductconsigment: number = 0;
  contproductdesincoporate: number = 0;
  @ViewChild(DistributedProductPanelComponent) _ProductPanel: DistributedProductPanelComponent;
  @ViewChild('dtu') dtu: Table;
  DisableNext: boolean = false;
  loading: boolean = false;
  listproductpurchase: PurchaseOrderProduct[];
  listproductcatalog: ProductCatalog[];
  packaging: Packing;
  isfilter:boolean=true;
 // _PurchaseOrderDocumentsList:PurchaselistViewmodel[]=[];
  _PurchaseOrderDocumentsList:DistributedDocumentBase[]=[];
  EnumTypeDistribution: typeof TypeDistributionEnum = TypeDistributionEnum;
  isDistributedComplete:boolean=false;
  permissionsIDs = {...Permissions};
  items: MenuItem[] = [
    {
      label: 'Conocido', icon: 'pi pi-tag', command: () => {
        this._showdialog = true;
      }
    },
    {
      label: 'Desde otra orden', icon: 'pi pi-folder', command: () => {
        this.PurchaseOrderDialogVisible = true;
      }
    },
    {
      label: 'Catálogo del proveedor', icon: 'pi pi-id-card', command: () => {
        this.catalogDialogVisible = true;
      }
    },
    {
      label: 'Catálogo de productos', icon: 'pi pi-book', command: () => {
        this.ProductCatalogDialogVisible = true;
      }
    }

  ];

  displayedProductsColumns: ColumnD<DistributedProduct>[] =
  [
    { template: (data) => { return data.productId; }, header: 'Id',field:'productId' ,display: 'none' },
    { template: (data) => { return data.image; }, header: 'Imagen', field: 'image', display: 'table-cell' },
    { template: (data) => { return data.name; }, header: 'Producto', field: 'name', display: 'table-cell' },
    { template: (data) => { return data.gtin; }, header: 'Barra', field: 'gtin', display: 'table-cell' },
    { template: (data) => { return data.packaging; }, header: 'Empaque', field: 'packaging', display: 'table-cell' },
    { template: (data) => { return data.internalReference; }, header: 'Referencia', field: 'internalReference', display: 'table-cell' },
    { template: (data) => { return data.packagingQuantity; }, header: 'Cantidad de empaques', field: 'packagingQuantity', display: 'table-cell' },
    { template: (data) => { return data.unitPerPackaging; }, header: 'Unidades por empaque', field: 'unitPerPackaging', display: 'table-cell' },
    { field: 'indHeavy', header: 'Pesado', display: 'table-cell' },
   
  ];
  displayedBranchOfficeColumns: ColumnD<DistributedBranchoffices>[] =
  [
    { template: (data) => { return data.idBranchOffice; }, header: 'idBranchOffice',field:'idBranchOffice' ,display: 'none' },
    { template: (data) => { return data.idDistributedPurchaseOrderDetail; }, header: 'idDistributedPurchaseOrderDetail',field:'idDistributedPurchaseOrderDetail' ,display: 'none' },
    { template: (data) => { return data.branchOfficeName; }, header: 'Sucursal', field: 'branchOfficeName', display: 'table-cell' },
    { template: (data) => { return data.distributedPackagingQuantity; }, header: 'Cantidad de empaque', field: 'distributedPackagingQuantity', display: 'table-cell' },
    { template: (data) => { return data.distributedTotalQuantity; }, header: 'Total de unidades a distribuir', field: 'distributedTotalQuantity', display: 'table-cell' }
   
  ];

displayedBaseDocumentsColumns: ColumnD<DistributedDocumentBase>[] =
[
  { template: (data) => { return data.idOrderPurchase; }, header: 'idOrderPurchase',field:'idOrderPurchase' ,display: 'none'},
  { template: (data) => { return data.idBranchOffice; }, header: 'idBranchOffice',field:'idBranchOffice' ,display: 'none' },
  {template: (data) => { return data.baseDocumentIdentifierNumber; }, field: 'baseDocumentIdentifierNumber', header: 'Número de documento', display: 'table-cell'},
  {template: (data) => { return data.branchOfficeName; }, field: 'branchOfficeName', header: 'Sucursal', display: 'table-cell'},
  {template: (data) => { return data.status; }, field: 'status', header: 'Estatus', display: 'table-cell'},
  {template: (data) => { return data.operationDocumentBase; }, field: 'operationDocumentBase', header: 'Documento de operación', display: 'table-cell'},
  {template: (data) => { return data.distributionType; }, field: 'distributionType', header: 'Tipo de distribución', display: 'table-cell'},
  {template: (data) => { return data.items; }, field: 'items', header: 'Número de ítems', display: 'table-cell'},
  {template: (data) => { return data.createdby; }, field: 'createdby', header: 'Creado por', display: 'table-cell'},
];

displayedDocumentsColumns: ColumnD<DistributedDocument>[] =
[
  { template: (data) => { return data.documentRequestId; }, header: 'documentRequestId',field:'documentRequestId' ,display: 'none'},
  { template: (data) => { return data.idBranchOffice; }, header: 'idBranchOffice',field:'idBranchOffice' ,display: 'none'},
  { template: (data) => { return data.documentRequestIndentifier; }, field: 'documentRequestIndentifier',header:'Número de petición' ,display: 'table-cell'},
  { template: (data) => { return data.branchOfficeName; }, field: 'branchOfficeName',header:'Sucursal' ,display: 'table-cell'},
  { template: (data) => { return data.status; }, field: 'brancstatushOfficeName',header:'Estatus' ,display: 'table-cell'},
  { template: (data) => { return data.operationDocument; }, field: 'operationDocument',header:'Documento de operación' ,display: 'table-cell'},
  { template: (data) => { return data.idRequestType; }, field: 'idRequestType',header:'idRequestType' ,display: 'none'},
  { template: (data) => { return data.requestType; }, field: 'requestType',header:'Tipo de petición' ,display: 'table-cell'},
  { template: (data) => { return data.createdby; }, field: 'createdby',header:'Creado por' ,display: 'table-cell'},
];


  constructor(private _httpClient: HttpClient,
             private messageService: MessageService,
             public datepipe: DatePipe,
             public _service: PurchaseorderService, 
             private confirmationService: ConfirmationService,
             private supplierservice: SuppliercatalogService,
             private _productcatalogservice: ProductcatalogService,
             private _packingservice: PackingService,
             private readonly loadingService: LoadingService,
             private router: Router,
             public userPermissions: UserPermissions) { }


  ngOnInit(): void {
    this._selectedColumns = this.displayedProductsColumns;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.displayedProductsColumns.filter(col => val.includes(col));
  }
  onShow()
  {
    this.onLoadDistributedPurchaseOrder();
  }

  onLoadDistributedPurchaseOrder()
  {
    this.Distributedfilter.idAgrupationOrderPurchase =this.PucharseOrderHeader.idAgrupationOrderPurchase;
    this._service.GetDistributedPurchaseOrder(this.Distributedfilter).subscribe((data: DistributedProduct[]) => {
      this._idBranchOrigin=this.PucharseOrderHeader.purchase.idBranchRequest;
      this._DistributedProductlist = data;
      this.isDistributedComplete = this._DistributedProductlist.some(x=>x.idGroupStatus == 3) ? true : false;
      if(this._DistributedProductlist.length>0)
      {

        //var totalItemProducts =this._DistributedProductlist.reduce(function(a,b){ return a + b.distributedItems;},0);
        this.EmitPurchaseHeaderData();
        this._DistributedProductlist.forEach(DP => {
          DP.branchOffices.forEach(BO => {
            this.BranchOfficeValue = new Branchoffice();
            this.BranchOfficeValue.id = BO.idBranchOffice;
            this.BranchOfficeValue.branchOfficeName = BO.branchOfficeName;
            this.BranchOfficeValuesList.push(this.BranchOfficeValue);
          
         });
      });
    
        this.values = this.BranchOfficeValuesList.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
        var filters: FilterPurchaseOrder = new FilterPurchaseOrder();
        filters.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
        this._service.GetDistributedDocuments(filters).subscribe((data: DistributedDocumentBase[]) => { 
          this._PurchaseOrderDocumentsList = data;
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
        });
      }else
      {
        if( this.BranchOfficeValuesList.length == 0)
        {
          this.BranchOfficeValue.id = this.PucharseOrderHeader.purchase.idBranchRequest;
          this.BranchOfficeValue.branchOfficeName = this.PucharseOrderHeader.purchase.branchRequest;
          this.BranchOfficeValuesList.push(this.BranchOfficeValue);
          this.values = this.BranchOfficeValuesList;
        }else
        {
          this.BranchOfficeValuesList = this.values;
        }

      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }


  EmitBranchOfficeList(event)
  {
    this.values= event.branchOfficeList;
  }

  onChangeChip(event){
    if (!(event.keyCode == 8 || event.keyCode == 46)){
        return false
    }
}

FailRemoveChip(event)
{
  this.messageService.add({ severity: 'error', summary: 'Error', detail: "No puede eliminar la sucursal porque la orden ya se encuentra distribuida." });
}

onRemoveChip(event)
{
  var count = 0 ;
  if(!this.isDistributedComplete)
  {
    if(event.value.id != this._idBranchOrigin)
    {
        if(this._DistributedProductlist.length > 0)
        {
          this._DistributedProductlist.forEach(products => {
            const index: number = products.branchOffices.findIndex(x=> x.idBranchOffice == event.value.id );
            if(index != -1)
            {
              var branchoffice =  products.branchOffices.filter(val => val.idBranchOffice == event.value.id );
              if(branchoffice[0].distributedPackagingQuantity > 0)
              {
                count = count+1
              }else{
                if (index !== -1) {
                  products.branchOffices.splice(index, 1);
                  this.branchOfficeModalViewChild.onRemoveSelected(event.value.id)
              }   
              }  
            }
        });
        }else
        {
          this.branchOfficeModalViewChild.onRemoveSelected(event.value.id)
        }

    if(count >= 1)
    {
      this.values.push(event.value);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "No puede eliminar la sucursal porque tiene cantidades distribuidas." });
    }
    }else
    {
      this.values.push(event.value);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "No puede eliminar la sucursal base de la orden de compra." });
    }


  }else
  {
    this.values.push(event.value);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "No puede eliminar la sucursal porque la orden ya se encuentra distribuida." });
  }

}

onToggleBranchOfficeModal(visible: boolean)
{
  this.BranchOfficeDialogVisible = visible;
}

  changeDistributionTab(tab:number)
  {
    if(tab == 1)
    {
      this.isDocument=false;
      this.isDistribution=true;
    }else
    {
      this.isDocument=true;
      this.isDistribution=false;
    }
  }


  onSubmitDistributedProduct(event)
  {

   this.ProductList.push(event.order);
   this._service.SaveProductDistributedOrder(this.ProductList, false).subscribe((data: number) => {
     if (data > 0) {
       this.messageService.add({key:"msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
       this.onLoadDistributedPurchaseOrder();
       this.ProductList = [];
      // this.EmitPurchaseHeaderData();
       //this.PucharseOrderHeader.distributedItems = this._DistributedProductlist.reduce(function(a,b){ return a + b.distributedItems;},0);
       //this.RefreshDistributedStatusChange.emit(this.PucharseOrderHeader);
      
     }
   }, (error: HttpErrorResponse) => {
     this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
   });
  }


  deleteProducts(product:DistributedProduct,selectedProducts:DistributedProduct[]=[])
  {  
    var productToinsert : DistributedProduct[] = [];
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: product != null ? '¿Está seguro que desea eliminar este registro?':'¿Está seguro que desea eliminar los registros seleccionados?',
      accept: () => {
            if(product != null)
               productToinsert.push(product);
            else
               productToinsert = selectedProducts;
            
             this._service.RemoveDistributedProducts(productToinsert,false).subscribe((data: number) => {
              if (data == 0) {
                this.messageService.add({severity:'success', summary: 'Éxito', detail: product != null ? 'Producto eliminado con éxito' : 'Productos eliminados con éxito', life: 3000});
                this._DistributedProductlist = this._DistributedProductlist.filter(val => !productToinsert.includes(val));
                this.selectedProducts = [];
               }
         }, (error: HttpErrorResponse) =>
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
         ));
      },
    });
  }


  EditProduct(product:DistributedProduct)
  {
     let productToCopy = JSON.stringify(product);
     this._ProductPanel._product= Object.assign(new DistributedProduct(), JSON.parse(productToCopy))
     this._showdialog = true;
  }


  DistributePurchaseOrder()
  {
    if(this.values.length > 1)
    {
      if(this._DistributedProductlist.length > 0)
      {
        var filters: FilterPurchaseOrder = new FilterPurchaseOrder();
        filters.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
        if(this.PucharseOrderHeader.idTypeDistribution == this.EnumTypeDistribution.distribuida)
        {
          //DISTRIBUIDA
          this._service.DistributePurchaseOrder(filters).subscribe((data) => {
            if (data) {
                this.messageService.add({severity:'success', summary: 'Éxito', detail: "Orden distribuida con éxito.", life: 3000});
                this._PurchaseOrderDocumentsList = data;
                this.isDistributedComplete = true;
                this.PucharseOrderHeader.idGroupStatus = this.EnumTypeDistribution.distribuida ;
                this.RefreshDistributedStatusChange.emit(this.PucharseOrderHeader);
             }
            }, (error: HttpErrorResponse) =>
              
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
           ));
        }else if(this.PucharseOrderHeader.idTypeDistribution == this.EnumTypeDistribution.facturaCentralizada || this.PucharseOrderHeader.idTypeDistribution == this.EnumTypeDistribution.consolidada)
        {
          //FACTURA CENTRALIZADA o CONSOLIDADA
          this._service.CentralizedOrConsolidatedPurchaseOrder(filters).subscribe((data) => {
            if (data) {
                this.messageService.add({severity:'success', summary: 'Éxito', detail: "Orden distribuida con éxito.", life: 3000});
                this._PurchaseOrderDocumentsList = data;
                this.isDistributedComplete = true;
                this.PucharseOrderHeader.idGroupStatus = this.EnumTypeDistribution.distribuida ;
                this.RefreshDistributedStatusChange.emit(this.PucharseOrderHeader);
             }
            }, (error: HttpErrorResponse) =>
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
           ));
        }
      }else
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos un producto para poder distribuir." });
      }


    }
    else
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar más de una sucursal para poder distribuir." });
    }
  }


  onHidecatalogsupplier(visible: boolean) {
    this.catalogDialogVisible = visible;
  };

  onSubmitcatalogsupplier(data) {
    if (data != null) {

      let _purchaseOrderDetailaux = this._DistributedProductlist;
      let cont = 0;
      this.loadingService.startLoading('wait_loading');
      this.supplierservice.getSupplierCatalogExpressfilterverified(data.supplier, this._idBranchOrigin).subscribe((dat: SupplierCatalogModal[]) => {
        this.listsupplier = dat;
        for (let i = 0; i < this.listsupplier.length; i++) {
          cont += 1
          this.productDetail = new DistributedProduct();
          this.productDetail.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
          this.productDetail.productId = this.listsupplier[i].idProduct;
          this.productDetail.name = this.listsupplier[i].name;
          this.productDetail.gtin = this.listsupplier[i].barra;
          this.productDetail.internalReference = this.listsupplier[i].internalRef;
          this.productDetail.indHeavy = this.listsupplier[i].indHeavy;
          this.productDetail.category = this.listsupplier[i].category;
          this.productDetail.idPackagingType = this.listsupplier[i].detail[0].idTipoEmpack;
          this.productDetail.packagingType = this.listsupplier[i].detail[0].typePacking;
          this.productDetail.idPackaging = this.listsupplier[i].detail[0].idPacking;
          this.productDetail.packaging = this.listsupplier[i].detail[0].presentationPacking;
          this.productDetail.unitPerPackaging = this.listsupplier[i].detail[0].unitPerPackaging;
          this.productDetail.status=this.listsupplier[i].status;
          this.productDetail.indconsigment=this.listsupplier[i].indconsigment;
          this.values.forEach( bo => {
            var branchOfficeModel: DistributedBranchoffices = new DistributedBranchoffices();
            branchOfficeModel.idBranchOffice =bo.id;
            branchOfficeModel.branchOfficeName = bo.branchOfficeName;
            branchOfficeModel.productId = this.productDetail.productId;
            this.productDetail.branchOffices.push(branchOfficeModel);
          });
          //this.productDetail.idOrderPurchase = this._idOrderPurchase;
          if (this.productDetail.status == 2)/// verificar si  el producto esta desincorporado en al sucursal
            this.contproductdesincoporate += 1
          if (_purchaseOrderDetailaux.findIndex(x => x.productId == this.productDetail.productId && this.productDetail.status != 2) == -1) {
            if (this.productDetail.status == 0)
              this.contproductactive += 1
            if (this.productDetail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
              this.contproductconsigment += 1

            _purchaseOrderDetailaux.push(this.productDetail);
          }
        }
        //this._purchaseOrderDetail = _purchaseOrderDetailaux;
        //guardado
        if (cont == this.listsupplier.length) {
          if (this.contproductdesincoporate > 0)
            this.messageService.add({  key:"msgwarn",severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no serán agregados a la orden." });
          if (_purchaseOrderDetailaux.length > 0) {
            this._service.SaveProductDistributedOrder(_purchaseOrderDetailaux, false).subscribe((data: number) => {
              if (data > 0) {
                this.messageService.add({ key:"msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
                this.onLoadDistributedPurchaseOrder();
                this.dtu.reset();
               // this.EmitPurchaseHeaderData();
                if (this.contproductactive > 0)
                  this.messageService.add({ key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no se encuentran activos en la sucursal." });
                if (this.contproductconsigment > 0)
                  this.messageService.add({ key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });

                this.contproductactive = 0
                this.contproductconsigment = 0  
                this.DisableNext = false;
                this.loadingService.stopLoading(); 
              }
            }, (error: HttpErrorResponse) =>{
                this.loadingService.stopLoading();
                this.messageService.add({ key:"msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." })
             } );
          }
          this.contproductdesincoporate = 0
        }
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
      });
    }
  }

  onHidePurchaseOrderModal(visible: boolean) {
    this.PurchaseOrderDialogVisible = visible;
  }

  onSubmitPurchaseOrderModal(data) {
    if (data != null) {
      let cont = 0;
      let _purchaseOrderDetailaux = this._DistributedProductlist;
      this.loadingService.startLoading('wait_loading');
      this._service.getPurchaseOrderDetailVerified(data.PurchaseOrders, this._idBranchOrigin).subscribe((dat: PurchaseOrderProduct[]) => {
        this.listproductpurchase = dat;
        for (let i = 0; i < this.listproductpurchase.length; i++) {
          let detail = new DistributedProduct();
          detail.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
          detail.productId = this.listproductpurchase[i].productId;
          detail.name = this.listproductpurchase[i].name;
          detail.gtin = this.listproductpurchase[i].gtin;
          detail.internalReference = this.listproductpurchase[i].internalReference;
          detail.indHeavy = this.listproductpurchase[i].indHeavy;
          detail.category = this.listproductpurchase[i].category;
          detail.idPackagingType = this.listproductpurchase[i].idPackagingType;
          detail.packagingType = this.listproductpurchase[i].packagingType;
          detail.idPackaging = this.listproductpurchase[i].idPackaging;
          detail.packaging = this.listproductpurchase[i].packaging;
          detail.unitPerPackaging = this.listproductpurchase[i].unitPerPackaging;
          //detail.idOrderPurchase = this._idOrderPurchase;
          detail.status=this.listproductpurchase[i].status
          detail.indconsigment=this.listproductpurchase[i].indconsigment
          this.values.forEach( bo => {
            var branchOfficeModel: DistributedBranchoffices = new DistributedBranchoffices();
            branchOfficeModel.idBranchOffice =bo.id;
            branchOfficeModel.branchOfficeName = bo.branchOfficeName;
            branchOfficeModel.productId = detail.productId;
            detail.branchOffices.push(branchOfficeModel);
          });
          if (detail.status == 2)/// verificar si  el producto esta desincorporado en al sucursal
            this.contproductdesincoporate += 1
          if (_purchaseOrderDetailaux.findIndex(x => x.productId == detail.productId && detail.status != 2) == -1) {
            if (detail.status == 0)
              this.contproductactive += 1
            if (detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
              this.contproductconsigment += 1


            _purchaseOrderDetailaux.push(detail);
          }
          cont += 1;
        }
        //this._purchaseOrderDetail=_purchaseOrderDetailaux;
        //guardado
        if (cont == this.listproductpurchase.length) {
          if (this.contproductdesincoporate > 0)
            this.messageService.add({ key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
          if (_purchaseOrderDetailaux.length > 0) {
            this._service.SaveProductDistributedOrder(_purchaseOrderDetailaux, false).subscribe((data: number) => {
              if (data > 0) {
                this.onLoadDistributedPurchaseOrder();
                this.dtu.reset();
                //this.EmitPurchaseHeaderData();
                if (this.contproductactive > 0)
                  this.messageService.add({ key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no se encuentran activos en la sucursal." });
                if (this.contproductconsigment > 0)
                  this.messageService.add({ key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });

                this.contproductactive = 0
                this.contproductconsigment = 0
                this.DisableNext = false;
                this.loadingService.stopLoading();
              }
            }, (error: HttpErrorResponse) =>{
               this.loadingService.stopLoading();
              this.messageService.add({ key:"msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
              )});
          }
          this.contproductdesincoporate = 0
        }

      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ key:"msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
      });
    }
  }

  onHideProductCatalogModal(visible: boolean) {
    this.ProductCatalogDialogVisible = visible;
  }

  
  onSubmitProductCatalogModal(data) {

    if (data != null) {
      let cont = 0;
      let _purchaseOrderDetailaux =this._DistributedProductlist;
      this.loadingService.startLoading('wait_loading');
      this._productcatalogservice.getProductCatalogbyfilterverified(data.Products, this._idBranchOrigin)
        .subscribe((dat: ProductCatalog[]) => {
          this.listproductcatalog = dat;
          for (let i = 0; i < this.listproductcatalog.length; i++) {
            let filters: PackingFilter = new PackingFilter();
            let detail = new DistributedProduct();
            detail.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
            detail.productId = this.listproductcatalog[i].productId;
            detail.name = this.listproductcatalog[i].name;
            detail.gtin = this.listproductcatalog[i].barcode;
            detail.internalReference = this.listproductcatalog[i].internalRef;
            detail.indHeavy = this.listproductcatalog[i].indHeavy;
            detail.category = this.listproductcatalog[i].category;
            detail.idPackaging = this.listproductcatalog[i].packingId;
            detail.status = this.listproductcatalog[i].statusi
            detail.indconsigment = this.listproductcatalog[i].indconsigment;
            this.values.forEach( bo => {
              var branchOfficeModel: DistributedBranchoffices = new DistributedBranchoffices();
              branchOfficeModel.idBranchOffice =bo.id;
              branchOfficeModel.branchOfficeName = bo.branchOfficeName;
              branchOfficeModel.isActive = detail.status == 1 ? true : false;
              branchOfficeModel.productId = detail.productId;
              detail.branchOffices.push(branchOfficeModel);
            });
            filters.active = 1;
            filters.productId = detail.productId;
            filters.id = detail.idPackaging
            this._packingservice.getPackingbyfilter(filters)
              .subscribe((data) => {
                data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
                this.packaging = data[0];
                detail.packaging = this.packaging.packagingPresentation.name;
                detail.packagingType = this.packaging.packingType.name;
                detail.idPackagingType = this.packaging.packingType.id;
                detail.unitPerPackaging = this.packaging.units;
                //detail.idOrderPurchase = this._idOrderPurchase;
  
                if (detail.status == 2)
                  this.contproductdesincoporate += 1;
                if (_purchaseOrderDetailaux.findIndex(x => x.productId == detail.productId) == -1 && detail.status != 2) {
                  if (detail.status == 0)
                    this.contproductactive += 1
                  if (detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
                    this.contproductconsigment += 1
                  _purchaseOrderDetailaux.push(detail);
                }
                cont += 1
                if (cont == this.listproductcatalog.length) {
                  if (this.contproductdesincoporate > 0)
                    this.messageService.add({  key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
                  if (_purchaseOrderDetailaux.length > 0) {
                    this._service.SaveProductDistributedOrder(_purchaseOrderDetailaux, false).subscribe((data: number) => {
                      if (data > 0) {
                        this.messageService.add({ key:"msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
                        this.onLoadDistributedPurchaseOrder();
                        this.dtu.reset();
                        //this.EmitPurchaseHeaderData();
                        if (this.contproductactive > 0)
                            this.messageService.add({key:"msgwarn", severity:'warn', summary: 'Advertencia', detail: 'Existen productos que no se encuentran activos en la sucursal.'});               
                        if (this.contproductconsigment > 0)
                          this.messageService.add({ key:"msgwarn",severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });
                        this.contproductactive = 0
                        this.contproductconsigment = 0

                      }
                    }, (error: HttpErrorResponse) =>
                      this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
                      ));
                  }
                  this.contproductdesincoporate = 0
                }
                this.DisableNext = false;
              }, (error) => {
                console.log(error);
              });

          }
          //guerdado        
          this.loadingService.stopLoading();
        }, (error: HttpErrorResponse) => {
          this.loading = false;
          this.loadingService.stopLoading();    
          this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
        });
    }
  }

  onSubmitProductCatalogModalA(data)
  {
    if (data != null) {
      let cont = 0;
      let _purchaseOrderDetailaux =this._DistributedProductlist;
      this.loadingService.startLoading('wait_loading');
      this.values.forEach( bo => {
        var branchOfficeModel: DistributedBranchoffices = new DistributedBranchoffices();
        branchOfficeModel.idBranchOffice =bo.id;
        branchOfficeModel.branchOfficeName = bo.branchOfficeName;
        //branchOfficeModel.isActive = detail.status == 1 ? true : false;
        //detail.branchOffices.push(branchOfficeModel);

        this._productcatalogservice.getProductCatalogbyfilterverified(data.Products,  branchOfficeModel.idBranchOffice)
        .subscribe((dat: ProductCatalog[]) => {
          this.listproductcatalog = dat;
          for (let i = 0; i < this.listproductcatalog.length; i++) {
            let filters: PackingFilter = new PackingFilter();
            let detail = new DistributedProduct();
            detail.idAgrupationOrderPurchase = this.PucharseOrderHeader.idAgrupationOrderPurchase;
            detail.productId = this.listproductcatalog[i].productId;
            detail.name = this.listproductcatalog[i].name;
            detail.gtin = this.listproductcatalog[i].barcode;
            detail.internalReference = this.listproductcatalog[i].internalRef;
            detail.indHeavy = this.listproductcatalog[i].indHeavy;
            detail.category = this.listproductcatalog[i].category;
            detail.idPackaging = this.listproductcatalog[i].packingId;
            detail.status = this.listproductcatalog[i].statusi
            detail.indconsigment = this.listproductcatalog[i].indconsigment;
            if(detail.status != 2)
            {
              branchOfficeModel.productId = detail.productId;
              branchOfficeModel.isActive = detail.status == 1 ? true : false;
              detail.branchOffices.push(branchOfficeModel);
            }
            filters.active = 1;
            filters.productId = detail.productId;
            filters.id = detail.idPackaging
            this._packingservice.getPackingbyfilter(filters)
              .subscribe((data) => {
                data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
                this.packaging = data[0];
                detail.packaging = this.packaging.packagingPresentation.name;
                detail.packagingType = this.packaging.packingType.name;
                detail.idPackagingType = this.packaging.packingType.id;
                detail.unitPerPackaging = this.packaging.units;
                //detail.idOrderPurchase = this._idOrderPurchase;
  
                if (detail.status == 2)
                  this.contproductdesincoporate += 1;
                if (_purchaseOrderDetailaux.findIndex(x => x.productId == detail.productId) == -1 && detail.status != 2) {
                  if (detail.status == 0)
                    this.contproductactive += 1
                  if (detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
                    this.contproductconsigment += 1
                  _purchaseOrderDetailaux.push(detail);
                }
                cont += 1
                if (cont == this.listproductcatalog.length) {
                  if (this.contproductdesincoporate > 0)
                    this.messageService.add({  key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });

                  this.contproductdesincoporate = 0
                }
                this.DisableNext = false;
              }, (error) => {
                console.log(error);
              });

          }
          //guerdado        
          this.loadingService.stopLoading();
        }, (error: HttpErrorResponse) => {
          this.loading = false;
          this.loadingService.stopLoading();    
          this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
        });
      });
    
      if (_purchaseOrderDetailaux.length > 0) {
       
        this._service.SaveProductDistributedOrder(_purchaseOrderDetailaux, false).subscribe((data: number) => {
          if (data > 0) {
            this.messageService.add({ key:"msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
            this.onLoadDistributedPurchaseOrder();
            this.dtu.reset();
            //this.EmitPurchaseHeaderData();
            if (this.contproductactive > 0)
                this.messageService.add({key:"msgwarn", severity:'warn', summary: 'Advertencia', detail: 'Existen productos que no se encuentran activos en la sucursal.'});               
            if (this.contproductconsigment > 0)
              this.messageService.add({ key:"msgwarn",severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });
            this.contproductactive = 0
            this.contproductconsigment = 0

          }
        }, (error: HttpErrorResponse) =>
          this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
          ));
      }
    }
  }

  OpenDocumentRoute(id:number)
  {
    this.router.navigateByUrl(`/srm/purchase-order/${id}`), { skipLocationChange: true };
  }

  EmitPurchaseHeaderData()
  {
    this.PucharseOrderHeader.distributedItems = this._DistributedProductlist.reduce(function(a,b){ return a + b.distributedItems;},0);
    this.RefreshDistributedStatusChange.emit(this.PucharseOrderHeader);
  }

  save()
  {
    this._service.SaveProductDistributedOrder(this._DistributedProductlist, false).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({key:"msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
        this.onLoadDistributedPurchaseOrder();
        //this.ProductList = [];
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }
}
