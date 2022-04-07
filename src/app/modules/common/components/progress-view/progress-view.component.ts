import { Component, Input, OnInit } from '@angular/core';
import { ProgressViewColors } from './progress-view-colors';

@Component({
  selector: 'app-progress-view',
  templateUrl: './progress-view.component.html',
  styleUrls: ['./progress-view.component.scss']
})
export class ProgressViewComponent implements OnInit {

  @Input() id?: number | string;
  @Input() progress: number;
  @Input() barColor: ProgressViewColors;
  @Input() progressColor: number;
  @Input() progressText = '';
  @Input() warningPercentage = 40;
  @Input() successPercentage = 80;
  @Input() width = 100;
  @Input() align = 'left';

  get textToShow() {
    return this.progressText !== '' ? this.progressText : this.progress + ' %';
  }

  get backgroundColor() {
    if (this.barColor) {
      return this.barColor.toString();
    }
    if (this.progressColor >= this.successPercentage) {
      return ProgressViewColors.GREEN;
    } else if (this.progressColor >= this.warningPercentage) {
      return ProgressViewColors.YELLOW;
    } else {
      return ProgressViewColors.RED;
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.setProgressColor();
  }

  setProgressColor() {
    if (!this.progressColor) {
      this.progressColor = this.progress;
    }
  }

}
