import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { HolidaysProgramationEmployeeFilter } from "../../filters/holidays/holidays-programation-employe-filter";
import { HolidaysMassiveProgramationFilter } from "../../filters/holidays/holidays-massive-programation-filter";
import { HolidaysProgramationMassive } from "../../models/holidays/holidays-massive-programation";
import { CalculateHolidayCycleFilter } from "../../filters/holidays/calculate-holiday-cycle-filter";
import { HolidaysProgramationFilter } from "../../filters/holidays/holidays-programation-filter";
import { CalculateHolidayCycle } from "../../models/holidays/calculate-holiday-cycle";
import { HolidaysIndividualProgramation } from "../../models/holidays/holidays-individual-programation";
import { HolidaysProgramation } from "../../models/holidays/holidays-programation";
import { HolidaysProgramationEmployee } from "../../models/holidays/holidays-programation-employe";
import { HolidaysProgramationList } from "../../models/holidays/holidays-programation-list";
import { IndividualAdjustmentFilter } from "../../filters/salaries/individual-adjustment-filter";
import { HolidaysIndividualProgramationFilter } from "../../filters/holidays/holidays-individual-programation-Filter";
import { HolidaysBalanceFilter } from "../../filters/holidays/holidays-balance-filter";
import { HolidaysBalance } from "../../models/holidays/holidays-balance";


@Injectable({
    providedIn: 'root'
  })
  export class HolidaysProgramationService{
    _HolidaysProgramation: HolidaysProgramation;
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);


  GetHolidaysProgramation(filters: HolidaysProgramationFilter = new HolidaysProgramationFilter()) {
    return this._httpClient
      .get<HolidaysProgramationMassive>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  GetHolidaysMassiveProgramation(filters: HolidaysMassiveProgramationFilter = new HolidaysMassiveProgramationFilter()) {
    return this._httpClient
      .get<HolidaysProgramationMassive[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/Masivo`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
      
  GetHolidaysProgramationEmployee(filters: HolidaysProgramationEmployeeFilter = new HolidaysProgramationEmployeeFilter()) {
    return this._httpClient
      .get<HolidaysProgramationEmployee[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/Empleados`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertHolidaysProgramation(HolidaysProgramation: HolidaysProgramationMassive){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/`+id,HolidaysProgramation);
    }

    GetHolidaysIndividualProgramation(filters: HolidaysIndividualProgramationFilter = new HolidaysIndividualProgramationFilter()) {
      return this._httpClient
        .get<HolidaysIndividualProgramation>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/Individual/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertHolidaysIndividualProgramation(HolidaysProgramation: HolidaysIndividualProgramation){
      const { id } = this._Authservice.storeUser;
      return this._httpClient
          .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/Individual/`+id,HolidaysProgramation);
      }

      GetCalculateHolidaysCycle(filters: CalculateHolidayCycleFilter = new CalculateHolidayCycleFilter()) {
        return this._httpClient   
          .get<CalculateHolidayCycle>(`${environment.API_BASE_URL_HCM_PAYROLL}/GetCycleHoliday/`, { 
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false) 
          });   
      }

      GetHolidaysBalance(filters: HolidaysBalanceFilter = new HolidaysBalanceFilter()) {
        return this._httpClient   
          .get<HolidaysBalance[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysBalance/`, { 
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false) 
          });   
      }

      deletedHolidaysProgramation(filters: HolidaysProgramationFilter){
        const { id }  = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysProgramation/deleted?`+id,filters);
      }
}