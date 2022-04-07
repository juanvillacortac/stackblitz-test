import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactFilter } from 'src/app/models/masters/contact-filter';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { Supplier } from 'src/app/models/masters/supplier';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend, SupplierFinancialSetup } from 'src/app/models/masters/supplier-extend';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ClientSupplierExtendFilters } from '../filters/clientsupplierextend-filters';
import { InactiveUserSuppliers } from '../filters/inactiveuser-supplier';
import { SupplierFilter } from '../filters/supplier-filter';
import { SupplierextendFilter } from '../filters/supplierextend-filter';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  public _suppliersList: Supplier[];
  public _suppliersExtendList: SupplierExtend[];
  public _supplierContacList: ContactNumberSupplier[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

    getSupplierList(filters: SupplierFilter = new SupplierFilter()) {
      return this._httpClient
        .get<Supplier[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    getSupplierExtendList(filters: SupplierextendFilter = new SupplierextendFilter()) {
      return this._httpClient
        .get<SupplierExtend[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/GetClientSupplierExtend/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    getFMSSetupList() {
      return this._httpClient
        .get<SupplierFinancialSetup[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/fms`)
    }
    
    getFMSSetup(idClientSupplier: number) {
      return this._httpClient
        .get<SupplierFinancialSetup>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/${idClientSupplier}/fms`)
    }

    getSupplierWithDetail(filters: ClientSupplierExtendFilters = new ClientSupplierExtendFilters()) {
      return this._httpClient
        .get<SupplierExtend[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/SupplierWithDetail/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertUpdateSupplier(supplier :SupplierExtend) 
    {  
      debugger
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/`+id, supplier);
     
    }

    InactiveUserSupplier(idClientSupplier :number,userInactiveid:number,companyid:number) 
    {  
       let valor =new InactiveUserSuppliers();
       valor.idClientSupplier=idClientSupplier;
       valor.idCompany=companyid;
       valor.id=userInactiveid;
       const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/InactiveUser`+id,valor);
     
    }

    InactiveContactSupplier(idClientSupplier :number,companyid:number,contactid:number) 
    {  
       let valor =new InactiveUserSuppliers();
       valor.idClientSupplier=idClientSupplier;
       valor.idCompany=companyid;
       valor.id=contactid;
       const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/InactiveContact`+id,valor);
     
    }
    InactiveAddressSupplier(idClientSupplier :number,addresid:number) 
    {  
       let valor =new InactiveUserSuppliers();
       valor.idClientSupplier=idClientSupplier;
       valor.addresId=addresid;
       const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/InactiveAdress`+id,valor);
     
    }

    getContactSupplierList(filters: ContactFilter = new ContactFilter()) {
      return this._httpClient
        .get<ContactNumber[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Supplier/GetContactSupplier/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }
}
