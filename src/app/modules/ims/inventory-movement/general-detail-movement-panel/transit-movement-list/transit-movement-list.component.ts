import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { TransitInventoryMovement } from 'src/app/models/ims/transit-inventory-movement';
import { DetailInventoryMovementFilter } from '../../shared/filter/detail-inventory-movement-filter';
import { InventoryMovementService } from '../../shared/service/inventory-movement.service';

@Component({
  selector: 'transit-movement-list',
  templateUrl: './transit-movement-list.component.html',
  styleUrls: ['./transit-movement-list.component.scss'],
  providers: [DatePipe]
})
export class TransitMovementListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  @Input("filterDetail") filterDetail : DetailInventoryMovementFilter;
  @Input("showTransit") showTransit: boolean = true;
  list:TransitInventoryMovement[];
  

  filter: DetailInventoryMovementFilter = new DetailInventoryMovementFilter ();
  
  displayedColumns: ColumnD<TransitInventoryMovement>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return this.datepipe.transform(data.dateCreate, "dd/MM/yyyy");}, header: 'Fecha', display: 'table-cell',field: 'dateCreate' },
      { template: (data) => { return data.amount.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}); }, header: 'Cantidad', display: 'table-cell',field: 'amount' },  
      { template: (data) => { return data.packet; }, header: 'Empaque', display: 'table-cell',field: 'packet' }, 
      { template: (data) => { return data.destinationBranchoffice; }, header: 'Sucursal destino', display: 'table-cell',field: 'destinationBranchoffice' },
      { template: (data) => { return data.destinationArea; }, header: 'Área destino', display: 'table-cell',field: 'destinationArea' }, 
      { template: (data) => { return data.originBranchoffice; }, header: 'Sucursal origen', display: 'table-cell',field: 'originBranchoffice' }, 
      { template: (data) => { return data.originArea; }, header: 'Área origen', display: 'table-cell',field: 'originArea' }, 
      { template: (data) => { return data.numberDocument; }, header: 'Número documento', display: 'table-cell',field: 'numberDocument' },
      { template: (data) => { return data.operator; }, header: 'Operador', display: 'table-cell',field: 'operator' }
    ];
  constructor(public _Service: InventoryMovementService,private messageService: MessageService, public datepipe: DatePipe) 
  {}

  ngOnInit(): void {
   
  }
  onShow(){
    this.search();
  }
  search() {
    this.loading = true;
    this._Service.getTransitInventoryMovementList(this.filterDetail).subscribe((data: TransitInventoryMovement[]) => {
      this._Service._TransitList = data;
      this.list=data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  exportExcel() {
    var list = this.list.map(lstItem=>{
      return {
          Fecha:this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"),
          Cantidad:lstItem.amount,
          Empaque: lstItem.packet,
          "Sucursal Destino":lstItem.destinationBranchoffice,
          "Área Destino":lstItem.destinationArea,
          "Sucursal Origen":lstItem.originBranchoffice,
          "Área origen":lstItem.originArea,
          "Número documento":lstItem.numberDocument,
           Operador:lstItem.operator
        }
      })
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(list);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "TransitMovement");
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
