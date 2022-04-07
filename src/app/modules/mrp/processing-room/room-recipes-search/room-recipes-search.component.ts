import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { ProcessingRoomRecipes } from 'src/app/models/mrp/processing-room-recipes';
import { Recipe } from 'src/app/models/mrp/recipe';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProcessingRoomService } from '../shared/processing-room.service';

@Component({
  selector: 'app-room-recipes-search',
  templateUrl: './room-recipes-search.component.html',
  styleUrls: ['./room-recipes-search.component.scss']
})
export class RoomRecipesSearchComponent implements OnInit {
  isActive: number;
  submitted = false;
  idRoom: number;
  loading: boolean;
  isEdit = false;
  title: string;
  recipeSelected: Recipe = null;
  addedRecipes: Recipe[] = [];
  @Input() addedRoomRecipes: ProcessingRoomRecipes[];
  @Input() roomRecipe: ProcessingRoomRecipes;
  @Input() showPanel = false;
  @Output() hideDialogForm = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Inactivo', value: 0},
    {label: 'Activo', value: 1}
  ];

  showSearching = false;

  constructor(
    public userPermissions: UserPermissions,
    private actRoute: ActivatedRoute,
    private processingRoomService: ProcessingRoomService,
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService) {
    this.idRoom = this.actRoute.snapshot.params['id'];
    }

  ngOnInit(): void {
    if (this.roomRecipe) {
      this.isEdit = true;
      this.isActive = this.roomRecipe.active ? Number(StatusEnum.active) : Number(StatusEnum.inactive);
      this.showSearching = false;
      this.title = 'Editar receta de sala';

    } else {
      this.isEdit = false;
      this.showSearching = true;
      this.loadRecipesFromAddedRecipes();
      this.title = 'Agregar receta a sala';
      this.isActive =  Number(StatusEnum.active);
    }
  }

  loadSelected() {
    this.showSearching = false;
  }

  loadRecipesFromAddedRecipes() {
    this.addedRoomRecipes.forEach(roomRecipe => {
      this.addedRecipes.push(this.getReipeFromRoomRecipe(roomRecipe));
    });
  }

  private getReipeFromRoomRecipe(recipe: ProcessingRoomRecipes) {
    return { id: recipe.idRecipe } as Recipe;
  }

  finishSearching(recipe) {
    this.recipeSelected = recipe ?? null;
    if (!this.recipeSelected) { this.showSearching = true; return; }
    this.addRecipes();
  }

  onRecipeSelected(recipe) {
    this.recipeSelected = recipe ?? null;
  }

  verifySave() {
    this.submitted = true;
    this.loadingService.startLoading('wait_saving');
    if (this.isEdit) {
      this.addRecipes();
    } else {
      if (!this.recipeSelected) {this.loadingService.stopLoading(); return; }
      this.addRecipes();
    }
  }

  handleChange(e) {
    this.isActive = e.checked;
  }
  hideDialog() {
    this.onEmitHideForm(false);
  }

  toProcessingRoomRecipesModel() {
    const model = new ProcessingRoomRecipes();
          model.id = this.isEdit ? this.roomRecipe.id : -1;
          model.idProcessingRoom = Number(this.idRoom);
          model.active = ( this.isActive === Number(StatusEnum.active) );
          model.idRecipe =  this.isEdit ? this.roomRecipe.idRecipe : this.recipeSelected.id;

    return model;
}
  public addRecipes() {
    const addViewModel = this.toProcessingRoomRecipesModel();
    this.loading = true;
    this.processingRoomService
      .addRecipe(addViewModel)
      .then(() => this.successAddingIngredients())
      .then(() => this.onEmitHideForm(true))
      .catch(error => this.handleError(error));
  }

  private successAddingIngredients() {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.processing_room.rooms', 'saved');
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.recipe.recipes', error?.error?.message ?? 'error_service');
  }

  public onEmitHideForm(reload: boolean): void {
    this.showPanel = false;
    this.hideDialogForm.emit(reload);
  }
}
