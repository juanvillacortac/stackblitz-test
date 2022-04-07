import {
  DatePipe,
  DecimalPipe
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  MenuItem,
  MessageService,
  SelectItem
} from 'primeng/api';
import {
  ColumnD
} from 'src/app/models/common/columnsd';
import {
  Category
} from 'src/app/models/masters-mpc/category';
import {
  Coins
} from 'src/app/models/masters/coin';
import {
  SalesReport
} from 'src/app/models/som/reports/reportsales';
import {
  SalesReportFilter
} from 'src/app/models/som/reports/reportsalesfilter';
import {
  AuthService
} from 'src/app/modules/login/shared/auth.service';
import {
  CategoryFilter
} from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import {
  ClassificationFilter
} from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import {
  ProducttypeFilter
} from 'src/app/modules/masters-mpc/shared/filters/common/producttype-filter';
import {
  StatusFilter
} from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import {
  StructuretypeFilter
} from 'src/app/modules/masters-mpc/shared/filters/common/structuretype-filter';
import {
  ProductorigintypeFilter
} from 'src/app/modules/masters-mpc/shared/filters/productorigintype-filter';
import {
  CategoryService
} from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import {
  ClassificationService
} from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import {
  CommonService
} from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import {
  ProductorigintypeService
} from 'src/app/modules/masters-mpc/shared/services/ProductOriginType/productorigintype.service';
import {
  brandsFilter
} from 'src/app/modules/masters/brand/shared/filters/brands-Filters';
import {
  BrandsService
} from 'src/app/modules/masters/brand/shared/services/brands.service';
import {
  CoinxCompanyFilter
} from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import {
  CoinsService
} from 'src/app/modules/masters/coin/shared/service/coins.service';
import {
  StatusProduct
} from 'src/app/modules/products/shared/Utils/status-product';
import { ExcellSalesReport } from '../../../shared/services/reports/viewmodels/excellreportsales';

