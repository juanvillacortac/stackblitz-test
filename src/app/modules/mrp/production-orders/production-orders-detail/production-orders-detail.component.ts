import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { ProductionOrder } from 'src/app/models/mrp/production-order';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';
import { ProductionOrdersService } from '../shared/production-orders.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { EqualityResult } from 'src/app/models/mrp/equality-result.enum';
import { RecipeService } from '../../recipes/shared/recipe.service';
import { RecipeIngredients } from 'src/app/models/mrp/recipe-ingredients';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { OrderDetail } from 'src/app/models/mrp/production-order-detail';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import * as moment from 'moment';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';

@Component({
  selector: 'app-production-orders-detail',
  templateUrl: './production-orders-detail.component.html',
  styleUrls: ['./production-orders-detail.component.scss']
})
export class ProductionOrdersDetailComponent implements OnInit, OnDestroy {

  @Input() productionOrder: ProductionOrder;
  @Input() processingRoom: ProcessingRoom;
  @Output() itemsChange = new EventEmitter<void>();

  get status(): ProductionOrderStatus { return ProductionOrderStatus[ProductionOrderStatus[this.productionOrder.status]]; }
  get remainingTime(): string { return this.formatDuration(this._remainingTime); }
  get remainingProgress(): number { return this.durationProgress(this._remainingTime); }
  get prepTime(): number { return 60 * 60 * this.productionOrder.prepTime; }
  get canStartOrder(): boolean { return this.isRequiredQtyFilled(); }

  private _remainingTime: moment.Duration;

  subscription: Subscription;
  statusTimeLine: any[] = [];
  cols: any[] = [];
  loading = false;
  displayDialog = false;
  cancellationReason = '';
  roomTeam: any[] = [];

  permissionsIDs = {...Permissions};
  orderStatus = {...ProductionOrderStatus};

  constructor(
    public userPermissions: UserPermissions,
    private readonly service: ProductionOrdersService,
    private readonly recipeService: RecipeService,
    private readonly dialogService: DialogsService,
    private readonly dateHelper: DateHelperService
  ) { }

  ngOnInit(): void {
    this.setupColumns();
    this.setupTimeViews();
    this.setupIngredientList();
    this.setupRoomTeam();
  }

  ngOnDestroy(): void {
    this.itemsChange.next();
    this.subscription?.unsubscribe();
  }

  isOrderInStatus(...statuses: ProductionOrderStatus[]) {
    return statuses.includes(this.status);
  }

  startProductionOrder() {
    this.loading = true;
    this.service.startProductionOrder(this.productionOrder.id, this.processingRoom.id, this.productionOrder.details)
      .then(_ => this.refreshProductionOrder())
      .then(_ => this.loading = false)
      .then(_ => this.successMessage('mrp.production_order.success_starting_order'))
      .catch(error => this.handleError(error));
  }

  finishProductionOrder() {
    this.loading = true;
    this.service.finishProductionOrder(this.productionOrder.id, this.productionOrder.producedQty)
      .then(_ => this.refreshProductionOrder())
      .then(_ => this.loading = false)
      .then(_ => this.successMessage('mrp.production_order.success_ending_order'))
      .catch(error => this.handleError(error));
  }

  cancelProductionOrder() {
    if (this.cancellationReason.length < 16) { return; }
    this.displayDialog = false;
    this.loading = true;
    this.service.cancelProductionOrder(this.productionOrder.id, this.cancellationReason)
      .then(_ => this.refreshProductionOrder())
      .then(_ => this.loading = false)
      .then(_ => this.successMessage('mrp.production_order.success_cancelling_order'))
      .catch(error => this.handleError(error));
  }

  requiredQty(ingredientQty: number): number {
    return ingredientQty * this.productionOrder.quantity;
  }

  get isDelayed() {
    const startDate = moment(this.productionOrder.startDate);
    const finishTime = startDate.add(this.prepTime, 'seconds');
    return finishTime.isBefore(moment(Date()));
  }

  private setupColumns() {
    this.cols = [
      { field: 'idIngredients', display: 'none', header: 'ID' },
      { field: 'ingredientName', display: 'table-cell', header: 'mrp.ingredients.ingredient' },
      { field: 'requiredQty', display: 'table-cell', header: 'mrp.production_order.required_quantity' },
      { field: 'usedQty', display: 'table-cell', header: 'mrp.production_order.used_quantity' }
    ];
  }

  private setupTimeViews() {
    this.setupStatusTimeLine();
    this.calculateRemainingTime();
    this.setupTimming();
  }

  private setupIngredientList() {
    if (!this.isFinishedOrder()) {
      this.loadPlanRecipeIngredients();
    }
  }

  private isFinishedOrder() {
    return this.productionOrder.status >= ProductionOrderStatus.FINISHED;
  }

