import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPermissions } from '../../../security/users/shared/user-permissions.service';
import { PaymentconditionService } from '../shared/paymentcondition.service';
import { PaymentConditionFilter } from '../../shared/filters/payment-condition-filter';
import { PaymentCondition } from '../../../../models/masters/payment-condition';
import { BreadcrumbService } from '../../../../design/breadcrumb.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ColumnD } from 'src/app/models/common/columnsd';
/*import * as Permissions from '../../../security/users/shared/user-const-permissions';*/

@Component({
  selector:'app-payment-conditions-list',
  templateUrl: './payment-conditions-list.component.html',
  styleUrls: ['./payment-conditions-list.component.scss'],
  providers: [DecimalPipe]
})

export class PaymentConditionsListComponent implements OnInit {

  loading = false;
  showFilters = false;
  showDialog = false;
  paymentCondition = new PaymentCondition();
  paymentConditionsList = [] as PaymentCondition[];
  //permissions: number[] = [];
 // permissionsIDs = { ...Permissions };
  filters: PaymentConditionFilter = new PaymentConditionFilter();
  isCallback = false;
  //displayedColumns: any[];
  displayedColumns: ColumnD<PaymentCondition>[] =
  [
   {template: (data) => { return data.idPaymentCondition; }, header: 'idPaymentCondition',field: 'Id', display: 'none'},
   {template: (data) => { return data.idDiscountType; },field: 'idDiscountType', header: 'Id tipo descuento', display: 'none'},
   {template: (data) => { return data.name ; },field: 'name', header: 'Condición de pago', display: 'table-cell'},
   {template: (data) => { return data.amounterm ; },field: 'amounterm', header: 'Días de plazo', display: 'table-cell'},
   {template: (data) => { return data.simbolyDiscount },field: 'simbolyDiscount', header: 'Descuento', display: 'table-cell'},
   {template: (data) => { return data.createbyUser; },field: 'createbyUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatebyUser ; },field: 'updatebyUser', header: 'Modificado por', display: 'table-cell'},
   {template: (data) => { return data.active ; },field: 'active', header: 'Estatus', display: 'table-cell'},
  ];

  constructor(public paymentConditionService: PaymentconditionService, private breadcrumbService: BreadcrumbService,
    private messageService: MessageService, public userPermissions: UserPermissions, public securityService: SecurityService,
    private decimalPipe: DecimalPipe) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Condiciones de pago', routerLink: ['payment-conditions-list'] }
    ]);
  }

  ngOnInit(): void {
    
    this.search();
  }

  search() {
    this.loading = true;
    this.paymentConditionService.getPaymentconditionbyFilter(this.filters).subscribe((data: PaymentCondition[]) => {
      data.forEach(paymentcondition => {
        if (paymentcondition.idDiscountType == 2) {
          paymentcondition.simbolyDiscount = paymentcondition.simbology + " " + this.decimalPipe.transform(paymentcondition.discount, '.2');
        }else{
          paymentcondition.simbolyDiscount = this.decimalPipe.transform(paymentcondition.discount, '.2') + " %";
        }
      });
      this.paymentConditionsList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
      //this.paymentConditionsList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  openNew() {
    this.paymentCondition = { idPaymentCondition: -1,idCoin: 0,discount:0,idDiscountType:0,active:true } as PaymentCondition;
   
    this.showDialog = true;
  }

  editPaymentCondition(paymentCondition) {
    this.paymentCondition=new PaymentCondition();
    this.paymentCondition = {
      idPaymentCondition: paymentCondition.idPaymentCondition,     
      name: paymentCondition.name,
      active: paymentCondition.active,
      amounterm: paymentCondition.amounterm,
      discount: paymentCondition.discount,
      idDiscountType: paymentCondition.idDiscountType,
      idUpdatebyuser: paymentCondition.idUpdatebyuser,
      createbyUser: paymentCondition.createbyUser,
      idCompany:paymentCondition.idCompany,
      idCoin: paymentCondition.idCoin
    } as PaymentCondition;

    this.showDialog = true;
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.search();
    }
  }


}

