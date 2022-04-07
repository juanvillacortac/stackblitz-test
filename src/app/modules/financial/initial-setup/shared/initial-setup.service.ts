import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Template } from 'src/app/models/financial/initial-setup';
import { Separator } from 'src/app/models/financial/separator';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class InitialSetupService {
  authService: AuthService = new AuthService(this.http);

  private separators$: Observable<Separator[]>;
  private planBase$: Observable<any>;
  private idBusiness: number;

  constructor(private http: HttpClient) {
  }

  getTemplates() {
    return this.http.get(`${environment.API_BASE_URL_FINANCIAL_MASTER}/chartofaccountsTemplate`)
      .toPromise()
      .then((res: any): Template[] => res);
  }

  getSeparatorList() {
    if (!this.separators$) {
      this.separators$ = this.http.get<Separator[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Separator/`).pipe(shareReplay());
    }
    return this.separators$
  }

  postPlan(payload: any, idEmpresa: number = 1) {
    const { id } = this.authService.storeUser;
    return this.http.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/configuration/AccountingPlan?idUser=${id}&idBusiness=${idEmpresa}`, payload)
  }

  updatePlan(payload: {
    id: number,
    name: string,
    idSeparator: number,
  }, idBusiness = 1) {
    const { id } = this.authService.storeUser;
    return this.http.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AccountingPlanBase?idUser=${id}&idBusiness=${idBusiness}`, payload)
  }

  getPlanBase(idBusiness) {
    if (idBusiness !== this.idBusiness) {
      this.planBase$ = this.http.get(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AccountingPlanBase?idBusiness=${idBusiness}`).pipe(shareReplay())
    }
    return this.planBase$
  }

  async getCurrentSeparator(idBusiness: number) {
    let separator: Separator
    const list = await this.getSeparatorList().toPromise()
    const planBase = await this.getPlanBase(idBusiness).toPromise() as any
    separator = list.find(s => s.id == planBase.idSeparator)
    return separator
  }

  validateConfiguration(idBusiness = 1, router: Router, onValidate: () => void) {
    this.http.get(`${environment.API_BASE_URL_FINANCIAL_MASTER}/ConfigurationValidation?idBusiness=${idBusiness}`)
      .subscribe(isValid => {
        if (!isValid) {
          router.navigate(['/financial/configuration/configuration']).then(() => {
            window.location.reload()
          })
        } else {
          onValidate()
        }
      })
  }
}
