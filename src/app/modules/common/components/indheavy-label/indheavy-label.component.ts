import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indheavy-label',
  templateUrl: './indheavy-label.component.html',
  styleUrls: ['./indheavy-label.component.scss']
})
export class IndheavyLabelComponent implements OnInit {
  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = [{ 'value': true, 'name': 'Bloqueado'} , {'value': false, 'name': 'Sin bloqueo'}];
  yesOrNoModeTitlesList = [{'value': true, 'name': 'Si'} , {'value': false, 'name': 'No'}];
  title: string;
  @Input() indHeavy: boolean;
  @Input() isYesOrNoMode = false;
  constructor() { }

  ngOnInit(): void
  {
    this.title = this.optionList.find(p => p.value === this.indHeavy).name;
  }
}
