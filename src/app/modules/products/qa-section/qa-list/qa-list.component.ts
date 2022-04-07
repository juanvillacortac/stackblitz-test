import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../../design/breadcrumb.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Qaproduct } from '../../../../models/products/qaproduct';
import { UserPermissions } from '../../../security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { QaFilter } from '../../shared/filters/qa-filter';
import { QaService } from '../../shared/services/qaservice/qa.service';
import { Regulations } from '../../shared/view-models/regulation.viewmodel';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'qa-list',
  templateUrl: './qa-list.component.html',
  styleUrls: ['./qa-list.component.scss']
})
export class QaListComponent implements OnInit {

  showFilters: boolean = false;
  loading: boolean = false;
  submitted: boolean;
  regulationsMod: Regulations[] = [];
  productregulationDialog: boolean = false;
  productregulationId: QaFilter = new QaFilter();
  productregulationModel: Qaproduct = new Qaproduct();
  ProducRegulationFilters: QaFilter = new QaFilter();
  @Input("idproduct") idproduct: number = 0;
  permissionsIDs = { ...Permissions };
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];

  constructor(public _qaproductservice: QaService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private confirmationService: ConfirmationService,
    private router: Router) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM',routerLink: ['/mpc/dashboard-mpc']  },     
      { label: 'Control de calidad', routerLink: ['/qa-product'] }
    ]);
  }

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    } else {
      if (history.state.queryParams != undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      } else {
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }

    }
    this.search();
  }

  search() {
    this.loading = true;
    this.ProducRegulationFilters.productId = this.idproduct;
    this._qaproductservice.getProductRegulations(this.ProducRegulationFilters).subscribe((data: Qaproduct) => {
      this._qaproductservice._productregulationList = data;
      this.loading = false;
      console.log(data);
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las normativas del productos." });
    });
  }

  deleteRegulation(id: number) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Esta seguro que desea eliminar esta normativa del producto?',
      accept: () => {
        var productnormative: Qaproduct = new Qaproduct();
        productnormative.id = id;
        this._qaproductservice.deleteProductRegulations(productnormative).subscribe((data: number) => {
          if (data > 0) {
            this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
            this.search();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar la normativa del producto" });
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar la normativa del producto" });
        });
      },
    });
  }

  submit(regulation: Regulations) {
    this.regulationsMod.push(regulation);
    this.productregulationModel.idProduct = parseInt(this.idproduct.toString());
    this.productregulationModel.regulations = this.regulationsMod;
    this._qaproductservice.postProductRegulations(this.productregulationModel, parseInt(this.idproduct.toString())).subscribe((data: number) => {
      console.log(data);
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this._qaproductservice.getProductRegulations(this.ProducRegulationFilters).subscribe((data: Qaproduct) => {
          this._qaproductservice._productregulationList = data;

        });

      } else if (data == -1) {
        console.log(data);
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La normativa del producto ya existe." });

      } else {
        console.log(data);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar normativa." });
      }
    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la normativa." });
    });
  }

  back = () => {
    const queryParams: any = {};
    queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
  }
}
