import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Typegenerationbar } from 'src/app/models/masters-mpc/common/typegenerationbar';
import { TypegenerationbarFilter } from 'src/app/modules/masters-mpc/shared/filters/common/typegenerationbar-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { GenerateBarFilter } from '../../shared/filters/generatebar-filter';
import { ProductService } from '../../shared/services/productservice/product.service';
import { GenerateBar } from '../../shared/view-models/generatebarcode.viewmodel';

@Component({
  selector: 'barcode-panel',
  templateUrl: './barcode-panel.component.html',
  styleUrls: ['./barcode-panel.component.scss']
})
export class BarcodePanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("IdTypeGenerationBar") IdTypeGenerationBar : number = -1;
  @Input("BarCode") BarCode : string = "";
  @Input("ScaleCode") ScaleCode : string = "";
  @Input("IndGenerationBar") IndGenerationBar: number = 0;
  @Output() BarCodeChange = new EventEmitter<string>();
  @Output() ScaleCodeChange = new EventEmitter<string>();
  @Output("refreshchange") refreshchange = new EventEmitter<number>();

  typeGenerateBarList: SelectItem[];
  constructor(private _commonservice: CommonService,
    private _productservice: ProductService) { }

  ngOnInit(): void {
    this.onLoadTypeGenerationBarList();
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  async onLoadTypeGenerationBarList(){
    var filter: TypegenerationbarFilter = new TypegenerationbarFilter()
    filter.active = 1;
    this._commonservice.getTypeGenerationBar(filter)
    .subscribe((data)=>{
      this.typeGenerateBarList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  GenerateBarCode(){
    if (this.IndGenerationBar == 1) {
      var filter = new GenerateBarFilter();
      filter.idGroupingGenerationBar = 2;
      filter.idTypeGenerationBar = this.IdTypeGenerationBar;
      this._productservice.getGenerateBarbyfilter(filter).subscribe((data: GenerateBar) => {
        this.BarCode = data.barCode;
        if (this.IdTypeGenerationBar  == 2) {
          this.ScaleCode = data.scaleCode;
          this.ScaleCodeChange.emit(this.ScaleCode);
        }
        this.refreshchange.emit();
        this.BarCodeChange.emit(this.BarCode);
      });
    }else{
      var filter = new GenerateBarFilter();
      filter.idGroupingGenerationBar = 2;
      filter.idTypeGenerationBar = this.IdTypeGenerationBar;
      this._productservice.getGenerateBarPackingbyfilter(filter).subscribe((data: GenerateBar) => {
        this.BarCode = data.barCode;
        if (this.IdTypeGenerationBar  == 2) {
          this.ScaleCode = data.scaleCode;
          this.ScaleCodeChange.emit(this.ScaleCode);
        }
        this.refreshchange.emit();
        this.BarCodeChange.emit(this.BarCode);
      });
    }
  }

}
