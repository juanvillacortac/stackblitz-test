import { Component, OnInit,ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'app-report-order',
  templateUrl: './report-order.component.html',
  styleUrls: ['./report-order.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportOrderComponent implements OnInit {

  title = 'ReporteTelerikPruebaAngular';
  source = {
    report: 'TransferenciaMercancia.trdp',
    parameters:  {IdTransferenciasSucursal: 100}
  }

  constructor() { }
  ngOnInit() { }

}
