import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { widgetType } from 'src/app/models/common/widget-type';
import { LaborRelationshipFilter } from '../../../shared/filters/laborRelationship/labor-relationship-filter';
import { LaborRelationshipService } from '../../../shared/services/labor-relationship.service';
//Models 
import { LaborRelationship } from '../../../shared/models/laborRelationship/labor-relationship';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { identity } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MastersService } from 'src/app/modules/users/shared/masters.service';
import { CountryViewModel } from 'src/app/modules/users/shared/view-model/country.viewmodel';
import { CountriesListComponent } from 'src/app/modules/masters/country/countries-list/countries-list.component';

@Component({
  selector: 'app-employee-resume',
  templateUrl: './employee-resume.component.html',
  styleUrls: ['./employee-resume.component.scss']
})
export class EmployeeResumeComponent implements OnInit {

  
  _dataEmployee:DataviewListModel;
  currentValue:number;
  dashboardDataEmployeeLevel:any;
  basicOptions:any;

  phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
  prefixPhone: string;
  

  constructor( private messageService: MessageService, public config: DynamicDialogConfig,
    public _laborRelationshipService : LaborRelationshipService, private router: Router, private actRoute: ActivatedRoute,
    private _mastersService: MastersService, public dialogService: DialogService, public dialogRef: DynamicDialogRef) { }

    _laborRelationship: LaborRelationship;
    _laborRelationshipFilter: LaborRelationshipFilter;
    idEmployed: number;
    idLaborRelationship: number;
    _idLaborRelationship: number;
    idCountry: number;

  ngOnInit(): void {
    debugger
    this._dataEmployee=this.config.data.id;
    this.currentValue=10000;
    this.loadData();
  }


  loadData() 
{

    this._laborRelationshipFilter = new LaborRelationshipFilter();

    sessionStorage.setItem('idLaborRelationship', this._dataEmployee.id.toString());
    this._idLaborRelationship = this._dataEmployee.id;
    this._laborRelationshipFilter.idLaborRelationship = this._idLaborRelationship;
    this._laborRelationshipFilter.idCompany = parseInt(this.getCompanyId());
    this._laborRelationship = new LaborRelationship();
    this._laborRelationshipService.GetLaborRelationship(this._laborRelationshipFilter).subscribe((data: LaborRelationship) => {
      this._laborRelationship = data;
      //this._dataEmployee.imagePath = this._laborRelationship.employee.pictureSource;
      this._dataEmployee.imagePath = this._laborRelationship.employee.pictureSource?this._laborRelationship.employee.pictureSource: 'https://ui-avatars.com/api/?name=' + this._dataEmployee.name + '&background=17a2b8&color=fff&rounded=true&bold=true&size=200';
      this.idCountry = this._laborRelationship.employee.phoneNumbers[0].idCountry;
      this.getPrefixes(this.idCountry);
        

        console.log(this._laborRelationship);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la información del trabajador" });
      });
    
}


onEdit(idEmployee)
{
  debugger
  this.router.navigate( ['hcm/companies-payroll-payrolldata', idEmployee]);
  this.dialogRef.close();
}

getCompanyId(){
  // obteniendo id de empresa en la variable localStorage
  var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
  var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
  var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
  return idC;
}

getPrefixes(_idCountry) {
  debugger
  return this._mastersService.getCountries( -1, _idCountry)
  .then(countries => {
      const phonePrefixes: CountryViewModel[] = [];
      
      countries.forEach(country => {
        phonePrefixes.push({
          id: country.id,
          code: country.code,
          codePrefix: ' +' +  country.prefix,
          prefix: country.prefix
        });
      });
     
      this.prefixPhone = phonePrefixes[0].codePrefix; //phonePrefixes.sort((a, b) => a.codePrefix.localeCompare(b.codePrefix));
      //this.loadPhoneNumbers();
    }).catch(error => {
      this.messageService.add({key: 'register-user', severity: 'error', summary: 'Cargar datos', detail: error.message});
    });
}


}
