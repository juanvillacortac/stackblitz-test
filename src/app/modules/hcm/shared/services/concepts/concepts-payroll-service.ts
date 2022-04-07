import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HttpHelpersService } from '../../../../common/services/http-helpers.service';
import { AuthService } from '../../../../login/shared/auth.service';
//Models
import { Concept } from '../../models/masters/concept'
import { ConceptType } from '../../models/masters/concept type'
import { GroupingxConcept } from '../../models/concepts/grouping-x-concepts';
import { GroupingConcepts } from '../../models/concepts/grouping-concept';
//Filters
import { ConceptsFilter } from '../../filters/Concepts/concepts-filter';
import { ConceptsTypeFilter } from '../../filters/Concepts/concepts-type-filter';
import { GroupingConceptsFilter } from '../../filters/Concepts/groupingconcepts-filter';
import { PoliticalCalcFilter } from '../../filters/Concepts/politic-calc-filter';
import { PoliticalCalcViewModel } from '../../view-models/concepts/political-calc-viewmodel';

@Injectable({
    providedIn: 'root'
})

export class ConceptsService {

    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);
    _conceptsList:Concept[];
    _groupingConcepts: GroupingConcepts[];

    //Concept Types
    GetConceptsTypes(filters: ConceptsTypeFilter = new ConceptsTypeFilter()) {
        //debugger;
        return this._httpClient
            .get<ConceptType[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/TypeConcepts`, {
                params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }


    //General Data Concepts
    GetConcepts(filters: ConceptsFilter) {        
        return this._httpClient
            .get<Concept[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Concepts`, {
                params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }

    insertEditConcepts(Concept:Concept){
        const { id }  = this._Authservice.storeUser;
        return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Concepts/`+ id, Concept);
    }

    //Grouping Concept
    GetGroupingConcepts(filters: GroupingConceptsFilter = new GroupingConceptsFilter()) {
        //debugger;
        return this._httpClient
            .get<GroupingxConcept>(`${environment.API_BASE_URL_HCM_PAYROLL}/ClusterConcepts`, {
                params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }

    insertGroupingConcepts(groupingConcept:GroupingxConcept){
        const { id }  = this._Authservice.storeUser;
        return this._httpClient
        .post
        <number>(`${environment.API_BASE_URL_HCM_PAYROLL}/ClusterConcepts/`+ id, groupingConcept);
    }

    //PolticalCalc Concept
    getPoliticalCalcs(filters: PoliticalCalcFilter = new PoliticalCalcFilter()) {
        //debugger;
        return this._httpClient
            .get<PoliticalCalcViewModel>(`${environment.API_BASE_URL_HCM_PAYROLL}/PoliticCalc`, {
                params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }
}