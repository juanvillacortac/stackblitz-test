import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultimediaType } from 'src/app/models/multimedia/common/multimediatype';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { MultimediaTypeFilter } from '../../filters/multimediatypefilter';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public _multimediaProductList: MultimediaType[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

      getMultimediaTypebyfilter(filters: MultimediaTypeFilter = new MultimediaTypeFilter(), order: number = 0){
        return this._httpClient
          .get<MultimediaType[]>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/Common/MultimediaType/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }
}
