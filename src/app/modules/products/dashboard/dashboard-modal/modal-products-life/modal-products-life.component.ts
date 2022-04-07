import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProductCicleLife } from 'src/app/models/products/dashboard/modal-products-life';
@Component({
  selector: 'app-modal-products-life',
  templateUrl: './modal-products-life.component.html',
  styleUrls: ['./modal-products-life.component.scss']
})
export class ModalProductsLifeComponent implements OnInit {
  value1: number = 20;
  value2: number = 10;
  value3: number = 150;
  value4: number = 300;
  basicOptions:any;
  data2: any;
    chartOptions: any;
  data:any;
  dataProductsLife:ProductCicleLife[];
  displayedColumns: ColumnD<ProductCicleLife>[] =
  [//tiempo en recepcion tiempo en revision por el proveedor, proveedor revisa.
    {template: (data) => { return data.NombreProducto; },field: 'NombreProducto', header: 'Producto', display: 'table-cell'},
    {template: (data) => { return data.Categoria; },field: 'Categoria', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.PorcentajeCrecimiento; },field: 'PorcentajeCrecimiento', header: 'Porcentaje de crecimiento', display: 'table-cell'},
   {template: (data) => { return this.typeEstatus2(data.PorcentajeCrecimiento); },field: 'PorcentajeCrecimiento', header: 'Estatus', display: 'table-cell'}
   
  ];
  

  constructor(private messageService: MessageService,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
_selectedColumns: any[];

set selectedColumns(val: any[]) {
  //restore original order
  this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
}


  ngOnInit(): void {
    this._selectedColumns = this.displayedColumns
this.data='[{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VÍVERES","NombreProducto":"HARINA DE MAÍZ SANTA LUCÍA 1K BLANCA","PorcentajeCrecimiento":22.290000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"ARROZ DOÑA FINA 1K BLANCO","PorcentajeCrecimiento":16.710000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":8,"Categoria":"CHARCUTERIA","NombreProducto":"(**)MORTADELA EBENEZER 1KG POLLO","PorcentajeCrecimiento":13.440000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA PAN 1KG MAIZ\/PRECOC.","PorcentajeCrecimiento":10.630000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA MARY D\/TRIGO SACO 45K","PorcentajeCrecimiento":9.930000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":26,"Categoria":"FRULEVER","NombreProducto":"HUEVO SIGO 30UND FRESCO","PorcentajeCrecimiento":9.310000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":36,"Categoria":"LICORES","NombreProducto":"(**)LICOR R. SUPERIOR 1L","PorcentajeCrecimiento":5.150000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"REFRESCO COCA COLA 2L ORIG.","PorcentajeCrecimiento":4.880000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":14,"Categoria":"CUIDADO PERSONAL","NombreProducto":"PAPEL\/HIG. ROSAL 215H 4U PLUS","PorcentajeCrecimiento":3.970000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"REFRESCO PEPSI 2L","PorcentajeCrecimiento":3.680000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"AZUCAR GASPARIN 1KG","PorcentajeCrecimiento":3.520000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"COMPTO.LACTEO PVO.OTIMO 400G","PorcentajeCrecimiento":3.280000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":38,"Categoria":"MASCOTA","NombreProducto":"BOQUITA 15K PERRO\/ADULTO","PorcentajeCrecimiento":3.190000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"CAFE SANTA ANA 200G","PorcentajeCrecimiento":2.820000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"REFRESCO COCA-COLA 1.5L ORIG.S\/CALORIA","PorcentajeCrecimiento":2.790000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"REFRESCO COCA COLA 1L MENOS CALORIAS","PorcentajeCrecimiento":2.760000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"ARROZ MARY 1KG LIBRE D\/GRASA","PorcentajeCrecimiento":2.690000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(*)ACEITE KALDINI 900ML GIRASOL","PorcentajeCrecimiento":2.620000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":19,"Categoria":"ELECTRODOMESTICOS MAYORES","NombreProducto":"A\/A. SANKEY 18000 BTU ES18B410B5","PorcentajeCrecimiento":2.550000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":26,"Categoria":"FRULEVER","NombreProducto":"HUEVO FRESCOS 15U","PorcentajeCrecimiento":2.510000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":" (**) PASTA MARY 1K VERMICELLI","PorcentajeCrecimiento":2.460000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA PAN 1KG MAIZ\/ARROZ","PorcentajeCrecimiento":2.260000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA DE MAIZ KALY1K BLANCA","PorcentajeCrecimiento":2.220000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":19,"Categoria":"ELECTRODOMESTICOS MAYORES","NombreProducto":"A\/A. SANKEY 12000 BTU ES-12R410A2","PorcentajeCrecimiento":2.210000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(**)SSA.KAMPIST 385G TOMATE ","PorcentajeCrecimiento":2.190000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"MAYONESA MAVESA 445G","PorcentajeCrecimiento":2.020000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"MARG.MAVESA 500G","PorcentajeCrecimiento":1.980000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"CAFE FORTALEZA 250G GOURMET","PorcentajeCrecimiento":1.950000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":26,"Categoria":"FRULEVER","NombreProducto":"CEBOLLA BLANCA","PorcentajeCrecimiento":1.940000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(**)MARG. BEL CAMPO 250G C\/SAL","PorcentajeCrecimiento":1.940000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"BEB.CHOCO ALCAFOODS 400G ","PorcentajeCrecimiento":1.910000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"AZUCAR GRANEL NAT.700G","PorcentajeCrecimiento":1.910000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":14,"Categoria":"CUIDADO PERSONAL","NombreProducto":"PAPEL\/HIG ROSAL 4U 300H","PorcentajeCrecimiento":1.900000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":36,"Categoria":"LICORES","NombreProducto":"LICOR R. CINCO ESTRELLAS 1L","PorcentajeCrecimiento":1.890000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA DE MAIZ KALY1K AMARILLA","PorcentajeCrecimiento":1.880000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":37,"Categoria":"LIMPIEZA","NombreProducto":"(*)JAB. EL TITAN 200G","PorcentajeCrecimiento":1.850000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":9,"Categoria":"CHUCHERIA","NombreProducto":"(*)LECHE CONDENSADA DI FIORE","PorcentajeCrecimiento":1.730000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(**)ACEITE CORCOVADO 900ML SOYA","PorcentajeCrecimiento":1.710000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":26,"Categoria":"FRULEVER","NombreProducto":"PAPA SIGO AMARILLA","PorcentajeCrecimiento":1.710000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"ACEITE COCAMAR 900ML SOYA","PorcentajeCrecimiento":1.700000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(*)PASTA DI FIORE 400G LARGA","PorcentajeCrecimiento":1.660000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(**)ACEITE VILA VELHA 900ML SOYA","PorcentajeCrecimiento":1.620000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"HARINA PAN AMARILLA PRECOC.1K","PorcentajeCrecimiento":1.600000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":9,"Categoria":"CHUCHERIA","NombreProducto":"SNACK PEPITO FRITOLAY 80G","PorcentajeCrecimiento":1.540000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"COMPTO.LACTEO DOBON 400G ","PorcentajeCrecimiento":1.530000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(*)MAYONESA MENOYO 235G","PorcentajeCrecimiento":1.530000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":36,"Categoria":"LICORES","NombreProducto":"AGUARDIENTE EL GABAN 1L DORADO","PorcentajeCrecimiento":1.500000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"REFRESCO PEPSI 1.5L","PorcentajeCrecimiento":1.420000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":61,"Categoria":"VIVERES","NombreProducto":"(**)HARINA DE TRIGO TODO USO YAMA 1K","PorcentajeCrecimiento":1.420000},{"IdGrupoEmpresas":1,"IdEmpresa":1,"IdSucursal":1,"IdCategoria":9,"Categoria":"CHUCHERIA","NombreProducto":"SNACK CHEESE TRIS 150G FRITOLAY","PorcentajeCrecimiento":1.420000}]';
//this.dataProductsLife=JSON.stringify(this.data);
this.dataProductsLife = JSON.parse(this.data); 

  this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      showAllTooltips: true,  
      legend: {
          position: 'right',
          labels: {
              fontColor: '#495057',
              fontSize: 14
          },
          title: {
              display: true,
              text: 'Ciclo de vida del producto',
              fontSize: 14
            }
      }
  };

this.data2 = {
  labels: ['Declive','Maduréz','Crecimiento','Iniciación'],
  datasets: [
      {
          data: [150, 3500, 1956,120],
          backgroundColor: [
            '#dfe7fd',
            '#fde2e4',
            '#A0C4FF',
            '#FDFFB6'
          ],
          hoverBackgroundColor: [
            '#dfe7fd',
            '#fde2e4',
            '#A0C4FF',
            '#FDFFB6'
          ]
      }
  ]
};
//console.log(this.dataProductsLife);
  }
typeEstatus2(valor:number)
{
let result:number=0;
if ((valor>=20)&&(valor<=40)){

  return 'Crecimiento'
}
if ((valor>=60)&&(valor<=80)){

  return 'Declive'
}
if ((valor>=40)&&(valor<=50)){

  return 'Maduréz'
}
if ((valor>=0)&&(valor<=20)){

  return 'Iniciación'
}
};
}


/* function typeEstatus() {
  throw new Error('Function not implemented.');
} */
