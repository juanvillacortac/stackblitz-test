
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { PaymentCondition } from '../../../../models/masters/payment-condition';
import { UserPermissions } from '../../../security/users/shared/user-permissions.service';
import { PaymentconditionService } from '../shared/paymentcondition.service';
import { DiscountRateService } from '../../discountrate/shared/discountrate.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { CoinFilter } from '../../coin/shared/filters/CoinFilter';

@Component({
  selector: 'app-payment-conditions-detail',
  templateUrl: './payment-conditions-detail.component.html',
  styleUrls: ['./payment-conditions-detail.component.scss']
})
export class PaymentConditionsDetailComponent implements OnInit {


  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  isEdit = false;
  submitted = false;
  loading = false;
  cboDiscountRates: SelectItem<any>[];
  cboCoins: SelectItem<any>[];
  active: number;
  idDiscountRate: DiscountRate;
  disabled = false;
  _validations: Validations = new Validations();

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() paymentCondition: PaymentCondition;


  constructor(private paymentConditionService: PaymentconditionService, private disocuntrate: DiscountRateService,
    private messageService: MessageService, private coinsService: CoinsService) { }

  ngOnInit(): void {
    this.active = null;
    this.getDiscountRates();
    this.getCoins();
    if (this.paymentCondition.idDiscountType == 0) {
      this.disabled = true;
      this.paymentCondition.discount = 0;
      this.paymentCondition.amounterm = 0;
    }

    if (this.paymentCondition && this.paymentCondition.idPaymentCondition > 0) {

      this.active = this.paymentCondition.active ? 1 : 2;
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.active = 1;
    }
  }
  getDiscountRates = () => {
    return this.disocuntrate.getDiscountRateList().subscribe((data) => {

      this.cboDiscountRates = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los tipos de descuentos' });
    });

  }

  getCoins = () => {
    var filter = new CoinFilter();
    filter.active = 1;
    return this.coinsService.getCoinsList(filter).subscribe((data) => {
      data = data.filter(x => x.id != 0);
      this.cboCoins = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar las monedas' });
    });

  }

  onSave() {
    debugger;
    this.submitted = true;

    if (this.paymentMethodIsValid()) {
      this.loading = true;
      this.paymentCondition.idCompany = 1;
      this.paymentCondition.idCoin = this.paymentCondition.idDiscountType != 2 ? 0 : this.paymentCondition.idCoin;
      this.paymentCondition.discount = parseFloat(this.paymentCondition.discount.toString());
      this.paymentConditionService.savePaymentConditions(this.paymentCondition).subscribe((result: number) => {
        this.saveSucceeeded(result);
      }, (error: HttpErrorResponse) => this.handlerError(error));
    }

  }

  saveSucceeeded(result) {

    if (result > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso' });
      this.onEmitHideForm(true);
    } else if (result === -1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Esta condicion de pago ya existe para esta empresa' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar' });
    }

    //---------------

    this.loading = false;
  }

  handlerError(error) {
    this.messageService.add({
      key: 'paymentCondition', severity: 'error', summary: 'Error',
      detail: error.error.message
    });
    this.loading = false;
  }

  paymentMethodIsValid() {
    return (this.paymentCondition.name && this.paymentCondition.name.length > 0 && (this.paymentCondition.idDiscountType > 0 && (this.paymentCondition.idDiscountType != 3 || (this.paymentCondition.idDiscountType == 3 && this.paymentCondition.idCoin > 0))) && this.paymentCondition.amounterm > 0 && this.paymentCondition.discount > 0)

  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
  }

  changeDiscountType() {
    if (this.paymentCondition.idDiscountType == 0) {
      this.disabled = true;
      this.paymentCondition.discount = 0;
      this.paymentCondition.amounterm = 0;
    } else {
      this.disabled = false;
    }
  }
}
