import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyType } from 'src/app/models/masters/company-type';
import { CompanyTypeFilter } from '../../masters/companies/shared/filters/company-type-filter';
import { CompanyService } from '../../hcm/shared/services/company.service';
import { Company } from '../shared/models/masters/company';
import { CompanyBankAccount } from '../shared/models/masters/company-bank-account';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import { CompanyGovernmentalAgencyFilter } from '../shared/filters/company-governmental-agency-filter';

@Component({
  selector: 'app-companies-generalinfo-tab',
  templateUrl: './companies-generalinfo-tab.component.html',
  styleUrls: ['./companies-generalinfo-tab.component.scss']
})

export class CompaniesGeneralinfoTabComponent implements OnInit {
  @Input("_company") _company: Company = new Company;
  @Input("companyType") companyType: string;
  @Input("companyClass") companyClass: string;
  
  constructor( ) { }

  ngOnInit(): void { }
  
}
