import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../shared/models/masters/company';

@Component({
  selector: 'app-companies-bank-accounts',
  templateUrl: './companies-bank-accounts.component.html',
  styleUrls: ['./companies-bank-accounts.component.scss']
})

export class CompaniesBankAccountsComponent implements OnInit {
  // @Input("_company") _company: Company = new Company;
  @Input("companyType") companyType: string;
  @Input("companyClass") companyClass: string;

  @Input() _company : Company;
  constructor() { }

  ngOnInit(): void { }

}
