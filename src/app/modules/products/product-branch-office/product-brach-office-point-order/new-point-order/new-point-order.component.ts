import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Season } from 'src/app/models/masters-mpc/season';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { Packing } from 'src/app/models/products/packing';
import { PointOrder } from 'src/app/models/products/pointorder';
import { SeasonFilter } from 'src/app/modules/masters-mpc/shared/filters/season-filter';
import { ValidationrangeFilter } from 'src/app/modules/masters-mpc/shared/filters/validationrange-filter';
import { SeasonService } from 'src/app/modules/masters-mpc/shared/services/SeasonService/season.service';
import { ValidationrangeService } from 'src/app/modules/masters-mpc/shared/services/ValidationRange/validationrange.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-new-point-order',
  templateUrl: './new-point-order.component.html',
  styleUrls: ['./new-point-order.component.scss']
})
export class NewPointOrderComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("pointOrderListDB") pointOrderListDB: PointOrder[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshPointOrder") refreshPointOrder = new EventEmitter();
  showModalSuggested: boolean = false;
  validationRangeList: SelectItem[];
  packingList: SelectItem[];
  seasonList: SelectItem[];
  listValidationRange: Validationrange[] = [];
  @Input("pointOrder") pointOrder: PointOrder;
  pointOrderTemp: PointOrder = new PointOrder();
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  saving: boolean = false;
  
  constructor(private validationRange: ValidationrangeService,
    private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    private seasonService: SeasonService) { }

  ngOnInit(): void {
    
  }

  RefreshSuggestedPointOrder(pointsuggested:PointOrder)
  {

    this.pointOrder.minFactor = pointsuggested.minFactor;
    this.pointOrder.midFactor = pointsuggested.midFactor;
    this.pointOrder.maxFactor = pointsuggested.maxFactor;

  }
  viewSuggested(){

this.showModalSuggested=true;

  }
  ngOnShow(){
    this.pointOrderTemp.idPacking = this.pointOrder.idPacking;
    this.pointOrderTemp.idSeason = this.pointOrder.idSeason;
    this.packingFilter.productId = this.idproduct;
    this.searchValidationsRange();
    this.searchPackingProduct();
    this.searchSeason();
  }
  
  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchSeason(){
    var filters = new SeasonFilter();
    filters.active = 1;
    this.seasonService.getSeasonbyfilter(filters).subscribe((data: Season[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.seasonList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }

  searchValidationsRange(){
    var filters = new ValidationrangeFilter();
    filters.typeValidationRangeId = 1;
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

  savePointOrder(){
    this.saving = true;
    this.submitted = true;
    if (this.pointOrder.idProduct > 0 && this.pointOrder.idPacking == this.pointOrderTemp.idPacking && this.pointOrder.idBranchOffice == this.idBranchOffice && this.pointOrder.idSeason == this.pointOrderTemp.idSeason) {
      this.pointOrderListDB = this.pointOrderListDB.filter(x => x.idPacking != this.pointOrder.idPacking && this.pointOrder.idBranchOffice != this.idBranchOffice && this.pointOrder.idSeason != this.pointOrderTemp.idSeason);
    }
    if (this.pointOrderListDB.filter(x => x.idPacking == this.pointOrder.idPacking && x.idBranchOffice == this.idBranchOffice && x.season.id == this.pointOrder.idSeason).length == 0) {
      if (this.pointOrder.idPacking > 0 && this.pointOrder.idSeason > 0 && this.pointOrder.minFactor > 0 && this.pointOrder.midFactor >= this.pointOrder.minFactor && this.pointOrder.maxFactor >= this.pointOrder.midFactor) {
        var pointOrderlist: PointOrder[] = [];
        this.pointOrder.idProduct = parseInt(this.idproduct.toString());
        this.pointOrder.idPacking = this.pointOrder.idPacking;
        this.pointOrder.active = true;
        this.pointOrder.idBranchOffice = parseInt(this.idBranchOffice.toString());
        pointOrderlist.push(this.pointOrder);
        this.productBrachOfficeService.postPointOrder(pointOrderlist).subscribe((data)=>{
          if (data > 0) {
            this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.refreshPointOrder.emit();
            this.showDialogChange.emit(this.showDialog);
          }else{
            this.saving = false;
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el punto de pedido"});
          }
        },(error)=>{
          this.saving = false;
        });
      }else{
        this.saving = false;
      }
    }else{
      this.saving = false;
      this.submitted = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "El punto de pedido ya se ha registrado"});
    }
  }

  changeValidationRange(){
    var validarionrange = this.listValidationRange.find(x => x.id == this.pointOrder.idValidationRange);
    this.pointOrder.minFactor = validarionrange.minimum;
    this.pointOrder.midFactor = validarionrange.middle;
    this.pointOrder.maxFactor = validarionrange.maximum;
  }

  clear(event){
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }
}
