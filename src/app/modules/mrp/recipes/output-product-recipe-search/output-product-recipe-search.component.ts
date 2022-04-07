import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';

@Component({
  selector: 'app-output-product-recipe-search',
  templateUrl: './output-product-recipe-search.component.html',
  styleUrls: ['./output-product-recipe-search.component.scss']
})
export class OutputProductRecipeSearchComponent implements OnInit {
  isActive: number;
  submitted = false;
  loading: boolean;
  isEdit = false;
  title: string;
  ingredientSelected: Ingredient = null;
  addedIngredients: Ingredient[] = [];
  @Input() showPanel = false;
  @Output() getResult = new EventEmitter<Ingredient>();

  showSearching = true;

  constructor(
    private dialogService: DialogsService
  ) {}

  ngOnInit(): void {
  }

  loadSelected() {
    this.showSearching = false;
  }

  getItemsSelected(ingredient) {
    this.ingredientSelected = ingredient ?? null;
  }

  onRecipeSelected(recipe) {
    this.ingredientSelected = recipe ?? null;
  }

  verifySave() {
    this.submitted = true;
      if (!this.ingredientSelected) {return; }
      this.addIngredient();
  }

  handleChange(e) {
    this.isActive = e.checked;
  }

  public addIngredient() {
    this.onEmitHideForm(this.ingredientSelected);
  }

  public onEmitHideForm(model: any): void {
    this.showPanel = false;
    this.getResult.emit(model);
  }
}
