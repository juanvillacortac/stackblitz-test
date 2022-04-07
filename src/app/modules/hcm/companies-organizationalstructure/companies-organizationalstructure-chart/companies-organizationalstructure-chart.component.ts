import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//services
import { CompanyService } from '../../../hcm/shared/services/company.service';
//models
import { companyhierachical } from '../../shared/models/masters/company-hierachical';
//filters
import { companyhierarchicalfilter } from '../../../hcm/shared/filters/company-hierarchical-filter';
//Theme components
import { MessageService, TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';
//import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-companies-organizationalstructure-chart',
  templateUrl: './companies-organizationalstructure-chart.component.html', 
  styleUrls: ['./companies-organizationalstructure-chart.component.scss']
})
export class CompaniesOrganizationalstructureChartComponent implements OnInit, AfterViewInit {
  dataaux: companyhierachical[]
  data1: TreeNode[];
  JsonString: string;
  data2: any[];
  selectedNode: TreeNode;
  dialogVisible: boolean;
  FotoURL = '';
  Nombre = '';
  Cargo = '';
  OcupacionFija = 0;
  OcupacionTemporal  = 0;
  PlazasFijas  = 0;
  PlazasTemporales  = 0;
  position = 'right';
  displayPosition = false;
 

  constructor(private messageService: MessageService, private companyService: CompanyService, private actRoute: ActivatedRoute) { }

  CompanyHierarchicalsFilters: companyhierarchicalfilter = new companyhierarchicalfilter();

  cargos = [
    { cargo: 'Director General', nombre: 'Orlando D\' Leon', style: 'p-person', type : 'person' },
    { cargo: 'Director Tecnologia', nombre: 'Joniz Gonzalez', style: 'p-person', type: 'person' },
    { cargo: 'Director Operaciones', nombre: 'Jose D\' Leon', style: 'p-person', type: 'person' },
    { cargo: 'Gerente Operaciones', nombre: '', style: 'department-cfo', type : ''},
    { cargo: 'Supervisor A', nombre: '', style: 'department-coo', type: '' }, 
    { cargo: 'Analista del almacen A sector A', nombre: '', style: 'department-cto', type: '' }, 
    { cargo: 'Analista del almacen A sector B', nombre: '', style: 'department-cto', type: '' }, 
    { cargo: 'Analista del almacen A sector C', nombre: '', style: 'department-cto', type: '' }, 
    { cargo: 'PMO', nombre: '', style: 'department-cto', type: '' },
    { cargo: 'Desarrollo', nombre: '', style: 'department-cto', type: '' },
    { cargo: 'QA', nombre: '', style: 'department-cto', type: '' },
    { cargo: 'Analista de Limpieza', nombre: '', style: 'department-cto', type: '' },
    { cargo: 'Limpieza Analista 2', nombre: '', style: 'department-cto', type: '' }
  ];

  ngOnInit(): void {

    //Get jobPositions Data
   
  }

  ngAfterViewInit(): void{
    this.CompanyHierarchicalsFilters.company = this.actRoute.snapshot.params['id'];
    this.companyService.getCompanyHierarchicalOrg(this.CompanyHierarchicalsFilters).subscribe((data: string) => {
      if(data != ""){
        debugger;
        this.JsonString = data;
        this.data2 = JSON.parse(this.JsonString.replace(/CargosHijos/gi, "children").replace(/"Cargo":/gi, "\"label\":"));
        console.log(this.data2);
        this.data2.forEach(node => {
          this.expandRecursive(node);
        });
      }else{
        this.data2 = null;
      }

    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar Cargos dentro del diagrama" });
      });
  }

  expandRecursive(node: any) {
    node.type = node.IndCargoSupervisorio && node.PlazasFijas == 1 && node.PrimerNombre && node.PrimerApellido ? 'person' : '';
    node.styleClass = node.IndCargoSupervisorio && node.PlazasFijas == 1 && node.PrimerNombre && node.PrimerApellido ? 'p-person' : 'department-cto';
    node.FotoURL = (node.IndCargoSupervisorio && node.PlazasFijas == 1) && node.FotoURL ? node.FotoURL : '';
    node.data = { name: node.PrimerNombre && node.PrimerApellido ? node.PrimerNombre + ' ' + node.PrimerApellido : '' };
    
    node.expanded = node.IndCargoSupervisorio && node.PlazasFijas == 1;

    if (node.children) {
      node.children.forEach(childNode => {
          this.expandRecursive(childNode);
        });
    }
  }

  onNodeSelect(event) {
    console.log(event.node.FotoURL);
    this.FotoURL = event.node.FotoURL;
    console.log(this.FotoURL);

    this.Nombre = event.node.data.name;
    this.Cargo = event.node.label;
    this.OcupacionFija = event.node.OcupacionFija;
    this.OcupacionTemporal = event.node.OcupacionTemporal;
    this.PlazasFijas = event.node.PlazasFijas;
    this.PlazasTemporales = event.node.PlazasTemporales;
    this.displayPosition = true;
    
    // this.messageService.clear();
    // this.messageService.add({key: 'nodeMessage',severity:'info',sticky:true});
  }

  showDialog() {
    this.dialogVisible = true;
  }

}
