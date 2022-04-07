import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { PackagingpresentationFilter } from 'src/app/modules/masters-mpc/shared/filters/packagingpresentation-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PackagingpresentationService } from 'src/app/modules/masters-mpc/shared/services/PackagingPresentationService/packagingpresentation.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BarFilter } from '../../../shared/filters/bar-filter';
import { SuppliercatalogFilter } from '../../../shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';

@Component({
  selector: 'addacquaintance-dialog',
  templateUrl: './addacquaintance-dialog.component.html',
  styleUrls: ['./addacquaintance-dialog.component.scss']
})
export class AddacquaintanceDialogComponent implements OnInit {

  @Input("showDialogadd") showDialogadd : boolean = false;
 
  @Input("filters") filters: SuppliercatalogFilter;
  @Input("_supplierxprod") _supplierxprod: SupplierCatalog;
  @Input("suppliername") suppliername: string="";
  @Input("supplierxprod") supplierxprod : Productsxsupplier = new Productsxsupplier() ;
  @Output() showDialogaddChange = new EventEmitter<boolean>();
  @Output("refreshchange") refreshchange = new EventEmitter<number>();
  _validations: Validations = new Validations();
  defectImage: DefeatImage=new DefeatImage();

  packingTypeslist: SelectItem[];
  packagingpresentationlist: SelectItem[];
  supplierstring:string="";
  barcode:string="";
  SupplierDialogVisible = false;
  totalUnits:number=0;
  submitted: boolean;
  baseCoin: number = -1;
  conversionCoin: number = -1;
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  coinsList: SelectItem[];
  basesymbolcoin: string = "";

  @ViewChild("in2") in2: ElementRef;
  @ViewChild("in3") in3: ElementRef;
  @ViewChild("in4") in4: ElementRef;

  _supplierxproduct: Productsxsupplier =new Productsxsupplier ();
  _supplierxproductList: Productsxsupplier[]= [];
  constructor(private _commonservice: CommonService,
    public _packagingpresentationservice: PackagingpresentationService,
    public _suppliercatalogservice: SuppliercatalogService,
    private messageService: MessageService,
    private coinsService: CoinsService,
    private exchangeRatesService: ExchangeRatesService,
    public userPermissions: UserPermissions,
    private _authservice: AuthService) { }

  ngOnInit(): void {
      if(this._supplierxprod.idProductSupplier!=-1){
          this.SearchBar("", -1, this._supplierxprod.idCom, this._supplierxprod.idProductSupplier, 1);
      }            
    // this.onLoadpackagintypeList();
    // this.onLoadPackagingpresentation();
    // this.totalUnits=0;
    // this.searchCoinsComp();
    // this.searchExchangeRates();
  }

  hideDialogadd(){
    this.showDialogadd = false;
    this.barcode= "";
    this.showDialogaddChange.emit(this.showDialogadd);
    this._supplierxproduct = new Productsxsupplier ();
    this._supplierxprod = new SupplierCatalog();
    this.submitted=false;
    this.suppliername="";
    this.totalUnits=0;
    //input del modal de proveedores
    this.supplierxprod= new Productsxsupplier ();
    //this.filters.id=-1;

    
  }

