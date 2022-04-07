import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from 'src/app/models/mrp/material';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { RawMaterialFilters } from 'src/app/models/mrp/raw-material-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {

  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  getRawMaterials(filters: RawMaterialFilters): Observable<RawMaterial[]> {
    return this.httpClient
      .get<RawMaterial[]>(`${environment.API_BASE_URL_MRP}/DerivatesRoom/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getMaterials(rawMaterialId: number): Observable<Material[]> {
    return this.httpClient
      .get<Material[]>(`${environment.API_BASE_URL_MRP}/DerivatesRoom/${rawMaterialId}/materials`);
  }

  saveRawMaterial(rawMaterial: RawMaterial): Observable<number> {
    const userId = this.authService.storeUser.id;

    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_MRP}/DerivatesRoom/SaveRawMaterial?userId=${userId}`, rawMaterial);
  }
}
