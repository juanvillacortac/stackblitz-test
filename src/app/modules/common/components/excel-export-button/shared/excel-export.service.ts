import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  private fileName = '';
  private listToExport: any[] = [];

  exportData(fileName, listToExport) {
    this.fileName = fileName;
    this.listToExport = listToExport;
    this.exportExcel();
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listToExport);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, this.fileName);
    }).catch(err => console.error(err));
}

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }).catch(err => console.error(err));
  }

}


