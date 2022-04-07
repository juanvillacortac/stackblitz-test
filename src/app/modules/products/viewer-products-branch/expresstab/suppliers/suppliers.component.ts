import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { SuppliersxPackingViewer } from 'src/app/models/srm/suppliersxpackingviewer';
import { ProductxsupplierFilter } from 'src/app/modules/srm/shared/filters/productxsupplier-filter';
import { SuppliersxPackingViewerFilter } from 'src/app/modules/srm/shared/filters/supplierxpackingviewer-filter';
import { SuppliercatalogService } from 'src/app/modules/srm/shared/services/suppliercatalog/suppliercatalog.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class SuppliersComponent implements OnInit {

  displayedColumnsSuppliers: ColumnD<SuppliersxPackingViewer>[] =
    [
      { template: (data) => { return data.identifier + "-" + data.document; }, header: 'Documento', field: 'identifier-document', display: 'table-cell' },
      { template: (data) => { return data.socialReason; }, field: 'socialReason', header: 'Razón social', display: 'table-cell' },
      { template: (data) => { return data.supplierType; }, field: 'supplierType', header: 'Tipo', display: 'table-cell' },
      { template: (data) => { return this.datepipe.transform(data.lastPurchase,"dd/MM/yyyy") == '01/01/0001' ? '' : this.datepipe.transform(data.lastPurchase,"dd/MM/yyyy"); }, field: 'lastPurchase', header: 'Última compra', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.baseCost, '.4'); }, field: 'baseCost', header: 'Costo base', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.4'); }, field: 'conversionCost', header: 'Costo conversión', display: 'table-cell' },
    ];
    suppliersList: SuppliersxPackingViewer[]= [];
    
  constructor(public _suppliercatalogservice: SuppliercatalogService,
    public datepipe:DatePipe, private decimalPipe: DecimalPipe,
    private message: MessageService) { }

  ngOnInit(): void {
  }


  SearchSuppliers(idPacking: number) {
    var filter: SuppliersxPackingViewerFilter = new SuppliersxPackingViewerFilter();
    filter.idCompany = 1;
    filter.idPacking = idPacking;
    this._suppliercatalogservice.getSuppliersxPackingViewer(filter).subscribe((data: SuppliersxPackingViewer[]) => {
      if (data != null) {
        this.suppliersList = data;
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los proveedores" });
      }
    }, (error: HttpErrorResponse) => {

      this.message.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }
}
