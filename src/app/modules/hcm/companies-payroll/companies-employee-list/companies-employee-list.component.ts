//General
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';

//Models
import { ColumnD } from 'src/app/models/common/columnsd';
import { Company } from 'src/app/models/masters/company';
import { CompanyService } from 'src/app/modules/hcm/shared/services/company.service';
import { CompaniesFilter } from 'src/app/modules/masters/companies/shared/filters/companies-filter';
import { CompanyEmployee } from '../../shared/models/masters/company-employee';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { LaborRelationshipMinimumExcel } from '../../shared/models/laborRelationship/labor-relationship-minimumexcel';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
//Services
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
//Theme
import { Dropdown } from 'primeng/dropdown';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { CompaniesEmployeeFilterComponent } from '../companies-employee-filter/companies-employee-filter/companies-employee-filter.component';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { LaborRelationshipMinimumExcelList } from '../../shared/models/laborRelationship/labor-relationship-minimumExcelList';
import { IdentifierTypeFilter } from '../../shared/filters/identifier-type-filter';
import { IdentifierType } from '../../shared/models/masters/IdentifierType';
import { UserService } from '../../shared/services/user.service';
import { MaritalStateFilter } from '../../shared/filters/marital-state-filter';
import { MaritalState } from '../../shared/models/masters/marital-state';
import { MaritalStateService } from '../../shared/services/marital-state.service';
import { BranchOfficeService } from '../../shared/services/branch-office.service';
import { repeat } from 'rxjs/operators';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { BaseModel } from 'src/app/models/common/BaseModel';


@Component({
  selector: 'companies-employee-list',
  templateUrl: './companies-employee-list.component.html',
  styleUrls: ['./companies-employee-list.component.scss']
})

export class CompaniesEmployeeListComponent implements OnInit {

  employees: LaborRelationshipMinimum[];
  listlaborRelationshipMinimumFilters: LaborRelationshipMinimumFilter[] = [];
  listlaborRelationshipMinimumexcel: LaborRelationshipMinimumExcel[] = [];
  laborRelationshipMinimumFiltersSearch: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  laborRelationshipMinimumFilters: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  //branchOffices: SelectItem[];
  arrayDocValues:  any[];
  arrayMaritalStateValues:  any[];
  file: any;
  permissionsIDs = { ...Permissions };
  userId: number;
  _Authservice : AuthService = new AuthService(this._httpClient);
  currentOffice: any;
  branchOfficesList: CompanyOffice[] = []; 
  userOffices: SelectItem[] = []; 
  menu: MenuItem[];

  displayedColumns: ColumnD<LaborRelationshipMinimum>[] =
    [
      { template: (data) => { return data.idEmployee; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.idLaborRelationship; }, header: 'idLaborRelationship', field: 'idLaborRelationship', display: 'none' },
      { template: (data) => { return data.employmentCode == "" ? "Sin asignar" : data.employmentCode; }, header: 'Código', field: 'employmentCode', display: 'table-cell' },
      { template: (data) => { return data.pictureSource == "" ? "Sin asignar" : data.pictureSource; }, header: 'Foto', field: 'pictureSource', display: 'table-cell' },
      { template: (data) => { return data.employeeName == "" ? "Sin asignar" : data.employeeName; }, header: 'Nombre', field: 'employeeName', display: 'table-cell' },
      { template: (data) => { return data.fullDocument }, header: 'Documento', field: 'fullDocument', display: 'table-cell' },
      { template: (data) => { return data.jobPosition == "" ? "Sin asignar" : data.jobPosition; }, header: 'Cargo', field: 'jobPosition', display: 'table-cell' },
      { template: (data) => { return data.employmentDate }, header: 'Ingreso', field: 'employmentDate', display: 'table-cell' },
      { template: (data) => { return data.seniorityDate }, header: 'Antigüedad', field: 'seniorityDate', display: 'table-cell' },
      { template: (data) => { return data.estatus; }, header: 'Estatus', field: 'estatus', display: 'table-cell' },
    ];

