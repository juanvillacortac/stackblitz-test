import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Result } from 'src/app/models/common/Result';
import { Entity } from 'src/app/models/security/Entity';
import { User } from 'src/app/models/security/User';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { IdentifierType } from 'src/app/models/security/IdentifierType';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { IdentityViewModel } from "../../shared/view-models/Identity.viewmodel";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.API_BASE_URL_AUTHENTICATION}/User`;
  public _List: User[];

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) {
  }

  getEntity(id: number, identifierTypeId: number, dniNumber: string): Promise<Entity> {
    const getIdentity: IdentityViewModel = {
      Id: id,
      IdentifierTypeId: identifierTypeId,
      DniNumber: dniNumber
    };
    return this.httpClient.post<Entity>(`${this.apiUrl}/CheckEntity`, getIdentity)
      .toPromise();
  }

  createEntity(entity: User): Promise<Result> {
    return this.httpClient.post<Result>(`${this.apiUrl}/CreateUser`, entity)
      .toPromise();
  }

  getAllUsers(userFilter: UserFilter): Observable<User[]> {
    return this.httpClient.post<User[]>(`${this.apiUrl}/GetAllUsers`, userFilter);
  }

  getIdentifierTypes(idIdentifierType: number, idEntityType: number): Promise<IdentifierType[]> {
    return this.httpClient.get<IdentifierType[]>(`${this.apiUrl}/GetIdentifierTypes?idIdentifierType=${idIdentifierType}&idEntityType=${idEntityType}`)
      .toPromise();
  }

  getUserEntity(idUser: number): Promise<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/GetUserEntity?idUser=${idUser}`).toPromise();
  }

  getAllUsersPromise(userFilter: UserFilter): Promise<User[]> {
    console.log(userFilter);
    return this.httpClient.post<User[]>(`${this.apiUrl}/GetAllUsers`, userFilter).toPromise();
  }

  async updateUserStatus(userIdModified: number, status: number) {
    return this.httpClient.post<boolean>(`${this.apiUrl}/UpdateUserStatus?userIdModified=${userIdModified}`, status)
      .toPromise()

  }
}
