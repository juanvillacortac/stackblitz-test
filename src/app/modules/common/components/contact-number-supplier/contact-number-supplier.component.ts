import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-contact-number-supplier',
  templateUrl: './contact-number-supplier.component.html',
  styleUrls: ['./contact-number-supplier.component.scss']
})
export class ContactNumberSupplierComponent implements OnInit {

  identifierToEdit: number = -1;
  _validations:Validations=new Validations();
  acceptGuion: RegExp = /^[a-zA-Z0-9À-ú_ -] *$/;
  @Input() visible: boolean = false;
  @Input("idCompany") idCompany: number;
  @Output("onSubmit") onSubmit = new EventEmitter<{contactNumber: ContactNumberSupplier, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  
  contactNumberType: SelectItem[];
  countryCodeList: SelectItem[];
  codeAreaList: SelectItem[];
  submitted: boolean = false;
  isnumbervalid: boolean = false;
  number:string="";
  contactNumber: ContactNumberSupplier = new ContactNumberSupplier();

  constructor(private commonService: CommonMastersService, private countryService: CountryService) { }

  submit() {
    debugger;
    this.submitted = true;
    if(this.contactNumber.number ==  undefined || String(this.contactNumber.number).length < 7){
      this.isnumbervalid = true;
    }else{
      if(this.contactNumber.contact !="" && this.contactNumber.contact.trim() !=""){
      this.isnumbervalid = false;
      this.contactNumber.idcompany = this.idCompany;
      this.contactNumber.type = this.contactNumberType.find(x=>x.value == this.contactNumber.idType).label;
      this.contactNumber.areaCode = Number(this.codeAreaList.find(x=>x.value == this.contactNumber.idCountry).label);
      this.contactNumber.number = String(this.contactNumber.number);
      this.visible = false;
      this.onSubmit.emit({
        contactNumber: this.contactNumber,
        identifier: this.identifierToEdit
      });
      this.submitted =false;
      this.emitVisible();
      }    
    }    
  }

  ngOnInit(): void {
    this.submitted=false;
    if(this.contactNumber.idCountry<=0)
         this.contactNumber.contact=" ";
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

  onShow()
  {  
    this.submitted=false; 
    if(this.contactNumber.idCountry<=0)
         this.contactNumber.contact=" ";
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.submitted=false;
    this.emitVisible();
    this.contactNumber = new ContactNumberSupplier(); 
    this.identifierToEdit = -1;
    this.isnumbervalid = false;
  }

  onChange(event:any) 
  { 
    let substr=this.countryCodeList.find(x=>x.value==this.contactNumber.idCountry).label.indexOf("(");
    this.contactNumber.country=this.countryCodeList.find(x=>x.value==this.contactNumber.idCountry).label.substring(0,substr);
  } 
  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  edit(contactNumber: ContactNumberSupplier, identifier: number){
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
       //if(this.contactNumber.number ==  undefined || String(this.contactNumber.number).length < 7)
       this.isnumbervalid = true;
     }  
     else{
      this.isnumbervalid = false;
    }
  }  

}