  private loadPlanRecipeIngredients() {
    this.recipeService.getRecipeIngredients(this.productionOrder.idRecipe)
      .then(ingredients => this.onIngredientsLoaded(ingredients))
      .catch(error => this.handleError(error));
  }

  private refreshProductionOrder() {
    this.service.loadProductionOrder(this.productionOrder.id)
      .then(order => this.onOrderLoaded(order))
      .catch(error => this.handleError(error));
  }

  private onIngredientsLoaded(ingredients: RecipeIngredients[]) {
    this.productionOrder.details = ingredients.map<OrderDetail>(_ => this.orderDetailByIngredient(_));
  }

  private onOrderLoaded(order: ProductionOrder) {
    this.productionOrder = order;
    this.setupTimeViews();
  }

  private orderDetailByIngredient(ingredient: RecipeIngredients): OrderDetail {
    return {
      id: -1,
      idIngredient: ingredient.id,
      idProduct: ingredient.idIngredients,
      idPackage: ingredient.packageId,
      idMeasureUnit: 1,
      ingredientName: ingredient.name,
      requiredQty: this.requiredQty(ingredient.qty),
      usedQty: 0
    };
  }

  private isRequiredQtyFilled(): boolean {
    return this.productionOrder.details.filter(detail => detail.usedQty <= 0).length === 0;
  }

  private handleError(error: any) {
    this.loading = false;
    this.dialogService.errorMessage('mrp.production_order.production_orders', error?.error?.message ?? 'error_service');
  }

  private successMessage(idMsg: string) {
    this.dialogService.successMessage('mrp.production_order.production_orders', idMsg);
  }

  private setupStatusTimeLine() {
    const ignoredStatus = [ProductionOrderStatus.CANCELLED];
    const iterableStatus = Object.keys(ProductionOrderStatus).filter(status => this.notIncludeStatusIn(ignoredStatus, status));
    this.statusTimeLine = iterableStatus.map(value => this.newStatusTimeLine(value) );
    this.verifyLastStatusIsReady();
  }

  private newStatusTimeLine(value: string) {
    return {
      status: value,
      date: this.service.getStatusView(value, this.status).icon === PrimeIcons.CHECK ? '' : '',
      icon: this.service.getStatusView(value, this.status).icon,
      color: this.service.getStatusView(value, this.status).color
    };
  }

  private verifyLastStatusIsReady() {
    const lastItem = this.statusTimeLine[this.statusTimeLine.length - 2];
    if (lastItem.icon === PrimeIcons.ELLIPSIS_H) {
      const mayorEquality = this.service.findStatusValueByResult(EqualityResult.MAYOR);
      lastItem.icon = mayorEquality.icon;
      lastItem.color = mayorEquality.color;
    }
  }

  private notIncludeStatusIn(ignoredStatus: ProductionOrderStatus[], status: string) {
    return !ignoredStatus.includes(ProductionOrderStatus[status]) && typeof ProductionOrderStatus[status] !== 'string';
  }

  private setupTimming() {
    const source = interval(1000);
    this.subscription = source.subscribe(_ => this.calculateRemainingTime());
  }

  private calculateRemainingTime() {
    const startGMT = this.dateHelper.utcToGMT(new Date(this.productionOrder.startDate));
    const startMoment = moment(startGMT);
    // TODO: review the moment(date()) construction to supress warning
    const actualDate = moment(Date());
    const finishTime = startMoment.add(this.prepTime, 'seconds');
    const duration = moment.duration(actualDate.diff(finishTime));
    this._remainingTime = duration.abs();
  }

  private durationProgress(value?: moment.Duration) {
    if (!value || this.isDelayed) { return 0; }
    return ((value.asSeconds() * 100) / this.prepTime);
  }

  private formatDuration(value?: moment.Duration) {
    if (!value) { return 'Invalid'; }
    return moment.utc(value.asMilliseconds()).format('HH:mm:ss');
  }
    // Mock
  private setupRoomTeam() {
    this.roomTeam = this.loadImage();
  }
  private loadImage() {
    return [
      {id: 6, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611', name: 'Amaranta Hernandez'},
      {id: 4, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-21_at_4.53.22_PM.jpeg202110221420109824', name: 'Ana DLeon'},
      {id: 11, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-14_at_15.56.09.jpeg202110142027525353', name: 'Juan Salazar'},
      {id: 8, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179', name: 'Randy Caraballo'},
      {id: 7, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524', name: 'Madelyn Leos'},
      {id: 3, image: "https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D'-Leo¦ün.png202110132050517560", name: 'Orlando DLeon'},
      {id: 2, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763', name: 'Joniz Gonzalez'},
      {id: 9, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Anyela_ramos.jpg202110141532343931', name: 'Anyela Ramos'},
      {id: 10, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Nilda-Vasquez.png202110141533146871', name: 'Nilda Vasquez'},
    ];
  }

}
