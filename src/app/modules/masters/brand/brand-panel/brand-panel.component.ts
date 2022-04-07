import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {  ConfirmationService, MessageService , SelectItem } from 'primeng/api';
import { Brands } from 'src/app/models/masters/brands';
import { HttpErrorResponse } from '@angular/common/http';
import { brandsFilter } from '../shared/filters/brands-Filters';
import { BrandsService } from '../shared/services/brands.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'
import { brandsClassFilter } from '../shared/filters/brandClass-filters';


@Component({
  selector: 'app-brand-panel',
  templateUrl: './brand-panel.component.html',
  styleUrls: ['./brand-panel.component.scss']
})
export class BrandPanelComponent implements OnInit {

  @Input("_brand") _brand: Brands;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: brandsFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  brandClass: SelectItem<any>[];
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _validations:Validations=new Validations();
  filterBrand:brandsClassFilter=new brandsClassFilter();
  loading=false;
  @Input("_status") _status:boolean;
  
  
  constructor(private _brandService: BrandsService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void 
  {
    this.submitted = false;
    this._brandService.getBrandsClassList()
    .subscribe((data)=>{
      this.brandClass = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
    if(this._brand.id<=0)
     this._brand.active=true;
   }

    hideDialog(): void {
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this.submitted = false;
      this._brand = new Brands();
      this._brand.id=-1;
      this._brand.name=" ";
      this._brand.id=-1;
      this._brand.abbreviation=" ";
      this._brand.active = true;

    }
    isNan(value :any):boolean
    {
      if(value !="")
      {
        if(isNaN(+value))
          return  true;
        else
          return false
      }
      else
        return true;
    }

    save()
    {   
        this.loading=true;
        this._brandService.InsertUpdateBrands(this._brand).subscribe((data) => {
        if (data>0)
        {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
            this.showDialog = false;
            this.showDialogChange.emit(this.showDialog);
            this._brand = new Brands();
            this._brand.active = true;               
            this._brandService.getBrandsList(this.filters).subscribe((data: Brands[]) => {
            this._brandService._brandsList = data;
            this.submitted = false;
           });
         }  
          else if(data==-1)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          else if(data==-2)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para la clase de marca seleccionada." });
          else if(data==-3)
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
        if (this._brand.name.trim() && this._brand.idClass >0 &&  this.isNan(+this._brand.name.trim()) &&  this.isNan(+this._brand.abbreviation.trim()))
        {
          if(this._brand.name = this._brand.name.trim())
          {
            if(this._brand.name = this._brand.name.charAt(0).toLocaleUpperCase() + this._brand.name.substr(1).toLowerCase())
            {
              if(this._brand.abbreviation!="")
              {
                     this._brand.abbreviation=this._brand.abbreviation.trim().toLocaleUpperCase()
              }
              if(this._brand.name.trim().toLocaleUpperCase() !== this._brand.abbreviation.trim().toLocaleUpperCase())
              {  
                 this._brand.id == 0 ? -1 : this._brand.id;
                 if(this._status==this._brand.active || this._brand.active)
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
   // this.loading=false;
   }
  }    

