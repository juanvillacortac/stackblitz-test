import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchOffice } from '../models/masters/branch-office';
import { BranchOfficeFilter } from '../filters/branch-office-filter';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  _BranchOfficeList: BranchOffice[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetBranchOffices(filters: BranchOfficeFilter = new BranchOfficeFilter()) {
    return this._httpClient
      .get<BranchOffice[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostBranchOffice(branchOffice: BranchOffice){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/`+id,branchOffice);
  }

}
