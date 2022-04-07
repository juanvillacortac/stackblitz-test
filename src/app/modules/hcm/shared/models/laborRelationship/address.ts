
export class Address {

    idLaborRelationship: number = -1; 
    idAddress: number = -1;
    idEmployee: number = -1;
    idAddressType?: number;
    addressType?: string;
    idCity?: number;
    city?: string;
    idHousingType?: number;
    housingType?: string;
    housingNumber?: string;
    idParish?: number;
    parish?: string;
    idMunicipality?: number;
    municipality?: string;
    idState?: number;
    state?: string;
    idCountry?: number;
    country?: string;
    avenueName?: string;             
    streetName?: string;            
    buildingName?: string;          
    floor?: string;      
    apartment?: string;      
    references?: string;      
    postalCode?: string;      
    latitude?: number;        
    longitude?: number;
}