  constructor(
    private _companyService: CompanyService,
    public _laborRelationshipService: LaborRelationshipService,
    public breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    public userPermissions: UserPermissions,
    private activatedRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _maritalStateService: MaritalStateService,
    private router: Router,
    private _layoutSerice: LayoutService,
    private _securityService: SecurityService,
    private confirmationService: ConfirmationService,
    private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
  ) {
    this.userId = Number(this._Authservice.idUser);
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown
    this.breadcrumbService.setItems([
      { label: 'HCM' },
      { label: 'Recursos Humanos' },
      { label: 'Trabajadores', routerLink: ['/hcm/companiesemployee-list'] }
    ]);
  }


  // arrayDocValues = 
  //  [{ name: "DNI ( - )", value: 1 },
  //  { name: "Extranjero ( E )", value: 2 },
  //  { name: "Natural ( V )", value: 2 },
  //  { name: "SECURITY SOCIAL NUMBER ( - )", value: 3 },
  //  { name: "Turista ( P )", value: 5 }];
  // arrayMaritalStateValues = 
  //  [
  //    { name: "Casado(a)", value: 1 },
  //    { name: "Concubino(a)", value: 2 },
  //    { name: "Soltero(a)", value: 1 },
  //    { name: "Viudo(a)", value: 1 }
  //  ];

  
  items: MenuItem[];
  // showFilters: boolean = false;
  showFilters: boolean = true;
  displayModal: boolean = false;
  loading: boolean = false;
  companiesList: SelectItem[] = [];
  objectToExportExcel: LaborRelationshipMinimumExcel[] = [];
  @ViewChild(CompaniesEmployeeFilterComponent) CompaniesEmployeeFilterComponent: CompaniesEmployeeFilterComponent;

