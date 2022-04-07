import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Packingtype } from 'src/app/models/masters-mpc/common/packingtype';
import { Packing } from 'src/app/models/products/packing';
import { ValidateProductActive } from 'src/app/models/products/validate-product-active';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { ProductcomFilter } from 'src/app/modules/products/shared/filters/productcom-filter';
import { ValidateProductActiveFilter } from 'src/app/modules/products/shared/filters/validate-product-active-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import * as  typenegotiation from '../../../shared/filters/enum-type-negotiation';



@Component({
  selector: 'purchase-order-product-panel',
  templateUrl: './purchase-order-product-panel.component.html',
  styleUrls: ['./purchase-order-product-panel.component.scss']
})
export class PurchaseOrderProductPanelComponent implements OnInit {

  @ViewChild('bar') bar: ElementRef;
  @Input("_product") _product: PurchaseOrderProduct;
  @Input("_idSupplier") _idSupplier: number=-1;
  @Input("_indConsignment") _indConsignment: number=-1;
  @Input("_purchaseOrderDetail") _purchaseOrderDetail: PurchaseOrderProduct[];
  @Input("showDialog") showDialog: boolean = true;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("onSubmit") onSubmit = new EventEmitter<{order:PurchaseOrderProduct, identifier: number}>();
  _validations: Validations = new Validations();
  filters:ProductcomFilter;
  filterpackaging:PackingFilter;
  catalogproduct:ListproductscomViewmodel[];
  identifierToEdit:number=-1
  submitted: boolean;
  packing:Packing;
  loading=false;
  packaginglist:any[] = [];
  packagingtypelist: any[] = [];
  validateActive:ValidateProductActive;
  typenegotiation: number[] = [];
  typenegotiationIDs = {...typenegotiation};
  idCompany:number=-1;
  idBranchoffice:number=-1;
  defectImage: DefeatImage=new DefeatImage()

  constructor( private _productservice: ProductService,private messageService: MessageService,    private _httpClient: HttpClient,
               private _commonservice: CommonService,private _packingservice:PackingService,private _branchproduct:ProductbranchofficeService) { }

