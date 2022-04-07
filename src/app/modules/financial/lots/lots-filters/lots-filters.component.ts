import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations'
import { LotsFilter } from '../../../../models/financial/lotsFilter';

import { Module } from '../../../../models/financial/Module';
import { LotsService } from '../shared/services/lots.service';

import { Lots } from '../../../../models/financial/lots';
import { Router } from '@angular/router';
import { FormControl , FormGroup} from '@angular/forms';
import { StateLot } from '../../../../models/financial/StateLot';
@Component({
  selector: 'app-lots-filters',
  templateUrl: './lots-filters.component.html',
  styleUrls: ['./lots-filters.component.scss']
})
export class LotsFiltersComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filter") filter : LotsFilter;
  @Input("iExist") iExist : Boolean;
  @Input("loading") loading : boolean;
  @Input("filtered") filtered : boolean;
  @Output("onSearch") onSearch = new EventEmitter();
  @Output() filterChange = new EventEmitter<LotsFilter>();
  stateList: SelectItem[] ;
  @Output() iExistChange = new EventEmitter<Boolean>();
  @Output() filteredChange = new EventEmitter<Boolean>();
  _data: LotsFilter =  new LotsFilter();
  aggrupationMU: SelectItem[];
  DatesCreateStart: Date = undefined;
  DatesCreateEnd= undefined;
  DatesCreateEndTop= new Date();
  DateStart: string = "01/01/1900";
  DateEnd: string = "01/01/1900";
  myGroup: any;
  @ViewChild('focusContent') focusButton: any;


  _validations: Validations = new Validations();
  
  permiteEntrada: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Si', value: 1 },
    { label: 'No', value: 0 },
  ];
  constructor(
    private service: LotsService,
    private messageService: MessageService,
    private router: Router,
  ) {

    this.myGroup = new FormGroup({
      date: new FormControl(''),
      date2: new FormControl('')
    });
   
  }

  ngOnInit(): void {
    if(this.iExist == false){
      this.filter.allowsEntry = -2;
     this.filter.indStatusLot = -2;
    }
     
    // if(this.filter == undefined){
    //   this.filter = new LotsFilter();
    // }

    
    // this._measurementunitsservice.getGroupingUnitMeasure()
    // .subscribe((data)=>{
    //   this.aggrupationMU = data.map((item)=>({
    //     label: item.name,
    //     value: item.id
    //   }));
    // },(error)=>{
    //   console.log(error);
    // });
    this.reset();
    this.getStates();
  }

  getStates() {
    let aux = new StateLot();
    aux.id = -1
    aux.name = "Todos"
    /*data.push(aux)*/
    this.service.getStateLot().subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      let filterArray = [{ ...aux }, ...data];

      
      this.stateList = filterArray.map<SelectItem>((item) => ({​​​​​​​​
      label:item.name,
      value:item.id}));
    }, (error) => {
      console.log(error);
    });
              
    
  }

  onSelectMethodDateStart(event) {
    let d = new Date(Date.parse(event));
    this.DatesCreateStart = d;
    this.DateStart = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
    this.focusButton.nativeElement.focus();
    
  }                
  onSelectMethodDateEnd(event) {
    let d = new Date(Date.parse(event));
    this.DatesCreateEnd = d;
    this.DateEnd = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
    this.focusButton.nativeElement.focus();
    
  }
  search(){
    // if(this.checkFilter === true){
    //   this.filter.allowsEntry = 1;
    // }

    // if(this.checkFilter === false){
    //   this.filter.allowsEntry = 0;
    // }

    // if(this.checkFilter === undefined){
    //   this.filter.allowsEntry = -1;
    // }
    this.iExist = true;
    this.iExistChange.emit(this.iExist);
  if(this.DateStart == undefined ){
    this.DateStart = "01/01/1900";

  }
  if(this.DateEnd == undefined){
    this.DateEnd = "01/01/1900";
  }
 
    this.filter.creationStartDate =  this.DateStart;
    this.filter.creationEndDate =  this.DateEnd;

    this.filtered = true;
    this.filteredChange.emit(this.filtered);

    this.filterChange.emit(this.filter);
    this.onSearch.emit();

  }
  reset(){
    this.myGroup.get('date').setValue(undefined);
    this.myGroup.get('date2').setValue(undefined);
  }
  clearFilters(){
 debugger;
    // save current route first
    // const currentRoute = this.router.url;

    // this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
    //     this.router.navigate([currentRoute]); // navigate to same route
    // }); 
     this.filter.id =-1;
     this.filter.indStatusLot = -2;
     this.filter.allowsEntry = -1;
     this.DateStart = "01/01/1900";
     this.DateEnd = "01/01/1900";
     this.filter.lotName = "";
     this.filter.allowsEntry = -2;
     
     this.reset();




  }
  

}
