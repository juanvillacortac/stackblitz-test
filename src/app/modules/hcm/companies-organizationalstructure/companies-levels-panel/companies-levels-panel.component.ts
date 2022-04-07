//modules
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
//models
import { companylevel } from '../../shared/models/masters/company-level';
//filters
import { companylevelsfilter } from '../../../hcm/shared/filters/company-levels-filter';
//services
//import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from '../../../hcm/shared/services/company.service';
//Theme
import { InputNumberModule } from 'primeng/inputnumber';
import { Company } from '../../../../models/masters/company';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-companies-levels-panel', 
  templateUrl: './companies-levels-panel.component.html',
  styleUrls: ['./companies-levels-panel.component.scss']
})

export class CompaniesLevelsPanelComponent implements OnInit {

  constructor(private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private companyService: CompanyService) { }

  @Input() showDialog: boolean;
  @Input() levelin: companylevel;
  @Input() levelins: companylevel[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() saveData: EventEmitter<companylevel> = new EventEmitter<companylevel>();

  companylevelsFilters: companylevelsfilter = new companylevelsfilter();

  Levels: companylevel[];
  levelNumber: number;
  submitted: boolean;
  error: boolean = false;
  numLevel: number = 0;

  ngOnInit(): void {
    this.levelValidation();
    this.submitted = false;
  }

  hideDialog(): void {
    this.showDialogChange.emit(false);
  }

  saveLevel(): void {
    this.error = false;
    if(this.levelin.description != undefined || this.levelin.description != "" ){
      this.levelins.forEach(element =>{
        if(element.id != this.levelin.id && element.description == this.levelin.description){
          this.error = true;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La descripción ya se encuentra registrada." });
        }
      });
    }

    if(this.levelin.level == undefined || this.levelin.level < 1 ||
      this.levelin.description == undefined || this.levelin.description == "" || 
      this.levelin.payrollCode == undefined || this.levelin.payrollCode == "")
    {
      this.error = true;
    }

    if(this.error){
      this.submitted = true;
    }else{
      this.submitted = false;
      this.saveData.emit(this.levelin);
    }
    // this.levelin.id = this.levelin.id == 0 ? -1 : this.levelin.id;
    // this.levelin.company = Number(this.actRoute.snapshot.params['id']);
    // this.companylevelsFilters.Company = this.actRoute.snapshot.params['id'];
    // this.levelin.level = this.levelNumber;
    
  }

  levelValidation(): void {
    
    if(this.levelins != undefined){
      var value: number;
      if(this.levelin.id == -1){
        value = this.levelins.length;
        value++;
      }else{
        value = this.levelin.level;
      }
      this.levelin.level = value;
      this.levelNumber = this.levelins.length;
    }else{
      this.levelNumber = 0;
    }
  }
}
  
