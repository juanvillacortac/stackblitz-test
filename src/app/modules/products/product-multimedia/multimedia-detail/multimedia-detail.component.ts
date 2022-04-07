import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { Multimedia } from 'src/app/models/products/multimedia';
import { ProductMultimediaUse } from 'src/app/models/products/productmultimediause';
import { MultimediaUse } from 'src/app/modules/masters-mpc/shared/view-models/multimedia-use.viewmodel';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { MultimediaproductService } from 'src/app/modules/multimedia/shared/services/multimediaproduct.service';
import { ProductmultimediaService } from '../../shared/services/productmultimedia/productmultimedia.service';


@Component({
  selector: 'multimedia-detail',
  templateUrl: './multimedia-detail.component.html',
  styleUrls: ['./multimedia-detail.component.scss']
})
export class MultimediaDetailComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("activeTab") activeTab: number = 0;
  @Input("multimediaProducts") multimediaProducts: MultimediaProduct[] = []
  @Input("pos") pos: number = 0;
  @Output() showDialogChange = new EventEmitter<boolean>();
  submitted: boolean;
  


  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
    if (this.multimediaProducts && 0 <= newValue && newValue <= (this.multimediaProducts.length - 1)) {
        this._activeIndex = newValue;
    }
  }

  _activeIndex: number = 0;



  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor(private _multimediaproductservice: MultimediaproductService, 
    private _productmultimediaservice: ProductmultimediaService,
    private messageService: MessageService,) { }

  ngOnInit(): void {
    this._activeIndex = this.pos;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.multimediaProducts = []
  }

}
