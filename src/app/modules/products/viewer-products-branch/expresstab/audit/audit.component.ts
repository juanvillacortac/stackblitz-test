import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeIcons } from 'primeng/api';
import { AuditViewerProductBranch } from 'src/app/models/products/audit';
import { DataAuditViewerProductBranch } from 'src/app/models/products/dataaudit';
import { AuditFilter } from '../../../shared/filters/audit-filter';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  providers: [DatePipe]
})
export class AuditComponent implements OnInit {

  validationfactor: DataAuditViewerProductBranch[] = [];
  pointorder: DataAuditViewerProductBranch[] = [];
  productbranch: DataAuditViewerProductBranch[] =[];
  auditList: AuditViewerProductBranch[];

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private message: MessageService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    
  }

  load(idProduct: number, idPacking: number, idBranchOffice: number){
    var filter: AuditFilter = new AuditFilter();
    filter.idProduct = idProduct;
    filter.idPacking = idPacking;
    filter.idBranchOffice = idBranchOffice;
    this.productBrachOfficeService.getAuditbyFilter(filter).subscribe((data: AuditViewerProductBranch[]) => {
      if (data != null) {
        this.auditList = data;
        this.validationfactor = this.auditList[0].validationFactor.sort((a, b) => new Date(b.udpateDate).getTime() - new Date(a.udpateDate).getTime());
        this.pointorder = this.auditList[0].pointOrder.sort((a, b) => new Date(b.udpateDate).getTime() - new Date(a.udpateDate).getTime());
        this.productbranch = this.auditList[0].productBranchOffice.sort((a, b) => new Date(b.udpateDate).getTime() - new Date(a.udpateDate).getTime());
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar la auditoría del empaque" });
      }
    }, (error: HttpErrorResponse) => {

      this.message.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar la auditoría del empaque" });
    });
  }
}
