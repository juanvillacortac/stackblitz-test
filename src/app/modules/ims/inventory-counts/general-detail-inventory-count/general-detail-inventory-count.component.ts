import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { DetailInventoryFilter } from '../shared/filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../shared/filter/inventory-count-filter';

@Component({
  selector: 'app-general-detail-inventory-count',
  templateUrl: './general-detail-inventory-count.component.html',
  styleUrls: ['./general-detail-inventory-count.component.scss'],
  providers: [DatePipe]
})
export class GeneralDetailInventoryCountComponent implements OnInit {
  
  loading: boolean = false
  @Input("idconteo") idconteo: number = 0;
  _conteo : InventoryCount=new InventoryCount(); 
  filterDetail: DetailInventoryFilter = new DetailInventoryFilter ();
  filter: InventoryCountFilter = new InventoryCountFilter ();
  show: boolean = false;
  showTransit :boolean = false;
  showconteo:boolean=true;
  constructor(public breadcrumbService: BreadcrumbService,private rutaActiva: ActivatedRoute) {  this.breadcrumbService.setItems([
    { label: 'OSM' },
    { label: 'IMS' },
    { label: 'Conteos de inventario', routerLink: ['/ims/inventory-count-list'] }
   ]); }

  ngOnInit(): void {
    this.idconteo= this.rutaActiva.snapshot.params.id,
  
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.idconteo= this.rutaActiva.snapshot.params.id
      }
    );
  }

}
