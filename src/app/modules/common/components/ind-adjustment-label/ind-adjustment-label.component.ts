import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ind-adjustment-label',
  templateUrl: './ind-adjustment-label.component.html',
  styleUrls: ['./ind-adjustment-label.component.scss']
})
export class IndAdjustmentLabelComponent implements OnInit {

  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = [{ 'value': true, 'name': 'SI'} , {'value': false, 'name': 'NO'}];
  yesOrNoModeTitlesList = [{'value': true, 'name': 'SI'} , {'value': false, 'name': 'NO'}];
  title: string;
  @Input() tight: boolean;
  @Input() isYesOrNoMode = false;
  constructor() { }

  ngOnInit(): void
  {    
    this.title = this.optionList.find(p => p.value === this.tight).name;
  }
}
