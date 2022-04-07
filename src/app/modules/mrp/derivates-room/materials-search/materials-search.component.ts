import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { Material } from 'src/app/models/mrp/material';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';

@Component({
  selector: 'app-materials-search',
  templateUrl: './materials-search.component.html',
  styleUrls: ['./materials-search.component.scss']
})
export class MaterialsSearchComponent implements OnInit {

  constructor(private readonly dialogService: DialogsService) { }

  @Input() showPanel = false;
  @Input() addedMaterials: Material[] = [];
  @Input() rawMaterialSelected: RawMaterial = new RawMaterial();
  @Output() itemsSelected = new EventEmitter<Material>();
  @Output() onHideDialog = new EventEmitter<boolean>();
  percentage: number;
  submitted = false;
  ingredientSelected: Ingredient;
  addedIngredients: Ingredient[] = [];
  showSearching = true;

  ngOnInit(): void {
    this.loadIngredientsFromAddedMaterials();
    this.addIngredientFromRawMaterialSelected();
    this.showSearching = true;
  }


  loadSelected() {
    this.submitted = true;

    if (this.isValidForm() && this.isProductSelected()) {
      this.itemsSelected.emit(this.getMaterialFromIngredientSelected());
      this.clearProperties();
      this.showSearching = false;
      this.showPanel = false;
    }
  }

  loadIngredientsFromAddedMaterials() {
    this.addedMaterials.forEach(material => {
        this.addedIngredients.push(this.getIngredientFromMaterial(material));
    });
  }

  private getIngredientFromMaterial(material: Material) {
    return { productId: material.productId, barcode: material.barcode, packageId: material.packageId } as Ingredient;
  }

  private addIngredientFromRawMaterialSelected() {
    this.addedIngredients.push(this.getIngredientFromRawMaterialSelected());
  }

  private getIngredientFromRawMaterialSelected() {
    return { productId: this.rawMaterialSelected.productId, barcode: this.rawMaterialSelected.barcode } as Ingredient;
  }

  getMaterialFromIngredientSelected() {
    const material = new Material();
    material.id = -1;
    material.productId = this.ingredientSelected?.productId;
    material.name = this.ingredientSelected?.name;
    material.percentage = this.percentage;
    material.barcode = this.ingredientSelected?.barcode?.toString();
    material.packageId = this.ingredientSelected?.packageId;
    material.active = true;

    return material;
  }

  hideDialog() {
    this.showSearching = false;
    this.clearProperties();
    this.onHideDialog.emit(false);
  }

  public getItemsSelected(itemSelected) {
    this.ingredientSelected = itemSelected;
  }

  isValidForm() {
    return this.isValidPercentageForm().isValid && this.isValidPerformance();
  }

  isValidPercentageForm() {
    const result = this.percentage && this.percentage > 0 && this.percentage < 100;
    let error = '';
    if (!this.percentage || this.percentage === 0) {
      error = 'validations.mrp.derivatives.percentage_required';
    } else {
      if (!result) {
        error = 'validations.mrp.derivatives.percentage_invalid';
      }
    }

    return { isValid: result, error: error };
  }

  isValidPerformance() {
    const total = (this.getTotalPerformance() + this.percentage);
    const result = (total > 0 &&  total < 100);
    if (!result) {
      this.dialogService.errorMessage('mrp.derivatives.derivatives', 'validations.mrp.derivatives.percentage_invalid');
    }
    return result;
  }

  isProductSelected() {
    if (this.ingredientSelected && this.ingredientSelected.productId > 0) {
      return true;
    } else {
      this.dialogService.errorMessage('mrp.derivatives.derivatives', 'validations.mrp.product_search.product_not_selected');
      return false;
    }
  }

  getTotalPerformance() {
    return this.addedMaterials ? this.addedMaterials.reduce((t, { percentage }) => t + percentage, 0) : 0;
  }

  clearProperties() {
    this.percentage = undefined;
    this.submitted = false;
    this.ingredientSelected = undefined;
  }

}
