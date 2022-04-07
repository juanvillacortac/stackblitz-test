import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../shared/models/masters/company';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-companies-legal-representative',
  templateUrl: './companies-legal-representative.component.html',
  styleUrls: ['./companies-legal-representative.component.scss']
})
export class CompaniesLegalRepresentativeComponent implements OnInit {

  @Input() _company = new Company();
  @Input() idcompany = -1;

  email: string = "Valor definido por mí";
  @Output() companyemit = new EventEmitter<Company>();

  constructor() { 
    
  }

  ngOnInit(): void {
    
  }
}
