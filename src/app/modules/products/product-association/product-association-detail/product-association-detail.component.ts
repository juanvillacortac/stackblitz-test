import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { Product } from 'src/app/models/products/product';
import { ProductFilter } from '../../shared/filters/product-filter';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { ProductassociationService } from '../../shared/services/productassociationservice/productassociation.service';
import { ProductService } from '../../shared/services/productservice/product.service';
import { ProductAssociationFilterViewModel } from '../../shared/filters/productassociationfilter';
import { ProductAssociationViewModel } from '../../shared/view-models/productassociation';
import { ProductAssociationComponentViewModel } from '../../shared/view-models/productassociationcomponent.viewmodel';
import { ProductAssociationDerivateViewModel } from '../../shared/view-models/productassociationderivate.viewmodel';
import { ProductAssociationRelatedViewModel } from '../../shared/view-models/productassociationrelated.viewmodel';
import { ProductComponentAssociationPanelComponent } from '../product-component-association-panel/product-component-association-panel.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-product-association-detail',
  templateUrl: './product-association-detail.component.html',
  styleUrls: ['./product-association-detail.component.scss'],
  providers: [ProductComponentAssociationPanelComponent]
})
export class ProductAssociationDetailComponent implements OnInit {
  
  @Input("idproduct") idproduct : number = 0;
  @Input("_product") _product : Product;
  _productComponent: ProductAssociationComponentViewModel = new ProductAssociationComponentViewModel();
  _productAssociation: ProductAssociationRelatedViewModel =  new ProductAssociationRelatedViewModel();
  productComponentsList: ProductAssociationComponentViewModel[] = [];
  productDerivateList: ProductAssociationDerivateViewModel[] = [];
  productAssociationList: ProductAssociationRelatedViewModel[] = [];
  productComponentsListDB: ProductAssociationComponentViewModel[] = [];
  productDerivateListDB: ProductAssociationDerivateViewModel[] = [];
  productAssociationListDB: ProductAssociationRelatedViewModel[] = [];
  productFatherList: Product[] = [];
  productFatherListDB: Product[] = [];
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  permissionsIDs = {...Permissions};
  showMore: boolean = false;
  showDialogNewAssociation: boolean = false;
  showDialogNewAssociationComponent: boolean = false;
  validateSave: boolean = false;
  saving: boolean = false;

