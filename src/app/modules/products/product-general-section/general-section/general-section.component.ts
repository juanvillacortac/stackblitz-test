import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Generalsection } from '../../shared/view-models/generalsection.viewmodel';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { Category } from 'src/app/models/masters-mpc/category';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ClassificationFilter } from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import { ClassificationService } from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import { ProductorigintypeFilter } from 'src/app/modules/masters-mpc/shared/filters/productorigintype-filter';
import { ProductorigintypeService } from 'src/app/modules/masters-mpc/shared/services/ProductOriginType/productorigintype.service';
import { ProducttypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/producttype-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { StructuretypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/structuretype-filter';
import { brandsFilter } from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { GroupinggenerationbarFilter } from 'src/app/modules/masters-mpc/shared/filters/common/groupinggenerationbar-filter';
import { GtintypeFilter } from 'src/app/modules/masters-mpc/shared/filters/gtintype-filter';
import { GtintypeService } from 'src/app/modules/masters-mpc/shared/services/GtinType/gtintype.service';
import { CompaniesFilter } from 'src/app/modules/masters/companies/shared/filters/companies-filter';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { Company } from 'src/app/models/masters/company';
import { Wastage } from '../../shared/view-models/wastage.viewmodel';
import { ProductService } from '../../shared/services/productservice/product.service';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { StatusProduct } from '../../shared/Utils/status-product';
import { ProductFilter } from '../../shared/filters/product-filter';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/app/models/products/product';
import { ProductCompanyViewModel } from '../../shared/view-models/company.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { ProductassociationService } from '../../shared/services/productassociationservice/productassociation.service';
import { ProductAssociationViewModel } from '../../shared/view-models/productassociation';
import { ProductAssociationFilterViewModel } from '../../shared/filters/productassociationfilter';
import { ProductAssociationComponentViewModel } from '../../shared/view-models/productassociationcomponent.viewmodel';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { hosts } from 'src/environments/environment.prod';

@Component({
  selector: 'general-section',
  templateUrl: './general-section.component.html',
  styleUrls: ['./general-section.component.scss'],
})
export class GeneralSectionComponent implements OnInit {

  
  @Input("idproduct") idproduct : number = 0;
  @Input("_product") _product : Product;
  _productCanceled : Product;
  @Output() productemit = new EventEmitter<Product>();
   _wastageListTemp: Wastage[] = [];
   _wastage: Wastage = new Wastage();
  selectedCategories: any[] = [];
  selectedCompanies: any[] = [];
  selectedCompaniesDB: any[] = [];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  categoryselected: any[] = [];
  categoriesString: string;
  categorylist: any[] = [];
  categorysearch: any[] = [];
  classificationlist: SelectItem[];
  origintypelist: SelectItem[];
  producttypelist: SelectItem[];
  structuretypelist: SelectItem[];
  brandslist: SelectItem[];
  countryslist: SelectItem[];
  groupinggenerationbarlist: SelectItem[];
  listgtintype: Gtintype[];
  gtintypelist: SelectItem[];
  companieslist: Company[] = [];
  _showdialogbarcode: boolean = false;
  _showdialogwastage: boolean = false;
  maxLength: number;
  messagevalidationgtin: string;
  submittedfinish: boolean = false;
  submittederaser: boolean = false;
  IndGtin: boolean = false;
  validations: Validations = new Validations();
  _showButtonEraser: boolean = true;
  _showButtonCancel: boolean = true;
  _showButtonFinish: boolean = true;
  statusproduct: typeof StatusProduct = StatusProduct;
  inactivecompanies: string = "";
  IdTypeGenerationBar: number = -1;
  @Output() typegenerationbarchange = new EventEmitter<number>();
  companylisttem: ProductCompanyViewModel[] = [];
  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();
  @Output("clearchanges") clearchanges = new EventEmitter<number>();
  @Output("refreshproduct") refreshproduct = new EventEmitter<number>();
  validateStructure = false;
  stringsave: string = "Terminar";
  eventstatus: string = "all";
  permissionsIDs = {...Permissions};
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  editind: boolean =false;
  indProduct: number = 0;
  idProductFather: number = 0;
  checkAllCompany: boolean = false;
  showDialogNewAssociationComponent: boolean = false;
  IndGenerationBar: number = 1;
  _productComponent : ProductAssociationComponentViewModel = new ProductAssociationComponentViewModel();
   _lockField:boolean=false;
_host:string;
  constructor(public breadcrumbService: BreadcrumbService,
    private router: Router,   
    public _categoryservice: CategoryService,
    private _classificationservice: ClassificationService,
    private _origintypeservice: ProductorigintypeService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    private _countryservice: CountryService,
    private _gtintypeservice: GtintypeService,
    private _companiesservice: CompanyService,
    private _productservice: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private actRoute: ActivatedRoute,
    public userPermissions: UserPermissions,
    private activatedRoute: ActivatedRoute,
    private productAssociationService: ProductassociationService,private readonly loadingService: LoadingService) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Productos'}
    ]);
    
    this.onLoadCategorys();
   }
   lockFields()
   {


  this._host=hosts.API_BASE;
  console.log(this._host);
    if(this._host=='https://erp.sigocorp.com'){
      this._lockField=true;

    }
   }
   async ngOnInit() {
    this.lockFields();
    this.indProduct = this.actRoute.snapshot.params['ind'];
    this.idProductFather = this.actRoute.snapshot.params['idFather'];
    if (this.idProductFather > 0) {
      this._showButtonEraser = false;
    }
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }
    
    this.onLoadClassification();
    this.onLoadOriginTypes();
    this.onLoadProductTypes();
    this.onLoadStructureTypes();
    this.onLoadBrandsList();
    this.onLoadCountrysList();
    this.onLoadGroupingGenerationBarList();
    this.onLoadGtinTypeList();
      
    if(this.idproduct == 0){
      this._showButtonCancel = false;
      var filter: CompaniesFilter = new CompaniesFilter()
      filter.active = 1;
      this.onLoadCompaniesList(filter);
      this._product = new Product();
      this._product.classificationId = 0;
      this._product.productTypeId = 1;
      this._product.structureTypeId = 1;
      this._product.groupingGenerationBarId = 1;
      this._product.categoryId = 0;
      this._product.originTypeId = 1;
      this.categoriesString = "No aplica";
      this._product.gtinTypeId = 0;
      this._product.productRotationId = 0;
      this._product.brandId = 0;
      this._product.countryofOriginId = 1;
      
    }else{
      this.onLoadProduct(this.idproduct);
    }
    
  }

  checkAllCompanies(){
    this.editind = true;
      this._product.companies = [];
    if (this.checkAllCompany) {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
      var companyselected: Company[] = [];
      this.companieslist.forEach(company => {
        if (company.active) {
          this.selectedCompanies.push(company);
        }
      });
      //this.selectedCompanies = companyselected;
    }else{
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
    }
    this.selectedCompanies.forEach(company1 => {
      if (this.selectedCompaniesDB.filter(c => c.id == company1.id).length == 0) {
        var company = new ProductCompanyViewModel();
        company.idProductCompany = -1;
        company.id = company1.id;
        company.active = true;
        company.isActive = true;
        this._product.companies.push(company);
      }else if(this.selectedCompaniesDB.filter(c => c.id == company1.id).length > 0){
        var company = new ProductCompanyViewModel();
        company.idProductCompany = this.companylisttem.find(x => x.id == company1.id).idProductCompany;
        company.id = company1.id;
        company.active = true;
        company.isActive = true;
        this._product.companies.push(company);
      }
    });
    this.selectedCompaniesDB.forEach(company1 => {
      if (this.selectedCompanies.filter(c => c.id == company1.id).length == 0) {
        var company = new ProductCompanyViewModel();
        company.idProductCompany = this.companylisttem.find(x => x.id == company1.id).idProductCompany;
        company.id = company1.id;
        company.active = false;
        company.isActive = true;
        this._product.companies.push(company);
      }
    })
  }

  async onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
    .subscribe((data: Category[])=>{
      this.categorylist = data;
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadClassification(){
    var filter: ClassificationFilter = new ClassificationFilter()
    filter.active = 1;
    this._classificationservice.getClassificationbyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.classificationlist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadOriginTypes(){
    var filter: ProductorigintypeFilter = new ProductorigintypeFilter()
    filter.active = 1;
    this._origintypeservice.getProductorigintypebyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.origintypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadProductTypes(){
    var filter: ProducttypeFilter = new ProducttypeFilter()
    filter.active = 1;
    this._commonservice.getProductTypes(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.producttypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadStructureTypes(){
    var filter: StructuretypeFilter = new StructuretypeFilter();
    filter.active = 1;
    this._commonservice.getStructureTypes(filter)
    .subscribe((data)=>{
      data = data.filter(x => x.id != 3);
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.structuretypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadBrandsList(){
    var filter: brandsFilter = new brandsFilter()
    filter.active = 1;
    this._brandservice.getBrandsList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.brandslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadCountrysList(){
    var filter: CountryFilter = new CountryFilter()
    filter.active = 1;
    this._countryservice.getCountriesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.countryslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadGroupingGenerationBarList(){
    var filter: GroupinggenerationbarFilter = new GroupinggenerationbarFilter()
    filter.active = 1;
    this._commonservice.getGroupingGenerationBar(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.groupinggenerationbarlist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadGtinTypeList(){
    var filter: GtintypeFilter = new GtintypeFilter()
    filter.active = 1;
    filter.gtinGroupingId = 1;
    this._gtintypeservice.getGtinTypebyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.gtintypelist = data.map((item)=>({
        label: item.name,
        value: item.id,
      }));
      this.listgtintype = data;
    },(error)=>{
      console.log(error);
    });
  }
  async onLoadGtinTypeSelected(GtinTypeId: number){
    var filter: GtintypeFilter = new GtintypeFilter()
    filter.active = 1;
    filter.gtinGroupingId = 1;
    this._gtintypeservice.getGtinTypebyfilter(filter)
    .subscribe((data)=>{
      var gtinselected = data.filter(x => x.id == GtinTypeId);
      if (gtinselected.length > 0) {
        this.maxLength = gtinselected[0].digitAmount;
      }
    },(error)=>{
      console.log(error);
    });
  }
  async onLoadCompaniesList(filter: CompaniesFilter){
    
    this._companiesservice.getCompaniesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.companieslist = data;
      
    },(error)=>{
      console.log(error);
    });
  }
  async onLoadCompaniesListSelected(companies: ProductCompanyViewModel[], companiesselected: any[]){
    var filter: CompaniesFilter = new CompaniesFilter()
    filter.active = -1;
    this._companiesservice.getCompaniesList(filter)
    .subscribe((data)=>{
        this.companieslist = data;
        companies.forEach(company => {
          if(company.active){
            companiesselected.push(this.companieslist.length > 0 ? this.companieslist.find(x => x.id == company.id) : new Company);
          }
        });
        this.selectedCompanies = companiesselected;
    },(error)=>{
      console.log(error);
    });
  }

  ValidateCheckedsCategory(control, category: Category) : void{
    this.editind = true;
    this.selectedCategories = this.selectedCategories.filter(x => x.expanded != true);
    if(this.selectedCategories.length > 1){
      this.selectedCategories = this.selectedCategories.slice(1);
    }
    
    this.categoriesString = "";
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if(this.selectedCategories[i].expanded != true){
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : "";
        this._product.categoryId = this.selectedCategories[i].data.id;
      }
    }
    if(this.selectedCategories.length == 0){
      this.categoriesString = "No Aplica";
      this._product.categoryId = 0;
    }
  }

  ValidateCheckedsCompanies(event) : void  {
    this.editind = true;
    this._product.companies = [];
    this.selectedCompanies.forEach(company1 => {
      if (this.selectedCompaniesDB.filter(c => c.id == company1.id).length == 0) {
        var company = new ProductCompanyViewModel();
        company.idProductCompany = -1;
        company.id = company1.id;
        company.active = true;
        company.isActive = true;
        this._product.companies.push(company);
      }else if(this.selectedCompaniesDB.filter(c => c.id == company1.id).length > 0){
        var company = new ProductCompanyViewModel();
        company.idProductCompany = this.companylisttem.find(x => x.id == company1.id).idProductCompany;
        company.id = company1.id;
        company.active = true;
        company.isActive = true;
        this._product.companies.push(company);
      }
    });
    this.selectedCompaniesDB.forEach(company1 => {
      if (this.selectedCompanies.filter(c => c.id == company1.id).length == 0) {
        var company = new ProductCompanyViewModel();
        company.idProductCompany = this.companylisttem.find(x => x.id == company1.id).idProductCompany;
        company.id = company1.id;
        company.active = false;
        company.isActive = true;
        this._product.companies.push(company);
      }
    })
  }

  back = () => {
    if (this.editind == true) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Si regresa al catálogo de productos, todos los cambios pendientes por guardar serán eliminados. ¿Desea continuar?',
        accept: () => {
          const queryParams: any = {};
          queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
        }
      })
    }else{
      const queryParams: any = {};
      queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
    }
  }

  showDialogBarCode(){
    this._showdialogbarcode = true;
  }

  showDialogWastage(){
    this.editind = true;
    this._wastage = new Wastage();
    this._showdialogwastage = true;
  }

  ValidateGtin(barcode){
    this.editind = true;
    if(barcode.trim() != ""){
      var gtinselected = this.listgtintype.find(x => x.id == this._product.gtinTypeId);
      var digitamount = gtinselected.digitAmount;
      if(gtinselected.checkDigit == true){
        if(barcode.length == digitamount){
          var barcodecut = barcode.substr(0,digitamount-1);
          let result = 0;
          let i = 1;
          for (let counter = barcodecut.length-1; counter >=0; counter--){
              result = result + parseInt(barcodecut.charAt(counter)) * (1+(2*(i % 2)));
              i++;
          }
          var resul = (10 - (result % 10)) % 10;
          if(barcode != (barcodecut + resul)){
            this.messagevalidationgtin = "El GTIN es incorrecto";
            this.IndGtin = true;
          }else{
            this.messagevalidationgtin = "";
            this.IndGtin = false;
          }
        }else{
          this.messagevalidationgtin = "El GTIN es incorrecto";
          this.IndGtin = true;
        }
      }
    }else{
      this.messagevalidationgtin = "";
            this.IndGtin = false;
    }
  }

  ValidateMaxLength(){
    this.IndGtin = false;
    this.editind = true;
    this.messagevalidationgtin = "";
    this._product.gtin = "";
    var gtinselected = this.listgtintype.find(x => x.id == this._product.gtinTypeId);
    this.maxLength = gtinselected.digitAmount;
  }

  ValidateGenerationType(){
    this.editind = true;
    this._product.gtinTypeId = 0;
    this._product.gtin = "";
    this.IdTypeGenerationBar = this._product.groupingGenerationBarId == 2 && this._product.heavyInd == true ? 2 : 1;
    this.typegenerationbarchange.emit(this.IdTypeGenerationBar);
  }

  FinishProduct(){
    
    this._product.countryofOriginId = this.countryslist.filter(x => x.value == this._product.countryofOriginId).length > 0 ? this._product.countryofOriginId : -1;
    this._product.originTypeId = this.origintypelist.filter(x => x.value == this._product.originTypeId).length > 0 ? this._product.originTypeId : -1;
    this._product.brandId = this.brandslist.filter(x => x.value == this._product.brandId).length > 0 ? this._product.brandId : -1;
    if (this.gtintypelist.filter(x => x.value == this._product.gtinTypeId).length == 0) {
      this._product.gtinTypeId = 0;
      this._product.gtin = "";
    }
    this.submittedfinish = true;
    this.inactivecompanies = "";
    this._product.referent = this._product.referent == "" ? this._product.factoryRef != "" ? this._product.factoryRef : this._product.referent : this._product.referent;
    if(this._product.name.trim() && this._product.referent.trim() && this.selectedCompanies.length > 0 && (this._product.gtin.trim() || this._product.gtin2.trim()) && this._product.countryofOriginId > 0 && this._product.originTypeId > 0 && this._product.brandId > -1){
      if(this._product.productId != 0){
        this.selectedCompaniesDB.forEach(wastage => {
          if (this.selectedCompanies.filter(x => x.id == wastage.id).length == 0 && wastage.isActive == true) {
            this.inactivecompanies = this.inactivecompanies == "" ? wastage.name : this.inactivecompanies + ", " + wastage.name;
          }
        });
      }
      if (this.inactivecompanies != "") {
        this.confirmInactivateCompaniesFinish();
      }else{
        this.saveProductFinish();
      }
    }else if(this.selectedCompanies.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: "Debe seleccionar al menos una empresa"});
    }
  }

  EraserProduct(){
    this._product.countryofOriginId = this.countryslist.filter(x => x.value == this._product.countryofOriginId).length > 0 ? this._product.countryofOriginId : -1;
    this._product.originTypeId = this.origintypelist.filter(x => x.value == this._product.originTypeId).length > 0 ? this._product.originTypeId : -1;
    this._product.brandId = this.brandslist.filter(x => x.value == this._product.brandId).length > 0 ? this._product.brandId : -1;
    if (this.gtintypelist.filter(x => x.value == this._product.gtinTypeId).length == 0) {
      this._product.gtinTypeId = 0;
      this._product.gtin = "";
    }
    this.inactivecompanies = "";
    this.submittederaser = true;
    this._product.referent = this._product.referent == "" ? this._product.factoryRef != "" ? this._product.factoryRef : this._product.referent : this._product.referent;
    if(this._product.name.trim() && this._product.referent.trim() && this.selectedCompanies.length > 0 && this._product.countryofOriginId > 0 && this._product.originTypeId > 0 && this._product.brandId > -1){
      if(this._product.productId != 0){
        this.selectedCompaniesDB.forEach(wastage => {
          if (this.selectedCompanies.filter(x => x.id == wastage.id).length == 0 && wastage.isActive == true) {
              this.inactivecompanies = this.inactivecompanies == "" ? wastage.name : this.inactivecompanies + ", " + wastage.name;
          }
        });
      }
      if (this.inactivecompanies != "") {
        this.confirmInactivateCompaniesEraser();
      }else{
        if (this._product.gtin != "" || this._product.gtin2 != "") {
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: 'La barra del producto no se guardará si el producto está en estatus borrador. ¿Desea continuar?',
            accept: () => {
              this.saveProductEraser();
            },
            reject: (type) => {
            }
          })
        }else{
          this.saveProductEraser();
        }
      }
    }else if(this.selectedCompanies.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: "Debe seleccionar al menos una empresa"});
    }
  }

  ValidateEdit(){
    this.editind = true;
    this.refreshchange();
  }

  saveProductFinish(){
    if(this._product.heavyInd){
      this._product.wastageTypes = this._wastageListTemp;
    }
    this._product.name = this._product.name.trim();
    //this._product.name = this._product.name.charAt(0).toLocaleUpperCase() + this._product.name.substr(1).toLowerCase();
    this._product.statusId = StatusProduct.Finish;
    this._product.barcode = this._product.groupingGenerationBarId == 1 ? this._product.gtin : this._product.gtin2;
    //this._product.typeGenerationBarId = this._product.heavyInd == true ? 2 : 1;
    this._product.factoryRef = this._product.factoryRef == "" ? this._product.referent : this._product.factoryRef;
    if (this.idProductFather > 0) {
      var associationProductList: ProductAssociationViewModel[] = [];
      var association =  new ProductAssociationViewModel();
      if (this.indProduct == 1) {
        this._productComponent = new ProductAssociationComponentViewModel();
        this._productComponent.barCode = this._product.barcode;
        this._productComponent.name = this._product.name;
        this._productComponent.category.name = this.categoriesString;
        this.showDialogNewAssociationComponent = true;

        /* association.idProductAssociation = -1;
        association.idChildProduct = -1;
        association.idProductAssociationType = 1;
        association.idFatherProduct = parseInt(this.idProductFather.toString());
        association.idPartsType = 0;
        association.childProduct = this._product;
        association.amount = 1;
        association.active =true;
        associationProductList.push(association);
            this.productAssociationService.postProductAssociation(associationProductList)
          .subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.productemit.emit(this._product);
              let link:any[] = ['/productgeneralsection', this.idProductFather,0,0];
              document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar las asociaciones"});
            }
          },(error)=>{
            console.log(error);
        }); */
      }else{
        var association =  new ProductAssociationViewModel();
        association.idProductAssociation = -1;
        association.idChildProduct = -1;
        association.idProductAssociationType = 2;
        association.idFatherProduct = parseInt(this.idProductFather.toString());
        association.idPartsType = 0;
        association.childProduct = this._product;
        association.amount = 0;
        association.active = true;
        associationProductList.push(association);
        this.productAssociationService.postProductAssociation(associationProductList)
          .subscribe((data)=>{
            if (data > 0) {
              this.editind=false;
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.productemit.emit(this._product);
              let link:any[] = ['mpc/productgeneralsection', this.idProductFather,0,0];
              this.sendMessage(this.idProductFather);
               //document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar las asociaciones"});
            }
          },(error)=>{
            console.log(error);
        });
      }
      
    }else{
      this._productservice.postGeneralSection(this._product).subscribe((data: number) => {
      
        if(data > 0) {
          this._showButtonEraser = false;
          this._showButtonCancel = false;
          this.editind=false;
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.productemit.emit(this._product);
          this.submittederaser = false;
          let link:any[] = ['mpc/productgeneralsection', data.toString(),0,0];
          this.sendMessage(data);
          //document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
        }else if(data == -1001){
          this.messageService.add({severity:'error', summary:'Error', detail: "El nombre del producto ya existe"});
        }else if(data == -1017){
          this.messageService.add({severity:'error', summary:'Error', detail: "La referencia interna ya existe"});
        }else if(data == -1016){
          this.messageService.add({severity:'error', summary:'Error', detail: "La barra ya existe"});
        }else if(data == -1024){
          this.messageService.add({severity:'error', summary:'Error', detail: "La referencia fábrica ya existe"});
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el producto"});
        }
      })
    }
    
  }

  SaveNewProductoAssociationComponent(){
    
    var associationProductList: ProductAssociationViewModel[] = [];
    var association =  new ProductAssociationViewModel();
    association.idProductAssociation = -1;
    association.idChildProduct = -1;
    association.idProductAssociationType = 1;
    association.idFatherProduct = parseInt(this.idProductFather.toString());
    association.idPartsType = this._productComponent.partsType.id;
    association.childProduct = this._product;
    association.amount = this._productComponent.amount;
    association.active =true;
    associationProductList.push(association);
      this.productAssociationService.postProductAssociation(associationProductList)
      .subscribe((data)=>{
        if (data > 0) {
          this.editind=false;
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.productemit.emit(this._product);
          let link:any[] = ['mpc/productgeneralsection', this.idProductFather,0,0];
          this.sendMessage(this.idProductFather);
          //document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar las asociaciones"});
        }
      },(error)=>{
        console.log(error);
    });
  }

  saveProductEraser(){
    if(this._product.heavyInd){
      this._product.wastageTypes = this._wastageListTemp;
    }
    this._product.name = this._product.name.trim();
    this._product.name = this._product.name.charAt(0).toLocaleUpperCase() + this._product.name.substr(1).toLowerCase();
    this._product.statusId = StatusProduct.Eraser;
    this._product.barcode = this._product.groupingGenerationBarId == 1 ? this._product.gtin == undefined ? "" : this._product.gtin : this._product.gtin2  == undefined ? "" : this._product.gtin2;
    //this._product.typeGenerationBarId = this._product.heavyInd == true ? 2 : 1;
    this._product.factoryRef = this._product.factoryRef == "" ? this._product.referent : this._product.factoryRef;
    this._productservice.postGeneralSection(this._product).subscribe((data: number) => {
      if(data > 0) {
        //this.editind=true;
        this.editind=false;
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this._product.productId=data;
        this.productemit.emit(this._product);
        this.submittederaser = false;
        let link:any[] = ['mpc/productgeneralsection', data.toString(),0,0];
        this.sendMessage(data);
        //document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
        //var url = this.router.url.replace(this.idproduct.toString(), data.toString());
        //document.location.href = url;
      }else if(data == -1001){
        this.messageService.add({severity:'error', summary:'Error', detail: "El nombre del producto ya existe"});
      }else if(data == -1017){
        this.messageService.add({severity:'error', summary:'Error', detail: "La referencia interna ya existe"});
      }else if(data == -1016){
        this.messageService.add({severity:'error', summary:'Error', detail: "La barra ya existe"});
      }else if(data == -1024){
        this.messageService.add({severity:'error', summary:'Error', detail: "La referencia fábrica ya existe"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el producto"});
      }
    })
  }

  saveProductCanceled(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea anular este producto?',
      accept: () => {
        this._productCanceled.statusId = StatusProduct.Canceled;
        this._productservice.postGeneralSection(this._productCanceled).subscribe((data: number) => {
          if(data > 0) {
            this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
            this.productemit.emit(this._productCanceled);
            location.reload();
          }else{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al anular el producto"});
          }
        })
      },
      reject: (type) => {
      }
    })
    
  }
  onEditWastage(IdProductWastage,IdWastage,IdTypeWastage,performaceFactor, percent, indactivo){
    this.editind = true;
    this._wastage = new Wastage();
    this._wastage.idWastage = IdWastage;
    this._wastage.productWastageId = IdProductWastage;
    this._wastage.wastageTypeId = IdTypeWastage;
    this._wastage.performaceFactor = performaceFactor;
    this._wastage.percent = percent;
    this._wastage.active = indactivo;
    this._wastage.indedit = true;
    this._showdialogwastage = true;
  }

  onRemoveWastage(IdWastage){
    this._wastageListTemp = this._wastageListTemp.filter(x => x.idWastage != IdWastage);
  }

  onActiveWastage(IdProductWastage,IdWastageType){
    if(this._wastageListTemp.find(x => x.productWastageId == IdProductWastage).active == false){
      if(this._wastageListTemp.filter(x => x.wastageTypeId == IdWastageType && x.active == true).length <= 0){
        this._wastageListTemp.filter(x => x.productWastageId == IdProductWastage).forEach(wastage =>{
          wastage.active = !wastage.active;
        });
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Este tipo de merma ya existe"});
      }
    }else{
      this._wastageListTemp.filter(x => x.productWastageId == IdProductWastage).forEach(wastage =>{
        wastage.active = !wastage.active;
      });
    }
  }

  searchProductAssociation(idproduct){
    var filters = new ProductAssociationFilterViewModel();
    filters.idProduct = idproduct;
    this.productAssociationService.getProductAssociationsbyfilter(filters)
      .subscribe((data)=>{
        if (data.filter(x => x.components.length > 0).length > 0) {
          this.validateStructure = true;
        }
    },(error)=>{
        console.log(error);
    });
  }

  onLoadProduct(idProduct){
    
    this._product = new Product();
    var filter = new ProductFilter();
    filter.productId = this.idproduct;
    this.loadingService.startLoading('wait_loading');
    this._productservice.getProductbyfilter(filter).subscribe((data: Product) => {
     
      this._product = data;
      this._productCanceled = {...data};
      this.categoriesString = data.categoryId == 0 ? "No Aplica" : this._product.category.name;
      this.categorysearch = data.categoryId == 0 ? [] : this.categorylist;
      this.companylisttem = data.companies;
      var companylistselectedtemp = [];
      if (data.categoryId != 0) {
        this.searchcategoryselected(this.categorysearch, data.categoryId);
        this.selectedCategories = this.categoryselected.length > 0 ? this.categoryselected : [];
      }
      this._wastageListTemp = data.wastageTypes;
      this._showButtonEraser = this._product.statusId == StatusProduct.Finish ? false : true;
      this._showButtonCancel = this._product.statusId == StatusProduct.Finish ? false : true;
      this._product.gtin = this._product.groupingGenerationBarId == 1 ? this._product.barcode == null ? "" : this._product.barcode : "";
      this._product.gtin2 = this._product.groupingGenerationBarId == 2 ? this._product.barcode == null ? "" : this._product.barcode : "";
      this.IdTypeGenerationBar = this._product.groupingGenerationBarId == 2 && this._product.heavyInd == true ? 2 : 1;
      this.onLoadCompaniesListSelected(data.companies,companylistselectedtemp);
      this.selectedCompaniesDB = data.companies;
      this.selectedCompaniesDB.forEach(element => {
        if(element.active){
          element.isActive = true;
        }else{
          element.isActive = false;
        }
      });
      if(this._product.statusId == StatusProduct.Canceled){
        this._showButtonCancel = false;
        this._showButtonEraser = false;
        this._showButtonFinish = false;
      }
      this.onLoadGtinTypeSelected(this._product.gtinTypeId);
      this.eventstatus = this._product.statusId == StatusProduct.Canceled ? "none" : "all";
      this.stringsave = this._product.statusId == StatusProduct.Finish ? "Guardar" : "Terminar";
      if (this._product.statusId == StatusProduct.Finish) {
        this.searchProductAssociation(this.idproduct);
        
      }
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando el producto"});
    });
  }

  searchcategoryselected(cateorys, id){
    if (cateorys.filter(x => x.data.id == id).length > 0) {
      this.categoryselected = cateorys.filter(x => x.data.id == id);
    }else{
      cateorys.forEach(Category => {
        if (Category.children.length > 0) {
          this.searchcategoryselected(Category.children, id);
        }
      });
    }
  }
  confirmInactivateCompaniesEraser(){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Este producto se inactivará para las empresas: ' + this.inactivecompanies + ". ¿Está de acuerdo?",
        accept: () => {
          this.saveProductEraser();
        },
        reject: (type) => {
        }
      })
  }

  confirmInactivateCompaniesFinish(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Este producto se inactivará para las empresas: ' + this.inactivecompanies + ". ¿Está de acuerdo?",
      accept: () => {
        this.saveProductFinish();
      },
      reject: (type) => {
      }
    })
}

  confirmIndHeavy(){
    this.editind = true;
    this.IndGtin = false;
    this._product.gtinTypeId = 0;
    this._product.gtin = "";
    this._product.gtin2 = "";
    this._product.scalecode = "";
    this._product.groupingGenerationBarId = this._product.heavyInd == true ? 2 : 1;
    this.IdTypeGenerationBar = this._product.groupingGenerationBarId == 2 && this._product.heavyInd == true ? 2 : 1;
    this.typegenerationbarchange.emit(this.IdTypeGenerationBar);
    if (this._product.heavyInd == false && this._wastageListTemp.length > 0) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Si desactiva el indicador pesado, las mermas registradas seran inactivadas y las pendientes por guardar seran eliminadas.',
        accept: () => {
          this._wastageListTemp.forEach(wastage =>{
            wastage.active = false;
          });
          this._wastageListTemp = this._wastageListTemp.filter(x => x.idWastage == NaN || x.idWastage == undefined);
          this.messageService.add({severity:'success', summary:'Confirmado', detail:'Listado de mermas actualizado'});
        },
        reject: (type) => {
          this._product.heavyInd = true;
        }
      })
    }
    
  }

  clearInputBarCode(){
    this._product.gtin2 = "";
  }

  refreshchange(){
    this.refreshchanges.emit();
  }
  sendMessage(numero) {
    
    this.refreshproduct.emit(numero);
    
  }
}
