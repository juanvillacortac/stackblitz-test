import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ind-blocked-label',
  templateUrl: './ind-blocked-label.component.html',
  styleUrls: ['./ind-blocked-label.component.scss']
})
export class IndBlockedLabelComponent implements OnInit {

  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = [{ 'value': true, 'name': 'Bloqueado'} , {'value': false, 'name': 'Sin bloqueo'}];
  yesOrNoModeTitlesList = [{'value': true, 'name': 'Si'} , {'value': false, 'name': 'No'}];
  title: string;
  @Input() indBlocked: boolean;
  @Input() isYesOrNoMode = false;
  constructor() { }

  ngOnInit(): void
  {    
    this.title = this.optionList.find(p => p.value === this.indBlocked).name;
  }

}
