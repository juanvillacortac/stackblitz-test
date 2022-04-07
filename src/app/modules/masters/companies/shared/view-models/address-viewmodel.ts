export class AddressViewmodel {
    id: number;
    idCountry: number;
    country: string;
    idState: number;
    state: string;
    idCity: number;
    city: string;
    idMunicipality: number;
    municipality: string;
    buildingName: string;
    floor: string;
    street: string;
    postalCode: string;
    idType: number;
    type: string;
    reference: string;
    

    get fullAddress(){
        return `${this.street}, ${this.city}, ${this.municipality},
        ${this.state}, ${this.country}`;
    }
}
