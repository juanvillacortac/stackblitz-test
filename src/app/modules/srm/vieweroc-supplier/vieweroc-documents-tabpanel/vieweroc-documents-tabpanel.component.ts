import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-vieweroc-documents-tabpanel',
  templateUrl: './vieweroc-documents-tabpanel.component.html',
  styleUrls: ['./vieweroc-documents-tabpanel.component.scss']
})
export class ViewerocDocumentsTabpanelComponent implements OnInit {

  constructor(public breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'SRM'},
      { label: 'Proveedores',routerLink: ['/srm/dashboard-supplier']  },
      { label: 'Visor de documentos- proveedor', routerLink: ['/srm/viewer-document'] }
    ]);
   }

  ngOnInit(): void {
  }

  handleChange(e) {
    var index = e.index;
  }
}
