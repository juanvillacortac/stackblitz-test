import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryService } from '../shared/services/country.service';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Country } from 'src/app/models/masters/country';
import { CountryFilter } from '../shared/filters/country-filter';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { typeWithParameters } from '@angular/compiler/src/render3/util';




@Component({
  selector: 'app-countries-details',
  templateUrl: './countries-details.component.html',
  styleUrls: ['./countries-details.component.scss']
})

export class CountriesDetailsComponent implements OnInit {
 
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataCountry") _dataCountry: Country ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: CountryFilter;
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  loading=false;
  _validations:Validations=new Validations();
  form: FormGroup;
  @Input("_status") _status:boolean;

  constructor(private _countryService: CountryService,  private messageService: MessageService,
    private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.initForm();
    this.submitted = false;
    if(this._dataCountry.id<=0){
     this._dataCountry.areaCode=0;
     this._dataCountry.active=true;}
     this.primengConfig.ripple = true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataCountry = new Country();
    this._dataCountry.id=-1;
    this._dataCountry.name=" ";
    this._dataCountry.areaCode=0;
    this._dataCountry.abbreviation=" ";
    this._dataCountry.active = true;
  }

  initForm(){
    this.form = new FormGroup({
      name: new FormControl(this._dataCountry.name, [
        Validators.required
      ]),
      areaCode: new FormControl(this._dataCountry.areaCode, [
        Validators.required
      ]),
      active: new FormControl(this._dataCountry.active, [
        Validators.required
      ]),
      abbreviation : new FormControl(this._dataCountry.abbreviation)
    });
  }
  save(){
    this.loading=true;
    this._countryService.UpdateCountry(this._dataCountry).subscribe((data) => 
    {
     if (data> 0) 
     {
       this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
       this.showDialog = false;
       this.showDialogChange.emit(this.showDialog);
       this._dataCountry = new Country();
       this._dataCountry.active = true;
       this._countryService.getCountriesList(this.filters).subscribe((data: Country[]) => {
        this._countryService._countriesList = data;
         this.submitted = false;
        });
       this.submitted = false;
     } 
       else if(data==-1)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
       else if(data==-2)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada." });  
       else if(data==-3)
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El registro no se encuentra." });
       else if(data==-4)
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El código teléfonico ya se encuentra registrado." }); 
       else
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
     }, (error: HttpErrorResponse) =>
     {
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
       this.loading=false;
     });
     this.loading=false;
  }
  saveCountry() 
  {
    this.submitted = true;
    if (this._dataCountry.name != "" && this._dataCountry.areaCode  >0 && this._dataCountry.abbreviation !="")
    {
      if( this._dataCountry.name = this._dataCountry.name.trim() )
      {
        if(this._dataCountry.name = this._dataCountry.name)
        {
          if(this._dataCountry.abbreviation!="")
          {
                 this._dataCountry.abbreviation=this._dataCountry.abbreviation.trim().toLocaleUpperCase()
          }
         if(this._dataCountry.name.trim().toLocaleUpperCase() !== this._dataCountry.abbreviation.trim().toLocaleUpperCase())
         {         
              this._dataCountry.id == 0 ? -1 : this._dataCountry.id;
              if(this._status==this._dataCountry.active || this._dataCountry.active)
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
