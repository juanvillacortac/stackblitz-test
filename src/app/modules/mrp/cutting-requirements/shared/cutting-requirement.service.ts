import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuttingDetail } from 'src/app/models/mrp/cutting-detail';
import { CuttingOrder } from 'src/app/models/mrp/cutting-order';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuttingRequirementService {
  private apiUrl = `${environment.API_BASE_URL_PRODUCTION_ORDER}/CuttingRequirement`;
  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  getCuttingOrdersByanimalTypeId(animalTypeId: number) {
    return this.httpClient
      .get<CuttingOrder[]>(`${this.apiUrl}/animalTypeId/${animalTypeId}/getCuttingOrders`).toPromise();
  }

  getCuttingDetails(cuttingOrderId: number, rawMaterialId: number) {
    return this.httpClient
      .get<CuttingDetail[]>(`${this.apiUrl}/cuttingOrderId/${cuttingOrderId}/rawMaterialId/${rawMaterialId}/getCuttingDetails`).toPromise();
  }

  saveCuttingOrder(order: CuttingOrder) {
    const userId = this.authService.storeUser.id;

    return this.httpClient
      .post<number>(`${this.apiUrl}/saveOrder?userId=${userId}`, order).toPromise();
  }
}
