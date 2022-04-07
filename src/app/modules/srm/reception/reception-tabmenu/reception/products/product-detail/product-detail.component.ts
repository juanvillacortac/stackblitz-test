
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailProductReception } from 'src/app/models/srm/detailproductreception';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { ReceptionDetailFilter } from 'src/app/models/srm/reception-detail-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseReceptionService } from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  innerWidth: number;
  innerHeight: number;
  loading: boolean = false;
  _detail: DetailReception[] = [];
  filters = new ReceptionDetailFilter();
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  iduserlogin:number=0;
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  selectedproduct: any[] = [];
  @Input("reception") reception: Reception;
  @Input("_product") _product: DetailReception = new DetailReception();
  displayedColumns: ColumnD<DetailReception>[] =
    [
      { field: 'image', header: '', display: 'table-cell' },
      { template: (data) => { return data.product; }, field: 'product', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.references; }, field: 'references', header: 'Ref. interna', display: 'table-cell' },
      { template: (data) => { return data.category; }, field: 'category', header: 'Categoría', display: 'table-cell' },
    ];


  displayedColumnsDetail: ColumnD<DetailProductReception>[] =
    [
      { template: (data) => { return data.typePacking; }, field: 'typePacking', header: 'Tipo de empaque', display: 'table-cell' },
      { template: (data) => { return data.gtin; }, field: 'gtin', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.presetation; }, field: 'presetation', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.unitsPerPackaging; }, field: 'unitsPerPackaging', header: 'Número de unidades', display: 'table-cell' },
      { template: (data) => { return data.weightNeto.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Peso neto', display: 'table-cell', field: 'weightNeto' },
      { template: (data) => { return data.weightTare.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Peso tara', display: 'table-cell', field: 'weightTare' },
      { template: (data) => { return data.weightGross.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Peso bruto', display: 'table-cell', field: 'weightGross' },
      // { template: (data) => { return data.createDate; }, field: 'createDate', header: 'Fecha creación', display: 'table-cell' },
    ];
  constructor(public _service: MerchandiseReceptionService, private messageService: MessageService,
    private confirmationService: ConfirmationService,public userPermissions: UserPermissions,private _httpClient: HttpClient
  ) { };
  _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.70;
    this.iduserlogin = this._Authservice.storeUser.id;
  }
  onshow(_product: DetailReception) {
    this.loading = true;
    this.selectedproduct = [];
    this.filters.id = _product.receptionId//_idRECEPTION
    this.filters.idReceptionDetail = _product.detail.detailReceptionId;
    //this.loadingService.startLoading('wait_loading');
    this._service.getReceptiodetailnweigth(this.filters).subscribe((data: DetailReception[]) => {
      if (data.length > 0)
        this._detail = data;
      else
        this._detail = [];
      this.loading = false;
      //this.loadingService.stopLoading(); 
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      //this.loadingService.stopLoading(); 
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }


  // nuevo eliminacion masiva
  removeselected(product) {
    if (this.selectedproduct.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar los registros seleccionados?',
        accept: () => {
          let listaux = [];
          this._service.removedetailweigth(this.selectedproduct).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });

              this._service.getReceptiodetailnweigth(this.filters).subscribe((data: DetailReception[]) => {
                if (data.length > 0)
                  this._detail = data;
                else
                  this._detail = [];
                // listaux.push(product);
                this.selectedproduct = [];
              }, (error: HttpErrorResponse) => {
                //this.loading = false;
                //this.loadingService.stopLoading(); 
                this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
              });
            }

          }, (error: HttpErrorResponse) =>
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
            ));
        },
      });
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Debe seleccionar al menos un producto." });
    }
  }
}



