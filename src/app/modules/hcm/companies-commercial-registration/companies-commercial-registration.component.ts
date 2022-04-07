import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../shared/models/masters/company';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-companies-commercial-registration',
  templateUrl: './companies-commercial-registration.component.html',
  styleUrls: ['./companies-commercial-registration.component.scss']
})
export class CompaniesCommercialRegistrationComponent implements OnInit {

  @Input() _company = new Company();
  @Input() idcompany = -1;

  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
