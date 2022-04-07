import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-exchange-rate',
  templateUrl: './new-exchange-rate.component.html',
  styleUrls: ['./new-exchange-rate.component.scss']
})
export class NewExchangeRateComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("provisionalExchangeRate") provisionalExchangeRate : number;
  @Output("provisionalExchangeRateChange") provisionalExchangeRateChange = new EventEmitter<number>();
  @Output("refreshCalculePricesCosts") refreshCalculePricesCosts = new EventEmitter();
  
  @Output() showDialogChange = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnShow(){

  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  saveProvisionalExchangeRate(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.provisionalExchangeRateChange.emit(this.provisionalExchangeRate);
    this.refreshCalculePricesCosts.emit();
  }
}
