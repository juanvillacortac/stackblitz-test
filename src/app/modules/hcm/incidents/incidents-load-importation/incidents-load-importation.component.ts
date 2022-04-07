import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ValueType, Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { ListConceptsService } from '../../shared/services/concepts/list-concepts-service';
import { IncidentsService } from '../../shared/services/incidents/incidents.service';
//Model
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { ListConceptsFilter } from '../../shared/filters/Concepts/list-concepts-filter';
import { ListConcepts } from '../../shared/models/concepts/list-concepts';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { element } from 'protractor';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
import { Incidents } from '../../shared/models/incidents/incidents';

@Component({
  selector: 'app-incidents-load-importation',
  templateUrl: './incidents-load-importation.component.html',
  styleUrls: ['./incidents-load-importation.component.scss'],
  providers: [DatePipe]
})
export class IncidentsLoadImportationComponent implements OnInit {
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number;
  @Output() importChange: EventEmitter<boolean> =  new EventEmitter<boolean>()

  selectPayrollType: number = 0;
  payrollTypelist : SelectItem[] = [];
  payrollTypeObject: PayrollType = new PayrollType();
  payrollTypeModel: PayrollType[] = [];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[] = [];
  paymentDate: {name:string, value:number};

  selectConceptsIncidents: number = 0;
  incidentsList: SelectItem[] = [];
  ConceptIncidentsFilter: ListConceptsFilter = new ListConceptsFilter();
  incidentsConceptsArray: ListConcepts [] = [];
  incidentsConceptsObject: ListConcepts = new ListConcepts();
  incidentsConceptsDropdown: SelectItem[] = [];
  
  laborRelationshipMinimumFiltersSearch: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  employmentList: LaborRelationshipMinimum[] = [];
  userId: number;
  previewList: IncidentsDetail[] = [];
  clonedIncidentsModel: { [s: string]: IncidentsDetail; } = {};
  myfile: any;

  valid: number = 0;
  invalid: number = 0;

