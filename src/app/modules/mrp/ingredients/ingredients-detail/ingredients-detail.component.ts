import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddIngredientViewModel } from 'src/app/models/mrp/add-room-ingredient';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { IngredientsService } from '../../shared/services/ingredients.service';

@Component({
  selector: 'app-ingredients-detail',
  templateUrl: './ingredients-detail.component.html',
  styleUrls: ['./ingredients-detail.component.scss']
})
export class IngredientsDetailComponent implements OnInit {
  submitted = false;
  daysToRestock: number;
  loading: boolean;
  isEdit = false;
  title: string;
  addedIngredients: Ingredient = null;
  @Input() exceptionsIngredients: Ingredient[] = [];
  @Input() ingredients: Ingredient;
  @Output() hideDialogForm = new EventEmitter<boolean>();

  showSearching = true;

  constructor(
    public userPermissions: UserPermissions,
    private ingredientService: IngredientsService,
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    this.title = 'Ingrediente';
    if (this.ingredients) {
      this.addedIngredients = this.ingredients;
      this.isEdit = true;
      this.daysToRestock = this.ingredients.daysToRestock;
      this.showSearching = false;
    } else {
      this.daysToRestock = 0;
      this.isEdit = false;
      this.showSearching = true;
    }
    this.showSearching = true;
  }

  loadSelected() {
    this.showSearching = false;
  }

  finishSearching(ingredients) {
      this.addedIngredients = ingredients ?? null;
  }

  verifySave() {
    this.submitted = true;
    this.loadingService.startLoading('wait_saving');
    if (this.invalidateDaysToRestock || !this.addedIngredients) { this.loadingService.stopLoading(); return; }
      this.addIngredients();
  }

  hideDialog() {
    this.onEmitHideForm(false);
  }
  productToIngredientModel() {
    const model = new AddIngredientViewModel();

  }
  toIngredientViewModel() {
    const model = new AddIngredientViewModel();
      this.addedIngredients.id = this.isEdit ? this.addedIngredients.id : -1;
      this.addedIngredients.daysToRestock = this.daysToRestock;
      this.addedIngredients.barcode = this.addedIngredients.barcode ?? '';
      this.addedIngredients.active = true;
      model.idRoom = Number(-1);
      model.ingredients = this.addedIngredients;
    return model;
}
  public addIngredients() {
    const addViewModel = this.toIngredientViewModel();
    this.loading = true;
    this.ingredientService
      .addIngredients(addViewModel)
      .then(() => this.successAddingIngredients())
      .then(() => this.onEmitHideForm(true))
      .catch(error => this.handleError(error));
  }

  private successAddingIngredients() {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.ingredients.ingredients', 'saved');
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.error?.message ?? 'error_service');
  }

  public onEmitHideForm(reload: boolean): void {
    this.hideDialogForm.emit(reload);
  }

  get invalidateDaysToRestock () {
    return  (this.daysToRestock === 0 || this.daysToRestock === null);
    }

}
