import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Company } from 'src/app/models/masters/company';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { CompaniesFilter } from 'src/app/modules/hcm/shared/filters/companies-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';

@Component({
  selector: 'app-contact-number-suppliers-masive',
  templateUrl: './contact-number-suppliers-masive.component.html',
  styleUrls: ['./contact-number-suppliers-masive.component.scss']
})
export class ContactNumberSuppliersMasiveComponent implements OnInit {

  identifierToEdit: number = -1;
  _validations:Validations=new Validations();
  acceptletter: RegExp = /^[a-zA-ZÀ-ú] *$/;
  @Input() visible: boolean = false;
  @Input("_dataSupplier") _dataSupplier:SupplierExtend;
  @Output("onSubmit") onSubmit = new EventEmitter<{contactNumbers: ContactNumberSupplier[], identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_ContactFilterList") _ContactFilterList: ContactNumberSupplier[];
  
  contactNumberType: SelectItem[];
  countryCodeList: SelectItem[];
  codeAreaList: SelectItem[];
  submitted: boolean = false;
  isnumbervalid: boolean = false;
  contactNumber: ContactNumberSupplier = new ContactNumberSupplier();
  contact :ContactNumberSupplier = new ContactNumberSupplier();
  checkAllCompany: boolean = false;
  number:string="";
  companieslist: Company[] = [];
  selectedCompanies: any[] = [];

  constructor(private commonService: CommonMastersService,
     private countryService: CountryService,
     private _companiesservice: CompanyService, 
     private messageService: MessageService) { }

  submit() {
    
    this.submitted = true;
    if(this.contactNumber.number ==  undefined || String(this.contactNumber.number).length < 7){
      this.isnumbervalid = true;
    }else
    {
      if(this.contactNumber.contact !="" && this.contactNumber.contact.trim() !="" && this.selectedCompanies.length > 0)
      {
        
         for (let i = 0; i < this.selectedCompanies.length; i++)
         {
          this.contact = new ContactNumberSupplier();
          this.isnumbervalid = false;
          this.contact.type = this.contactNumberType.find(x=>x.value == this.contactNumber.idType).label;
          this.contact.areaCode = Number(this.codeAreaList.find(x=>x.value == this.contactNumber.idCountry).label);
          this.contact.idcompany = this.selectedCompanies[i].id;
          this.contact.contact = this.contactNumber.contact;
          this.contact.country =this.contactNumber.country;
          this.contact.idCountry=this.contactNumber.idCountry;
          this.contact.idType=this.contactNumber.idType;
          this.contact.number = String(this.contactNumber.number);
          this.visible = false;
          var exist = this._ContactFilterList.find(x=>x.idcompany == this.contact.idcompany && 
                                               x.idCountry ==  this.contact.idCountry &&                                       
                                               x.number ==  this.contact.number)
          if(exist == null && exist == undefined )
          {
            this._ContactFilterList.push(this.contact);
          }
         }
         this.emitVisible();
         this.onSubmit.emit({
          contactNumbers: this._ContactFilterList,
          identifier: this.identifierToEdit
        });  
      }
    }
  }

  ngOnInit(): void {
    
  }

  onShow(){
    this.submitted =false;
    this.emitVisible();
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
    this.onLoadCompaniesList();
    this.ngOnInit();
  }

  onHide(){
    this.submitted =false;
    this.emitVisible();
    this.contactNumber = new ContactNumberSupplier(); 
    this.identifierToEdit = -1;
    this.selectedCompanies=[];
    this.checkAllCompany=false;
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
    }else{
      this.isnumbervalid = false;
    }
  }  
  checkAllCompanies(){
    if (this.checkAllCompany) {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
      var companyselected: Company[] = [];
      this.companieslist.forEach(company => {
        if (company.active) {
          this.selectedCompanies.push(company);
        }
      });
      //this.selectedCompanies = companyselected;
    }else{
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
    }
  }
  checkedcompany(e:any)
  {
    if(e.checked)
    {
       if(this.selectedCompanies.length==this.companieslist.filter(x=>x.active).length)
         this.checkAllCompany=true;
    }     
    else
       this.checkAllCompany=false;
  }

  onLoadCompaniesList()
  {
    this.companieslist =this._dataSupplier.companies;     
  }

}
