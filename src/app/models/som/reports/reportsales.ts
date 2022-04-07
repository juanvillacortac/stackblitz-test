import {
  SalesReportDetail
} from "./reportsalesdetail";

export class SalesReport {
  idBranchOffice: number = -1
  idProduct: number = -1
  name: string = ""
  references: string = ""
  brand: string = ""
  category: string = ""
  totalExistences:number=0
  totalExistencesUnds:number=0
  totalSales:number=0;
  totalSalesConv:number=0;
  totalQtySold:number=0;
  detail: SalesReportDetail[]=[]
}