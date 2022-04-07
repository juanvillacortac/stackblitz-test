import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Recipe } from 'src/app/models/mrp/recipe';
import { RecipeCost } from 'src/app/models/mrp/recipe-cost';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { RecipeIngredients } from 'src/app/models/mrp/recipe-ingredients';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class RecipeService {
    private apiUrl = `${environment.API_BASE_URL_ROOM_MANAGER}/Recipe`;

    constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice: AuthService = new AuthService(this.httpClient);
    public selectedRecipe: Recipe;
    public idRoom = -1;

    getRecipe(filters: RecipeFilter) {
      return this.httpClient
        .get<Recipe[]>(`${this.apiUrl}/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        })
        .toPromise();
    }

    getRecipeIngredients(idRecipe: number) {
      return this.httpClient
        .get<RecipeIngredients[]>(`${this.apiUrl}/GetRecipeIngredients/?idRecipe=${idRecipe}`)
        .toPromise();
    }

    async addRecipeIngredients(detail: RecipeIngredients) {
      const { id } = this._Authservice.storeUser;
      return this.httpClient.post<number>(`${this.apiUrl}/PostIngredients?userId=${id}`, detail).toPromise();
    }

    async addRecipes(detail: Recipe[]) {
      const { id } = this._Authservice.storeUser;
      return this.httpClient.post<number>(`${this.apiUrl}/Post?userId=${id}`, detail).toPromise();
    }

    async calculateRecipeCost(detail: Recipe) {
      const { id } = this._Authservice.storeUser;
      return this.httpClient.post<RecipeCost>(`${this.apiUrl}/CalculateRecipeCost?userId=${id}`, detail).toPromise();
    }

    async removeIngredient( idRecipeIngredient: Number) {
      const { id } = this._Authservice.storeUser;
      const deleteParams = { userId: id, idRecipeIngredient: idRecipeIngredient};
      return this.httpClient.delete<boolean>(`${this.apiUrl}/RemoveIngredient`,
             this.convertToParams(deleteParams)).toPromise();
    }

    async loadRecipesToRecalculate() {
    return this.httpClient.get<Recipe[]>(`${this.apiUrl}/GetRecipesToRecalculate`).toPromise();
    }

    async updateRecipesCost(detail: Recipe[]) {
      const { id } = this._Authservice.storeUser;
      return this.httpClient.post<number>(`${this.apiUrl}/UpdateRecipesCosts?userId=${id}`, detail).toPromise();
    }



    private convertToParams(object) { return { params: this._httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
