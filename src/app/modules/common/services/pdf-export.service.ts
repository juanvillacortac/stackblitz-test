import { Injectable } from '@angular/core';
  // @ts-ignore
import jspdf from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private fileName = '';
  private listToExport: any[] = [];
  private colsHeader: any[] = [];

  exportData(fileName, listToExport, colsHeader) {
    this.fileName = fileName;
    this.listToExport = listToExport;
    this.colsHeader = colsHeader;
    this.exportPdf();
  }

 private exportPdf() {
  let doc = new jspdf('l', 'pt', 'legal');
  // @ts-ignore
  doc.autoTable({
    head: this.colsHeader,
    body: this.listToExport, styles: {fontSize: 7}
  });
  doc.save(this.fileName);

}
}
