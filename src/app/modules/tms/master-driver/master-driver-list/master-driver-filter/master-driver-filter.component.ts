import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DriverFilter } from '../../shared/filter/driver-filter';
import { DriverService } from '../../shared/service/driver.service';

@Component({
  selector: 'app-master-driver-filter',
  templateUrl: './master-driver-filter.component.html',
  styleUrls: ['./master-driver-filter.component.scss']
})
export class MasterDriverFilterComponent implements OnInit {

  
  @Input() expanded : boolean = true;
  @Input("filters") filters : DriverFilter;
  @Input("loading") loading : boolean = false;

  multiples:boolean=false;
  model:boolean=false;
  _showdialog: boolean = false;
  statusList: SelectItem[];
  licenseList: SelectItem[];
  levellicenseList: SelectItem[];
  typeDriverList: SelectItem[];
  medicalCertificateList: SelectItem[];

  

  @Output("onSearch") onSearch = new EventEmitter<DriverFilter>();

  constructor(private driverService: DriverService) {
    this.statusList=[
      { label: 'Todos', value: '-1' },
      { label: 'Activos', value: '1'},
      { label: 'Inactivos', value: '0'}
      ];
    this.licenseList=[
      { label: 'Todos', value: '-1' },
      { label: 'Si', value: '1'},
      { label: 'No', value: '0'}
      ];
    this.medicalCertificateList=[
      { label: 'Todos', value: '-1' },
      { label: 'Si', value: '1'},
      { label: 'No', value: '0'}
      ];
  }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters(){      
    this.driverService.getLevelLicenseList()
    .subscribe((data)=>{
      this.levellicenseList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });

    this.driverService.getTypeDriversList()
    .subscribe((data)=>{
      this.typeDriverList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  search(){
    this.onSearch.emit(this.filters);
  }
  clearFilters(){
    this.filters.id = -1;
    this.filters.idUserDriver = -1;    
    this.filters.idTypeDriver = -1;
    this.filters.idLicenseLevel = -1;
    this.filters.idTypeIdentification = -1;
    this.filters.identification = "";
    this.filters.indMedicalCertificate = -1;
    this.filters.indDriverLicense = -1;
    this.filters.active = -1;
    this.filters.UserDriver = "";
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.model=models;
    this.multiples = multples;
    this._showdialog = true;
   }

   onSubmitOperator(data)
  {
    this.filters.operator=data.operator;
    this.filters.idUserDriver=data.operator.id;
    this.filters.UserDriver=data.operator.name;
      
  }

  onHideOperator(visible: boolean){
    this._showdialog= visible;
  }

}
