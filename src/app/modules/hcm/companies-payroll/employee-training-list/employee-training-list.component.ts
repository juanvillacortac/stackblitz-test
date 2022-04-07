import { Component, Input, OnInit } from '@angular/core';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { EmployeeTraining } from '../../shared/models/laborRelationship/employee-training';
import { EmployeeTrainingDetailViewModel } from '../../shared/view-models/employee-training-viewmodel';
import { Training } from '../../shared/models/laborRelationship/training';
import { EmployeeTrainingService } from '../../shared/services/employee-training.service';
import { EmployeeTrainingFilter } from '../../shared/filters/laborRelationship/employee-training-filter';
import { TrainingViewModel } from '../../shared/view-models/training-viewmodel';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeTrainingList } from '../../shared/models/laborRelationship/employee-training-list';
import { EmployeeTrainingDetail } from '../../shared/models/laborRelationship/employee-training-detail';
import { TrainingFilter } from '../../shared/filters/laborRelationship/training-filter';

@Component({
  selector: 'app-employee-training-list',
  templateUrl: './employee-training-list.component.html',
  styleUrls: ['./employee-training-list.component.scss'],
  providers: [DatePipe]
})
export class EmployeeTrainingListComponent implements OnInit {


  @Input() idLaborRelationship: number;

  permissionsIDs = {...Permissions};
  // recordList: any[] = [
  //   {id: 1, abbreviation: "IC", trainingType: "Curso", description: "Inducción corporativa", objective: 28, assignedValue: 1, startDate: new Date("1900-01-01"), startDateString: "1900-01-01", endDate: new Date("1900-01-01"), endDateString: "1900-01-01"},
  //   {id: 2, abbreviation: "AVS", trainingType: "Curso", description: "Formación técnica Asesor de Ventas y Servicio ", objective: 21, assignedValue: 1, startDate: new Date("2000-01-21"), startDateString: "2000-01-21", endDate: new Date("2000-03-18"), endDateString: "2000-03-18"},
  //   {id: 3, abbreviation: "APS", trainingType: "Curso", description: "Formación técnica Asesor de Producción y Servicio ", objective: 21, assignedValue: 1, startDate: new Date("2010-11-09"), startDateString: "2010-11-09", endDate: new Date("2010-11-27"), endDateString: "2010-11-27"},
  //   {id: 4, abbreviation: "VE", trainingType: "Evaluación", description: "Programa de formación de ventas especializadas", objective: "Meta", assignedValue: 0, startDate: new Date("2021-07-19"), startDateString: "2021-07-19", endDate: new Date("2021-07-22"), endDateString: "2021-07-22"},
  // ];
  //agregar en el viewmodel de EmployeeTraining los campos startDateString y endDateString
  showSidebar: boolean = false;
  employeeTrainingList: EmployeeTraining[] = [];
  //employeeTrainingArray: EmployeeTrainingViewModel[] = [];
  trainingEmployee: EmployeeTraining = new EmployeeTraining();
  newGroupingModel: EmployeeTraining;
  newTraining: TrainingViewModel;
  trainingFilter: TrainingFilter = new TrainingFilter();
  saveTraining: Training;
  newEmployeeTraining: EmployeeTrainingDetailViewModel;
  employeeTrainingFilter: EmployeeTrainingFilter = new EmployeeTrainingFilter();
  disabledSave: number = 0;
  clonedLaborEmployeeTraining: { [s: string]: EmployeeTrainingDetailViewModel; } = {};
  showEditing: boolean[] = [];
  recordList: EmployeeTrainingDetailViewModel[];
  maxDate: Date = new Date();
  assignedValueMessage: string = "";
  //datesArray: any[] = [];


  
  constructor(  public userPermissions: UserPermissions, 
                public employeeTrainingService: EmployeeTrainingService, 
                public datepipe: DatePipe,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,) { }

  ngOnInit(): void {
    this.onLoadEmployeeTraining();
  }

  // evaluateDate(value: Date, ind: number){
  //   value;
  //   this.recordList[ind].startDateCalendar;
  //   this.recordList[ind].endDateCalendar;

  //   debugger;
  // }

  sendPanel(){
    this.newTraining = new TrainingViewModel();
    this.newTraining.idTraining = -1;
    this.newTraining.idTrainingType = -1;
    this.newTraining.objective = null;
    this.newTraining.naming = "";
    this.newTraining.assignedValue = null;
    this.newTraining.description = "";
    this.showSidebar = true;
  }

  onLoadTraining(){

  }

