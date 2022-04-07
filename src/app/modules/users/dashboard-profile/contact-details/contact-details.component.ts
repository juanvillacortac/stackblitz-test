import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/models/users/Address';
import { Phone } from 'src/app/models/users/Phones';
import { Profile } from 'src/app/models/users/Profile';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsDashboardComponent {
  @Input() addresses: Address[];
  @Input() phones: Phone[];
  @Input() onEditProfile: any;
  @Input() profile: Profile;
  constructor() { }
}

