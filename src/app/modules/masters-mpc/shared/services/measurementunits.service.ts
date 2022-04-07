import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits'
import { environment } from 'src/environments/environment';
import { MeasurementunitsFilter } from '../filters/measurementunits-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { MeasurementUnits} from '../view-models/measurement-units.viewmodel'
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeasurementunitsService {

  public _measurementUnitsList: measurementunits[];
  public _searchnameList: measurementunits[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

      getMeasurementUnitsbyfilter(filters: MeasurementunitsFilter = new MeasurementunitsFilter(), order: number = 0){
        return this._httpClient
          .get<measurementunits[]>(`${environment.API_BASE_URL_OSM_MASTERS}/MeasurementUnits/${order}`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }
      postMeasurementUnits(_measurementUnits: measurementunits){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/MeasurementUnits/`+id, _measurementUnits)
      }
      getGroupingUnitMeasure(filters: any = {id: -1,abbreviation: '',createdByUser:'',createdByUserid:-1, active:1}, order: number = 1){
        return this._httpClient
        .get<any[]>(`${environment.API_BASE_URL_OSM_MASTERS}/GroupingUnitMeasure/${order}`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        })
      }

      async getMeasurementUnitsbyfilterPromise(filters: MeasurementunitsFilter = new MeasurementunitsFilter(), order: number = 0) {
        return this._httpClient.get<measurementunits[]>(`${environment.API_BASE_URL_OSM_MASTERS}/MeasurementUnits/${order}`,
        {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        }).toPromise();
      }
   }

