import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-number-indicator',
  templateUrl: './circle-number-indicator.component.html',
  styleUrls: ['./circle-number-indicator.component.scss'],
  providers: [DecimalPipe]
})
export class CircleNumberIndicatorComponent implements OnInit {
  @Input() currentValue = 0;
  @Input() targetValue = 0;
  @Input() maxValue = 0;
  @Input() legend = '';
  showValue = [0, 100];
  constructor(  private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    const currentPercentage = Number(this.decimalPipe. transform((this.currentValue / this.maxValue) * 100, '1.0-0'));
    this.showValue = [currentPercentage, 100];
  }

}
