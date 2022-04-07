import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { SubstitutionIngredient } from 'src/app/models/mrp/substitution-ingredient';
import { SubstitutionIngredientSetting } from 'src/app/models/mrp/substitution-ingredient-setting';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { IngredientsService } from '../../shared/services/ingredients.service';

@Component({
  selector: 'app-substitutions-ingredient-setting',
  templateUrl: './substitutions-ingredient-setting.component.html',
  styleUrls: ['./substitutions-ingredient-setting.component.scss']
})
export class SubstitutionsIngredientSettingComponent implements OnInit {

  @Input() showPanel = false;
  @Input() ingredient: Ingredient;
  cols: any[];
  selectedIngredients: SubstitutionIngredient[] = [];
  setting: SubstitutionIngredientSetting = new SubstitutionIngredientSetting();
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  permissionsIDs = {...Permissions};

  constructor(private ingredientService: IngredientsService, private dialogService: DialogsService,
    private readonly loadingService: LoadingService, public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.setupColumns();
    this.getSetting();
  }

  onSelectChanged(ingredient: SubstitutionIngredient) {

    const resultIndex = this.getIndexOfItem(ingredient);
    const item = this.setting.sustitutionIngredients[resultIndex];
    item.active = !ingredient.active;

    this.updateSelectedItems();
  }

  updateSelectedItems() {
    if (this.selectedIngredients) {
      this.selectedIngredients.forEach(x => {
        const indexToDelete = this.getIndexOfItem(x);
        this.setting.sustitutionIngredients.splice(indexToDelete, 1);
      });

      let newList = this.selectedIngredients;
      newList =  this.selectedIngredients.concat(this.setting.sustitutionIngredients);

      this.setting.sustitutionIngredients = newList;
    }
  }

  getSelectedIngredients() {
    this.selectedIngredients = this.setting.sustitutionIngredients.filter(x => x.active);
  }

  showChevronUpButton(index: number) {
    const item = this.setting.sustitutionIngredients[index];
    return item.active && index > 0;
  }

  showChevronDownButton(index: number) {
    const item = this.setting.sustitutionIngredients[index];
    return item.active && (this.setting.sustitutionIngredients.filter(x => x.active).length > (index + 1));
  }

  setupColumns() {
    this.cols = [
      { field: 'barcode', header: 'Barra' },
      { field: 'name', header: 'Nombre' }
    ];
  }

  getSetting() {
    if (this.ingredient?.productId) {
      this.loadingService.startLoading();
      this.ingredientService.getSustitutionsIngredients(this.ingredient?.productId)
      .then(data => {
        this.loadingService.stopLoading();
        if (data) {
          this.setting = data;
          this.getSelectedIngredients();
        }
      })
      .catch(error => this.handleError(error));
    }
  }

  isItemSelected(ingredient: SubstitutionIngredient) {
    const result = this.selectedIngredients.findIndex(x => x.productId === ingredient.productId);
    if (result > -1) {
      return true;
    } else { return false; }
  }

  save() {
    this.loadingService.startLoading('wait_saving');
    this.setOrderValues();
    this.ingredientService.saveSustitutionsIngredient(this.setting).then(result => {
      this.loadingService.stopLoading();
      if (result) {
        this.dialogService.successMessage('mrp.ingredients.ingredients', 'Se han guardado los cambios');
        this.onHideDialogForm.emit(true);
      }
    }).catch(error => this.handleError(error));
  }

  hideDialog() {
    this.onHideDialogForm.emit(false);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.message ?? 'error_service');
  }

  getDownIngredient(ingredient: SubstitutionIngredient) {
    const resultIndex = this.getIndexOfItem(ingredient);

    const nextItem = this.setting.sustitutionIngredients[resultIndex + 1];

    this.setting.sustitutionIngredients[resultIndex + 1] = this.setting.sustitutionIngredients[resultIndex]; // down item
        this.setting.sustitutionIngredients[resultIndex] = nextItem; // up old next item

  }

  getUpIngredient(ingredient: SubstitutionIngredient) {
    const resultIndex = this.getIndexOfItem(ingredient);

    const previousItem = this.setting.sustitutionIngredients[resultIndex - 1];

    this.setting.sustitutionIngredients[resultIndex - 1] = this.setting.sustitutionIngredients[resultIndex];
    this.setting.sustitutionIngredients[resultIndex] = previousItem;

  }

  getIndexOfItem(ingredient: SubstitutionIngredient) {
    return this.setting.sustitutionIngredients.findIndex(i => i.productId === ingredient.productId && i.barcode === ingredient.barcode);
  }

  setOrderValues() {
    for (let i = 0; i < this.setting.sustitutionIngredients.length; i++) {
      this.setting.sustitutionIngredients[i].order = i + 1;
    }
  }

}
