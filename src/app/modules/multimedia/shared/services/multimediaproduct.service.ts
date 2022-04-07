import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { MultimediaProductFilter } from '../filters/multimediaproductfilter';

@Injectable({
  providedIn: 'root'
})
export class MultimediaproductService {

  public _multimediaProductList: MultimediaProduct[];

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService, private readonly authservice : AuthService) { }

      getMultimediaProductbyfilter(filters: MultimediaProductFilter = new MultimediaProductFilter(), order: number = 0){
        return this.httpClient
          .get<MultimediaProduct[]>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/`, {
            params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }
      postMultimediaProduct(_multimediaProducts: MultimediaProduct[]){
        const { id } = this.authservice.storeUser;
        return this.httpClient
          .post<number>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/`+id, _multimediaProducts)
      }
      
      predeterminedMultimediaProduct(_multimediaProducts: MultimediaProduct){
        const { id } = this.authservice.storeUser;
        return this.httpClient
          .post<number>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/Predetermined/`+id, _multimediaProducts)
      }

      deleteMultimediaProduct(_multimediaProductDelete: MultimediaProduct[]){
        const { id } = this.authservice.storeUser;
        return this.httpClient
          .post<number>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/Delete/`+id, _multimediaProductDelete)
      }

      saveUserImage(file: File) {
        return this.httpClient.post<string>(
          `${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/SaveProductImage`,
          this.formDataImage(file),
          this.formDataHeaders()).toPromise();
      }

      private formDataImage = (imageFile: File) => {
        const formData = new FormData();
        formData.append('productImage', imageFile, 'productImage')
        return formData;
      }
    
      private formDataHeaders = () => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        return { headers: headers };
      }

}