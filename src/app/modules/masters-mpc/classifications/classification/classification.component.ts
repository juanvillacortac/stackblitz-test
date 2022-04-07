import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

import { ColumnD } from 'src/app/models/common/columnsd';
import { classification } from 'src/app/models/masters-mpc/classification';
import { ClassificationFilter } from '../../shared/filters/classification-filter';
import { ClassificationService } from '../../shared/services/ClassificationService/classification.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';



@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss']
})
export class ClassificationComponent implements OnInit {

  showFilters: boolean = false;
  loading: boolean = false;
  submitted: boolean;
  classificationDialog: boolean = false;
  classificationId: ClassificationFilter = new ClassificationFilter();
  classificationFilters: ClassificationFilter = new ClassificationFilter();
  classificationModel: classification = new classification();
  permissionsIDs = {...Permissions};

  displayedColumns: ColumnD<classification>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field:'Id', display: 'none' },
      { template: (data) => { return data.name }, header: 'Clasificación', field:'name', display: 'table-cell' },
      { template: (data) => { return data.internalCode; }, header: 'Código Interno', field:'internalCode', display: 'table-cell' },
      { template: (data) => {return data.abbreviation;}, header:'Abreaviatura', field:'abbreviation', display:'table-cell'},
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, field:'createdByUser', header: 'Creado por', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field: 'updatedByUser', display: 'table-cell' }
    ];

  constructor(public _classificationservice: ClassificationService, private breadcrumbService: BreadcrumbService, private messageService: MessageService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Clasificaciones de productos', routerLink:['/masters-mpc/classification-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    this.loading = false;
    this._classificationservice.getClassificationbyfilter(this.classificationFilters).subscribe((data: classification[]) => {
      this._classificationservice._classificationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener las clasificaciones." });
    });
  }

  onEdit(id: number) {
    this.classificationId = new ClassificationFilter();
    this.classificationId.id = id;
    this.classificationDialog = true;
  }
}
