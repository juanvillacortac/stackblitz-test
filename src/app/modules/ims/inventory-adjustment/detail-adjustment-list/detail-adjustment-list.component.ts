import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Adjustment } from 'src/app/models/ims/adjustment';
import { AdjustmentDetail } from 'src/app/models/ims/adjustment-detail';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { InventoryProduct } from 'src/app/models/ims/inventory-product';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { Product } from 'src/app/models/products/product';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ProductFilter } from 'src/app/modules/products/shared/filters/product-filter';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { DetailInventoryFilter } from '../../inventory-counts/shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../../inventory-counts/shared/filter/inventory-count-filter';
import { InventoryReasonFilter } from '../../inventory-reasons/shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../../inventory-reasons/shared/services/inventory-reason.service';
import { InventoryProductFilter } from '../shared/filters/inventory-product-filter';
import { InventoryAdjustmentService } from '../shared/services/inventory-adjustment.service';
import { AdjustmentDetailViewmodel } from '../shared/view-models/adjustment-detail-viewmodel';
import * as Statuses from '../shared/services/adjustment-status-const'
import { DecimalPipe } from '@angular/common';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-detail-adjustment-list',
  templateUrl: './detail-adjustment-list.component.html',
  styleUrls: ['./detail-adjustment-list.component.scss'],
  providers: [DecimalPipe]
})
export class DetailAdjustmentListComponent implements OnInit {
  acceptGuion: RegExp = /^[a-zA-Z0-9À-ú\sñÑ_ -] *$/
  _validations: Validations = new Validations();
  submittedDetail: boolean;
  _product: InventoryProduct[];
  _InventoryReasonList: SelectItem[];
  _InventoryReasonMotiveList: InventoryReasons[];
  @Input("_DetailProductListTemp") _DetailProductListTemp: AdjustmentDetail[] = [];
  @Input("_selectedInventoryLocked") _selectedInventoryLocked: AdjustmentDetail[] = [];
  @Output("_selectedInventoryLockedChange") _selectedInventoryLockedChange = new EventEmitter<AdjustmentDetail[]>();
  _Adjustment: Adjustment = new Adjustment();
  adjustmentadd: AdjustmentDetail = new AdjustmentDetail();
  @Input("_dataAdjustmentDetail") _dataAdjustmentDetail: AdjustmentDetail = new AdjustmentDetail();
  @Output("SaveAdjustmentDetailEdit") SaveAdjustmentDetailEdit = new EventEmitter<{ adjustmentDetail: AdjustmentDetail, isEditDetail: boolean }>();
  @Output("DeleteAdjustmentDetail") DeleteAdjustmentDetail = new EventEmitter<{ adjustmentDetail: AdjustmentDetail, isDeleteDetail: boolean }>();
  @Input("_IdAdjustment") _IdAdjustment: number;
  @Input("_IdAdjustmentType") _IdAdjustmentType: number;
  @Input("_IdArea") _IdArea: number;
  @Input("_IdResponsable") _IdResponsable: number;
  @Input("_IdCategory") _IdCategory: number;
  @Input("_dataAdjustmentvalid") _dataAdjustmentvalid: Adjustment = new Adjustment();
  detailfilter: DetailInventoryFilter = new DetailInventoryFilter();
  choosenAdjustment: any[] = [];
  isAdjustmentDetaill: boolean = false;
  _showdialogDetail: boolean = false;
  _showdialogMasiveMotive: boolean = false;
  _DetailListTemp: DetailInventoryCount[] = [];
  _CountListTemp: CountForCountdetail[] = [];
  _detailinventorycount: DetailInventoryCount;
  @Input("_conteo") _conteo: InventoryCount;
  @Input("filters") filters: InventoryCountFilter;
  @ViewChild('ClickEditable') ClickEditable: ElementRef<HTMLElement>;

  isShown: boolean = false;
  cont:number= 0;




