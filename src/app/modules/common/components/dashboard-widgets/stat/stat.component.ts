import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  @Input() mainTittle = '';
  @Input() total = 0;
  @Input() subTotalRight = -1;
  @Input() subTotalLeft = -1;
  @Input() totalPercent = false;
  @Input() subTotalRightPercent = false;
  @Input() subTotalLeftPercent = false;
  @Input() totalTittle = '';
  @Input() subtotalRightTittle = '';
  @Input() subTotalLeftTittle = '';
  @Input() totalDecimalPipe = '1.0-0';
  @Input() subTotalRightDecimalPipe = '1.0-0';
  @Input() subTotalLeftDecimalPipe = '1.0-0';
  @Input() showLeftCostIncreaseArrow = false;
  @Input() showRightCostIncreaseArrow = false;
  @Input() totalIcon = '';
  @Input() statSubTitle = '';
  @Input() centered = true;

  constructor() { }

  ngOnInit(): void {

  }

}
