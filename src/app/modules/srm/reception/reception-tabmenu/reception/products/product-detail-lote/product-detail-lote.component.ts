import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { Lot } from 'src/app/models/srm/lot';
import { ReceptionDetailFilter } from 'src/app/models/srm/reception-detail-filter';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { FilterLot } from 'src/app/modules/srm/shared/filters/filter-lot';
import { MerchandiseReceptionService } from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ChildReception, Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-product-detail-lote',
  templateUrl: './product-detail-lote.component.html',
  styleUrls: ['./product-detail-lote.component.scss'],
  providers: [DatePipe]
})
export class ProductDetailLoteComponent implements OnInit {

  _detail: Lot[] = [];
  innerWidth: number;
  innerHeight: number;
  loading: boolean = false;
  filters = new FilterLot();
  selectedproduct: any[] = [];
  defectImage: DefeatImage = new DefeatImage();
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  iduserlogin:number=0;
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  lotedit: Lot = new Lot();
  @Input("reception") reception: Reception;
  @Input("_product") _product: DetailReception = new DetailReception();
  @Input() isChieldReception = false;
  @Input("childReception") childReception: ChildReception;
  visible: boolean = false;
  @ViewChild('dtsl') dtsl: Table;
  quantitytotal: number =0;
  displayedColumns: ColumnD<Lot>[] =
    [
      // { field: 'image', header: '', display: 'table-cell' },
      { template: (data) => { return data.numberLot; }, field: 'numberLot', header: 'Número de lote', display: 'table-cell' },
      { template: (data) => { return data.cantPackaging; }, field: 'cantPackaging', header: 'Cantidad de empaques', display: 'table-cell' },
      { template: (data) => { return data.unitperPackaging; }, field: 'unitsxpackagin', header: 'Unds por empaque', display: 'table-cell' },
      { template: (data) => { return (data.totalUnidad = data.unitperPackaging * data.cantPackaging); }, field: 'totalUnidad', header: 'Total unidades recibidas', display: 'table-cell' },
      { template: (data) => { return this.datepipe.transform(data.expiredDate, "dd/MM/yyyy"); }, field: 'expiredDate', header: 'Fecha de vecimiento', display: 'table-cell' },
    ];
  constructor(public _service: MerchandiseReceptionService, private messageService: MessageService,private _httpClient: HttpClient,
    private confirmationService: ConfirmationService, public datepipe: DatePipe,public userPermissions: UserPermissions) { }
    _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.70;
    this.iduserlogin = this._Authservice.storeUser.id;
  }
  onshow(_product: DetailReception) {
    this.loading = true;
    this.selectedproduct = [];
    this.filters.idProduct = _product.productId//idproducto
    this.filters.idReceptionDetail = _product.detail.detailReceptionId;
    //this.loadingService.startLoading('wait_loading');
    this._service.getLot(this.filters).subscribe((data: Lot[]) => {
      if (data.length > 0){
        this._service._detailLot = data;
        this.Recalculate();
      }
      // else
      //   this._detail = [];
      this.loading = false;
      //this.loadingService.stopLoading(); 
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      //this.loadingService.stopLoading(); 
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  // Eliminar masivo
  removeselected(product) {

    if (this.selectedproduct.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar los registros seleccionados?',
        accept: () => {
          this._service.removeLot(this.selectedproduct).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });

              this._service.getLotProductxPackagin(this.filters).subscribe((data: Lot[]) => {
                if (data.length > 0){
                  this._service._detailLot = data;
                 this.Recalculate();
                }
                // else
                //   this._detail = [];

                this.selectedproduct = [];
              }, (error: HttpErrorResponse) => {

                this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
              });
            }
          }, (error: HttpErrorResponse) =>
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los registros." }
            ));
        },
      });

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos producto." });
    }
  }

  editLote(lot) {
    if (lot.id > 0) {
      this.lotedit = lot;
      this.visible = true;
      this.Recalculate();
    }
  }

  Recalculate(){
    this.quantitytotal = this._service._detailLot.reduce((subtotal, item) => subtotal + item.cantPackaging, 0)
        this.dtsl.reset();
  }
}
