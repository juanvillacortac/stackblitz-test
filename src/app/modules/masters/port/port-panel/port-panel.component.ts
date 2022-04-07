import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Port} from '../../../../models/masters/port';
import {PortFilter} from '../shared/filters/port-filter';
import {PortService} from '../shared/services/port.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CountryService } from '../../country/shared/services/country.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
@Component({
  selector: 'app-port-panel',
  templateUrl: './port-panel.component.html',
  styleUrls: ['./port-panel.component.scss']
})
export class PortPanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataPort") _dataPort: Port ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: PortFilter;
  _validations : Validations = new Validations();
  loading = false;  
  submitted: boolean;
    countriesList : SelectItem[];
    statuslist: SelectItem[] = [ { 
      label: 'Activo', value: true},
    { label: 'Inactivo', value: false}];
    constructor( private _portService: PortService, private messageService: MessageService,private _countriesService : CountryService) { }

  ngOnInit(): void {
    this.submitted = false;
    this._countriesService.getCountriesList(
      {
        idCountry:-1,
        active: 1,
        name:"",
        abbreviation:""
      })
    .subscribe((data)=>{
      this.countriesList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    }); 
    if(this._dataPort.id<=0)
    this._dataPort.active=true;  
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataPort = new Port();
    this._dataPort.id = -1;
    this._dataPort.active = true;
  }

  savePort() {
    this._dataPort.isdisabled=true;
    this.submitted = true;
    this.loading = true;
    if(this._dataPort.abbreviation!= "")
       {
        this._dataPort.abbreviation = this._dataPort.abbreviation.toLocaleUpperCase();
       }
    this._dataPort.idCountry = this.countriesList.filter(x => x.value == this._dataPort.idCountry).length> 0 ? this._dataPort.idCountry : -1;
    if (this._dataPort.name != "" && this._dataPort.name.trim() && this._dataPort.idCountry  > 0) {
     if(this._dataPort.name.trim().toLocaleUpperCase() !== this._dataPort.abbreviation.trim().toLocaleUpperCase())   
     {
      if(this._dataPort.name = this._dataPort.name.charAt(0).toLocaleUpperCase() + this._dataPort.name.substr(1).toLowerCase()){
      this._portService.UpdatePorts(this._dataPort).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataPort= new Port();
               this._dataPort.active = true;
               this._portService.getPortsList(this.filters).subscribe((data: Port[]) => {
               this._portService._portsList = data;
              });
              
              this.submitted = false;
              this.loading = false;
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el país seleccionado." });
            }
            else if(data == -3) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
            }
            //window.location.reload();
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
          });
       
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
  }
  this._dataPort.isdisabled=false;
  this.loading = false;
}
}
