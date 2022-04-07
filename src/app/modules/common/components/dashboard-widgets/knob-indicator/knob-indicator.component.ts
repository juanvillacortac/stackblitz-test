import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-knob-indicator',
  templateUrl: './knob-indicator.component.html',
  styleUrls: ['./knob-indicator.component.scss']
})
export class KnobIndicatorComponent implements OnInit {

  @Input() currentValue = 0;
  @Input() targetValue = 100;
  @Input() size = 150;
  @Input() readonly = true;
  @Input() valueColor = true;
  constructor() { }

  ngOnInit(): void {
  }

}
