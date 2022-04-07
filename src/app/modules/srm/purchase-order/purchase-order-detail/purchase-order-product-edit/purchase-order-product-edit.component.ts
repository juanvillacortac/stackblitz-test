import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Packing } from 'src/app/models/products/packing';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { Resumeordertotal } from 'src/app/models/srm/resumeordertotal';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { ProductcomFilter } from 'src/app/modules/products/shared/filters/productcom-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';

@Component({
  selector: 'app-purchase-order-product-edit',
  templateUrl: './purchase-order-product-edit.component.html',
  styleUrls: ['./purchase-order-product-edit.component.scss']
})
export class PurchaseOrderProductEditComponent implements OnInit {

  @Input("_product") _product: PurchaseOrderProduct;
  @Input("_productcopy") _productcopy: PurchaseOrderProduct;
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Input('show') show:boolean=true;
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
  @Output("change") change = new EventEmitter<{detail:PurchaseOrderProduct,value:number,diferences:number}>();
  @Output("clickNext") clickNext = new EventEmitter<boolean>();
  submitted: boolean;
  loading=false;
  packaginglist:any[] = [];
  filters:ProductcomFilter;
  packing:Packing;
  catalogproduct:ListproductscomViewmodel[];
  packagingtypelist: any[] = [];
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  iduserlogin:number=-1;
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  isdisabled=true;
  defectImage: DefeatImage=new DefeatImage()

  constructor(private _packingservice:PackingService,private messageService: MessageService,private _httpClient: HttpClient,
              private _productservice: ProductService,private _commonservice: CommonService,public userPermissions: UserPermissions) { }
              _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void
  { 
    this.load();
    this.iduserlogin = this._Authservice.storeUser.id;
  }
  ngAfterViewInit () : void{
    this.load();
  }

