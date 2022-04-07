import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DatabaseResult } from "src/app/models/common/databaseresult";
import { Route } from "src/app/models/tms/route";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { RouteFilter } from "../filter/route-filter";

@Injectable({
    providedIn: 'root'
  })

export class RouteService {
    
    public _routeList: Route[];
    _Authservice : AuthService = new AuthService(this._httpClient);

    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService){}

    getRoutesList(filters: RouteFilter = new RouteFilter()) 
    {        
        return this._httpClient.get<Route[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/Route/Get/`,
        {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }
    
    InsertUpdateRoutes(route:Route) 
    {  
        const { id } = this._Authservice.storeUser;
        return this._httpClient.post<DatabaseResult>(`${environment.API_BASE_URL_OSM_TMSMasters}/Route/Post/`+id, route);
    }
}
