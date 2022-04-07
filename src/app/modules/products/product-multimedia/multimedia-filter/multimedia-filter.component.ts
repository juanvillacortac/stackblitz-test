import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Operator } from 'src/app/models/common/operator';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { User } from 'src/app/models/security/User';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from 'src/app/modules/multimedia/shared/services/common/common.service';
import { MultimediaFormat } from 'src/app/models/multimedia/common/multimediaformat';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { MultimediauseFilter } from 'src/app/modules/masters-mpc/shared/filters/multimediause-filter';
import { multimediause } from 'src/app/models/masters-mpc/multimediause';
import { MultimediauseService } from 'src/app/modules/masters-mpc/shared/services/MultimediaUse/multimediause.service';

@Component({
  selector: 'multimedia-filter',
  templateUrl: './multimedia-filter.component.html',
  styleUrls: ['./multimedia-filter.component.scss']
})
export class MultimediaFilterComponent implements OnInit {
  @Input("activeTab") activeTab : number = 0;
  @Input("loading") loading : boolean;
  @Input("filter") filter : MultimediaProductFilter = new MultimediaProductFilter();
  @Output("onSearch") onSearch = new EventEmitter<MultimediaProductFilter>();
  @Output("onOpenNew") onOpenNew = new EventEmitter();
  @Output() filterChange = new EventEmitter<MultimediaProductFilter>();
  rangeDates: Date[];
  today: Date = new Date()
  es: any;
  format: number = -1;
  formatsPic: SelectItem[] = [];
  formatsVid: SelectItem[] = [];
  selectedUser: User
  users: User[] = [];
  multimediaUsesSelecteds: number[];
  multimediaUses: any;
  multimediaUseList: SelectItem[] = [];
  useMultimediaString: string = "";

  constructor(public datepipe: DatePipe, 
    private userService: UserService, 
    private messageService: MessageService,
    private _commonservice: CommonService,
    private multimediaUseService: MultimediauseService) { }

  ngOnInit(): void {
    this.today = new Date();
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    }
    this.fillOperators();
    this.fillFormats();
    this.fillUseMultimedia();
  }

  openNew(){
    this.onOpenNew.emit();
  }


  search(){
    if(this.rangeDates != undefined){
      if(this.rangeDates[1] == undefined){
        this.filter = new MultimediaProductFilter()
        this.filter.multimediaFormatId = this.format
        this.filter.userId = this.selectedUser == undefined ? -1 : this.selectedUser.id 
        this.filter.startDate = this.datepipe.transform(this.rangeDates[0], 'yyyy-MM-dd')
        this.filter.endDate = this.datepipe.transform(this.today, 'yyyy-MM-dd')
        this.filter.useMultimediaId = this.useMultimediaString;
        this.filterChange.emit(this.filter)
        this.onSearch.emit(this.filter);
      }else{
        this.filter = new MultimediaProductFilter()
        this.filter.multimediaFormatId = this.format
        this.filter.userId = this.selectedUser == undefined ? -1 : this.selectedUser.id 
        this.filter.startDate = (this.rangeDates.length == 0) ? '1900-01-01' : this.datepipe.transform(this.rangeDates[0], 'yyyy-MM-dd')
        this.filter.endDate = (this.rangeDates.length == 0) ? '1900-01-01' : this.datepipe.transform(this.rangeDates[1], 'yyyy-MM-dd')
        this.filter.useMultimediaId = this.useMultimediaString;
        this.filterChange.emit(this.filter)
        this.onSearch.emit(this.filter);
      }
    }else{
      this.filter = new MultimediaProductFilter()
      this.filter.multimediaFormatId = this.format
      this.filter.userId = this.selectedUser == undefined ? -1 : this.selectedUser.id 
      this.filter.startDate = '1900-01-01'
      this.filter.endDate =  '1900-01-01'
      this.filter.useMultimediaId = this.useMultimediaString;
      this.filterChange.emit(this.filter)
      this.onSearch.emit(this.filter);
    }
    
  }

  clearFilters(){
    this.rangeDates = undefined
    this.format = -1
    this.selectedUser = undefined
    this.formatsPic = []
    this.formatsVid = [];
    this.useMultimediaString = "";
    this.multimediaUsesSelecteds = [];
  }

  fillFormats(){
    this._commonservice.getMultimediaTypebyfilter()
      .subscribe((data) => {
        let auxImg = new Array<MultimediaFormat>()
        let auxVid = new Array<MultimediaFormat>() 
        for(let mt of data){
          if(mt.id == 1){
            auxImg = mt.multimediaFormat
          }

          if(mt.id == 2){
            auxVid = mt.multimediaFormat
          }
        }
        this.formatsPic = []
        this.formatsPic = auxImg.map<SelectItem>((item) => ({
          label: item.name.toUpperCase(),
          value: item.id
        }));
        this.formatsVid = []
        this.formatsVid = auxVid.map<SelectItem>((item) => ({
          label: item.name.toUpperCase(),
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }


  fillOperators(){
    let filter = new UserFilterViewModel()
    filter.idSubsidiary = 1
    filter.idTypeUser = 1;
    this.userService.getAllUsers(filter).subscribe((data: User[]) => {
      this.users = data
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "No se pudo cargar los usuarios"});
    });
  }

  fillUseMultimedia(){
    let filter = new MultimediauseFilter();
    filter.active = 1
    this.multimediaUseService.getMultimediaUsebyfilter(filter)
      .subscribe((data: multimediause[]) => {
        this.multimediaUseList = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  ValidateChecksUseMultimedia(){
    this.useMultimediaString = "";
    if(this.multimediaUsesSelecteds.length > 0){
      for (let i = 0; i < this.multimediaUsesSelecteds.length; i++) {
        this.useMultimediaString = this.useMultimediaString == "" ? this.multimediaUsesSelecteds[i].toString() : this.useMultimediaString + "," + this.multimediaUsesSelecteds[i].toString();
      }
    }
  }
}
