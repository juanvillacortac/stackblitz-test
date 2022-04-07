import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { ProcessingRoomRecipeFilters } from 'src/app/models/mrp/processing-room-recipe-filters';
import { ProcessingRoomRecipes } from 'src/app/models/mrp/processing-room-recipes';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class ProcessingRoomService {
    private apiUrl = `${environment.API_BASE_URL_ROOM_MANAGER}/ProcessingRoom`;

    _authservice: AuthService = new AuthService(this.httpClient);

    constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

    getProcessingRoom(filters: ProcessingRoomFilters) {
      return this.httpClient
        .get<ProcessingRoom[]>(`${this.apiUrl}/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        }).toPromise();
    }

    async addProcessingRoom(detail: ProcessingRoom) {
      const { id } = this._authservice.storeUser;
      return this.httpClient
        .post<number>(`${this.apiUrl}/Post?userId=${id}`, detail).toPromise();
    }

    async getProcessingRoomRecipes(filters: ProcessingRoomRecipeFilters) {
      return this.httpClient.get<ProcessingRoomRecipes[]>(`${this.apiUrl}/GetProcessingRoomRecipes/`,
      {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
    }

    async addRecipe(detail: ProcessingRoomRecipes) {
      const { id } = this._authservice.storeUser;
      return this.httpClient.post<number>(`${this.apiUrl}/AddRecipeToRoom?userId=${id}`,
             detail).toPromise();
    }
  }
