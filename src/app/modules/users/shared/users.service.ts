import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from 'src/app/models/users/Profile';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private USER_API_URL = `${environment.API_BASE_URL_AUTHENTICATION}/User`;

  constructor(public httpClient: HttpClient) { }

  getEntityProfile(idUser: number): Promise<Profile> {
    return this.httpClient.get<Profile>(`${this.USER_API_URL}/GetUserProfile?idUser=${Number(idUser)}`)
    .toPromise();
  }
  saveProfile(profile: Profile) {
    return this.httpClient.post<Profile>(`${this.USER_API_URL}/Update`, profile)
    .toPromise()
    .then( response => <boolean>response)
    .catch( error => {
      return error;
    });
  }

  saveUserImage(imageFile: File) {
    return this.httpClient.post<string>(
      `${this.USER_API_URL}/Image`,
      this.formDataImage(imageFile),
      this.formDataHeaders())
    .toPromise()
  }
  private formDataImage = (imageFile: File) => {
    const formData = new FormData();
    formData.append('userImage', imageFile, 'userImage')
    return formData;
  }

  private formDataHeaders = () => {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return { headers: headers };
  }
}
