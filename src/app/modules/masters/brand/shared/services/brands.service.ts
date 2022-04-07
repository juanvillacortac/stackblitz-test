import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { Brands } from 'src/app/models/masters/brands';
import {BrandClass} from 'src/app/models/masters/brandClass';
import { environment } from 'src/environments/environment';
import { brandsFilter } from '../filters/brands-Filters';
import { brandsClassFilter } from '../filters/brandClass-filters';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  public _brandsList: Brands[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

    getBrandsList(filters: brandsFilter = new brandsFilter()) {
      return this._httpClient
        .get<Brands[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Brands/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    getBrandsClassList(filters: brandsClassFilter = new brandsClassFilter()) {
      return this._httpClient
        .get<BrandClass[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Brands/BrandsClass/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }
    InsertUpdateBrands(brand :Brands) 
    {  
      
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Brands/`+id, brand);
     
    }
   

  
}
