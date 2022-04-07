import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { Productassociation } from 'src/app/models/masters-mpc/productassociation';
import { Product } from 'src/app/models/products/product';
import { ProductassociationService } from '../../shared/services/productassociationservice/productassociation.service';
import { ProductAssociationFilterViewModel } from '../../shared/filters/productassociationfilter';
import { ProductAssociationComponentViewModel } from '../../shared/view-models/productassociationcomponent.viewmodel';
import { ProductAssociationDerivateViewModel } from '../../shared/view-models/productassociationderivate.viewmodel';
import { ProductAssociationRelatedViewModel } from '../../shared/view-models/productassociationrelated.viewmodel';

@Component({
  selector: 'app-product-related-association-panel',
  templateUrl: './product-related-association-panel.component.html',
  styleUrls: ['./product-related-association-panel.component.scss']
})
export class ProductRelatedAssociationPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("_productAssociation") _productAssociation: ProductAssociationRelatedViewModel;
  @Input("_productAssociationList") _productAssociationList: ProductAssociationRelatedViewModel[] = [];
  @Input("productComponentsList") productComponentsList: ProductAssociationComponentViewModel[] = [];
  @Input("productDerivateList") productDerivateList: ProductAssociationDerivateViewModel[] = [];
  productAssociationList: ProductAssociationRelatedViewModel[] = [];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() _productAssociationChange = new EventEmitter<ProductAssociationRelatedViewModel>();
  @Output() refreshproductassociationrelatedchanges = new EventEmitter();
  statusList: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  displayedColumnsRelated: ColumnD<ProductAssociationRelatedViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
  ];
  componentsFilters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel();
  showDialogNewAssociationComponent: boolean = false;
  
  constructor(private productAssociationService: ProductassociationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._productAssociation = new ProductAssociationRelatedViewModel();
  }

  hideDialog(){
    this.showDialog = false;
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.productAssociationList = [];
    this.showDialogChange.emit(this.showDialog);
  }

  clearFilters(){
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.componentsFilters.name = "";
    this.componentsFilters.barCode = "";
  }

  SearchProductRelated(){
    if (this.componentsFilters.name != "" || this.componentsFilters.barCode != "") {
      this.componentsFilters.idProduct = this.idproduct;
      this.productAssociationService.getProductAssociationComponentsbyfilter(this.componentsFilters)
      .subscribe((data)=>{
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        var association : ProductAssociationRelatedViewModel[] =[];
        data.forEach(element => {
          var category: Category = new Category();
          category.id = element.category.id;
          category.name = element.category.name;
          var product: ProductAssociationRelatedViewModel = {
            idProductAssoicationRelated: element.idProductAssociationComponent,
            idProduct: element.idProduct,
            name: element.name,
            barCode: element.barCode,
            category: category,
            createdByUser: "",
            updateByUser: "",
            relation: new Productassociation(),
            active: false,
          }
          association.push(product);
        });
        this.productAssociationList = association;
      },(error)=>{
        console.log(error);
      });
    }
  }

  selectedProduct(productAssociation: ProductAssociationRelatedViewModel){
    if (this._productAssociationList.filter(x => x.idProduct == productAssociation.idProduct).length == 0) {
      if (this.productComponentsList.filter(x => x.idProduct == productAssociation.idProduct).length == 0) {
        if (this.productDerivateList.filter(x => x.idProduct == productAssociation.idProduct).length == 0) {
          this._productAssociation = new ProductAssociationRelatedViewModel();
          this._productAssociation.idProduct = productAssociation.idProduct;
          this._productAssociation.name = productAssociation.name;
          this._productAssociation.barCode = productAssociation.barCode;
          this._productAssociation.category = new Category();
          this._productAssociation.category.id = productAssociation.category.id;
          this._productAssociation.category.name = productAssociation.category.name;
          this.showDialogNewAssociationComponent = true;productAssociation
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Este producto se encuentra asociado en la sección Derivados"});
        }
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Este producto se encuentra asociado en la sección Componentes"});
      }
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Este producto ya se encuentra en la lista"});
    }
    
  }

  addproductassociation(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this._productAssociationChange.emit(this._productAssociation);
    this.refreshproductassociationrelatedchanges.emit();
  }
}
