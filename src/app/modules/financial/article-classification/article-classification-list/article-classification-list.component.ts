import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ArticleClassificationFilter } from 'src/app/models/financial/ArticleClassificationFilter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { ArticleClassificationService } from '../shared/services/article-classification.service';

@Component({
  selector: 'app-article-classification-list',
  templateUrl: './article-classification-list.component.html',
  styleUrls: ['./article-classification-list.component.scss']
})
export class ArticleClassificationListComponent extends AccountingPlanBase implements OnInit {
  permissionsIDs = {...Permissions};
  showDialog = false;
  showFilters : boolean = false;
  loading = false;
  articleClassification = new  ArticleClassification();
  articleClassifications = [] as ArticleClassification[];
  articleClassificationFilter = new ArticleClassificationFilter();

  log=console.log;
  displayedColumns: ColumnD<ArticleClassification>[] =
  [

  {template: (data) => { return data.id; }, field: 'id', header: 'Código', display: 'table-cell'},
  {template: (data) => { return data.articleClassificationName; }, field: 'articleClassificationName', header: 'Nombre de la clasificación', display: 'table-cell'},
  {template: (data) => { return null; }, field: 'active', header: 'Estatus', display: 'table-cell' },
  {template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
  {template: (data) => { return data.updateByUser; }, field: 'updateByUser', header: 'Actualizado por', display: 'table-cell'},

  ];
  
  constructor(public _articleClassificationService: ArticleClassificationService,  public breadcrumbService: BreadcrumbService,private messageService: MessageService, private initialSetupService: InitialSetupService ,public userPermissions: UserPermissions,private router :Router , injector:Injector) {
    super(injector)
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Clasificaciones de artículos', routerLink: ['/financial/masters/article-classification-list'] }
       ]);
   }

  ngOnInit(): void {
    this.fetchInitialSetup();
   
    this.search();
  }

  edit(_articleClassification: ArticleClassification): void {
    debugger
    this.articleClassification.id = _articleClassification.id;
    this.articleClassification.articleClassificationName = _articleClassification.articleClassificationName;
    this.articleClassification.descripcion = _articleClassification.descripcion;
    this.articleClassification.associatedAccount= _articleClassification.associatedAccount;
    this.articleClassification.createdByUser = _articleClassification.createdByUser;
    this.articleClassification.updateByUser = _articleClassification.updateByUser;
    this.articleClassification.active = _articleClassification.active;
    const queryParams: any = {};

      queryParams.filters = JSON.stringify(this.articleClassification);
      
     
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    debugger
    this.router.navigate([`/financial/masters/detail-article-classification`], { queryParams: { id: this.articleClassification.id }, state:navigationExtras});
  }
  search(){
    if (this.loading)
      return;
    this.loading = true;
    this._articleClassificationService.getArticleClassificationList(this.articleClassificationFilter).subscribe((data: ArticleClassification[]) => {      
      debugger
      this.articleClassifications = data.sort((a,b) => 0 - (a.id < b.id ? -1 : 1));
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las clasificaciones de artículos." });
        
    });
  
  
  }

  new() {
   
      const queryParams: any = {};
      queryParams.filters = JSON.stringify(this.articleClassification);
     
     
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    debugger
    // this.router.navigate(['/financial/masters/detail-article-classification']);
    this.router.navigate(['/financial/masters/detail-article-classification'],{ queryParams: { id: this.articleClassification.id , state:navigationExtras}});
  }

}
