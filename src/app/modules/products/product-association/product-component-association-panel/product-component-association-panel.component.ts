import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { Typeofparts } from 'src/app/models/masters-mpc/typeofparts';
import { Product } from 'src/app/models/products/product';
import { TypeofpartsFilter } from 'src/app/modules/masters-mpc/shared/filters/typeofparts-filter';
import { TypeofpartsService } from 'src/app/modules/masters-mpc/shared/services/TypeofPartsService/typeofparts.service';
import { ProductassociationService } from '../../shared/services/productassociationservice/productassociation.service';
import { ProductAssociationFilterViewModel } from '../../shared/filters/productassociationfilter';
import { ProductAssociationComponentViewModel } from '../../shared/view-models/productassociationcomponent.viewmodel';
import { ProductAssociationDerivateViewModel } from '../../shared/view-models/productassociationderivate.viewmodel';
import { ProductAssociationRelatedViewModel } from '../../shared/view-models/productassociationrelated.viewmodel';

@Component({
  selector: 'app-product-component-association-panel',
  templateUrl: './product-component-association-panel.component.html',
  styleUrls: ['./product-component-association-panel.component.scss']
})
export class ProductComponentAssociationPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("_productComponent") _productComponent : ProductAssociationComponentViewModel;
  @Input("_productComponentsList") _productComponentsList: ProductAssociationComponentViewModel[] = [];
  @Input("productDerivateList") productDerivateList: ProductAssociationDerivateViewModel[] = [];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() _productComponentChange = new EventEmitter<ProductAssociationComponentViewModel>();
  @Output("refreshproductassociationchanges") refreshproductassociationchanges = new EventEmitter();
  @Input() productAssociationList: ProductAssociationRelatedViewModel[] = [];
  statusList: SelectItem[] = [
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  displayedColumnsComponents: ColumnD<ProductAssociationComponentViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'idProduct',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
  ];
  componentsFilters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel();
  productComponentsList: ProductAssociationComponentViewModel[] = [];
  showDialogNewAssociationComponent:boolean = false;
  PartsTypeList: SelectItem[];
  
  constructor(private productAssociationService: ProductassociationService,
    private typeofpartsservice: TypeofpartsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._productComponent = new ProductAssociationComponentViewModel();
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.productComponentsList = [];
  }

  hideDialog(){
    this.showDialog = false;
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.productComponentsList = [];
    this.showDialogChange.emit(this.showDialog);
  }

  clearFilters(){
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.componentsFilters.name = "";
    this.componentsFilters.barCode = "";
  }

  searchProductsComponents(){
    if (this.componentsFilters.name != "" || this.componentsFilters.barCode != "") {
      this.componentsFilters.idProduct = this.idproduct;
      this.productAssociationService.getProductAssociationComponentsbyfilter(this.componentsFilters)
      .subscribe((data)=>{
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        console.log(data);
        this.productComponentsList = data;
      },(error)=>{
        console.log(error);
      });
    }
    
  }

  selectedProduct(productComponent: ProductAssociationComponentViewModel){
      if (this._productComponentsList.filter(x => x.idProduct == productComponent.idProduct).length == 0) {
        if (this.productDerivateList.filter(x => x.idProduct == productComponent.idProduct).length == 0) {
          if (this.productAssociationList.filter(x => x.idProduct == productComponent.idProduct).length == 0) {
            this._productComponent = new ProductAssociationComponentViewModel();
            this._productComponent.idProduct = productComponent.idProduct;
            this._productComponent.name = productComponent.name;
            this._productComponent.barCode = productComponent.barCode;
            this._productComponent.category = new Category();
            this._productComponent.category.id = productComponent.category.id;
            this._productComponent.category.name = productComponent.category.name;
            this.showDialogNewAssociationComponent = true;
          }else{
            this.messageService.add({severity:'error', summary:'Error', detail: "Este producto se encuentra asociado en la sección Relacionados"});
          }
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Este producto se encuentra asociado en la sección Derivados"});
        }
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Este producto ya se encuentra en la lista"});
      }
  }

  addproductcomponent(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this._productComponent.active = true;
    this._productComponentChange.emit(this._productComponent);
    this.refreshproductassociationchanges.emit();
  }

  searchPartTypes(){
    var filters = new TypeofpartsFilter();
    filters.active = 1;
    this.typeofpartsservice.getTypeofpartsbyfilter(filters).subscribe((data: Typeofparts[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.PartsTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipo de partes"});
    });
  }
}
