import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/models/users/Address';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html'
})
export class AddressDetailsDashboardComponent implements OnInit {
@Input() addresses: Address[];
  constructor() { }

  ngOnInit(): void {
  }

  getAddressDescription(address: Address): String {
    return `${this.append(address.avenue, ",")} ${this.append(address.street, ".")} ${this.append(address.building, ",")} `
    + `${this.append(address.floor, "-")} ${this.append(address.apartment, ".")} ${this.append(address.city, "")} - ${this.append(address.city, "")}`
  }

  append(text: string, separator: string): String {
    return text.trim() != "" ? text + separator : ""
  }
}
