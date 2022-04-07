import { Component, Input, OnInit } from '@angular/core';
import { Publication } from 'src/app/models/products/publication';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PublicationService } from '../../shared/services/publicationservice/publication.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PublicationFilter } from '../../shared/filters/publication-filter';
import { DatePipe, formatDate } from '@angular/common';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'publications-list',
  templateUrl: './publications-list.component.html',
  styleUrls: ['./publications-list.component.scss'],
  providers: [DatePipe]
})
export class PublicationsListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  publicationDialog: boolean = false;
  publicationId : PublicationFilter = new PublicationFilter();
  publicationModel: Publication = new Publication();
  publicationFilters: PublicationFilter = new PublicationFilter();
  activeRegister:boolean = false;
  @Input("idproduct") idproduct : number = 0;
  permissionsIDs = {...Permissions};
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  displayedColumns: ColumnD<Publication>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.nameInsert; },field: 'nameInsert', header: 'Tipo de encarte', display: 'table-cell'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre del catálago', display: 'table-cell'},
   {template: (data) => { return data.page; },field: 'page', header: 'Página', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.stringDate; },field: 'stringDate', header: 'Fecha de creación', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  //  {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];
  
  constructor(public _publicationservice: PublicationService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,
    private router: Router) { 
  }

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters; //this.activatedRoute.snapshot.queryParamMap.get('productcatalogfilters');
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this.publicationFilters.productId= this.idproduct;
    this._publicationservice.getPublications(this.publicationFilters).subscribe((data: Publication[]) => {
      data.forEach(element => {
        element.stringDate = this.datepipe.transform(element.createdDate, "dd/MM/yyyy");
      });
      this._publicationservice._publicationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las publicaciones."});
    });
  }

  onEdit(id: number, insertTypeid: number, name: string, page:number, active: boolean) {
   
    this.publicationModel = new Publication();
    this.publicationId = new PublicationFilter();
    this.publicationModel.id = id;
    this.publicationId.id= id;
    this.publicationModel.name = name;
    this.publicationModel.insertId= insertTypeid;
    this.publicationModel.page= page;
    this.publicationModel.active = active;
    this.publicationDialog = true;
    this.activeRegister = active;
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
