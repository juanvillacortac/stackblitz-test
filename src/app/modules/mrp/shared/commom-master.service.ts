import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseFilter } from 'src/app/models/common/BaseFilter';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from '../../common/services/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class CommomMasterService {
private apiUrl = `${environment.API_BASE_URL_ROOM_MANAGER}/CommonMaster`;

constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

async getAnimalsTypes(filters: BaseFilter = new BaseFilter()) {
  return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/GetAnimalsTypes/` , this.convertToParams(filters)).toPromise();
}

async getProductsTypes(filters: BaseFilter = new BaseFilter()) {
  return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/GetProductsTypes/` , this.convertToParams(filters)).toPromise();
}


private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
