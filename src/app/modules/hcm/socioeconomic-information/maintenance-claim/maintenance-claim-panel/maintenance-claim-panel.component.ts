import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MaintenanceClaim } from '../../../shared/models/laborRelationship/maintenance-claim';
import { FamilyBurdenService } from '../../../shared/services/family-burden.service';
import { FamilyBurdenFilter } from '../../../shared/filters/laborRelationship/family-burden-filter';
import { DocumentTypeService } from '../../../../masters/document-types/shared/services/document-type.service';
import { DocumentTypeFilter } from '../../../../../models/masters/document-type-filters';

import { MessageService, SelectItem } from 'primeng/api';
import { debug } from 'console';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SalaryTypeFilter } from '../../../shared/filters/salary-type-filter';
import { SalaryType } from '../../../shared/models/masters/salary-type';
import { SalaryTypeService } from '../../../shared/services/salary-type.service';
import { SalariesForPayrollData } from '../../../shared/models/laborRelationship/salariesforpayrolldata';

@Component({
  selector: 'app-maintenance-claim-panel',
  templateUrl: './maintenance-claim-panel.component.html',
  styleUrls: ['./maintenance-claim-panel.component.scss']
})
export class MaintenanceClaimPanelComponent implements OnInit {

  @Input() record: MaintenanceClaim;
  @Input() showSidebar: boolean;
  @Input() list: MaintenanceClaim[];
  @Input() salary: SalariesForPayrollData;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<MaintenanceClaim> = new EventEmitter<MaintenanceClaim>();

  familyBurdenFilter: FamilyBurdenFilter = new FamilyBurdenFilter();
  _familyDropdown: SelectItem[] = [];
  //entityTypeFilter: EntityTypeFilters = new EntityTypeFilters();
  _entityTypeDropdown: SelectItem[] = [];
  submitted: boolean = false;
  documentTypeFilter: DocumentTypeFilter = new DocumentTypeFilter();
  salaryTypesDropdown: SelectItem[];
  _validations:Validations = new Validations();
  error: number;



  constructor(private _familyBurdenService: FamilyBurdenService, 
              private _entityTypeService: DocumentTypeService,
              private messageService: MessageService,
              private salaryTypeService: SalaryTypeService) { }
  ngOnInit(): void {
    this.onLoadFamilyBurdenList();
    this.onLoadDocumentType();
    this.loadSalaryTypes();
    //debugger;
    //console.log(this.salary.amount);
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }

  submit(){
    document.getElementById("Agregar").setAttribute("disabled","disabled");
    this.error = 0;
    this.list.forEach(element => {
      if(element.idSalaryType == this.record.idSalaryType && element.idLaborRelationshipxFamilyBurden == this.record.idLaborRelationshipxFamilyBurden && element.idMaintenanceClaim != this.record.idMaintenanceClaim){
        this.error++;
      }
    });
    if(this.record.idLaborRelationshipxFamilyBurden == -1 || this.record.recordNumber =="" || this.record.porcentage <= 0.00 || this.record.amount <= 0.00){
      this.error++;
    }else{
    }
    
      //document.getElementById("Agregar").removeAttribute("disabled");
      if(this.error > 0){
        this.submitted = true;
        document.getElementById("Agregar").removeAttribute("disabled");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existe una pensión alimentaria asociada a este beneficiario con el mismo tipo de sueldo." });
      }else{
      debugger;
      this.recordSave.emit(this.record);
    }
  }

  onLoadFamilyBurdenList(){
    this.familyBurdenFilter.idLaborRelationship = this.record.idLaborRelationship;
    this.familyBurdenFilter.active = 1;
    //debugger;
    this._familyBurdenService.getFamilyBurden(this.familyBurdenFilter).subscribe((list) => {
      var aux = list;
      //debugger;
      aux.forEach(record =>{
          record.firstName = record.firstName+" "+record.lastName;
      })
      this._familyDropdown = aux.sort((a, b) => a.firstName.localeCompare(b.idLaborRelationshipxFamilyBurden.toString())).map<SelectItem>((item)=>({
        label: item.firstName,     
        value: item.idLaborRelationshipxFamilyBurden
      }));
    });
  }

  onLoadDocumentType(){
    this.documentTypeFilter.active = 1;
    this.documentTypeFilter.idEntityType = 1;
    this._entityTypeService.getdocumentTypeList(this.documentTypeFilter).subscribe((data) =>{
      var aux = data;
      this._entityTypeDropdown = aux.sort((a, b) => a.identifier .localeCompare(b.id.toString())).map<SelectItem>((item)=>({
         label: item.identifier,     
          value: item.id
       }));
    })
  }

  updateData(indicator: boolean){
    //debugger;
    if(indicator){
      this.record.amount = this.record.porcentage * this.salary.amount / 100;
    }else{
      this.record.porcentage = this.record.amount * 100 / this.salary.amount;
    }
  }

  loadSalaryTypes(){
    //debugger;
    var filter = new SalaryTypeFilter();
    this.salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      if (data != null) {
          this.salaryTypesDropdown = data.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
      this.salaryTypesDropdown.sort((a, b) => a.label.localeCompare(b.label));
      this.record.idSalaryType = this.salary.typeSalaryId;
    }); 
  }
}
