import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { PackingtypeFilter } from '../../filters/common/packingtype-filter';
import { Packingtype} from 'src/app/models/masters-mpc/common/packingtype';
import { ProducttypeFilter } from '../../filters/common/producttype-filter';
import { SensitivitylevelFilter } from '../../filters/common/sensitivitylevel-filter';
import { Producttype} from 'src/app/models/masters-mpc/common/producttype';
import { StructuretypeFilter } from '../../filters/common/structuretype-filter';
import { Structuretype} from 'src/app/models/masters-mpc/common/structuretype';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { StatusFilter } from '../../filters/common/status-filter';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Groupinggenerationbar } from 'src/app/models/masters-mpc/common/groupinggenerationbar';
import { GroupinggenerationbarFilter } from '../../filters/common/groupinggenerationbar-filter';
import { Typegenerationbar } from 'src/app/models/masters-mpc/common/typegenerationbar';
import { TypegenerationbarFilter } from '../../filters/common/typegenerationbar-filter';
import { AmbientFilter } from '../../filters/common/ambient-filter';
import { Ambient } from 'src/app/models/masters-mpc/common/ambient';
import { AttributetypeFilter } from '../../filters/common/attributetype-filter';
import { Attributetype } from 'src/app/models/masters-mpc/common/attributetype';
import { SensitivityLevel } from 'src/app/models/masters-mpc/common/sensitivitylevel';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getPackingTypes(filters: PackingtypeFilter = new PackingtypeFilter, single: number = 0) {
    return this._httpClient
    .get<Packingtype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/PackingType/` + single, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getProductTypes(filters: ProducttypeFilter = new ProducttypeFilter) {
    return this._httpClient
    .get<Producttype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/ProductType/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getStructureTypes(filters: StructuretypeFilter = new StructuretypeFilter) {
    return this._httpClient
    .get<Structuretype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/StructureType/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getStatus(filters: StatusFilter = new StatusFilter) {
    return this._httpClient
    .get<Status[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/Status/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getGroupingGenerationBar(filters: GroupinggenerationbarFilter = new GroupinggenerationbarFilter) {
    return this._httpClient
    .get<Groupinggenerationbar[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/GroupingGenerationBar/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTypeGenerationBar(filters: TypegenerationbarFilter = new TypegenerationbarFilter) {
    return this._httpClient
    .get<Typegenerationbar[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/TypeGenerationBar/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getAmbient(filters: AmbientFilter = new AmbientFilter) {
    return this._httpClient
    .get<Ambient[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/Ambient/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getAttributeType(filters: AttributetypeFilter = new AttributetypeFilter, order: number = 0) {
    return this._httpClient
    .get<Attributetype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/AttributeType/${order}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getSensitivityLevel(filters: SensitivitylevelFilter = new SensitivitylevelFilter) {
    return this._httpClient
    .get<SensitivityLevel[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/SensitivityLevel`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }
  getStatusPromise(filters: StatusFilter = new StatusFilter){
    return this._httpClient
    .get<Status[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/Status/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }
}