  ngOnInit(): void {
    this.loadUserOffices(); 
    this.loadNaturalIdentifiersType();
    this.loadMaritalStates();
    const laborRelationshipMinimumFilters = this.activatedRoute.snapshot.queryParamMap.get('laborRelationshipMinimumFilters');
    debugger;
    if (laborRelationshipMinimumFilters === null || laborRelationshipMinimumFilters === "null") {
      this.listlaborRelationshipMinimumFilters = [];
    } else {
      this.listlaborRelationshipMinimumFilters = JSON.parse(laborRelationshipMinimumFilters);
      this.laborRelationshipMinimumFilters = this.listlaborRelationshipMinimumFilters[0];
      this.laborRelationshipMinimumFiltersSearch = this.listlaborRelationshipMinimumFilters[1];
      // console.log(this.router.url.substring(0, 22));
      // this.router.navigateByUrl(this.router.url.substring(0, 22));
      // this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
      var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);
    }
    //this.loadCompanies();
    this.initialSearch();
    ///las siguientes funciones fueron colocadas aqui porque en la importacion presentaba errores
    
  }

  searchLaborRelationshipMinimum() {
    debugger;
    this.laborRelationshipMinimumFiltersSearch = {
      idLaborRelationship: -1,
      idUser: this.laborRelationshipMinimumFilters.idUser,
      idCompany: parseInt(this.getCompanyId()),
      branchOfficeId: this.laborRelationshipMinimumFilters.branchOfficeId,
      employmentCode: this.laborRelationshipMinimumFilters.employmentCode,
      employeeName: this.laborRelationshipMinimumFilters.employeeName,
      employmentDate: this.laborRelationshipMinimumFilters.employmentDate == "" || this.laborRelationshipMinimumFilters.employmentDate == undefined ? "1900-01-01" : this.laborRelationshipMinimumFilters.employmentDate,
      seniorityDate: this.laborRelationshipMinimumFilters.seniorityDate == "" || this.laborRelationshipMinimumFilters.seniorityDate == undefined ? "1900-01-01" : this.laborRelationshipMinimumFilters.seniorityDate,
      idEstatus: this.laborRelationshipMinimumFilters.idEstatus,
      idPayrollClass: -1,
      idTypeDocument: -1,
    }
    this.laborRelationshipMinimumFilters;
    this.ngOnInit();
  }

  initialSearch() {
    debugger;
    this.loading = true;
    this._laborRelationshipService.GetLaborRelationshipMinimum(this.laborRelationshipMinimumFiltersSearch).subscribe((data: LaborRelationshipMinimum[]) => {
      this._laborRelationshipService._laborRelationshipMinimumList = data;
      this._laborRelationshipService._laborRelationshipMinimumList.forEach((element) => {
        element.fullDocument = element.identifier + "-" + element.documentNumber;
      });
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }

  getCompanyId(){
    // obteniendo id de empresa en la variable localStorage
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
    return idC;
  }

  //-Excel Helper
  loadNaturalIdentifiersType() {
    var filter: IdentifierTypeFilter = new IdentifierTypeFilter();
    filter.idDocumentType = -1;
    filter.idEntityType = 1;
    this._companyService.getCompany(parseInt(this.getCompanyId())).subscribe( (data: Company) => {
      if (data != null) {
        debugger;
        filter.idCountry = data.idCountry;    //filtra el pais perteneciente a la empresa
        this._userService.getIdentifierTypesByCountry(filter).subscribe( (data: IdentifierType[]) => {
          if (data != null) {
              this.arrayDocValues = data.map((item)=>(
                  {
                    value: item.id,
                    name: item.type.toString().concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.arrayDocValues.sort((a, b) => a.name.localeCompare(b.name));
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
    });  
  }

  loadMaritalStates() {
    var filter = new MaritalStateFilter();
    this._maritalStateService.getMaritalStatesList(filter).subscribe( (data: MaritalState[]) => {
      if (data != null) {
        this.arrayMaritalStateValues = data.map((item)=>(
            {
              value: item.idMaritalState,
              name: item.maritalStatus
            }
        ));
    }
      this.arrayMaritalStateValues.sort((a, b) => a.name.localeCompare(b.name))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de estados civiles', detail: 'Error al cargar los estados civiles'});
    });
  }

 

  //Excel Helpers
  // search() {
  //   this.loading = true;
  //   this._laborRelationshipService.GetLaborRelationshipMinimum(this.laborRelationshipMinimumFiltersSearch).subscribe((data: LaborRelationshipMinimum[]) => {
  //     this._laborRelationshipService._laborRelationshipMinimumList = data;
  //     this._laborRelationshipService._laborRelationshipMinimumList.forEach((element) =>{
  //       element.fullDocument = element.identifier+"-"+element.documentNumber;
  //     });
  //     this.loading = false;
  //   }, (error: HttpErrorResponse)=>{
  //     this.loading = false;
  //       this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
  //   });
  // }

  async onEdit(idEmployee, idLaborRelationship) {
    const queryParams: any = {};
    this.listlaborRelationshipMinimumFilters = [];
    this.listlaborRelationshipMinimumFilters.push(this.laborRelationshipMinimumFilters);
    this.listlaborRelationshipMinimumFilters.push(this.laborRelationshipMinimumFiltersSearch);

    queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.listlaborRelationshipMinimumFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };

    sessionStorage.setItem('idLaborRelationship', idLaborRelationship);
    // this.router.navigate( ['hcm/companies-payroll-information', idEmployee], navigationExtras );
    this.router.navigate(['hcm/companies-payroll-payrolldata', idEmployee], navigationExtras);
  }

  openNew() {
    debugger;
    //this.CompaniesEmployeeFilterComponent.idCompany.value = parseInt(this.getCompanyId());
    sessionStorage.setItem('idLaborRelationship', "-1");
    //sessionStorage.setItem('branchOfficeId', this.CompaniesEmployeeFilterComponent.branchOfficeId.value);
    const queryParams: any = {};
    this.listlaborRelationshipMinimumFilters = [];
    this.listlaborRelationshipMinimumFilters.push(this.laborRelationshipMinimumFilters);
    this.listlaborRelationshipMinimumFilters.push(this.laborRelationshipMinimumFiltersSearch);
    queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.listlaborRelationshipMinimumFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
    // this.router.navigateByUrl(url);
    // debugger;
    // this.router.navigate(['hcm/companies-payroll-information', -1], {state: navigationExtras});
    sessionStorage.setItem('idLaborRelationship', "-1");
    this.router.navigate(['hcm/companies-payroll-payrolldata', -1], navigationExtras);
  }

  //Export Record List Table to Excel
  ExporListExcel() {
    //debugger;
    this.ConvertExceltoJsonObject(this._laborRelationshipService._laborRelationshipMinimumList);
  }

  //Export Excel Format To Employee Data Import
  ExportExcel() {

    debugger;
    //create new excel work book
    let workbook = new Workbook();

    //add name to sheet
    let worksheet = workbook.addWorksheet("Empleados");

    //add column name
    let header = ["Tipo de Documento", "Estado Civil","Genero","Numero de Documento","Primer Nombre","Primer Apellido","Fecha de Nacimiento","Sucursal","Codigo Empleado","Email Corporativo"];
    let headerRow = worksheet.addRow(header);
    headerRow.fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'17a2b8'},
      bgColor:{argb:'FF0000FF'}
    };
    //// Controla el tamaño de las celdas ///////
    worksheet.columns.forEach(function(column){
      var maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
                maxLength = columnLength + 5;
            }
        });
        column.width = maxLength < 10 ? 15 : maxLength;
    });
    // for(let j=0; j<8; j++){
    //   const dobCol = worksheet.getColumn(j);
    //   dobCol.width = 23;
    // }
    headerRow.font = { size: 12, bold: true, color: {argb:"ffffff"}};
    let DocTypes = ["\"",this.arrayDocValues.map(a =>a.name).join(),"\""].join("");
    let BranchOffice = ["\"",this.userOffices.map(a =>a.label).join(),"\""].join("");
    let arrayMaritals = ["\"",this.arrayMaritalStateValues.map(a =>a.name).join(),"\""].join("");
    debugger;
    for(let i=2; i<50;i++){
      worksheet.getCell('A' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [DocTypes],
      };
      worksheet.getCell('B' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [arrayMaritals],
      };
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"M,F"'],
      };
      worksheet.getCell('G' + i).dataValidation = {
        type: 'date',
        allowBlank: false,
        formulae: ['12/12/1990'],
      };
      worksheet.getCell('H' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [BranchOffice],
      };
    }
    //set downloadable file name
    let fname = "Formato Excel Para importación de Empleados"
    debugger;
    //add data and file name and download
     workbook.xlsx.writeBuffer().then((data) => {
       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       FileSaver.saveAs(blob, fname + '.xlsx');
     });
  }

  //Export to .xls Methods
  ConvertExceltoJsonObject(objectToExcel: any) {
    import("xlsx").then(xlsx => {
      debugger;
      const worksheet = xlsx.utils.json_to_sheet(objectToExcel);
      const workbook = { Sheets: { 'Empleados': worksheet }, SheetNames: ['Empleados'] };
      var column = 'ABCDEFGHIJKLMNOPQRST';
      var aux = 0;
      var letra = column.charAt(aux);
      while (letra != "" && letra != null) {
        var cell = letra+1;
        switch (cell) {
          case 'A1':
            workbook.Sheets.Empleados[cell].v = "Id de relacion laboral" 
            break;
          case 'B1':
            workbook.Sheets.Empleados[cell].v = "Id de sucursal"   
            break;
          case 'C1':
            workbook.Sheets.Empleados[cell].v = "Sucursal"     
            break;
          case 'D1':
            workbook.Sheets.Empleados[cell].v = "Id de estatus"   
            break;
          case 'E1':
            workbook.Sheets.Empleados[cell].v = "Estatus"
            break;    
          case 'F1':
            workbook.Sheets.Empleados[cell].v = "Id de empresa"   
            break;
          case 'G1':
            workbook.Sheets.Empleados[cell].v = "Id de empleado"   
            break;
          case 'H1':
            workbook.Sheets.Empleados[cell].v = "Nombre del empleado"     
            break;
          case 'I1':
            workbook.Sheets.Empleados[cell].v = "Id de tipo de documento"   
            break;
          case 'J1':
            workbook.Sheets.Empleados[cell].v = "Entidad de documento"     
            break;
          case 'K1':
            workbook.Sheets.Empleados[cell].v = "Numero de documento"
            break;
          case 'L1':
            workbook.Sheets.Empleados[cell].v = "Identificador"
            break;
          case 'M1':
            workbook.Sheets.Empleados[cell].v = "Id de cargo laboral"
            break;
          case 'N1':
            workbook.Sheets.Empleados[cell].v = "Cargo laboral"
            break;
          case 'O1':
            workbook.Sheets.Empleados[cell].v = "Ruta de imagen"
            break;
          case 'P1':
            workbook.Sheets.Empleados[cell].v = "Codigo Empleado"
            break;
          case 'Q1':
            workbook.Sheets.Empleados[cell].v = "Fecha de ingreso"
            break;
          case 'R1':
            workbook.Sheets.Empleados[cell].v = "Fecha de antiguedad"
            break;
          case 'S1':
            workbook.Sheets.Empleados[cell].v = "Fecha de egreso"
            break;
          case 'T1':
            workbook.Sheets.Empleados[cell].v = "Documento del Empleado"
            break;           
        }
        workbook.Sheets.Empleados[cell].s = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'17a2b8'},
          bgColor:{argb:'FF0000FF'},
          size: 12, 
          bold: true, 
          color: {argb:"ffffff"}
        };
        aux++;
        letra = column.charAt(aux);
      }
      // workbook.Sheets.Empleados['!cols'].forEach(function(column){
      //   var maxLength = 0;
      //     column["eachCell"]({ includeEmpty: true }, function (cell) {
      //         var columnLength = cell.value ? cell.value.toString().length : 10;
      //         if (columnLength > maxLength ) {
      //             maxLength = columnLength + 5;
      //         }
      //     });
      //     column.width = maxLength < 10 ? 15 : maxLength;
      // });
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Empleados");
    });
  }

  //Download to Client Device Method
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exportar_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  //Import Excel File to insert Minimum Employee Data
  UploaderFile(ev) {
    ///// INICIO DEL ACCEPT/////
    debugger;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = this.file.currentFiles[0];
    var employeeList : LaborRelationshipMinimumExcelList = new LaborRelationshipMinimumExcelList();
    reader.onload = (event) => {
      debugger;
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        var column = 'ABCDEFGHIJ';
        var aux = 0;
        var letra = column.charAt(aux);
        while (letra != "" && letra != null) {
          var fila = true;
          var cont = 0;
          while (fila) {
            cont++;
            var celda = letra+cont;
            if(sheet[celda]){
              sheet[celda].v = sheet[celda].w;
            }else{
              fila = false;
            }
          }
          aux++;
          letra = column.charAt(aux);
        }
        debugger;
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //for (let index = 0; index < jsonData.Empleados.length; index++) {
        //jsonData.Empleados[index].documentNumber = jsonData.Empleados[index].documentNumber;
        //jsonData.Empleados[index].employmentCode = jsonData.Empleados[index].employmentCode;
        //jsonData.Empleados[index].birthDate= jsonData.Empleados[index].birthDate.toString();
      //}
      if(jsonData.Empleados != undefined){
        let dataList: LaborRelationshipMinimumExcelList = new LaborRelationshipMinimumExcelList();
        var error: any = "origin";
        if(jsonData.Empleados.length == 0){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El archivo elegido está vacío" });
        }else{
          jsonData.Empleados.forEach(element => {
            let ElList = new LaborRelationshipMinimumExcel();
            ElList.birthDate = !element["Fecha de Nacimiento"] || element["Fecha de Nacimiento"] == null ? error = true : element["Fecha de Nacimiento"].toString();
            ElList.branchOfficeId = !element["Sucursal"] || element["Sucursal"] == null ? error = 0 : this.userOffices.filter(x => x.label == element["Sucursal"])[0].value;
            ElList.companyId = parseInt(this.getCompanyId());
            ElList.corporateEmail = !element["Email Corporativo"] || element["Email Corporativo"] == null ?  error = true : element["Email Corporativo"];
            ElList.documentNumber = !element["Numero de Documento"] || element["Numero de Documento"] == null ? error = "true" : String(element["Numero de Documento"]);
            ElList.employmentCode = !element["Codigo Empleado"] || element["Codigo Empleado"] == null? error = "true" : String(element["Codigo Empleado"]);
            ElList.firstLastName = !element["Primer Apellido"] || element["Primer Apellido"] == null? error = true : element["Primer Apellido"];
            ElList.firstName = !element["Primer Nombre"] || element["Primer Nombre"] == null? error = true : element["Primer Nombre"];
            ElList.gender = !element["Genero"] || element["Genero"] == null? error = true : element["Genero"];
            ElList.idDocumentType = !element["Tipo de Documento"] || element["Tipo de Documento"] == null? error = true : this.arrayDocValues.filter(x => x.name == element["Tipo de Documento"])[0].value;
            ElList.idMaritalState = !element["Estado Civil"] || element["Estado Civil"] == null? error = true : this.arrayMaritalStateValues.filter(x => x.name == element["Estado Civil"])[0].value;
            dataList.employees.push(ElList);
          });
          if(error == "origin"){
            employeeList = dataList;
            this.confirmationService.confirm({
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              message: '¿Está seguro que desea agregar anexar '+employeeList.employees.length+' nuevo(s) registro(s)?',
              accept: () => {
                //this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 1" });
                this.saveEmployeeExcelImport(employeeList);
                // 
              },
               ///// FIN DEL ACCEPT/////
              reject: () => {
  
              }
            }); 
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El archivo elegido es inválido o la data dentro de él esta incompleta" });
          }
        }
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los registros deben estar en una hoja de excel llamada Empleados" });
      }
      
      
    }
    reader.readAsBinaryString(file);
  }

  //Save Employee Data Method
  saveEmployeeExcelImport(LaborRelationshipMinimum: LaborRelationshipMinimumExcelList) {
    //debugger;
    this._laborRelationshipService.ImportMinimunEmployeeData(LaborRelationshipMinimum).subscribe((data: number) => {
      if (data == 0){
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.displayModal = false;
      }else if(data == -1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El numero de documento se encuentra registrdo" });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    }
    },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Ha ocurrido un error al insertar empleado" });
      });
  }

  hideFileupload(ev){
    this.file = ev;
  } 

  toDate(str: string | Date) {
    if (!str) {
      return undefined
    }
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      d.getFullYear(),
      padLeft(d.getMonth() + 1),
      padLeft(d.getDate()),
    ].join('-');
    return dformat
  }

  prueba(num: number){
    switch (num) {
      case 1:
        this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 1" });
        break;
    
      case 2:
        this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 2" });
        
        break;
      case 3:
        this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 3" });
        
        break;
      case 4:
        this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 4" });
        
        break;
    }
  }

  loadFile(event){
    this.file = event.file;
  }

  private loadUserOffices() {
    this._layoutSerice.getCompanyBrachOfficesByUser(this.userId)
      .then(offices => { this.saveDefaultOffice(offices); return offices; })
      .then(offices => this.branchOfficesList = offices)
      .then(() => this.getCurrentOffice())
      .then(() => this.loadUserModules())
      .then(() => this.loadBranchOffices(this.branchOfficesList[0].offices))
      .catch(error => this.handleError(error));
  }

