import { Component, Input, OnInit } from '@angular/core';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { EmployeeTraining } from '../../shared/models/laborRelationship/employee-training';
import { EmployeeTrainingDetailViewModel } from '../../shared/view-models/employee-training-viewmodel';
import { EmployeeTrainingFilter } from '../../shared/filters/laborRelationship/employee-training-filter';
import { EmployeeTrainingService } from '../../shared/services/employee-training.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { HolidayAmountFilterComponent } from '../../holiday/holiday-amount-filter/holiday-amount-filter.component';
import { EmployeeSkillsFocusImproving } from '../../shared/view-models/employee-Skills-FocusImproving';

@Component({
  selector: 'app-employee-training-focus-improving',
  templateUrl: './employee-training-focus-improving.component.html',
  styleUrls: ['./employee-training-focus-improving.component.scss']
})
export class EmployeeTrainingFocusImprovingComponent implements OnInit {
  @Input() idLaborRelationship: number;
  permissionsIDs = {...Permissions};
  focusImproving: string[];
  employeeTrainingList: EmployeeTraining[] = [];
  employeeTrainingFilter: EmployeeTrainingFilter = new EmployeeTrainingFilter();
  trainingEmployee: EmployeeTraining = new EmployeeTraining();
  record: EmployeeSkillsFocusImproving = new EmployeeSkillsFocusImproving();
  chipConstructor: string = "";
  submitted: boolean = false;

  constructor(
    public userPermissions: UserPermissions, 
    public employeeTrainingService: EmployeeTrainingService, 
    public datepipe: DatePipe,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.onLoadEmployeeskills();
  }

  onLoadEmployeeskills(){
    this.employeeTrainingFilter.idLaborRelationship = this.idLaborRelationship;
    this.employeeTrainingService.getEmployeeTraining(this.employeeTrainingFilter).subscribe((data: EmployeeTraining) => {
      this.trainingEmployee = data;
      this.focusImproving = this.trainingEmployee.focusImproving?.split(",");
    });
  }

  CalculateMaxString(ev){
    this.chipConstructor+=(String.fromCharCode(ev.keyCode));
    if(this.chipConstructor.length <= 30){
      return true;                 //no hagas nada
    } else {
      ev.preventDefault();
      return false;                  //manda el error
    }
  }

  InitializeString(){
    this.chipConstructor = "";
  }

  submit(){
    if(this.focusImproving.length == 0){
      this.submitted = true
    }else{
      this.record.idLaborRelationship = this.idLaborRelationship;
      this.record.skills = this.focusImproving.toString();
      this.record.idtype = 2;
      this.employeeTrainingService.insertEmployeeSkillsFocusImproving(this.record).subscribe((data) => { //de lo contrario se insertan
      //
      if (data > 0) {    //si no ocurre algún error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.onLoadEmployeeskills();
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
  }
}
