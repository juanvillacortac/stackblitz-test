export class Address {
 id?: number;
 name?: string;
 code?: string;
 isActive?: boolean;
 idEntity: string;
 idAddressType: number;
 addressType?: string;
 idCity: number;
 city?: string;
 idDistrict: number;
 district?: string;
 idProvince: number;
 province?: string;
 idPlaceType: number;
 placeType?: string;
 idCountry?: number;
 country?: string;
 avenue: string;
 street: string;
 building: string;
 floor: string;
 apartment: string;
 reference?: string;
 latitude?: number;
 longitude?: number;

 constructor() {
  this.addressType = ''
  this.apartment = '';
  this.avenue = '';
  this.building = '';
  this.city = '';
  this.code = '';
  this.district = '';
  this.floor = '';
  this.id = -1;
  this.idAddressType = -1;
  this.idCity = -1;
  this.idDistrict = -1;
  this.idEntity = '';
  this.idPlaceType = -1;
  this.idProvince = -1;
  this.isActive = false;
  this.name = '';
  this.placeType = '';
  this.province = '';
  this.reference = '';
  this.street = '';
  this.latitude = -1;
  this.longitude = -1;
  this.country = '';
  this.idCountry = -1
 }
}