  displayedColumnsComponents: ColumnD<ProductAssociationComponentViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.partsType.name; },field: 'partsType.name', header: 'Tipo de parte', display: 'table-cell'},
   {template: (data) => { return data.amount; },field: 'amount', header: 'Cantidad', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Asociado por', display: 'table-cell'},
  ];

  displayedColumnsDerivates: ColumnD<ProductAssociationDerivateViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Asociado por', display: 'table-cell'},
  ];

  displayedColumnsRelated: ColumnD<ProductAssociationRelatedViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.relation.name; },field: 'relation.name', header: 'Relación', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Asociado por', display: 'table-cell'},
  ];

  _showdialogProductComponent: boolean = false;
  _showdialogDerivateComponent: boolean = false;
  _showdialogRelatedComponent: boolean = false;

  constructor(private _productservice: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productAssociationService: ProductassociationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
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
    this.onLoadProduct();
    this.searchProductAssoiciations();
  }

  back = () => {
    if (this.productComponentsList.length != this.productComponentsListDB.length || this.productDerivateList.length != this.productDerivateListDB.length || this.productAssociationList.length != this.productAssociationListDB.length) {
      this.ConfirmBack();
    }else{
      const queryParams: any = {};
          queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
    }
    
  }

  ConfirmBack(){
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
      },
      reject: (type) => {
      }
    })
  }

  searchProductAssoiciations(){
    this.productFatherList = [];
    this.productComponentsList = [];
    this.productDerivateList = [];
    this.productAssociationList =  [];
    this.productComponentsListDB = [];
    this.productDerivateListDB = [];
    this.productAssociationListDB =  [];
    var filters = new ProductAssociationFilterViewModel();
    filters.idProduct = this.idproduct;
    this.productAssociationService.getProductAssociationsbyfilter(filters)
      .subscribe((data)=>{
        data.forEach(product => {
          product.productFather.forEach(father => {
            var p = new Product();
            p.productId = father.productId;
            p.name = father.name;
            p.barcode = father.barcode;
            p.category = father.category;
            if (this.productFatherList.length <3) {
              this.productFatherList.push(p);
            }
            this.productFatherListDB.push(p);
          });
          if (this.productFatherListDB.length == 4) {
            this.showMore = true;
          }
          var components : ProductAssociationComponentViewModel[] = [];
          product.components.forEach(component => {
            var c = new ProductAssociationComponentViewModel();
            c.idProductAssociationComponent = component.idProductAssociation;
            c.idProduct = component.idChildProduct;
            c.name = component.childProduct.name;
            c.barCode = component.childProduct.barcode;
            c.category = new Category();
            c.category.id = component.childProduct.category.id;
            c.category.name = component.childProduct.category.name;
            c.partsType.id = component.partsType.id;
            c.partsType.name = component.partsType.name;
            c.amount = component.amount;
            c.createdByUser = component.createByUser;
            components.push(c);
            this.productComponentsListDB.push(c);
          });
          this.productComponentsList = components;
          var derivates: ProductAssociationDerivateViewModel[] = []; 
          product.derivates.forEach(derivate => {
            var d = new ProductAssociationDerivateViewModel();
            d.idProductAssociationDerivate = derivate.idProductAssociation;
            d.idProduct = derivate.idChildProduct;
            d.name = derivate.childProduct.name;
            d.barCode = derivate.childProduct.barcode;
            d.category.id = derivate.childProduct.category.id;
            d.category.name = derivate.childProduct.category.name;
            d.createdByUser = derivate.createByUser;
            derivates.push(d);
            this.productDerivateListDB.push(d);
          });
          this.productDerivateList = derivates;
          var associations: ProductAssociationRelatedViewModel[] = [];
          product.related.forEach(related => {
            var r = new ProductAssociationRelatedViewModel();
            r.idProductAssoicationRelated = related.idProductAssociation;
            r.idProduct = related.idChildProduct;
            r.name = related.childProduct.name;
            r.barCode = related.childProduct.barcode;
            r.category.id = related.childProduct.category.id;
            r.category.name = related.childProduct.category.name;
            r.relation.id = related.productAssociationType.id;
            r.relation.name = related.productAssociationType.name;
            r.createdByUser = related.createByUser;
            associations.push(r);
            this.productAssociationListDB.push(r);
          })
          this.productAssociationList = associations;
        });
      },(error)=>{
        console.log(error);
      });
  }

  onLoadProduct(){
    this._product = new Product();
    var filter = new ProductFilter();
    filter.productId = this.idproduct;
    this._productservice.getProductbyfilter(filter).subscribe((data: Product) => {
      this._product = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando el producto"});
    });
  }
  
  refreshproductassociationchanges(){
    var components: ProductAssociationComponentViewModel[] = [];
    this.productComponentsList.forEach(element => {
      components.push(element);
    });
    this.validateSave = true;
    components.push(this._productComponent);
    this.productComponentsList = components;
  }

  refreshproductassociationrelatedchangesedit(){
    var association: ProductAssociationRelatedViewModel[] = [];
    this.productAssociationList.forEach(element => {
      association.push(element);
    });
    this.validateSave = true;
    this.productAssociationList = association;
  }
  
  refreshproductassociationchangesedit(){
    var components: ProductAssociationComponentViewModel[] = [];
    this.productComponentsList.forEach(element => {
      components.push(element);
    });
    this.validateSave = true;
    this.productComponentsList = components;
  }

  refreshproductassociationrelatedchanges(){
    var association: ProductAssociationRelatedViewModel[] = [];
    this.productAssociationList.forEach(element => {
      association.push(element);
    });
    this.validateSave = true;
    association.push(this._productAssociation);
    this.productAssociationList = association;
  }

  refreshproductderivateschanges(){
    var asso : ProductAssociationDerivateViewModel[] = [];
    this.validateSave = true;
    this.productDerivateList.forEach(element => {
      asso.push(element);
    });
    this.productDerivateList = asso;
  }

  removeAssociation(association: ProductAssociationRelatedViewModel){
    if (association.idProductAssoicationRelated <= 0) {
      this.productAssociationList = this.productAssociationList.filter(x => x.idProduct != association.idProduct);   
      if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
        this.validateSave = false;
      } 
    }else{
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar esta relación?',
        accept: () => {
          var productassociation = new ProductAssociationViewModel();
          productassociation.idProductAssociation = association.idProductAssoicationRelated;
          this.productAssociationService.deleteProductAssociation(productassociation).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.productAssociationList = this.productAssociationList.filter(x => x.idProduct != association.idProduct);
              if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
                this.validateSave = false;
              }
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al eliminar la asociación"});
            }
          },(error)=>{
            console.log(error);
          });
        },
        reject: (type) => {
        }
      })
    }
  }

  EditAssociation(association: ProductAssociationRelatedViewModel){
    this._productAssociation = association;
    this.showDialogNewAssociation = true;
  }

  removeDerivated(derivate: ProductAssociationDerivateViewModel){
    if (derivate.idProductAssociationDerivate <= 0) {
      this.productDerivateList = this.productDerivateList.filter(x => x.idProduct != derivate.idProduct);
      if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
        this.validateSave = false;
      }
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar este derivado?',
        accept: () => {
          var productassociation = new ProductAssociationViewModel();
          productassociation.idProductAssociation = derivate.idProductAssociationDerivate;
          this.productAssociationService.deleteProductAssociation(productassociation).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.productDerivateList = this.productDerivateList.filter(x => x.idProduct != derivate.idProduct);
              if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
                this.validateSave = false;
              }
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al eliminar la asociación"});
            }
          },(error)=>{
            console.log(error);
          });
          
        },
        reject: (type) => {
        }
      })
    }
    
  }

  removeComponent(component: ProductAssociationComponentViewModel){
    if (component.idProductAssociationComponent <= 0) {
      this.productComponentsList = this.productComponentsList.filter(x => x.idProduct != component.idProduct);
      if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
        this.validateSave = false;
      }
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar este componente?',
        accept: () => {
          var productassociation = new ProductAssociationViewModel();
          productassociation.idProductAssociation = component.idProductAssociationComponent;
          this.productAssociationService.deleteProductAssociation(productassociation).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.productComponentsList = this.productComponentsList.filter(x => x.idProduct != component.idProduct);
              if (this.productDerivateList.length == 0 && this.productComponentsList.length == 0 && this.productAssociationList.length == 0) {
                this.validateSave = false;
              }
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al eliminar la asociación"});
            }
          },(error)=>{
            console.log(error);
          });
        },
        reject: (type) => {
        }
      })
    }
    
  }

  EditComponent(component: ProductAssociationComponentViewModel){
    this._productComponent = component;
    this.showDialogNewAssociationComponent = true;
  }


  saveAssociation(){
    this.saving = true;
    var associationProductList: ProductAssociationViewModel[] = [];
    this.productComponentsList.forEach(component => {
      var association =  new ProductAssociationViewModel();
      association.idProductAssociation = component.idProductAssociationComponent;
      association.idChildProduct = component.idProduct;
      association.idProductAssociationType = 1;
      association.idFatherProduct = parseInt(this.idproduct.toString());
      association.idPartsType = component.partsType.id;
      association.amount = component.amount;
      association.active = component.idProductAssociationComponent <= 0 ? true : component.active;
      associationProductList.push(association);
    });
    this.productDerivateList.forEach(derivate => {
      var association =  new ProductAssociationViewModel();
      association.idProductAssociation = derivate.idProductAssociationDerivate;
      association.idChildProduct = derivate.idProduct;
      association.idProductAssociationType = 2;
      association.idFatherProduct = parseInt(this.idproduct.toString());
      association.idPartsType = 0;
      association.amount = 0;
      association.active = derivate.idProductAssociationDerivate <= 0 ? true : derivate.active;
      associationProductList.push(association);
    });
    this.productAssociationList.forEach(passociation => {
      var association =  new ProductAssociationViewModel();
      association.idProductAssociation = passociation.idProductAssoicationRelated;
      association.idChildProduct = passociation.idProduct;
      association.idProductAssociationType = passociation.relation.id;
      association.idFatherProduct = parseInt(this.idproduct.toString());
      association.idPartsType = 0;
      association.amount = 0;
      association.active = passociation.idProductAssoicationRelated <= 0 ? true : passociation.active;
      associationProductList.push(association);
    });
    this.productAssociationService.postProductAssociation(associationProductList)
      .subscribe((data)=>{
        if (data > 0) {
          this.searchProductAssoiciations();
          this.saving = false;
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        }else{
          this.saving = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar las asociaciones"});
        }
      },(error)=>{
        this.saving = false;
    });
  }

  newProductComponent(){
    let link:any[] = ['mpc/productgeneralsection', 0,this.idproduct,1];
    document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
  }

  newProductDerivate(){
    let link:any[] = ['mpc/productgeneralsection', 0,this.idproduct,2];
    document.location.href = link[0] + "/" + link[1] + "/" + link[2] + "/" + link[3];
  }

  ShowMoreProductFather(){
    this.showMore = false;
    this.productFatherList = this.productFatherListDB;
  }

  ShowLessProductFather(){
    this.productFatherList = [];
    if (this.productFatherListDB.length > 3) {
      this.showMore = true;
    }
    this.productFatherListDB.forEach(element => {
      
      if (this.productFatherList.length <3) {
        this.productFatherList.push(element);
      }
    });
  }
}
