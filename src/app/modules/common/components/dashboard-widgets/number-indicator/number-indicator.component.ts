import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-indicator',
  templateUrl: './number-indicator.component.html',
  styleUrls: ['./number-indicator.component.scss']
})
export class NumberIndicatorComponent implements OnInit {

  @Input() icon = '';
  @Input() currentValue = 0;
  @Input() legend = '';
  constructor() { }

  ngOnInit(): void {
  }

}
