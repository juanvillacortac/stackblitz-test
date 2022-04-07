import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { SalaryAdjustmentList } from '../../shared/models/salaries/salary-adjustment-list';
import { SalaryAdjustmentPreviewFilter } from '../../shared/filters/salaries/salary-ajustment-preview-filter';
import { SalaryByLaborRelationshipService } from '../../shared/services/salaries/salary-labor-relationship.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserService } from '../../shared/services/user.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-salary-adjustment-import',
  templateUrl: './salary-adjustment-import.component.html',
  styleUrls: ['./salary-adjustment-import.component.scss']
})
export class SalaryAdjustmentImportComponent implements OnInit {

  @Output() importChange: EventEmitter<boolean> =  new EventEmitter<boolean>()

  constructor(
    private confirmationService: ConfirmationService,
    private motiveService: MotivesService, 
    private _httpClient: HttpClient, 
    private salaryAdjustmentService: SalaryByLaborRelationshipService, 
    private messageService: MessageService,
    private _salaryTypeService: SalaryTypeService,
    public userPermissions: UserPermissions,
    private _userService: UserService,
    ) { 
    this.idCompany = parseInt(this._Authservice.currentCompany);
    }

  idCompany: number;
  showPreview: boolean = false;
  showDialog: boolean = false;
  showFilters: boolean = true;
  myfile: any;
  uploadMessage: string = "";
  previewList: any[];
  previewFilter: SalaryAdjustmentPreviewFilter;
  motiveFilter: MotivesFilters = new MotivesFilters();
  salaryAdjustmentImport: SalaryAdjustmentList[];
  motives: SelectItem[] = [];
  salaryTypesDropdown: SelectItem[] = [];
  salaryTypesArray: SalaryType[] = [];
  _Authservice : AuthService = new AuthService(this._httpClient);
  permissionsIDs = { ...Permissions };


  ngOnInit(): void {
    this.loadMotives();
  }

  loadSalaryTypes(){
    var filter = new SalaryTypeFilter();
    filter.companyId = this.idCompany; 
    this._salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      if (data != null) {
          this.salaryTypesArray = data;
          this.salaryTypesDropdown =  this.salaryTypesArray.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
      this.salaryTypesDropdown = this.salaryTypesDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Carga de tipo de salarios', detail: 'Error al cargar los tipos de salario'});
    }); 
  }

  loadMotives (){
    debugger;
    this.motiveFilter.idMotivesType = 3;
    this.motiveService.getMotives(this.motiveFilter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      debugger;
      this.motives = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      //después de cargar los motivos se ordenan alfabéticamente
      this.motives = this.motives.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
      this.loadSalaryTypes();
   }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de motivos', detail: "Ha ocurrido un error cargando los motivos"});
    });
  }

  ExportExcel() {

    debugger;
    //create new excel work book
    let workbook = new Workbook();

    //add name to sheet
    let worksheet = workbook.addWorksheet("Salarios");

    //add column name
    let header = ["Codigo de Empleado","Tipo de salario","Motivo","Monto de Ajuste","Fecha de vigencia"];
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
    let salariesTypes = ["\"",this.salaryTypesDropdown.map(a =>a.label).join(),"\""].join("");
    let motives = ["\"",this.motives.map(a =>a.label).join(),"\""].join("");
    debugger;

    ///Formatos para columnas especificas
    for(let i=2; i<50;i++){
      worksheet.getColumn('A').
      worksheet.getCell('B' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [salariesTypes],
      };
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [motives],
      };
      worksheet.getCell('E' + i).dataValidation = {
        type: 'date',
        allowBlank: false,
        formulae: ['12/12/1990'],
      };
    }
    //set downloadable file name
    let fname = "Formato Excel Para importación de salarios"
    debugger;
    //add data and file name and download
     workbook.xlsx.writeBuffer().then((data) => {
       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       FileSaver.saveAs(blob, fname + '.xlsx');
     });
  }
  

  UploaderFile(ev) {
    ///// INICIO DEL ACCEPT/////
    debugger;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    this.myfile = ev.currentFiles[0];
    reader.onload = (event) => {
      debugger;
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        ///Columnas a evaluar
        var column = 'ABCDE';
        var aux = 0;
        var letra = column.charAt(aux);
        while (letra != "" && letra != null) {
          var fila = true;
          var cont = 0;
          while (fila) {
            cont++;
            var celda = letra+cont;
            ///Valida que se envie el valor tal cual como se escribió (Fecha de vigencia)
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
           
      if(jsonData.Salarios != undefined){/// Si existe una hoja en el excel llamada Salarios
        var error: any = "origin";
        this.previewList = [];
        if(jsonData.Salarios.length == 0){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El archivo elegido está vacío" });
        }else{
          jsonData.Salarios.forEach(element => {
            //Evalúa que las columnas tengan data
            if(!element["Codigo de Empleado"] || element["Codigo de Empleado"] == null || !element["Tipo de salario"] || element["Tipo de salario"] == null || 
            !element["Motivo"] || element["Motivo"] == null || !element["Monto de Ajuste"] || element["Monto de Ajuste"] == null || 
            !element["Fecha de vigencia"] || element["Fecha de vigencia"] == null)
            {
              error = "error"
            }else{
              ///Si el registro está lleno, se agrega al objeto a subir
              let ElList = null;
              ElList = {NumeroTrabajador: String(element["Codigo de Empleado"]), 
                        IdTipoSueldo: this.salaryTypesDropdown.find(x => x.label == element["Tipo de salario"]).value, 
                        IdMotivo: this.motives.find(x => x.label == element["Motivo"]).value, 
                        MontoAjuste: element["Monto de Ajuste"],
                        PorcentajeAjuste: 0,
                        FechaVigencia: element["Fecha de vigencia"]
                        }
              this.previewList.push(ElList);
            } 
        
          });
          if(error == "origin"){    ///si no hubo errores
            this.previewFilter = new SalaryAdjustmentPreviewFilter();
            var filterObject = {IdEmpresa: this.idCompany, Ajustes: this.previewList}
            this.previewFilter.adjustment = JSON.stringify(filterObject);
            this.salaryAdjustmentService.getSalariesAdjustmentPreview(this.previewFilter).subscribe((data: SalaryAdjustmentList[])=>{
              this.salaryAdjustmentImport = data;
              if(data != null){
                this.previewList = null;
                this.showDialog = false;
                this.showPreview = true;
                this.importChange.emit(true);
              }else{
                this.previewList = null;
                this.messageService.add({severity: 'error', summary: 'Error', detail: "Los registros no coinciden con los trabajadores existentes" });
              }
            });
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

  saveEmployeeExcelImport(salariesAdjustmentNew: SalaryAdjustmentList[]) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea agregar anexar '+salariesAdjustmentNew.length+' nuevo(s) registro(s)',
      accept: () => {
         debugger;
        this.salaryAdjustmentService.ImportSalaryByLaborRelationship(salariesAdjustmentNew).subscribe((data: number) => {
          if (data == 0){
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.importChange.emit(false);
            this.salaryAdjustmentImport = null;
            this.showPreview = false;
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
       },
        ///// FIN DEL ACCEPT/////
       reject: () => {
       }
     }); 
  }

  resetFile(ev){
    debugger
    this.salaryAdjustmentImport = null;
    this.showPreview = false;
  }

}
