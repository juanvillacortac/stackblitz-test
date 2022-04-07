import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { IngredientsService } from '../../shared/services/ingredients.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent implements OnInit {
  openSustitutionIngredientSetting = false;
  showFilters = false;
  loading = false;
  submitted: boolean;
  showDialog = false;
  isCallback = false;
  ingredientFilters: IngredientFilter;
  ingredient: Ingredient = new Ingredient();
  ingredientList: Ingredient[] = [];
  ingredientNotFilteredList: Ingredient[] = [];

  displayedColumns: ColumnD<Ingredient>[] =
  [
   {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
   {template: (data) => data.barcode, field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => data.name, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => data.daysToRestock, field: 'daysToRestock', header: 'Tiempo de reposición', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];
  permissionsIDs = {...Permissions};

  constructor(
      private router: Router,
      public _ingredientService: IngredientsService,
      public userPermissions: UserPermissions,
      private breadcrumbService: BreadcrumbService,
      private readonly loadingService: LoadingService,
      private dialogService: DialogsService) {
        this.breadcrumbService.setItems([
          { label: 'MRP' },
          { label: 'Ingredientes', routerLink: ['/mrp/ingredients'] }
      ]);
    }

    ngOnInit(): void {
      this.clearFilters();
      this.search();

    }
    clearFilters() {
        this.ingredientFilters = { ean: null, name: '', idRoom: null };
    }
    search() {
      this.loadingService.startLoading('wait_loading');
      this.loading = true;
      this._ingredientService.loadIngredients(this.ingredientFilters).then(result => {
        this.ingredientList = result.sort((a, b) => b.id - a.id);
        this.loading = false;
        this.loadingService.stopLoading();
      }).catch(error => this.handleError(error));
    }
    openNew() {
      this.ingredient = null;
      this.showDialog = true;
    }
    onEdit(ingredient) {
      this.ingredient = ingredient;
      this.showDialog = true;

    }
    onShowIngredientSustitution(ingredient) {
      this.ingredient = ingredient;
      if (this.ingredient) {
        this.openSustitutionIngredientSetting = true;
      }
    }

    private handleError(error: HttpErrorResponse) {
      this.loading = false;
      this.loadingService.stopLoading();
      this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.error?.message ?? 'error_service');
    }
    public childCallBack(reload: boolean): void {
      this.showDialog = false;
      if (reload) {
        this.isCallback = true;
        this.search();
      }
  }
  public childCallBackSustitution(reload: boolean): void {
    this.openSustitutionIngredientSetting = false;
  }
}
