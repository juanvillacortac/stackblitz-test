import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ReceptionViewer } from 'src/app/models/srm/reception-viewer';
import { ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { PdfExportService } from 'src/app/modules/common/services/pdf-export.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseReceptionService } from '../../shared/services/merchandise-reception/merchandise-reception.service';
import { MenuItem } from 'primeng/api';
import { EnumReceptionStatus } from '../../shared/Utils/enum-reception-status.enum';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { StatusReception, TypeReception } from '../../shared/Utils/status-reception';
import { jsPDF } from 'jspdf';
import { autoTable as AutoTable } from 'jspdf-autotable';

@Component({
  selector: 'app-reception-list',
  templateUrl: './reception-list.component.html',
  styleUrls: ['./reception-list.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class ReceptionListComponent implements OnInit {
  fileName = '';
  showFilters = true;
  loading  = false;
  filters: ReceptionFilters = new ReceptionFilters();
  receptionList: ReceptionViewer[] = [];
  displayedColumns: any[] = [];
  hiddenColumns: any[] = [];
  permissionsIDs = {...Permissions};
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];
  receptionModalShow = false;
  receptionStatus = EnumReceptionStatus.pending;
  receptionIdStatus : typeof StatusReception =  StatusReception;
  receptiontype : typeof TypeReception = TypeReception;
  receptionStatusOptions: MenuItem[];
  chieldReceptionModalShow: boolean = false;
  receptionIdSelected: number = 0;
  @Input() supplierViewer = false;

  constructor(
    private _merchandiseReceptionService: MerchandiseReceptionService,
    private breadcrumbService: BreadcrumbService ,
    private dialogService: DialogsService,
    private _decimalPipe: DecimalPipe,
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions,
    private readonly pdfExportService: PdfExportService,
    public datepipe: DatePipe,
    private readonly dateHelper: DateHelperService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.breadcrumbService.setItems([

        { label: 'OSM' },
        { label: 'SRM',routerLink: ['/srm/dashboard-general-srm']  },
        { label: 'Recepción de mercancía', routerLink: ['/srm/reception-viewer'] }
    ]);
  }
  ngOnInit(): void {
    this.loadColumns();
    this.loadReceptionOptions();
    this.getFilters();
  }
  search() {
    this.loadReceptionList();
  }

loadColumns() {

  this.displayedColumns = [
    {field: 'edit', header: ' ', display: 'table-cell',
    showColumn: true, dataType: 'button', isAllowed: true},
    {field: 'id', header: 'id', display: 'none',
    showColumn: false, dataType: 'number', isAllowed: true},
    {field: 'receptionNumber', header:  this.getHeaderCollumnsName('receptionNumber_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'branchOffice', header:  this.getHeaderCollumnsName('branchOffice_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'area', header:  this.getHeaderCollumnsName('area_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'negotiationType', header:  this.getHeaderCollumnsName('negotiationType_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'invoice', header:  this.getHeaderCollumnsName('invoice_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'documentNumber', header:  this.getHeaderCollumnsName('documentNumber_optional_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'receptionType', header:  this.getHeaderCollumnsName('receptionType_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'status', header:  this.getHeaderCollumnsName('status_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'receptionNumberRelated', header:  this.getHeaderCollumnsName('receptionNumberRelated_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'receptionDocumentType', header:  this.getHeaderCollumnsName('documentType_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'ocNumber', header:  this.getHeaderCollumnsName('ocNumber_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'documentTypeRelated', header:  this.getHeaderCollumnsName('documentTypeRelated_field'), display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},

    {field: 'centralizedInvoiceInd', header:  this.getHeaderCollumnsName('centralized_invoice'), display: 'table-cel',
    showColumn: false, dataType: 'boolean', isAllowed: true},

    {field: 'itemsQty', header:  this.getHeaderCollumnsName('itemsQty_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    // {field: 'itemsReceived', header:  this.getHeaderCollumnsName('itemsReceived_field'), display: 'table-cell',
    // showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'baseInvoiceAmount', header:  this.getHeaderCollumnsName('baseInvoiceAmount_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'baseTotalAmount', header:  this.getHeaderCollumnsName('baseTotalAmount_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'baseDifference', header:  this.getHeaderCollumnsName('baseDifference_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'convertionInvoiceAmount', header:  this.getHeaderCollumnsName('convertionInvoiceAmount_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'convertionTotalAmount', header:  this.getHeaderCollumnsName('convertionTotalAmount_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},
    {field: 'convertionDifference', header:  this.getHeaderCollumnsName('convertionDifference_field'), display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed:  this.checkPermission},

    {field: 'receivingOperator', header:  this.getHeaderCollumnsName('receivingOperator_field'), display: 'table-cell',
    showColumn: true, dataType: 'string-image', isAllowed: true},
    {field: 'validatorOperator', header:  this.getHeaderCollumnsName('validatorOperator_field'), display: 'table-cell',
    showColumn: true, dataType: 'string-image', isAllowed: true},
    {field: 'creatorOperator', header:  this.getHeaderCollumnsName('creatorOperator_field'), display: 'none',
    showColumn: false, dataType: 'string-image', isAllowed: false},

    {field: 'receptionDate', header:  this.getHeaderCollumnsName('receptionDate_field'), display: 'table-cel',
    showColumn: false, dataType: 'date', isAllowed: true},
    {field: 'startDate', header:  this.getHeaderCollumnsName('startDate_field'), display: 'table-cel',
    showColumn: false, dataType: 'date', isAllowed: true},
    {field: 'endDate', header:  this.getHeaderCollumnsName('endDate_field'), display: 'table-cel',
    showColumn: false, dataType: 'date', isAllowed: true},
    {field: 'validationDate', header:  this.getHeaderCollumnsName('validationDate_field'), display: 'table-cel',
    showColumn: false, dataType: 'date', isAllowed: true}


  ];

  this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
  this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
}


  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getCollumnReportName('report');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }
  exportPDF() {
    if (!this.dataUnavailable) {
      this.fileName = this.getCollumnReportName('report');
      const headers = this.loadColumnsHeader();
      const listToExport = this.loadModelToExportPDF() 
      // var doc = new jsPDF('p', 'pt');
      // doc = new jsPDF('l', 'pt', 'legal');
      // doc.autoTable({
      //    head: headers,
      //    body: listToExport,
      //    styles: { fontSize: 7 }
      // });
      //doc.save(this.fileName);
      this.pdfExportService.exportData(this.fileName, listToExport, headers);
    }
  }
  loadColumnsHeader() {
    const cols: any[] = [];
    const cols1: any[] = [];
    this.displayedColumns.filter(p => p.field !='edit'  && p.field !='id' && p.field !='negotiationType'&& p.field !='receptionType' && p.field !='baseDifference'
     && p.field !='convertionInvoiceAmount' && p.field != 'convertionTotalAmount'&& p.field != 'convertionDifference' && p.field !='startDate' && p.field !='endDate' && p.field != 'validationDate' )
    .forEach(col => {
            cols1.push(this.getTextByKey(col.header));
     });
     cols.push(cols1);
     return cols;
  }
loadModelToExportPDF() {
  return this.receptionList.map( item => {
    const itm: Array<string> = [];
    itm.push(item.receptionNumber);
    itm.push(item.branchOffice);
    itm.push(item.area);
    //itm.push(item.negotiationType);
    itm.push(item.invoice);
    itm.push(item.documentNumber);
    //itm.push(item.receptionType);
    itm.push(item.status);
    itm.push(item.receptionNumberRelated);
    itm.push(item.documentType);
    itm.push(item.ocNumber);
    itm.push(item.documentTypeRelated);
    if(item.isCentralizedInvoice==true)
       itm.push('Si');
    else  
       itm.push('No');
    itm.push(item.itemsQty.toString());
    //itm.push(item.itemsReceived.toString());
    itm.push(this._decimalPipe.transform(item.baseInvoiceAmount, '1.2-2').toString());
    itm.push(this._decimalPipe.transform(item.baseTotalAmount, '1.2-2').toString());
    //itm.push(this._decimalPipe.transform(item.baseDifference, '1.2-2').toString());
    //itm.push(this._decimalPipe.transform(item.convertionInvoiceAmount, '1.2-2').toString());
    //itm.push(this._decimalPipe.transform(item.convertionTotalAmount, '1.2-2').toString());
    //itm.push(this._decimalPipe.transform(item.convertionDifference, '1.2-2').toString());
    itm.push(item.receivingOperator);
    itm.push(item.validatorOperator);
    itm.push(item.creatorOperator);
    // itm.push(this.isMinimumDateTimeValue(item.receptionDate) ? '' :
    //         this.datepipe.transform(item.receptionDate, 'dd-MM-yyyy'));
    // itm.push(this.isMinimumDateTimeValue(item.startDate) ? '' :
    //         this.datepipe.transform(item.startDate, 'dd-MM-yyyy'));
    // itm.push(this.isMinimumDateTimeValue(item.endDate) ? '' :
    //         this.isMinimumDateTimeValue(item.validationDate) ? '' :
    //         this.datepipe.transform(item.validationDate, 'dd-MM-yyyy'));
    return itm;
  });
}
  loadModelToExport() {
    const list = this.checkPermission ? this.loadFullModel() : this.loadModelWhitoutCostFields();
    return list;
  }
  get checkPermission() {
    return this.userPermissions.allowed(this.permissionsIDs.CHECK_RECEPTION_PERMISSION_ID);
  }
  get dataUnavailable() {
    return (!this.receptionList  || this.receptionList.length === 0);
  }

  private loadFullModel() {
   return this.receptionList.map( item => {
      return {
        [this.getCollumnReportName('receptionNumber_field')]: item.receptionNumber,
        [this.getCollumnReportName('branchOffice_field')]: item.branchOffice,
        [this.getCollumnReportName('area_field')]: item.area,
        [this.getCollumnReportName('negotiationType_field')]: item.negotiationType,
        [this.getCollumnReportName('invoice_field')]: item.invoice,
        [this.getCollumnReportName('documentNumber_optional_field')]: item.documentNumber,
        [this.getCollumnReportName('receptionType_field')]: item.receptionType,
        [this.getCollumnReportName('status_field')]: item.status,
        [this.getCollumnReportName('receptionNumberRelated_field')]: item.receptionNumberRelated,
        [this.getCollumnReportName('documentType_field')]: item.documentType,
        [this.getCollumnReportName('ocNumber_field')]: item.ocNumber,
        [this.getCollumnReportName('documentTypeRelated_field')]: item.documentTypeRelated,
        [this.getCollumnReportName('itemsQty_field')]: item.itemsQty,
        //[this.getCollumnReportName('itemsReceived_field')]: item.itemsReceived,
        [this.getCollumnReportName('baseInvoiceAmount_field')]: this._decimalPipe.transform(item.baseInvoiceAmount, '1.2-2'),
        [this.getCollumnReportName('baseTotalAmount_field')]: this._decimalPipe.transform(item.baseTotalAmount, '1.2-2'),
        [this.getCollumnReportName('baseDifference_field')]:  this._decimalPipe.transform(item.baseDifference, '1.2-2'),
        [this.getCollumnReportName('convertionInvoiceAmount_field')]: this._decimalPipe.transform(item.convertionInvoiceAmount, '1.2-2'),
        [this.getCollumnReportName('convertionTotalAmount_field')]: this._decimalPipe.transform(item.convertionTotalAmount, '1.2-2'),
        [this.getCollumnReportName('convertionDifference_field')]: this._decimalPipe.transform(item.convertionDifference, '1.2-2'),
        [this.getCollumnReportName('receivingOperator_field')]: item.receivingOperator,
        [this.getCollumnReportName('validatorOperator_field')]: item.validatorOperator,
        [this.getCollumnReportName('creatorOperator_field')]: item.creatorOperator,
        [this.getCollumnReportName('receptionDate_field')]: this.isMinimumDateTimeValue(item.receptionDate) ? '' :
            this.datepipe.transform(item.receptionDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('startDate_field')]: this.isMinimumDateTimeValue(item.startDate) ? '' :
            this.datepipe.transform(item.startDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('endDate_field')]: this.isMinimumDateTimeValue(item.endDate) ? '' :
            this.datepipe.transform(item.endDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('validationDate_field')]: this.isMinimumDateTimeValue(item.validationDate) ? '' :
            this.datepipe.transform(item.validationDate, 'dd-MM-yyyy')
      };
    });
  }
  private loadModelWhitoutCostFields() {
    return this.receptionList.map( item => {
       return {
        [this.getCollumnReportName('receptionNumber_field')]: item.receptionNumber,
        [this.getCollumnReportName('branchOffice_field')]: item.branchOffice,
        [this.getCollumnReportName('area_field')]: item.area,
        [this.getCollumnReportName('negotiationType_field')]: item.negotiationType,
        [this.getCollumnReportName('invoice_field')]: item.invoice,
        [this.getCollumnReportName('documentNumber_optional_field')]: item.documentNumber,
        [this.getCollumnReportName('receptionType_field')]: item.receptionType,
        [this.getCollumnReportName('status_field')]: item.status,
        [this.getCollumnReportName('receptionNumberRelated_field')]: item.receptionNumberRelated,
        [this.getCollumnReportName('documentType_field')]: item.documentType,
        [this.getCollumnReportName('ocNumber_field')]: item.ocNumber,
        [this.getCollumnReportName('documentTypeRelated_field')]: item.documentTypeRelated,
        [this.getCollumnReportName('itemsQty_field')]: item.itemsQty,
        ///[this.getCollumnReportName('itemsReceived_field')]: item.itemsReceived,
        [this.getCollumnReportName('receivingOperator_field')]: item.receivingOperator,
        [this.getCollumnReportName('validatorOperator_field')]: item.validatorOperator,
        [this.getCollumnReportName('creatorOperator_field')]: item.creatorOperator,
        [this.getCollumnReportName('receptionDate_field')]: this.isMinimumDateTimeValue(item.receptionDate) ? '' :
            this.datepipe.transform(item.receptionDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('startDate_field')]: this.isMinimumDateTimeValue(item.startDate) ? '' :
            this.datepipe.transform(item.startDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('endDate_field')]: this.isMinimumDateTimeValue(item.endDate) ? '' :
            this.datepipe.transform(item.endDate, 'dd-MM-yyyy'),
        [this.getCollumnReportName('validationDate_field')]: this.isMinimumDateTimeValue(item.validationDate) ? '' :
            this.datepipe.transform(item.validationDate, 'dd-MM-yyyy')
       };
     });
   }

  private getCollumnReportName(name: string) {
    return this.getTextByKey(`srm.merchandise_receptions.${name}`);
  }

  private getHeaderCollumnsName(name: string) {
    return `srm.merchandise_receptions.${name}`;
  }

  private loadReceptionList() {
    this.loadingService.startLoading();
    this._merchandiseReceptionService
    .getReceptionlist({...this.filters})
    .subscribe(data =>{
       this.receptionList = data.sort((a, b) => new Date(b.receptionDate).getTime() - new Date(a.receptionDate).getTime());
       this.loadingService.stopLoading()
       },
       (error: HttpErrorResponse) => {
        this.loadingService.stopLoading();
        this.dialogService.errorMessage('srm.merchandise_receptions.viewer', error?.error?.message ?? 'error_service');
      });
  }

  private handleError(error: HttpErrorResponse) {
   
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn && col.isAllowed) );
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  isMinimumDateTimeValue(date: Date): Boolean {
    return new Date(date).getDate() === new Date('1/1/0001').getDate();
  }

  getValidDate(date: Date) {
    const gmtDate = this.dateHelper.utcToGMT(new Date(date));
    return gmtDate;
  }

  loadReceptionOptions() {
    this.receptionStatusOptions = [];
    this.receptionStatusOptions.push(
      {label: 'Iniciar', icon: 'pi pi-play', command: () => {
          this.receptionStatus = EnumReceptionStatus.started;
          this.receptionModalShow = true;
      }},
      {label: 'Planificar', icon: 'pi pi-calendar-plus', command: () => {
        this.receptionStatus = EnumReceptionStatus.pending;
        this.receptionModalShow = true;
      }}
    );
  }
  createReception(order) {
    this.receptionModalShow = true;
  }
  public childCallBack(result: number): void {
    this.receptionModalShow = false;

    if(result > 0) {
      this.router.navigate(['/srm/reception', result], {state: this.getReceptionFilters()});
    }
}

childReceptionCallBack(result: number) {
  this.chieldReceptionModalShow = false;

  if(result > 0) {

  }
}

onShowDetail(reception:ReceptionViewer) {
  if(reception.receptionTypeId==2)
    this.router.navigate(['/srm/reception', reception.id], {state: this.getReceptionFilters()});
  else
    this.router.navigate(['/srm/simple-reception', reception.id], {state: this.getReceptionFilters()});
}

onShowchildReceptionDetail(reception) {
  this.receptionIdSelected = reception.id;
  this.chieldReceptionModalShow = true;
}

allowAddChild(reception: ReceptionViewer) {
    return this.userPermissions.allowed(this.permissionsIDs.UPDATE_CHILD_RECEPTIONS_ID)
    && (reception.statusId === EnumReceptionStatus.pending || reception.statusId === EnumReceptionStatus.started)
    && !this.supplierViewer && !reception.isCentralizedInvoice && reception.receptionTypeId == 2; //receptionTypeId = 2 = parent
}

private getFilters() {
  const receptionfilters = history.state.queryParams?.receptionFilters;

  if (receptionfilters) {
    this.filters = receptionfilters;
    this.search();
  }
}

private getReceptionFilters() {
  const queryParams: any = {};
  queryParams.receptionFilters = JSON.stringify(this.filters);
  queryParams.dir = this.supplierViewer ? '/srm/viewer-document':'/srm/reception-viewer';
  const navigationExtras: NavigationExtras = {
    queryParams
  };

  return navigationExtras;
}

}
