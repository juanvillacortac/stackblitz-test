import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-indicator',
  templateUrl: './table-indicator.component.html',
  styleUrls: ['./table-indicator.component.scss']
})
export class TableIndicatorComponent implements OnInit {
  @Input() image = '';
  @Input() tableData=[];
  @Input() name = '';
  @Input() currentValue = 0;
  @Input() legend = '';
  @Input() sublegend = '';
  @Input() target = 0;
  @Input() valueVsTarget = 0;
  @Input() url = '#';
  @Input() 
  colors = {
    red: "#F38BA0",
    lightRed: "#f5a7b7",
    green: "#70AF85",
    yellow: "#FFEB99",
    blue: "#98D6EA",
    lightBlue: "#b0dfef",
    grey: "#6D8299",
    purple: "#BEAEE2",
    orange: "#F39189",
    brown: "#DEBA9D"
  };
  formatAmount(amount: any) {
    
    return  parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  currentEffectiveness = 29;
  lastEffectiveness = 23;
 


  consolidatedBuyPie = {
    labels: ["A", "B"],
    datasets: [
      {
        data: [36, 7],
        backgroundColor: [this.colors.blue, this.colors.red],
        hoverBackgroundColor: [this.colors.lightBlue, this.colors.lightRed],
      },
    ],
  };

  pieOptions = {
    aspectRatio: 1,
    legend: {
      display: false,
      position: "bottom",
    },
    layout: {
      padding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 10
      }
    }
  };


  salesCumulated = [
    {
      description: "Ventas brutas",
      quantity: 28,
      amount: "$512.53",
    },
    {
      description: "Devoluciones",
      quantity: 3,
      amount: "$10.00",
    },
  ];

  buyesCumulated = [
    {
      description: "Compras brutas",
      quantity: 36,
      amount: "$512.53",
    },
    {
      description: "Devoluciones",
      quantity: 7,
      amount: "$10.00",
    },
  ];

 

  dataproducts: any;
  dataViewModel: any;
  etiketa: string="";
  data2: any

  constructor() { }

  consolidatedSalesPie:any;
  consolidatedSales = 39;
  quantity=25
  amount=502.53

  ngOnInit(): void {
    debugger
    this.quantity=this.tableData.length>2? this.tableData[2].quantity:this.quantity
    this.amount=parseFloat(this.tableData.length>2 ? this.tableData[2].amount:this.amount)
    if (this.tableData.length>2) {
      this.tableData.pop();
    }
    this.consolidatedSales=this.currentValue||39
    
    this.tableData?
    this.consolidatedSalesPie = {
     labels: [this.tableData[0].description, this.tableData[1].description], 
     datasets: [
       {
         data: [this.tableData[0].quantity, this.tableData[1].quantity],
         backgroundColor: [this.colors.blue, this.colors.red],
         hoverBackgroundColor: [this.colors.lightBlue, this.colors.lightRed],
       },
     ],
   }:
   this.consolidatedSalesPie = {
    labels: ["A", "B"],
    datasets: [
      {
        data: [28, 3],
        backgroundColor: [this.colors.blue, this.colors.red],
        hoverBackgroundColor: [this.colors.lightBlue, this.colors.lightRed],
      },
    ],
  }
  }

}
