import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../shared/models/masters/company';

@Component({
  selector: 'app-legal-representative',
  templateUrl: './legal-representative.component.html',
  styleUrls: ['./legal-representative.component.scss']
})
export class LegalRepresentativeComponent implements OnInit {

  @Input() _company = new Company();
  @Input() idcompany = -1;

  email: string = "Valor definido por mí";
  @Output() companyemit = new EventEmitter<Company>();

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void{
    
  }

}