  load()
  {    
      this.iduserlogin = this._Authservice.storeUser.id;
      let filters: PackingFilter = new PackingFilter ();
      filters.active = 1;
      filters.productId=this._product.productId;
      filters.id=this._product.idPackaging;
      this._packingservice.getPackingbyfilter(filters)
        .subscribe((data) => {
          data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
          this.packaginglist= data.map((item) => ({
            label: item.packingType.name+'-'+ item.packagingPresentation.name,
            value: item.id
          }));
        }, (error) => {
          console.log(error);
        });
       
  }
  onPasteBar(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if(!(/^\d+$/.test(pastedText))) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La barra que intentó ingresar, no es válida." });
      return false;
     }
  }

  changepackage(event)
  {  
    let filters: PackingFilter = new PackingFilter ();
    filters.active = 1;
    filters.productId=this._product.productId;
    filters.id=event.value;
    this._packingservice.getPackingbyfilter(filters) .subscribe((data) => {
    this.packing=data[0];
    this.filters=new ProductcomFilter();
    this.filters.companyId=1 // se debe pasar la compañia logueada
    this.filters.barcode= this.packing.barcode;
    this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
      if (data.length > 0) {
        this.catalogproduct= data;
        this._product.productId = this.catalogproduct[0].idProduct;
        this._product.name = this.catalogproduct[0].name;
        this._product.internalReference=this.catalogproduct[0].reference;
        this._product.category=this.catalogproduct[0].category;
        this._product.image=this.catalogproduct[0].image;
        this._product.indHeavy = this.catalogproduct[0].heavy;
        this._product.gtin=this.catalogproduct[0].bar; 
        this._product.packaging=this.catalogproduct[0].presentationPackage;
        this._product.unitmedition=this.catalogproduct[0].unitsPackage;
        this.loader(this._product.productId);
        this._product.idPackagingType=this.catalogproduct[0].idpackagingtype;
        this._product.idPackaging=this.catalogproduct[0].idPackag;
        this._product.unitPerPackaging=this.catalogproduct[0].numberUnist;
        this._product.totalUnits=this._product.unitPerPackaging*this._product.packagingQuantity;
        for(let i = 0; i < this._product.prices.filter(x=> x.indAdded).length; i++)
        {
           this._product.prices[i].idPacking= this._product.idPackaging; 
           this._product.prices[i].bar= this._product.gtin;
           this._product.prices[i].idPackingType =this._product.idPackaging;
           this._product.prices[i].unitsNumberPacking=this._product.unitPerPackaging
           this._product.prices[i].packingNumbers=this._product.packagingQuantity;
           this._product.prices[i].totalUnits=this._product.totalUnits;
           this._product.prices[i].productId=this._product.productId;
        }
        if(this._product.individualPrices.indAdded==1) 
            this._product.individualPrices.packingNumbers=this._product.packagingQuantity;
        else
           this._product.masterPrices.packingNumbers=this._product.packagingQuantity;

        //this._product.price.baseCost=this._product.price.baseCostUnit*this._product.packagingQuantity; 
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
        this._product = new PurchaseOrderProduct();
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el producto" });
    });
        }, (error) => {
          console.log(error);
    });
    
  }
  loader(id:number)
  { 
    var filter: PackingtypeFilter = new PackingtypeFilter();
    filter.active= 1;
    this._commonservice.getPackingTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.packagingtypelist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

      let filters: PackingFilter = new PackingFilter ();
      filters.active = 1;
      filters.productId=id;
      this._packingservice.getPackingbyfilter(filters)
        .subscribe((data) => {
          data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
          this.packaginglist= data.map((item) => ({
            label: item.packingType.name+'-'+ item.packagingPresentation.name,
            value: item.id
          }));
        }, (error) => {
          console.log(error);
        });
       
     }

  Calculatetotal(event)
  {
    if(event.value != "")
    {
      var quantity = event.value;
      if (quantity != null)
      { 
          this.isSave=false;
          this._product.packagingQuantity=quantity;
          this._product.totalUnits=this._product.unitPerPackaging*quantity;
          //this._product.price.baseCost=this._product.price.baseCostUnit*quantity;
          //this._product.price.convertionCost=this._product.price.convertionCostUnit*quantity;
          for(let i = 0; i < this._product.prices.filter(x=> x.indAdded).length; i++)
          {
             this._product.prices[i].idPacking= this._product.idPackaging; 
             this._product.prices[i].bar= this._product.gtin;
             this._product.prices[i].idPackingType =this._product.idPackagingType;
             this._product.prices[i].unitsNumberPacking=this._product.unitPerPackaging
             this._product.prices[i].packingNumbers=this._product.packagingQuantity;
             this._product.prices[i].totalUnits=this._product.totalUnits;
             this._product.prices[i].productId=this._product.productId;
  
          } 
          if(this._product.individualPrices.indAdded==1) 
            this._product.individualPrices.packingNumbers=this._product.packagingQuantity;
          else
              this._product.masterPrices.packingNumbers=this._product.packagingQuantity;
          this.isSaveChange.emit(this.isSave);     
      }
      else
      {
        this._product.totalUnits=0;
        //this._product.price.baseCost=0;
        //this._product.price.convertionCost=0;
      }
    }else
    {
        event.value = this._product.indHeavy == true ? "0,000" : "0";
        this._product.totalUnits=0;
        //this._product.price.baseCost=0;
        //this._product.price.convertionCost=0; 
    }
      if(this._product.packagingQuantity >0 && this._productcopy.packagingQuantity==0 )
             this.change.emit(
               {detail:this._product,
                value:1 ,
                diferences:this._product.packagingQuantity-this._productcopy.packagingQuantity});       
      else if(this._productcopy.packagingQuantity>0 && this._product.packagingQuantity==0 )
          this.change.emit({detail: this._product,
                           value:-1,
                           diferences:this._product.packagingQuantity-this._productcopy.packagingQuantity }); 
      else 
          this.change.emit({detail: this._product,value:0,diferences:this._product.packagingQuantity-this._productcopy.packagingQuantity});   
  }

  Calculatepackage(event)
  {
    if(event.value != "")
    {
      var quantity = event.value;
      if (quantity != null)
      {    

          this._product.packagingQuantity=quantity/this._product.unitPerPackaging;
          //this._product.price.baseCost=this._product.price.baseCostUnit*this._product.packagingQuantity;
          //this._product.price.convertionCost=this._product.price.convertionCostUnit*this._product.packagingQuantity;
      }
      else{
       this._product.packagingQuantity=0;
       //this._product.price.baseCost=0;
       //this._product.price.convertionCost=0;
        }
    }else
    {
        event.value =  this._product.indHeavy == true ? "0,000" : "0";
        this._product.packagingQuantity=0;
        //this._product.price.baseCost=0;
        //this._product.price.convertionCost=0;  
    }
  }
  Calculatecost(event)
  {
    if(event.value != "")
    { 
      var quantity = event.value;
      if (quantity != null)
           0
          //this._product.price.baseCost=this._product.packagingQuantity*quantity;
      //else
       // this._product.price.baseCost=0;   
    }
    else
    {
        event.value = this._product.indHeavy == true ? "0,0000" : "0";
        //this._product.price.baseCost=0;
    }
  }
  clear(event){
    if (event.target.value == "0,000") {
        event.target.value =0;
    }
    if (event.target.value == "") {
      event.target.value =0;
    }
  }

  clickNextToPrice(event)
  {
    this.clickNext.emit();
  }
}
