import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { GlobalVariablesDeleteFilter } from '../../../shared/filters/Concepts/global-variables-delete-filter';
import { GlobalVariablesFilter } from '../../../shared/filters/Concepts/global-variables-filter';
import { GlobalVariable } from '../../../shared/models/concepts/global-variable';
import { GlobalVariablesService } from '../../../shared/services/concepts/global-variables.service';
import { GlobalVariableViewModel } from '../../../shared/view-models/concepts/global-variable-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-global-variables-tab',
  templateUrl: './global-variables-tab.component.html',
  styleUrls: ['./global-variables-tab.component.scss']
})
export class GlobalVariablesTabComponent implements OnInit {

  cloneGlobalVariables: {[s: string]: GlobalVariableViewModel;} = {};
  showEditing: boolean[] = [];

  //para funciones de la tabla
  rowGroupMetadata: any;
  public expandedRows = {};
  public isExpanded:boolean = false;
  public temDataLength:number = 0;
  showFilters: boolean = true;
  showPanel: boolean = false;
  //loading: boolean = false;
  messageSearch: string ="Cargando data, por favor espere.";
  globalVaryingObject: GlobalVariableViewModel;
  globalVarFilters: GlobalVariablesFilter = new GlobalVariablesFilter();
  globalVar: GlobalVariableViewModel[] = [];
  globalVarDelete: GlobalVariablesDeleteFilter;
  _Authservice : AuthService = new AuthService(this._httpClient);
  displayedColumns: ColumnD<any>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.description }, header: 'Descripción', field: 'description', display: 'table-cell' },
      { template: (data) => { return data.varying }, header: 'Nombre', field: 'varying', display: 'table-cell' },
      { template: (data) => { return data.varyingType }, header: 'Tipo', field: 'varyingType', display: 'table-cell' },
      { template: (data) => { return data.value }, header: 'Valor', field: 'value', display: 'table-cell' },
    ];

    // conceptsList: GlobalVariable[] = [
    //   { id: 1, varying: "1-4154", description: "Dias de Descanso", varyingType: "DiaDesc", value: 12, idTypeVarying : 3,  },
    //   { id: 2, varying: "1-4154", description: "Salario Basico Mensual", varyingType: "SBM", value: 10, idTypeVarying : 3,  },
    //   { id: 3, varying: "1-7446", description: "Dias Habiles", varyingType: "DH", value: 90, idTypeVarying : 3,  },
    //   { id: 4, varying: "1-7777", description: "Feriado", varyingType: "F", value: 67, idTypeVarying : 3,  },
    // ];

    permissionsIDs = {...Permissions};
    
  constructor(public _globalVariableService: GlobalVariablesService,
              private _companyService: CompanyService,
              private _httpClient: HttpClient,
              public userPermissions: UserPermissions,
              private _selectorService: CurrentOfficeSelectorService, //Codigo enviado por correo
              private confirmationService: ConfirmationService,
              public breadcrumbService: BreadcrumbService, 
              private messageService: MessageService) { 
                this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Codigo enviado por correo
                this.breadcrumbService.setItems([
                  { label: 'HCM' },
                  { label: 'Nómina' },
                  { label: 'Variables', routerLink: ['/hcm/payroll-variables-list'] }
                ]);
              }

  ngOnInit(): void {
    this.onLoadGlobalVariables();
  }

  onLoadGlobalVariables(){     //consulta el servicio de empresas, para obtener el id de grupo y buscar las variables globales
    //debugger;
    this.messageSearch = "No existen variables creadas.";
    var idCompany = parseInt(this._Authservice.currentCompany);
    //this._selectorService.getSelectorType()
    this._companyService.getCompany(idCompany).subscribe(data =>{
      this.globalVarFilters.idCompanyGroup = data.idGroup;
      this._globalVariableService.getGlobalVariables(this.globalVarFilters).subscribe((data)=>{   
        debugger;
        if(data.length == 0){
          this.messageSearch = "No existen resultados que coincidan con la búsqueda.";
        }
        this.globalVar = data;
        //this.updateRowGroupMetaData();
      });
    });
  }

  createNew(){
    this.globalVaryingObject = new GlobalVariableViewModel();
    this.globalVaryingObject.id = -1;
    this.globalVaryingObject.idTypeVarying = 3;
    this.globalVaryingObject.indInitialConfiguration = false;
    this.globalVaryingObject.value = "";
    this.globalVaryingObject.description = "";
    this.globalVaryingObject.varying = "";
    this.globalVaryingObject.varyingType = "";
    this.globalVaryingObject.idCompanyGroup = 1;
    this.showPanel = true;
  }

  onEdit(record: GlobalVariableViewModel){
    console.log(this.rowGroupMetadata);
    debugger;
    this.globalVaryingObject = new GlobalVariableViewModel();
    this.globalVaryingObject.id = record.id;
    this.globalVaryingObject.idTypeVarying = record.idTypeVarying;
    this.globalVaryingObject.indInitialConfiguration = record.indInitialConfiguration;
    this.globalVaryingObject.value = record.value;
    this.globalVaryingObject.description = record.description;
    this.globalVaryingObject.varying = record.varying;
    this.globalVaryingObject.varyingType = record.varyingType;
    this.globalVaryingObject.idCompanyGroup = record.idCompanyGroup;
    this.showPanel = true;
  }

