import { DecimalPipe, NumberFormatStyle } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { id } from 'date-fns/locale';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { Totalselected } from 'src/app/models/srm/totalselected';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BarFilter } from '../../../shared/filters/bar-filter';
import { ProductxsupplierFilter } from '../../../shared/filters/productxsupplier-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { ListproductsViewmodel } from '../../../shared/view-models/listproducts-viewmodel';
import { SupplierempViewmodel } from '../../../shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-wizardsupplierproducts',
  templateUrl: './wizardsupplierproducts.component.html',
  styleUrls: ['./wizardsupplierproducts.component.scss'],
  providers: [DecimalPipe]
})
export class WizardsupplierproductsComponent implements OnInit {
  @Input("suppliers") suppliers: string = "";
  @Input("selectedSuppliersList") selectedSuppliersList: any[] = [];
  @Input("selectedProducts") selectedProducts: ListproductscomViewmodel[] = [];
  @Input("selectedProdxSuppliersTemp") selectedProdxSuppliersTemp: Productsxsupplier[] = [];
  @Output("selectedProdxSuppliersTempChange") selectedProdxSuppliersTempChange = new EventEmitter<Productsxsupplier[]>();

  //Temporales editados 
  @Input("ProdxSuppliersEditTemp") ProdxSuppliersEditTemp: Productsxsupplier[] = [];
  @Output("ProdxSuppliersEditTempChange") ProdxSuppliersEditTempChange = new EventEmitter<Productsxsupplier[]>();

  proveedores: SupplierempViewmodel = new SupplierempViewmodel();
  productsprov: ListproductsViewmodel[] = [];
  listselectedProduc: Totalselected[] = [];
  clonedProducts: { [s: string]: Productsxsupplier; } = {};
  @ViewChild('dt',{static:false})dt:any
  index: string = "packingxproduct";

  productsxsuppliers: Productsxsupplier[] = [];
  supplierxproduct: Productsxsupplier[] = []
  packagestring: string = "";
  suppliersstring: string = "";
  indAdd: boolean = false
  exchangeRate: number = 0;
  idsup: number = 0;
  selectedProductsSuppliers: Productsxsupplier[] = [];
  //temporal selected 
  selectedProductsSuppliersTempChecked: Productsxsupplier[] = [];
  indtemporalesEditados: Productsxsupplier[] = [];

  constructor(public _suppliercatalogservice: SuppliercatalogService,
    private message: MessageService,
    public userPermissions: UserPermissions,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private exchangeRatesService: ExchangeRatesService) { }

