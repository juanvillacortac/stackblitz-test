import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../shared/models/masters/company';

@Component({
  selector: 'app-commercial-registration',
  templateUrl: './commercial-registration.component.html',
  styleUrls: ['./commercial-registration.component.scss']
})
export class CommercialRegistrationComponent implements OnInit {

  @Input() _company = new Company();
  @Input() idcompany = -1;

  constructor() { }

  ngOnInit(): void {
  }

}
