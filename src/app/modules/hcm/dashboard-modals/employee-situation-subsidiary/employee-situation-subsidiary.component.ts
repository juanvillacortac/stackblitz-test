import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeSituationOB } from 'src/app/models/hcm/employeesituation-ob';

@Component({
  selector: 'app-employee-situation-subsidiary',
  templateUrl: './employee-situation-subsidiary.component.html',
  styleUrls: ['./employee-situation-subsidiary.component.scss']
})
export class EmployeeSituationSubsidiaryComponent implements OnInit {
  listEmployeeSit: EmployeeSituationOB[]=[];

  constructor(private router: Router,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.listEmployeeSit=[
      { idEmployee:1,idSupplier: 1,branchName:'Parque Porlamar',productName:'1',inventory:30,idBranchoffice:1,holidays:5,dayoff:1,excusedabsence:3,unjustifiedabsence:3, available:18},      
      { idEmployee:2020,idSupplier: 1,branchName:'Parque Costazul',productName:'1',inventory:30,idBranchoffice:1,holidays:3,dayoff:2,excusedabsence:2,unjustifiedabsence:3, available:20},      
      { idEmployee:2020,idSupplier: 1,branchName:'Sambil',productName:'1',inventory:30,idBranchoffice:1,holidays:2,dayoff:1,excusedabsence:1,unjustifiedabsence:3, available:23},          
      { idEmployee:2020,idSupplier: 1,branchName:'La Vela',productName:'1',inventory:10,idBranchoffice:1,holidays:2,dayoff:0,excusedabsence:1,unjustifiedabsence:3, available:4} ,
      { idEmployee:2020,idSupplier: 1,branchName:'Sigo +',productName:'1',inventory:25,idBranchoffice:1,holidays:1,dayoff:0,excusedabsence:0,unjustifiedabsence:3, available:21} ,
   
  
    ]

  }

}
