import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ISLRDiscountFilter } from '../../shared/filters/islr-discount-filter';
import { ISLRDiscount } from '../../shared/models/laborRelationship/islr-discount';
import { ISLRDiscountService } from '../../shared/services/islr-discount.service';

@Component({
  selector: 'employee-islr-discount',
  templateUrl: './employee-islr-discount.component.html',
  styleUrls: ['./employee-islr-discount.component.scss']
})
export class EmployeeIslrDiscountComponent implements OnInit {

  mainCurrency: string = localStorage.getItem("mainCurrency");
  
  displayedColumns: ColumnD<ISLRDiscount>[] =
    [
      { template: (data) => { return data.discountMonth; }, header: 'Mes', field: 'discountMonth', display: 'table-cell' },
      { template: (data) => { return data.discountPorcentage; }, header: '% Retención', field: 'discountPorcentage', display: 'table-cell' },
      // { template: (data) => { return data.withheldAmount; }, header: 'Monto retenido ('+ this.mainCurrency + ')', field: 'withheldAmount', display: 'table-cell' },
      { template: (data) => { return data.withheldAmount; }, header: 'Monto retenido', field: 'withheldAmount', display: 'table-cell' },
    ];

  constructor(
    public messageService: MessageService,
    public _ISLRDiscountService: ISLRDiscountService,
  ) { }
  
  ngOnInit(): void {
    debugger;
    this.generateYears();
    this.searchDiscounts();

  }

  @ViewChild("year111", {read: Dropdown}) year111: Dropdown;

  @Input() years: number[] = [];
  @Input() yearDef : number;
  yearsDropdown: SelectItem[] = [];
  i: number = 0;
  loading : boolean = false;
  ISLRDiscountFiltersSearch: ISLRDiscountFilter = new ISLRDiscountFilter();

  generateYears(){
    this.yearsDropdown = this.years.map((item)=>({
      label: item.toString(),
      value: item
    }));
  }

  rangeYear () {
    let max = new Date().getFullYear()
    let min = max - 20
    let years = []
  
    for (let i = max; i >= min; i--) {
        years.push(i)
    }
    this.yearsDropdown = this.years.map((item)=>({
      label: item.toString(),
      value: item
    }));
  }

  searchDiscounts(){
    if ( this.yearDef == undefined ) {
      this.messageService.add({severity:'error', summary:'Alerta', detail: "Debe seleccionar un año para realizar una búsqueda."});
    } else {
      // this.messageService.add({severity:'success', summary:'Alerta', detail: "Buscando descuentos."});

      this.ISLRDiscountFiltersSearch.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));
      this.ISLRDiscountFiltersSearch.discountYear = this.yearDef;
      debugger;
      this._ISLRDiscountService.getISLRDiscountList(this.ISLRDiscountFiltersSearch).subscribe((data: ISLRDiscount[]) => {
        this._ISLRDiscountService._ISLRDiscountList = data;
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los descuentos por ISLR." });
      });
    }
  }

}
