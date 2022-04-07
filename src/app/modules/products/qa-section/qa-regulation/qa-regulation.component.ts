import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { QaService } from '../../shared/services/qaservice/qa.service';
import { RegulationFilter } from '../../shared/filters/regulation-filter';
import { Regulations } from '../../shared/view-models/regulation.viewmodel';
import { Qaproduct } from 'src/app/models/products/qaproduct';
import { QaFilter } from '../../shared/filters/qa-filter';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';

@Component({
  selector: 'qa-regulation',
  templateUrl: './qa-regulation.component.html',
  styleUrls: ['./qa-regulation.component.scss']
})
export class QaRegulationComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  _productregulation: Qaproduct = new Qaproduct();
  _productRegulationList: Qaproduct = new Qaproduct();
  @Input("filters") filters: RegulationFilter;
  filterProduct: QaFilter = new QaFilter();
  @Input("_productregulationId") _productregulationId: RegulationFilter;
  @Input("idproduct") idproduct: number = 0;
  submitted: boolean;
  seletctedRegulations: Regulations[] = [];
  @ViewChild("dtb") dtb: ElementRef;
  @ViewChild("dt") dt: Table;
  saving: boolean = false;
  constructor(private _qaproduct: QaService, public messageService: MessageService, public _qaproductservice: QaService) { }

  ngOnInit(): void {
    this.seletctedRegulations = [];
    this.onLoadRegulationsAvailable();
  }
  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
    this.dtb.nativeElement.value = "";
    this.showDialogChange.emit(this.showDialog);
    this.dt.filterGlobal("", 'contains')
  }
  saveProductRegulations(): void {
    this.saving = true;
    this.submitted = true;
    if (this.seletctedRegulations.length >= 1) {
      this._productregulation.idProduct = this._productRegulationList.idProduct;
      this._productregulation.regulations = this.seletctedRegulations;
      this._productregulation.regulations.forEach(element => {
        element.active = true;
        if (this._productregulation.regulations.filter(c => c.idProductRegulation == 0)) {
          element.idProductRegulation = -1
        }
      });
      this._qaproduct.postProductRegulations(this._productregulation, parseInt(this.idproduct.toString())).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.filterProduct.productId = this.idproduct;
          this.saving = false;
          this._qaproduct.getProductRegulations(this.filterProduct).subscribe((data: Qaproduct) => {
            this._qaproductservice._productregulationList = data;
            this._productregulation.regulations.length = 0;

          });
          this.submitted = false;
        } else if (data == -1) {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La asociación del producto ya existe." });

        } else {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar asociación." });
        }
      }, (error: HttpErrorResponse) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la asociación." });
      });
    }else{
      this.saving = false;
    }
  }
  onLoadRegulationsAvailable() {
    if (this.idproduct != -1) {
      this.filters = new RegulationFilter();
      this.filters.productId = this.idproduct;
      this._qaproduct.getProductRegulationsAvailable(this.filters).subscribe((data: Qaproduct) => {
        this._productRegulationList = data;
      })
    }
  }

}