@Component({
  selector: 'app-salesreport-filter',
  templateUrl: './salesreport-filter.component.html',
  styleUrls: ['./salesreport-filter.component.scss']
})
export class SalesreportFilterComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: SalesReportFilter;
  @Input("loading") loading: boolean = false;
  @Input("listreport") listreport: SalesReport[];
  @Output("onSearch") onSearch = new EventEmitter <SalesReportFilter> ();
  @Output() changes = new EventEmitter();
  iDate: Date = new Date();
  fDate: Date = new Date();
  nDate: Date = new Date();
  mDate: Date = new Date();
  displayedColumns: ColumnD <SalesReport> [] = [
    // { template: (data) => { return data.product.barcode; }, field: 'product.barcode', header: 'Barra', display: 'table-cell' },
    // { template: (data) => { return data.packingType.name; }, field: 'packingType.name', header: 'Tipo de empaque', display: 'table-cell' },
    // { template: (data) => { return data.packingPresentation.name; }, field: 'packingPresentation.name', header: 'Empaque', display: 'table-cell' },
    // { template: (data) => { return data.units; }, field: 'units', header: 'Unidades', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.available, '.2'); }, field: 'available', header: 'Disponible', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.totalUnits, '.2'); }, field: 'totalUnits', header: 'Total unidades', display: 'table-cell' },
    // { template: (data) => { return data.product.status.name; }, field: 'product.status.name', header: 'Estatus', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.baseCost, '.4'); }, field: 'baseCost', header: 'Costo base', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.4'); }, field: 'conversionCost', header: 'Costo conversión', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.netFactor, '.2'); }, field: 'netFactor', header: 'Factor neto', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.baseNetCost, '.4'); }, field: 'baseNetCost', header: 'Costo neto base', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.conversionNetCost, '.4'); }, field: 'conversionNetCost', header: 'Costo neto conversión', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.netSalesFactor, '.2'); }, field: 'netSalesFactor', header: 'Factor neto venta', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.netSellingCostBase, '.4'); }, field: 'netSellingCostBase', header: 'Costo neto venta base', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.netSellingCostConversion, '.4'); }, field: 'netSellingCostConversion', header: 'Costo neto venta conversión', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.sellingFactor, '.2'); }, field: 'sellingFactor', header: 'Factor venta', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.basePVP, '.2'); }, field: 'basePVP', header: 'PVP', display: 'table-cell' },
    // { template: (data) => { return this.decimalPipe.transform(data.conversionPVP, '.2'); }, field: 'conversionPVP', header: 'PVP conversión', display: 'table-cell' },

  ];

  colstable: any[] = [
    ["Producto", "Categoría", "Ref. interna", "Clasificación", "Estructura", "Barra", "Tipo de empaque", "Empaque", "Estatus",
      "Costo neto base", "Costo neto conversión", "Costo base", "Costo neto venta base", "Costo neto venta conversión", "PVP base", "Factor neto",
      "Factor venta", "PVP conversión"
    ]
  ];
  categorylist: any[];
  origintypelist: SelectItem[];
  classificationlist: SelectItem[];
  producttypelist: SelectItem[];
  structuretypelist: SelectItem[];
  statuslist: SelectItem[];
  brandslist: SelectItem[];
  cont: number = 0;
  heavylist: SelectItem[] = [{
      label: 'Todos',
      value: "-1"
    },
    {
      label: 'No pesados',
      value: "0"
    },
    {
      label: 'Pesados',
      value: "1"
    },
  ];
  list: SelectItem[] = [{
      label: 'Todos',
      value: "-1"
    },
    {
      label: 'Activo',
      value: "1"
    },
    {
      label: 'Inactivo',
      value: "0"
    },
  ];
  existencelist: SelectItem[] = [{
      label: 'Todos',
      value: "-1"
    },
    {
      label: 'Con existencia',
      value: "1"
    },
    {
      label: 'Sin existencia',
      value: "0"
    },

  ];
  datelist: SelectItem[] = [{
      label: 'Últimos 2 meses',
      value: '1'
    },
    {
      label: 'Últimos 3 meses',
      value:'2'
    },
    {
      label: 'Últimos 4 meses',
      value:'3'
    },
    {
      label: 'Últimos 6 meses',
      value: '4'
    },
  ];

  cols: any[] = [{
    field: 'name',
    header: 'Nombre'
  }, ];
  selectedCategories: any[] = [];
  brandsselected: any[] = [];
  categoriesString: string;
  basesymbolcoin: string = "";
  conversionsymbolcoin: string = "";
  dnormal: boolean = false;
  dpersonalize: boolean = true;

  constructor(public _categoryservice: CategoryService,
    private _origintypeservice: ProductorigintypeService,
    private _classificationservice: ClassificationService,
    private _commonservice: CommonService,
    private _brandservice: BrandsService,
    public datepipe: DatePipe,
    private readonly authService: AuthService,
    private decimalPipe: DecimalPipe,
    private coinsService: CoinsService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.onLoadCategorys();
    this.onLoadOriginTypes();
    this.onLoadClassification();
    this.onLoadProductTypes();
    this.onLoadStructureTypes();
    this.onLoadBrandsList();
    this.onLoadStatusList();
    this.searchCoinsxCompany();
    this.filters.iDate.setDate(this.filters.iDate.getDate() - 7);

  }

  active(e) 
  {
    if (e == true) {
      this.filters.personalize = true
      this.dnormal = true;
      this.dpersonalize = false;
    } else {
      this.filters.personalize = false
      this.dnormal = false;
      this.dpersonalize = true;
    }
  }
  search() {
    if (this.filters.personalize == true) {
      let dates = new Date();
      if (this.filters.datePersonalize == 1) {
        dates.setDate(dates.getDate() - 60)
        this.filters.iDate = dates
      } else if (this.filters.datePersonalize == 2) {
        dates.setDate(dates.getDate() - 90)
        this.filters.iDate = dates
      } else if (this.filters.datePersonalize == 3) {
        dates.setDate(dates.getDate() - 120)
        this.filters.iDate = dates
      } else {
        dates.setDate(dates.getDate() - 180)
        this.filters.iDate = dates
      }
      this.filters.fDate = new Date();

    }
    this.filters.initDate = this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate = this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
    this.onSearch.emit(this.filters);

  }

  ValidateChecksBrands() {
    this.filters.brandId = "";
    if (this.brandsselected.length > 0) {
      for (let i = 0; i < this.brandsselected.length; i++) {
        this.filters.brandId = this.filters.brandId == "" ? this.brandsselected[i] : this.filters.brandId + "," + this.brandsselected[i];
      }
    }
  }

  onBlurMethod(event: any) {
    let dates = new Date(event);
    if (dates > this.fDate) {
      this.filters.fDate = dates;
      dates.setDate(dates.getDate() + 30)
      this.nDate = dates
      this.changes.emit(this.filters.fDate);
    } else {
      let diasdif = this.filters.fDate.getTime() - dates.getTime();
      var contdias = Math.round(diasdif / (1000 * 60 * 60 * 24));
      if (contdias > 30) {
        dates.setDate(dates.getDate() + 30)
        this.filters.fDate = dates;
        this.nDate = dates
      }
    }
  }
  clearFilters() {
    this.filters.idBranchOffice = this.authService.currentOffice
    this.filters.productId = -1;
    this.filters.barcode = "";
    this.filters.name = "";
    this.filters.statusId = -1;
    this.filters.categoryId = "";
    this.filters.internalRef = "";
    this.filters.productTypeId = -1;
    this.filters.structureTypeId = -1;
    this.filters.originTypeId = -1;
    this.filters.classificationId = -1;
    this.filters.indHeavy = -1;
    this.filters.indActiveBuy = -1;
    this.filters.indActiveSale = -1;
    this.filters.indConsignment = -1;
    this.filters.indOnline = -1;
    this.filters.existence = -1;
    this.categoriesString = "";
    this.selectedCategories = [];
    this.brandsselected = [];
    this.filters.brandId = "";
    this.filters.iDate = new Date();
    this.filters.fDate = new Date();
    this.filters.iDate.setDate(this.filters.iDate.getDate() - 7);
    this.filters.initDate = this.datepipe.transform(this.filters.iDate, "yyyyMMdd");
    this.filters.finalDate = this.datepipe.transform(this.filters.fDate, "yyyyMMdd");
  }

  onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    this._categoryservice.gettreeCategory(filter)
      .subscribe((data: Category[]) => {
        this._categoryservice._categoryList = data;
        if (this.filters.categoryId.toString() != "") {
          var categories = this.filters.categoryId.toString().split(",");
          this.categoriesString = "";
          for (let i = 0; i < categories.length; i++) {
            this.searchcategoryselected(data, parseInt(categories[i]))
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  onLoadOriginTypes() {
    var filter: ProductorigintypeFilter = new ProductorigintypeFilter()
    filter.active = 1;
    this._origintypeservice.getProductorigintypebyfilter(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.origintypelist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadClassification() {
    var filter: ClassificationFilter = new ClassificationFilter()
    filter.active = 1;
    this._classificationservice.getClassificationbyfilter(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.classificationlist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadProductTypes() {
    var filter: ProducttypeFilter = new ProducttypeFilter()
    filter.active = 1;
    this._commonservice.getProductTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.producttypelist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadStructureTypes() {
    var filter: StructuretypeFilter = new StructuretypeFilter();
    filter.active = 1;
    this._commonservice.getStructureTypes(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.structuretypelist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadBrandsList() {
    var filter: brandsFilter = new brandsFilter()
    filter.active = 1;
    this._brandservice.getBrandsList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.brandslist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
        if (this.filters.brandId.toString() != "") {
          var brands = this.filters.brandId.toString().split(",");
          for (let i = 0; i < brands.length; i++) {
            this.brandsselected.push(parseInt(brands[i]));
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  onLoadStatusList() {
    var filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 1;
    this._commonservice.getStatus(filter)
      .subscribe((data) => {
        data = data.filter(x => x.id != StatusProduct.Canceled)
        this.statuslist = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
  ValidateCheckeds(control, category: Category): void {
    this.categoriesString = "";
    this.filters.categoryId = "";
    let cont = 0;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if (this.selectedCategories[i].expanded != true && this.selectedCategories[i].children.length == 0) {
        cont += 1;
        this.categoriesString = this.categoriesString == "" ? this.selectedCategories[i].data.name : cont >= 5 ? cont + " categorías seleccionadas" : this.categoriesString + ", " + this.selectedCategories[i].data.name;
        this.filters.categoryId = this.filters.categoryId == "" ? this.selectedCategories[i].data.id : this.filters.categoryId + "," + this.selectedCategories[i].data.id;
      }
    }
  }

  searchcategoryselected(cateorys, id) {
    if (cateorys.filter(x => x.data.id == id).length > 0) {
      this.cont = this.cont + 1;
      var category = cateorys.find(x => x.data.id == id);
      this.selectedCategories.push(category);
      this.categoriesString = this.categoriesString == "" ? category.data.name : this.cont >= 5 ? this.cont + " categorías seleccionadas" : this.categoriesString + ", " + category.data.name;
    } else {
      cateorys.forEach(Category => {
        if (Category.children.length > 0) {
          this.searchcategoryselected(Category.children, id);
        }
      });
    }
  }

  exportExcel() {
    let datexport=this.datepipe.transform(new Date(),"dd-MM-yyyy");
    let reportexcell=<any>[];
    if(this.listreport.length>0)
    {
     for (let i = 0; i < this.listreport.length; i++)
     {     
      if(this.listreport[i].detail.length>0)
      { 
        for (let j = 0; j < this.listreport[i].detail.length; j++)
        {
          var item=new ExcellSalesReport()
          item.name=this.listreport[i].name;
          item.category=this.listreport[i].category;
          item.references=this.listreport[i].references;
          item.brand=this.listreport[i].brand;
          item.gtin=this.listreport[i].detail[j].gtin
          item.supplier=this.listreport[i].detail[j].supplier
          item.presentation=this.listreport[i].detail[j].presentation
          item.typePacket=this.listreport[i].detail[j].typePacket
          item.unitperpackagin=this.listreport[i].detail[j].unitperpackagin
          item.quantitySold=this.listreport[i].detail[j].quantitySold
          item.totalPVP=this.listreport[i].detail[j].totalPVP
          item.cost=this.listreport[i].detail[j].cost
          item.costbase=this.listreport[i].detail[j].costbase
          item.costConvertion=this.listreport[i].detail[j].costConvertion
          item.pvp=this.listreport[i].detail[j].pvp
          item.pvpConvertion=this.listreport[i].detail[j].pvpConvertion
          item.msv=this.listreport[i].detail[j].msv
          item.existences=this.listreport[i].detail[j].existences
          item.existencesUnds=this.listreport[i].detail[j].existencesUnds
          reportexcell.push(item)
        }

      }
      
    }

    var exports=reportexcell.map(items=>{  
       var itm = <any>{};
       itm['Nombre']=items.name;
       itm['Categoría']=items.category;
       itm['Referencia']=items.references;
       itm['Marca']=items.brand;
       itm['Barra']=items.gtin
       itm['Proveedor']=items.supplier
       itm['Presentación']=items.presentation
       itm['Tipo de empaque']=items.typePacket
       itm['Unds por empaque']=items.unitperpackagin
       itm['Cantidad vendida']=this.decimalPipe.transform(items.quantitySold,'.3')
       itm['Total PVP']=this.decimalPipe.transform(items.totalPVP,'.2')
       itm['Total Costo']=this.decimalPipe.transform(items.cost,'.4')+' '+this.basesymbolcoin
       itm['Costo base']=this.decimalPipe.transform(items.costbase,'.4')+' '+this.basesymbolcoin
       itm['Costo conversión']=this.decimalPipe.transform(items.costConvertion,'.4')+' '+this.conversionsymbolcoin
       itm['PVP']=this.decimalPipe.transform(items.pvp,'.2')+' '+this.basesymbolcoin
       itm['PVP conversión']=this.decimalPipe.transform(items.pvpConvertion,'.2')+' '+this.conversionsymbolcoin
       itm['MSV']=this.decimalPipe.transform(items.msv,'.2')
       itm['Existencia']=this.decimalPipe.transform(items.existences,'.3')
       itm['Existencia unds']=this.decimalPipe.transform(items.existencesUnds,'.3')
       return itm;
      })
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(exports);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "Reporte_de_ventas"+datexport);
      });
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authService.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
        } else {
          this.conversionsymbolcoin = coin.symbology;
        }
      });
    })
  }

}