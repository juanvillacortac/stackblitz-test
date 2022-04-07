import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Reception } from 'src/app/models/srm/reception';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { MerchandiseReceptionService } from '../../../shared/services/merchandise-reception/merchandise-reception.service';
import { ValidationProductService } from '../../../shared/services/validation-product/validation-product.service';

@Component({
  selector: 'app-reception-validation',
  templateUrl: './reception-validation.component.html',
  styleUrls: ['./reception-validation.component.scss']
})
export class ReceptionValidationComponent implements OnInit {
  isSave: boolean = true;
  @Input() reception: Reception = new Reception();
  purchaseValidateHeader: PurchaseValidation = new PurchaseValidation();
  constructor(private ValidationService: ValidationProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { 

  }

  ngOnInit(): void {
  }


getPurchaseValid(id: number) {
  this.ValidationService.getPurchaseValidate(id).subscribe((data: PurchaseValidation) => {
    if (data != null) {
      this.purchaseValidateHeader = data;     
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la compra." });
    }
  }, (error: HttpErrorResponse) => {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la compra." });
  });
}

}
