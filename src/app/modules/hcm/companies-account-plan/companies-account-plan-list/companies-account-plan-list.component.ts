import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AccountinItemService } from '../../shared/services/accounting-item.service';
import { SegmentTypeService } from '../../shared/services/segment-type.service';
import { SeparatorTypeService } from '../../shared/services/separator-type.service';
import { AccountingItem } from '../../shared/models/masters/accounting-item';
import { AccountingItemSegmentViewModel } from '../../shared/view-models/accounting-item-segment-viewmodel';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { SelectItem } from 'primeng/api';
import { AccountingItemSegment } from '../../shared/models/masters/accounting-item-segment';
import { SegmentTypeFilter } from '../../shared/filters/segment-type-filter';
import { SeparatorTypeFilter } from '../../shared/filters/separator-type-filter';
import { SeparatorType } from '../../shared/models/masters/separator-type';
import { SegmentType } from '../../shared/models/masters/segment-type';
import { element } from 'protractor';

@Component({
  selector: 'app-companies-account-plan-list',
  templateUrl: './companies-account-plan-list.component.html',
  styleUrls: ['./companies-account-plan-list.component.scss']
})

export class CompaniesAccountPlanListComponent implements OnInit {

  @Input() idcompany;
  @Output() returnInit: EventEmitter<boolean> = new EventEmitter<boolean>();

  search:boolean=false;
  loading: boolean = false;
  accountPlans:boolean = false;
  accountPlanshowDialog:boolean=false;
  showSidebar:boolean=false;
  isCallback:boolean = false;
  _segments: AccountingItemSegment[] = [];
  newSegmentsList: AccountingItemSegment[] = [];
  _separatorTypeList: SelectItem[] = [];
  _SegmentTypeCountList: SelectItem[] = [];
  _segmentTypeList: SegmentType[] = [];
  
  
  __accountingItem: AccountingItem = new AccountingItem();
  accountingItemSegmentViewModel: AccountingItemSegmentViewModel;
  
  _segment: AccountingItemSegmentViewModel = new AccountingItemSegmentViewModel();
  segmentTypeFilter: SegmentTypeFilter = new SegmentTypeFilter();
  separatorTypeFilter: SeparatorTypeFilter = new SeparatorTypeFilter();
  separatorTypeList: SeparatorType[];
  sizeSegments: number = 0;
  separator: number = 0;
  numberSegments: number = 0;
  separatorUnChanged: number= 0;
  numberSegmentsUnChanged: number= 0;
  displayMaximizable: boolean = false;
  newId: number = -2;
  changeData: boolean[] = [false,false,false,false,false];  //arreglo de diferentes cambios para hacer true a buttonActive = [separador, num. segmentos, crear, editar, eliminar]
  buttonActive: boolean = false;  //habilita el botón Guardar plan de cuentas
  // 

