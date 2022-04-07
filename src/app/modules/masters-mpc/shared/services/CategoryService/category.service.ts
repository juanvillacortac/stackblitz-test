import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from 'src/app/models/masters-mpc/category';
import { environment } from 'src/environments/environment';
import { CategoryFilter } from '../../../shared/filters/category-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public _categoryList: Category[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  gettreeCategory(filters: CategoryFilter = new CategoryFilter()) {
    return this._httpClient
      .get<Category[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Category/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  getCategorys(filters: CategoryFilter = new CategoryFilter()) {
    return this._httpClient
      .get<Category[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Category/GetCategorys/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  postCategory(_category: Category = new Category()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Category/` + id, _category);
  }

  changeLevelCategory(_category: Category = new Category()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Category/ChangeLevel/` + id, _category);
  }
  gettreeCategoryPromise(filters: CategoryFilter = new CategoryFilter()) {
    return this._httpClient
      .get<Category[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Category/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }

}
