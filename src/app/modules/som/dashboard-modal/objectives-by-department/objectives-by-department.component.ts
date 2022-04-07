import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Analytics } from 'src/app/models/ims/dashboard/analytics';
import { AnalyticsDetailsResults } from 'src/app/models/ims/dashboard/analytics-details-results';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { DashboardService } from 'src/app/modules/ims/dashboard/shared/service/dashboard.service';


@Component({
  selector: 'app-objectives-by-department',
  templateUrl: './objectives-by-department.component.html',
  styleUrls: ['./objectives-by-department.component.scss']
})
export class ObjectivesByDepartmentComponent implements OnInit {
  listProduct:any[]=[];
  @Input() data: any;
  optionsTime: { title: string; value: number; }[];
  value1:number=15
  AnalyticsFilter = new AnalyticsFilter();
  DataIndicatorsIMS: Analytics[];
  dataDepartament = [];
  etiqueta:string
  dataSales: Analytics[];
  selection: any;
  frecuencia: any;
  totalVenta:number=0;
  totalObjetivo:number=0;
  totalAlcance:number=0;
  valor: string;
  constructor( public _imsDashboardService: DashboardService,public config: DynamicDialogConfig) { }


  formatAmount(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 0 })
  }
  formatAmount1(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 2 })
  }


  // displayedColumns: ColumnD<AnalyticsDetailsResults>[] =
  // [

  //  {template: (data) => { return data.etiqueta; }, field: 'id', header: 'Código', display: 'table-cell'},
  //  {template: (data) => { return data.value1; }, field: 'auxilliaryName', header: 'Auxiliar', display: 'table-cell'},
  //  {template: (data) => { return data.value4; }, field: 'auxilliaryName', header: 'Auxiliar', display: 'table-cell'},
  //  {template: (data) => { return data.value2; }, field: 'auxilliaryName', header: 'Auxiliar', display: 'table-cell'},
  //  {template: (data) => { return data.value; }, field: 'auxilliaryName', header: 'Auxiliar', display: 'table-cell'}
  
  // ];


  ngOnInit(): void {
    debugger
     this.selection=this.config.data.branch;
     this.frecuencia =this.config.data.frecuen;
     this.fetchTaxDataIms().then(()=>this.loadData10());
 
    
    let titulo=this.frecuencia==15?'Hoy':this.frecuencia==2?'Este mes':this.frecuencia==5?'Últimos 3 meses':'Últimos 6 meses'
  
     this.optionsTime = [
      { title: titulo,value:0}

     ];

  
    
    // this.dataDepartament.push({
    //   label: 'Departamentos($)',
    //   data: a.detailsResults.map(vl => vl.value),
    //   backgroundColor: a.detailsResults.map(vl => vl.colorHex),

    // })

    // this.listProduct=[
    //   { idProduct:1,idSupplier: 1,departament:'VIVERES',productName:'1',category:'Harina de maíz precocido pan',inventory:200,idBranchoffice:1,pointMedium:300,pointMax:800,pointMin:'<'},      
    //   { idProduct:2020,idSupplier: 1,departament:'FRULEVER',productName:'1',category:'Harina Juana 1kg',inventory:20,idBranchoffice:1,pointMedium:150,pointMax:400,pointMin:'>'},      
    //   { idProduct:2020,idSupplier: 1,departament:'CARNICERIA',productName:'1',category:'Leche en polvo',inventory:200,idBranchoffice:1,pointMedium:201,pointMax:500,pointMin:'<='},      
    //   { idProduct:2020,idSupplier: 1,departament:'BEBIDA ALCOHOLICA',productName:'1',category:'Arroz 1kg',inventory:20,idBranchoffice:1,pointMedium:50,pointMax:100,pointMin:'<='},     
    //   { idProduct:2020,idSupplier: 1,departament:'CHARCUTERIA',productName:'1',category:'Aceite vegetal Matel',inventory:180,idBranchoffice:1,pointMedium:200,pointMax:400,pointMin:'<='},
    //   { idProduct:2020,idSupplier: 1,departament:'CUIDADO PERSONAL',productName:'1',category:'Azucar Montalban 1kr',inventory:120,idBranchoffice:1,pointMedium:20,pointMax:50,pointMin:'>'},   
    //   { idProduct:2020,idSupplier: 1,departament:'CHUCHERIA',productName:'1',category:'Tomate perita',inventory:0,idBranchoffice:1,pointMedium:200,pointMax:500,pointMin:'>'},   
    //   { idProduct:2020,idSupplier: 1,departament:'LIMPIEZA',productName:'1',category:'Tomate perita',inventory:0,idBranchoffice:1,pointMedium:200,pointMax:500,pointMin:'>'},   
    //   { idProduct:2020,idSupplier: 1,departament:'PANADERIA',productName:'1',category:'Tomate perita',inventory:0,idBranchoffice:1,pointMedium:200,pointMax:500,pointMin:'>'},   
  
    // ]
  }


  fetchTaxDataIms() {
    debugger
    this.AnalyticsFilter.idBranchOffice =this.selection;
    this.AnalyticsFilter.indicators = [{ idFilterType:this.frecuencia, idIndicator: 56, parameters: null }];
    return this._imsDashboardService.getAnalyticsIndicators(this.AnalyticsFilter).toPromise()
      .then(data => {
        this.DataIndicatorsIMS = data
        
      })
  }

  loadData10() {
debugger
const evaluate = (a: any, b: any, op: '==' | '<=' | '>=' | '<' | '>' | '!=') => {
  switch (op) {
    case '==':
      return a == b
    case '<=':
      return a <= b
    case '>=':
      return a >= b
    case '<':
      return a < b
    case '>':
      return a > b
    case '!=':
      return a != b
  }
}
    this.dataSales = this.DataIndicatorsIMS?.filter(f => f.idIndicator == 56)
   
    if (this.dataSales?.length)
      this.dataSales[0].results[0].detailsResults
        .forEach((a,idx) => {

          this.dataDepartament.push({
            departamento:'('+(idx+1)+') '+ a.etiqueta,
            venta: a.value.toString(),
            comparador: a.value4,
            meta:a.value1==null?0:a.value1,
            porcentaje:a.value2==null?0:a.value2,
            direccion: evaluate(a.value, a.value1, a.value4 as any)?'success':'danger'

          })

         this.totalVenta =this.totalVenta+(a.value==null?0 :parseFloat(a.value.toString()));
         this.totalObjetivo=this.totalObjetivo+(a.value1==null?0:parseFloat(a.value1));
         this.totalAlcance=this.totalAlcance+(a.value2==null?0:parseFloat(a.value2));

        })
  }


}