private saveDefaultOffice(companies) {
  debugger;

    if (this._Authservice.currentOffice !== -1) { return; }
    const firstCompany = companies[0];
    const firstOffice = firstCompany?.offices[0];
    this.onOfficeSelected({ idOffice: firstOffice?.id ?? -1, idCompany: firstCompany?.id ?? -1,nameCompany: firstCompany?.name ?? '',nameOffice: firstOffice?.name ?? '' });
  }

  onOfficeSelected(companyOffice) {
    this._Authservice.updateCurrentOffice(companyOffice.idOffice, companyOffice.idCompany,companyOffice.nameCompany,companyOffice.nameOffice);
    this._Authservice.removeRouteVisited();
    this.getCurrentOffice();
    this.loadUserModules();
  }

  private getCurrentOffice() {
    this.currentOffice = {
      idOffice: this._Authservice.currentOffice,
      idCompany: this._Authservice.currentCompany

    };
  }

private loadUserModules() {
    this._securityService.getModulesTreeByUser(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
      .then(modulesTree => this.setupModulesTree(modulesTree))  //no
      .then(_ => this.loadUserAccesses())
      .catch(error => this.handleError(error));
  }

  private setupModulesTree(modulesTree) {
    this.resetMenuItems();          //no
    this.menu = this.menu.concat(modulesTree);
  }

  private resetMenuItems() {
    this.menu = [{
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink:  ['home'],
    }];
  }

  private loadUserAccesses() {
    this._securityService.getAccessPromise(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
      .then(accesses => { this._layoutSerice.sendToStorage(accesses); })
      //.then(_ => this.silentReload())
      .catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.error('Error at layout-componet', error);
  }

  loadBranchOffices(list: BaseModel[]){
    this.userOffices = list.map<SelectItem>((item)=>(
      {
        value: item.id,
        label: item.name
      }
    ));
    this.userOffices.push({label: "Todos", value: -1})
    this.userOffices.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    //this.userOffices = this.userOffices.sort((a, b) => a.label.localeCompare(b.label));
  }
}
