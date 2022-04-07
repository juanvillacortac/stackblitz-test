import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { CoinFilter } from '../shared/filters/CoinFilter';
import { CoinsService } from '../shared/service/coins.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'


@Component({
  selector: 'app-coin-panel',
  templateUrl: './coin-panel.component.html',
  styleUrls: ['./coin-panel.component.scss']
})
export class CoinPanelComponent implements OnInit {

  @Input("_coin") _coin: Coins;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: CoinFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  coinType: SelectItem<any>[];
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  loading=false;
  _validations:Validations=new Validations();
  noSpecial: RegExp = /^[^<>*!+-,&%~'´´:;¬"°{[}^¨¨\]\-?]+$/;
  @Input("_status") _status:boolean;

  constructor(private _coinService: CoinsService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.submitted = false;
    this._coinService.getCoinTypesList()
    .subscribe((data)=>{
      this.coinType = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
    if(this._coin.id<=0)
     this._coin.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._coin = new Coins();
    this._coin.id=-1;
    this._coin.idType=-1;
    this._coin.name=" ";
    this._coin.symbology=" ";
    this._coin.abbreviation=" ";
    this._coin.active = true;

  }

  save()
  {
    this.loading=true;
    this._coinService.InsertUpdateCoin(this._coin).subscribe((data) => {
      if (data> 0)
      {
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
         this._coin = new Coins();
         this._coin.active = true;              
         this._coinService.getCoinsList(this.filters).subscribe((data: Coins[]) => {
         this._coinService._coinsList = data;
          this.submitted = false;                         
       });
      }               
      else if(data==-1)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      else if(data==-2)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada." });
      else if(data==-3)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El registro no se encuentra." });
      else
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
  }, (error: HttpErrorResponse) => {
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
       this. loading=false;
   });
   this.loading=false;
  }
  submit()
  {
    this.submitted = true;
      if (this._coin.name.trim() && this._coin.idType >0 && this._coin.symbology.trim() && this._coin.abbreviation !="")
      {
      if( this._coin.name = this._coin.name.trim())
        {
          if(this._coin.name = this._coin.name.charAt(0).toLocaleUpperCase() + this._coin.name.substr(1).toLowerCase())
            {
              if(this._coin.abbreviation!="")
              {
                     this._coin.abbreviation=this._coin.abbreviation.trim().toLocaleUpperCase()
              }
              if(this._coin.name.trim().toLocaleUpperCase() !== this._coin.abbreviation.trim().toLocaleUpperCase())
              {
                  this._coin.id == 0 ? -1 : this._coin.id;
                  if(this._status==this._coin.active || this._coin.active)
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