   _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
     this.idCompany = this._Authservice.currentCompany;
     this.idBranchoffice=this._Authservice.currentOffice;
    
  }
 onshow(){
   this._product=new PurchaseOrderProduct();
   this.bar.nativeElement.focus();
 }
  handleChange(e) {
    var index = e.index;}
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._product=new PurchaseOrderProduct()
  }
  SearchProduct(bar: string, references:string)
  {
    if(bar!="" || references!="")
    {
      this.filters=new ProductcomFilter();
      this.filters.companyId=this.idCompany // se debe pasar la compañia logueada
      this.filters.barcode=bar;
      this.filters.internalRef=references;
      this.filters.active=1;
      this.filters.indHeavy=-1;
      this.filters.idTypePacking=-1;
      this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
        if (data.length > 0) 
        {
         if (data.length ==1)
         {      
           this.catalogproduct= data;
          if(this.catalogproduct[0].bar.length == bar.length)
          {
          if(this._purchaseOrderDetail.findIndex(x=>x.productId==this.catalogproduct[0].idProduct)==-1)
          {
          this.catalogproduct= data;
          this._product.productId = this.catalogproduct[0].idProduct;
          this._product.name = this.catalogproduct[0].name;
          this._product.internalReference=this.catalogproduct[0].reference;
          this._product.internalReferencesearch=this.catalogproduct[0].reference;
          this._product.category=this.catalogproduct[0].category;
          this._product.image=this.catalogproduct[0].image;
          this._product.indHeavy = this.catalogproduct[0].heavy;
          this._product.gtin=this.catalogproduct[0].bar; 
          this._product.gtinsearch=this.catalogproduct[0].bar; 
          this._product.packaging=this.catalogproduct[0].presentationPackage;
          this._product.unitmedition=this.catalogproduct[0].unitsPackage;
          this.load(this._product.productId);
          this._product.idPackagingType=this.catalogproduct[0].idpackagingtype;
          this._product.idPackaging=this.catalogproduct[0].idPackag;
          this._product.unitPerPackaging=this.catalogproduct[0].numberUnist;
           }
           else{
             this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este producto ya fue añadido a la órden" });
             this._product = new PurchaseOrderProduct();
            }
          } 
           else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
             this._product = new PurchaseOrderProduct();} 
           } else{
             this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
              this._product = new PurchaseOrderProduct();}           
         }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
          this._product = new PurchaseOrderProduct();
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el producto" });
      });
    }else
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe indicar la barra y/o referencia para buscar el producto" });
    } 
  }

  onPasteBar(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if(!(/^\d+$/.test(pastedText))) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La barra que intentó ingresar, no es válida." });
      return false;
     }
  }
  Calculatetotal(event)
  {
    if(event.value != "")
    {
      var quantity = event.value;
      if (quantity != null)
      { 
          this._product.totalUnits=this._product.unitPerPackaging*quantity;
          //this._product.price.baseCost=this._product.price.baseCostUnit*quantity;
          //this._product.price.convertionCost=this._product.price.convertionCostUnit*quantity;
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
  }

  Calculatecost(event)
  {
    if(event.value != "")
    { 
      var quantity = event.value;
      if (quantity != null)
              0
          //this._product.price.baseCost=this._product.packagingQuantity*quantity;
     // else
        //this._product.price.baseCost=0;   
    }
    else
    {
        event.value = this._product.indHeavy == true ? "0,0000" : "0";
        //this._product.price.baseCost=0;
    }
  }
  Calculatepackage(event)
  {
    if(event.value != "")
    {
      var quantity = event.value;
      if (quantity != null)
      {    
        if(quantity<this._product.unitPerPackaging)
        {
            this._product.packagingQuantity=0;
            this._product.totalUnits=0;
            quantity=0;
        }
        else
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

  changepackage(event)
  {  
    let filters: PackingFilter = new PackingFilter ();
    filters.active = 1;
    filters.productId=this._product.productId;
    filters.id=event.value;
    this._packingservice.getPackingbyfilter(filters) .subscribe((data) => {
    this.packing=data[0];
    this.filters=new ProductcomFilter();
    this.filters.companyId=this.idCompany // se debe pasar la compañia logueada
    this.filters.barcode= this.packing.barcode;
    this.filters.indHeavy=-1;
    this.filters.idTypePacking=-1;
    this._productservice.getProductsCompany(this.filters).subscribe((data: ListproductscomViewmodel[]) => {
      if (data.length > 0) {
        this.catalogproduct= data;
        this._product.productId = this.catalogproduct[0].idProduct;
        this._product.name = this.catalogproduct[0].name;
        this._product.internalReference=this.catalogproduct[0].reference;
        this._product.internalReferencesearch=this.catalogproduct[0].reference;
        this._product.category=this.catalogproduct[0].category;
        this._product.image=this.catalogproduct[0].image;
        this._product.indHeavy = this.catalogproduct[0].heavy;
        this._product.gtin=this.catalogproduct[0].bar; 
        this._product.gtinsearch=this.catalogproduct[0].bar; 
        this._product.packaging=this.catalogproduct[0].presentationPackage;
        this._product.unitmedition=this.catalogproduct[0].unitsPackage;
        this.load(this._product.productId);
        this._product.idPackagingType=this.catalogproduct[0].idpackagingtype;
        this._product.idPackaging=this.catalogproduct[0].idPackag;
        this._product.unitPerPackaging=this.catalogproduct[0].numberUnist;
        this._product.totalUnits=this._product.unitPerPackaging*this._product.packagingQuantity;
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
  load(id:number)
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
  submit()
    {
       this.submitted=true;
       if(this._product.productId >0 && this._product.packagingQuantity >0)
       { 
           if(this._purchaseOrderDetail.findIndex(x=>x.productId==this._product.productId)==-1)
           {
            var filter: ValidateProductActiveFilter = new ValidateProductActiveFilter();
            filter.idProduct=this._product.productId;
            filter.idPacking=this._product.idPackaging;
            filter.idBranchOffice=this.idBranchoffice//se estapasado la sucucrsal 1 por defecto
            this._branchproduct.getvalidateProductActive(filter)
            .subscribe((data) => {
                 this.validateActive=data[0];
                 this._product.indconsigment=this.validateActive.indConsignment;
                 this._product.status=this.validateActive.active;
                 if(this._product.status==0)
                    this.messageService.add({key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "El producto no se encuentra activo en la sucursal." });

                 if(this._product.indconsigment==0 && this._indConsignment==this.typenegotiationIDs.consignment_ID)
                    this.messageService.add({key:"msgwarn", severity: 'warn', summary: 'Advertencia', detail: "El producto no posee el indicador de consignación." });
                 if(this._product.status==2)
                 {
                    this.messageService.add({ key:"msgwarn",severity: 'warn', summary: 'Advertencia', detail: "El producto se encuentra desincorporado en la sucursal." });
                    this._product=new PurchaseOrderProduct();
                 }

                 if(this._product.status!=2) //si es diferente de desincorporado
                 {
                    this.onSubmit.emit({
                      order: this._product,
                      identifier: this.identifierToEdit});
                      this.submitted=false;
                      this._product=new PurchaseOrderProduct();
                      this.bar.nativeElement.focus();
                    }

              }, (error) => {
                    //console.log(error);
              });

           }
           else
             this.messageService.add({ key:"msgwarn",severity: 'error', summary: 'Error', detail: "Este producto ya fue añadido a la órden" });
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
  clearcost(event){
      if (event.target.value == "0,0000") {
        event.target.value =0;
      }
      if (event.target.value == "") {
        event.target.value =0;
      }
    }
    clearmodel(){
       this.submitted=false;
       this._product=new PurchaseOrderProduct()
       this.bar.nativeElement.focus();
    }
}
