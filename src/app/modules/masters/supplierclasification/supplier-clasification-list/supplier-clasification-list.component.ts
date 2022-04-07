import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierClasificationFilter } from '../shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from '../shared/services/supplierclasification.service';

@Component({
  selector: 'app-supplier-clasification-list',
  templateUrl: './supplier-clasification-list.component.html',
  styleUrls: ['./supplier-clasification-list.component.scss']
})
export class SupplierClasificationListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  supplierclasificationDialog: boolean = false;
  _supplierclasificationFilters: SupplierClasificationFilter = new SupplierClasificationFilter();
  supplierclasificationModel: SupplierClasification = new SupplierClasification();
  idsupplierclasification: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<SupplierClasification>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.supplierclasification; },field: 'supplierclasification', header: 'Clasificación de proveedores', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(public breadcrumbService: BreadcrumbService,
    public supplierClafisicationService: SupplierclasificationService,
    private messageService: MessageService) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Clasificación de proveedores', routerLink: ['/suppliers-clasification-list'] }
    ]);
   }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.supplierClafisicationService.getSupplierClasificationList(this._supplierclasificationFilters).subscribe((data: SupplierClasification[]) => {
      this.supplierClafisicationService.supplierClafisicationList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las clasificaciones de los proveedores"});
    });
  }
  onEdit(supplierClasification: SupplierClasification) {
    this.supplierclasificationModel = new SupplierClasification();
    this.supplierclasificationModel.id = supplierClasification.id;
    this.supplierclasificationModel.supplierclasification = supplierClasification.supplierclasification;
    this.supplierclasificationModel.active = supplierClasification.active == false ? false : true;
    this.supplierclasificationDialog = true;
  }
}
