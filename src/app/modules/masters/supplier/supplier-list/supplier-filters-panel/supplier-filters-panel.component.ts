import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { CountryService } from '../../../country/shared/services/country.service';
import { DocumentTypeService } from '../../../document-types/shared/services/document-type.service';
import { SupplierclasificationService } from '../../../supplierclasification/shared/services/supplierclasification.service';
import { SupplierextendFilter } from '../../shared/filters/supplierextend-filter';
import { SupplierService } from '../../shared/services/supplier.service';

@Component({
  selector: 'app-supplier-filters-panel',
  templateUrl: './supplier-filters-panel.component.html',
  styleUrls: ['./supplier-filters-panel.component.scss'],
  providers: [DatePipe]
})
export class SupplierFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: SupplierextendFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  // initDate: Date = new Date();
  // endDate: Date = new Date();
  today : Date = new Date();
  initDate: Date;
  endDate: Date;
  maxDate: Date = new Date();
  maxEndDate: Date = new Date();
  minDate: Date = new Date();
  ClasificationList: SelectItem[];
  countriesList: SelectItem[];
  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];
    documentTypeList : SelectItem[];
    IdentifierTypeList : DocumentTypes[];
  @Output("onSearch") onSearch = new EventEmitter<SupplierextendFilter>();

  constructor(public _SupplierService : SupplierService,public datepipe: DatePipe,private _countriesService :CountryService,public _DocumentTypeService : DocumentTypeService,
    private supplierClasificationService: SupplierclasificationService) { }

  ngOnInit(): void {
    this.loadFilters();
  }


  search() 
  {
    this.filters.identifier = this.filters.ididentifier!= -1 && this.filters.ididentifier!= null  ? this.documentTypeList.find(x=>x.value == this.filters.ididentifier).label: "";
    this.filters.startdate = this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    if(this.filters.iDate != null && (this.filters.iDate != undefined  && this.filters.fDate == null || this.filters.fDate == undefined))
    {
     // this.endDate = this.initDate;
      this.filters.enddate = this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
    }else
    {
      this.filters.enddate = this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
    }
    this.onSearch.emit(this.filters);
  }


  clearFilters() {
    this.filters.socialreason = "";
    this.filters.document = "";
    this.filters.idSupplierclasification = -1;
    this.filters.idcountry = -1;
    this.filters.ididentifier = -1;
    this.filters.active = -1;
    this.filters.startdate = "";
    this.filters.enddate = "";
    this.filters.iDate=null;
    this.filters.fDate=null;
     this.initDate=null; 
     this.endDate=null;   
     // this.initDate = new Date();
    // this.endDate = new Date();
  }

 

  loadFilters(){
    this._countriesService.getCountriesList(   {
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

    this.supplierClasificationService.getSupplierClasificationList(   {
      id:-1,
      name: "",
      active:1
    })
    .subscribe((data)=>{
      this.ClasificationList = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification)).map((item)=>({
        label: item.supplierclasification,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
  }

  onLoadDocumentType(idCountry : number)
  {   
    if(idCountry !=null)
    {
    this.filters.ididentifier = -1;
    this.filters.document = "";
    let filter= new DocumentTypeFilter();
    filter.idCountry =idCountry;
    this._DocumentTypeService.getdocumentTypeList(filter).subscribe((data)=>{
      this.IdentifierTypeList = data;
      this.documentTypeList = data.sort((a,b) => b.entityType.id-a.entityType.id).map((item)=>({
        label: item.identifier + "-" + item.name,
        value: item.id
      }))
    });
   }
   else
     this.documentTypeList =[];
  }


  isToday(dateParameter) {
    return dateParameter.getDate() === this.today.getDate() && dateParameter.getMonth() === this.today.getMonth() && dateParameter.getFullYear() === this.today.getFullYear();
  }
  ValidDate(init, final) {
    let today = this.isToday(init);
    if(!today)
    {
      let initialDate = new Date(init);
      let date = new Date(initialDate.setMonth(initialDate.getMonth()+1));
      this.maxEndDate = date >= this.today ? this.today : date;
    }else 
    {
      this.filters.fDate = this.filters.iDate;
    }
  }



}