  submitted: boolean = false;
  showDialog: boolean = false;
  showList: boolean = false;
  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _listConceptsIncidentsService: ListConceptsService,
              public _laborRelationshipService: LaborRelationshipService,
              private _incidentsService: IncidentsService,
              private _httpClient: HttpClient) 
              {
              this.idCompany = parseInt(this._Authservice.currentCompany);
              this.userId = Number(this._Authservice.idUser);
               }

  ngOnInit(): void {
    this.loadPayrollTypes();
    this.loadIncidentsList();
    this.loadEmployment();
  }

  loadEmployment() {
    this.laborRelationshipMinimumFiltersSearch = {
      idLaborRelationship: -1,
      idUser: this.userId,
      idCompany: this.idCompany,
      branchOfficeId: -1,
      employmentCode: '',
      employeeName: '',
      employmentDate: "1900-01-01",
      seniorityDate: "1900-01-01",
      idEstatus: 35,
      idPayrollClass: -1,
      idTypeDocument: -1,
    }
    this._laborRelationshipService.GetLaborRelationshipMinimum(this.laborRelationshipMinimumFiltersSearch).subscribe((data: LaborRelationshipMinimum[]) => {   
      this.employmentList = data
    });
  }

  loadPayrollTypes() {
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
    this.payrollTypeModel = data;
    this.payrollTypelist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
      value: item.id,
      label: item.name
      }));
    
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de nómina" });
    });
  }

  loadPayDates(){   
    let thisYear = new Date().getFullYear();
    this.payrollCalendarFilter.year = thisYear;
    this.payrollCalendarFilter.idPayrollType = this.selectPayrollType;
    this._payrollCalendarService.GetPayrollCalendarList(this.payrollCalendarFilter).subscribe((data: PayrollCalendar) => {       
      this.payDateList = data.payrollCalendarDetail.filter(x => x.idStatus == 72).map<SelectItem>((item) =>({
        value: item.id,
        name: item.id+" - "+item.startDate.split('-').reverse().join('/') + " al " + item.finishDate.split('-').reverse().join('/'),
      }));
      this.getDataPayrollType();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });        
    });
  }

  loadIncidentsList() {
    this._listConceptsIncidentsService.GetListConcepts(this.ConceptIncidentsFilter).subscribe((data: ListConcepts[]) => {   
    if (data != null) {
      this.incidentsConceptsArray = data;
      this.incidentsConceptsDropdown =  this.incidentsConceptsArray.map<SelectItem>((item)=>(
          {
            value: item.idConcepts,
            label: item.concepts
          }
      ));
    }
      this.incidentsConceptsDropdown = this.incidentsConceptsDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
      this.getDataConceptsIncidents();
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los conceptos por incidencias" });
    });
  }

  getDataConceptsIncidents(){
    this.incidentsConceptsObject = this.incidentsConceptsArray.find(x => x.idConcepts == this.selectConceptsIncidents); 
  }
 

  getDataPayrollType(){
    this.payrollTypeObject = this.payrollTypeModel.find(x => x.id == this.selectPayrollType); 
  }

  save(){
    let incidents = new Incidents()
    incidents.idCompany = this.idCompany;
    incidents.idTypeLoadIncidents = 3;
    this.previewList.forEach(element =>{
      let date = element.dateIncident
      if(element.selected == true){
        element.dateIncident = this.datepipe.transform(date,'yyyy-MM-dd');
        incidents.incidentsDetail.push(element);
      }
    })
    console.log(incidents)
    this._incidentsService.InsertIncidents(incidents).subscribe((data) => {
      if (data == 0) {
        this.previewList = [];
        this.showList = false;
        this.resetValue();
        this.importChange.emit(false);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
       
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });
  }

  exportExcel(){
    //create new excel work book
    let workbook = new Workbook();

    //add name to sheet
    let worksheet = workbook.addWorksheet("Incidencias");

    //add column name
    let header = ["Codigo de Empleado","Incidencias","Valor","Fecha"];
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
            var columnLength = cell.value ? cell.value.toString().length : 20;
            if (columnLength > maxLength ) {
                maxLength = columnLength + 5;
            }
        });
        column.width = maxLength < 20 ? 25 : maxLength;
    });

   ///Estilos para la cabecera y llenado de celdas desplegables
    headerRow.font = { size: 12, bold: true, color: {argb:"ffffff"}};
    let incidentsList = ["\"",this.incidentsConceptsDropdown.map(a =>a.label).join(),"\""].join("");

    ///Formatos para columnas especificas
    for(let i=2; i<50;i++){
      worksheet.getCell('A' + i).numFmt = '00000';
      // worksheet.getCell('A' + i).dataValidation ={
      //   type: 'textLength',
      //   operator: 'lessThan',
      //   showErrorMessage: true,
      //   allowBlank: true,
      //   formulae: [5]
      // };
      worksheet.getCell('B' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [incidentsList],
        
      };

      worksheet.getCell('C' + i).dataValidation = {
        type: 'decimal',
        allowBlank: true,
        formulae: [0,100],
        
      };
     
      worksheet.getCell('D' + i).dataValidation = {
        type: 'date',
        allowBlank: false,
        formulae: ['12/12/1990'],
      };
    }
    //set downloadable file name
    let fname = "Formato Excel Para importación de incidencias"
    //add data and file name and download
     workbook.xlsx.writeBuffer().then((data) => {
       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       FileSaver.saveAs(blob, fname + '.xlsx');
     });
  }

  importation(){
    if(this.selectPayrollType == 0 || this.paymentDate== null){
      this.submitted = true;
    }else{
      this.showDialog = true;
    }

  }

  UploaderFile(ev){
    ///// INICIO DEL ACCEPT/////    
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    this.myfile = ev.currentFiles[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        ///Columnas a evaluar
        var column = 'ABCD';
        var aux = 0;
        var letra = column.charAt(aux);
        while (letra != "" && letra != null) {
          var fila = true;
          var cont = 0;
          while (fila) {
            cont++;
            var celda = letra+cont;
            ///Valida que se envie el valor tal cual como se escribió
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

      if(jsonData.Incidencias != undefined){/// Si existe una hoja en el excel llamada Salarios
        var error: any = "origin";
        this.previewList = [];
        if(jsonData.Incidencias.length == 0){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El archivo elegido está vacío" });
        }else{
          jsonData.Incidencias.forEach(element => {
            //Evalúa que las columnas tengan data
            if(!element["Codigo de Empleado"] || element["Codigo de Empleado"] == null || !element["Incidencias"] || element["Incidencias"] == null || 
            !element["Valor"] || element["Valor"] == null || !element["Fecha"] || element["Fecha"] == null)
            {
              error = "error"
            }else{
              ///Si el registro está lleno, se agrega al objeto a subir
              let ElList = null;
              ElList = {
                idIncidents: -1,
                idEmploymentRelationship: 0,
                numEmployees: String(element["Codigo de Empleado"]),
                employeeFirstName: '',
                employeeSecondName:'',
                employeeLastName: '',
                employeeSecondLastName:'',
                idConcepts: this.incidentsConceptsDropdown.find(x => x.label == element["Incidencias"]).value,
                codConcepts: this.incidentsConceptsArray.find(x => x.concepts == element["Incidencias"]).codConcepts.toString(),
                concepts: this.incidentsConceptsArray.find(x => x.concepts == element["Incidencias"]).concepts,
                idPayrollType: 0,
                abbreviation:'',
                payrollType: '',
                idCalendar: 0,
                idStatus:  100,
                status: 'Aprobadas',
                idUnit: this.incidentsConceptsArray.find(x => x.concepts == element["Incidencias"]).idUnid,
                unit: this.incidentsConceptsArray.find(x => x.concepts == element["Incidencias"]).unid,
                valueIncident: Number(element["Valor"]),
                dateIncident: this.datepipe.transform(element["Fecha"], 'dd/MM/yyyy'),
                dateCreate: '',
                dateUpdate: '',
                selected: false,
              }
              this.previewList.push(ElList);
            } 
        
          });
            if(error == "origin"){    ///si no hubo errores
              this.previewList.forEach(element =>{
                var registered = this.employmentList.find(x => x.employmentCode == element.numEmployees);
                if(registered != null){
                  element.selected = true;
                  element.idEmploymentRelationship = registered.idLaborRelationship;
                  element.employeeFirstName = registered.employeeName;
                  element.abbreviation = this.payrollTypeObject.abbreviation;
                  element.idPayrollType = this.selectPayrollType;
                  element.idCalendar = this.paymentDate.value;
                  this.valid = this.valid + 1;
                }else{
                  element.employeeFirstName = 'No registrado';
                  this.invalid = this.invalid + 1
                }
              })
              this.importChange.emit(true);
              this.showDialog = false;
              this.showList = true;
          }else{  /// Si error es diferente de origin (error)
            this.previewList = null;
            this.messageService.add({severity: 'error', summary: 'Error', detail: "El archivo elegido es inválido o la data dentro de él está incompleta" });
          }
        }
      }else{    ///Si el nombre de la hoja es diferente de Salarios
        this.previewList = null;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los registros deben estar en una hoja de excel llamada Salarios" });
      }
    }
    reader.readAsBinaryString(this.myfile);
  }

  onRowEditInit(model: IncidentsDetail) {
      this.clonedIncidentsModel[model.idEmploymentRelationship] = {...model};
  }

  onRowEditSave(model: IncidentsDetail, index: number) {
    if (model.valueIncident > 0) {
      this.previewList[index].valueIncident = model.valueIncident;
        delete this.clonedIncidentsModel[model.idEmploymentRelationship];       
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Valor invalido'});
    }
  }

  onRowEditCancel(model: IncidentsDetail, index: number) {
    model[index] = this.clonedIncidentsModel[model.idEmploymentRelationship];
    delete this.clonedIncidentsModel[model.idEmploymentRelationship];
  }

  deleteIncidents(index: number){
    this.previewList.splice(index,1); 
  }

  resetFile(ev){

  }

  resetValue(){
    this.selectPayrollType = 0;
    this.paymentDate = null;
  }

}
