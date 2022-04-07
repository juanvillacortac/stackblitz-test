import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Ambient } from 'src/app/models/masters-mpc/common/ambient';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AmbientFilter } from 'src/app/modules/masters-mpc/shared/filters/common/ambient-filter';
import { MeasurementunitsFilter } from 'src/app/modules/masters-mpc/shared/filters/measurementunits-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { MeasurementunitsService } from 'src/app/modules/masters-mpc/shared/services/measurementunits.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { Durability } from '../../../../models/products/durability';
import { ProductComplementaryComponent } from '../product-complementary.component';

@Component({
  selector: 'durabilily-panel',
  templateUrl: './durabilily-panel.component.html',
  styleUrls: ['./durabilily-panel.component.scss'],
  providers: [DatePipe]
})
export class DurabililyPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_durabilityListTemp") _durabilityListTemp: Durability[];
  @Output() durabilityListChange = new EventEmitter<Durability[]>();
  _validations: Validations = new Validations();
  submitted: boolean;
  @Input("_durability") _durability : Durability;
  @Output() showDialogChange = new EventEmitter<boolean>();
  measurementUnitList: SelectItem[];
  ambientList: SelectItem[];
  statusList: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  @Input("cambios") cambios : number = 0;
  @Output() cambioschange = new EventEmitter<number>();
  @Output("refreshchange") refreshchange = new EventEmitter<number>();
  @ViewChild('ProductComplementaryComponent', { static: false }) ProductComplementaryComponent: ProductComplementaryComponent;
  
  constructor(private _measurementUnitService: MeasurementunitsService,
    private _commonservice: CommonService,
    private messageService: MessageService,
    private _httpClient: HttpClient,
    private confirmationService: ConfirmationService,
    private datepipe: DatePipe) { }

    _Authservice : AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    if(!this._durability.edit){
      this._durability.active = true;
      this._durability.measurementUnitId = 0;
    }
    this.onLoadMeasurementUnitsList();
    this.onLoadAmbientList();
  }
  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._durability = new Durability();
  }
  
  async onLoadMeasurementUnitsList(){
    var filter: MeasurementunitsFilter = new MeasurementunitsFilter()
    filter.idGroupingUnitofMeasure = 1;
    filter.active = 1;
    this._measurementUnitService.getMeasurementUnitsbyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.measurementUnitList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }
  async onLoadAmbientList(){
    var filter: AmbientFilter = new AmbientFilter()
    filter.active = 1;
    this._commonservice.getAmbient(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.ambientList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }
  addDurability(){
    this._durability.measurementUnitId = this.measurementUnitList.filter(x => x.value == this._durability.measurementUnitId).length > 0 ? this._durability.measurementUnitId : 0;
    this.submitted = true;
    if(this._durability.duration > 0 && this._durability.idAmbient > 0 && this._durability.temperature.toString() != "" && this._durability.measurementUnitId > 0){
      if(!this._durability.edit){
        if(this._durabilityListTemp.filter(x => x.idAmbient == this._durability.idAmbient && x.measurementUnitId == this._durability.measurementUnitId).length <= 0){
          //this.ProductComplementaryComponent.dtDu.reset();
          const { fullName } = this._Authservice.storeUser;
          this._durability.temperature = this._durability.temperature.toString().slice(-1) == "." ? parseFloat(this._durability.temperature.toString() + 0) : parseFloat(this._durability.temperature.toString());
          this._durability.idDurability = this._durabilityListTemp.length + 1;
          this._durability.measurementUnit = new measurementunits;
          this._durability.ambient = new Ambient;
          this._durability.createdDate = new Date();
          this._durability.stringCreateDate = this.datepipe.transform(this._durability.createdDate, "dd/MM/yyyy");
          this._durability.createdByUser = fullName;
          this._durability.measurementUnit.name = this.measurementUnitList.find(x => x.value == this._durability.measurementUnitId).label
          this._durability.ambient.name = this.ambientList.find(x => x.value == this._durability.idAmbient).label;
         
          var list = []
          list = this._durabilityListTemp;
          list.push(this._durability);
          this._durabilityListTemp = [];
          this._durabilityListTemp = list;
          //this._durabilityListTemp = this._durabilityListTemp.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          this.durabilityListChange.emit(this._durabilityListTemp);
          this.refreshchange.emit();
          this.messageService.add({severity:'success', summary:'Agregado', detail: "Agregado con éxito"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
    
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Esta durabilidad ya existe"});
        }
      }else{
        if(this._durability.active){
          this.editDurability();
         }else{
           this.confirmationService.confirm({
           header: 'Confirmación',
           icon: 'pi pi-exclamation-triangle',
            message: 'Si inactiva la durabilidad del producto las configuraciones asociadas\ a esta se dejarán de visualizar, ¿desea proceder con la acción?',
             accept: () => {
                this.editDurability();
               },
           });
        }
      }
    }
  }
  ValidateMeasurementUnit(){
    if (this._durability.measurementUnitId == 0) {
      this._durability.temperature = 0;
    }
  }

  editDurability(){
    var listdurability = [];
        listdurability = this._durabilityListTemp.filter(x => x.idDurability != this._durability.idDurability);
        listdurability = listdurability.length == 0 ? this._durabilityListTemp.filter(x => x.idProductDurability != this._durability.idProductDurability) : listdurability;
        if (listdurability.filter(x => x.idAmbient == this._durability.idAmbient && x.measurementUnitId == this._durability.measurementUnitId).length <= 0) {
          var durability = this._durability.idDurability == undefined ? this._durabilityListTemp.findIndex(x => x.idProductDurability == this._durability.idProductDurability) : this._durabilityListTemp.findIndex(x => x.idDurability == this._durability.idDurability);
          this._durabilityListTemp[durability] = this._durability;
          this._durability.temperature = this._durability.temperature.toString().slice(-1) == "." ? parseFloat(this._durability.temperature.toString() + 0) : parseFloat(this._durability.temperature.toString());
          this._durability.measurementUnit = new measurementunits;
          this._durability.ambient = new Ambient;
          this._durability.measurementUnit.name = this.measurementUnitList.find(x => x.value == this._durability.measurementUnitId).label
          this._durability.ambient.name = this.ambientList.find(x => x.value == this._durability.idAmbient).label;
          this._durability.stringCreateDate = this.datepipe.transform(this._durability.createdDate, "dd/MM/yyyy");
          this.refreshchange.emit();
          this.durabilityListChange.emit(this._durabilityListTemp);
          this.messageService.add({severity:'success', summary:'Agregado', detail: "Agregado con éxito"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ya existe un registro de durabilidad para el ambiente seleccionado."});
        }
  }
}
