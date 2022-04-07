import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { DescriptionTypeFilter } from '../../filters/descriptionType-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { Publication } from 'src/app/models/products/publication';
import { PublicationFilter } from '../../filters/publication-filter';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  public _publicationList: Publication[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  // Publication= new Publication()
  getPublications(_publicationId:PublicationFilter= new PublicationFilter()){
    return this._httpClient
      .get<Publication[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(_publicationId)
      })
  }
  postPublications(_publication: Publication = new Publication(), idproduct: number){
   _publication.page=  parseInt(_publication.page.toString());
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/PublicationPost/`+id+"/"+idproduct, _publication)
  }
}
