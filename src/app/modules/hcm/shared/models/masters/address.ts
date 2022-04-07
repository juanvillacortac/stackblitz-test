export class Address {
    id: number;
    idAddressType: number = 0;
    idHousingType: number = 0;
    idCity: number = 0;
    idMunicipality: number = 0;
    idState: number = 0;
    idCountry: number = 0;
    addressType: string;
    housingType: string;
    city: string;
    municipality: string;
    state: string;
    country: string;
    avenue: string;
    street: string;
    edifice: string;
    floor: string;
    apartament: string;    
    references: string;
    postalCode: string;
    latitude: number;
    length: number;
}