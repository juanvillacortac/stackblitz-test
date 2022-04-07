export class AnalyticFinancial {

  idIndicator: number = -1

  idFilterType: number = -1

  result: ResultAnalytics[] = [];

}

export class LabelAnalytics {

  labelName: string = ""

}

export class ResultAnalytics {


  colorHex: string = ""

  etiqueta: string = ""

  TotalValor: number = -1

  indicador: string = ""
  uRLImagen: string = ""
  comparacion: string = ""
  valorActual: number = -1
  meta: number = -1
  porcentaje: number = -1
  campoURL: string = ""
  campoID: string = ""
  valor: number = -1

  valores: DataAnalyticsDao = new DataAnalyticsDao();
  detallesValores:DataAnalyticsDao[] = [];
  detalle:  DetailAnalytics[] = [];

  labels: LabelAnalytics[] = [];

  valuesLabels: ValuesLabelAnalytics[] = [];

}
export class DetailAnalytics {

  colorHex: string = ""

  etiqueta: string = ""

  value: number = -1

}

export class DataAnalyticsDao {

  valor1: string = ""
  valor2: string = ""
  valor3: string = ""
  valor4: string = ""
  valor5: string = ""
  valor6: string = ""

}

export class ValuesLabelAnalytics {

  labels: string = ""

  value: string = ""

}

export class AnalyticFinancialFilter {

  idEmpresa: number = 1

  idSucursal: number = 1

  indicators: IndicatorAnalyticsFilter[] = [];

}

export class IndicatorsFMSxModulesFilter {

  idModule: number = 117

  idGroupCompany: number = 1

  idPrincipal: number = -1

  idUser: number = -1

  idSucursal: number = -1

  idCompany: number = -1



}

export class IndicatorAnalyticsFilter {

  idIndicator: number = -1;//37

  idFilterType: number = -1;//11

  parameters: object = null;

}




