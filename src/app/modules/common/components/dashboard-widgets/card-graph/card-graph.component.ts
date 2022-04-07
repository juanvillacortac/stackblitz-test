import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-graph',
  templateUrl: './card-graph.component.html',
  styleUrls: ['./card-graph.component.scss']
})
export class CardGraphComponent implements OnInit {
  @Input() currentValue = 0;
  @Input() targetValue = 0;
  @Input() legend = '';
  condition:boolean= false; 
  constructor() { }

  ShownLabel():number {
 
    if(this.currentValue< this.targetValue)
     {
          return 1;
    }else {
      return 2;
    }
}

  ngOnInit(): void {
    
  }

}
