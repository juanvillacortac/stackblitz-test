import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { PaymentMethod, PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PaymentMethodService } from '../shared/services/payment-method.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { Coins } from 'src/app/models/masters/coin';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.scss']
})
export class PaymentMethodListComponent implements OnInit {

  loading = false;
  showFilters = false;
  showDialog = false;
  paymentMethod = new PaymentMethod();
  paymentMethods = [] as PaymentMethodResult[];
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  filters: PaymentMethodFilters = new PaymentMethodFilters();
  isCallback = false;
  displayedColumns: any[];

  constructor(public paymentMethodService: PaymentMethodService, private breadcrumbService: BreadcrumbService,
    private messageService: MessageService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Formas de pago', routerLink: ['/payment-method-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
    this.displayedColumns = [
      { header: 'Id', display: 'none', field: 'id' },
      { header: 'initialConfiguration', display: 'none', field: 'initialConfiguration' },
      { header: 'Nombre', display: 'table-cell', field: 'name' },
      { header: 'Grupo', display: 'table-cell', field: 'paymentMethodGroup'  },
      { header: 'Monedas', display: 'table-cell', field: 'currencies'  },
      { field: 'active', header: 'Estatus', display: 'table-cell' }
    ];
  }

  search() {
    this.loading = true;
    this.paymentMethodService.getPaymentMethods(this.filters).subscribe((data: PaymentMethodResult[]) => {
      this.paymentMethods = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  openNew() {
    this.paymentMethod = { id: -1 } as PaymentMethod;
    this.showDialog = true;
  }

  editPaymentMethod(paymentMethod) {
    this.paymentMethod = {
      id: paymentMethod.id,
      name: paymentMethod.name,
      active: paymentMethod.active,
      paymentMethodGroup: paymentMethod.paymentMethodGroup,
      paymentMethodGroupId: paymentMethod.paymentMethodGroupId,
      currenciesNames: paymentMethod.currencies,
      initialConfiguration: paymentMethod.initialConfiguration
    } as PaymentMethod;

    this.showDialog = true;
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.search();
    }
  }

}
