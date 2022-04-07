import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Category } from 'src/app/models/masters-mpc/category';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { DetailUseType } from 'src/app/models/tms/detailusetype';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { MerchandiseRequestDetail } from 'src/app/models/tms/merchandiserequestdetail';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { DetailUseTypeFilter } from '../../shared/filters/detailusetype-filter';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { UseTypeFilter } from '../../shared/filters/usetype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { StatusRequest } from '../shared/enum/status-request';
import { MerchandiseRequestFilter } from '../shared/filters/merchandise-request-filter';
import { MerchandiseRequestService } from '../shared/service/merchandise-request.service';
import { MerchandiseRequestProductComponent } from './merchandise-request-product/merchandise-request-product.component';

@Component({
  selector: 'app-merchandise-request-new',
  templateUrl: './merchandise-request-new.component.html',
  styleUrls: ['./merchandise-request-new.component.scss']
})
export class MerchandiseRequestNewComponent implements OnInit {

  indmenu: number = 0;
  indInitTime: boolean = false;
  indInitResu: boolean = false;
  indInitPause: boolean = false;
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;
  requestTypeList: SelectItem[] = [];
  useTypeList: SelectItem[] = [];
  branchOfficeList: SelectItem[] = [];
  CategoriesList: SelectItem[] = [];
  idMerchadiseRequest: number = 0;
  idBranchOfficeDispachtSelected: number = 0;
  merchandiseRequest: MerchandiseRequest = new MerchandiseRequest();
  merchandiseRequestDB: MerchandiseRequest = new MerchandiseRequest();
  productMerchandiseRequest: MerchandiseRequestDetail = new MerchandiseRequestDetail();
  listProducts: MerchandiseRequestDetail[] = [];
  submittedSave: boolean = false;
  @ViewChild(MerchandiseRequestProductComponent) MerchandiseRequestProductComponent: MerchandiseRequestProductComponent;
  statusRequest = StatusRequest;
  indModule: number = 0;

