import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LotsService } from '../shared/services/lots.service';
import { LotsFilter } from 'src/app/models/financial/lotsFilter';
import { Lots } from 'src/app/models/financial/lots';
import {ModuleLot  } from 'src/app/models/financial/moduleLot';
import { Module } from '../../../../models/security/Module';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { Router } from '@angular/router';
import {​​​​​​​​ UserPermissions }​​​​​​​​ from'src/app/modules/security/users/shared/user-permissions.service';
import*as Permissions from'src/app/modules/security/users/shared/user-const-permissions';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lots-list',
  templateUrl: './lots-list.component.html',
  styleUrls: ['./lots-list.component.scss'],
  providers: [DatePipe]
})

export class LotsListComponent implements OnInit {
  reload: string;
  lotsList: Lots[] = new Array<Lots>();
  lot: Lots;
  loading: Boolean = false;
  filtered: Boolean = false;
  moduleLotsList: ModuleLot[];
  lotsFilter : LotsFilter = new LotsFilter()
  showDialog = false;
  checked: number = 1;
  notchecked: number = 0;
  showPanelPrincipal = false;
  showPanelEdit = false;
  rowGroupMetadata: any;
  iExist: Boolean;
  public isExpanded:boolean = false;
  public expandedRows = {};
  public temDataLength:number = 0;
  permissionsIDs = {...Permissions};
  constructor(private lotService: LotsService,
    public breadcrumbService: BreadcrumbService,
    private router: Router,
    private initialSetup: InitialSetupService, public datepipe:DatePipe,public userPermissions: UserPermissions) {
    this.initialSetup.validateConfiguration(1, this.router, () => {
      this.breadcrumbService.setItems([
        { label: 'Financiero' },
        { label: 'Configuración' },
        { label: 'Lotes', routerLink: ['/financial/configuration/lots-list'] }
      ]);
    })
  }
   
    ngOnInit() {
      this.iExist = false;
        this.showPanelPrincipal = true;
        this.search();
  
        //this.lotsFilter.allowsEntry = -1;
    }

    search(){
      if (this.loading)
      return;

      this.loading = true;
      this.changeShowPrincipal(true);
      let emptyA = false;
      let emptyS = false;
      if( this.lotsFilter.allowsEntry  == -2){
        this.lotsFilter.allowsEntry  = -1;
        emptyA = true;
      }
      
 
      if( this.lotsFilter.indStatusLot  == -2){
        this.lotsFilter.indStatusLot  = -1;
        emptyS = true;
      }
      

      this.lotService.getLotsList(this.lotsFilter).subscribe(data => {

        this.moduleLotsList = data.filter(x=>x.lots.length != 0).sort((a, b) => a.moduleContent.localeCompare(b.moduleContent));

        if (this.iExist == true && this.lotsFilter.indStatusLot  == -2  && this.lotsFilter.allowsEntry  == -2 && this.lotsFilter.allowsEntry == -2 && this.lotsFilter.id == -1 && this.lotsFilter.lotName == "" && this.lotsFilter.creationEndDate == "01/01/1900" && this.lotsFilter.creationStartDate ==  "01/01/1900" ){
           this.toggleExpanded(false);
        }
       else{
        if (this.iExist == true){
           this.toggleExpanded(true);
        }
       }

       

      
        this.loadLots();
        this.updateRowGroupMetaData();
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
           this.loading = false;
         // this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los lotes." });
          
      });

    if(emptyA == true)
      this.lotsFilter.allowsEntry  = -2; 
    

    if(emptyS == true)
      this.lotsFilter.indStatusLot  = -2;
      

   
 
  }

     getFecha(pDate : Date ){
       return this.datepipe.transform(Date,'dd/MM/yyyy')
    }
    loadLots(){
     // this.lotsList =  new Array<Lots>();
      for(let mod of this.moduleLotsList){
        for(let lot of mod.lots){
          lot.creationStartDateString = this.datepipe.transform(lot.creationStartDate,'dd/MM/yyyy')
          lot.idModule = mod.id
          lot.module = mod.moduleContent
         // this.lotsList.push(lot)
        }
        mod.lots = mod.lots.sort((a, b) =>new Date(b.creationStartDate).getTime() - new Date(a.creationStartDate).getTime());

      }
      console.log(this.moduleLotsList)
    }

    

    onSort() {
    
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
      this.rowGroupMetadata = {};

      if (this.lotsList) {
        for (let i = 0; i < this.lotsList.length; i++) {
          let rowData = this.lotsList[i];
          let moduleid = rowData.idModule;
          
          if (i == 0) {
            this.rowGroupMetadata[moduleid] = { index: 0, size: 1 };
          }
          else {
            let previousRowData = this.lotsList[i - 1];
            let previousRowGroup = previousRowData.idModule;
            if (moduleid === previousRowGroup)
              this.rowGroupMetadata[moduleid].size++;
            else
              this.rowGroupMetadata[moduleid] = { index: i, size: 1 };
          }
        }
      }
    }

    openNew() {
      this.showDialog = true;
    }

    toggleExpanded(status: boolean) {
debugger;
     if(this.moduleLotsList != undefined){
      if(status){
        this.moduleLotsList.forEach(data =>{
          this.expandedRows[data.id] = true;
        })
       }
       else{
        this.expandedRows={};
       }
    
       this.isExpanded = !this.isExpanded;
     }
   
    }

    // expandAll() {
    //   if(!this.isExpanded){
    //     this.lotsList.forEach(data =>{
    //       this.expandedRows[data.id] = 1;
    //     })
    //   } else {
    //     this.expandedRows={};
    //   }
    
    // }
    onRowExpand() {
      console.log("row expanded", Object.keys(this.expandedRows).length);
      if(Object.keys(this.expandedRows).length === this.temDataLength){
        this.isExpanded = true;
      }
    }
    onRowCollapse() {
      console.log("row collapsed",Object.keys(this.expandedRows).length);
      if(Object.keys(this.expandedRows).length === 0){
        this.isExpanded = false;
      }
    }

    onPage(event: any) {
      this.temDataLength = this.lotsList.slice(event.first, event.first + 10).length;
      console.log(this.temDataLength);
      this.isExpanded = false;
      this.expandedRows={};
    }
    edit(plots:Lots) {
      this.lot = plots;
   /* this.changeShowPrincipal(false);*/
      this.router.navigate(['/financial/configuration/lots-details', plots.id,]);
  
    }

    changeShowPrincipal(visible: boolean) { 
     if  (visible){
      this.showPanelPrincipal = true;
      this.showPanelEdit = false;
     }

     else{
      this.showPanelPrincipal = false;
      this.showPanelEdit = true;
     }


    }
  

}
