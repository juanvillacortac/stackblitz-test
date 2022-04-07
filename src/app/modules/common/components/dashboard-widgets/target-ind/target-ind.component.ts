import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-target-ind',
  templateUrl: './target-ind.component.html',
  styleUrls: ['./target-ind.component.scss']
})
export class TargetIndComponent implements OnInit {

  @Input() image = '';
  @Input() currentValue = 0;
  @Input() legend = '';
  @Input() sublegend = '';
  @Input() target = 0;
  @Input() objectiveDescription = '';
  @Input() color = '';
  @Input() valueVsTarget = 0;
  @Input() url = '#';
  @Input() caption = '';
  objectiveDescription2: string = '';  
  constructor() { }

  ngOnInit(): void {        
    if(this.objectiveDescription == ''){
      this.objectiveDescription2 = 'Objetivo:'
    }else{
      this.objectiveDescription2 = this.objectiveDescription;
    }
  }

}
