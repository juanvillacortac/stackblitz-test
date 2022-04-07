import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Article, ArticleTax, ArticleType, ArticleTypeFilter, ArticlePage } from 'src/app/models/financial/article';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { ArticleClassificationFilter, ARTICLE_CLASSIFICATION_ALL_ACTIVES_FILTER } from 'src/app/models/financial/ArticleClassificationFilter';
import { ArticleFilter } from 'src/app/models/financial/articleFilter';
import { AssociatedAccounts } from 'src/app/models/financial/AssociatedAccounts';
import { CostsOfTheArticleModal, CostsOfTheArticleModalFilter } from 'src/app/models/financial/CostsOfTheArticleModal';
import { Coins } from 'src/app/models/masters/coin';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { TaxPlan, TaxPlanDetail, TaxPlanFilter, TaxPlanRate, TaxPlanRawTax } from 'src/app/models/masters/tax-plan';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CostCenterFilters } from 'src/app/modules/masters/cost-center/shared/filters/cost-center-filters';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { TaxPlanService } from 'src/app/modules/masters/tax-plan/shared/services/tax-plan.service';
import { TaxeTypeApplicationService } from 'src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ArticleClassificationService } from '../../article-classification/shared/services/article-classification.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { ArticleService } from '../shared/services/article.service';