//   onSort() {
//     this.globalVar.sort((a, b) => a.idTypeVarying - b.idTypeVarying);
// }

//   updateRowGroupMetaData() {
//     //debugger;
//     this.rowGroupMetadata = {};
//     this.globalVar.sort((a, b) => a.idTypeVarying - b.idTypeVarying);
//     if (this.globalVar) {
//       for (let i = 0; i < this.globalVar.length; i++) {
//         let rowData = this.globalVar[i];
//         let idTypeVarying = rowData.idTypeVarying;
//         if( this.showEditing[i] == null){
//           this.showEditing[i] = false;
//         }
//         if (i == 0) {
//           this.rowGroupMetadata[idTypeVarying] = { index: 0, size: 1 };
//         }
//         else {
//           let previousRowData = this.globalVar[i - 1];
//           let previousRowGroup = previousRowData.idTypeVarying;
//           if (idTypeVarying === previousRowGroup)
//             this.rowGroupMetadata[idTypeVarying].size++;
//           else
//             this.rowGroupMetadata[idTypeVarying] = { index: i, size: 1 };
//         }
//       }
//     }
//   }

//   onRowExpand() {
//     console.log("row expanded", Object.keys(this.expandedRows).length);
//     if(Object.keys(this.expandedRows).length === this.temDataLength){
//       this.isExpanded = true;
//     }
//   }
//   onRowCollapse() {
//     console.log("row collapsed",Object.keys(this.expandedRows).length);
//     if(Object.keys(this.expandedRows).length === 0){
//       this.isExpanded = false;
//     }
//   }

//   onPage(event: any) {
//     this.temDataLength = this.globalVar.slice(event.first, event.first + 10).length;
//     console.log(this.temDataLength);
//     this.isExpanded = false;
//     this.expandedRows={};
//   }

//   toggleExpanded(status: boolean) {
//     if(this.globalVar != undefined){
//      if(status){
//        this.globalVar.forEach(data =>{
//          this.expandedRows[data.idTypeVarying] = true;
//        })
//       }
//       else{
//        this.expandedRows={};
//       }
   
//       this.isExpanded = !this.isExpanded;
//     }
  
//    }

  saveGlobalVar(record: GlobalVariableViewModel){
    var aux = new GlobalVariable();
    aux.id = record.id;
    aux.idCompanyGroup = record.idCompanyGroup;
    aux.idTypeVarying = record.idTypeVarying;
    aux.indInitialConfiguration = record.indInitialConfiguration;
    aux.value = record.value;
    aux.description = record.description;
    aux.varying = record.varying;
    aux.varyingType = record.varyingType;

    this._globalVariableService.insertGlobalVariables(aux).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algíƒÂºn error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.onLoadGlobalVariables();
        //this.updateRowGroupMetaData();
        this.showPanel = false;
      }else if(data == -1) {    //de lo contrario se evalíƒÂºa (validaciones de otros míƒÂ³dulos)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la píƒÂ¡gina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }
   

   deleted(record: GlobalVariableViewModel): void{
     debugger;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar esta variable global?',
      accept: () => {
        this.globalVarDelete = new GlobalVariablesDeleteFilter();
        this.globalVarDelete.id = record.id;

        this._globalVariableService.deletedGlobalVariables(this.globalVarDelete).subscribe((data) => { //de lo contrario se insertan
          if (data> 0) {    //si no ocurre algun error
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.onLoadGlobalVariables();
          }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          }else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
          }else if(data == -3) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
          }else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error. No es posible eliminar una variable que se encuentra asignada a un concepto." });
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
  resetValues(value){
    this.showPanel = value;
  }

// onRowEditInit(record: GlobalVariableViewModel, index: number) {
//   this.cloneGlobalVariables[record.id] = {...record};
//   this.showEditing[index] = true;
// }

// onRowEditSave(record: GlobalVariableViewModel, index: number) {
//     if (record.description == "") {
//       this.messageService.add({severity:'error', summary: 'Error', detail:'El campo porcentaje es requerido'});
//     }  
//     else {
//       if (record.value == null) {
//         this.messageService.add({severity:'error', summary: 'Error', detail:'El campo importe es requerido'});
//     }  
//     else {
//       //definir
//     }
        
//     }
    
// }

// onRowEditCancel(record: GlobalVariableViewModel, index: number) {
//   debugger;
//   this.globalVar[index] = this.cloneGlobalVariables[record.id];
//   record.value = this.globalVar[index].value;
//   record.description = this.globalVar[index].description;
//   delete this.cloneGlobalVariables[record.id];
//   this.showEditing[index] = false;
// }

}
