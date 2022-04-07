import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { ProcessingRoomRecipeFilters } from 'src/app/models/mrp/processing-room-recipe-filters';
import { ProcessingRoomRecipes } from 'src/app/models/mrp/processing-room-recipes';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProcessingRoomService } from '../shared/processing-room.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { RecipeService } from '../../recipes/shared/recipe.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-processing-room-recipes',
  templateUrl: './processing-room-recipes.component.html',
  styleUrls: ['./processing-room-recipes.component.scss']
})
export class ProcessingRoomRecipesComponent implements OnInit {
  idRoom: number;
  loading: boolean;
  roomRecipes: ProcessingRoomRecipes[] = [];
  roomRecipe: ProcessingRoomRecipes;
  added: ProcessingRoomRecipes[] = [];
  filter: ProcessingRoomRecipeFilters = new ProcessingRoomRecipeFilters();
  processingRoomFilter: ProcessingRoomFilters;
  processingRoom: ProcessingRoom = new ProcessingRoom();
  searchRecipeShowing = false;
  cols: any[];
  permissionsIDs = {...Permissions};
  constructor(
    public userPermissions: UserPermissions,
    private processingRoomService: ProcessingRoomService,
    private recipeService: RecipeService,
    private actRoute: ActivatedRoute,
    private route: Router,
    private dialogService: DialogsService,
    private breadcrumbService: BreadcrumbService,
    private readonly loadingService: LoadingService) {
      this.idRoom = this.actRoute.snapshot.params['id'];
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'Salas', routerLink: ['/mrp/processing-room'] },
        { label: 'Detalles de la sala ', routerLink: [`/mrp/room-recipes/${this.idRoom}`] }
    ]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.setupColumns();
    this.setupFilter();
    this.setupRoomFilter();
    this.loadProcessingRoomDetail().then(() => {
    this.loadRecipes();
    });
    this.roomRecipe = {} as ProcessingRoomRecipes;

    this.loading = false;
  }

  search() {
    this.roomRecipe = null;
    this.searchRecipeShowing = true;
  }

  searchRecipe() {
    this.roomRecipe = null;
    this.searchRecipeShowing = true;
  }
  edit(recipe) {
    this.roomRecipe = recipe;
    this.searchRecipeShowing = true;
  }

  openRecipeDetails(recipeId) {
    this.recipeService.idRoom = this.idRoom;
    this.route.navigate(['/mrp/recipe-ingredients', recipeId]);
  }

  setupFilter() {
    this.filter.idProcessingRoom = this.idRoom;
  }
  setupRoomFilter() {
    const filters = new ProcessingRoomFilters;
    filters.id = this.idRoom;
    this.processingRoomFilter = filters;
  }

  public childCallBack(reload: boolean): void {
    this.searchRecipeShowing = false;
    if (reload) {
      this.loadRecipes();
    }
  }

  setupColumns() {
    this.cols = [
      { field: 'id', header: '', display: 'none' },
      { field: 'name', header: 'Nombre', display: 'table-cell' },
      { field: 'recipeCost', header: 'PVP', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell'},
      { field: 'edit', header: '' }
    ];
  }

  isBooleanColumn(field: string) {
    return ['isIn', 'isOut', 'isSupply', 'active'].includes(field);
  }

  cancel() {
    this.route.navigate(['/mrp/processing-room']);
  }

  public loadRecipes() {
    this.loading = true;
    this.processingRoomService
      .getProcessingRoomRecipes({...this.filter})
      .then(recipes => this.roomRecipes = recipes.sort((a, b) => b.id - a.id))
      .then(() => this.completeCallBack() )
      .catch(error => this.handleError(error));
  }

  private loadProcessingRoomDetail = () => {
    this.loading = true;
    return  this.processingRoomService
      .getProcessingRoom({...this.processingRoomFilter})
      .then(room => this.processingRoom = room[0])
      .then(() => this.loading = false)
      .catch(error => this.handleError(error));
  }

  private completeCallBack() {
    this.loading = false;
    this.loadingService.stopLoading();
  }
  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
  }

}
