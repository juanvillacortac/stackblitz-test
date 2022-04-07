import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountUsage } from 'src/app/models/financial/AccountUsage';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ArticleClassificationFilter } from 'src/app/models/financial/ArticleClassificationFilter';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleClassificationService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getArticleClassificationList(filters: ArticleClassificationFilter = new ArticleClassificationFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article-classification.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    return this._httpClient
      .get<ArticleClassification[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/ArticleClassification/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getAuxiliariesAssociatedList(filters: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter()){
    return this._httpClient
    .get< AuxiliariesAccountingAccountFilter[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AuxiliariesAccountingAccount/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }
  getAccountUsageList() {
    return this._httpClient
      .get<AccountUsage[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AccountUsage/`);
  }
  postArticleClassification(model: ArticleClassification ,idEmpresa: number = 1) {
    debugger
    const dto: any = {
      ...model,
      associatedAccount: Array.from(model.associatedAccount.values()).map(a => ({
        ...a,
        associatedAccount: undefined
      })),
    }
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/ArticleClassification/?idUser=${id}&idBusiness=${idEmpresa}`, dto)
     
  }
}

