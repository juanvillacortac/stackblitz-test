import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { BranchOfficeFilter } from '../../../shared/filters/branch-office-filter';
import { CompanyGovernmentalAgencyFilter } from '../../../shared/filters/company-governmental-agency-filter';
import { BranchOffice } from '../../../shared/models/masters/branch-office';
import { CompanyGovernmentalAgency } from '../../../shared/models/masters/company-governmental-agency';
import { CompanyGovernmentalAgencyService } from '../../../shared/services/company-governmental-agency.service';
import { CompanyGovernmentalAgencyEditDialogComponent } from './company-govAgency-edit/company-govAgency-edit.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyGovernmentalAgencyListComponent } from '../../company-govAgency-list/company-govAgency-list/company-govAgency-list.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-company-govAgency-branch-offices',
  templateUrl: './company-govAgency-branch-offices.component.html',
  styleUrls: ['./company-govAgency-branch-offices.component.scss']
})
export class CompanyGovernmentalAgencyBranchOfficeListComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  @ViewChild(CompanyGovernmentalAgencyEditDialogComponent) _companyGovernmentalAgencyEditDialogComponent : CompanyGovernmentalAgencyEditDialogComponent;
  // filters: CompanyGovernmentalAgencyFilter = new CompanyGovernmentalAgencyFilter();
  filters: CompanyGovernmentalAgency = new CompanyGovernmentalAgency();
  CompanyGovernmentalAgency: CompanyGovernmentalAgency = new CompanyGovernmentalAgency();
  public _companyGovernmentalAgency: CompanyGovernmentalAgency;
  
  @Input() idCountry: number;
  @Input() idCompany: number;
  @Input() registros : CompanyGovernmentalAgency[];
  
  // //arreglo vacio de entrada
  @Input() companyGovernmentalAgencies: CompanyGovernmentalAgency[] = [];
  // //arreglo cargado con el formulario
  // inMemoryCompanyGovernmentalAgencies: CompanyGovernmentalAgency[] = [];
  // //variable para emitir de vuelta al padre
  @Output() _companyGovernmentalAgencies = new EventEmitter<CompanyGovernmentalAgency[]>();
  @Output() parentCall = new EventEmitter();

  cols: ColumnD<CompanyGovernmentalAgency>[] =
    [
      { template: (data) => { return data.branchOfficeName; }, header: 'Sucursal', field:'branchOfficeName' ,display: 'table-cell' },
      { template: (data) => { return data.governmentalAgencyName; }, header: 'Institución / Ente', field:'governmentalAgencyName' ,display: 'table-cell' },
      { template: (data) => { return data.recordNumber; }, header: 'N° registro',field:'recordNumber' ,display: 'table-cell' },
      { template: (data) => { return data.employerContribution; }, header: '% Patronal', field:'employerContribution' ,display: 'table-cell' },
      { template: (data) => { return data.employeeContribution; }, header: '% Empleado', field:'employeeContribution' ,display: 'table-cell' },
      { template: (data) => { return `${data.firstNameLR} ${data.lastNameLR}` + `\n` + `${data.documentTypeIdentifier}-${data.documentNumber}` + `\n` + data.phone; }, header: 'Representante legal', field:'' ,display: 'table-cell' },
      
      { template: (data) => { }, field: 'accion', header: 'Acciones', display: 'table-cell' },

      // { template: (data) => { return data.governmentalAgencyShortName; }, header: 'Nombre Corto',field:'governmentalAgencyShortName' ,display: 'table-cell' },
      // { template: (data) => { return data.governmentalRecordTypeName; }, header: 'Tipo', field:'governmentalRecordTypeName' ,display: 'table-cell' },
      // { template: (data) => { return data.estatusName; }, header: 'Estatus', field:'estatusName' ,display: 'table-cell' },
      // { template: (data) => { return `${data.documentTypeIdentifier}-${data.documentNumber}`; }, header: 'Registro Fiscal', field:'' },
    ];

  // idCompanyGovernmentalAgency: number = -1;

  constructor(
    private actRoute: ActivatedRoute,
    public messageService: MessageService,
    private _companyGovernmentalAgencyService: CompanyGovernmentalAgencyService,
    public userPermissions: UserPermissions
  ) { }

  ngOnInit(): void {
    // console.log(this.branchOffices);
    // console.log(this.idCountry);
    // this.getCompanyGovernmentalAgency(this.idCountry);
  }

  save(item: CompanyGovernmentalAgency[]){
    // debugger;
    for(var i=0; i< item.length; i++){
        if(item[i].id < 0) {
          item[i].id = -1;
        }

      if (this.registros.length > 0 && this.registros.find(x => x.branchOffice == item[i].branchOffice 
        && x.governmentalAgency == item[i].governmentalAgency
        && x.governmentalRecord == item[i].governmentalRecord
        && x.governmentalRecordType == item[i].governmentalRecordType
      )) {
        this.messageService.add({severity:'error', summary:'Alerta', detail: "El registro que intenta agregar ya existe."});
      } else {
        this._companyGovernmentalAgencyService.insertCompanyGovernmentalAgency(item[i]).subscribe((data: number) => {
            if (data > 0) {
              this.companyGovernmentalAgencies = [];
              this._companyGovernmentalAgencyEditDialogComponent.inputCompanyGovernmentalAgency = new CompanyGovernmentalAgency();
              this.postSaveSearch();
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            } else if (data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});
            // }else if(data == -2){
            //   this.messageService.add({severity:'error', summary:'Alerta', detail: "La abreviatura ya se encuentra registrada."});
            // }else if(data == -3){
            //   this.messageService.add({severity:'error', summary:'Alerta', detail: "No se puede inactivar esta clasificación, debido a que tiene productos asociados"});
            } else {
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la relación."});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la relación."});
        });
      }
  }
  }

  editAndSave(item: CompanyGovernmentalAgency){
    // debugger;
      if(item.id < 0) {
        item.id = -1;
      }
      this._companyGovernmentalAgencyService.insertCompanyGovernmentalAgency(item).subscribe((data: number) => {
          if (data > 0) {
            this.companyGovernmentalAgencies = [];
            this._companyGovernmentalAgencyEditDialogComponent.inputCompanyGovernmentalAgency = new CompanyGovernmentalAgency();
            // this.postSaveSearch();
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this._companyGovernmentalAgencyEditDialogComponent.visible = false;
            this.postSaveSearch();

          } else if (data == -1){
            this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});
          // }else if(data == -2){
          //   this.messageService.add({severity:'error', summary:'Alerta', detail: "La abreviatura ya se encuentra registrada."});
          // }else if(data == -3){
          //   this.messageService.add({severity:'error', summary:'Alerta', detail: "No se puede inactivar esta clasificación, debido a que tiene productos asociados"});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la relación."});
          }
        }, (error: HttpErrorResponse)=>{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la relación."});
      });
    }

  postSaveSearch(){
    this.parentCall.emit();
  }

  inMemoryEditOpen(inMemoryModel:CompanyGovernmentalAgency, index:number){
    // debugger;
    this._companyGovernmentalAgencyEditDialogComponent.EditOpenFlag = true;
    this._companyGovernmentalAgencyEditDialogComponent.inMemoryEditOpen(inMemoryModel, index);
  }

  getCompanyGovernmentalAgency(pId){
    var filter = new CompanyGovernmentalAgencyFilter();
    filter.company = pId;
    this._companyGovernmentalAgencyService.getCompanyGovernmentalAgency(filter).subscribe((data: CompanyGovernmentalAgency[]) => {
      if (data != null) {
        // this.companyClass = data[0].name;
        // this.companyclassemit.emit(this.companyClass);
        console.log("getCompanyGovernmentalAgency");
        console.log(data);
        this._companyGovernmentalAgencies.emit(data);
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los Entes gubernamentales por Empresa"});
    });
  }

  editOrNewCompanyGovernmentalAgency(idCompanyGovernmentalAgency: number = -1){
    // debugger;
    if(this._companyGovernmentalAgencyEditDialogComponent.EditOpenFlag === false){
      this._companyGovernmentalAgencyEditDialogComponent.item = new CompanyGovernmentalAgency();
      this._companyGovernmentalAgencyEditDialogComponent.editedItem = new CompanyGovernmentalAgency();
      this._companyGovernmentalAgencyEditDialogComponent.inputCompanyGovernmentalAgency = new CompanyGovernmentalAgency();
    }

    this._companyGovernmentalAgencyEditDialogComponent.edit(idCompanyGovernmentalAgency);
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  editOrNew(model: CompanyGovernmentalAgency = new CompanyGovernmentalAgency(), index: number = 0, idCompanyGovernmentalAgency: number = -1){
    // debugger;
    // if(model.id == -1 && model.branchOffice == -1 && model.governmentalAgency == -1 && model.governmentalRecord == -1 && model.governmentalRecordType == -1 ){
    if(model.id < 0 && model.branchOffice == -1 && model.governmentalAgency == -1 && model.governmentalRecord == -1 && model.governmentalRecordType == -1 ){
        this._companyGovernmentalAgencyEditDialogComponent.EditOpenFlag = false;
        this._companyGovernmentalAgencyEditDialogComponent.item = new CompanyGovernmentalAgency();
        this._companyGovernmentalAgencyEditDialogComponent.editedItem = new CompanyGovernmentalAgency();
        this._companyGovernmentalAgencyEditDialogComponent.inputCompanyGovernmentalAgency = new CompanyGovernmentalAgency();
        // debugger;
        this._companyGovernmentalAgencyEditDialogComponent.edit(idCompanyGovernmentalAgency);
    }
    
    // if(model.id == -1 && model.branchOffice != -1 && model.governmentalAgency != -1 && model.governmentalRecord != -1 && model.governmentalRecordType != -1 ){
    if(model.id < 0 && model.branchOffice != -1 && model.governmentalAgency != -1 && model.governmentalRecord != -1 && model.governmentalRecordType != -1 ){
        this._companyGovernmentalAgencyEditDialogComponent.EditOpenFlag = true;
        // debugger;
        this._companyGovernmentalAgencyEditDialogComponent.inMemoryEditOpen(model, index);
    }

    if(model.id > 0){
      this._companyGovernmentalAgencyEditDialogComponent.EditOpenFlag = true;
      this._companyGovernmentalAgencyEditDialogComponent.EditRegisteredOpen(model);
    }

  }

  agregarLista(item:CompanyGovernmentalAgency){
    // debugger;
    this.companyGovernmentalAgencies.push(item);
  }
 

}
