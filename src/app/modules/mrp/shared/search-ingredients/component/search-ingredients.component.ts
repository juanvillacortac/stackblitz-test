import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ProductCatalog } from 'src/app/modules/products/shared/view-models/product-catalog.viewmodel';
import { LoaderFacotry, LoaderType } from '../../factories/loader-facotry';

@Component({
  selector: 'app-search-ingredients',
  templateUrl: './search-ingredients.component.html',
  styleUrls: ['./search-ingredients.component.scss']
})

export class SearchIngredientsComponent implements OnInit, OnDestroy {
  @Input() set showSearching(_value: any) {
    if (!_value) { this.emitEvents(); }
  }

  @Input() loadKey = 'ingredient';

  @Input() isSingleMode = false;
  @Input() exceptions: Ingredient[] = [];

  @Output() hideSearch: EventEmitter<Ingredient[]> = new EventEmitter<Ingredient[]>();
  @Output() getResult: EventEmitter<any> = new EventEmitter<any>();

  set selectedIngredients(_value: any) {
      this.getResult.emit(_value);

  }
  ingredients: Ingredient[] = [];
  filter: IngredientFilter;
  cols: any[];

  constructor(private loaderFacotry: LoaderFacotry, private readonly dialogService: DialogsService,
    private readonly loadingSerivce: LoadingService) { }

  ngOnDestroy(): void {
    this.emitEvents();
  }

  ngOnInit(): void {
    this.clearFilters();
    this.setupColumns();
  }

  search() {
    this.loadingSerivce.startLoading('wait_loading');
    this.load();
  }

  clearFilters() {
    this.filter = { ean: null, name: '', idRoom: null };
  }

  load() {
    if (this.loadKey === 'product') {
      this.loadProduct();
    } else {
      if (this.loadKey === 'ingredient') { }
      this.loadIngredients();
    }
  }

  setupColumns() {
    this.cols = [
      { field: 'barcode', header: 'Barra' },
      { field: 'name', header: 'Nombre' },
      { field: 'actualCost', header: 'Costo actual' }
    ];
  }

  loadIngredients() {
    this.loaderFacotry.createLoader(LoaderType.ingredient)
      .load({...this.filter})
      .then(ingredients => this.getIngredients(ingredients))
      .then(() => {
        if (!this.ingredients || this.ingredients.length === 0) {
            this.dialogService.confirmDialog('confirm', 'No se encontraron ingredientes, ¿desea hacer la búsqueda de productos de MPC?',
            () => { this.loadProduct(); });
        }
      })
      .catch(error => this.handleError(error))
      .then(() => this.loadingSerivce.stopLoading());
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingSerivce.stopLoading();
    this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.message ?? 'error_service');
  }

  loadProduct() {
     this.loaderFacotry.createLoader(LoaderType.product)
    .load({...this.filter})
    .then(products => this.getIngredientsFromProducts(products))
    .catch(error => this.handleError(error))
    .then(() => this.loadingSerivce.stopLoading());
  }

  private emitEvents() {
      this.hideSearch.emit(this.selectedIngredients);
      this.ingredients = [];
      this.clearFilters();
  }

  private getIngredients (ingredients: Ingredient[]) {
    this.ingredients.length = 0;
    this.ingredients = ingredients.filter(x => !this.isAnException(x));
  }

  private getIngredientsFromProducts(products: ProductCatalog[]) {

    if(products.length === 0) {
      this.dialogService.warnMessage("mrp.ingredients.ingredients", "result_not_found");
      return;
    }

    this.ingredients.length = 0;
    products.forEach(x => {// status activo and creado
      const ingredient = this.getIngredientFromProduct(x);
      this.ingredients.push(ingredient);
    });

    this.ingredients = this.ingredients.filter(x => !this.isAnException(x));
  }

  private getIngredientFromProduct(product: ProductCatalog) {
    const ingredient = new Ingredient();
    ingredient.name = product.name;
    ingredient.productId = product.productId;
    ingredient.barcode =  product.barcode;
    ingredient.actualCost = 0;
    ingredient.packageId = product.packingId;

    return ingredient;
  }

  private isAnException(ingredient: Ingredient) {
    return this.exceptions.findIndex(x => x.productId === ingredient.productId && x.barcode === ingredient.barcode) >= 0;
  }
}

