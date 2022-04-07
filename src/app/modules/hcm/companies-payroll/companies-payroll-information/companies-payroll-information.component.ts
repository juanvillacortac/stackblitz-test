//General
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
//Theming
import { ConfirmationService, MenuItem } from 'primeng/api';
//Theme components
import { MessageService } from 'primeng/api';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';

@Component({
  selector: 'app-companies-payroll-information',
  templateUrl: './companies-payroll-information.component.html',
  styleUrls: ['./companies-payroll-information.component.scss']
})

export class CompaniesPayrollInformationComponent implements OnInit {
 
  //ctor
  constructor(private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService) { }
    
  //vars
  activeItem: MenuItem;
  activeIndex: number;
  checked: boolean;
  validateGroup: boolean = false;

  //Init
  laborRelationshipMinimumFilters: LaborRelationshipMinimumFilter[] = [];

  ngOnInit(): void {
    this.activeIndex = 0;
    this.checked = false;
    if (parseInt(sessionStorage.getItem('idLaborRelationship')) == -1) {
      this.checked = true;
    }

    var filters = this.activatedRoute.snapshot.queryParamMap.get('laborRelationshipMinimumFilters');
    // debugger;
    if (this.laborRelationshipMinimumFilters.length > 0) {
      this.laborRelationshipMinimumFilters = this.laborRelationshipMinimumFilters;
    } else {
      if (filters!=undefined) {
        const laborRelationshipMinimumFilters = filters;
        if (laborRelationshipMinimumFilters === null) {
          this.laborRelationshipMinimumFilters = [];
        } else {
          this.laborRelationshipMinimumFilters = JSON.parse(laborRelationshipMinimumFilters);
          sessionStorage.setItem('searchParameters', laborRelationshipMinimumFilters)
        }
      }else{
        this.laborRelationshipMinimumFilters = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
    }
    
    var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl(url);

  }

  //Enable Records Edition
  handleChange(e) {
    this.checked = e.checked;
  }

  //Back to the Main List
  regresar() {
    
    if(this.validateGroup){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar esta afección médica?',
        accept: () => {
          const queryParams: any = {};
          queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.laborRelationshipMinimumFilters);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          sessionStorage.removeItem('idLaborRelationship');
          this.router.navigate(['hcm/companiesemployee-list'], navigationExtras)
        },
        reject: () => {
          
        }
      }); 
    }else{
      const queryParams: any = {};
      queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.laborRelationshipMinimumFilters);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      sessionStorage.removeItem('idLaborRelationship');
      this.router.navigate(['hcm/companiesemployee-list'], navigationExtras)
    }
    ;
  }

  restricction(value: boolean){
    debugger;
    this.validateGroup = value;
  }
}
