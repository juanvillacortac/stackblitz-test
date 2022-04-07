import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-label',
  templateUrl: './status-label.component.html',
  styleUrls: ['./status-label.component.scss']
})
export class StatusLabelComponent implements OnInit {

  @Input() status: string;

  constructor() { }

  ngOnInit(): void { }
}
