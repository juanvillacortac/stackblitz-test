import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {BaseModel} from 'src/app/models/common/BaseModel';
import {environment} from 'src/environments/environment';
import {Country} from 'src/app/models/masters/country';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  private apiUrl = `${environment.API_BASE_URL_AUTHENTICATION}/Master`;

  constructor(public httpClient: HttpClient) {
  }

  getCountries(idStatus: number, idCountry: number): Promise<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/Countries?idCountry=${Number(idCountry)}&idStatus=${Number(idStatus)}`)
      .toPromise();
  }

  getProvinces(idCountry: number, idProvince: number, idStatus: number): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/Provinces?idProvince=${Number(idProvince)}&idCountry=${Number(idCountry)}&idStatus=${Number(idStatus)}`)
      .toPromise();
  }

  getDistricts(idProvince: number, idDistrict: number, idStatus: number): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/Districts?idDistrict=${idDistrict}&idProvince=${idProvince}&idStatus=${idStatus}`)
      .toPromise();
  }

  getCities(idDistrict: number, idCity: number, idStatus: number): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/Cities?idCity=${idCity}&idDistrict=${idDistrict}&idStatus=${idStatus}`)
      .toPromise();
  }

  getPhonetypes(filter: any): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/PhoneType?idPhoneType=${filter.idPhoneType}`)
      .toPromise();
  }

  getPlaceTypes(): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/PlaceTypes`)
      .toPromise();
  }

  getAddressTypes(): Promise<BaseModel[]> {
    return this.httpClient.get<BaseModel[]>(`${this.apiUrl}/AddressTypes`)
      .toPromise();
  }
}
