import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { EmployeeResumeComponent } from 'src/app/modules/hcm/dashboard-modals/employeeProfile/employee-resume/employee-resume.component';
import { ModalSupplierPerfilInfoComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-supplier-perfil-info/modal-supplier-perfil-info.component';
import { ModalSupplierPerfilComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-supplier-perfil/modal-supplier-perfil.component';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-dataview-list',
  templateUrl: './dataview-list.component.html',
  styleUrls: ['./dataview-list.component.scss']
})
export class DataviewListComponent implements OnInit {
  @Input("paginator") paginator: boolean = false;
  @Input("dataViewModel") dataViewModel: DataviewModel;
  ButtomImage: string;

  //screen Vars
  scrHeight: any;
  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
  }

  constructor(public dialogService: DialogService, private router: Router, public messageService: MessageService) { this.getScreenSize(); }
  linkview: boolean;
  ngOnInit(): void {
    this.linkview = this.dataViewModel.linkTitleIn;


  }

 
  ref: DynamicDialogRef; 

  imgClick(nromodalimg: number, item: DataviewModel, id0: DataviewListModel) {
    let calcWidth = this.scrWidth <= 320 ? '95%': '35%';
    calcWidth = this.scrWidth > 320 && this.scrWidth <= 375 ? '90%': calcWidth;
    calcWidth = this.scrWidth > 375 && this.scrWidth <= 430 ? '80%': calcWidth;
    calcWidth = this.scrWidth > 430 && this.scrWidth <= 770 ? '60%' : calcWidth;
    calcWidth = this.scrWidth > 770 && this.scrWidth <= 1024 ? '50%' : calcWidth;
    switch (nromodalimg) {
      case 1:
        this.ref = this.dialogService.open(EmployeeResumeComponent, {
          data: {
            id: item
          },
          header: 'Perfil',
          width: calcWidth,
          contentStyle: { "max-height": "1000px", "overflow-y": "unset", "padding": "0px" },
          baseZIndex: 10000
        });
        break;
      case 2://perfil del proveedor
        this.ref = this.dialogService.open(ModalSupplierPerfilInfoComponent, {
          data: {
            id: item//buscar id de proveedor
          },
          header: item.indPerson == 1 ? 'Proveedor' : 'Cliente',
          width: '30%',
          contentStyle: { "max-height": "500px", "overflow-y": "unset", "padding": "0px" },
          baseZIndex: 10000
        });
        break;
      case 3://producto
        this.router.navigate(['mpc/productgeneralsection', id0.id, 0, 0]);
        break;
      default:
        break;
    }

    this.ref.onClose.subscribe((itemselect: DataviewModel) => {
      /*  if (product) {
           this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
       } */
    });
  }

  nameLink(nromodal: number, item: DataviewModel, id0: DataviewListModel) {
    let calcWidth = this.scrWidth <= 320 ? '95%': '35%';
    calcWidth = this.scrWidth > 320 && this.scrWidth <= 375 ? '90%': calcWidth;
    calcWidth = this.scrWidth > 375 && this.scrWidth <= 430 ? '80%': calcWidth;
    calcWidth = this.scrWidth > 430 && this.scrWidth <= 770 ? '60%' : calcWidth;
    calcWidth = this.scrWidth > 770 && this.scrWidth <= 1024 ? '50%' : calcWidth;
    switch (nromodal) {
      case 1:
        this.ref = this.dialogService.open(ModalSupplierPerfilComponent, {
          data: {
            id: item//buscar id de proveedor
          },
          header: 'Fiabilidad del proveedor',
          width: '40%',
          contentStyle: { "max-height": "400px", "overflow": "auto" },
          baseZIndex: 10000
        });
        break;
      case 2:
        this.ref = this.dialogService.open(EmployeeResumeComponent, {
          data: {
            id: item//buscar id de proveedor
          },
          header: 'Perfil',
          width: calcWidth,
          contentStyle: { "max-height": "1000px", "overflow-y": "unset", "padding": "0px" },
          baseZIndex: 10000
        });
        break;
      case 3://perfil del proveedor
        this.ref = this.dialogService.open(ModalSupplierPerfilInfoComponent, {
          data: {
            id: item//buscar id de proveedor
          },
          header: item.indPerson == 1 ? 'Proveedor' : 'Cliente',
          width: '30%',
          contentStyle: { "max-height": "500px", "overflow-y": "unset", "padding": "0px" },
          baseZIndex: 10000
        });
        break;
      case 4://producto
        this.router.navigate(['mpc/productgeneralsection', id0.id, 0, 0]);
        break;
      default:
        break;
    }

    this.ref.onClose.subscribe((itemselect: DataviewModel) => {
      /*  if (product) {
           this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
       } */
    });
  }

}
