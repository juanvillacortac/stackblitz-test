import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryPackOperation } from 'src/app/models/ims/inventory-pack-operation';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryPackOperationService {
  private apiUrl = `${environment.API_BASE_URL_OSM_IMS}/InventoryPackOperation/`;
  constructor(public _Authservice : AuthService, 
              public httpClient: HttpClient) { }

  async createOperation(detail: InventoryPackOperation, operationDocumentId: number) {
    return this.httpClient.post<number>(`${this.apiUrl}`+ operationDocumentId, detail).toPromise();
  }
}
