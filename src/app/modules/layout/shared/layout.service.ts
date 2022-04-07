import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Access } from 'src/app/models/security/Access';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { Software } from 'src/app/models/security/Software';
import { Activity } from 'src/app/models/tasks/activity';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly ACCESS_STATE = '_ACCESS_STATE';
  private readonly API_ACTIVITY_URL = `${environment.API_BASE_URL_TASKS}/activities`;
  permissionsList: number[] = [];

  constructor(public httpClient: HttpClient, private authService: AuthService) { }

  get permissions() {
    const accesses: Access[] = JSON.parse(localStorage.getItem(this.ACCESS_STATE));
    Object.values(accesses).map(item => { this.permissionsList.push(item.id); });
    return this.permissionsList;
  }

  get access() {
    const accesses: Access[] = JSON.parse(localStorage.getItem(this.ACCESS_STATE));
    Object.values(accesses).map(item => { this.permissionsList.push(item.id); });
    return accesses;
  }

  getSoftwareByUser(idUser: number) {
    return this.httpClient.get<Software[]>
    (`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftwareByUser?idUser=${idUser}`)
      .toPromise()
      .then( response => <Software[]>response)
      .catch( error => {
        return error;
      });
    }

  getCompaniesBrachOfficeSoftwareByUser(idUser: number, Option: number) {
    return this.httpClient.get<CompaniesBranchOffice[]>
    (`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftwareCompaniesBranchOfficeByUser?idUser=${idUser}&Option=${Option}`)
      .toPromise()
      .then( response => <CompaniesBranchOffice[]>response)
      .catch( error => {
        return error;
      });
  }

  getCompanyBrachOfficesByUser(idUser: number) {
    return this.httpClient.get<CompanyOffice[]>
    (`${environment.API_BASE_URL_AUTHORIZATION}/Company/GetCompanyOffices/${idUser}`).toPromise();
  }

  getUserActivities(idUser: number) {
    const idCompany = this.authService.currentCompany;
    return this.httpClient.get<Activity[]>(`${this.API_ACTIVITY_URL}/${idCompany}/${idUser}`).toPromise();
  }

  sendToStorage(result: Access[]) {
    localStorage.setItem(this.ACCESS_STATE, JSON.stringify(result));
  }

  removeStateAccessFromStorage() {
     localStorage.removeItem(this.ACCESS_STATE);
  }
}
