import { Component, Input, OnInit } from '@angular/core';
import { Phone } from 'src/app/models/users/Phones';

@Component({
  selector: 'app-phone-details',
  templateUrl: './phone-details.component.html'
})
export class PhoneDetailsDashboardComponent {
 @Input() phones: Phone[];
  constructor() { }

}
