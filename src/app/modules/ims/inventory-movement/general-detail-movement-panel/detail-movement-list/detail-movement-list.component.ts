import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailInventoryMovement } from 'src/app/models/ims/detail-inventory-movement';
import { DetailInventoryMovementFilter } from '../../shared/filter/detail-inventory-movement-filter';
import { InventoryMovementService } from '../../shared/service/inventory-movement.service';

@Component({
  selector: 'detail-movement-list',
  templateUrl: './detail-movement-list.component.html',
  styleUrls: ['./detail-movement-list.component.scss'],
  providers: [DatePipe]
})
export class DetailMovementListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  @Input("filterDetail") filterDetail : DetailInventoryMovementFilter;
  @Input("show") show: boolean = true;

  filter: DetailInventoryMovementFilter = new DetailInventoryMovementFilter ();
  
  displayedColumns: ColumnD<DetailInventoryMovement>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return this.datepipe.transform(data.dateCreate, "dd/MM/yyyy");} , header: 'Fecha', display: 'table-cell',field: 'dateCreate' }, 
      { template: (data) => { return data.entries.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); }, header: 'Entradas', display: 'table-cell',field: 'entries' }, 
      { template: (data) => { return data.outputs.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); }, header: 'Salidas', display: 'table-cell',field: 'outputs' }, 
      { template: (data) => { return data.packet; }, header: 'Empaque', display: 'table-cell',field: 'packet' }, 
      { template: (data) => { return data.area; }, header: 'Área', display: 'table-cell',field: 'area' }, 
      { template: (data) => { return data.transaction; }, header: 'Transacción', display: 'table-cell',field: 'transaction' }, 
      { template: (data) => { return data.numberDocument; }, header: 'Número documento', display: 'table-cell',field: 'numberDocument' },
      { template: (data) => { return data.operator; }, header: 'Operador', display: 'table-cell',field: 'operator' }
    ];
  constructor(public _Service: InventoryMovementService,private messageService: MessageService, public datepipe: DatePipe) 
  { }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    this._Service.getDetailInventoryMovementList(this.filterDetail).subscribe((data: DetailInventoryMovement[]) => {
      this._Service._DetailList = data;
      this.loading = false; 
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  exportExcel() {
    var list = this._Service._DetailList.map(lstItem=>{
      return {
          Fecha:this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"),
          Entradas:lstItem.entries,
          Salidas: lstItem.outputs,
          Área:lstItem.area,
          Trasacción:lstItem.transaction,
          "Número documento":lstItem.numberDocument,
           Operador:lstItem.operator
        }
      })
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(list);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "DetailMovemenet");
        });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

}
