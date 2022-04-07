import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AdjustmentDetail } from 'src/app/models/ims/adjustment-detail';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { InventoryReasonFilter } from '../../inventory-reasons/shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../../inventory-reasons/shared/services/inventory-reason.service';
import { AdjustmentDetailViewmodel } from '../shared/view-models/adjustment-detail-viewmodel';

@Component({
  selector: 'app-masive-motive-modal',
  templateUrl: './masive-motive-modal.component.html',
  styleUrls: ['./masive-motive-modal.component.scss']
})
export class MasiveMotiveModalComponent implements OnInit {
  identifierToEdit: number = -1;
  loading: boolean = false;
  selectedMasiveDetail: any[] = [];
  @Input("showdialogMasiveMotive") showdialogMasiveMotive: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  _MasiveMotiveListTemp: AdjustmentDetail[] = [];
  @Input("_DetailProductListTemp") _DetailProductListTemp: AdjustmentDetail[] = [];
  @Output("SaveMasiveMotiveDetail") SaveMasiveMotiveDetail = new EventEmitter<{ adjustmentDetail: AdjustmentDetail[] }>();
  _InventoryMasiveReasonList: SelectItem[];
  _InventoryReasonMotiveList: InventoryReasons[];
  _DataMasiveDetail: InventoryReasons = new InventoryReasons();
  btnApplyPress: boolean = false;


  displayedMasiveColumns: ColumnD<AdjustmentDetailViewmodel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.bar; }, header: 'Barra', field: 'bar', display: 'table-cell' },
      { template: (data) => { return data.product; }, header: 'Nombre', field: 'product', display: 'table-cell' },
      { template: (data) => { return data.motive; }, header: 'Motivo', field: 'motive', display: 'table-cell' },
      { template: (data) => { return data.actualexistence.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });; }, header: 'Existencia', field: 'actualexistence', display: 'table-cell' },
      { template: (data) => { return data.unitsperpackaging; }, header: 'Unidades por empaque', field: 'unitsperpackaging', display: 'table-cell' },
      { template: (data) => { return data.quantity.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Cantidad', field: 'quantity', display: 'table-cell' },
      { template: (data) => { return data.entries.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Entradas', field: 'entries', display: 'table-cell' },
      { template: (data) => { return data.outputs.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Salidas', field: 'outputs', display: 'table-cell' },
      { template: (data) => { return data.totalunits.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, header: 'Total unidades', field: 'totalunits', display: 'table-cell' }



    ];
  constructor(public _InventoryReasonService: InventoryReasonService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  emitVisible() {
    this.onToggle.emit(this.showdialogMasiveMotive);
  }
  onShow() {
    this._DataMasiveDetail.id=-1;
    this.emitVisible();
    this.load();
    this.ngOnInit();

  }
  onHide() {
    this.emitVisible();
    this._MasiveMotiveListTemp = [];
    this.identifierToEdit = -1;
    this.showdialogMasiveMotive = false;
  }

  load() {
    this.loading = true;
    this.LoadInventoryMasiveReason();
    this._DetailProductListTemp.forEach(adjustmentDetail => {
      var _Detail = new AdjustmentDetail();
      _Detail.id = adjustmentDetail.id;
      _Detail.idadjustment = adjustmentDetail.idadjustment;
      _Detail.idproduct = adjustmentDetail.idproduct;
      _Detail.idpackage = adjustmentDetail.idpackage;
      _Detail.product = adjustmentDetail.product;
      _Detail.bar = adjustmentDetail.bar;
      _Detail.idmotive = adjustmentDetail.idmotive;
      _Detail.motive = adjustmentDetail.motive;
      _Detail.unitsperpackaging = adjustmentDetail.unitsperpackaging;
      _Detail.totalunits = adjustmentDetail.totalunits;
      _Detail.idarea = adjustmentDetail.idarea;
      _Detail.idspace = adjustmentDetail.idspace;
      _Detail.idprovider = adjustmentDetail.idprovider;
      _Detail.actualexistence = adjustmentDetail.actualexistence;
      _Detail.iddetailphysicalcount = adjustmentDetail.iddetailphysicalcount;
      _Detail.quantity = adjustmentDetail.quantity;
      _Detail.entries = adjustmentDetail.entries;
      _Detail.outputs = adjustmentDetail.outputs;
      _Detail.totalunits = adjustmentDetail.totalunits;
      this._MasiveMotiveListTemp.push(_Detail);
    });
  }

  submitMasiveDetail() {

    this.btnApplyPress = false;
    this.SaveMasiveMotiveDetail.emit({
      adjustmentDetail: this._MasiveMotiveListTemp
    });
  };

  LoadInventoryMasiveReason() {
    this._InventoryReasonService.getinventoryReasonList({
      id: -1,
      name: "",
      idconfiguration: -1,
      idgroupingInventoryReason: -1,
      active: 1,
    })
      .subscribe((data) => {
        this._InventoryMasiveReasonList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });
  }

  ApplyMotive(reason: number) {

    var count = 0;
    var _adjustmentFilter = new InventoryReasonFilter();
    this.selectedMasiveDetail.forEach(adjustmentDetail => {
      this._InventoryReasonService.getinventoryReasonList(_adjustmentFilter).subscribe((data: InventoryReasons[]) => {
        this._InventoryReasonMotiveList = data;
        var Motive = this._InventoryReasonMotiveList.find(x => x.id == reason);
        if (adjustmentDetail.entries != 0 && Motive.idConfiguration != 1 && Motive.idConfiguration != 4) {

          adjustmentDetail.idmotive = -1;
          count = count + 1;
        } else if (adjustmentDetail.outputs != 0 && Motive.idConfiguration != 2 && Motive.idConfiguration != 4) {

          adjustmentDetail.idmotive = -1;
          count = count + 1;
        } else if (adjustmentDetail.entries == 0 && adjustmentDetail.outputs == 0 && Motive.idConfiguration != 3 && Motive.idConfiguration != 4) {

          adjustmentDetail.idmotive = -1;
          count = count + 1;
        } else {

          this.btnApplyPress = true;
          adjustmentDetail.idmotive = reason;
          adjustmentDetail.motive = this._InventoryMasiveReasonList.find(x => x.value == adjustmentDetail.idmotive).label;

        }
        this.selectedMasiveDetail = [];
        if (count > 0)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existen detalles que no cumplen con la configuracion aplicada." });
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar el ajuste con sus detalles." });
      });

    });
  }
}
