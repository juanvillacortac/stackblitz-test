import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { DetailInventoryFilter } from '../../shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';
import * as status from '../../shared/service/count-status-const';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import {Location} from'@angular/common';
import * as Permissions from '../../../../security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';


@Component({
  selector: 'inventory-count-panel',
  templateUrl: './inventory-count-panel.component.html',
  styleUrls: ['./inventory-count-panel.component.scss'],
  providers: [DatePipe]
})
export class InventoryCountPanelComponent implements OnInit {

  @Output() changes = new EventEmitter();
  items: MenuItem[] = [
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
    }}
  ];
  arealist: SelectItem[];
  categorylist: SelectItem[];
  @Input() iDate: Date = new Date();
  @Input() fDate: Date = new Date();
  @Input() isFromCalendar = false;
  minDate = new Date();
  _OperatorsString: string;
  OperatorsDialogVisible = false;
  valid: RegExp = /^[a-zA-Z0-9Á-ú\sñÑ.-]*$/;
  @Input('showconteo') showconteo = true;
  @Input('idconteo') idconteo = 0;
  @Input('_conteo') _conteo: InventoryCount;
  @Input('filters') filters: InventoryCountFilter;
  @Output() countemit = new EventEmitter<InventoryCount>();
  operatorModalTitle = 'Operadores';
  filter: InventoryCountFilter = new InventoryCountFilter ();
  filterDetail: DetailInventoryFilter = new DetailInventoryFilter();
  loading = false;
  multiples = true;
  model = false;
  _OperatorListTemp: OperatorInventoryCount[] = [];
  _showdialog = false;
  _showdialogAddProduct = false;
  _showdialogDetail = false;
  _idCategory = -1;
  _idArea = -1;
  filterarea: AreaFilter;
  showFilters = false;
  dateinic = '';
  _ViewModel: DetailInventoryCount = new DetailInventoryCount();
  _DetailListTemp: DetailInventoryCount[] = [];
  _CountListTemp: CountForCountdetail[] = [];
  filtersOfValues: InventoryCountFilter[] = [];
  _detailinventorycount: DetailInventoryCount;
  detailaux: DetailInventoryCount;
  submitted = false;
  status: number[] = [];
  statusIDs = {...status};
  cstatus = false;
  fstatus = false;
  dstatus = false;
  listempty = false;
  isFormEdit = false;
  previousVal = -1;
  currentVal: any;
  location;
  selectedDetail: any[] = [];
  itemsActions: MenuItem[];
  defaultcategory = new Category();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  name: any;
  paramfilters: any;

  item: MenuItem[] = [
    {
      label: 'En espera de ajuste', icon: 'pi pi-folder', command: () => {
        this.finalizeWithAdjustment();
      }
    },
    {
      label: 'Finalizar', icon: 'pi pi-tag', command: () => {
        this.finalize();
      }
    },
    

  ];

  displayedColumns: ColumnD<DetailInventoryCount>[] =
  [
    { template: (data) => data.id, header: 'Id', display: 'none', field: 'id' },
    { template: (data) => data.idPhysicalCount, header: 'Id', display: 'none', field: 'idPhysicalCount' },
    { template: (data) => data.gtin, header: 'Barra', display: 'table-cell', field: 'gtin' },
    { template: (data) => data.idProduct, header: 'Id producto', display: 'none', field: 'idPhysicalCount' },
    { template: (data) => data.product, header: 'Nombre', display: 'table-cell', field: 'product' },
    { template: (data) => data.references, header: 'Referencia', display: 'table-cell', field: 'references' },
    { template: (data) => data.idCategory, header: 'Id categoria', display: 'none', field: 'idCategory' },
    { template: (data) => data.category, header: 'Categoría', display: 'table-cell', field: 'category' },
    { template: (data) => data.packet, header: 'Presentación', display: 'table-cell', field: 'packet' },
    { template: (data) => data.unitPerPackaging, header: 'Unidades por empaque', display: 'table-cell', field: 'unitPerPackaging' },
    { template: (data) => { if (data.indHeavy == true) { return data.existences.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); } else {  return data.existences.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) } }, header: 'Existencia', display: 'table-cell', field: 'existences' },
    { template: (data) => { if (data.indHeavy == true) { return data.defaultcount.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); } else {  return data.defaultcount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) } }, header: 'Conteo predefinido', display: 'table-cell', field: 'defaultcount' },
    { field: 'tight', header: 'Ajustado', display: 'table-cell' },
  ];

  constructor(public _areaservice: AreaService, public _categoryservice: CategoryService, public _commonservice: CommonService,
    public datepipe: DatePipe , public _service: InventorycountService, private messageService: MessageService, private router: Router,
    location: Location, public userPermissions: UserPermissions, private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute, private readonly loadingService: LoadingService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService
    ) {
    this.location = location;
    this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
  }

  ngOnInit(): void {
    this.onloadCategorys();
    this.onloadAreas();
    this.filterDetail.idPhysicalCount = this.idconteo;
    // this.itemsActions = [
    //   {label: 'Finalizar', icon: 'pi pi-check', command: () => { this.finalize(); }},
    //   {label: 'En espera de ajuste', icon: 'pi pi-check', command: () => { this.finalizeWithAdjustment(); }}
    // ];
    if (this.filtersOfValues.length > 0) {
      this.filtersOfValues = this.filtersOfValues;
    } else {
      if (history.state.queryParams != undefined) {
        this.paramfilters = history.state.queryParams.filters; // this.activatedRoute.snapshot.queryParamMap.get('filters');//history.state.queryParams//
        if (this.paramfilters === null) {
          this.filtersOfValues = [];
        }
        else {
          this.filtersOfValues = JSON.parse(this.paramfilters);
        }

          sessionStorage.setItem('searchParameters', this.paramfilters);

        } else {
            this.filtersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }


    }
    if (this.idconteo == 0 ) {
      this._conteo = new InventoryCount();
      this._conteo.idArea = -1;
      this._conteo.idCategory = -2;
      this._conteo.idResponsibleUser = -1;
      this._conteo.responsibleUser = '';
      this._conteo.idstatus = -1;
      this._conteo.inicialDate = this.iDate;
      this._conteo.iDate = this.iDate;
      this._conteo.finalDate = this.fDate;
    } else {
      this.onLoadConteo(this.idconteo);
    }
    // this.router.navigateByUrl(this.router.url.substring(0,24));
  }

  onLoadConteo(id: number) {
    this._conteo = new InventoryCount();
    let filter = new InventoryCountFilter();
    filter.id = this.idconteo;
    filter.idCategory = -1;
    this._service.getInventoryCountList(filter).subscribe((data: InventoryCount[]) => {
      this._conteo = data[0];
      this._conteo.responsibleUser = data[0].idResponsibleUser == -1 ? 'No Aplica' : this._conteo.responsibleUser;
      this._OperatorListTemp = this._conteo.operators;
      const formattediDate = this.datepipe.transform(this._conteo.inicialDate, 'MM/dd/yy');
      const formattedfDate = this.datepipe.transform(this._conteo.finalDate, 'MM/dd/yy');
      this._conteo.iDate = new Date(formattediDate);
      this.fDate = new Date(formattedfDate);
      if (this._conteo.idstatus == this.statusIDs.IN_DRAFT_STATUS_ID) {
           this.cstatus = false;
      }
      else {
           this.cstatus = true;
      }

      if (this._conteo.idstatus <= this.statusIDs.IN_ACTION_STATUS_ID) {
           this.fstatus = false;
      }
      else {
           this.fstatus = true;
      }

      if (this._conteo.idstatus == this.statusIDs.CANCELED_STATUS_ID || this._conteo.idstatus == this.statusIDs.FINALIZED_STATUS_ID || this._conteo.idstatus == this.statusIDs.FINALIZED_ADJUSTEMENT_STATUS_ID) {
           this.dstatus = true;
      }
      else {
           this.dstatus = false;
      }

      this. searchDetail();
    }, (error: HttpErrorResponse) => {
           this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando el conteo'});
    });
  }
  searchDetail() {
    this.loading = true;
    this._service.getDetailInventoryCountList(this.filterDetail).subscribe((data: DetailInventoryCount[]) => {
      this._DetailListTemp = data;
      this.loading = false;
      this.selectedDetail = this._DetailListTemp.filter(x => x.indBlocked == true);
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  clear() {
    if (this.idconteo == 0) {
      if (this._DetailListTemp.length > 0) {
        this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "Posee productos listados en el conteo\n por favor eliminelos para poder borrar los campos." });
      }
      else {
       this._conteo = new InventoryCount();
       this._OperatorsString = '';
       this.fDate=new Date();
      }
    }

  }

  removeOperator(operator: OperatorInventoryCount) {
    if (operator.id <= 0) {
       this._OperatorListTemp = this._OperatorListTemp.filter(x => x != operator);
    }
  }

  inactiveOperator(operator: OperatorInventoryCount) {
    this._service.InactiveOperator(operator).subscribe((data) => {
      if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Eliminación exitosa' });
          this._OperatorListTemp = this._OperatorListTemp.filter(x => x != operator);
      } else {
         if (data == 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
         }
      }
       }, (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los datos.' });
       });
  }
  removeDetail(detail: DetailInventoryCount) {
    if (detail.id <= 0) {
       this._DetailListTemp = this._DetailListTemp.filter(x => x != detail);
    }
    else {
    this._service.InactiveDetailInventoryCount(detail).subscribe((data) => {
      if (data > 0)
      {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
          this._DetailListTemp = this._DetailListTemp.filter(x => x != detail);
      }
      else
       {
         if (data == 0)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
       }
       }, (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
       });
    }


  }
  async onloadAreas() {
    this.filterarea = new AreaFilter();
    this.filterarea.idBranchOffice = this._authService.currentOffice;
    this.filterarea.active=1
    this._areaservice.getareaList(this.filterarea)
    .subscribe((data) => {
      this.arealist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    });
  }

  async onloadCategorys() {
    let filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    const category = new Category();
    category.id = -1;
    category.name = 'Todas';
    this._categoryservice.getCategorys(filter)
    .subscribe((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      const filterArray = [{ ...category }, ...data];
      this.categorylist = filterArray.map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    });
  }
  onBlurMethod(event: any) {
    const dates = new Date(event);
    this.fDate = dates;
    this.changes.emit(this.fDate);

   }

   showmodal(multples: boolean, models: boolean) {
    this.isFormEdit = true;
    this.model = models;
    this.multiples = multples;
    this._showdialog = true;
    this.operatorModalTitle = 'Operadores';
   }

   showmodalResponsible() {
    this.isFormEdit = true;
    this.model = true;
    this.multiples = false;
    this._showdialog = true;
    this.operatorModalTitle = 'Responsable';
   }

   addProduct() {
     this.isFormEdit = true;
     this._idArea = this._conteo.idArea;
     this._idCategory = this._conteo.idCategory;
     this.filter = new InventoryCountFilter();
     if (this._conteo.idCategory != -2 && this._conteo.idArea > 0) {
         this._showdialogAddProduct = true;
     }
     else {
        this.messageService.add({severity: 'warn', summary: 'Adventencia', detail: "Debe elegir un área y una categoría para agregar los productos al conteo"});
     }
   }

   viewDetail(detail: DetailInventoryCount) {
     this._conteo = this._conteo;
     this._detailinventorycount = detail;
     this._showdialogDetail = true;
   }
   save() {
     this.submitted = true;
     this.loadingService.startLoading("wait_saving");
     const previousstatus = this._conteo.idstatus;
     if (this._conteo.idArea  != 0 && this._conteo.idCategory != -2 && this._conteo.idResponsibleUser != -1 && this._conteo.description != '') {
       if (this._OperatorListTemp.length == 0) {
         this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "Agregue al menos un operador" });
        this.loadingService.stopLoading();
        }
       else {
          if (this.selectedDetail.length > 0) {
            this.detailaux = new DetailInventoryCount();
            this._DetailListTemp = this._DetailListTemp.map(item => {
            const val = this.selectedDetail.findIndex(i2 => i2.id == item.id);
            if (val == -1) {
                this.detailaux = item;
                this.detailaux.indBlocked = false; } else {
                this.detailaux = item;
                this.detailaux.indBlocked = true; }
              return this.detailaux ? { ...item} : item; });
           } else {
             this._DetailListTemp = this._DetailListTemp.map( item => {item.indBlocked = false;  return item; });
          }

        this._conteo.operators = this._OperatorListTemp;
        this._conteo.details = this._DetailListTemp;
        this._conteo.count = this._DetailListTemp.length;
        this._conteo.idCategory == -1 ? null : this._conteo.idCategory;
        this._conteo.idBranchOffice = this._authService.currentOffice;
        this._conteo.inicialDate = this._conteo.iDate;
        this._conteo.finalDate = this.fDate;
        this._conteo.id == 0 ? -1 : this._conteo.id;

        if (this._conteo.id < -0) {
           this._conteo.idstatus = this.statusIDs.IN_DRAFT_STATUS_ID;
        }

          this.onsave(previousstatus);
        }
     } else {
      this.loadingService.stopLoading();
     }

   }

  onsave(previousstatus: number) {
      this._service.InsertUpdateInventoryCount(this._conteo).subscribe((data) => {
      if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso' });
          this.countemit.emit(this._conteo);
          this.submitted = false;
          this.idconteo = data;
          this.isFormEdit=false;
          this.filtersOfValues = this.filtersOfValues;
          if (!this.isFromCalendar) {
            const link: any[] = ['/detail-inventory-count', data.toString()];
            this.location.go(link[0] + '/' + link[1]);
            this.ngOnInit();
          }

       } else {
         if (data == 0) {
          this._conteo.idstatus = previousstatus;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los datos.' });
         }
       }
       this.loadingService.stopLoading();
       }, (error: HttpErrorResponse) => {
          this._conteo.idstatus = previousstatus;
          this.loadingService.stopLoading();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los datos.' });
       });
  }

  onstart(previousstatus: number) {
    this._service.InsertUpdateInventoryCount(this._conteo).subscribe((data) => {
      if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Iniciado', detail: 'Inicio exitoso' });
          this.countemit.emit(this._conteo);
          this.submitted = false;
          this.idconteo = data;
          this.filtersOfValues = this.filtersOfValues;
          this.ngOnInit();
       } else {
         if (data == 0) {
           this._conteo.idstatus = previousstatus;
           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al iniciar el conteo.' });
         }
       }
       }, (error: HttpErrorResponse) => {
         this._conteo.idstatus = previousstatus;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al iniciar el conteo.' });
       });
  }
  start() {
     this.submitted = true;
     const previousstatus = this._conteo.idstatus;
     if (this._conteo.idArea  != 0 && this._conteo.idCategory != -2 && this._conteo.idResponsibleUser != -1 && this._conteo.description != '') {
      const dates = new Date();
      const idates = new Date(this._conteo.inicialDate);
      if (idates.getDate() > dates.getDate()) {
        this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: 'No puede iniciar un conteo con una fecha mayor a la actual' });
      } else {
        if (this._OperatorListTemp.length == 0) {
         this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "Agregue al menos un operador" });
        }
        else {
         this._conteo.operators = this._OperatorListTemp;
         this._conteo.details = this._DetailListTemp;
         this._conteo.count = this._DetailListTemp.length;
         this._conteo.inicialDate = this.iDate;
         this._conteo.finalDate = this.fDate;

         if (this._conteo.id > 0) {
           this._conteo.idstatus = this.statusIDs.IN_ACTION_STATUS_ID;
         }

          this.onstart(previousstatus);
       }
     }
    }

   }

   cancel() {
     this.submitted = true;
     const previousstatus = this._conteo.idstatus;
     if (this._conteo.idArea  != 0 && this._conteo.idCategory != -2 && this._conteo.idResponsibleUser != -1 && this._conteo.description != '') {
       if (this._DetailListTemp.findIndex(x => x.tight == true) == -1) {
         this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro que desea anular el conteo de inventario?',
           accept: () => {

             this._conteo.operators = this._OperatorListTemp;
             this._conteo.details = this._DetailListTemp;
             this._conteo.count = this._DetailListTemp.filter(x => x.active == true).length;
             this._conteo.inicialDate = this.iDate;
             this._conteo.finalDate = this.fDate;
             this._conteo.idCategory == -1 ? null : this._conteo.idCategory;
             this._conteo.id == 0 ? -1 : this._conteo.id;

          if (this._conteo.id > 0) {

             this._conteo.idstatus = this.statusIDs.CANCELED_STATUS_ID;
          }
             this._service.CanceledOrFinalizedInventoryCount(this._conteo).subscribe((data) => {
              if (data > 0) {
                  this.messageService.add({ severity: 'success', summary: 'Anulado', detail: 'Anulado con éxito' });
                  this.countemit.emit(this._conteo);
                  this.submitted = false;
                  this.idconteo = data;
                  this.isFormEdit=false;
                  this.filtersOfValues = this.filtersOfValues;
                  this.ngOnInit();
               } else {
                 if (data == 0) {
                   this._conteo.idstatus = previousstatus;
                   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al anular el conteo.' });
                 }
                  if (data == -1) {
                    this._conteo.idstatus = previousstatus;
                   this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No puede anular el conteo porque este posee un ajuste en proceso.' });
                   }
                }
               }, (error: HttpErrorResponse) => {
                 this._conteo.idstatus = previousstatus;
                 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al anular el conteo.' });
               });
             },
            });
         } else {
           this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede anular el conteo porque este posee detalles que han sido ajustados." });
       }
        }

   }

   finalize() {
     this.submitted = true;
     const previousstatus = this._conteo.idstatus;
    if (this._conteo.idArea  != 0 && this._conteo.idCategory != -2 && this._conteo.idResponsibleUser != -1 && this._conteo.description != '') {

      this._conteo.operators = this._OperatorListTemp;
      this._conteo.details = this._DetailListTemp;
      this._conteo.count = this._DetailListTemp.length;
      this._conteo.inicialDate = this._conteo.iDate;
      this._conteo.finalDate = this.fDate;
      this._conteo.idCategory == -1 ? null : this._conteo.idCategory;
      this._conteo.id == 0 ? -1 : this._conteo.id;

      if (this._conteo.id > 0) {
         this._conteo.idstatus = this.statusIDs.FINALIZED_STATUS_ID;
      }

         this._service.CanceledOrFinalizedInventoryCount(this._conteo).subscribe((data) => {
           if (data > 0) {
               this.messageService.add({ severity: 'success', summary: 'Finalizado', detail: 'finalizado con éxito' });
               this.countemit.emit(this._conteo);
               this.submitted = false;
               this.idconteo = data;
               this.isFormEdit=false;
               this.filtersOfValues = this.filtersOfValues;
               this.ngOnInit();
            } else {
              if (data == 0) {
               this._conteo.idstatus = previousstatus;
               this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al finalizar el conteo.' });
              }
            }
            }, (error: HttpErrorResponse) => {
              this._conteo.idstatus = previousstatus;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al finalizar el conteo.' });
            });
    }
   }

   finalizeWithAdjustment() {
    this.submitted = true;
    const previousstatus = this._conteo.idstatus;
    if (this._conteo.idArea  != 0 && this._conteo.idCategory != -2 && this._conteo.idResponsibleUser != -1 && this._conteo.description != '') {
      if (this._DetailListTemp.findIndex(x => x.count > 0) != -1) {

            if (this._DetailListTemp.findIndex(x => x.count == 0) != -1) {this.confirmationService.confirm({
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              message: 'Existen detalles sin conteos realizados, si finaliza el conteo físico\nlos detalles serán inactivados, ¿Desea proceder con la acción?',
              accept: () => {
               this._conteo.operators = this._OperatorListTemp;
               let detailaux = new DetailInventoryCount();
               this._DetailListTemp = this._DetailListTemp.map(item => {
                if (item.count == 0) {
                    detailaux = item;
                    detailaux.active = false; } else {
                    detailaux = item;
                    detailaux.active = true; }
                return detailaux ? { ...item} : item; });

               this._conteo.details = this._DetailListTemp;
               this._conteo.inicialDate = this._conteo.iDate;
               this._conteo.finalDate = this.fDate;
               this._conteo.count = this._DetailListTemp.filter(x => x.active == true).length;
               this._conteo.idCategory == -1 ? null : this._conteo.idCategory;
               this._conteo.id == 0 ? -1 : this._conteo.id;

               if (this._conteo.id > 0) {
                  this._conteo.idstatus = this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID;
               }

                  this.acceptfinalized(previousstatus);

              },
              });
            } else {
               this._conteo.operators = this._OperatorListTemp;
               this._conteo.details = this._DetailListTemp;
               this._conteo.count = this._DetailListTemp.filter(x => x.active == true).length;
               this._conteo.inicialDate = this._conteo.iDate;
               this._conteo.finalDate = this.fDate;
               this._conteo.idCategory == -1 ? null : this._conteo.idCategory;
               this._conteo.id == 0 ? -1 : this._conteo.id;

               if (this._conteo.id > 0) {
                  this._conteo.idstatus = this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID;
               }

                  this.acceptfinalized(previousstatus);
             }

        } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe existir al menos un detalle con un conteo realizado.' });
        }
    }
   }

   acceptfinalized(previousstatus: number) {
    this._service.InsertUpdateInventoryCount(this._conteo).subscribe((data) => {
      if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Finalizado', detail: 'finalizado con éxito' });
          this.countemit.emit(this._conteo);
          this.submitted = false;
          this.idconteo = data;
          this.isFormEdit=false;
          this.filtersOfValues = this.filtersOfValues;
          this.ngOnInit();
       } else {
         if (data == 0) {
          this._conteo.idstatus = previousstatus;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al finalizar el conteo.' });
         }
       }
       }, (error: HttpErrorResponse) => {
         this._conteo.idstatus = previousstatus;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al finalizar el conteo.' });
       });
   }
   exportExcel() {
    const datexport = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    let list = this._DetailListTemp.map(lstItem => {
      return {
           'Número documento': (lstItem.numberDocument==null|| lstItem.numberDocument==undefined) ? this._conteo.numberDocument: lstItem.numberDocument,
            Área: lstItem.area,
            Descripción: (lstItem.physicalCount==null || lstItem.physicalCount==undefined)?this._conteo.description:lstItem.physicalCount,
            Barra: lstItem.gtin ,
           'Nombre producto': lstItem.product,
            Referencia: lstItem.references,
            Existencia: lstItem.indHeavy == true ? lstItem.existences.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}) : lstItem.existences.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}),
            Empaque: lstItem.packet,
            'Unidades por empaque': lstItem.unitPerPackaging,
            Categoría: lstItem.category
          };
        });
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(list);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'Detalle conteo fisico ' + this._conteo.numberDocument + ' ' + datexport);
        });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

  onSubmitOperator(data) {
    this.isFormEdit = true;
    if (this.multiples == false) {
    this._conteo.operator = data.operator;
    this._conteo.idResponsibleUser = data.operator.id;
    this._conteo.responsibleUser = data.operator.name;
    }

  }

  onHideOperator(visible: boolean) {
    this._showdialog = visible;
  }

  onchangeArea(event: any) {
    this.isFormEdit = true;
    if (this._DetailListTemp.length > 0) {
        if (this._conteo.idArea != -1) {
           this.arealist = this.arealist.filter(x => x.value == this._conteo.idArea);
        }

        this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: 'No puede cambiar el área mientras existan productos listados en el conteo.' });
    } else {
       this.onloadAreas();
    }
  }
  onchangeCategory(event: any) {
    this.isFormEdit = true;
    if (this._DetailListTemp.length > 0) {
        if (this._conteo.idCategory != -1 &&  this.previousVal == -1) {
           this.previousVal = this._conteo.idCategory;
           this.categorylist = this.categorylist.filter(x => x.value == this._conteo.idCategory || x.value == -1);
        } else {
           this.categorylist = this.categorylist.filter(x => x.value == this._conteo.idCategory || x.value == this.previousVal);
        }
        this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: 'No puede cambiar la categoría mientras existan productos listados en el conteo.' });
    } else {
       this.onloadCategorys();
    }
  }

  onSubmitCountDetail(data) {
      this.searchDetail();
  }

  backList() {
    const queryParams: any = {};
    queryParams.filters = JSON.stringify(this.filtersOfValues);
    const navigationExtras: NavigationExtras = {
        queryParams,
        skipLocationChange: true
    };
    if (this.isFormEdit == true) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea regresar al listado?, si tiene cambios sin guardar los mismos se perderan',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.router.navigate(['/ims/inventory-count-list'], navigationExtras);
          },
          reject: (type) => {
            switch (type) {
              case ConfirmEventType.REJECT:
                return false;
              case ConfirmEventType.CANCEL:
                return false;
            }
          }
        });
      } else {
        this.router.navigate(['/ims/inventory-count-list'], navigationExtras);
      }

  }
}
