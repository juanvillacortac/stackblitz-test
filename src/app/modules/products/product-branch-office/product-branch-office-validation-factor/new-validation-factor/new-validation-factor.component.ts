import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { InputNumber } from 'primeng/inputnumber';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { Packing } from 'src/app/models/products/packing';
import { ValidationrangeFilter } from 'src/app/modules/masters-mpc/shared/filters/validationrange-filter';
import { ValidationrangeService } from 'src/app/modules/masters-mpc/shared/services/ValidationRange/validationrange.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { ValidationFactor } from '../../../../../models/products/validationfactor';

@Component({
  selector: 'app-new-validation-factor',
  templateUrl: './new-validation-factor.component.html',
  styleUrls: ['./new-validation-factor.component.scss']
})
export class NewValidationFactorComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("validationFactorListDB") validationFactorListDB: ValidationFactor[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshValidationFactor") refreshValidationFactor = new EventEmitter();

  validationRangeList: SelectItem[];
  packingList: SelectItem[];
  listValidationRange: Validationrange[] = [];
  @Input("validationFactor") validationFactor: ValidationFactor;
  idPackingValidationFactorTemp: number = -1;
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  focus: number = 0;
  saving: boolean = false;
  
  constructor(private validationRange: ValidationrangeService,
    private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.idPackingValidationFactorTemp = this.validationFactor.idPacking;
    this.packingFilter.productId = this.idproduct;
    this.searchValidationsRange();
    this.searchPackingProduct();
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchValidationsRange(){
    var filters = new ValidationrangeFilter();
    filters.typeValidationRangeId = 2;
    filters.active = 1;
    this.validationRange.geValidationRangebyfilter(filters).subscribe((data: Validationrange[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.listValidationRange = data;
      this.validationRangeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      this.packingList = data.map((item)=>({
        label: item.packagingPresentation.name + " X " + item.units,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }

  saveValidationFactor(){
    this.saving = true;
    this.submitted = true;
    if (this.validationFactor.idProduct > 0 && this.validationFactor.idPacking == this.idPackingValidationFactorTemp && this.validationFactor.idBranchOffice == this.idBranchOffice) {
      this.validationFactorListDB = this.validationFactorListDB.filter(x => x.idPacking != this.validationFactor.idPacking && this.validationFactor.idBranchOffice != this.idBranchOffice);
    }
    if (this.validationFactorListDB.filter(x => x.idPacking == this.validationFactor.idPacking && x.idBranchOffice == this.idBranchOffice).length == 0) {
      if (this.validationFactor.idPacking > 0 && this.validationFactor.minFactor > 0 && this.validationFactor.midFactor >= this.validationFactor.minFactor && this.validationFactor.maxFactor >= this.validationFactor.midFactor) {
        var validationfactorlist: ValidationFactor[] = [];
        this.validationFactor.idProduct = parseInt(this.idproduct.toString());
        this.validationFactor.idPacking = this.validationFactor.idPacking;
        this.validationFactor.idBranchOffice = parseInt(this.idBranchOffice.toString());
        this.validationFactor.active = true;
        validationfactorlist.push(this.validationFactor);
        this.productBrachOfficeService.postValidationFactor(validationfactorlist).subscribe((data)=>{
          if (data > 0) {
            this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.refreshValidationFactor.emit();
            this.showDialogChange.emit(this.showDialog);
          }else{
            this.saving = false;
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el factor de validación"});
          }
        },(error)=>{
          this.saving = false;
        });
      }else{
        this.saving = false;
      }
    }else{
      this.saving = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "El empaque ya se encuentra en la lista"});
    }
  }

  changeValidationRange(){
    var validarionrange = this.listValidationRange.find(x => x.id == this.validationFactor.idValidationRange);
    this.validationFactor.minFactor = validarionrange.minimum;
    this.validationFactor.midFactor = validarionrange.middle;
    this.validationFactor.maxFactor = validarionrange.maximum;
  }

  clear(event){
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }
}
