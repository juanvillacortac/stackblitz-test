import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Article, ArticlePage, ArticleType, ArticleTypeFilter } from 'src/app/models/financial/article';
import { ArticleFilter } from 'src/app/models/financial/articleFilter';
import { CostsOfTheArticleModal, CostsOfTheArticleModalFilter } from 'src/app/models/financial/CostsOfTheArticleModal';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  getArticleList(filters: ArticleFilter = new ArticleFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    return this._httpClient
      .get<ArticlePage>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Article/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  

  getCostsArticleList(filters: CostsOfTheArticleModalFilter = new CostsOfTheArticleModalFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    return this._httpClient
      .get<CostsOfTheArticleModal[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/CostsOfTheArticleModal/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getArticle(filters: ArticleFilter = new ArticleFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    return this._httpClient
      .get<Article>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Article/${filters.articleId}?idBusiness=${filters.EmpresaId}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postArticle(model: Article ,idEmpresa: number = 1) {
    debugger
    const dto: any = {
      ...model,
      associatedAccount: Array.from(model.associatedAccount.values()).map(a => ({
        ...a,
        associatedAccount: undefined
      })),
    }
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Article/?idUser=${id}&idBusiness=${idEmpresa}`, dto)
     
  }

  getTypes = (filters: ArticleTypeFilter = new ArticleTypeFilter()) => this._httpClient
    .get<ArticleType[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/TypeOfArticle/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
}
