import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { DetailInventoryFilter } from '../../shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';
import * as status from '../../shared/service/count-status-const';
import { Table } from 'primeng/table';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';

@Component({
  selector: 'count-for-count-modal-list',
  templateUrl: './count-for-count-modal-list.component.html',
  styleUrls: ['./count-for-count-modal-list.component.scss']
})
export class CountForCountModalListComponent implements OnInit {

  loading: boolean = false;
  showFilters: boolean = false;
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{count: CountForCountdetail, identifier: number}>();
  @Input("showDialogDetail") showDialogDetail: boolean = false;
  @Input("_detailinventorycount")  _detailinventorycount: DetailInventoryCount;
  @Input("_conteo")  _conteo: InventoryCount;
  @Input("_CountListTemp") _CountListTemp: CountForCountdetail[];
  @Input("_OperatorListTemp") _OperatorListTemp: OperatorInventoryCount[];
  @Output() showDialogDetailChange = new EventEmitter<boolean>();
  @Output("onSubmitCountxCountDetail") onSubmitCountxCountDetail = new EventEmitter<{ countdetail: CountForCountdetail}>();
  @Input("filters") filters : InventoryCountFilter;
  filter: InventoryCountFilter = new InventoryCountFilter ();
  filterDetail : DetailInventoryFilter=new DetailInventoryFilter();
  _showdialog: boolean = false;
  _showdialogcount:boolean=false;
  _cont:CountForCountdetail=new CountForCountdetail;
  _conts: InventoryCount;
  selectedUser : any; 
  identifierToEdit:number=-1;
  status: number[] = [];
  statusIDs = {...status};
  detailinventorycount: DetailInventoryCount=new  DetailInventoryCount();
  @ViewChild('dtcc') dtcc: Table;

  @Input("isAdjustmentDetaill") isAdjustmentDetaill: boolean = false;

  displayedColumns: ColumnD<CountForCountdetail>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
    { template: (data) => { return data.idDetailPhysicalCount; }, header: 'idconteofisicodetalle', display: 'none',field:'dDetailPhysicalCount' },
    { template: (data) => { return data.idOperator; }, header: 'id operador', display: 'none',field: 'idOperator' }, 
    { template: (data) => { return data.sequence; }, header: 'Secuencia', display: 'table-cell',field: 'sequence' }, 
    { template: (data) => { return data.operator; }, header: 'Nombre operador', display: 'table-cell',field: 'operator' },
    { template: (data) => { if (data.indHeavy==true) return data.count.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); else return data.count.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) }, header: 'Conteo físico', display: 'table-cell',field: 'count' }     
  ];
  constructor(public _service:InventorycountService,private messageService: MessageService) { }

  ngOnInit(): void {    
   
  }
  onShow()
  {
    this.onloaddetail();
    this.ngOnInit();
  }

  onloaddetail()
  {  
    this.filterDetail.id=this._detailinventorycount.id;
    this.filterDetail.idProduct=this._detailinventorycount.idProduct;
    this.filterDetail.idPacket=this._detailinventorycount.idPacket;
    this.filterDetail.idPhysicalCount = this._detailinventorycount.idPhysicalCount;
    this._service.getDetailInventoryCountList(this.filterDetail).subscribe((data: DetailInventoryCount[]) => {
      this._detailinventorycount= data[0];
      this.detailinventorycount=this._detailinventorycount;
      this._CountListTemp=this._detailinventorycount.details;
      this.selectedUser=this._CountListTemp.find(x=>x.indDefinitive);
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  onHide(){
    this.showDialogDetail = false;
    this.dtcc.reset()
    this.showDialogDetailChange.emit(this.showDialogDetail);
  }
  addCount()
  {
    this._conts=this._conteo;
    this.filter=new InventoryCountFilter();
    if(this._CountListTemp !=null)
    {
      this._cont.id=-1;
      this._cont.countsMade=this._CountListTemp.length==0 ?0: this._CountListTemp.length;
      this._cont.indHeavy=this._detailinventorycount.indHeavy;
      this._cont.idDetailPhysicalCount=this._detailinventorycount.id;
      this._cont.existences=this._detailinventorycount.existences;
      this._cont.area=this._detailinventorycount.area;
      this._cont.product=this._detailinventorycount.product;
      this._cont.count=0;
      this._cont.idOperator=-1;
    }
    
    this._showdialogcount=true;
  }

  onSubmitCount(data)
  {
    this.onloaddetail();
    this.onSubmit.emit({
      count: this._cont,
      identifier: this.identifierToEdit
    }); 
  }
  accept()
  {   
    if(this.selectedUser!=undefined || this.selectedUser!=null)
    {
    var conts: CountForCountdetail=new CountForCountdetail();
    conts=this.selectedUser;
    conts.indDefinitive=true;
    this._service.InsertcountForInventoryCount(conts).subscribe((data) => {
      if (data> 0)
      {
             
          this.showDialogDetail = false;
          if(this.isAdjustmentDetaill==true)
          {
            this.isAdjustmentDetaill=false;
            this.onSubmitCountxCountDetail.emit({
              countdetail: conts
            });
          }else
          {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" }); 
          }
      }
      else
       {
         if(data==0)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
       }
       }, (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
       });
      }

  }
}
