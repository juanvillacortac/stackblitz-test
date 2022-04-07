import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Address } from 'src/app/models/masters/address';
import { CityService } from 'src/app/modules/masters/city/shared/services/city.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { DistrictService } from 'src/app/modules/masters/district/shared/services/district.service';
import { PlaceTypesServiceService } from 'src/app/modules/masters/places-types/shared/services/place-types-service.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { StateService } from 'src/app/modules/masters/state/shared/services/state.service';
import { StateFilters } from 'src/app/models/masters/state-filters';
declare var google:any;

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {

  identifierToEdit: number = -1;
  _validations:Validations=new Validations();
  
  @Input() visible: boolean = false;
  @Input("visibles") visibles:boolean=true;
  @Output("onSubmit") onSubmit = new EventEmitter<{address: Address, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();

  addressTypeList: SelectItem[];
  submitted: boolean = false;
  address: Address = new Address();
  form: FormGroup;
  countriesList: SelectItem[];
  statesList: SelectItem[];
  citiesList: SelectItem[];
  municipalitiesList: SelectItem[];
  housingTypesList: SelectItem[];
  acceptGuion: RegExp = /^[a-zA-Z0-9À-ú_ -] *$/
  acceptGuionNoSpace: RegExp = /^[a-zA-Z0-9À-ú_-] *$/
  options: any;
  overlays: any[];
  dialogVisible: boolean;
  markerTitle: string;
  selectedPosition: any;
  infoWindow: any;
  draggable: boolean;
  

  constructor(
    private commonService: CommonMastersService, 
    private _countryService: CountryService, 
    private _stateService: StateService, 
    private _districtService: DistrictService, 
    private _cityService: CityService,
     private _placeTypesServiceService: PlaceTypesServiceService
  ) { }

  ngOnInit(): void {
    this.submitted = false;
    this.commonService.getAddressTypes({
      id: -1
    }).subscribe((data)=>{
      this.addressTypeList = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });
 

    this.commonService.getHousingTypes().subscribe((data)=>{      
      this.housingTypesList = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });

    this._countryService.getCountriesList({
      active: 1,
      idCountry: -1,
      name:"",
      abbreviation:""
    }).subscribe((data)=>{
      this.countriesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 

    this.loadStates(this.address.idCountry);

    this.loadMunicipalities(this.address.idState);

    this.loadCities(this.address.idMunicipality);
    this.options = {
      center: {lat: 10.97774, lng: -63.95278},
      zoom: 9
     };
     this.initOverlays();
  }

  handleMapClick(event) {
    this.selectedPosition = event.latLng;
  }
  initOverlays() {
    if (!this.overlays||!this.overlays.length) {
      if(this.address.id <=0 || this.address.id==undefined){
        this.overlays = [
            new google.maps.Marker({position: {lat: 10.97774, lng: -63.95278}, title:"Marcador", draggable: true}),
           
        ];     
    } 
    else{
    this.overlays = [
      new google.maps.Marker({position: {lat: this.address.latitude, lng: this.address.length}, title:"Marcador", draggable: true}),     
  ];
   }
   }
  }

  handleDragEnd(event) {
      this.address.latitude=event.overlay.internalPosition.lat();
      this.address.length=event.overlay.internalPosition.lng();
      
  } 
  submit() {
      this.submitted = true;
      if(this.address.idCountry > 0 && this.address.idState > 0 && this.address.idCity > 0 && this.address.idMunicipality > 0 && this.address.idAddressType > 0 && this.address.idHousingType && this.address.street !="" && this.address.street.trim()!=""){
        this.address.country = this.countriesList.find(x=>x.value == this.address.idCountry).label;
        this.address.state = this.statesList.find(x=>x.value == this.address.idState).label;
        this.address.city = this.citiesList.find(x=>x.value == this.address.idCity).label;
        this.address.municipality = this.municipalitiesList.find(x=>x.value == this.address.idMunicipality).label;
        this.address.addressType = this.addressTypeList.find(x=>x.value == this.address.idAddressType).label;
        this.submitted = false;
        this.onSubmit.emit({
          address: this.address,
          identifier: this.identifierToEdit
        });   
        this.visible = false;
        this.emitVisible();
      }   
  }

  onShow()
  {
    this.submitted = false;
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.submitted = false;
    this.emitVisible();
    this.address = new Address(); 
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  edit(contactNumber: Address, identifier: number){
    this.address = Object.assign({},contactNumber);
    this.identifierToEdit = identifier;
    this.visible = true;
  }

 






  // loadCountries(){
  //   this._placeTypesServiceService.getCountriesList()
  //   .subscribe((data)=>{
  //     this.housingTypesList = data.map<SelectItem>((item)=>(
  //       {
  //         label: item.name,
  //         value: item.id
  //       }
  //     ));
  //   })
  // }

  loadStates(idCountry:number) {      
    this.statesList = [];
    this.municipalitiesList = [];
    this.citiesList = [];
    this._stateService.getStates({
      idState: -1,
      idCountry: idCountry,
      name : "",
      abbreviation : "",
      active: 1,      
    } as StateFilters).subscribe((data) => {      
      this.statesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }))
      // data.map<SelectItem>((item) => (
      //   {
      //     label: item.name,
      //     value: item.id
      //   }
      // ));
    });  
  }

  loadMunicipalities(idState:number)
  {
    this.municipalitiesList=[];
    this.citiesList=[];
    this._districtService.getDistrictList({
      IdDistrict: -1,
      idState:idState,
      status: -1,
      name : "",
      abbreviation : ""
    }).subscribe((data)=>{
      this.municipalitiesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }))
      // data.map<SelectItem>((item)=>(
      //   {
      //     label: item.name,
      //     value: item.id
      //   }
      // ));
    });  
  }

  loadCities(idMunicipality:number){
    this.citiesList = [];
    this._cityService.getCityList({
      idDistrict:idMunicipality,
      active: -1,
      idCity: -1,
      idCountry: -1,
      idState: -1,
      name: ""
    }).subscribe((data)=>{      
      this.citiesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }))
      // data.map<SelectItem>((item)=>(
      //   {
      //     label: item.name,
      //     value: item.id
      //   }
      // ));
    });
  }

  changeloadStates(idCountry:number) {      
    this.statesList = [];
    this.municipalitiesList = [];
    this.citiesList = [];
    this.address.idState=-1;
    this.address.idMunicipality=-1;
    this.address.idCity=-1;
    this._stateService.getStates({
      idState: -1,
      idCountry: idCountry,
      name : "",
      abbreviation : "",
      active: 1,      
    } as StateFilters).subscribe((data) => {      
      this.statesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
  }

  changeloadMunicipalities(idState:number)
  {
    this.municipalitiesList=[];
    this.citiesList=[];
    this.address.idMunicipality=-1;
    this.address.idCity=-1;
    this._districtService.getDistrictList({
      IdDistrict: -1,
      idState:idState,
      status: -1,
      name : "",
      abbreviation : ""
    }).subscribe((data)=>{
      this.municipalitiesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
  }

   changeloadCities(idMunicipality:number){
    this.citiesList = [];
    this.address.idCity=-1;
    this._cityService.getCityList({
      idDistrict:idMunicipality,
      active: -1,
      idCity: -1,
      idCountry: -1,
      idState: -1,
      name: ""
    }).subscribe((data)=>{      
      this.citiesList = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });
  }
  
}