import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Company } from 'src/app/models/masters/company';
//Services
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { UserService } from '../../shared/services/user.service';
// Models
import { IdentifierTypeFilter } from '../../shared/filters/identifier-type-filter';
import { IdentifierType } from '../../shared/models/masters/IdentifierType';
import { IndividualAdjustmentFilter } from '../../shared/filters/salaries/individual-adjustment-filter';
import { HolidaysIndividualProgramationFilter } from '../../shared/filters/holidays/holidays-individual-programation-Filter';

@Component({
  selector: 'app-holiday-individual-programming-filter',
  templateUrl: './holiday-individual-programming-filter.component.html',
  styleUrls: ['./holiday-individual-programming-filter.component.scss']
})
export class HolidayIndividualProgrammingFilterComponent implements OnInit {
  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: HolidaysIndividualProgramationFilter;
  @Output() onSearch = new EventEmitter<IndividualAdjustmentFilter>();
  
  documentTypeDropdown: SelectItem[] = [];
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number = 0
  numDoc: boolean = false;
  typeDoc: boolean = false;
  code: boolean = false;
  search1: boolean;
  search2: boolean;
  search3: boolean;



  constructor(
    private _httpClient: HttpClient,  
    private messageService: MessageService,
    private _companyService: CompanyService,
    private _userService: UserService,
    private _countryService: CountryService,) { }

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadNonNaturalIdentifiersType();
  }
  
  loadNonNaturalIdentifiersType() {
    var filter: IdentifierTypeFilter = new IdentifierTypeFilter();
    filter.idDocumentType = -1;
    filter.idEntityType = 1;
    this._companyService.getCompany(this.idCompany).subscribe( (data: Company) => {
      if (data != null) {
        filter.idCountry = data.idCountry;
        this._userService.getIdentifierTypesByCountry(filter).subscribe( (data: IdentifierType[]) => {
          if (data != null) {
              this.documentTypeDropdown = data.map<SelectItem>((item)=>(
                  {
                    value: item.id,
                    label: item.type.toString().concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.documentTypeDropdown.sort((a, b) => a.label.localeCompare(b.label));
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
    });
  }

  search(){
    this.search1 = false;
    this.search2 = false;
    this.search3 = false;
    if(this.filters.documentNumber != null && this.filters.documentNumber != ""){
      this.search1 = true;
    }
    if(this.filters.employmentCode != null && this.filters.employmentCode != ""){
      this.search2 = true;
    }
    if(this.filters.idDocumentType != -1){
      this.search3 = true;
    }
    if(this.search1 && this.search3 || this.search2){
      this.search1 = false;
      this.search2 = false;
      this.numDoc = false;
      this.typeDoc = false;
      this.code = false;
      this.onSearch.emit(this.filters);
    }else{
      if(this.search1){
        this.typeDoc = true;
        this.numDoc = false;
        this.code = false;
      }else{
        if(this.search3){
          this.numDoc = true;
          this.typeDoc = false;
          this.code = false;
        }else{
          this.typeDoc = true;
          this.numDoc = true;
          this.code = true;
        }
      }
    }
  }

  clearFilters(){
    this.filters.documentNumber = "";
    this.filters.employmentCode = "";
    this.filters.idDocumentType = -1;
    this.search1 = false;
    this.search2 = false;
    this.numDoc = false;
    this.typeDoc = false;
    this.code = false;
  }

}
