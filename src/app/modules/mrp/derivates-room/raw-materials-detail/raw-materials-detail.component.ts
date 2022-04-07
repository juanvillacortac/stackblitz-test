import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { DerivateRoomService } from '../shared/services/derivate-room.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-raw-materials-detail',
  templateUrl: './raw-materials-detail.component.html',
  styleUrls: ['./raw-materials-detail.component.scss']
})
export class RawMaterialsDetailComponent implements OnInit {

  formTitle: string;
  submitted = false;
  @Input() rawMaterial = new RawMaterial();
  @Input() rawMaterialsAdded: RawMaterial[] = [];
  @Output() onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  ingredientSelected: Ingredient;

  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  addedIngredients: Ingredient[] = [];

  constructor(private derivateRoomService: DerivateRoomService, private readonly loadingService: LoadingService,
    private readonly dialogService: DialogsService) { }
  showSearching = true;

  ngOnInit(): void {
    this.setTitle();
    this.setAddedIngredients();
  }

  loadSelected() {
    this.showSearching = false;
  }

  setTitle() {
    if (this.isEdit()) {
      this.formTitle = 'mrp.derivatives.edit_raw_material';
    } else {
      this.formTitle = 'mrp.derivatives.add_raw_material';
    }
  }

  isEdit() {
    return this.rawMaterial && this.rawMaterial.id > 0;
  }

  onSave() {
    this.submitted = true;

    if (this.isIngredientSelected() && this.rawMaterialIsValid()) {
      this.setRawMaterialProperties();
      this.loadingService.startLoading('wait_saving');
      this.derivateRoomService.saveRawMaterial(this.rawMaterial)
      .then(result => this.saveSucceded())
      .catch(error => this.handleError(error));
    }
  }

  private setAddedIngredients() {
      if (this.rawMaterialsAdded) {
        this.rawMaterialsAdded.forEach(x => {
          this.addedIngredients.push(this.setIngredientFromRawMaterial(x));
        });
      }
  }

  private setIngredientFromRawMaterial(rawMaterial: RawMaterial) {
    const ingredient = new Ingredient();
    ingredient.productId = rawMaterial.productId;
    ingredient.packageId = rawMaterial.packageId;
    ingredient.barcode = rawMaterial.barcode;
    return ingredient;
  }

  private saveSucceded() {
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.derivatives.raw_materials', 'saved');
    this.onEmitHideForm(true);
  }

  private setRawMaterialProperties() {
    this.rawMaterial.retailPrice = 0;
    this.rawMaterial.actualCost = 0;
    this.rawMaterial.observation = '';
    this.rawMaterial.roomId = Number(this.rawMaterial?.roomId);
    this.setProductProperties();
  }

  setProductProperties() {
    this.rawMaterial.productId = this.ingredientSelected?.productId;
    this.rawMaterial.barcode = this.ingredientSelected?.barcode;
    this.rawMaterial.packageId = this.ingredientSelected?.packageId;
  }

  private isIngredientSelected() {
    if (this.isEdit() || (this.ingredientSelected && this.ingredientSelected.productId > 0)) {
      return true;
    } else {
      this.dialogService.errorMessage('error', 'mrp.derivatives.raw_materials_ingredient_not_selected');
      return false;
    }
  }

  private rawMaterialIsValid() {
    return this.rawMaterial && this.rawMaterial.name && this.rawMaterial.name.length > 0;
  }

  private handleError(error: HttpErrorResponse) {
    this.showSearching = true;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.derivatives.raw_materials', error?.error?.message ?? 'error_service');
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
  }

  public getItemsSelected(itemSelected) {
    this.ingredientSelected = itemSelected;
  }

  validateForm(key) {
    let result = { isValid: false, error: '' };

    switch (key) {
      case 'name':
        if (this.submitted && (!this.rawMaterial.name || !this.rawMaterial.name.trim())) {
          result = { isValid: true, error: 'validations.name_required' };
        }
        break;
      default:
        break;
    }
    return result;
  }

}