  onLoadEmployeeTraining(){
    this.employeeTrainingFilter.idLaborRelationship = this.idLaborRelationship;
    this.recordList = [];
    this.employeeTrainingService.getEmployeeTraining(this.employeeTrainingFilter).subscribe((data: EmployeeTraining) => {
      this.trainingEmployee = data;
      debugger;
      this.trainingEmployee.training.filter(x => x.active).forEach(element =>{
        var object = new EmployeeTrainingDetailViewModel();
        object.assignedValue = element.assignedValue;
        object.idTraining = element.idTraining;
        object.idTrainingType = element.idTrainingType;
        object.training = object.idTrainingType == 1 ? 'Curso' : 'Evaluación';
        object.naming = element.naming;
        object.description = element.description;
        object.objective = element.objective;
        object.endDate = element.endDate;
        object.endDateCalendar = new Date(element.endDate)
        object.endDateCalendar.setMinutes(object.endDateCalendar.getMinutes() + object.endDateCalendar.getTimezoneOffset());
        object.startDate = element.startDate;
        object.startDateCalendar = new Date(element.startDate)
        object.startDateCalendar.setMinutes(object.startDateCalendar.getMinutes() + object.startDateCalendar.getTimezoneOffset());
        object.idLaborRelationship = this.trainingEmployee.idLaborRelationship;
        this.recordList.push(object);
        //this.datesArray.push({initDate: object.endDateCalendar, endDate: object.startDateCalendar})
      });
    });
  }

  hiddenSidebar(resp: boolean){
    this.showSidebar = resp;
  }

  validation(ev){
    debugger;
  }

  onRowEditInit(record: EmployeeTrainingDetailViewModel, index: number) {
    debugger;
    //this.recordList[index].assignedValue = null;
    this.showEditing[index] = true;
    //var startDate = new Date(this.recordList[index].startDateString);  
    this.recordList[index].startDateCalendar.setMinutes(this.recordList[index].startDateCalendar.getMinutes() + this.recordList[index].startDateCalendar.getTimezoneOffset());
    //var endDate = new Date(this.recordList[index].endDateString);
    this.recordList[index].endDateCalendar.setMinutes(this.recordList[index].endDateCalendar.getMinutes() + this.recordList[index].endDateCalendar.getTimezoneOffset());
    this.clonedLaborEmployeeTraining[record.idTraining] = {...record};
    this.disabledSave++;
  }
  onRowEditSave(record: EmployeeTrainingDetailViewModel, index: number) {
    debugger;
    if(record.assignedValue == null){
      this.onRowEditCancel(record, index);
      this.assignedValueMessage = "El valor es requerido";
    }else{
      if(record.assignedValue <= 0){
        this.onRowEditCancel(record, index);
        this.assignedValueMessage = "El valor debe ser mayor a cero";
      }else{
        if(record.idTrainingType == 1 && record.assignedValue > record.objective){
          this.onRowEditCancel(record, index);
          this.assignedValueMessage = "El valor no puede ser superior al objetivo";
        }else{
          this.assignedValueMessage = "";
          this.showEditing[index] = false;
          delete this.clonedLaborEmployeeTraining[record.idTraining];
          this.disabledSave--;
          this.savingTraining(record);
        }
      }
    }

    if(this.assignedValueMessage != ""){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.assignedValueMessage});
    }
    
  }
  onRowEditCancel(record: EmployeeTrainingDetailViewModel, index: number) {
    //debugger;
    this.recordList[index] = this.clonedLaborEmployeeTraining[record.idTraining];
   
    record.assignedValue = this.recordList[index].assignedValue;
    delete this.clonedLaborEmployeeTraining[record.idTraining];
    this.showEditing[index] = false;
    this.disabledSave--;
  }

  savingTraining(record: EmployeeTrainingDetailViewModel){
      // this.newEmployeeTraining = new EmployeeTrainingDetailViewModel();
      // this.newEmployeeTraining = record;
      debugger;
      record.objective = parseFloat(record.objective.toString());
      record.idLaborRelationship = this.idLaborRelationship;
      record.startDate = this.datepipe.transform(record.startDateCalendar, "yyyy-MM-dd");
      record.endDate = this.datepipe.transform(record.endDateCalendar, "yyyy-MM-dd");
      this.employeeTrainingService.insertEmployeeTraining(record).subscribe((data) => { //de lo contrario se insertan
        //
        if (data > 0) {    //si no ocurre algún error
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          if(this.showSidebar){
            this.onLoadEmployeeTraining();
            this.showSidebar = false;
          }
          //this.onLoadlaborEmployeeTraining(); llamado al search para recargar la lista
        }else if(data == -1) {    
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });

            }else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
            }else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
          }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          }
          //window.location.reload(); Recarga la pagina
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        });  
  }

  deletedEmployeeTraining(record: EmployeeTrainingDetailViewModel){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea desvincular este curso del trabajador?',
      accept: () => {
        record.objective = parseFloat(record.objective.toString());
        record.idLaborRelationship = this.idLaborRelationship;
        record.startDate = this.datepipe.transform(record.startDateCalendar, "yyyy-MM-dd");
        record.endDate = this.datepipe.transform(record.endDateCalendar, "yyyy-MM-dd");
        this.employeeTrainingService.deletedEmployeeTraining(record).subscribe((data) => { //de lo contrario se insertan
          if (data> 0) {    //si no ocurre algun error
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.onLoadEmployeeTraining();
          }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          }else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
          }else if(data == -3) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
          }else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
          }
            //window.location.reload(); Recarga la pagina
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
        });  
      },
      reject: () => {
        
      }
    }); 

   
    
  }

}
