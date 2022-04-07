import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SelectItem, TreeNode} from 'primeng/api';
import {MenuItem, PrimeNGConfig} from 'primeng/api';

import {App} from 'src/app/models/security/App';
import {Module} from 'src/app/models/security/Module';
import {Permission} from 'src/app/models/security/Permission';
import {Software} from 'src/app/models/security/Software';
import {environment} from 'src/environments/environment';
import {Access} from 'src/app/models/security/Access';
import {Office} from 'src/app/models/security/Office';
import {UserPermission} from 'src/app/models/security/UserPermission';
import {PermissionByUserByModuleFilter} from '../view-models/PermissionByUserByModuleFilter';
import {PermissionByUserByModule} from 'src/app/models/security/PermissionByUserByModule';
import {HttpHelpersService} from 'src/app/modules/common/services/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) {
  }

  getSystems(): Promise<Software[]> {
    return this.httpClient
      .get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftware`).toPromise();
  }

  getAppsBySystem(idSystem: number): Promise<App[]> {
    return this.httpClient.get<App[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetApps?idSoftware=${idSystem}`)
      .toPromise();
  }

  getModulesByApp(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetModulesByApp?idApp=${idApp}`;
    return this.httpClient.get<Module[]>(url)
      .pipe(result => result,
        catchError((httpError: HttpErrorResponse) => {
          return throwError(this.catchError(httpError));
        })
      );
  }

  getModulesTree(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/AllModulesTree?idApp=${idApp}`;
    return this.httpClient.get<TreeNode[]>(url).toPromise();
  }

  getModulesTreePromise(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/AllModulesTree?idApp=${idApp}`;
    return this.httpClient.get<TreeNode[]>(url)
      .toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });
  }

  getPermissionByModule(idModule: number): Promise<Permission[]> {
    return this.httpClient.get<Permission[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByModule?idModule=${idModule}`)
      .toPromise();
  }

  getPermissionByRole(idRole: number, status: number) {
    return this.httpClient
      .get<Access[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByRole?idRole=${idRole}&status=${status}`)
      .toPromise()
      .then(res => res)
      .catch(error => {
        return error;
      });
  }

  private catchError(httpError: HttpErrorResponse) {
    return {
      Code: httpError.status,
      ErrorMsg: httpError.error.error.message
    };
  }

  getOffices(idCompany?: number): Promise<Office[]> {
    return this.httpClient.get<Office[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Company/GetSubsidiary?idCompany=${idCompany}`)
      .toPromise();
  }

  getAccess(payload: any) {
    return this.httpClient.get<Access[]>(
      `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByUser?idUser=${payload.idUser}&idCompany=${payload.idCompany}&idSubsidiary=${payload.idSubsidiary}`)
      .pipe(result => result,
        catchError((httpError: HttpErrorResponse) => {
          return throwError(this.catchError(httpError));
        })
      );
  }

  getSystemsByRole(idRole: number) {
    const software: SelectItem[] = [];
    return this.httpClient
      .get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftwareByRole?idRole=${idRole}`).toPromise()
      .then((data: Software[]) => {
        data.map((item: Software) => {
          const option: SelectItem = {
            value: item.id,
            label: item.name
          };
          software.push(option);
        });
        return software;
      })
      .catch(error => {
        return error;
      });
  }

  getSystemsPromise(): Promise<Software[]> {
    return this.httpClient.get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftware`)
      .toPromise();
  }

  getAppsBySystemPromise(idSystem: number) {
    return this.httpClient
      .get<App[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetApps?idSoftware=${idSystem}`).toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });
  }

  getModulesByAppPromise(idApp: number) {
    return this.httpClient.get<Module[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetModulesByApp?idApp=${idApp}`)
      .toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });
  }

  getAccessPromise(idUser, idCompany, idOffice): Promise<Access[]> {
    const payload = this.permissionPayload(idUser, idCompany, idOffice);
    const apiURL = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByUser`;
    return this.httpClient.get<Access[]>(apiURL, {params: payload}).toPromise();
  }

  getModulesTreeByUser(idUser, idCompany, idOffice) {
    const apiURL = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/ModulesTreeByUser`;
    const payload = this.permissionPayload(idUser, idCompany, idOffice);
    return this.httpClient.get<MenuItem[]>(apiURL, {params: payload}).toPromise();
  }

  addUserPermission(permission: UserPermission): Promise<boolean> {
    console.log(permission);
    return this.httpClient.post<boolean>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/AddUserPermissions`, permission)
      .toPromise()
  }

  getPermissionByModulePromise(idModule: number): Promise<Permission[]> {
    return this.httpClient
      .get<Permission[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByModule?idModule=${idModule}`)
      .toPromise();
  }

  getPermissionByUserByModule(filter: PermissionByUserByModuleFilter = new PermissionByUserByModuleFilter()) {
    return this.httpClient
      .get<PermissionByUserByModule[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByUserByModule/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filter)
      }).toPromise();
  }

  private permissionPayload(idUser: any, idCompany: any, idOffice: any) {
    return {
      idUser: idUser,
      idCompany: idCompany,
      idSubsidiary: idOffice
    };
  }
}
