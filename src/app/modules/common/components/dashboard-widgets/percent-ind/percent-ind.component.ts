import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-percent-ind',
  templateUrl: './percent-ind.component.html',
  styleUrls: ['./percent-ind.component.scss']
})
export class PercentIndComponent implements OnInit {

  @Input() image = '';
  @Input() currentValue = 0;
  @Input() legend = '';
  @Input() sublegend = '';
  @Input() objectiveDescription = '';
  @Input() color = '';
  @Input() target = 0;//objetivo
  @Input() valueVsTarget = 0;
  @Input() url = '#';
  @Input() symbol = '';
  objectiveDescription2: string = '';  
  symbol2:string;
  constructor() {    
   }

  
  ngOnInit(): void {    
    if(this.symbol=='%'){
      this.symbol2=''

    }else{
      this.symbol2='$'
      this.symbol=''
    }
    if(this.objectiveDescription == ''){
      this.objectiveDescription2 = 'Objetivo:'
    }else{
      this.objectiveDescription2 = this.objectiveDescription;
    }
  }

}
