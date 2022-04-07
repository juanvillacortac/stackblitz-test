import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../shared/models/masters/company';

@Component({
  selector: 'companybar',
  templateUrl: './companybar.component.html',
  styleUrls: ['./companybar.component.scss']
})
export class CompanybarComponent implements OnInit {

  @Input("_company") _company : Company = new Company();

  constructor() { }

  ngOnInit(): void {  }
  
}
