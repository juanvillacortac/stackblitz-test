import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ArticleClassificationFilter } from 'src/app/models/financial/ArticleClassificationFilter';
import { AssociatedAccounts } from 'src/app/models/financial/AssociatedAccounts';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { ArticleClassificationService } from '../shared/services/article-classification.service';

@Component({
  selector: 'app-detail-article-classification',
  templateUrl: './detail-article-classification.component.html',
  styleUrls: ['./detail-article-classification.component.scss'],
  //providers: [DatePipe]
})
export class DetailArticleClassificationComponent extends AccountingPlanBase implements OnInit {
  showItems=true;
  showPlan=true;
  submitted=false;
  permissionsIDs = {...Permissions};
  showDialog = false;
  showFilters : boolean = false;
  loading = false;
  viewMode=false;
  OldArticleClassification = new  ArticleClassification();
  articleClassification = new  ArticleClassification();
  associatedAccounts = new AssociatedAccounts();
  articleClassifications = [] as ArticleClassification[];
  articleClassificationFilter = new ArticleClassificationFilter();
  parentRouteParams:any;
  indChange=false;
  log=console.log;
  TipoUso:number=-1

  _validations: Validations = new Validations();
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  displayedColumns: ColumnD<AssociatedAccounts>[] =
  [


 
  {template: (data) => { return data.tipoUsoCuenta; }, field: 'tipoUsoCuenta', header: 'Uso', display: 'table-cell'},
  {template: (data) =>  data?.accountingAccountCode ? this.formatCode(data.accountingAccountCode) : null, field: 'accountingAccountCode', header: 'Número de cuenta', display: 'table-cell'},
  {template: (data) => { return data.accountingAccount}, field: 'accountingAccount', header: 'Nombre de la cuenta', display: 'table-cell'},
  {template: (data) => { return data.auxiliar }, field: 'auxiliar', header: 'Auxiliar', display: 'table-cell'},

  ];
  saving: boolean;
  idclasi: number = 0;

  constructor(public _articleClassificationService: ArticleClassificationService, private actRoute: ActivatedRoute , public breadcrumbService: BreadcrumbService,private rutaActiva: ActivatedRoute,private messageService: MessageService, private initialSetupService: InitialSetupService ,public userPermissions: UserPermissions,private router :Router,private route :ActivatedRoute,private confirmationService: ConfirmationService, injector:Injector) {
    super(injector)
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Clasificaciones de artículos', routerLink: ['/financial/masters/article-classification-list']}
       ]);
      
   }

  async ngOnInit() {
    debugger
     
    this.actRoute.queryParamMap.subscribe(map => {
      this.idclasi = +map.get('id') || -1;
      this.CargarData();
    })
 
    //if (history.state.queryParams!=undefined) {
    //  const productcatalogfilters = history.state.queryParams.filters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
    //  if (productcatalogfilters === null) {
    //    //this.productcatalogfiltersOfValues = [];
    //  } else {
    
    //    this.parentRouteParams  = JSON.parse(productcatalogfilters);
    //    this.articleClassification=this.parentRouteParams;
    //    // if (this.articleClassification.associatedAccount.length==0) {
    //    //   this.associatedAccounts[0] =[];
    //    // }else{

    //      
    //      this.associatedAccounts=this.parentRouteParams.associatedAccount;
    //    // }
    //    
    //    sessionStorage.setItem('searchParameters', productcatalogfilters)
    //  }
    //}
debugger
    this.articleClassificationFilter.id= this.articleClassification.id
    this.search();
    if (this.articleClassification.id<= 0) 
      this.articleClassification.active=true; 
     
      this.OldArticleClassification={...this.articleClassification };
  }

  edit(_articleClassification: ArticleClassification ): void {
  
  

     this.articleClassification = {
       ...this.articleClassification,  
       ..._articleClassification    
    };
   
 
    this.TipoUso=(_articleClassification as any).tipoUsoCuentaId
    this.viewMode=true;
    this.showDialog = true;
  
  }

  CargarData(){
    if (this.loading)
      return;
    this.loading = true;
    if (this.idclasi == -1) {
      this.loading = false
      return
    } 
    this.articleClassificationFilter.id = this.idclasi ||-1;
    this._articleClassificationService.getArticleClassificationList(this.articleClassificationFilter).subscribe((data: ArticleClassification[]) => {      
      this.articleClassification = data[0];

      // const queryParams: any = {};

      // queryParams.filters = JSON.stringify(this.articleClassification);

      // this.parentRouteParams  = JSON.parse(queryParams.filters);
      // this.articleClassification=this.parentRouteParams;
      // this.associatedAccounts=this.parentRouteParams.associatedAccount;
      
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las clasificaciones de artículos." });
        
    });
  
  
  }

  delete(data: AssociatedAccounts) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea borrar la cuenta?',
      accept: () => {
        const idx =  this.articleClassification.associatedAccount.findIndex(a => a.tipoUsoCuentaId === data.tipoUsoCuentaId)
        this.articleClassification.associatedAccount.splice(idx, 1)
        this.articleClassification.associatedAccount =  [...this.articleClassification.associatedAccount];
        this.indChange=true;
      },
    })
  }

  onUpdate(data: AssociatedAccounts) {
 debugger
 let idx;

    idx =this.articleClassification.associatedAccount.findIndex(a => a.tipoUsoCuentaId== this.TipoUso)
    this.articleClassification.associatedAccount[idx] = data
    this.articleClassification.associatedAccount =  [...this.articleClassification.associatedAccount];
    this.indChange=true;
  }

  onCreate(data: AssociatedAccounts) {
    data.origenArt="Clasificación";
    this.articleClassification.associatedAccount.push(data)

    this.articleClassification.associatedAccount = [...this.articleClassification.associatedAccount];
    this.indChange = true;
    
  }

  search(){

    if (this.loading)
      return;
    this.loading = true;
    this._articleClassificationService.getArticleClassificationList(this.articleClassificationFilter).subscribe((data: ArticleClassification[]) => {      

      this.articleClassifications = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las clasificaciones de artículos." });        
    });  
  }


  new(){

    this.viewMode=false;
    this.showDialog = true;
  }
  back() {
 
   if (this.indChange || (JSON.stringify(this.articleClassification) !== JSON.stringify(this.OldArticleClassification))) {
     
    this.confirmationService.confirm({
      message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
      accept: () => {
        this.saving = true
        this.router.navigate(["/financial/masters/article-classification-list"])
      }
  });
  }else{
    this.router.navigate(["/financial/masters/article-classification-list"])
  }
  }
  

  send(){    
   
      this.submitted = true;
      if (this.articleClassification.articleClassificationName != "" && this.articleClassification.articleClassificationName.trim()) {
        if ( this.articleClassification.associatedAccount.length==0) {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos una cuenta." });
          this.saving = false;
          return
        }
        
      
      
        this.messageService.clear();
       this.saving = true 
        this._articleClassificationService.postArticleClassification(this.articleClassification).subscribe((data) => {
          if (data > 0) {
           this.showDialog = false;
           //this.showDialogChange.emit(this.showDialog);
            this.submitted = false;
            this.saving = false;
           // this.onUpdate.emit();
            this.router.navigate(["/financial/masters/article-classification-list"])
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            
          } else if (data == -1) {
          
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            this.saving = false;
          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          }
          //window.location.reload();
        }, () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        });
      }
    }
  
}


