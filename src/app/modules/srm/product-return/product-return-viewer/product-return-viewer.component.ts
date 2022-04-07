import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-product-return-viewer',
  templateUrl: './product-return-viewer.component.html',
  styleUrls: ['./product-return-viewer.component.scss']
})
export class ProductReturnViewerComponent implements OnInit {

  constructor(public breadcrumbService: BreadcrumbService) { 
    this.breadcrumbService.setItems([
      { label: 'SCM' },
      { label: 'SRM',routerLink: ['/srm/dashboard-general-srm']  },
      { label: 'Devoluciones de compra', routerLink: ['/srm/product-return-viewer'] }
    ]);
  }
  
  
  
  ngOnInit(): void {
  }

}
