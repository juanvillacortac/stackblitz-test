import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-reason-panel',
  templateUrl: './reason-panel.component.html',
  styleUrls: ['./reason-panel.component.scss']
})
export class ReasonPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("packingBranchOfficeListDB") packingBranchOfficeListDB: PackingByBranchOffice[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  reasonList: SelectItem[] = [];
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("packingBranchOffice") packingBranchOffice: PackingByBranchOffice;
  @Input("idModule") idModule : number = 0;
  @Input("packingBranchOfficeTemp") packingBranchOfficeTemp: PackingByBranchOffice;
  @Output("refreshPackingBranchOffice") refreshPackingBranchOffice = new EventEmitter();
  submitted: boolean = false;
  constructor(private motivesService: MotivesService,
    private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService) { }

  ngOnInit(): void {
  }

  ngOnShow(){
    this.searchReason(this.idModule);
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchReason(idModule: number){
    var filter = new MotivesFilters();
    filter.idModule = idModule;
    this.motivesService.getMotives(filter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.reasonList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de motivos"});
    });
  }

  saveReason(){
    this.submitted = true;
    if (this.packingBranchOffice.idReason > 0) {
      var packingBranchOfficelist: PackingByBranchOffice[] = [];
      this.packingBranchOffice.idProduct = parseInt(this.idproduct.toString());
      this.packingBranchOffice.idPacking = this.packingBranchOffice.idPacking;
      this.packingBranchOffice.idBranchOffice = parseInt(this.idBranchOffice.toString());
      this.packingBranchOffice.idSuplier = this.packingBranchOffice.idSuplier == -1 ? 0 : this.packingBranchOffice.idSuplier;
      this.packingBranchOffice.idStatus = this.packingBranchOffice.idStatus == -1 ? 1 : this.packingBranchOffice.idStatus;
      packingBranchOfficelist.push(this.packingBranchOffice);
        this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data)=>{
        if (data > 0) {
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.showDialog = false;
          this.submitted = false;
          this.refreshPackingBranchOffice.emit();
          this.showDialogChange.emit(this.showDialog);
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar los indicadores"});
        }
      },(error)=>{
        console.log(error);
      });
    }
  } 
}
