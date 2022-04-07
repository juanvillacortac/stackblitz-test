import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';

@Component({
  selector: 'app-branchoffice-modal',
  templateUrl: './branchoffice-modal.component.html',
  styleUrls: ['./branchoffice-modal.component.scss']
})
export class BranchofficeModalComponent implements OnInit {
  selectedBranchOffices: any[] = [];
  loading: boolean = false
  branchofficeFilter: BranchofficeFilter = new BranchofficeFilter();
  @ViewChild('dt',{static:false})dt:any
  @Input() visible: boolean = false;
  @Input("_idCompany") _idCompany: number = -1;
  @Input("_idBranchOrigin") _idBranchOrigin: number = -1;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("_AddBranchOfficesModal") _AddBranchOfficesModal = new EventEmitter<{ branchOfficeList: any[] }>();
  displayedColumns: ColumnD<Branchoffice>[] =
  [
    { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
    { template: (data) => { return data.branchOfficeName; }, header: 'Sucursal', field: 'branchOfficeName', display: 'table-cell' },
    { template: (data) => { return data.branchOfficeTypeName; }, header: 'Tipo', field: 'branchOfficeTypeName', display: 'table-cell' }
  ];
  constructor(public _branchofficeService: BranchofficeService,private messageService: MessageService) { }

  ngOnInit(): void {

  }
  
  
  searchBranchOffice(){
    debugger;
    this.loading = true;
    this.branchofficeFilter.idCompany=this._idCompany;
    this.branchofficeFilter.active=1;
    this._branchofficeService.getBranchOfficeList(this.branchofficeFilter).subscribe((data: Branchoffice[]) => {
      this._branchofficeService._branchOfficeList = data;
      if(this.selectedBranchOffices.length == 0)
      {
        this.selectedBranchOffices =  this._branchofficeService._branchOfficeList.filter(x=>x.id == this._idBranchOrigin);
      }
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  
  onShow() {
   
    this.searchBranchOffice();
    this.emitVisible();
  }

  onHide() {
    this.visible = false;
    this.emitVisible();
    if(this.dt!=undefined){
      this.dt.reset();
 }
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }
  

  submitBranchOffices() {
       if (this.selectedBranchOffices.length > 0) {
         this._AddBranchOfficesModal.emit
         ({
          branchOfficeList : this.selectedBranchOffices
         });
         this.visible = false;
       } else {
         this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
       }
  }

  onRemoveSelected(id: number)
  {
    debugger;
    const index: number = this.selectedBranchOffices.findIndex(x=> x.idBranchOffice == id );
    this.selectedBranchOffices.splice(index, 1);
  }
}
