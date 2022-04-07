import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Reception } from 'src/app/models/srm/reception';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-product-panel',
  templateUrl: './product-panel.component.html',
  styleUrls: ['./product-panel.component.scss']
})
export class ProductPanelComponent implements OnInit {
  
  @ViewChild('bar') bar: ElementRef;
  @Input("_product") _product: ValidationProduct;
  @Output("onSubmit") onSubmit = new EventEmitter<{reception:ValidationProduct, identifier: number}>();
  _validations: Validations = new Validations();
  @Input("PucharseOrderHeader") PucharseOrderHeader: Reception = new Reception();
  @Input('show') show:boolean=true;
  submitted: boolean;
  iduserlogin:number=-1;
  packaginglist:any[] = [];
  defectImage: DefeatImage=new DefeatImage();
  isdisabled=true;
  constructor(private _packingservice:PackingService,private messageService: MessageService, private _httpClient: HttpClient,
    private _productservice: ProductService,private _commonservice: CommonService,public userPermissions: UserPermissions,
    private _authservice: AuthService) { }

   ngOnInit(): void
  { 
    this.load();
    this.iduserlogin = this._authservice.storeUser.id;
  }
  // ngAfterViewInit () : void{
  //   this.load();
  // }
  load()
  {    
      this.iduserlogin = this._authservice.storeUser.id;
      let filters: PackingFilter = new PackingFilter ();
      filters.active = 1;
      filters.productId=this._product.id;
      //filters.id=this._product.idPackaging;
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

}
