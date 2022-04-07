import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApplicableTaxdedCost } from 'src/app/models/srm/common/applicable-taxded-cost';
import { DistributionTaxDeductible } from 'src/app/models/srm/common/distribution-tax-deductible';
import { Distributiontypes } from 'src/app/models/srm/common/distributiontypes';
import { DocumentType } from 'src/app/models/srm/common/document-type';
import { FormDelivery } from 'src/app/models/srm/common/form-delivery';
import { InstrumentTara } from 'src/app/models/srm/common/instrument-tara';
import { Taxabletype } from 'src/app/models/srm/common/taxabletype';
import { TransportClassification } from 'src/app/models/srm/common/transport-classification';
import { TransportType } from 'src/app/models/srm/common/transport-type';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { TypesDelivery } from 'src/app/models/srm/common/types-delivery';
import { TypesReception } from 'src/app/models/srm/common/types-reception';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../../filters/appconfig';
import { ApplicableTaxdedCostFilter } from '../../filters/common/applicable-taxded-cost-filter';
import { DistributionTaxDeductibleFilter } from '../../filters/common/distribution-tax-deductible-filter';
import { DistributiontypesFilter } from '../../filters/common/distributiontypes-filter';
import { DocumentTypeFilter } from '../../filters/common/document-type-filter';
import { FormDeliveryFilter } from '../../filters/common/form-delivery-filter';
import { InstrumentTaraFilter } from '../../filters/common/instrument-tara-filter';
import { TaxabletypeFilter } from '../../filters/common/taxabletypefilter';
import { TransportClassificationFilter } from '../../filters/common/transport-classification-filter';
import { TransportTypeFilter } from '../../filters/common/transport-type-filter';
import { TypeNegotiationFilter } from '../../filters/common/type-negotiation-filter';
import { TypesDeliveryFilter } from '../../filters/common/types-delivery-filter';
import { TypesReceptionFilter } from '../../filters/common/types-reception-filter';

@Injectable({
  providedIn: 'root'
})
export class CommonsrmService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getDistributiontypes(filters: DistributiontypesFilter = new DistributiontypesFilter) {
    return this._httpClient
    .get<Distributiontypes[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/DistributionTypes/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTypesDelivery(filters: TypesDeliveryFilter = new TypesDeliveryFilter) {
    return this._httpClient
    .get<TypesDelivery[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TypesDelivery/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

getFormDelivery(filters: FormDeliveryFilter = new FormDeliveryFilter) {
    return this._httpClient
    .get<FormDelivery[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/FormDelivery/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTypesReception(filters: TypesReceptionFilter = new TypesReceptionFilter) {
    return this._httpClient
    .get<TypesReception[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TypesReception/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransportClassification(filters: TransportClassificationFilter = new TransportClassificationFilter) {
    return this._httpClient
    .get<TransportClassification[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TransportClassification/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransportTypes(filters: TransportTypeFilter = new TransportTypeFilter) {
    return this._httpClient
    .get<TransportType[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TransportTypes/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getInstrumentTara(filters: InstrumentTaraFilter = new InstrumentTaraFilter) {
    return this._httpClient
    .get<InstrumentTara[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/InstrumentsxTara/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  gettypeNegotiation(filters: TypeNegotiationFilter = new TypeNegotiationFilter) {
    return this._httpClient
    .get<TypeNegotiation[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TypeNegotiation/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTaxableType(filters: TaxabletypeFilter = new TaxabletypeFilter) {
    return this._httpClient
    .get<Taxabletype[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/TaxableType/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  GetApplicableTaxableDeductibleCost(filters: ApplicableTaxdedCostFilter = new ApplicableTaxdedCostFilter) {
    return this._httpClient
    .get<ApplicableTaxdedCost[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/GetApplicableTaxableDeductibleCost/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  GetDistributionTaxableDeductible(filters: DistributionTaxDeductibleFilter = new DistributionTaxDeductibleFilter) {
    return this._httpClient
    .get<DistributionTaxDeductible[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/GetDistributionTaxableDeductible/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  async getDocumentTypes(filters: DocumentTypeFilter) {
    return this._httpClient.get<DocumentType[]>(`${environment.API_BASE_URL_SRM_MASTERS}/Common/GetDocumentTypes/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }
  //#region  dashboard recepcion
  config: AppConfig = {
    theme: 'saga-blue',
    dark: false,
    inputStyle: 'outlined',
    ripple: true
};

private configUpdate = new Subject<AppConfig>();

configUpdate$ = this.configUpdate.asObservable();

updateConfig(config: AppConfig) {
    this.config = config;
    this.configUpdate.next(config);
}

getConfig() {
    return this.config;
}
  //#endregion
}