type TaxWOrigin = TaxPlanRawTax & {
  artId?: number
  origin?: number
  rateId?: number
  active?: boolean
  edit?: boolean
}

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent extends AccountingPlanBase implements OnInit {
  dataLoaded = false;
  showItems = true;
  showPlan = true;
  submitted = false;
  permissionsIDs = { ...Permissions };
  showDialog = false;
  showFilters: boolean = false;
  loading = false;
  viewMode = false;
  oldArticle = new Article();
  article = new Article();
  articles = [] as Article[];

  ind:number=0;

  costsOfTheArticleModal = new CostsOfTheArticleModal();
  costsOfTheArticleModals = [] as CostsOfTheArticleModal[];
  costsOfTheArticleModalFilter = new CostsOfTheArticleModalFilter();

  associatedAccounts = new AssociatedAccounts();
  articleFilter = new ArticleFilter();
  articleClasiFilter = new ArticleClassificationFilter();
  articleClasi: ArticleClassification[] = [];
  parentRouteParams: any;
  clasificationlist: SelectItem[];
  tipolist: SelectItem[];
  costcenterlist: SelectItem[];
  coinlist: SelectItem[];
  indChange = false;
  disabled:any =[];
  costlist: SelectItem[];
  taxplanlist: SelectItem[];

  indCentro:number=0;
  indClasi:number=0;
  indTipo:number=0;

  statuslist: SelectItem[] = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 },
    { label: 'En proceso', value: 3 },
  ];
  displayedColumns: ColumnD<AssociatedAccounts>[] =
    [

      { template: (data) => { return data.tipoUsoCuenta; }, field: 'tipoUsoCuenta', header: 'Uso', display: 'table-cell' },
      { template: (data) => { return this.formatCode(data.accountingAccountCode) }, field: 'accountingAccountCode', header: 'Número de cuenta', display: 'table-cell' },
      { template: (data) => { return data.accountingAccount }, field: 'descripcion', header: 'Nombre de la cuenta', display: 'table-cell' },
      { template: (data) => { return data.auxiliar }, field: 'auxiliar', header: 'Auxiliar', display: 'table-cell' },
      { template: (data) => { return data.origenArt}, field: 'origenArt', header: 'Origen', display: 'table-cell' },

    ];


  taxCols: ColumnD<TaxWOrigin>[] =
    [

      { template: t => t.id, field: 'id', header: 'Código', display: 'table-cell' },
      { template: t => null, field: 'type', header: 'Tipo de aplicación', display: 'table-cell' },
      { template: t => t.abbreviation || t.name, field: 'abbreviation', header: 'Impuesto', display: 'table-cell' },
      { template: t => t.origin == -1 ? 'Artículo' : 'Plan de impuestos', field: 'origin', header: 'Origen', display: 'table-cell' },
      { template: t => null, field: 'rate', header: 'Tasa', display: 'table-cell' },

    ];
  saving: boolean;
  displayModal: boolean;

  idItem: number = 0;

  getCoinName = (id: number) => this.coins.find(c => c.id == id)
  
  TipoUso: any;

  constructor(
    private actRoute: ActivatedRoute,
    public _articleService: ArticleService,
    private taxPlanService: TaxPlanService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private router: Router,
    private confirmationService: ConfirmationService,
    injector: Injector,
    private taxAppTypeService: TaxeTypeApplicationService,
    public costCenterService: CostCenterService,
    public classificationService: ArticleClassificationService,
    private coinService: CoinsService,
    private loadingService: LoadingService,

  ) {
    super(injector)
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Artículos', routerLink: ['/financial/masters/article-list'] }
    ]);

  }

  getTaxTableLength = (taxTable: TaxWOrigin[]) => taxTable.filter(t => t.active).length

  ngOnInit() {
    this.loadingService.startLoading();
    this.idItem = this.actRoute.snapshot.params['id'];
    if (this.idItem !=0) {
      this.getArticleDetails(); 
       
    }
    else {
      this.article.active = true;
      this.article.estatuArticuloId = 1;
    }
 
   
    this.fetchTaxData()
      .then(() => this.dataLoaded = true)
      .then(() => {
        if (this.article?.taxes?.length) {
          this.fillTaxes()
        }
      })
      .finally(() => {
        this.loadingService.stopLoading() 
         this.Properties();
        if (this.article.articleId >0 ) {
           this.PropertiesDisabled()
          }
      })
  }

  Properties(){
    this.clasificationlist = [
      ...this.classifications.map(c => ({
        label: c.articleClassificationName,
        value: c.id
      }))
    ]
    this.tipolist = [
      ...this.types.map(c => ({
        label: c.typeOfArticleName,
        value: c.id
      }))
    ]

    this.costcenterlist = [
      ...this.costCenters.map(c => ({
        label: c.name,
        value: c.id
      }))
    ]

    // this.taxplanlist = [
    //   ...this.taxData.plans.map(c => ({
    //     label: c.name,
    //     value: c.id
    //   }))
    // ]
  }

  PropertiesDisabled(){
  
 
    let noact: any = this.classifications.filter(i=> i.id==this.article.claseArticuloId)
    if (noact?.length == 0 ) {
    
     this.clasificationlist = [
       ...this.clasificationlist,
       {
         label: this.article.claseArticulo,
         value :this.article.claseArticuloId
       }
     ]
     this.indClasi=this.article.claseArticuloId;
     this.clasificationlist.sort((a, b) => a.label.localeCompare(b.label))
    }

    noact = this.types.filter(i=> i.id==this.article.tipoArticuloId)
    if (noact?.length == 0) {
  
     this.tipolist = [
       ...this.tipolist,
       {
         label: this.article.tipoArticulo,
         value :this.article.tipoArticuloId
       }
     ]
     this.indTipo=this.article.tipoArticuloId;
     this.tipolist.sort((a, b) => a.label.localeCompare(b.label))
    }

    noact = this.costCenters.filter(i=> i.id==this.article.centroCostoId)
    if (noact?.length == 0) {
      this.costcenterlist = [
       ...this.costcenterlist,
       {
         label: this.article.centroCosto,
         value :this.article.centroCostoId
       }
     ]
     this.indCentro=this.article.centroCostoId
     this.costcenterlist.sort((a, b) => a.label.localeCompare(b.label))
    }

    // noact = this.coins.filter(i=> i.id==this.article.monedaIdArt)
    // if (noact?.length == 0) {
    //   this.disabled.push("El centro de costo se encuentra inactivo.");
    //   this.costlist = [
    //    ...this.costlist,
    //    {
    //      label: this.article.centroCosto,
    //      value :this.article.monedaIdArt
    //    }
    //  ]
    // }



    noact = this.statuslist.filter(i=> i.value==this.article.estatuArticuloId)
    if (noact?.length == 0) {
     this.statuslist = [
       ...this.statuslist,
       {
         label: this.article.estatuArticulo,
         value :this.article.estatuArticuloId
       }
     ]
 
    }

    // this.clasificationlist = this.clasificationlist.sort((a, b) => a.label.localeCompare(b.label))
    // this.tipolist = this.tipolist.sort((a, b) => a.label.localeCompare(b.label))
    // this.costcenterlist = this.costcenterlist.sort((a, b) => a.label.localeCompare(b.label))

    // noact = this.taxData.plans.filter(i=> i.id==this.article.planImpuestoIdArt)
    // if (noact?.length == 0) {
    //   this.disabled.push("El plan de impuesto se encuentra inactivo.");
    //  this.taxplanlist = [
    //    ...this.taxplanlist,
    //    {
    //      label: this.article.planImpuestoArt,
    //      value :this.article.planImpuestoIdArt
    //    }
    //  ]
    // }



  
    // costCenters: CostCenter[];
    // classifications: ArticleClassification[];
    // types: ArticleType[];
    // taxPlans: TaxPlan[];
    // rawTaxes: TaxPlanRawTax[];
    // coins: Coins[]
  }



  edit(_article: Article): void {
    this.article = {
      ...this.article,
      ..._article
    };
    this.TipoUso=(_article as any).tipoUsoCuentaId
    this.viewMode = true;
    this.showDialog = true;

  }
  getArticleDetails() {

    if (this.loading)
    return;
    this.loading = true;
    this.articleFilter.articleId = this.idItem;
    this._articleService.getArticle(this.articleFilter).subscribe((data: Article) => {      
     this.article = data;
    if (data==null) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del articulo." });
      this.loading = false;
      return;
    }
    this.loading = false;
    const queryParams: any = {};
    queryParams.filters = JSON.stringify(this.article);

     
      this.oldArticle = { ...this.article }
 
  }, (error: HttpErrorResponse)=>{
    this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del articulo." });

  });

  }

  delete(data: AssociatedAccounts) {
    
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea borrar la cuenta?',
      accept: () => {
        const idx = this.article.associatedAccount.findIndex(a => a.tipoUsoCuentaId === data.tipoUsoCuentaId)
        this.article.associatedAccount.splice(idx, 1)
        this.article.associatedAccount = [...this.article.associatedAccount];
        this.indChange = true;
      
        if(this.articleClasi[0]?.associatedAccount){
          this.ind=1
          this.FromClasification()
        }
        
      },
    })
 
    
  }

  onUpdate(data: AssociatedAccounts) {
debugger
    let uso=  this.TipoUso;
    const idx = this.article.associatedAccount.findIndex(a => a.tipoUsoCuentaId== uso)

   
    data.origenArt = "Artículo";
    this.article.associatedAccount[idx] = data
    this.article.associatedAccount = [...this.article.associatedAccount];
    this.indChange = true;

    let idx2 ;
    this.articleClasi[0]?.associatedAccount
    .forEach((a) => {
    idx2  = this.articleClasi[0].associatedAccount.findIndex(aa =>(aa.tipoUsoCuentaId == uso && a.accountingAccountCode==data.accountingAccountCode && a.auxiliarId ==data.auxiliarId))
    this.ind=0;
    return
    })

    if (idx2 != -1) {
      this.FromClasification()
    }
   

  }

  onCreate(data: AssociatedAccounts) {
debugger

  let ind=this.article.associatedAccount.filter(a=> (a.origenArt=="Artículo") && (a.tipoUsoCuentaId ==data.tipoUsoCuentaId))
  let ind2=this.article.associatedAccount.filter(a=> (a.origenArt!="Artículo")  && (a.tipoUsoCuentaId ==data.tipoUsoCuentaId && a.accountingAccountCode==data.accountingAccountCode && a.auxiliarId==data.auxiliarId))
  let ind3=this.article.associatedAccount.filter(a=> (a.origenArt!="Artículo")  && (a.tipoUsoCuentaId ==data.tipoUsoCuentaId && (a.accountingAccountCode!=data.accountingAccountCode || a.auxiliarId!=data.auxiliarId)))
  if(this.articleClasi.length>0 && ind2.length>0){

    this.messageService.clear();
    this.messageService.add({ severity: 'info', summary: 'Cuenta reemplazada', detail: "La cuenta ya se encuentra registrada" });
 

  }else if((ind.length>0||ind3.length>0) && this.articleClasi.length>0 ){
   
    //this.onUpdate(data)
   
     let uso= data.tipoUsoCuentaId;
    const idx = this.article.associatedAccount.findIndex(a => a.tipoUsoCuentaId== uso)
    data.origenArt = "Artículo";
    this.article.associatedAccount[idx] = data
    this.article.associatedAccount = [...this.article.associatedAccount];
    this.indChange = true;

    this.messageService.clear();
        this.messageService.add({ severity: 'info', summary: 'Cuenta reemplazada', detail: "Una o más cuentas han cambiado de origen." });
    
   
  }else{
    data.origenArt = "Artículo";
    this.article.associatedAccount.push(data)
  }
    

   
    this.article.associatedAccount =  [...this.article.associatedAccount];
    this.indChange = true;
  }

  onChangeClas(event) {
    debugger
    this.articleClasiFilter.id = event.value;

    


    if (this.articleClasiFilter.id !=-1) {
      this.article.associatedAccount
      .forEach((a) => {
        const idx = this.article.associatedAccount.findIndex(aa =>(aa.origenArt!="Artículo"))
        if (idx != -1) {
          this.article.associatedAccount.splice(idx, 1)
      }
      })
    }
    if (this.loading)
      return;
    this.loading = true;
    this.classificationService.getArticleClassificationList(this.articleClasiFilter).subscribe((data: ArticleClassification[]) => {

     

      this.articleClasi = data
  
      this.FromClasification();
      this.indChange = true;

      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las clasificaciones" });

    });

  }

  FromClasification(){


    const newFilteredFromClasi =[...this.articleClasi[0]?.associatedAccount]; 
    

let indEditar =this.article.associatedAccount.filter(a=> a.origenArt=="Artículo")
 if (indEditar.length>0) {
    this.articleClasi[0].associatedAccount
    .forEach((a) => {

      let idx;
      let origen;
        if (this.ind==1) {
          idx = this.article.associatedAccount.findIndex(aa =>(a.tipoUsoCuentaId == aa.tipoUsoCuentaId && a.accountingAccountCode==aa.accountingAccountCode && a.auxiliarId ==aa.auxiliarId && a.origenArt=='Artículo'))
          origen='Artículo'
        }else{
          idx = this.article.associatedAccount.findIndex(aa =>(a.tipoUsoCuentaId == aa.tipoUsoCuentaId && a.accountingAccountCode==aa.accountingAccountCode && a.auxiliarId ==aa.auxiliarId))
          origen='Clasificación'
        }
      
    
      if (idx != -1) {
        this.article.associatedAccount[idx] = {...a,origenArt: origen}
       // if (this.ind==1) {
          this.messageService.clear();
          this.messageService.add({ severity: 'info', summary: 'Cuenta reemplazada', detail: "Una o más cuentas han cambiado de origen." });
       // }
        
       
      }
    })
    

  }
    if (this.article.associatedAccount.length) {
      if(indEditar.length==0){
        this.article.associatedAccount=[];
        
      }else{
        this.article.associatedAccount
        .forEach((a) => {
          const idx = newFilteredFromClasi.findIndex(aa =>(a.tipoUsoCuentaId == aa.tipoUsoCuentaId))
          if (idx != -1) {
          newFilteredFromClasi.splice(idx, 1)
        }
        })
      }
    }

       this.article.associatedAccount = [...this.article.associatedAccount, ...newFilteredFromClasi];
       this.ind=0;
  }

  showModalCostsDialog() {
    if (this.article.costoArt > 0 && !this.getCoinName(this.article?.monedaIdArt || -1)?.legalCurrency) {
      this.CostsArticle();

    }
  }
  CostsArticle() {
    if (this.loading)
      return;
    this.loading = true;

    this._articleService.getCostsArticleList(this.costsOfTheArticleModalFilter).subscribe((data: CostsOfTheArticleModal[]) => {
      this.costsOfTheArticleModals = data;
      this.loading = false;
      this.displayModal = true;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los  artículos." });

    });

  }

  getAssociatedAccountsArticle() {
    if (this.idItem ==0){
      this.article.associatedAccount = this.article.associatedAccount.filter(h => h.idAssociateArt < 0);
    }
    
    this.article.taxes = this.getArticleTaxes();
  }




  search() {

    if (this.loading)
      return;
    this.loading = true;
    this._articleService.getArticleList(this.articleFilter).subscribe((data: ArticlePage) => {
      this.articles =data.articles;
      //
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los  artículos." });

    });

  }

  //#region Variables de listado de cabeceras
  costCenters: CostCenter[];
  classifications: ArticleClassification[];
  types: ArticleType[];
  taxPlans: TaxPlan[];
  rawTaxes: TaxPlanRawTax[];
  coins: Coins[]
  //#endregion

  taxData: {
    plans?: TaxPlan[]
    raws?: TaxPlanRawTax[]
    types?: TaxeTypeApplication[]
    wOrigin?: TaxWOrigin[]
    wOriginTable?: TaxWOrigin[]
  } = {
      plans: [],
      raws: [],
      types: [],
      wOrigin: [],
      wOriginTable: [],
    }

  existOnPlan = (taxId: number, rateId: number) => this.taxData.plans
    .find(p => this.article.planImpuestoIdArt == p.id)?.taxes
    .find(t => t.taxId == taxId && t.rateId == +rateId)

  addTaxToTable() {
    const wOrigin = [
      ...this.taxData.wOrigin.map(t => ({...t, edit: false }))
    ]
    const tax = this.taxData.raws.find(t => +this.selectedTax === t.id)
    if (tax && this.selectedRate) {
      const idx = wOrigin.findIndex(t => t.id == tax.id)
      const planTax = this.taxData.wOriginTable.filter(t => t.origin !== -1)?.find(t => t.id == tax.id)
      if (+this.selectedRate === planTax?.rateId) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Impuesto ya registrado con la tasa seleccionada" });
        return
      }
      if (this.taxData.plans.find(p => this.article.planImpuestoIdArt == p.id)?.taxes.some(t => t.taxId == tax.id) && idx < 0) {
        this.messageService.clear();
        this.messageService.add({ severity: 'info', summary: 'Impuestos reemplazados', detail: "Uno o más impuestos han cambiado de origen" });
      }
      if (idx >= 0) {
        wOrigin[idx] = {
          ...wOrigin[idx],
          origin: -1,
          active: !this.existOnPlan(wOrigin[idx].id, +this.selectedRate),
          rateId: +this.selectedRate,
          edit: false,
        }
      } else {
        wOrigin.push({
          ...tax,
          origin: -1,
          active: true,
          edit: false,
          rateId: +this.selectedRate
        })
      }
      this.taxData.wOrigin = wOrigin
      this.setTaxTable(this.taxData.wOrigin || [], this.article.planImpuestoIdArt || -1)
    }
  }

  resetTax(id: number) {
    this.confirmationService.confirm({
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea cambiar la tasa actual por la seleccionada? el origen del impuesto cambiará a Plan de impuestos.',
      accept: () => {
        this.delTaxFromTable(id, false)
      },
      reject: () => {
        const idx = this.taxData.wOriginTable.findIndex(t => t.id == id)
        this.taxData.wOriginTable[idx].edit = false
      }
    })
  }

  delTaxFromTable(id: number, confirm = true) {
    const del = () => {
        const idx = this.taxData.wOrigin.findIndex(t => t.id == id)
        this.taxData.wOrigin[idx].active = false
        this.taxData.wOrigin[idx].edit = false
        this.setTaxTable(this.taxData.wOrigin || [], this.article.planImpuestoIdArt || -1)
    }
    if (confirm) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea borrar el impuesto?',
        accept: del,
      })
    } else {
      del()
    }
  }

  changeRateOption(idrate: number, tax: TaxWOrigin) {
    if (tax.origin != -1) {
      tax.origin = -1
      this.taxData.wOrigin.push({ ...tax })
      this.taxData.wOrigin = this.taxData.wOrigin
    }
    const idx = this.taxData.wOrigin.findIndex(t => t.id == tax.id)
    this.taxData.wOrigin[idx].rateId = idrate
    this.setTaxTable(this.taxData.wOrigin, this.article.planImpuestoIdArt || -1)
    console.log('Edit', idrate, this.taxData.wOriginTable)
  }

  setTaxTable(taxes: TaxWOrigin[] = this.taxData.wOrigin || [], planId: number = this.article.planImpuestoIdArt || -1) {
    const plan = this.taxData.plans.find(p => p.id == planId)
    const planTaxes = plan ? plan.taxes.filter(t => t.active && this.taxData.raws.find(r => t.taxId == r.id)).map(pt => ({
      ...this.taxData.raws.find(r => r.id == pt.taxId),
      rateId: pt.rateId,
      origin: plan.id,
      active: true,
      edit: false,
    })) : []

    const older = taxes.filter(t => t.origin == -1 && t.active) || taxes.filter(t => t.active)

    // const filteredPlanTaxes = planTaxes.filter(pt => !older.some(t => t.id == pt.id))
    // this.taxData.wOriginTable = [
    //   ...filteredPlanTaxes,
    //   ...(filteredPlanTaxes?.length ? older.filter(t => planTaxes.some(pt => pt.id != t.id)) : older)
    // ]

    // TODO

    const filteredPlanTaxes = older.length
      ? planTaxes
        .filter(pt => older.find(t => pt.id == t.id && pt.rateId == t.rateId) || !older.find(t => pt.id == t.id))
      : planTaxes

    const filteredArtTaxes = filteredPlanTaxes?.length
      ? older
        .filter(t => !filteredPlanTaxes.find(pt => pt.id == t.id))
      : older

    this.taxData.wOriginTable = [
      ...filteredPlanTaxes,
      ...filteredArtTaxes,
    ]
  }

  getArticleTaxes = () => {
    return this.taxData.wOrigin.map<ArticleTax>(t => ({
      tasaImpuestoId: +t.rateId,
      activeImpuesto: t.active,
      articuloImpuestoId: t.artId || -1,
    }))
  }

  getCroppedTypes = (ids: number[], start = 1, length = -1) => (this.taxData?.types || []).filter(t => ids.some(id => t.id == id)).slice(start, length)

  getCroppedTypesNamed = (ids: number[], start = 1, length = -1) => this.getCroppedTypes(ids, start, length).map(t => t.name).join(', ')

  fillTaxes = () => {
    if (!this.article.taxes.length) {
      return
    }

    this.taxData.wOrigin = this.article.taxes.filter(t => t.activeImpuesto && t.origenImpuesto === 'Articulo').map(at => {
      const raw = this.taxData.raws.find(r => r.id === at.impuestoIdArt)
      return {
        ...raw,
        artId: at.articuloImpuestoId,
        origin: -1,
        active: true,
        rateId: at.tasaImpuestoId,
      }
    })
    this.setTaxTable(this.taxData.wOrigin || [], this.article.planImpuestoIdArt || -1)
  }

  getTaxPlansList = (plans: TaxPlan[]) => [...plans.map(p => ({
    label: p.abbreviation || p.name,
    value: p.id,
  }))]

  taxTypeFilterIds: number[] = []
  selectedTax: number;
  selectedRate: number;

  log = console.log

  getTaxList = (taxes: TaxPlanRawTax[], ids: number[], wOrigin: TaxWOrigin[]) => [
    ...(ids?.length ? taxes
      .filter(t => ids.some(id => t.applicationTypeIds.some(tid => tid == id))) : taxes)
      .map(p => ({
        label: p.abbreviation + '-' + p.name,
        value: p.id,
      }))]

  getRateOptions = (taxId): SelectItem<number>[] => this.taxData.raws.find(t => t.id == taxId)?.rates.map(r => ({
    label: `${r.name} - ${r.value}${r.typeId == 1 ? '%' : ''}`,
    value: r.id,
  }))

  setRateOptions = () => {
    this.taxData.raws.forEach(t => {
      this.rateOptions[t.id] = t?.rates.map(r => ({
        label: `${r.name} - ${r.value}${r.typeId == 1 ? '%' : ''}`,
        value: r.id,
      }))
    })
  }

  getRateName = (taxId: number, rateId: number) => this.getRateOptions(taxId)?.find(r => r.value == rateId)?.label

  coinsOptions: SelectItem<number>[]

  rateOptions = {}

  fetchTaxData() {
    return this.taxPlanService.getList({ ...new TaxPlanFilter(), active: 1 })
      .toPromise()
      .then(plans => this.taxData.plans = plans.filter(p => p.taxes.length).sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this._articleService.getTypes({
        ...new ArticleTypeFilter(),
        active: 1,
      }).toPromise())
      .then(types => this.types = types.sort((a, b) => a.typeOfArticleName.localeCompare(b.typeOfArticleName)))
      .then(() => this.classificationService.getArticleClassificationList({
        ...ARTICLE_CLASSIFICATION_ALL_ACTIVES_FILTER,
        active: 1,
      }).toPromise())
      .then(classifications => this.classifications = classifications.sort((a, b) => a.articleClassificationName.localeCompare(b.articleClassificationName)))
      .then(() => this.coinService.getCoinxCompanyList({ idCompany: 1 }).toPromise())
      .then(coins => {
        this.coins = coins.sort((a, b) => a.name.localeCompare(b.name))
        this.coinsOptions = this.coins.map(c => ({
          label: `${c.name} - ${c.legalCurrency ? 'Moneda base' : 'Moneda conversión'}`,
          value: c.id,
        }))
      })
      .then(() => this.costCenterService.getCentersCostsList({
        ...new CostCenterFilters(),
        active: 1,
      }).toPromise())
      .then(costCenters => this.costCenters = costCenters.sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this.taxPlanService.getRawTaxes().toPromise())
      .then(taxes => {
        this.taxData.raws = taxes.filter(t => t.rates.length).sort((a, b) => a.abbreviation.localeCompare(b.abbreviation))
        this.setRateOptions()
      })
      .then(() => this.taxAppTypeService.getTaxeTypeApplications({
        id: -1,
        active: 1,
        name: '',
      }))
      .then((types: TaxeTypeApplication[]) => {
        this.taxData.types = types.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation))
        // this.taxTypeFilterIds = this.taxData.types.map(t => t.id)
      })
  }



  new() {
    this.viewMode = false;
    this.showDialog = true;
  }

  back() {
    if (this.indChange || (JSON.stringify(this.article) !== JSON.stringify(this.oldArticle))) {

      this.confirmationService.confirm({
        message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
        accept: () => {
          this.saving = true
          this.router.navigate(["/financial/masters/article-list"])
        }
      });
    } else {
      this.router.navigate(["/financial/masters/article-list"])
    }
  }

  send() {
    this.submitted = true;
    if (this.article.articleName != "" 
    && this.article.claseArticuloId >0
    && this.article.tipoArticuloId >0
    && this.article.centroCostoId >0
    && this.article.monedaIdArt  >0
    && this.article.costoArt > 0
    && this.article.estatuArticuloId > 0
   
    ) {
      if (this.article.associatedAccount.length == 0) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos una cuenta." });
        this.saving = false;
        return
      }

      if(this.indClasi==this.article.claseArticuloId || this.indTipo==this.article.tipoArticuloId || this.indCentro==this.article.centroCostoId ){

        if(this.indClasi==this.article.claseArticuloId){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La clasificación asociada al artículo se encuentra inactiva." });
        }

        if(this.indTipo==this.article.tipoArticuloId){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo se encuentra inactivo." });
        }
          
        if(this.indCentro==this.article.centroCostoId){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El centro de costo se encuentra inactivo." });
        }
              this.saving = false;
              return
      }
   
      
      const asso = [...this.article.associatedAccount]
      this.getAssociatedAccountsArticle()

      this.messageService.clear();
      this.saving = true
      this._articleService.postArticle(this.article).subscribe((data) => {
        if (data > 0) {
          this.showDialog = false;
          //this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          // this.onUpdate.emit();
          this.router.navigate(["/financial/masters/article-list"])
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });

        } else if (data == -1) {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.saving = false;
          this.article.associatedAccount = asso
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          this.article.associatedAccount = asso
          //window.location.reload();
        }
      });
    }
  }
}
