import { Component, OnInit } from '@angular/core';
import { Table } from 'jspdf-autotable';
import { SalesSuppliersProducts } from 'src/app/models/srm/sales-supplier-products';

@Component({
  selector: 'app-modal-sales',
  templateUrl: './modal-sales.component.html',
  styleUrls: ['./modal-sales.component.scss']
})
export class ModalSalesComponent implements OnInit {
  productssales: SalesSuppliersProducts[];
  loading: boolean = true;
  constructor() { }

  ngOnInit(): void {

    this.productssales = [
      { idProduct: 1,name: 'HARINA PAN 1KGR',branch:"Sigo Porlamar",category:"VIVERES",inventory:300,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 2,name: 'ARROZ MARY 1KGR',branch:"Sigo Porlamar",category:"VIVERES",inventory:50,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 3,name: 'CAFE MOLIDO MADRID',branch:"Sigo Porlamar",category:"VIVERES",inventory:400,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 4,name: 'AZUCAR REFINADA MONTALBAN',branch:"Sigo Porlamar",category:"VIVERES",inventory:300,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 5,name: 'HARINA DE TRIGO ROBBINSON',branch:"Sigo Porlamar",category:"VIVERES",inventory:220,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 6,name: 'ARROZ PANTERA',branch:"Sigo Porlamar",category:"VIVERES",inventory:110,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 7,name: 'CARAOTAS PANTERA',branch:"Sigo Porlamar",category:"VIVERES",inventory:660,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 8,name: 'CARAOTAS A GRANEL',branch:"Sigo Porlamar",category:"VIVERES",inventory:10,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 9,name: 'ACEITE MATTEL',branch:"Sigo Parque costazul",category:"VIVERES",inventory:10,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 10,name: 'ACEITE D OLIVA',branch:"Sigo La vela",category:"VIVERES",inventory:4,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 11,name: 'SALSAS PARA PASTAS RONCO',branch:"Sigo Porlamar",category:"",inventory:30,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 12,name: 'PASTA RONCO 1KGR',branch:"Sigo Max 1",category:"VIVERES",inventory:500,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 13,name: 'PASTA MARY',branch:"Sigo Max 2",category:"VIVERES",inventory:0,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 14,name: 'SALSA DE SOYA 50ONZ',branch:"Sigo Boca de rio",category:"VIVERES",inventory:40,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 15,name: 'SALSA DE AJO 30ONZ',branch:"Sigo Sambil",category:"VIVERES",inventory:20,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 16,name: 'SALSA TERAYAQUI 30ONZ',branch:"Sigo Parque Porlamar",category:"VIVERES",inventory:10,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202},
      { idProduct: 17,name: 'SALSA DE TOMATE PAMPERO 50ML',branch:"Sigo Porlamar",category:"VIVERES",inventory:80,categoryfather:"",salesbase:"300.000.000,78",salesconvertion:"450,77$",unitSales:202}
    
      
  ];
  this.loading = false;
  }
  


}
