import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {TabViewModule} from 'primeng/tabview';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { ProductMultimediaUse } from 'src/app/models/products/productmultimediause';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { MultimediaproductService } from 'src/app/modules/multimedia/shared/services/multimediaproduct.service';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { ProductmultimediaService } from '../../shared/services/productmultimedia/productmultimedia.service';

@Component({
  selector: 'multimedia-main',
  templateUrl: './multimedia-main.component.html',
  styleUrls: ['./multimedia-main.component.scss'],
  providers: [DatePipe]
})
export class MultimediaMainComponent implements OnInit {

  
  @Output("refreshproduct") refreshproduct = new EventEmitter<number>();
  @Output("clearchanges") clearchanges = new EventEmitter<number>();
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();
  @Input("idproduct") idproduct : number = 0;

  filter: MultimediaProductFilter = new MultimediaProductFilter(); 
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  activeTab: number = 0
  img: number = 0
  vid: number = 1
  doc: number = 2
  aud: number = 3
  multimediaDialog: boolean = false;
  multimediaProducts: MultimediaProduct[] = new Array<MultimediaProduct>()
  multimediaProducts1: MultimediaProduct[] = new Array<MultimediaProduct>()
  multimediaProducts2: MultimediaProduct[] = new Array<MultimediaProduct>()
  multimediaProducts3: MultimediaProduct[] = new Array<MultimediaProduct>()
  multimediaProducts4: MultimediaProduct[] = new Array<MultimediaProduct>()
  loading:boolean = true;
  imgCount: number = 0
  vidCount: number = 0
  type: number = 0;
  selectedPredetermined: MultimediaProduct = new MultimediaProduct();

  constructor(private router: Router,
    private messageService: MessageService,
    private confirmationService:ConfirmationService,
    private _multimediaproductservice: MultimediaproductService, 
    private _productmultimediaservice: ProductmultimediaService) { }

  ngOnInit(): void { 
    let filter = new MultimediaProductFilter()
    this.filter = new MultimediaProductFilter()
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }

    this.loadMultimedia()
  }

  openNew(){
    this.type = this.activeTab;
    this.multimediaDialog=!this.multimediaDialog
  }

  loadMultimedia(){
    this.loading = true;
    if(this.filter == undefined) this.filter = new MultimediaProductFilter()
    this.filter.productId = +this.idproduct
    this._multimediaproductservice.getMultimediaProductbyfilter(this.filter).subscribe((data) => {
      this.multimediaProducts = data;
      console.log(data);
      this.multimediaProducts1 = []
      this.multimediaProducts2 = []
      this.multimediaProducts3 = []
      this.multimediaProducts4 = []
      for(let mp of data) {
        if (mp.predetermined) {
          this.selectedPredetermined = mp;
        }
        if(mp.productMultimediaUses == undefined || mp.productMultimediaUses == null){
          mp.productMultimediaUses = new Array<ProductMultimediaUse>()
        }

        if(mp.multimediaFormat.multimediaType.id == 1){
          if (mp.predetermined) {
            this.multimediaProducts1 = [mp].concat(this.multimediaProducts1)
          }else{
            this.multimediaProducts1.push(mp)
          }
        }else if(mp.multimediaFormat.multimediaType.id == 2){
          this.multimediaProducts2.push(mp)
        }else if(mp.multimediaFormat.multimediaType.id == 3){
          this.multimediaProducts3.push(mp)
        }else{
          this.multimediaProducts4.push(mp)
        }
      }
      this.imgCount = this.multimediaProducts1.length;
      this.vidCount = this.multimediaProducts2.length;

      this.loading = false;

    }, (error) => {
      console.log(error);
    });
  }
  back = () => {
          const queryParams: any = {};
      queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
    
  }

  refreshChangeMain(){
    this.refreshproduct.emit(this.idproduct);
  }

}
