import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Product } from 'src/app/models/products/product';
import { ProductassociationService } from '../../shared/services/productassociationservice/productassociation.service';
import { ProductAssociationFilterViewModel } from '../../shared/filters/productassociationfilter';
import { ProductAssociationDerivateViewModel } from '../../shared/view-models/productassociationderivate.viewmodel';
import { ProductAssociationComponentViewModel } from '../../shared/view-models/productassociationcomponent.viewmodel';
import { ProductAssociationRelatedViewModel } from '../../shared/view-models/productassociationrelated.viewmodel';

@Component({
  selector: 'app-product-derivate-association-panel',
  templateUrl: './product-derivate-association-panel.component.html',
  styleUrls: ['./product-derivate-association-panel.component.scss']
})
export class ProductDerivateAssociationPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input() productDerivateList: ProductAssociationDerivateViewModel[] = [];
  @Input() productComponentsList: ProductAssociationComponentViewModel[] = [];
  @Input() productAssociationList: ProductAssociationRelatedViewModel[] = [];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() productDerivateListChange = new EventEmitter<ProductAssociationDerivateViewModel[]>();
  @Output("refreshproductassociationderivatechanges") refreshproductassociationderivatechanges = new EventEmitter();
  statusList: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
  ];
  displayedColumnsDerivate: ColumnD<ProductAssociationDerivateViewModel>[] =
  [
   {template: (data) => { return data.idProduct; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barCode; },field: 'barCode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.category.name; },field: 'category.name', header: 'Categoría', display: 'table-cell'},
  ];
  componentsFilters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel();
  productDerivatesList: ProductAssociationDerivateViewModel[] = [];
  
  selectedProductsDerivate: ProductAssociationDerivateViewModel[] = [];
  saving: boolean = false;
  
  constructor(private productAssociationService: ProductassociationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    
  }

  hideDialog(){
    this.showDialog = false;
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.productDerivatesList = [];
    this.selectedProductsDerivate = [];
    this.showDialogChange.emit(this.showDialog);
  }

  clearFilters(){
    this.componentsFilters = new ProductAssociationFilterViewModel();
    this.componentsFilters.name = "";
    this.componentsFilters.barCode = "";
  }

  searchProductsDerivates(){
    if (this.componentsFilters.name != "" || this.componentsFilters.barCode != "") {
      this.componentsFilters.idProduct = this.idproduct;
      this.productAssociationService.getProductAssociationDerivatesbyfilter(this.componentsFilters)
      .subscribe((data)=>{
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.productDerivatesList = data;
      },(error)=>{
        console.log(error);
      });
    }
  }

  AddProductDerivate(){
    this.saving = true;
    var exists: boolean = false;
    var existsComponent: boolean = false;
    var existsAssociation: boolean = false;
    var list: ProductAssociationDerivateViewModel[] = [];
    this.selectedProductsDerivate.forEach(product => {
      if (this.productDerivateList.filter(x => x.idProduct == product.idProduct).length == 0) {
        var p: ProductAssociationDerivateViewModel = {
          idProductAssociationDerivate: -1,
          idProduct: product.idProduct,
          name: product.name,
          barCode: product.barCode,
          category: product.category,
          createdByUser: product.createdByUser,
          updateByUser: product.updateByUser,
          active: true,
        }
        list.push(p);
      }else{
        exists = true;
      }
      if (this.productComponentsList.filter(x => x.idProduct == product.idProduct).length > 0) {
        existsComponent = true;
      }
      if (this.productAssociationList.filter(x => x.idProduct == product.idProduct).length > 0) {
        existsAssociation = true;
      }
    });
    if (!exists) {
      if (!existsComponent) {
        if (!existsAssociation) {
          var derivates: ProductAssociationDerivateViewModel[] = [];
          list.forEach(product => {
            var p: ProductAssociationDerivateViewModel = {
              idProductAssociationDerivate: -1,
              idProduct: product.idProduct,
              name: product.name,
              barCode: product.barCode,
              category: product.category,
              createdByUser: product.createdByUser,
              updateByUser: product.updateByUser,
              active: true,
            }
            derivates.push(p)
          });
          var productasso = this.productDerivateList;
          derivates.forEach(element => {
            productasso.push(element);
          });
          this.productDerivateList = productasso;
          this.productDerivatesList = [];
          this.selectedProductsDerivate = [];
          this.componentsFilters = new ProductAssociationFilterViewModel();
          this.saving = false;
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.productDerivateListChange.emit(this.productDerivateList);
          this.refreshproductassociationderivatechanges.emit();
        }else{
          this.saving = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Algunos de los productos seleccionados ya se encuentran asociados en la sección Relacionados"});
        }
      }else{
        this.saving = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Algunos de los productos seleccionados ya se encuentran asociados en la sección Componentes"});
      }
      
    }else{
      this.saving = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Seleccionó productos que ya se encuentran en la lista"});
    }
    
  }
}
