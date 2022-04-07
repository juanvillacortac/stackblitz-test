import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Generalsection } from '../../shared/view-models/generalsection.viewmodel';
import { MenuProduct } from '../../shared/Utils/menu-product';
import { Product } from 'src/app/models/products/product';
import { StatusProduct } from '../../shared/Utils/status-product';
import { ProductFilter } from '../../shared/filters/product-filter';
import { ProductService } from '../../shared/services/productservice/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'menu-mpc',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  indmenu: number = 2;
  idproduct: number = 0;
  
  items: MenuItem[];
  change: number = 0;
  _product: Product = new Product();
  @Input("_statusproduct") _statusproduct: number = -1;
  completedata: number = 0;
  //_product: Product;
  @Output() productemit = new EventEmitter<Product>();
  mobile: boolean = false;
  permissionsIDs = {...Permissions};
  
  menuproduct: typeof MenuProduct = MenuProduct;

  constructor(private actRoute: ActivatedRoute,
    private _productservice: ProductService,
    private messageService: MessageService,
    private router: Router,
    public confirmationService: ConfirmationService,
    public userPermissions: UserPermissions) {
      this.ngOnInit();
      this.idproduct = this.actRoute.snapshot.params['id'];
      
      this.onLoadProduct();
     }

  ngOnInit(): void {
    if (window.screen.width >= 800) { // 768px portrait
      this.mobile = true;
    }
    this._product.status = new Status();
    this.onLoadItemMenu();
    
  }
  async onLoadProduct(){
    this._product = new Product();
    var filter = new ProductFilter();
    filter.productId = this.idproduct;
    this._productservice.getProductbyfilter(filter).subscribe((data: Product) => {
      if (data != null) {
        this._product = data;
        this._product.gtin = this._product.groupingGenerationBarId == 1 ? this._product.barcode : "";
        this._product.gtin2 = this._product.groupingGenerationBarId == 2 ? this._product.barcode : "";
        this.completedata = parseFloat(this._product.completeData.replace(".",","));
        this.productemit.emit(this._product);
        this.onLoadItemMenu();
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando el producto"});
    });
  }

  onLoadItemMenu(){
    this.items = [
   /*    {label: 'Dashboard', icon: 'pi pi-fw pi-th-large', disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Dashboard && this.change == 1) {
          this.Confirm(MenuProduct.Dashboard);
        }else{
          this.indmenu = MenuProduct.Dashboard;
        }
     }}, */
      {label: 'General', icon: 'pi pi-fw pi-bars',command: (event) => {
        if (this.indmenu != MenuProduct.General && this.change == 1) {
          this.Confirm(MenuProduct.General);
        }else{
          this.indmenu = MenuProduct.General;
        }
     }},
      {label: 'Complementario', icon: 'pi pi-fw pi-list',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Complementary && this.change == 1) {
          this.Confirm(MenuProduct.Complementary);
        }else{
          this.indmenu = MenuProduct.Complementary;
        }
     }},
      {label: 'Productos asociados', icon: 'pi pi-fw pi-clone',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Associated && this.change == 1) {
          this.Confirm(MenuProduct.Associated);
        }else{
          this.indmenu = MenuProduct.Associated;
        }
     }},
      {label: 'Datos logísticos', icon: 'pi pi-fw pi-check-square',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.LogisticData && this.change == 1) {
          this.Confirm(MenuProduct.LogisticData);
        }else{
          this.indmenu = MenuProduct.LogisticData;
        }
     }},
      {label: 'Atributos', icon: 'pi pi-fw pi-table',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Specifications && this.change == 1) {
          this.Confirm(MenuProduct.Specifications);
        }else{
          this.indmenu = MenuProduct.Specifications;
        }
     }},
      {label: 'Sucursales', icon: 'pi pi-fw pi-globe',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.BranchOffices && this.change == 1) {
          this.Confirm(MenuProduct.BranchOffices);
        }else{
          this.indmenu = MenuProduct.BranchOffices;
        }
     }},
      {label: 'Multimedia', icon: 'pi pi-fw pi-paperclip',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Multimedia && this.change == 1) {
          this.Confirm(MenuProduct.Multimedia);
        }else{
          this.indmenu = MenuProduct.Multimedia;
        }
     }},
      {label: 'Calidad', icon: 'pi pi-fw pi-exclamation-circle',disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Quality && this.change == 1) {
          this.Confirm(MenuProduct.Quality);
        }else{
          this.indmenu = MenuProduct.Quality;
        }
     }},
      {label: 'Publicaciones', icon: 'pi pi-fw pi-desktop', disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Publications && this.change == 1) {
          this.Confirm(MenuProduct.Publications);
        }else{
          this.indmenu = MenuProduct.Publications;
        }
     }},
      {label: 'Impuestos', icon: 'pi pi-fw pi-percentage', disabled: this.idproduct == 0 ? true : this._product.statusId == StatusProduct.Eraser || this._product.statusId == StatusProduct.Canceled ? true : false,command: (event) => {
        if (this.indmenu != MenuProduct.Taxes && this.change == 1) {
          this.Confirm(MenuProduct.Taxes);
        }else{
          this.indmenu = MenuProduct.Taxes;
        }
    }}
    ];
  }

  @HostListener("window:resize", [])
  onResize() {
    var width = window.innerWidth;
    this.mobile = window.innerWidth <= 800 ? false : true;
  }

  refreshchanges(){
    this.change = 1;
  }
  refreshproduct(numero){
    this.idproduct=numero;
    if (this.idproduct>0)
    {
      this.change = 0;
      console.log(this.idproduct.toString());
      this.onLoadProduct();
    }
    
  }

  clearchanges(){
    this.change = 0;
  }
  Confirm(menuind: number){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Al salir de la sección actual, todos los cambios pendientes por guardar serán eliminados.',
      accept: () => {
        this.change =0;
        this.indmenu = menuind;
      },
      reject: (type) => {
      }
    })
  }

  refreshcompleted(){
    this.onLoadProduct();
  }
}
