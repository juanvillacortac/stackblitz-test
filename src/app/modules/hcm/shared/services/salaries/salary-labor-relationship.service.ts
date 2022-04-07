import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SalaryByLaborRelationship } from '../../models/salaries/salary-labor-relationship';
import { IndividualAdjustmentFilter } from '../../filters/salaries/individual-adjustment-filter';
import { JobPositionAdjustementFilter } from '../../filters/salaries/job-position-adjustement-filter';
import { MassiveAdjustmentFilter } from '../../filters/salaries/massive-adjustment-filter';
import { SalaryAdjustmentList } from '../../models/salaries/salary-adjustment-list';
import { SalaryAdjustmentPreviewFilter } from '../../filters/salaries/salary-ajustment-preview-filter';
// import { SalaryByLaborRelationshipMinimumExcel } from '../models/SalaryByLaborRelationship/labor-relationship-minimumexcel';
// import { SalaryByLaborRelationshipMinimumExcelList } from '../models/SalaryByLaborRelationship/labor-relationship-minimumExcelList';

@Injectable({
  providedIn: 'root'
})
export class SalaryByLaborRelationshipService {

  _SalaryByLaborRelationshipList: SalaryByLaborRelationship[];
//_SalaryByLaborRelationshipMinimumList: SalaryByLaborRelationshipMinimum[];

  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getIndividualSalaries(filters: IndividualAdjustmentFilter = new IndividualAdjustmentFilter()) {
    console.log(this._httpHelpersService.getHttpParamsFromPlainObject(filters, false));
    return this._httpClient
      .get<SalaryByLaborRelationship>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalariesByLaborRelationship/Individual`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getJobPositionSalaries(filters: JobPositionAdjustementFilter = new JobPositionAdjustementFilter()){
    return this._httpClient
      .get<SalaryByLaborRelationship>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalariesByLaborRelationship/Cargo`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  
  getMassiveSalaries(filters: MassiveAdjustmentFilter = new MassiveAdjustmentFilter()){
    //debugger;
    return this._httpClient
      .get<SalaryByLaborRelationship>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalariesByLaborRelationship/Masivo`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getSalariesAdjustmentPreview(filters: SalaryAdjustmentPreviewFilter = new SalaryAdjustmentPreviewFilter()){
    return this._httpClient
      .get<SalaryAdjustmentList[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalaryAdjustments`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }


  insertSalaryByLaborRelationship(SalaryByLaborRelationship: SalaryByLaborRelationship){
    //debugger;
     const { id } = this._Authservice.storeUser;
     return this._httpClient
       .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalariesByLaborRelationship/`+id,SalaryByLaborRelationship);
   }

   ImportSalaryByLaborRelationship(salaryAdjustment: SalaryAdjustmentList[]){
    debugger;
     const { id } = this._Authservice.storeUser;
     return this._httpClient
       .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalaryAdjustments/PostSalaryAdjustment/`+id,salaryAdjustment);
   }

}
