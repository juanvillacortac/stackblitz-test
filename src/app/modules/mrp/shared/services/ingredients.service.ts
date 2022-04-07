import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddIngredientViewModel } from 'src/app/models/mrp/add-room-ingredient';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { SubstitutionIngredient } from 'src/app/models/mrp/substitution-ingredient';
import { SubstitutionIngredientSetting } from 'src/app/models/mrp/substitution-ingredient-setting';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private apiUrl = `${environment.API_BASE_URL_ROOM_MANAGER}/ingredient`;

  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  async loadIngredients(filters: IngredientFilter) {
    return this.httpClient.get<Ingredient[]>(this.apiUrl, this.convertToParams(filters)).toPromise();
  }

  async addIngredients(ingredients: AddIngredientViewModel) {
    return this.httpClient.post<boolean>(this.apiUrl, ingredients).toPromise();
  }

  async removeIngredient(idRoom: number, idIngredient: Number) {
    const deleteParams = { idRoom: idRoom, idIngredient: idIngredient };
    return this.httpClient.delete<boolean>(this.apiUrl, this.convertToParams(deleteParams)).toPromise();
  }

  async getSustitutionsIngredients(productId: number) {
    return this.httpClient.get<SubstitutionIngredientSetting>(`${this.apiUrl}/${productId}/getSubstitutionIngredientSetting`).toPromise();
  }

  async saveSustitutionsIngredient(setting: SubstitutionIngredientSetting) {
    const userId = this.authService.storeUser.id;
    return this.httpClient.post<boolean>(`${this.apiUrl}/SaveSubstituteIngredientSettings?userId=${userId}`, setting).toPromise();
  }

  private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
