import { Component, OnInit } from '@angular/core';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { Payment } from '../models';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss']
})
export class PaymentsListComponent implements OnInit {
  
  suppliers: SupplierExtend[] = [];
  supplierClassifications: SupplierClasification[];
  
  payments: Payment[] = [
    {
      ...new Payment(),
      documentNumber:"PG-1",
      paymentType:"Aplicacion directa",
      originAccount: ' Provincial-0134256314589652',
      currency: "Bolivar",
      lot:"ADAM_BM2007",
      totalAmount: 100,
      creationDate: "07/08/2018",
      contabilizationDate: "07/09/2018",
      transactionDate: "09/09/2018"
    },
    {
      ...new Payment(),
      documentNumber:"PG-2",
      paymentType:"Aplicacion directa",
      originAccount: ' Provincial-0134256314589652',
      currency: "Bolivar",
      lot:"ADAM_BM2007",
      totalAmount: 5,  
      creationDate: "07/08/2018",
      contabilizationDate: "07/09/2018",
      transactionDate: "09/09/2018" 
    },
    {
      ...new Payment(),
      documentNumber:"PG-3",
      paymentType:"Anticipo",
      originAccount: ' Provincial-0134256314589652',
      currency: "Bolivar",
      lot:"ADAM_BM2007",
      totalAmount: 2 ,
      creationDate: "07/08/2018",
      contabilizationDate: "07/09/2018",
      transactionDate: "09/09/2018"
    },
    {
      ...new Payment(),
      documentNumber:"PG-4",
      paymentType:"Anticipo",
      originAccount: ' Provincial-0134256314589652',
      currency: "Bolivar",
      lot:"ADAM_BM2007",
      totalAmount: 6 , 
      creationDate: "07/08/2018",
      contabilizationDate: "07/09/2018",
      transactionDate: "09/09/2018"
    }
  ]
  constructor(
    private supplierService: SupplierService,
    private supplierClassificationService: SupplierclasificationService,
    private loadingService: LoadingService, 
  ) { }

  ngOnInit(): void {
    this.loadingService.startLoading();
    Promise.all([this.fetchSupplierData()]).then(() => {
      this.loadingService.stopLoading();
    })
  }

  async fetchSupplierData(){
    const fmsClients = await this.supplierService
          .getFMSSetupList()
          .toPromise();

    this.suppliers = (
      await this.supplierService.getSupplierExtendList().toPromise()
    )
    .filter(s => !s.indclient)
    .map((c) => ({
      ...c,
      financialSetup: fmsClients.find(
        (fms) => fms.clientSupplierId == c.idclientsupplier
      ),
    }))
    .filter((c) => c.financialSetup?.accountingAccounts?.length)
    .filter((c) =>
      c.financialSetup?.accountingAccounts.find(
        (aa) => aa.use.toLocaleLowerCase() == "ventas"
      )
    )
    .sort((a, b) => a.socialReason.localeCompare(b.socialReason));

    this.supplierClassifications = (
      await this.supplierClassificationService
        .getSupplierClasificationList()
        .toPromise()
    ).sort((a, b) =>
      a.supplierclasification.localeCompare(b.supplierclasification)
    );
    console.log(this.supplierClassifications,this.suppliers)
      
  }


}


