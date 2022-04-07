
import { Component, Input, OnInit, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Company } from '../../shared/models/masters/company';

declare var google:any;

@Component({
  selector: 'app-companies-addresses',
  templateUrl: './companies-addresses.component.html',
  styleUrls: ['./companies-addresses.component.scss']
})
export class CompaniesAddressesComponent implements OnInit, OnChanges {

  @Input() _company : Company;
  options: any;
  overlays: any[];
  dialogVisible: boolean;
  markerTitle: string;
  selectedPosition: any;
  infoWindow: any;
  draggable: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }
  
  ngOnChanges(changes: SimpleChanges): void {
      if (changes._company.currentValue.addresses != null) {
        this.initOverlays();
      }
  }

  ngOnInit(): void { 
    this.options = {
      center: {lat: 10.97774, lng: -63.95278},
      zoom: 9
     };
  }

  handleMapClick(event) {
    this.selectedPosition = event.latLng;
  }

  initOverlays() {
      if (!this.overlays||!this.overlays.length) {
        if(this._company.addresses[0].id <=0 || this._company.addresses[0].id==undefined){
          this.overlays = [
              new google.maps.Marker({position: {lat: 10.97774, lng: -63.95278}, title:"Marcador", draggable: true}),
          ];     
      } else {
        this.overlays = [
          new google.maps.Marker({position: {lat: this._company.addresses[0].latitude, lng: this._company.addresses[0].length}, title:"Marcador", draggable: true}),     
        ];
      }
    }
  }

  handleDragEnd(event) {
      this._company.addresses[0].latitude=event.overlay.internalPosition.lat();
      this._company.addresses[0].length=event.overlay.internalPosition.lng();
  } 

}
