import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { WastageFilter } from 'src/app/modules/masters-mpc/shared/filters/wastage-filter';
import { WastageService } from 'src/app/modules/masters-mpc/shared/services/WastageService/wastage.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { Wastage } from '../../shared/view-models/wastage.viewmodel'

@Component({
  selector: 'wastage-panel',
  templateUrl: './wastage-panel.component.html',
  styleUrls: ['./wastage-panel.component.scss']
})
export class WastagePanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("_wastageListTemp") _wastageListTemp: Wastage[];
  @Output() wastageChange = new EventEmitter<Wastage[]>();
  @Input("_wastage") _wastage: Wastage;
  wastagelist: SelectItem[];
  submitted: boolean = false;
  validations: Validations = new Validations()
  @Output("refreshchange") refreshchange = new EventEmitter<number>();

  constructor(private _wastageservice: WastageService,
    private messageService: MessageService,) { }

  ngOnInit(): void {
    this._wastage.wastageTypeId = this._wastage.wastageTypeId == -1 ? 1 : this._wastage.wastageTypeId;
    this.onLoadWastageList();
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  AddWastage(){
    this.submitted = true;
    if(this._wastage.wastageTypeId > 0 && this._wastage.percent > 0 && this._wastage.percent <= 100){
      if(this._wastage.indedit == false){
        if(this._wastageListTemp.filter(x => x.wastageTypeId == this._wastage.wastageTypeId).length <= 0){
          this.saveWastage();
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Este tipo de merma ya existe"});
        }
      }else{
        var listwastage = this._wastageListTemp.filter(x => x.idWastage != this._wastage.idWastage);
        if(listwastage.filter(x => x.wastageTypeId == this._wastage.wastageTypeId).length <= 0){
          this.editWastage();
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Este tipo de merma ya existe"});
        }
      }
    }
  }

  saveWastage(){
    this._wastage.performaceFactor = this._wastage.performaceFactor.toString() == "" || this._wastage.performaceFactor.toString() == undefined ? 0 : this._wastage.performaceFactor.toString().slice(-1) == "." ? parseFloat(this._wastage.performaceFactor.toString() + 0) : parseFloat(this._wastage.performaceFactor.toString());
    this._wastage.percent = this._wastage.percent.toString().slice(-1) == "." ? parseFloat(this._wastage.percent.toString() + 0) : parseFloat(this._wastage.percent.toString());
    this._wastage.idWastage = this._wastageListTemp.length + 1;
    this._wastage.wastageTypeName = this.wastagelist.find(x => x.value == this._wastage.wastageTypeId).label;
    this._wastage.active = true;
    this.refreshchange.emit();
    this._wastageListTemp.push(this._wastage);
    this.submitted = false;
    this.wastageChange.emit(this._wastageListTemp);
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  editWastage(){
    this._wastage.performaceFactor = this._wastage.performaceFactor.toString() == "" || this._wastage.performaceFactor.toString() == undefined ? 0 : this._wastage.performaceFactor.toString().slice(-1) == "." ? parseFloat(this._wastage.performaceFactor.toString() + 0) : parseFloat(this._wastage.performaceFactor.toString());
    this._wastage.percent = this._wastage.percent.toString().slice(-1) == "." ? parseFloat(this._wastage.percent.toString() + 0) : parseFloat(this._wastage.percent.toString());
    var wastage = this._wastageListTemp.findIndex(x => x.idWastage == this._wastage.idWastage);
    this._wastageListTemp[wastage] = this._wastage;
    this._wastage.wastageTypeName = this.wastagelist.find(x => x.value == this._wastage.wastageTypeId).label;
    this.submitted = false;
    this.refreshchange.emit();
    this.wastageChange.emit(this._wastageListTemp);
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  onLoadWastageList(){
    var filter: WastageFilter = new WastageFilter()
    filter.active = 1;
    this._wastageservice.getWastagebyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.wastagelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }
}
