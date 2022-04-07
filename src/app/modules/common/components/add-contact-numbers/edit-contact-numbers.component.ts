import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';

import {InputMaskModule} from 'primeng/inputmask';

@Component({
  selector: 'app-edit-contact-numbers',
  templateUrl: './edit-contact-numbers.component.html',
  styleUrls: ['./edit-contact-numbers.component.scss']
})
export class EditContactNumbersComponent implements OnInit {
  
  identifierToEdit: number = -1;

  constructor(private commonService: CommonMastersService, private countryService: CountryService) { }

  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{contactNumber: ContactNumber, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  
  contactNumberType: SelectItem[];
  countryCodeList: SelectItem[];
  codeAreaList: SelectItem[];
  submitted: boolean = false;
  isnumbervalid: boolean = false;
  contactNumber: ContactNumber = new ContactNumber();

  submit() {
    this.submitted = true;
    if(this.contactNumber.number ==  undefined || String(this.contactNumber.number).length < 7){
      this.isnumbervalid = true;
    }else{
      this.isnumbervalid = false;
      this.contactNumber.number = String(this.contactNumber.number);
      this.contactNumber.type = this.contactNumberType.find(x=>x.value == this.contactNumber.idType).label;
      this.contactNumber.areaCode = Number(this.codeAreaList.find(x=>x.value == this.contactNumber.idCountry).label);
      this.visible = false;
      this.onSubmit.emit({
        contactNumber: this.contactNumber,
        identifier: this.identifierToEdit
      });
      this.emitVisible();      
    }    
  }

  ngOnInit(): void {
    this.commonService.getContactNumberTypes({
      id: -1
    }).subscribe((data)=>{
      this.contactNumberType = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });

    this.countryService.getCountriesList({
      active: -1,
      idCountry: -1,
      name:"",
      abbreviation:""
    }).subscribe((data)=>{
      this.countryCodeList = data.filter(x=>x.id != 0).sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: `${item.name} (+${item.areaCode})`,
        value: item.id
      }));
      this.codeAreaList = data.filter(x=>x.id != 0).map((item)=>({
        label: `${item.areaCode}`,
        value: item.id
      }));
    });
  }

  onShow(){
    this.isnumbervalid = false;
    this.submitted =false;
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.submitted =false;
    this.isnumbervalid = false;
    this.emitVisible();
    this.contactNumber = new ContactNumber(); 
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  edit(contactNumber: ContactNumber, identifier: number){
    this.contactNumber = Object.assign({},contactNumber);
    this.identifierToEdit = identifier;
    this.visible = true;
  }

  validatenumber(e:any)
  {
    let number :string;
    number=String(e); 
    if(number.length< 7)
    {
      this.isnumbervalid = true;
    }else{
      this.isnumbervalid = false;
    }
  }  
}
