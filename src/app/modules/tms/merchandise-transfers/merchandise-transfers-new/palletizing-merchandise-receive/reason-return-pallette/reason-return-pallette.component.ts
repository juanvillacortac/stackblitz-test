import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { ReasonReturnPallette } from 'src/app/models/tms/reasonReturnPallette';
import { MerchandiseTransfersService } from '../../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-reason-return-pallette',
  templateUrl: './reason-return-pallette.component.html',
  styleUrls: ['./reason-return-pallette.component.scss']
})
export class ReasonReturnPalletteComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idPalletteSelected") idPalletteSelected: number = 0;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() refreshPallettes = new EventEmitter();
  reasonReturnPallette: ReasonReturnPallette = new ReasonReturnPallette();
  submitted: boolean = false;
  reasonList: SelectItem[] = [];
  
  constructor(private motivesService: MotivesService,
    private messageService: MessageService,
    private merchandiseTranferService: MerchandiseTransfersService) { }

  ngOnInit(): void {
  }

  ngOnShow(){
    this.reasonReturnPallette = new ReasonReturnPallette();
    this.searchReason();
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchReason(){
    var filter = new MotivesFilters();
    filter.idMotivesType = 27;
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
    if (this.reasonReturnPallette.idReason > 0) {
      this.reasonReturnPallette.idBranchTransferPallette = this.idPalletteSelected;
      this.merchandiseTranferService.returnPallette(this.reasonReturnPallette).subscribe((data)=>{
        if (data.errorId == 0) {
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.showDialog = false;
          this.submitted = false;
          this.refreshPallettes.emit();
          this.showDialogChange.emit(this.showDialog);
        }
        else {
          if (data.errorId > 1000)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          else if (data.errorId == 1000)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al agregar el producto." });
        }
      },(error)=>{
        console.log(error);
      });
    }
  } 

}
