import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HttpHelpersService } from '../../../../common/services/http-helpers.service';
import { AuthService } from '../../../../login/shared/auth.service';
import { ListConcepts } from '../../models/concepts/list-concepts';
import { ListConceptsFilter } from '../../filters/Concepts/list-concepts-filter';

@Injectable({
    providedIn: 'root'
})

export class ListConceptsService {
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);
    _ListConcepts:ListConcepts[];

    //List Concepts
    GetListConcepts(filters: ListConceptsFilter = new ListConceptsFilter()) {
        //debugger;
        return this._httpClient
            .get<ListConcepts[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/ListConcepts`, {
                params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }

}
