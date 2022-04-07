import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Company } from 'src/app/models/masters/company';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CompaniesFilter } from '../../shared/filters/companies-filter';
import { CompanyService } from '../../shared/services/company.service';

@Component({
  selector: 'companies-catalog-edit-dialog',
  templateUrl: './companies-catalog-edit-dialog.component.html',
  styleUrls: ['./companies-catalog-edit-dialog.component.scss']
})
export class CompaniesCatalogEditDialogComponent implements OnInit {

  disabled : boolean = true;
  @Input("showDialog") showDialog: boolean = true;
  @Input("_Datacompany") _Datacompany: Company ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: CompaniesFilter;
  
  _validations : Validations = new Validations();
  visible = false;
  @Input("companyId") companyId: number = -1;
  submitted: boolean;
  statusList: SelectItem[];
  public _company: Company;

  constructor(private confirmationService: ConfirmationService,public _companyService: CompanyService, public messageService: MessageService ) { 
    this.statusList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];
  }

  ngOnInit(): void {
    this._company = new Company();
    this._company.id = this.companyId;

    if(this.companyId != -1) {
      this._companyService.getCompany(this.companyId)
      .subscribe((data)=>{
        if(data){
          this._company = data;
        }else{
          this.visible = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "No se consiguio la empresa." });
        }
      },(error) => {
        this.visible = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la empresa." });
        console.log(error);
      });
    }

    if(this._company.id<=0)
      this._company.active=true;
  }
    
  edit(companyId: number){
    this.companyId = companyId;
    this.visible = true;
    this.ngOnInit();
  }

}