  ngOnInit(): void {
    if (this.selectedProducts.length > 0) {
      this.checkpackage();
      this.checksuppliers();
    }

    this.SearchPackages();
    this.searchExchangeRates();

  }
  Changedatekey(ind: string) {

    this.index = ind;

  }
  checkpackage() {
    let cont = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      cont += 1;
      this.packagestring = this.packagestring == "" ? this.selectedProducts[i].idPackag.toString() : this.packagestring + "," + this.selectedProducts[i].idPackag.toString();
    }
  }

  checksuppliers() {
    let cont = 0;
    for (let i = 0; i < this.selectedSuppliersList.length; i++) {
      cont += 1;
      this.suppliersstring = this.suppliersstring == "" ? this.selectedSuppliersList[i].id.toString() : this.suppliersstring + "," + this.selectedSuppliersList[i].id.toString();
    }
    if (this.selectedProdxSuppliersTemp.length > 0) {

      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = this.selectedProdxSuppliersTemp.filter(x => x.suppliers.id == this.selectedSuppliersList[i].id).length;
      }

      //  if(this.selectedSuppliersList.find(x=>x.id==this.selectedSuppliersList[event.index].id).totalselected== this.selectedProductsSuppliersTempChecked.filter()){
      //       this.idsup=this.selectedSuppliersList[event.index].id;
      // }
    } else {
      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = 0;
      }
    }
    if(this.ProdxSuppliersEditTemp.length>0){
        this.indtemporalesEditados= this.ProdxSuppliersEditTemp;
    }
  }
  SearchPackages() {
    var filter: ProductxsupplierFilter = new ProductxsupplierFilter();
    filter.idComp = 1;
    filter.idSuppliers = this.suppliersstring;
    filter.idPackaging = this.packagestring;
    this._suppliercatalogservice.getPackagingAssociatesxSuppliers(filter).subscribe((data: Productsxsupplier[]) => {
      if (data != null) {
        this._suppliercatalogservice._PackagingAssociatesxSuppliersList = data;
      } else {
        this.message.add({ severity: 'error', summary: 'Consulta', detail: "Obtener empaques asociados." });
      }
    }, (error: HttpErrorResponse) => {

      this.message.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  CheckProdsuppliers(idsupplier: number) {

    if (this.selectedProductsSuppliersTempChecked.length > 0) {
      this.selectedProductsSuppliersTempChecked = this.selectedProductsSuppliersTempChecked.filter(x => x.suppliers.id != idsupplier);
    }

    if (this.selectedProductsSuppliers.length > 0) {
      let cont = 0;
      for (let i = 0; i < this.selectedProductsSuppliers.length; i++) {
        cont += 1;
        this.selectedProductsSuppliersTempChecked.push(this.selectedProductsSuppliers[i]);
        console.log("Nuevos");
        console.log(this.selectedProductsSuppliersTempChecked);
      }
    }

    let cont = 0;
    if (this.selectedProductsSuppliersTempChecked.length > 0) {

      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = this.selectedProductsSuppliersTempChecked.filter(x => x.suppliers.id == this.selectedSuppliersList[i].id).length;
      }

    } else {
      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = 0;
      }
    }

    this.selectedProdxSuppliersTempChange.emit(this.selectedProductsSuppliersTempChecked);
  }
  searchProductsAdd(id: number) {
    this.productsxsuppliers = [];
    this.listselectedProduc = [];
    this.selectedProductsSuppliers = []; //Linea nueva
    this.supplierxproduct = this._suppliercatalogservice._PackagingAssociatesxSuppliersList.filter(x => x.suppliers.id == id);
    if (this.supplierxproduct.length > 0) {
      this.selectedProducts.forEach(products => {
        var a = new Productsxsupplier();
        this.indAdd = this.supplierxproduct.find(x => x.packing.idPacking == products.idPackag) ? true : false;
        if (!this.indAdd) {
          this.addlist(a, products, id);
        }
      });
    } else {
      this.selectedProducts.forEach(products => {
        var a = new Productsxsupplier();
        if (products.idPackag != -1) {
          this.addlist(a, products, id);
        }

      });
    }
    //nueva linea 
    // if(this.ProdxSuppliersEditTemp.length>0){
    //     this.productsxsuppliers.forEach(products => {
    //       this.ProdxSuppliersEditTemp.filter(x=> x.packing.idPacking == products.packing.idPacking)
    //     })
    // }
    //document temporalmente
    //   if(this.selectedProdxSuppliersTemp.length>0){
    //     this.selectedProductsSuppliers=  this.selectedProdxSuppliersTemp;
    // }

    if (this.selectedProdxSuppliersTemp.length > 0) {
      this.selectedProductsSuppliersTempChecked = this.selectedProdxSuppliersTemp;
    }
    if (this.selectedProdxSuppliersTemp.length > 0) {
      this.selectedProductsSuppliers = this.selectedProdxSuppliersTemp.filter(x => x.suppliers.id == id);
    }

     


  }

  addlist(supplierxproduct: Productsxsupplier, products: ListproductscomViewmodel, id: number) {
  //   if(this.dt !=undefined){
  //     this.dt.first=0;
  //     this.dt.sortField="";
  // }
    supplierxproduct.packing.idPacking = products.idPackag;
    supplierxproduct.suppliers.id = id;
    supplierxproduct.products.idProduct = products.idProduct;
    supplierxproduct.products.name = products.name;
    supplierxproduct.products.heavy = products.heavy;
    supplierxproduct.packing.presentacionPackaging = products.presentationPackage;
    supplierxproduct.packing.numberUnist = products.numberUnist;
    supplierxproduct.packing.bar = products.bar;
    supplierxproduct.category = products.category;
    supplierxproduct.packing.typePacking = products.typackaging;
    supplierxproduct.packingxproduct = supplierxproduct.suppliers.id.toString() + products.idProduct.toString() + products.idPackag.toString();
    supplierxproduct.baseCost=supplierxproduct.baseCost== null ? 0 : supplierxproduct.baseCost;
    supplierxproduct.conversionCost= supplierxproduct.conversionCost== null ? 0 : supplierxproduct.conversionCost;
    supplierxproduct.available= supplierxproduct.available== null ? 0: supplierxproduct.available;
    if (this.selectedProductsSuppliers.length > 0) {
      var found = this.selectedProductsSuppliers.find(x => x.packingxproduct == supplierxproduct.packingxproduct) ? true : false;
      if (found)
        supplierxproduct = this.selectedProductsSuppliers.find(x => x.packingxproduct == supplierxproduct.packingxproduct)
    }
    if (this.selectedProdxSuppliersTemp.length > 0) {
      var temp = this.selectedProdxSuppliersTemp.find(x => x.packingxproduct == supplierxproduct.packingxproduct) ? true : false;
      if (temp) {
        supplierxproduct = this.selectedProdxSuppliersTemp.find(x => x.packingxproduct == supplierxproduct.packingxproduct);
      }
    }
    //nueva linea
    // if(this.indtemporalesEditados.length>0){
    //   var edit = this.indtemporalesEditados.find(x => x.packingxproduct == supplierxproduct.packingxproduct) ? true : false;
    //   if (edit) {
    //     supplierxproduct = this.indtemporalesEditados.find(x => x.packingxproduct == supplierxproduct.packingxproduct);
    //   }
    // }
    //nueva linea
    if(this.ProdxSuppliersEditTemp.length>0){
      var temedit = this.ProdxSuppliersEditTemp.find(x => x.packingxproduct == supplierxproduct.packingxproduct) ? true : false;
      if (temedit) {
        supplierxproduct = this.ProdxSuppliersEditTemp.find(x => x.packingxproduct == supplierxproduct.packingxproduct);
      }
    }
    
    
    this.productsxsuppliers.push(supplierxproduct);
   
    console.log(this.productsxsuppliers);
  }

  onTabClose(event) {
    let cont = 0;
    if (this.selectedProductsSuppliersTempChecked.length > 0) {

      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = this.selectedProductsSuppliersTempChecked.filter(x => x.suppliers.id == this.selectedSuppliersList[i].id).length;
      }

      //  if(this.selectedSuppliersList.find(x=>x.id==this.selectedSuppliersList[event.index].id).totalselected== this.selectedProductsSuppliersTempChecked.filter()){
      //       this.idsup=this.selectedSuppliersList[event.index].id;
      // }
    } else {
      for (let i = 0; i < this.selectedSuppliersList.length; i++) {
        cont += 1;
        this.selectedSuppliersList[i].totalselected = 0;
      }
    }
    //event.stopPropagation();
  }

  onTabOpen(event) {
    if(this.dt !=undefined){
       this.dt.reset();
    }
         //this.dt.field="";
    //event.stopPropagation();
    this.searchProductsAdd(this.selectedSuppliersList[event.index].id);
  }

  //Eventos para manejar la tabla edittable
  onRowEditInit(product: Productsxsupplier) {
    this.clonedProducts[product.packingxproduct] = { ...product };
  }

  onRowEditSave(product: Productsxsupplier) {
    //nueva linea
    if(this.indtemporalesEditados.length>0){
        var find=this.indtemporalesEditados.filter(x=>x.packingxproduct == product.packingxproduct);
         if(find.length>0){
             this.indtemporalesEditados= this.indtemporalesEditados.filter(x=>x.packingxproduct != product.packingxproduct);
         }
      }
    this.indtemporalesEditados.push(product);
    this.ProdxSuppliersEditTempChange.emit(this.indtemporalesEditados);
    delete this.clonedProducts[product.packingxproduct];
  }

  onRowEditCancel(product: Productsxsupplier, index: number) {
    this.productsxsuppliers[index] = this.clonedProducts[product.packingxproduct];
    delete this.productsxsuppliers[product.packingxproduct];
  }

  searchExchangeRates() {
    var filter = new ExchangeRatesFilter();
    filter.idExchangeRateType = 1;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRate = data[0].conversionFactor;
    }, (error: HttpErrorResponse) => {
      this.message.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }
  calculateconv(value: string, product: Productsxsupplier) {
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi, "");
    value = value.replace(",", ".");
    if (value != "0" && parseFloat(this.exchangeRate.toString()) > 0) {
      product.conversionCost = parseFloat(value) / parseFloat(this.exchangeRate.toString());
    }
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }
}
