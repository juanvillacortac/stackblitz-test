import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierFilter } from 'src/app/modules/masters/supplier/shared/filters/supplier-filter';
import { Supplier } from 'src/app/models/masters/supplier';
@Component({
  selector: 'app-modal-supplier-perfil-info',
  templateUrl: './modal-supplier-perfil-info.component.html',
  styleUrls: ['./modal-supplier-perfil-info.component.scss']
})
export class ModalSupplierPerfilInfoComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService,public _SupplierService : SupplierService) { }
  
  _dataSupplierPerfil:DataviewListModel;
  supplierFilters:SupplierFilter;
  _supplier:Supplier=new Supplier();
  ngOnInit(): void {
    debugger
    this.supplierFilters=new SupplierFilter();
    this._dataSupplierPerfil=this.config.data;
    // @ts-ignore
    this.supplierFilters.id=this._dataSupplierPerfil.id.id;
    this.search();
    this._supplier.socialReason=this.config.data.id.name;
    this._supplier.phone='0212-05225555';
    this._supplier.direction='Ave juan bautista arismendi , Edif CPA, Piso Mz, Sector Conejeros ';
    this._supplier.document='J-121545454';
    this._supplier.contact='Enrrique sulbaran';
   
  }
  search() {
    debugger
    this._SupplierService.getSupplierList(this.supplierFilters).subscribe((data: Supplier[]) => {
            this._supplier = data[0]
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
}
