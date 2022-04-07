import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Bank } from 'src/app/models/masters/bank';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BankService } from '../shared/services/bank.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-bank-list',
  templateUrl: './banks-list.component.html',
  styleUrls: ['./banks-list.component.scss']
})
export class BankListComponent implements OnInit {

  loading = false;
  showFilters = false;
  showDialog = false;
  bank = new Bank();
  banks = [] as Bank[];
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  filters: BankFilters = new BankFilters();
  isCallback = false;
  displayedColumns = [];

    constructor(public bankService: BankService, private breadcrumbService: BreadcrumbService,
      private messageService: MessageService, public userPermissions: UserPermissions) {
      this.breadcrumbService.setItems([
        { label: 'Configuración' },
        { label: 'Maestros generales' },
        { label: 'Bancos', routerLink: ['/banks-list'] }
      ]);
    }

  ngOnInit(): void {

    this.displayedColumns = [
      { header: 'Id', display: 'none', field: 'id' },
      { header: 'Nombre', display: 'table-cell', field: 'name' },
      { header: 'Tipo de banco', display: 'table-cell', field: 'bankType'  },
      { header: 'País', display: 'table-cell', field: 'country'  },
      { header: 'Código de banco', display: 'table-cell', field: 'accountCode'  },
      { header: 'Código SWIFT', display: 'table-cell', field: 'swiftCode'  },
      { header: 'Estado', display: 'table-cell', field: 'active'  }
    ];

    this.search();
  }

  search() {
    this.loading = true;
    this.bankService.getBanks(this.filters).subscribe((data: Bank[]) => {
      this.banks = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  openNew() {
    //this.bank = { id: -1 } as Bank;
    this.showDialog = true;
  }

  editBank(bank) {
    this.bankService.getImageBanse64ByBankId(bank.id)
    .then(image => {
      bank.binaryImage = image;
      this.setEditBankRecord(bank);
      this.showDialog = true;
    });

  }

  setEditBankRecord(bank) {
    this.bank = {
      id: bank.id,
      name: bank.name,
      accountCode: bank.accountCode,
      active: bank.active,
      bankType: bank.bankType,
      country: bank.country,
      sudebanCode: bank.sudebanCode,
      swiftCode: bank.swiftCode,
      binaryImage: bank.binaryImage,
      accountingAccountCode:bank.accountingAccountCode,
      accountingAccountName:bank.accountingAccountName,
      accountingAccountId:bank.accountingAccountId
    } as Bank;
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.search();
    }
  }

}
