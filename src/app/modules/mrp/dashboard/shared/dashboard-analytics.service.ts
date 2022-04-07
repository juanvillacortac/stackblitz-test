import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardFilter } from 'src/app/models/analytics/dashboard-filter';
import { Widget } from 'src/app/models/analytics/widget';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {

  private apiUrl = `${environment.API_BASE_URL_MRP_ANALYTICS}/Dashboard`;

  _authservice: AuthService = new AuthService(this.httpClient);

    constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService){ }
    public widgets: Widget[];

    async buildDashboard(filters: DashboardFilter) {
      const requestUrl = `${this.apiUrl}/BuildDashboard`;
      return this.httpClient.post<Widget[]>(requestUrl, filters).toPromise();
    }
}
