import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { PriceGroupingFilter } from '../shared/filters/pricegrouping-filter';
import { PriceGroupingService } from '../shared/service/price-grouping.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'

@Component({
  selector: 'app-price-grouping-panel',
  templateUrl: './price-grouping-panel.component.html',
  styleUrls: ['./price-grouping-panel.component.scss']
})
export class PriceGroupingPanelComponent implements OnInit {

  @Input("_pricegrouping") _pricegrouping: priceGrouping;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: PriceGroupingFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  loading=false;
  _validations:Validations=new Validations();
  @Input("_status") _status:boolean;

  constructor(private _pricegroupingService: PriceGroupingService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.submitted = false;
    if(this._pricegrouping.id<=0)
     this._pricegrouping.active=true;
  }
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._pricegrouping = new priceGrouping();
    this._pricegrouping.id=-1;
    this._pricegrouping.name=" ";
    this._pricegrouping.abbreviation=" ";
    this._pricegrouping.active = true;

  }
  
  save(){
    this. loading=true;
    this._pricegroupingService.InsertUpdatePriceGrouping(this._pricegrouping).subscribe((data) => {
      if (data> 0)
      {
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
         this._pricegrouping= new priceGrouping();
         this._pricegrouping.active = true;               
         this._pricegroupingService.getPriceGroupingList(this.filters).subscribe((data: priceGrouping[]) => {
         this._pricegroupingService._pricegroupingList = data;
         this.submitted = false;
        });
      }
       else if(data==-1)
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
       else if(data==-2)
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada." });
       else if (data==-3)
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "El registro no se encuentra." });
       else
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
        this.loading=false;
        });
      this.loading=false;
  }
  submit()
  {
    this.submitted = true;
      if (this._pricegrouping.name.trim() )
      {
        if(this._pricegrouping.name = this._pricegrouping.name.trim())
        {
          if(this._pricegrouping.name = this._pricegrouping.name.charAt(0).toLocaleUpperCase() + this._pricegrouping.name.substr(1).toLowerCase())
            {   
              if(this._pricegrouping.abbreviation!="")
               {
                 this._pricegrouping.abbreviation=this._pricegrouping.abbreviation.trim().toLocaleUpperCase()
               }
              if(this._pricegrouping.name.trim().toLocaleUpperCase() !== this._pricegrouping.abbreviation.trim().toLocaleUpperCase())
              {
                 this._pricegrouping.id == 0 ? -1 : this._pricegrouping.id;

                 if(this._status==this._pricegrouping.active || this._pricegrouping.active)
                 {
                     this.save();
                 }
                else{
                  this.confirmationService.confirm({
                   header: 'Confirmación',
                   icon: 'pi pi-exclamation-triangle',
                   message: 'Si inactiva el registro, las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
                   accept: () => {
                       this.save();
                    },
                  });
                }
             }
        else
           this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura debe ser diferente al nombre." });
          }
        }
      }
     } 

    } 