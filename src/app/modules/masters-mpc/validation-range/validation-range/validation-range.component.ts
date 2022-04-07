import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { ValidationrangeFilter } from '../../shared/filters/validationrange-filter';
import { ValidationrangeService } from '../../shared/services/ValidationRange/validationrange.service';
import { Typevalidationrange } from '../../../../models/masters-mpc/common/typevalidationrange';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions'; 

@Component({
  selector: 'app-validation-range',
  templateUrl: './validation-range.component.html',
  styleUrls: ['./validation-range.component.scss']
})
export class ValidationRangeComponent implements OnInit {


  showFilters: boolean = false;
  loading: boolean = false;
  submitted: boolean;
  validationrangeDialog: boolean = false;
  validationrangeId: ValidationrangeFilter = new ValidationrangeFilter();
  validationrangeFilters: ValidationrangeFilter = new ValidationrangeFilter();
  validationrangeModel: Validationrange = new Validationrange();
  idvalidationrangeP: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Validationrange>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.name; }, header: 'Nombre', field: 'name', display: 'table-cell' },
      { template: (data) => { return data.minimum; }, header: 'Mínimo', field: 'minimum', display: 'table-cell' },
      { template: (data) => { return data.middle; }, header: 'Medio', field: 'middle', display: 'table-cell' },
      { template: (data) => { return data.maximum; }, header: 'Máximo', field: 'maximum', display: 'table-cell' },
      { template: (data) => { return data.typeValidationRange.name; }, header: 'Tipo', field: 'typeValidationRange.name', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field: 'createdByUser', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field: 'updatedByUser', display: 'table-cell' }
    ];

  constructor(public _validationrangeservice: ValidationrangeService, public breadcrumbService: BreadcrumbService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Rangos de validación', routerLink: ['/masters-mpc/validationrange'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._validationrangeservice.geValidationRangebyfilter(this.validationrangeFilters).subscribe((data: Validationrange[]) => {
      this._validationrangeservice._validationRangeList = data;
      this._validationrangeservice._validationRangeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      alert("Ha ocurrido un error cargando los rangos de validacion");
    });
  }

  onEdit(id: number, name: string, min: number, mid: number, max: number, idTypeValidationRange: number, active: boolean) {
    this.validationrangeModel = new Validationrange();
    this.validationrangeModel.id = id;
    this.validationrangeModel.name = name;
    this.validationrangeModel.minimum = min;
    this.validationrangeModel.middle = mid;
    this.validationrangeModel.maximum = max;
    this.validationrangeModel.typeValidationRange = new Typevalidationrange();
    this.validationrangeModel.typeValidationRange.id = idTypeValidationRange;
    this.validationrangeModel.active = active == false ? false : true;
    this.validationrangeDialog = true;
  }

}
