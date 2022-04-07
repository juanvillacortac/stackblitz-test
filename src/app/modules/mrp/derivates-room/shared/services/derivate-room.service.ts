import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Material } from 'src/app/models/mrp/material';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { RawMaterialFilters } from 'src/app/models/mrp/raw-material-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DerivateRoomService {
  private apiUrl = `${environment.API_BASE_URL_ROOM_MANAGER}/DerivativesRoom`;

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService, private authService: AuthService) { }

  getRawMaterials(filters: RawMaterialFilters) {
    return this.httpClient
      .get<RawMaterial[]>(`${this.apiUrl}/rawMaterials/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }

  getMaterials(rawMaterialId: number) {
    return this.httpClient
      .get<Material[]>(`${this.apiUrl}/${rawMaterialId}/materials`).toPromise();
  }

  deleteRawMaterial(rawMaterialId: number) {
    const userId = this.authService.storeUser.id;
    return this.httpClient
      .delete<boolean>(`${this.apiUrl}/${rawMaterialId}/rawMaterial/delete?userId=${userId}`).toPromise();
  }

  saveRawMaterial(rawMaterial: RawMaterial) {
    const userId = this.authService.storeUser.id;
    return this.httpClient
      .post<number>(`${this.apiUrl}/SaveRawMaterial?userId=${userId}`, rawMaterial).toPromise();
  }

  saveMaterials(materials: Material[], rawMaterialId: number) {
    const userId = this.authService.storeUser.id;
    return this.httpClient
      .post<number>(`${this.apiUrl}/rawMaterialId/${rawMaterialId}/SaveMaterials?userId=${userId}`,
      materials).toPromise();
  }
}