  SearchBar(barra: string, idprove:number,  comp:number, idproductxsupp:number, indexist:number){
    var filter : BarFilter = new BarFilter(); 
  //  if(this._supplierxproduct.products.idProduct>0){
    filter.bar= barra;
    filter.id=idproductxsupp;
    filter.idComp=  this._authservice.currentCompany;
    filter.idSupplier=idprove;
    filter.indExists=indexist;

    // if(barra!=""){
    //     idprove=this._supplierxproduct.suppliers.id;
    // }
  if(barra!="" || idproductxsupp!=-1){
    this._suppliercatalogservice.getSupplierProductfilter(filter).subscribe((data: Productsxsupplier) => {
      if(data!=null){
          this._supplierxproduct = data; 
          //  if(idprove!=-1){
          //      this._supplierxproduct.suppliers.id= idprove;
          //   }
           this.barcode=this._supplierxproduct.packing.bar;
            if(barra =="")
               this.suppliername= this._supplierxproduct.suppliers.socialReason;
            
          this.onLoadpackagintypeList();
          this.onLoadPackagingpresentation();
          this.totalUnits=0;
          this.searchCoinsComp();
          this.searchExchangeRates();
          this.calculate("");
          // if(this._supplierxproduct.baseCost>0)
          //     this.calculateconversion("");
      }else{
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "La barra de empaque no esta asociada." });
      }
     
     // this.loading = false;
     //this._supplierxprod.idProductSupplier=-1;
    }, (error: HttpErrorResponse)=>{
     
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

  //}
  }
}
  async onLoadpackagintypeList(){
    var filter: PackingtypeFilter = new PackingtypeFilter();
    filter.active = 1;
    this._commonservice.getPackingTypes(filter)
    .subscribe((data)=>{
      this.packingTypeslist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadPackagingpresentation(){
    var filter: PackagingpresentationFilter = new PackagingpresentationFilter();
    filter.active = 1;
    this._packagingpresentationservice.getPackagingpresentationbyfilter(filter)
    .subscribe((data)=>{
      this.packagingpresentationlist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });

  }
  onToggleSupplier(visible: boolean){
    this.SupplierDialogVisible = visible;
  }
  calculate(value: string){
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi,"");
    value = value.replace(",",".");
    if(value!="0")
       this.totalUnits = parseFloat(value)* this._supplierxproduct.packing.numberUnist;
    else
        this.totalUnits = this._supplierxproduct.available* this._supplierxproduct.packing.numberUnist;
  }

  calculateconversion(value: string){
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi,"");
    value = value.replace(",",".");
    if(value!="0" && parseFloat(this.exchangeRate.toString()) > 0){
      this._supplierxproduct.conversionCost = parseFloat(value) / parseFloat(this.exchangeRate.toString());
    }else{
       if(parseFloat(this.exchangeRate.toString()) > 0){
        this._supplierxproduct.conversionCost= this._supplierxproduct.baseCost / parseFloat(this.exchangeRate.toString());
       }
    }
  }
  
calculatebase(value: string){
  value = value == "" ? "0" : value;
  value = value.replace(/[.]/gi,"");
  value = value.replace(",",".");
  if(value!="0" && parseFloat(this.exchangeRate.toString()) > 0){
    this._supplierxproduct.baseCost = parseFloat(value)* parseFloat(this.exchangeRate.toString());
  }else{
    this._supplierxproduct.baseCost= this._supplierxproduct.conversionCost * parseFloat(this.exchangeRate.toString());
  }

}

  savereg(){
    this.submitted = true;
    this._supplierxproductList=[];
    // if(this._supplierxproduct.description==null)
    //         this._supplierxproduct.description=" ";
    if(this.suppliername.trim() && this._supplierxproduct.products.idProduct>0 && this.barcode.trim()){
       if(this._supplierxproduct.idProductxSupplier==0){
           this._supplierxproduct.idProductxSupplier=-1;
           this._supplierxproduct.idBranchoffice=1;
           this._supplierxproduct.suppliers.socialReason=this.supplierxprod.suppliers.socialReason;
           this._supplierxproduct.suppliers.id =this.supplierxprod.suppliers.id;
           this._supplierxproduct.active= true;
           //this._supplierxproduct.idReasons=-1;
       }
       this._supplierxproduct.baseCost = this._supplierxproduct.baseCost == null || this._supplierxproduct.baseCost.toString() == "" ? 0 : this._supplierxproduct.baseCost;
       this._supplierxproduct.available = this._supplierxproduct.available == null || this._supplierxproduct.available.toString() == "" ? 0 : this._supplierxproduct.available;
       this._supplierxproduct.conversionCost = this._supplierxproduct.conversionCost == null || this._supplierxproduct.conversionCost.toString() == "" ? 0 : this._supplierxproduct.conversionCost;
       this._supplierxproduct.description="";
       this._supplierxproduct.idReasons=-1;
       this._supplierxproduct.supplierRef= this._supplierxproduct.supplierRef == null ? "" : this._supplierxproduct.supplierRef;
       this._supplierxproductList.push(this._supplierxproduct);
       console.log(this._supplierxproductList);
      this._suppliercatalogservice.postSupplierProduct(this._supplierxproductList).subscribe((data: number) => {
        if (data > 0) {
           
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialogadd = false;
          this.showDialogaddChange.emit(this.showDialogadd);
           this._supplierxproduct = new Productsxsupplier();
          // this._publication.name = "";
          // this._publication.active = true;
          this._suppliercatalogservice.getSupplierCatalogfilter(this.filters).subscribe((data: SupplierCatalog[]) => {
           this._suppliercatalogservice._SupplierCatalogList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
    
        }); 
          this.submitted = false;     
        }else if (data == -1){
          console.log(data);
          this.messageService.add({severity:'error', summary:'Alerta', detail: "El  proveedor  ya  esta asignado al producto."});
        }else if (data==-2){
          console.log(data);
          this.messageService.add({severity:'error', summary:'Error', detail: "La referencia del proveedor ya se encuentra asociada a otro empaque."});
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el proveedor asociado al producto."});
        }
      }, (error: HttpErrorResponse)=>{
        
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el proveedor asociado al producto."});
    });
     }
    
  }
  searchCoinsComp(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._authservice.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      this.coinsList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.baseCoin = coin.id;
          this.basesymbolcoin = coin.symbology;
        }else{
          this.conversionCoin = coin.id
        }
      });
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de monedas"});
    });
  }

  searchExchangeRates(){
    var filter = new ExchangeRatesFilter();
    // filter.idDestinationCurrency= base;
    // filter.idOriginCurrency= idconversion
    filter.idExchangeRateType = 1;
    filter.idOriginCurrency = this.conversionCoin;
    filter.idDestinationCurrency = this.baseCoin;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRate = data[0].conversionFactor;
      if (data[0].conversionFactor > 1) {
        this.indhardcurrency = true;
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando la tasa de cambio"});
    });
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }

}
