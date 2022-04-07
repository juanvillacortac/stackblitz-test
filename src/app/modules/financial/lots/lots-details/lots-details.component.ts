import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService,MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { LotsService } from '../shared/services/lots.service';
import { Lots } from '../../../../models/financial/lots';
import { LotsFilter } from '../../../../models/financial/lotsFilter';
import {CheckboxModule} from 'primeng/checkbox';
import { Module } from '../../../../models/financial/Module';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { DatePipe } from '@angular/common';
import { UpdateLots } from '../../../../models/financial/UpdateLots';
import { ActivatedRoute, Router } from '@angular/router';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { ModuleLot } from 'src/app/models/financial/moduleLot';

@Component({
  selector: 'app-lots-details',
  templateUrl: './lots-details.component.html',
  styleUrls: ['./lots-details.component.scss'],
  providers: [DatePipe]
})
export class LotsDetailsComponent implements OnInit {
/* nuevo*/
  lotsFilter: LotsFilter = new LotsFilter()
  moduleLotsList: ModuleLot[];
  _data: Lots =  new Lots();
/*  fin nuevo*/
  @Input("showDialog") showDialog: boolean = true;
  /*@Input("_data") _data: Lots =  new Lots();*/
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  @Input("filters") filters: LotsFilter;
  updateLotsData: UpdateLots; 
  _validations: Validations = new Validations();
  @Output() filterChange = new EventEmitter<LotsFilter>();
  selectedValues: string[] = ['val1','val2'];
    moduleList: SelectItem[];
    stateList: SelectItem[];


  disableCasteDropdown: boolean = true;
  value: boolean;
  submitted = false;
 
  saving: boolean;
  idLot: number = 0;
indChange=false;
  ngOnInit(): void {
    this.idLot = this.actRoute.snapshot.params['id'];
    this.saving = false;
    this.submitted = false;
    this.getModules();
    this.getStates();
    this.updateLotsData = new UpdateLots();
    this.getLotDetails();
    }
    toReturn() {
      this.filterChange.emit(this.filters);
      this.onUpdate.emit();

    }

  constructor(
    private actRoute: ActivatedRoute,
    private service: LotsService,
    private messageService: MessageService, public datepipe: DatePipe,
    public breadcrumbService: BreadcrumbService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private initialSetup: InitialSetupService
    ) { 
      this.initialSetup.validateConfiguration(1, this.router, () => {
        this.breadcrumbService.setItems([
          { label: 'Financiero' },
          { label: 'Configuración' },
          { id:"urlLotes",
            label: 'Lotes', 
            routerLink: ['/financial/configuration/lots-list'], 
            routerLinkActiveOptions:"{exact:true}",
            skipLocationChange : true,
             queryParamsHandling : 'merge',
            styleClass:'class1', 
          } 
        ]);
      })

     

    }
  
    setupLot(){
         
      
    }
  
  getLotDetails() {
   
    this.lotsFilter.id = this.idLot;
    this.service.getLotsList(this.lotsFilter).subscribe(data => {
      this.moduleLotsList = data;
      this.loadLots();

    }, (error) => {
      console.log(error);
    });

  }
  loadLots() {
    // this.lotsList =  new Array<Lots>();
    for (let mod of this.moduleLotsList) {
      for (let lot of mod.lots) {
        lot.creationStartDateString = this.datepipe.transform(lot.creationStartDate, 'dd/MM/yyyy')
        lot.idModule = mod.id
        lot.module = mod.moduleContent
        // this.lotsList.push(lot)
      }
      mod.lots = mod.lots.sort((a, b) => new Date(b.creationStartDate).getTime() - new Date(a.creationStartDate).getTime());
      if (mod.lots.length > 0) {
       this._data=mod.lots[0];
     
      }
      
    }
  }
 back() {

    if (this.indChange) {

      this.confirmationService.confirm({
        message: '¿Está seguro que desea regresar ? perderá los cambios realizados.',
        accept: () => {
          this.saving = true
          this.router.navigate(["/financial/configuration/lots-list"])
        }
      });
    } else {
      this.router.navigate(["/financial/configuration/lots-list"])
    }
  }
editVal(){
this.indChange=true;
}
  getModules(){

    this.service.getModules().subscribe(data => {
      this.moduleList = data.map<SelectItem>((item) => ({​​​​​​​​
      label:item.moduleContent,
      value: item.id}));
    }, (error) => {
      console.log(error);
    });
              
      
  }
  refreshPage() {
    let a = false;
    if(a)
    window.location.reload();
   }
  
  getStates(){

    this.service.getStateLot().subscribe(data => {
      this.stateList = data.map<SelectItem>((item) => ({​​​​​​​​
      label:item.name,
      value:item.id}));
    }, (error) => {
      console.log(error);
    });
              
      
  }
  


  update(): void {
    debugger;
    if(this.saving == false){
      this.saving = true;
      this.submitted = true;
      this.indChange = false;

    this.updateLotsData.idLot = this._data.id;
    this.updateLotsData.descriptionLot = this._data.description; 
    this.updateLotsData.allowsEntry  =  (this._data.allowsEntry)? 1 : 0;


   
      this.service.updateLots(this.updateLotsData).subscribe((data) => {
       
        if (data ==  0) {
          this.messageService.clear();
          this.router.navigate(["/financial/configuration/lots-list"])
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.submitted = false;
          this.saving = false;
         /* this.onUpdate.emit();*/
        }
       
        if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.submitted = false;
          this.saving = false;
          this.onUpdate.emit();

        }
        if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          this.submitted = false;
          this.saving = false;
          this.onUpdate.emit();
        }
    //if (data => 0) {
    //  this.messageService.clear();
    //   this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
    // // this.showDialog = false;
    //  //this.showDialogChange.emit(this.showDialog);
    //   this.submitted = false;
   
    //     // this.nomString = false;
    //    this.onUpdate.emit();
    //  } else if (data == -1) {
        
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
    //      this.saving = false;
    // }
    //else if (data == -3) {
    //  this.saving = false;
    //    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
    //   }
    //  else {
    //    this.saving = false;
    //    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    //     }
       }, () => {
        this.saving = false;
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });

  }

  

  }
} 
   



