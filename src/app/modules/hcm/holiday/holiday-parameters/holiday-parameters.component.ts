import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';

//Services
import { HolidaysConfigurationService } from '../../shared/services/holidays/holidays-configuration.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

//Model
import { HolidaysConfiguration } from '../../shared/models/holidays/holidays-configuration';
import { HolidaysConfigurationFilter } from '../../shared/filters/holidays/holidays-configuration-filter';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { HolidaysConfigurationViewModel } from '../../shared/view-models/holidays/holidays-configuration-viewmodel';

@Component({
  selector: 'app-holiday-parameters',
  templateUrl: './holiday-parameters.component.html',
  styleUrls: ['./holiday-parameters.component.scss']
})
export class HolidayParametersComponent implements OnInit {
  @Input() checked: boolean;
  permissionsIDs = { ...Permissions };
  @Input() activeIndex: number;
  _Authservice : AuthService = new AuthService(this._httpClient);
  holidaysConfigurationFilter: HolidaysConfigurationFilter = new HolidaysConfigurationFilter();
  holidaysConfiguration = new HolidaysConfiguration();
  holidaysConfigurationViewModel = new HolidaysConfigurationViewModel();
  holidaysConfigurationList: HolidaysConfiguration[] = [];
  // Val show front end
  dayMax: number = 0;
  dayMin: number = 0;
  dayMinBonus: number = 0;
  minAdditionalDays: number = 0;
  maxAdditionalDays: number = 0;
  daysOld: number = 0;
  maxYear: number = 0;
  typeSalaryModel: string = "";
  enableAnticipated: boolean = false;
  typeDayModel: string = "";
/////////////////////////////////
  salaryTypeFilter: SalaryTypeFilter = new SalaryTypeFilter();
  salaryTypeSelect: SelectItem[] = [];
  salaryTypeItem: any = {Label:'', value:0};
  typeDayOption: any [];
  typeDaySelec: {name:string , value: number};
  submitError: boolean = false;
  constructor(
    private _holidaysConfigurationService: HolidaysConfigurationService,
    private _salaryTypeService: SalaryTypeService,
    private _httpClient: HttpClient,
    private messageService: MessageService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.typeDayOption = [{name:'Hábil', value:1}, {name:'Natural', value:2}];
    this.loadHolidaysConfiguration();
    this.loadSalaryType();
    
  }

  loadSalaryType(){
    this.salaryTypeFilter.companyId = parseInt(this._Authservice.currentCompany);
    this._salaryTypeService.GetSalaryType(this.salaryTypeFilter).subscribe((data: SalaryType[]) => {
      this.salaryTypeSelect = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de Salarios" });
    });
  }

  loadHolidaysConfiguration(){
    this.holidaysConfigurationFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._holidaysConfigurationService.GetHolidaysConfiguration(this.holidaysConfigurationFilter).subscribe((data:HolidaysConfiguration[]) => {
      this.holidaysConfiguration = data[0];
      this.holidaysConfigurationViewModel = data[0];
      this.salaryTypeItem = {label: this.holidaysConfiguration.typeSalary, value: this.holidaysConfiguration.idTypeSalary};
      this.daysOld = this.holidaysConfigurationViewModel.daysOld;
      this.maxYear = this.holidaysConfigurationViewModel.maxYear;
      this.minAdditionalDays = this.holidaysConfigurationViewModel.minAdditionalDays;
      this.maxAdditionalDays = this.holidaysConfigurationViewModel.maxAdditionalDays;
      this.dayMin = this.holidaysConfigurationViewModel.dayMin;
      this.dayMinBonus = this.holidaysConfigurationViewModel.dayMinBonus;
      this.typeSalaryModel = this.holidaysConfigurationViewModel.typeSalary; 
      this.typeDayModel = this.holidaysConfigurationViewModel.typeDay; 
      this.enableAnticipated = this.holidaysConfigurationViewModel.enableAnticipated;
      if(this.holidaysConfiguration == null){
        this.holidaysConfiguration.daysOld = 0;
        this.holidaysConfiguration.maxYear = 0;
        this.holidaysConfiguration.minAdditionalDays = 0;
        this.holidaysConfiguration.maxAdditionalDays = 0;
        this.holidaysConfiguration.dayMin = 0;
        this.holidaysConfiguration.dayMinBonus = 0;
        this.holidaysConfiguration.enableAnticipated = false;
      }
      this.loadTypeDay();

    })
    
  }

  calculateMaxDay(){
    debugger
    if(this.holidaysConfiguration.maxAdditionalDays > 30){
      this.holidaysConfiguration.maxAdditionalDays = 0;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los días máximos adicionales no pueden ser mayor a 30 días" });
    }
  }

  calculateDayOld(){
    debugger
    if(this.holidaysConfiguration.daysOld > 365){
      this.holidaysConfiguration.daysOld = 0;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los días de antigüedad no pueden ser mayor a 365 días" });
    }
  }

  calculateMinDay(){
    debugger
    if(this.holidaysConfiguration.minAdditionalDays >= this.holidaysConfiguration.maxAdditionalDays){
      this.holidaysConfiguration.minAdditionalDays = 0;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los días mínimos adiconales no pueden ser mayor a los dias máximos adicionales" });
    }
  }

  loadTypeDay(){
    switch(this.holidaysConfiguration.idTypeDay){
      case 1: this.typeDaySelec = {name:'Hábil', value:1};
      break;

      case 2: this.typeDaySelec = {name:'Natural', value:2};
      break;

      default:
        break;
    }
  }

  saveConfiguration(){
    debugger
    if(this.holidaysConfiguration.daysOld <= 0 || this.holidaysConfiguration.maxYear <=0 || this.holidaysConfiguration.minAdditionalDays <= 0 
       || this.holidaysConfiguration.maxAdditionalDays <=0 || this.holidaysConfiguration.dayMin <=0 || this.holidaysConfiguration.dayMinBonus <=0){
      this.submitError= true;
    }else{  
      this.holidaysConfiguration.idCompany = parseInt(this._Authservice.currentCompany);
      this.holidaysConfiguration.idTypeSalary = this.salaryTypeItem.value;
      this.holidaysConfiguration.typeDay = this.typeDaySelec.name;
      this.holidaysConfiguration.idTypeDay = this.typeDaySelec.value;
      this._holidaysConfigurationService.InsertHolidaysConfiguration(this.holidaysConfiguration).subscribe((data) => {
        if (data == 1) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.loadSalaryType();
        this.loadHolidaysConfiguration();
      } else if (data == 1001) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }
      else if (data == -3) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });
  }
  }

}