  clonedAdjustemnt: { [s: string]: AdjustmentDetail; } = {};
  clonedAdjustemntDetail: AdjustmentDetail[] = [];
  displayedColumns: ColumnD<AdjustmentDetailViewmodel>[] =
    [
     
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.bar; }, header: 'Barra', field: 'bar', display: 'table-cell' },
      { template: (data) => { return data.product; }, header: 'Nombre', field: 'product', display: 'table-cell' },
      { template: (data) => { return data.motive; }, header: 'Motivo', field: 'motive', display: 'table-cell' },
      { template: (data) => { return data.actualexistence.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });; }, header: 'Existencia', field: 'actualexistence', display: 'table-cell' },
      { template: (data) => { return data.unitsperpackaging; }, header: 'Unidades por empaque', field: 'unitsperpackaging', display: 'table-cell' },
      { template: (data) => {return  this.decimalPipe.transform(data.quantity) }, header: 'Cantidad', field: 'quantity', display: 'table-cell' },
      { template: (data) => { return data.entries.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Entradas', field: 'entries', display: 'table-cell' },
      { template: (data) => { return data.outputs.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Salidas', field: 'outputs', display: 'table-cell' },
      { template: (data) => { return data.totalunits.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Total unidades', field: 'totalunits', display: 'table-cell' }



    ];
  constructor(private _adjustmentService: InventoryAdjustmentService,
    private _productservice: ProductService,
    private messageService: MessageService,private _authService: AuthService,
    public _InventoryReasonService: InventoryReasonService,
    private confirmationService: ConfirmationService, private decimalPipe: DecimalPipe
  ) { }
  statusesIDs = { ...Statuses };
  ngOnInit(): void {
    this.LoadInventoryReason();

  }

  SearchProduct(bar: string) {
    if (this._dataAdjustmentvalid.idarea != null && this._dataAdjustmentvalid.idarea != -1)
     {
      if(this._dataAdjustmentvalid.idcategory != -2)
      {
        var _productFilter = new InventoryProductFilter;
        _productFilter.idarea = this._dataAdjustmentvalid.idarea;
        _productFilter.idbranchoffice = this._authService.currentOffice;
        _productFilter.bar = bar;
        _productFilter.idcategory = this._dataAdjustmentvalid.idcategory;
        this._adjustmentService.getInventoryProduct(_productFilter).subscribe((data: InventoryProduct[]) => {
          if (data.length > 0) {
            this._product = data;
            this._dataAdjustmentDetail.idproduct = this._product[0].idproduct;
            this._dataAdjustmentDetail.idarea = this._product[0].idarea;
            this._dataAdjustmentDetail.idspace = this._product[0].idspace;
            this._dataAdjustmentDetail.product = this._product[0].name;
            this._dataAdjustmentDetail.actualexistence = this._product[0].inventory;
            this._dataAdjustmentDetail.avaliableinventory = this._product[0].avaliableinventory;
            this._dataAdjustmentDetail.unitsperpackaging = this._product[0].unitsxpackage;
            this._dataAdjustmentDetail.idpackage = this._product[0].idpackage;
            this._dataAdjustmentDetail.packagepresentation = this._product[0].packagepresentation;
            this._dataAdjustmentDetail.idprovider = this._product[0].idprovider;
            this._dataAdjustmentDetail.indHeavy = this._product[0].indHeavy;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
            this._dataAdjustmentDetail = new AdjustmentDetail();
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el producto" });
        });
      }else
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar una categoria para buscar el producto" });
      }
     
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar un area para buscar el producto" });
    }

  }

  LoadInventoryReason() {
    this._InventoryReasonService.getinventoryReasonList({
      id: -1,
      name: "",
      idconfiguration: -1,
      idgroupingInventoryReason: -1,
      active: 1,
    })
      .subscribe((data) => {
        this._InventoryReasonList = data.map<SelectItem>((item) => ({
          label: item.name + " (" + item.symbol + ")",
          value: item.id
        }));
      });
  }

  AddProductToList(adjustmentDetail: AdjustmentDetail) {
    if (this._dataAdjustmentvalid.idadjustmenttype > 0 && this._dataAdjustmentvalid.idarea > 0 && this._dataAdjustmentvalid.idresponsableuser > -1 && this._dataAdjustmentvalid.idcategory != -2) {
      this.submittedDetail = true;
      if (adjustmentDetail.bar.trim() && adjustmentDetail.bar != "" && adjustmentDetail.idmotive > 0) {
        var DetailExist = this._DetailProductListTemp.filter(x => x.idproduct == adjustmentDetail.idproduct && x.idpackage == adjustmentDetail.idpackage);
        if (DetailExist.length == 0) {
          var _adjustmentFilter = new InventoryReasonFilter();
          this._InventoryReasonService.getinventoryReasonList(_adjustmentFilter).subscribe((data: InventoryReasons[]) => {
            this._InventoryReasonMotiveList = data;
            var Motive = this._InventoryReasonMotiveList.find(x => x.id == adjustmentDetail.idmotive);
            if (adjustmentDetail.entries != 0 && Motive.idConfiguration != 1 && Motive.idConfiguration != 4)  {
              adjustmentDetail.idmotive = -1;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las entradas." });
            } else if (adjustmentDetail.outputs != 0 && Motive.idConfiguration != 2 && Motive.idConfiguration != 4) {
              adjustmentDetail.idmotive = -1;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las salidas." });
            } else if (adjustmentDetail.entries == 0 && adjustmentDetail.outputs == 0 && Motive.idConfiguration != 3 && Motive.idConfiguration != 4) {
              adjustmentDetail.idmotive = -1;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según la verificación." });
            } else {
              this.cont = this.cont+1;
              var productAdd = new AdjustmentDetail();
              productAdd.localid = this.cont;
              productAdd.id = adjustmentDetail.id;
              productAdd.idadjustment = this._IdAdjustment != 0 ? this._IdAdjustment : -1;
              productAdd.idproduct = adjustmentDetail.idproduct;
              productAdd.idpackage = adjustmentDetail.idpackage;
              productAdd.product = adjustmentDetail.product;
              productAdd.bar = adjustmentDetail.bar;
              productAdd.idmotive = adjustmentDetail.idmotive;
              productAdd.motive = this._InventoryReasonList.find(x => x.value == adjustmentDetail.idmotive).label;
              productAdd.quantity = adjustmentDetail.quantity;
              productAdd.entries = adjustmentDetail.entries;
              productAdd.outputs = adjustmentDetail.outputs;
              productAdd.unitsperpackaging = adjustmentDetail.unitsperpackaging;
              productAdd.totalunits = adjustmentDetail.totalunits;
              productAdd.actualexistence = adjustmentDetail.actualexistence;
              productAdd.totalunits = (adjustmentDetail.entries != 0 ? adjustmentDetail.entries : adjustmentDetail.outputs) * adjustmentDetail.unitsperpackaging;
              productAdd.idarea = this._IdArea;
              productAdd.idspace = adjustmentDetail.idspace;
              productAdd.idprovider = adjustmentDetail.idprovider;
              this.submittedDetail = false;
              this._dataAdjustmentDetail = new AdjustmentDetail();
              this.SaveAdjustmentDetailEdit.emit({
                adjustmentDetail: productAdd,
                isEditDetail: false
              });
            }
          }, (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar el ajuste con sus detalles." });
          });

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ya este elemento se encuentra agregado" });
        }
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar los datos principales del ajuste" });
    }

  }

  CalculateEntriesOutpouts(event) {
    
    var valueA="";
    if(event.target.value != "")
    {
      debugger
      valueA = event.target.value.replace(/[.]/gi,"");
      valueA = valueA.replace(",",".");
      var valueB = parseFloat(valueA);
      //var quantity = valueA == "" ? 0 : parseFloat(event.target.value.replace(',', '.'))
      var quantity = valueB;
      if (quantity != null) {
        if (this._dataAdjustmentDetail.actualexistence < 0) {
          this._dataAdjustmentDetail.outputs = 0;
          this._dataAdjustmentDetail.entries = quantity + (this._dataAdjustmentDetail.actualexistence * -1)
        }
        else if (this._dataAdjustmentDetail.actualexistence > quantity) {
          this._dataAdjustmentDetail.entries = 0;
          this._dataAdjustmentDetail.outputs = this._dataAdjustmentDetail.actualexistence - quantity
        }
        else {
          this._dataAdjustmentDetail.outputs = 0;
          this._dataAdjustmentDetail.entries = quantity - this._dataAdjustmentDetail.actualexistence
        }
      } else {
        this._dataAdjustmentDetail.entries = 0;
        this._dataAdjustmentDetail.outputs = 0;
      }
    }else
    {
      //valueA=0;
     
      event.target.value =  this._dataAdjustmentDetail.indHeavy == true ? "0,000" : "0";
      this._dataAdjustmentDetail.quantity = 0;
      this._dataAdjustmentDetail.entries = 0;
      this._dataAdjustmentDetail.outputs = 0;
    }
   
  }

  onRowEditInit(adjustmentDetail: AdjustmentDetail) {
    this.clonedAdjustemntDetail = [];
    var Detail = new AdjustmentDetail();
    Detail.quantity = adjustmentDetail.quantity;
    Detail.entries = adjustmentDetail.entries;
    Detail.outputs = adjustmentDetail.outputs;
    this.clonedAdjustemntDetail.push(Detail);
    this.clonedAdjustemnt[adjustmentDetail.id] = { ...adjustmentDetail };
  }

  onRowEditSave(adjustmentDetail: AdjustmentDetail) {
    if(adjustmentDetail.quantity != null)
    {
      if (adjustmentDetail.id > 0) {
        //delete this.clonedAdjustemnt[adjustmentDetail.id];
        var _adjustmentFilter = new InventoryReasonFilter();
        this._InventoryReasonService.getinventoryReasonList(_adjustmentFilter).subscribe((data: InventoryReasons[]) => {
          this._InventoryReasonMotiveList = data;
          var Motive = this._InventoryReasonMotiveList.find(x => x.id == adjustmentDetail.idmotive);
          if (adjustmentDetail.entries != 0 && Motive.idConfiguration != 1  && Motive.idConfiguration != 4) {
            //adjustmentDetail.idmotive = -1;
            adjustmentDetail.quantity = this.clonedAdjustemntDetail[0].quantity;
            adjustmentDetail.entries = this.clonedAdjustemntDetail[0].entries;
            adjustmentDetail.outputs = this.clonedAdjustemntDetail[0].outputs;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las entradas." });
          } else if (adjustmentDetail.outputs != 0 && Motive.idConfiguration != 2  && Motive.idConfiguration != 4) {
            //adjustmentDetail.idmotive = -1;
            adjustmentDetail.quantity = this.clonedAdjustemntDetail[0].quantity;
            adjustmentDetail.entries = this.clonedAdjustemntDetail[0].entries;
            adjustmentDetail.outputs = this.clonedAdjustemntDetail[0].outputs;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las salidas." });
          } else if (adjustmentDetail.entries == 0 && adjustmentDetail.outputs == 0 && Motive.idConfiguration != 3  && Motive.idConfiguration != 4) {
            //adjustmentDetail.idmotive = -1;
            adjustmentDetail.quantity = this.clonedAdjustemntDetail[0].quantity;
            adjustmentDetail.entries = this.clonedAdjustemntDetail[0].entries;
            adjustmentDetail.outputs = this.clonedAdjustemntDetail[0].outputs;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según la verificación." });
          } else {
            this.SaveAdjustmentDetailEdit.emit({
              adjustmentDetail: adjustmentDetail,
              isEditDetail: true
            });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar el ajuste con sus detalles." });
        });
      }
      else {
        let objIndex = this._DetailProductListTemp.findIndex((obj => obj.localid == adjustmentDetail.localid));
        this._DetailProductListTemp[objIndex].quantity = adjustmentDetail.quantity;
        this._DetailProductListTemp[objIndex].idmotive =  adjustmentDetail.idmotive;
        this._DetailProductListTemp[objIndex].motive =  this._InventoryReasonList.find(x => x.value == adjustmentDetail.idmotive).label;
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al editar el ajuste' });
      }
    }else
    {
      
      adjustmentDetail.quantity = this.clonedAdjustemntDetail[0].quantity;
      adjustmentDetail.entries = this.clonedAdjustemntDetail[0].entries;
      adjustmentDetail.outputs = this.clonedAdjustemntDetail[0].outputs;
      adjustmentDetail.totalunits = (adjustmentDetail.entries != 0 ? adjustmentDetail.entries : adjustmentDetail.outputs) * adjustmentDetail.unitsperpackaging;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El campo cantidad no puede quedar vacío." });
    }

  }

  onRowEditCancel(adjustmentDetail: AdjustmentDetail) {
    let objIndex = this._DetailProductListTemp.findIndex((obj => obj.id == adjustmentDetail.id));
    this._DetailProductListTemp[objIndex].quantity = this.clonedAdjustemntDetail[0].quantity;
    this._DetailProductListTemp[objIndex].idmotive =  this.clonedAdjustemntDetail[0].idmotive;
    this._DetailProductListTemp[objIndex].motive =   this._InventoryReasonList.find(x => x.value == adjustmentDetail.idmotive).label;
  }

  CalculateEntriesOutpoutsTable(event, adjustmentDetail: AdjustmentDetail) {
    //var quantity = parseFloat(event.target.value.replace(',', '.'))
    if(event.target.value != ""){
      var valueA = parseFloat(event.target.value.replace(/[.]/gi,""));
      var quantity =  valueA;
      if (quantity != null) {
        if (adjustmentDetail.actualexistence < 0) {
          adjustmentDetail.outputs = 0;
          adjustmentDetail.entries = quantity + (adjustmentDetail.actualexistence * -1)
        }
        else if (adjustmentDetail.actualexistence > quantity) {
          adjustmentDetail.entries = 0;
          adjustmentDetail.outputs = adjustmentDetail.actualexistence - quantity
        }
        else {
          adjustmentDetail.outputs = 0;
          adjustmentDetail.entries = quantity - adjustmentDetail.actualexistence
        }
      } else {
        adjustmentDetail.entries = 0;
        adjustmentDetail.outputs = 0;
      }
      adjustmentDetail.totalunits = (adjustmentDetail.entries != 0 ? adjustmentDetail.entries : adjustmentDetail.outputs) * adjustmentDetail.unitsperpackaging;
    }else
    {
      event.target.value =  this._dataAdjustmentDetail.indHeavy == true ? "0,000" : "0";
      this._dataAdjustmentDetail.quantity = 0;
      this._dataAdjustmentDetail.entries = 0;
      this._dataAdjustmentDetail.outputs = 0;
    }
   
   

  }

  ValidMotive(adjustmentDetail: AdjustmentDetail) {
    var _adjustmentFilter = new InventoryReasonFilter();
    this._InventoryReasonService.getinventoryReasonList(_adjustmentFilter).subscribe((data: InventoryReasons[]) => {
      this._InventoryReasonMotiveList = data;
      var Motive = this._InventoryReasonMotiveList.find(x => x.id == adjustmentDetail.idmotive);
      if (adjustmentDetail.entries != 0 && Motive.idConfiguration != 1  && Motive.idConfiguration != 4) {
        adjustmentDetail.idmotive = -1;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las entradas." });
      } else if (adjustmentDetail.outputs != 0 && Motive.idConfiguration != 2  && Motive.idConfiguration != 4) {
        adjustmentDetail.idmotive = -1;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según las salidas." });
      } else if (adjustmentDetail.entries == 0 && adjustmentDetail.outputs == 0 && Motive.idConfiguration != 3  && Motive.idConfiguration != 4) {
        adjustmentDetail.idmotive = -1;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe asignar un motivo válido según la verificación." });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar el ajuste con sus detalles." });
    });
  }

  ShowMasiveMotiveModal() {
    this._showdialogMasiveMotive = true;
  }

  onHideMasiveMotiveModel(visible: boolean) {
    this._showdialogMasiveMotive = visible;
  }

  ShowCountForCountModal(adjustmentDetail: AdjustmentDetail) {
    var detail: DetailInventoryCount = new DetailInventoryCount();
    detail.id = -1;
    detail.idProduct = adjustmentDetail.idproduct;
    detail.idPhysicalCount = this._dataAdjustmentvalid.idphysycalcount;
    detail.idPacket = adjustmentDetail.idpackage;
    this.isAdjustmentDetaill = true;
    this._conteo = this._conteo;
    this._detailinventorycount = detail;
    this._showdialogDetail = true;
  }

  onSubmitCountxCountDetail(data) {
    let objIndex = this._DetailProductListTemp.findIndex((obj => obj.iddetailphysicalcount == data.countdetail.idDetailPhysicalCount));
    this._DetailProductListTemp[objIndex].quantity = data.countdetail.count
  }

  DeleteDetail(adjustmentDetail: AdjustmentDetail) {
    if(adjustmentDetail.id > 0)
    {
      this.confirmationService.confirm({
        message: '¿Esta seguro que desea eliminar este detalle?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (adjustmentDetail.id != -1) {
            this.DeleteAdjustmentDetail.emit({
              adjustmentDetail: adjustmentDetail,
              isDeleteDetail: true
            });
          } else {
            delete this.clonedAdjustemnt[adjustmentDetail.id];
          }
  
        },
        reject: (type) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      });
     
    }else
    {
      let objIndex = this._DetailProductListTemp.findIndex((obj => obj.localid == adjustmentDetail.localid));
      if (objIndex > -1) {
        this._DetailProductListTemp.splice(objIndex, 1);
     }
    }

  }

  onChangeUpdateLocked() {
    this._selectedInventoryLockedChange.emit(this._selectedInventoryLocked);
  }
  ShowAllMotives() {
    this.isShown = !this.isShown;
  }
  MasiveAsignMotive(event) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea hacer la asignacion masiva de estos motivos?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._DetailProductListTemp.forEach(adjustmentDetail => {
          adjustmentDetail.idmotive = event.value;
          adjustmentDetail.motive = this._InventoryReasonList.find(x => x.value == adjustmentDetail.idmotive).label;
        });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  SaveMasiveMotiveDetail(data) {
    data.adjustmentDetail.forEach(detail => {
      let objIndex = this._DetailProductListTemp.findIndex((obj => obj.id == detail.id));
      this._DetailProductListTemp[objIndex].idmotive = detail.idmotive;
      this._DetailProductListTemp[objIndex].motive = detail.motive;
    });
    this._showdialogMasiveMotive = false;

  }

  clear(event) {
    if (event.target.value == "0,000") {
      event.target.value = "";
    }
  }

  triggerFalseClick() {
    let el: HTMLElement = this.ClickEditable.nativeElement;
    el.click();
  }

  onPasteBar(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if(!(/^\d+$/.test(pastedText))) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La barra que intentó ingresar, no es válida." });
      return false;
     }
  }
}