  displayedColumns: ColumnD<MerchandiseRequestDetail>[] =
    [
      { template: (data) => { return data.packingProduct.product.barcode; }, field: 'packingProduct.product.barcode', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.product.name; }, field: 'packingProduct.product.name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.product.referent; }, field: 'packingProduct.product.referent', header: 'Referencia', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.packingPresentation.name; }, field: 'packingProduct.packingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.units; }, field: 'packingProduct.units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return data.detailUseType.name; }, field: 'detailUseType.name', header: 'Detalle tipo de uso', display: 'table-cell' },
      { template: (data) => { return data.packingProduct.available; }, field: 'packingProduct.available', header: 'Existencia', display: 'table-cell' },
      { template: (data) => { return data.requestedAmount; }, field: 'requestedAmount', header: 'Cantidad solicitada', display: 'table-cell' },
      { template: (data) => { return data.quantityDispatched; }, field: 'quantityDispatched', header: 'Cantidad despachada', display: 'table-cell' },
    ];

  constructor(public merchadiseRequestService: MerchandiseRequestService,
    private commonTMSservice: CommontmsService,
    private commonService: CommonService,
    private branchOfficeService: BranchofficeService,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private _categoryservice: CategoryService,
    public breadcrumbService: BreadcrumbService,
    private _Authservice: AuthService,
    private loadingService: LoadingService) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Solicitudes de mercancía', routerLink: ['/tms/merchandise-request-list'] }
    ]);
  }

  ngOnInit(): void {
    this.idMerchadiseRequest = this.actRoute.snapshot.params['id'];
    this.indModule = parseInt(this.actRoute.snapshot.params['indModule']);
    if (this.idMerchadiseRequest == 0) {
      this.onLoadUseTypeList(false);
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Desea generar el número de documento?',
        accept: () => {
          this.insertMerchandiseRequest();
          this.requestTypeList = this.requestTypeList.filter(x => x.value != 1);
        },
        reject: (type) => {
          if(this.indModule == 1){
            this.router.navigate(['/tms/merchandise-request-list']);
          }else if(this.indModule == 2){
            this.router.navigate(['/tms/calendar']);
          }
        }
      })
    } else {
      this.onLoadMerchandiseRequest(this.idMerchadiseRequest);
    }
    this.onLoadRequestTypeList();

    this.onLoadBranchOfficeList();
    this.onLoadCategorys();
  }

  PlayTask() {

    this.cdTimer.start();
    this.indInitTime = true;
    this.indInitPause = true;
  }

  PauseTask() {
    this.cdTimer.stop();
    this.indInitPause = false;
    this.indInitResu = true;
  }

  ResumeTask() {
    this.cdTimer.resume();
    this.indInitPause = true;
    console.log("this.cdtimer");
    console.log(this.cdTimer);
    console.log("get");
    console.log(this.cdTimer.get());
    this.indInitResu = false;
    this.cdTimer.get();
    console.log('In Progress [' + this.cdTimer.get().tick_count.toString().padStart(4, '0') + ']');

  }

  onChangeUseType() {
    this.MerchandiseRequestProductComponent.onLoadDetailUseTypeList(this.merchandiseRequest.useType.id);
    var detail;
    var filter: DetailUseTypeFilter = new DetailUseTypeFilter();
    filter.idUseType = this.merchandiseRequest.useType.id;
    this.commonTMSservice.getDetailUseTypesList(filter)
      .subscribe((data) => {
        detail = data[0];
        this.listProducts.forEach(product => {
          if (product.detailUseType.idUseType != this.merchandiseRequest.useType.id) {
            product.detailUseType.id = detail.id;
            product.detailUseType.name = detail.name;
            product.detailUseType.idUseType = detail.idUseType;
          }
        });
      }, (error) => {
        console.log(error);
      });

  }

  onLoadRequestTypeList() {
    var filter: RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getRequestTypesList(filter)
      .subscribe((data) => {
        this.requestTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadUseTypeList(ind: boolean) {
    var filter: UseTypeFilter = new UseTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getUseTypesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.useTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
        if (ind == true) {
          if (this.merchandiseRequest.requestType.id != 1) {
            this.requestTypeList = this.requestTypeList.filter(x => x.value != 1);
          }
        }
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

  onDelete(productDetail: MerchandiseRequestDetail) {
    if (productDetail.idRequestDetail == -1) {
      this.listProducts = this.listProducts.filter(x => x.packingProduct.product.barcode != productDetail.packingProduct.product.barcode);
      this.MerchandiseRequestProductComponent.clearProduct();
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Este producto será eliminado. ¿Desea continuar?',
        accept: () => {
          this.merchadiseRequestService.DeleteMerchandiseRequestDetail(productDetail.idRequestDetail, parseInt(this.idMerchadiseRequest.toString())).subscribe((resp: DatabaseResult) => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Producto eliminado con éxito" });
            this.onLoadMerchandiseRequest(this.merchandiseRequest.id);
            this.MerchandiseRequestProductComponent.clearProduct();
          }, (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las solicitudes" });
          });
          //this.insertMerchandiseRequest();
          //this.requestTypeList = this.requestTypeList.filter(x => x.value != 1);
        },
        reject: (type) => {
        }
      })
    }
  }

  onEdit(productDetail: MerchandiseRequestDetail) {
    this.productMerchandiseRequest = new MerchandiseRequestDetail();
    this.productMerchandiseRequest.idMerchandiseRequest = productDetail.idMerchandiseRequest;
    this.productMerchandiseRequest.idRequestDetail = productDetail.idRequestDetail;
    this.productMerchandiseRequest.idProduct = productDetail.idProduct;
    this.productMerchandiseRequest.packingProduct = new PackingByBranchOffice();
    this.productMerchandiseRequest.packingProduct = productDetail.packingProduct;
    this.productMerchandiseRequest.detailUseType = new DetailUseType();
    this.productMerchandiseRequest.detailUseType = productDetail.detailUseType;
    this.productMerchandiseRequest.requestedAmount = productDetail.requestedAmount;
    /* this.merchadiseRequestService.getImage(productDetail.packingProduct.product).subscribe((data: string) => {
      productDetail.packingProduct.product.image = data;
    }); */
    this.MerchandiseRequestProductComponent.product = productDetail.packingProduct;
    this.MerchandiseRequestProductComponent.barProduct = productDetail.packingProduct.product.barcode;
    this.MerchandiseRequestProductComponent.showButtonAdd = false;
    this.MerchandiseRequestProductComponent.showButtonSave = true;
  }

  back() {
    if(this.indModule == 1){
      this.router.navigate(['/tms/merchandise-request-list']);
    }else if(this.indModule == 2){
      this.router.navigate(['/tms/calendar']);
    }
  }

  onLoadMerchandiseRequest(idMerchandiseRequest: number) {
    this.loadingService.startLoading('wait_loading');
    var filter = new MerchandiseRequestFilter();
    filter.id = idMerchandiseRequest;
    this.merchadiseRequestService.getMerchandiseRequestList(filter).subscribe((data: MerchandiseRequest[]) => {
      var dat: any[] = data;
      this.merchandiseRequest = data[0];
      this.merchandiseRequestDB = data[0];
      if (this.MerchandiseRequestProductComponent != undefined) {
        this.MerchandiseRequestProductComponent.onLoadDetailUseTypeList(this.merchandiseRequest.useType.id);
      }
      this.idBranchOfficeDispachtSelected = this.merchandiseRequest.demandBranch.id;
      this.listProducts = data[0].requestDetail;
      this.onLoadUseTypeList(true);
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las solicitudes" });
    });
  }

  cleanHeaderMerchandiseRequest() {
    //this.merchandiseRequest.demandBranch.id = -1;
    this.merchandiseRequest.dispatchBranch.id = -1;
    this.merchandiseRequest.category.id = -1;
    this.merchandiseRequest.useType.id = -1;
  }

  cancelMerchandiseRequest() {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Esta solicitud será anulada. ¿Desea continuar?',
      accept: () => {
        this.merchandiseRequestDB.status.id = this.statusRequest.CANCELED;
        this.merchadiseRequestService.UpdateMerchandiseRequests(this.merchandiseRequestDB).subscribe((data) => {
          if (data.errorId == 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.onLoadMerchandiseRequest(this.merchandiseRequestDB.id);
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
        if (product.detailUseType.id == -1) {
          validateDetailUseType = true;
        }
      });
    }
    if ((this.merchandiseRequest.demandBranch.id != undefined && this.merchandiseRequest.demandBranch.id > 0) && (this.merchandiseRequest.dispatchBranch.id != undefined && this.merchandiseRequest.dispatchBranch.id > 0) && this.merchandiseRequest.requestType.id > 0
      && this.merchandiseRequest.useType.id > 0 && this.merchandiseRequest.category.id > 0) {
      if (this.listProducts == null || this.listProducts.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos un producto para finalizar." });
      } else {
        if (validateDetailUseType) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Asigne el detalle tipo de uso a todos los productos." });
        } else {
          if (this.listProducts.filter(x => x.requestedAmount == 0).length > 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad a solictar debe ser mayor a 0." });
          } else {
            this.merchandiseRequest.status.id = this.statusRequest.FINALIZED;
            this.merchandiseRequest.requestDetail = this.listProducts;
            this.merchadiseRequestService.UpdateMerchandiseRequests(this.merchandiseRequest).subscribe((data) => {
              if (data.errorId == 0) {
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                this.onLoadMerchandiseRequest(this.merchandiseRequest.id);
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
            });
          }
        }
      }
    }
  }

  insertMerchandiseRequest() {
    var MR = new MerchandiseRequest();
    MR.requestType.id = 2;
    MR.idDocumentRequest = 1;
    MR.demandBranch.id = this._Authservice.currentOffice;
    MR.dispatchBranch.id = this._Authservice.currentOffice;
    this.merchadiseRequestService.InsertMerchandiseRequests(MR).subscribe((data) => {
      this.idMerchadiseRequest = data;
      this.onLoadMerchandiseRequest(data);
      this.router.navigate(['/tms/merchandise-request', data,this.indModule]);
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      this.submittedSave = false;

    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }

  updateMerchadiseRequest() {
    this.submittedSave = true;
    var validateDetailUseType: boolean = false;
    if (this.listProducts != null) {
      this.listProducts.forEach(product => {
        if (product.detailUseType.id == -1) {
          validateDetailUseType = true;
        }
      });
    }
    if ((this.merchandiseRequest.demandBranch.id != undefined && this.merchandiseRequest.demandBranch.id > 0) && (this.merchandiseRequest.dispatchBranch.id != undefined && this.merchandiseRequest.dispatchBranch.id > 0) && this.merchandiseRequest.requestType.id > 0
      && this.merchandiseRequest.useType.id > 0 && this.merchandiseRequest.category.id > 0) {

      if (validateDetailUseType) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Asigne el detalle tipo de uso a todos los productos" });
      } else {
        if (this.merchandiseRequest.status.id == this.statusRequest.ERASER) {
          this.merchandiseRequest.status.id = this.statusRequest.EXECUTION;
        }
        this.merchandiseRequest.requestDetail = this.listProducts;
        this.merchadiseRequestService.UpdateMerchandiseRequests(this.merchandiseRequest).subscribe((data) => {
          if (data.errorId == 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.onLoadMerchandiseRequest(this.merchandiseRequestDB.id);
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
        });

      }

    }

  }

  async onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    let category = new Category();
    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.CategoriesList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });

  }

  changeDispatchBranch() {
    if (this.listProducts.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Al cambiar de sucursal los productos serán eliminados. ¿Desea continuar?',
        accept: () => {
          this.merchadiseRequestService.DeleteMerchandiseRequestDetail(-1, parseInt(this.idMerchadiseRequest.toString())).subscribe((resp: DatabaseResult) => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Productos eliminados con éxito" });
            this.merchandiseRequest.requestDetail = [];
            this.merchadiseRequestService.UpdateMerchandiseRequests(this.merchandiseRequest).subscribe((data) => {
              if (data.errorId == 0) {
                this.onLoadMerchandiseRequest(this.merchandiseRequestDB.id);
              }
              else {
                if (data.errorId > 1000)
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
                else if (data.errorId == 1000)
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los productos" });
              }
            }, (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los productos" });
            });
            this.MerchandiseRequestProductComponent.clearProduct();
          }, (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los productos" });
          });
        },
        reject: (type) => {
          this.merchandiseRequest.dispatchBranch.id = this.idBranchOfficeDispachtSelected;
        }
      })
    }
  }
}
