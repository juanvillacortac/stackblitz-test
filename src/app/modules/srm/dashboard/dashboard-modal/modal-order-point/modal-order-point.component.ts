import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InventoryProductInfo} from 'src/app/models/srm/inventoryproduct-info';

@Component({
  selector: 'app-modal-order-point',
  templateUrl: './modal-order-point.component.html',
  styleUrls: ['./modal-order-point.component.scss']
})
export class ModalOrderPointComponent implements OnInit {
  listProduct:InventoryProductInfo[]=[];
  constructor(private router: Router,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }
 
 
 
  CreateOrder(id:number){
    this.ref.close(0);
    this.router.navigate(['srm/purchase-order', id]);

  }
  ngOnInit(): void {

    this.listProduct=[
      { idProduct:1,idSupplier: 1,branchName:'Sigo porlamar',productName:'1',category:'Harina de maíz precocido pan',inventory:20,idBranchoffice:1,pointMedium:100,pointMax:800,pointMin:50},      
      { idProduct:2020,idSupplier: 1,branchName:'PCA supermarket',productName:'1',category:'Harina Juana 1kg',inventory:20,idBranchoffice:1,pointMedium:150,pointMax:400,pointMin:25},      
      { idProduct:2020,idSupplier: 1,branchName:'Sigo sambil',productName:'1',category:'Leche en polvo',inventory:200,idBranchoffice:1,pointMedium:201,pointMax:500,pointMin:50},      
      { idProduct:2020,idSupplier: 1,branchName:'Sigo proveduria',productName:'1',category:'Arroz 1kg',inventory:20,idBranchoffice:1,pointMedium:50,pointMax:100,pointMin:22},      
      { idProduct:2020,idSupplier: 1,branchName:'Bodegon La vela',productName:'1',category:'Aceite vegetal Matel',inventory:180,idBranchoffice:1,pointMedium:200,pointMax:400,pointMin:100} ,
      { idProduct:2020,idSupplier: 1,branchName:'Bodegon Sambil',productName:'1',category:'Azucar Montalban 1kr',inventory:120,idBranchoffice:1,pointMedium:20,pointMax:50,pointMin:12} ,
      { idProduct:2020,idSupplier: 1,branchName:'Sigo Max CostaAzul',productName:'1',category:'Tomate perita',inventory:0,idBranchoffice:1,pointMedium:200,pointMax:500,pointMin:120} ,
   
  
    ]
  }
  
    


}
