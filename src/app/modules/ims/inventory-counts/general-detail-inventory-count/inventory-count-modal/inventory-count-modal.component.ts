import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { DetailInventoryFilter } from '../../shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';
import * as status from '../../shared/service/count-status-const';
import { Table } from 'primeng/table';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';



@Component({
  selector: 'app-inventory-count-modal',
  templateUrl: './inventory-count-modal.component.html',
  styleUrls: ['./inventory-count-modal.component.scss'],
  providers: [DatePipe]
})
export class InventoryCountModalComponent implements OnInit {
  loading: boolean = false
  @Input("showDialogCount") showDialogCount: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("onSubmitCount") onSubmitCount = new EventEmitter<{ detailInventoryCount: DetailInventoryCount[], identifier: number , idphysycalCount : number , idCategory : number , IdArea : number , description:string; }>();
  idate: Date = new Date(1900, 1, 1);
  filter: InventoryCountFilter = new InventoryCountFilter();
  detailfilter: DetailInventoryFilter = new DetailInventoryFilter();
  identifierToEdit: number = -1;
  selectedInventoryCount: any[] = [];
  selectcount: any;
  _detailInventoryCount: DetailInventoryCount[];
  _detailCount: DetailInventoryCount[];
  inventorycount;
  status: number[] = [];
   statusIDs = {...status};
   isClose:boolean=false;
   @ViewChild('dtic') dtic: Table;




  displayedColumns: ColumnD<InventoryCount>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field: 'id' },
      { template: (data) => { return data.numberDocument; }, header: 'Número de documento', display: 'table-cell', field: 'numberDocument' },
      { template: (data) => { return data.idArea; }, header: 'IdArea', display: 'none', field: 'idArea' },
      { template: (data) => { return data.area; }, header: 'Área', display: 'table-cell', field: 'area' },
      { template: (data) => { return data.description; }, header: 'Descripción', display: 'table-cell', field: 'description' },
      { template: (data) => { return data.idstatus; }, header: 'Id estatus', display: 'none', field: 'idstatus' },
      { field:'idstatus',header: 'Estatus' ,display: 'table-cell' },
      //{ template: (data) => { return data.status; }, header: 'Estatus', display: 'table-cell', field: 'status' },
      { template: (data) => { return data.idResponsibleUser; }, header: 'Id Responsabla', display: 'none', field: 'idResponsibleUser' },
      { template: (data) => { return data.responsibleUser; }, header: 'Responsable', display: 'table-cell', field: 'responsibleUser' },
      { template: (data) => { return this.datepipe.transform(data.inicialDate, "dd/MM/yyyy"); }, header: 'Fecha conteo', display: 'table-cell', field: 'inicialDate' },
      { template: (data) => { return data.count; }, header: 'Productos', display: 'table-cell', field: 'count' }
    ];
  constructor(public datepipe: DatePipe, public _inventoryCountService: InventorycountService, private messageService: MessageService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService) {
      this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
    }

  ngOnInit(): void {

  }

  emitVisible() {
    this.onToggle.emit(this.showDialogCount);
  }
  load() {
    this.loading = true;
    this.filter.idStatus = this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID;
    this.filter.idBranchOffice = this._authService.currentOffice;
    this.filter.initialDate = '19000101';
    this.filter.finalDate = '19000101';
    this.filter.idCategory = this.filter.idCategory == -2 ? -1  : this.filter.idCategory;
    this._inventoryCountService.getInventoryCountList(this.filter).subscribe((data: InventoryCount[]) => {
      this._inventoryCountService._List= data.sort((a, b) => new Date(b.inicialDate).getTime() - new Date(a.inicialDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  onShow() {
    this.emitVisible();
    this.load();
    this.ngOnInit();

  }

  onHide() {
    this.emitVisible();
    this.dtic.reset();
    this.inventorycount = new InventoryCount();
    this.identifierToEdit = -1;
    this.showDialogCount = false;
  }

  submit() {
    this.selectcount = this.selectedInventoryCount;
    var idCategory = this.selectcount.idCategory;
    var IdArea = this.selectcount.idArea;
    var description = this.selectcount.description;
    this.detailfilter =
      {
        id:-1 ,
        idPhysicalCount: this.selectcount.id,
        idProduct: -1,
        idPacket : -1
      }
      this.loading = false;
      this.showDialogCount = false;
      this.selectcount = "";
      this.selectedInventoryCount = [];
      this.showDialogCount = false;
      this.emitVisible();
      this._inventoryCountService.getDetailInventoryCountList(this.detailfilter).subscribe((data: DetailInventoryCount[]) => {
        this._detailInventoryCount = data;
        this.onSubmitCount.emit({
          detailInventoryCount: this._detailInventoryCount,
          identifier: this.identifierToEdit,
          idphysycalCount : this.detailfilter.idPhysicalCount,
          idCategory: idCategory,
          IdArea: IdArea,
          description:description
        });
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
      });
  }

  LoadDetailsCount(): DetailInventoryCount[]
  {
    this._inventoryCountService.getDetailInventoryCountList(this.detailfilter).subscribe((data: DetailInventoryCount[]) => {
      return this._detailInventoryCount = data;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
     return this._detailInventoryCount;
  }




}
