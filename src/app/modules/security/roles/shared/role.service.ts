import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleType } from 'src/app/models/security/RoleType';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/security/Role';
import { RoleByUser } from 'src/app/models/security/RoleByUser';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.API_BASE_URL_AUTHORIZATION}/Roles`;

  constructor(public httpClient: HttpClient) {
  }

  getRoles(type?: number, company?: number): Promise<Role[]> {
    return this.httpClient.get<Role[]>(`${this.apiUrl}/roles?type=${type}&company=${company}`).toPromise()
  }

  getRolesActive(type?: number, company?: number ,active?:boolean): Promise<Role[]> {
    return this.httpClient
      .get<Role[]>(`${this.apiUrl}/roles?type=${type}&company=${company}&active=${active}`)
      .toPromise();
  }

  getRoleTypes(): Promise<RoleType[]> {
    return this.httpClient
      .get<RoleType[]>(`${this.apiUrl}/types`).toPromise();
  }

  createRole(role: any): Promise<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl}/Create`, role)
      .toPromise();
  }

  addUserRole(roles: RoleByUser[]): Promise<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl}/AddUserRole`, roles)
      .toPromise();
  }

  getUserRoles(idcompany?: number, idUser?: number) {
    return this.httpClient.get<RoleByUser[]>(`${this.apiUrl}/GetUserRoles?company=${idcompany}&idUser=${idUser}`)
      .toPromise();
  }
}

export enum UserTypes {
  internal = 1,
  external = 2
}