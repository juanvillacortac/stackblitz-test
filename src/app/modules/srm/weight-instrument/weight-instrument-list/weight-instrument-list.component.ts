import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { WeightInstrument, WeightInstrumentFilters } from 'src/app/models/srm/weight-instrument';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { WeightInstrumentService } from '../shared/weight-instrument.service';

@Component({
  selector: 'app-weight-instrument-list',
  templateUrl: './weight-instrument-list.component.html',
  styleUrls: ['./weight-instrument-list.component.scss'],
  providers: [DecimalPipe]
})
export class WeightInstrumentListComponent implements OnInit {

  showFilters = false;
  showDialog = false;
  weightInstruments: WeightInstrument[] = [];
  weightInstrument: WeightInstrument = new WeightInstrument();
  permissionsIDs = {...Permissions};
  filters: WeightInstrumentFilters = new WeightInstrumentFilters();
  first = 0;
  @ViewChild('dt', {static: false})dt: any;

  cols = [
    { header: 'Id', display: 'none', field: 'id' },
    { header: 'srm.weight_instrument.fields.tb_name', display: 'table-cell', field: 'name' },
    { header: 'srm.weight_instrument.fields.tb_weight_instrument_type', display: 'table-cell', field: 'instrumentType' },
    { header: 'srm.weight_instrument.fields.tb_dimensions', display: 'table-cell', field: 'dimensions'  },
    { header: 'srm.weight_instrument.fields.tb_weight', display: 'table-cell', field: 'weight'  },
    { header: 'srm.weight_instrument.fields.tb_transport', display: 'table-cell', field: 'isTransport'  },
    { header: 'srm.weight_instrument.fields.tb_status', display: 'table-cell', field: 'active'  },
  ];

  constructor(public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService,
    private readonly weightInstrumentService: WeightInstrumentService,
    private readonly loadingService: LoadingService,
    private decimalPipe: DecimalPipe,
    private readonly dialogService: DialogsService
    ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.search();
  }

  newWeightIngredient() {
    this.setProperties();
    this.showDialog = true;
  }

  search() {
    this.loadingService.startLoading("wait_saving");
    if (this.dt != undefined) {
      this.dt.first=0;
    }
    this.weightInstrumentService.getWeightInstruments(this.filters)
    .then(data => this.getWeightInstrumentsSuccess(data))
    .catch(error => this.loadingHandleError(error));
  }

  detail(item: WeightInstrument) {
    this.weightInstrument = {...item};
    this.showDialog = true;
  }

  getActiveNumber(active: boolean) {
    return active ? 1 : 0;
  }

  onHideDialog(result) {
    this.showDialog = false;
    if (result) {
      this.search();
    }
  }

  private getWeightInstrumentsSuccess(data) {
    this.weightInstruments = data;
    this.loadingService.stopLoading();
  }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'SCM' },
      { label: 'SRM' },
      { label: 'Maestros SRM' },
      { label: 'Instrumentos de peso', routerLink: ['/srm/weight-instrument-list'] }
    ]);
  }

  private setProperties() {
    this.weightInstrument = new WeightInstrument();
    this.weightInstrument.id = -1;
    this.weightInstrument.name=" ";
    this.weightInstrument.active = 1;
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
