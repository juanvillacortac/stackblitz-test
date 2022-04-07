import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointOrder } from 'src/app/models/products/pointorder';

@Component({
  selector: 'app-suggested-point',
  templateUrl: './suggested-point.component.html',
  styleUrls: ['./suggested-point.component.scss']
})
export class SuggestedPointComponent implements OnInit {
  @Input("showDialog") showDialog : boolean = false;
  pointOrderTemp: PointOrder = new PointOrder();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("RefreshSuggestedPointOrder") RefreshSuggestedPointOrder = new EventEmitter<PointOrder>();
  constructor() { }

  ngOnInit(): void {
    debugger
    this.pointOrderTemp.midFactor = 100;
    this.pointOrderTemp.minFactor = 55;
    this.pointOrderTemp.maxFactor=210;
  }
  
  ngOnShow(){
    debugger
    this.pointOrderTemp.midFactor = 100;
    this.pointOrderTemp.minFactor = 55;
    this.pointOrderTemp.maxFactor=210;

    
    
  }
  
  hideDialog(){

    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }
  add()
  {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.RefreshSuggestedPointOrder.emit(this.pointOrderTemp);

  }
}
