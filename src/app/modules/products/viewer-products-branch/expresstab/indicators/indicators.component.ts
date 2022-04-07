import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { PackingByBranchOfficeFilter } from '../../../shared/filters/packingbybranchoffice-filter';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {

  packingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  @Input("productPacking") productPacking: PackingByBranchOffice = new PackingByBranchOffice();
  submitted: boolean = false;

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  searchPricesCostsbyBranchOffice(idBranchOffice: number, idProduct: number, idPacking: number) {
    var packingBranchOfficeFilter: PackingByBranchOfficeFilter = new PackingByBranchOfficeFilter();
    packingBranchOfficeFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    packingBranchOfficeFilter.idProduct = parseInt(idProduct.toString());
    packingBranchOfficeFilter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(packingBranchOfficeFilter).subscribe((data: PackingByBranchOffice[]) => {
      this.packingBranchOffice = data[0];
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los indicadores" });
    });
  }

  saveIndicators() {
    this.submitted = true;
    var packingBranchOfficelist: PackingByBranchOffice[] = [];
    this.packingBranchOffice.idProduct = parseInt(this.packingBranchOffice.idProduct.toString());
    this.packingBranchOffice.idPacking = this.packingBranchOffice.idPacking;
    this.packingBranchOffice.idBranchOffice = parseInt(this.packingBranchOffice.idBranchOffice.toString());
    this.packingBranchOffice.description = "";
    packingBranchOfficelist.push(this.packingBranchOffice);

    this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.submitted = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los indicadores" });
      }
    }, (error) => {
      console.log(error);
    });

  }
}
