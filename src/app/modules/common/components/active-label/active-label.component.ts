import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-label',
  templateUrl: './active-label.component.html',
  styleUrls: ['./active-label.component.scss']
})
export class ActiveLabelComponent implements OnInit {
  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = [{ 'value': true, 'name': 'Activo'} , {'value': false, 'name': 'Inactivo'}];
  yesOrNoModeTitlesList = [{'value': true, 'name': 'Si'} , {'value': false, 'name': 'No'}];
  title: string;
  @Input() active: boolean;
  @Input() isYesOrNoMode = false;
  constructor() { }

  ngOnInit(): void {
    this.title = this.optionList.find(p => p.value === this.active).name;

  }
}
