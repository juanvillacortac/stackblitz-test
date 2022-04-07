import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { MultimediaproductService } from 'src/app/modules/multimedia/shared/services/multimediaproduct.service';
import { MultimediaType } from 'src/app/models/multimedia/common/multimediatype';
import { CommonService } from 'src/app/modules/multimedia/shared/services/common/common.service';
import { NumberFormatStyle } from '@angular/common';
import { MultimediaFormat } from 'src/app/models/multimedia/common/multimediaformat';
import { ProductMultimediaUse } from 'src/app/models/products/productmultimediause';
import { MultimediauseService } from 'src/app/modules/masters-mpc/shared/services/MultimediaUse/multimediause.service';
import { MultimediauseFilter } from 'src/app/modules/masters-mpc/shared/filters/multimediause-filter';
import { multimediause } from 'src/app/models/masters-mpc/multimediause';
import { MultimediaUse } from 'src/app/modules/masters-mpc/shared/view-models/multimedia-use.viewmodel';
import { ProductmultimediaService } from '../../shared/services/productmultimedia/productmultimedia.service';


@Component({
  selector: 'multimedia-new-use',
  templateUrl: './multimedia-new-use.component.html',
  styleUrls: ['./multimedia-new-use.component.scss']
})
export class MultimediaNewUseComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("idmultimedia") idmultimedia: number = 0;
  @Input("multimediaUses") multimediaUses: any[] = [];
  @Output("refresh") refresh = new EventEmitter();
  multimediaUseList: multimediause[] = [];
  multimediaUseSelect: SelectItem[]
  _multimediaproduct: MultimediaProduct;
  multimediaUsesSelecteds: number[];
  // @Input("filters") filters: MultimediaProductFilter;
  submitted: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();

  _validations: Validations = new Validations();

  constructor(private productmultimediause: ProductmultimediaService,
    private _multimediaproductservice: MultimediaproductService,
    private _commonservice: CommonService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private multimediaUseService: MultimediauseService) { }

  ngOnInit(): void {
    this.multimediaUsesSelecteds = [];
    let filter = new MultimediauseFilter();
    filter.active = 1
    this.multimediaUseService.getMultimediaUsebyfilter(filter)
      .subscribe((data: multimediause[]) => {
        this.multimediaUseList = data;
        this.multimediaUseSelect=[];
        data.forEach(element => {
          if (this.multimediaUses.filter(x => x == element.id).length == 0) {
            this.multimediaUseSelect.push({
              label: element.name,
              value: element.id
            })
          }
        });
      }, (error) => {
        console.log(error);
      });


  }

  saveMultimediaUse() {
    if (this.multimediaUsesSelecteds.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe agregar al menos 1 uso multimedia para guardar" });
    }else{
      this.submitted = true;
      let relas = new Array<ProductMultimediaUse>()
      for (let element of this.multimediaUses) {
        let rela = new ProductMultimediaUse()
        rela.active = true
        rela.id = -1;
        rela.multimediaId = this.idmultimedia
        rela.multimediaUse = new MultimediaUse()
        rela.multimediaUse.id = element
        relas.push(rela)
      }
      for (let element of this.multimediaUsesSelecteds) {
        let rela = new ProductMultimediaUse()
        rela.active = true
        rela.id = -1;
        rela.multimediaId = this.idmultimedia
        rela.multimediaUse = new MultimediaUse()
        rela.multimediaUse.id = element
        relas.push(rela)
      }
  
      this.productmultimediause.postProductMultimediaUse(relas).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.refresh.emit();
          this.showDialog = false;
          this.submitted = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al asignar el uso de multimedia" });
          this.submitted = false;
        }
      }, (error) => {
        this.submitted = false;
        console.log(error);
      });
    }
  }

  hideDialog() {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
  }
}
