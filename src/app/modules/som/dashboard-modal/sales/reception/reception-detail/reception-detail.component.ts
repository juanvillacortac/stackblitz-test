import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-reception-detail',
  templateUrl: './reception-detail.component.html',
  styleUrls: ['./reception-detail.component.scss']
})
export class ReceptionDetailComponent implements OnInit {
  selectedColumns: any[];
  DetailReception : any[];

  constructor(public ref: DynamicDialogRef, private router: Router) { }


  Open(idOrder:number){
    this.ref.close(0);
    this.router.navigate(['/ims/detail-inventory-count', idOrder]);
  }

  ngOnInit(): void {
    this.DetailReception  = [
      {
        Numero:1,
        Documento: 'CNF-01-001-00000001',
        Proveedor: 'CONST GRESPAN 2000 CA',
        Cant: 30,
      },
      {
        Numero:2,
        Documento: 'CNF-01-001-00000002',
        Proveedor: 'ALIMENTOS POLAR COMERCIAL, C.A.',
        Cant: 15
      },
      
    ]
    this.selectedColumns = [
      { field: 'Numero', header: 'Nro', display: 'none' },
      { field: 'Documento', header: 'Documento', display: 'table-cell' },
      { field: 'Proveedor', header:'Proveedor', display: 'table-cell' },
      { field: 'Cant', header: 'Cant', display: 'table-cell' },     
    ];
  }

}
