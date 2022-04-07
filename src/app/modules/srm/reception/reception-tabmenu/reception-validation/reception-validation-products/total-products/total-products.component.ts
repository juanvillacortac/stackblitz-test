import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MenuItem } from 'primeng/api';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

type NewType = MessageService;

@Component({
    selector: 'app-total-products',
    templateUrl: './total-products.component.html',
    styleUrls: ['./total-products.component.scss']
  })
export class TotalProductsComponent implements OnInit {

@Output("_sendTaxablesMasivo") _sendTaxablesMasivo = new EventEmitter<{ product: Productdetailvalidation[] }>();
showModalMasivo: boolean = false;
showModalsubtotal: boolean = false;
showModaledit: boolean = false;
showModalImponibleMasivo: boolean = false;
showModalDeducibleMasivo: boolean = false;
@Input("ProductsValidation") ProductsValidation: ValidationProduct[] = [];
@Input() reception: Reception = new Reception();
//@Output("ProductsValidationChange") ProductsValidationChange = new EventEmitter<ValidationProduct[]>();
@Input() Purchase: PurchaseValidation = new PurchaseValidation();
exchangeRate: number = 0;
permissions: number[] = [];
permissionsIDs = { ...Permissions };
items: MenuItem[] = [
    {
        label: 'Imponibles al subtotal',
        icon: 'pi pi-money-bill',
        visible:this.userPermissions.allowed(this.permissionsIDs.CONFIGURE_TAXABLE_HEADER_PERMISSION_ID ),
        command: () => {
            this.showmodalSubtotal(true, false)
        }
    },
    {
        label: 'Imponibles masivo',
        icon: 'pi pi-money-bill',
        visible:this.userPermissions.allowed(this.permissionsIDs.CONFIGURE_TAXABLE_MASIVE_PERMISSION_ID),
        command: () => {
            this.showmodal(true, false);
        }
        //visible:this.PurchaseOrderProductSelect.length >0 ? true : false 
    },
    {
        label: 'Deducibles al subtotal',
        icon: 'pi pi-minus-circle', 
        visible:this.userPermissions.allowed(this.permissionsIDs.CONFIGURE_DEDUCTIBLE_HEADER_PERMISSION_ID),
        command: () => {
            this.showmodalSubtotal(true, true)
        }
    },
    {
        label: 'Deducibles masivo',
        icon: 'pi pi-minus-circle',
        visible:this.userPermissions.allowed(this.permissionsIDs.CONFIGURE_DEDUCTIBLE_MASIVE_PERMISSION_ID),
         command: () => {
            this.showmodal(false, true)
        }
    }
];
@Input("totaldeductiblesproduct") totaldeductiblesproduct: number = 0;
@Input("totaltaxableproduct") totaltaxableproduct: number = 0;
@Input("subtotal") subtotal: number = 0;
@Input("taxableTotalcab") taxableTotalcab: number = 0;
@Input("deductibleTotalcab") deductibleTotalcab: number = 0;
@Input("taxableTotal") taxableTotal: number = 0;
@Input("deductibleTotal") deductibleTotal: number = 0;
subDeducibleTotal: number = 0;
subTaxableTotal: number = 0;
conversionsymbolcoin: any
basesymbolcoin: any;
indDeductibleheader: boolean = false;
statuspurchase:typeof ReceptionStatus=ReceptionStatus
@Output("issavechange") issavechange = new EventEmitter<boolean>();
iduserlogin:number=-1;

constructor(private coinsService: CoinsService, private messageService: MessageService, public userPermissions: UserPermissions,
     private _httpClient: HttpClient,private exchangeRatesService: ExchangeRatesService,) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

ngOnInit(): void {
    this.iduserlogin = this._Authservice.storeUser.id;
    this.searchCoinsxCompany();
}
  
showmodal(pIndTax, pIndDeduc){
  this.showModalImponibleMasivo=pIndTax;
  this.showModalDeducibleMasivo=pIndDeduc;
}

sendMasivoTax(data){
  this._sendTaxablesMasivo.emit({product:data.ProductDetail});
 }

    searchCoinsxCompany() {
        var filter = new CoinxCompanyFilter();
        filter.idCompany = this._Authservice.currentCompany;
        this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
            var baseC: number;
            var conversionC: number;
            data.forEach(coin => {
                if (coin.legalCurrency == true) {
                    this.basesymbolcoin = coin.symbology;
                    baseC=coin.id
                } else {
                    this.conversionsymbolcoin = coin.symbology;
                    conversionC=coin.id
                }
            });
            this.searchExchangeRates(baseC, conversionC);
        }, (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando lasa monedas" });
        });
    }
    

    showmodalSubtotal(pIndShow, indtaxded) {
        this.showModalsubtotal = pIndShow;
        this.indDeductibleheader = indtaxded;

    }
    showmodaledit(pIndShow, indtaxded) {
        this.showModaledit = pIndShow;
        this.indDeductibleheader = indtaxded;

    }
    savetaxded(data) {
        if (data == true)
            this.issavechange.emit(data);
    }
    searchExchangeRates(base: number, conversion: number)
    {
        var filter = new ExchangeRatesFilter();
        filter.idOriginCurrency = conversion;
        filter.idDestinationCurrency = base;
        filter.idExchangeRateType = 1;
        this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
          this.exchangeRate = data[0].conversionFactor;
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
        });
      }
}
