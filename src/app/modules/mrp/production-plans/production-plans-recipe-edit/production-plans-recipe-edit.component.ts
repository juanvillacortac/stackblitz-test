import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanRecipe } from 'src/app/models/mrp/plan-recipe';

@Component({
  selector: 'app-production-plans-recipe-edit',
  templateUrl: './production-plans-recipe-edit.component.html',
  styleUrls: ['./production-plans-recipe-edit.component.scss']
})
export class ProductionPlansRecipeEditComponent implements OnInit {
  disabled = true;
  recipeForm: FormGroup;
  @Input() showEditing = false;
  @Input() editingRecipe: PlanRecipe;
  @Output() recipeEdited: EventEmitter<PlanRecipe> = new EventEmitter<PlanRecipe>();
  get isInvalidQty() { return this.recipeForm.invalid; }

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setupForm();
  }

  onRecipeEdited() {
    if (this.recipeForm.invalid) { return; }
    this.showEditing = false;
    this.recipeEdited.emit(this.recipeForm.value);
  }

  hideDialog() {
    this.showEditing = false;
    this.recipeEdited.emit(null);
  }

  private setupForm() {
    this.recipeForm = this.formBuilder.group({
      idRecipe: [-1, Validators.required],
      name: [{ value: '', disabled: true }],
      quantity: [undefined, Validators.min(0.01)],
      currentInventory: [{ value: undefined, disabled: true }]
    });
    if (this.editingRecipe !== undefined) {
      this.recipeForm.patchValue(this.editingRecipe);
    }
  }
}