    displayedColumns:ColumnD<AccountingItemSegmentViewModel>[] = 
     [
       { template: (_segments) => { return _segments.idAccountingItemDetail; }, header: 'Id',field:'idAccountingItemDetail' ,display: 'none' },
       { template: (_segments) => { return _segments.description; }, header: 'Segmento',field:'description' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.identifier; }, header: 'Identificador',field:'identifier' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.ordinal; }, header: 'Ordinal',field:'ordinal' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.createdByUser; }, header: 'Creado por',field:'createdByUser' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.updatedByUser; }, header: 'Actualizado por',field:'updatedByUser' ,display: 'table-cell' },
       ];
      permissionsIDs = {...Permissions};
   constructor(public _accountingItemService: AccountinItemService,
               private confirmationService: ConfirmationService,
               private messageService: MessageService, 
               public userPermissions: UserPermissions,
               public _segmentTypeService: SegmentTypeService,
               public _separatorTypeService: SeparatorTypeService,
               private location: Location) { 
      
   }
  ngOnInit(): void {
     this.onLoadAccountPlan();
     this.onLoadSegment();
     this.onLoadSeparatorType();
  }

    async onLoadAccountPlan(){

      this.sizeSegments = 0;      //inicializo la cantidad de segmentos
      this.loading = true;        //variable no utilizada
      this._accountingItemService.getaccountingItemByCompany(this.idcompany).then((data: AccountingItem) => {
      this.__accountingItem= data;                
      if (this.__accountingItem != null) {        //si la empresa tiene un plan de cuentas asociado se guardan los valores idSeparador y número de segmentos
        this.separator = data.idSeparatorType;   
        this.separatorUnChanged = data.idSeparatorType; 
        this.numberSegments = data.segmentNumber; 
        this.numberSegmentsUnChanged = data.segmentNumber;
        this._segments = data.accountingItemDetail; 
        this._segments.forEach(element => {         //recorre el arreglo de segmentos
          if(element != null){
            this.sizeSegments++;     //guardo el tamaño de la lista de segmentos para habilitar el botón "crear nuevo segmento"
          }
        });
      } 
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los planes de cuentas" });
    });
    this.loading = true;

  }

  async onLoadSegment()
  {

    var count = 0;
    this._segmentTypeService.getSegmentTypeList(this.segmentTypeFilter).subscribe((valor: SegmentType[]) => {
      this._segmentTypeList = valor;      //carga los segmentos de la tabla tipo de segmentos
      this._segmentTypeList.forEach(element => {
         if(element != null)
         {
          count =  count+1;
          element.position = count;   //completa el campo position de cada segmento
         }
      });
      this._SegmentTypeCountList = this._segmentTypeList.sort((a, b) => a.segment.localeCompare(b.position.toString())).map<SelectItem>((item)=>({
        label: item.position.toString(),    //carga el SelectItem con las posiciones ordenadas de menor a mayor
        value: item.idSegmentType
      }));
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de segmentos" });
    });
      
  }

   async onLoadSeparatorType(){     //carga el desplegable de tipo separador con los id y los caracteres
 
     this._separatorTypeService.getSeparatorTypeList(this.separatorTypeFilter)
     .subscribe((data)=>{     
        this.separatorTypeList = data;
        this.separatorTypeList.forEach(record =>{
          if(record.idSeparatorType != 1){
            record.name = record.name+" ( "+record.separator+" )"
          }
        })
       this._separatorTypeList = data.sort((a, b) => a.name.localeCompare(b.idSeparatorType.toString())).map<SelectItem>((item)=>({
         label: item.name,     
         value: item.idSeparatorType
       }));
     });
   }

   onEdit(segment: AccountingItemSegment) { //se instancia e inicializa el segmento a editar
    console.log(this._segments);
    this.accountingItemSegmentViewModel = new AccountingItemSegmentViewModel();
    this.accountingItemSegmentViewModel.idAccountingItemDetail = segment.idAccountingItemDetail;
    this.accountingItemSegmentViewModel.identifier = segment.identifier;
    this.accountingItemSegmentViewModel.idSegmentType = segment.idSegmentType;
    this.accountingItemSegmentViewModel.ordinal = segment.ordinal;
    this.accountingItemSegmentViewModel.description = segment.description;
    this.accountingItemSegmentViewModel.active = segment.active;
    this.showSidebar = true;
  }

  createNew() {   //se instancia e inicializa el segmento a crear
   this.accountingItemSegmentViewModel = new AccountingItemSegmentViewModel();
   this.accountingItemSegmentViewModel.idAccountingItemDetail = -1;
   this.accountingItemSegmentViewModel.identifier = "";
   this.accountingItemSegmentViewModel.idSegmentType = -1;
   this.accountingItemSegmentViewModel.ordinal = 0;
   this.accountingItemSegmentViewModel.description = "";
   this.accountingItemSegmentViewModel.active = true;
   this.showSidebar = true;
 }

  changeDropdown(){   //habilita el boton guardar si se cambió el valor de numero de segmentos o caracter separador
    if(this.separator != 0){  //si cambia o no el valor del caracter separador
      this.changeData[0] = true;
    }else{
      this.changeData[0] = false;
    }
    if(this.numberSegments != 0){  //si cambia o no el valor de la cantidad de segmentos
      this.changeData[1] = true;
    }else{
      this.changeData[1] = false;
    }
    this.activeButtonSave();  //se actualiza el etatus del botón guardar
  }

  modalDeleted(element: AccountingItemSegment){       //muestra el modal de confirmar eliminación de segmento
    debugger;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este segmento de la lista?',
      accept: () => {
        this.sizeSegments = 0;    //para eliminar un segmento se inicializa la cantidad de segmentos
        this._segments.forEach( record =>{    //se recorre la lista y se busca el segmento por su id
          if (record.idAccountingItemDetail != element.idAccountingItemDetail) {
            this.newSegmentsList.push(record);  //se guardan los segmentos diferentes y se actualiza el tamaño de la lista
            this.sizeSegments++;
          }
        });
        this._segments = this.newSegmentsList;  //se actualiza la lista original y se habilita el botón guardar con changedata
        this.newSegmentsList = [];
      },
      reject: () => {
        
      }
    });     
  }

  update(segmentItem: AccountingItemSegment){
    
    this._segments.sort((a,b) => a.ordinal < b.ordinal ? -1: a.ordinal > b.ordinal ? 1 : 0);  //ordeno la lista por ordinal
    var message = 0;
    this.sizeSegments = 0;      //se inicializa el tamaño de la lista y se busca el segmento a actualizar
    this._segments.forEach( record =>{    //Se determina la acción
        if (record.idAccountingItemDetail != segmentItem.idAccountingItemDetail) {  //si es un nuevo segmento
          this.sizeSegments++;
        }else{        //si se editó un segmento existente
          this.search = true;   //se actualiza el elemento editado y se cambia la bandera search
          this.sizeSegments++;
          message = 2;          //se indica que se modificó segmento 
        }
    })
    
    if(!this.search){ //si se trata de un nuevo registro
      this.newId--;   
      segmentItem.idAccountingItemDetail = this.newId;  //se le asigna un id negativo para diferenciarlo de los existentes en DB      
      this.sizeSegments++;          //incrementando el valor por cada nuevo segmento creado
      message = 1;                  //se indica que se creó un nuevo segmento 
      this.createNewSegment(segmentItem);
    }else{
      this.search = false;
      this.onEditSegment(segmentItem);
    }
    this.newSegmentsList = [];
    this.showSidebar = false;
    this.activeButtonSave();  //se actualiza el etatus del botón guardar
  }

  createNewSegment(element: AccountingItemSegment){
    var insert = element;
    if(this._segments.length == 0){           //si el plan no tiene segmentos guardados
      this.newSegmentsList.push(element); //inserto en la tabla
    }else{
      for (let i = 0; i < this._segments.length; i++) {           //si hay segmentos en la lista
        if(element.ordinal > this._segments[i].ordinal){      //verifica si el elemento a insertar tiene un ordinal mayor
          this.newSegmentsList.push(this._segments[i]);           //mantengo la posición del elemento de la lista
        }else{
          if(element.ordinal == this._segments[i].ordinal){   //si el ordinal es igual al de la lista
            this.newSegmentsList.push(element);               //de lo contrario, guardo el segmento externo
            element = this._segments[i];                      //arrastro el segmento de la lista para insertarlo después
            element.ordinal++;                                //incremento el ordinal para evitar repetidos
          }else{
            this.newSegmentsList.push(element);               //de lo contrario, guardo el segmento externo
            element = this._segments[i];                      //arrastro el segmento de la lista para insertarlo después
          }
        }
        var j = i+1;
        if(this._segments[j] == null){                            //si no hay mas elementos en la lista
          this.newSegmentsList.push(element);                 //lo inserto al final
        }
      }
    }

    if(this.newSegmentsList[this.newSegmentsList.length-1].ordinal > this.numberSegments){
      this._segments = this.sortListSegment(this.newSegmentsList, insert);
    }else{
      this._segments = this.newSegmentsList;
    }
  }

  onEditSegment(element: AccountingItemSegment){
    var insert = element;
    var search = this._segments.find(x => x.idAccountingItemDetail == element.idAccountingItemDetail);
    if(search.ordinal != element.ordinal){  //si el ordinal se cambió   
      var i = 0;
      while(this._segments.length > 0){     //mientras hayan segmentos en la lista
        if(search.idAccountingItemDetail != this._segments[i].idAccountingItemDetail){  //verifica si el elemento a insertar tiene un ordinal mayor
          if(element.ordinal > this._segments[i].ordinal){                              //verifica si el elemento a insertar tiene un ordinal mayor
            this.newSegmentsList.push(this._segments[i]);           //mantengo la posición del elemento de la lista
          }else{
            if(element.ordinal == this._segments[i].ordinal){   //si el ordinal es igual al de la lista
              this.newSegmentsList.push(element);               //de lo contrario, guardo el segmento externo
              element = this._segments[i];                      //arrastro el segmento de la lista para insertarlo después
              element.ordinal++;                                //incremento el ordinal para evitar repetidos
            }else{
              this.newSegmentsList.push(element);               //de lo contrario, guardo el segmento externo
              element = this._segments[i];                      //arrastro el segmento de la lista para insertarlo después
            }
          }
        }
        this._segments.shift();
        if(this._segments[i] == null){                            //si no hay mas elementos en la lista
          this.newSegmentsList.push(element);                 //lo inserto al final
        }
      }
    }else{
      this._segments.forEach(record => {                                        //si no hubieron cambios en el ordinal
        if(record.idAccountingItemDetail == element.idAccountingItemDetail){    //se maneja la misma lista
          element.createdByUser = search.createdByUser;                         //considerando los valores de creado y 
          element.updatedByUser = search.updatedByUser;                         //actualizado por antes guardado
          this.newSegmentsList.push(element);
        }else{                                                                  //de lo contrario, no modifica el registro
          this.newSegmentsList.push(record);
        }
      });
    }

    if(this.newSegmentsList[this.newSegmentsList.length-1].ordinal > this.numberSegments){  //si el ordinal se salió del rango
      this._segments = this.sortListSegment(this.newSegmentsList, insert);   //se ajusta
    }else{
      this._segments = this.newSegmentsList;                            //de lo contrario, se maneja la lista procesada
    }
  }

  sortListSegment(list: AccountingItemSegmentViewModel[], segment: AccountingItemSegment): AccountingItemSegment[]{
    
    this.newSegmentsList = [];
    var aux: AccountingItemSegmentViewModel = new AccountingItemSegmentViewModel();
    aux.ordinal = 0;
    for (let index = 0; index < this.numberSegments; index++) {   //crea una lista con todos los posibles segmentos
      if(index+1 == segment.ordinal){
        this.newSegmentsList.push(segment);           //inserta el segmento en su posición
      }else{
        this.newSegmentsList.push(aux);               //y las demás posiciones nulas
      }
    }
    
    var i= this.newSegmentsList.length-1,  j = list.length-1, k = 0;
    while(i >= 0 && j >= 0){
      if(list[j].ordinal != segment.ordinal){       //si es el elemento que tengo como segmento
        if(this.newSegmentsList[i].ordinal == 0){   //si la lista en la posición i está vacía
          list[j].ordinal = i+1;                    //cambia el ordinal
          this.newSegmentsList[i] = list[j]         //y se agrega a esa posición
          list.pop();                               //elimina el elemento
          j--;                                      //disminuye j
        }
        i--;                                        //disminuye i
      }else{                                        //de lo contrario, pasa al siguiente elemento
        j--;  
      }
    }
    list = [];
    this.newSegmentsList.forEach(element => {       //asegura de que no quede ninguna posición vacía
      if(element.ordinal != 0){
        list.push(element);
      }
    });
    this.newSegmentsList = [];                      //inicializa la lista auxiliar
    return list;                                    //retorna list
  }



  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios 
    this.newSegmentsList = [];
    this.showSidebar = valor;
  }

  saveData(){
    debugger;
    if(this.numberSegments > 0 && this.numberSegments > this.sizeSegments){
      document.getElementById("add").setAttribute("disabled","disabled");
    }
    document.getElementById("save").setAttribute("disabled","disabled");
    if(this.__accountingItem == null){    //si la empresa no tenía un plan de cuentas creado, se agrega un objeto con los siguientes datos
      this.__accountingItem = new AccountingItem();
      this.__accountingItem.idAccountingItem = -1;
      this.__accountingItem.active = true;
      this.__accountingItem.idCompany = this.idcompany;
    }   //de lo contrario, se sobreescriben los valores que posiblemente pudieron cambiar
    if(this.numberSegments == 0 || this.separator == 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Se deben completar los campos requeridos para guardar el plan de cuentas" });
      this.isCallback = true;
    }else{
      this.isCallback = false;
      this.__accountingItem.idSeparatorType = this.separator;
      this.__accountingItem.segmentNumber =this.numberSegments;
      this.__accountingItem.separatorType = "";
      this._segments.forEach( element =>{   //se buscan los segmentos nuevos (no existentes en DB)
        if(element.idAccountingItemDetail < 0){
          element.idAccountingItemDetail = -1;
          element.idAccountingItem = this.__accountingItem.idAccountingItem;
          element.ordinal = parseInt(element.ordinal.toString());
        }
      })
      this.__accountingItem.idCompany = parseInt(this.__accountingItem.idCompany.toString()); //de no ejecutar, da error
      
      if(this.__accountingItem.segmentNumber < this.sizeSegments){    //si se intenta guardar mas segmentos de los establecidos en el desplegable
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de segmentos es mayor al número de segmentos establecidos" });
      }else{
        if(this.__accountingItem.segmentNumber > this.sizeSegments){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de segmentos es menor al número de segmentos establecidos" });
        }else{

          if(this._segments[this._segments.length-1].ordinal > this.numberSegments){  //si el ordinal se salió del rango
            this._segments = this.sortListSegment(this._segments, this._segment);   //se ajusta
          }
          this.__accountingItem.accountingItemDetail = this._segments;
          this._accountingItemService.insertaccountingItem(this.__accountingItem).subscribe((data) => { //de lo contrario se insertan
        
            if (data> 0) {    //si no ocurre algún error
                 this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                 this.onLoadAccountPlan();
            }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            }else if(data == -2) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
            }else if(data == -3) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
            }else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
            }
              //window.location.reload(); Recarga la página
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          });  
          this.numberSegments = this.__accountingItem.segmentNumber; 
          this.separatorUnChanged = this.__accountingItem.idSeparatorType;
          this.numberSegmentsUnChanged =  this.__accountingItem.segmentNumber;
          this.changeData = [false,false,false,false,false];
          this.buttonActive = false;
        }
      }  
    }
    setTimeout(() => {
      document.getElementById("save").removeAttribute("disabled");
      if(this.numberSegments > 0 && this.numberSegments > this.sizeSegments){
        document.getElementById("add").removeAttribute("disabled");
      }
    }, 500);
  }
  
  
  activeButtonSave(){   //evalua los cambios ocurridos en el plan de cuentas para activar o inactivar el botón guardar
    this.buttonActive = false;
    this.changeData.forEach(element => {
      if(element == true){
        this.buttonActive = true;
      }
    });
  }

  goBack(){
    this.returnInit.emit(false);
  }
}
